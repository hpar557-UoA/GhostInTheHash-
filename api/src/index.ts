// GhostInTheHash | "TRUST IS A LOG FILE." — Harsh Pardeshi
import "dotenv/config";
import cors from "cors";
import express from "express";
import type { ReportField, ReportPayload, ReportSource } from "./types.js";
import { createRateLimit } from "./utils/rateLimit.js";
import { maskQuery } from "./utils/maskLog.js";
import { isValidQuery } from "./utils/validate.js";

const app = express();
const port = Number(process.env.PORT ?? 5050);

const max = Number(process.env.RATE_LIMIT_MAX ?? 30);
const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 600000);
const leakOsintUrl = process.env.LEAKOSINT_API_URL ?? "https://leakosintapi.com/";
const leakOsintToken = process.env.LEAKOSINT_TOKEN ?? "";
const leakOsintLimit = Number(process.env.LEAKOSINT_LIMIT ?? 100);
const leakOsintLang = process.env.LEAKOSINT_LANG ?? "en";

const corsOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin: string): boolean => {
  if (!origin) return true;
  if (corsOrigins.includes("*")) return true;
  if (corsOrigins.includes(origin)) return true;

  let parsed: URL | null = null;
  try {
    parsed = new URL(origin);
  } catch {
    parsed = null;
  }

  for (const rule of corsOrigins) {
    if (!rule.includes("*")) continue;

    // Supported wildcard formats:
    // - *.example.com
    // - https://*.example.com
    const hasProtocol = rule.includes("://");
    const protocolPrefix = hasProtocol ? rule.slice(0, rule.indexOf("://") + 3) : "";
    const hostPattern = hasProtocol ? rule.slice(protocolPrefix.length) : rule;

    if (!hostPattern.startsWith("*.") || hostPattern.length <= 2) continue;
    if (protocolPrefix && origin.startsWith(protocolPrefix) === false) continue;
    if (!parsed) continue;

    const suffix = hostPattern.slice(1); // ".example.com"
    if (parsed.hostname.endsWith(suffix)) return true;
  }

  return false;
};

type LeakOsintEntry = {
  InfoLeak?: string;
  Data?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};

type LeakOsintResponse = {
  List?: Record<string, LeakOsintEntry>;
  [key: string]: unknown;
};

const toText = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null || value === undefined) return "";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const hasSensitiveLabel = (label: string): boolean => /pass|password|hash|token|secret|phone|email/i.test(label);

const hasMonospaceLabel = (label: string): boolean => /hash|token|ip|mail|email|phone|id|login|password/i.test(label);

const flattenValue = (
  label: string,
  value: unknown,
  path: string[] = []
): Array<{ label: string; value: string }> => {
  if (value === null || value === undefined) return [];

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    const suffix = path.length ? ` (${path.join(".")})` : "";
    return [{ label: `${label}${suffix}`, value: String(value) }];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => flattenValue(label, entry, [...path, String(index)]));
  }

  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, nested]) =>
      flattenValue(label, nested, [...path, key])
    );
  }

  return [{ label, value: toText(value) }];
};

const toReportPayload = (query: string, raw: LeakOsintResponse): ReportPayload => {
  const list = raw.List ?? {};
  const results: ReportSource[] = Object.entries(list).map(([sourceName, entry]) => {
    const fields: ReportField[] = [];
    const rows = Array.isArray(entry.Data) ? entry.Data : [];

    rows.forEach((row, rowIndex) => {
      Object.entries(row).forEach(([label, value]) => {
        const flattened = flattenValue(rows.length > 1 ? `#${rowIndex + 1} ${label}` : label, value);
        flattened.forEach((item) => {
          if (!item.value) return;
          fields.push({
            label: item.label,
            value: item.value,
            isSensitive: hasSensitiveLabel(item.label),
            monospace: hasMonospaceLabel(item.label),
          });
        });
      });
    });

    if (!fields.length) {
      Object.entries(entry)
        .filter(([key]) => key !== "Data")
        .forEach(([label, value]) => {
          const flattened = flattenValue(label, value);
          flattened.forEach((item) => {
            if (!item.value) return;
            fields.push({
              label: item.label,
              value: item.value,
              isSensitive: hasSensitiveLabel(item.label),
              monospace: hasMonospaceLabel(item.label),
            });
          });
        });
    }

    if (!fields.length) {
      fields.push({ label: "Status", value: "No structured fields returned by upstream source." });
    }

    return {
      sourceName,
      sourceIcon: "🛰️",
      summary: entry.InfoLeak ?? "External API source result",
      fields,
    };
  });

  const safeResults = results.length
    ? results
    : [
        {
          sourceName: "No results found",
          sourceIcon: "ℹ️",
          summary: "The provider returned no matching records for this query.",
          fields: [{ label: "Query", value: query, monospace: true }],
        },
      ];

  return {
    query,
    generatedAt: new Date().toISOString(),
    disclaimer: "EXTERNAL API REPORT — data provided by configured upstream API.",
    maskedQuery: maskQuery(query),
    results: safeResults,
    raw,
  };
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());
app.use(createRateLimit(max, windowMs));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, mode: leakOsintToken ? "external-api" : "not-configured" });
});

app.post("/api/report", async (req, res) => {
  const query = String(req.body?.query ?? "").trim();

  if (!isValidQuery(query)) {
    res.status(400).json({ message: "Query must be a valid email or phone." });
    return;
  }

  if (!leakOsintToken) {
    res.status(500).json({
      message: "LEAKOSINT_TOKEN is not configured on server",
    });
    return;
  }

  try {
    const upstreamResponse = await fetch(leakOsintUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: leakOsintToken,
        request: query,
        limit: leakOsintLimit,
        lang: leakOsintLang,
        type: "json",
      }),
    });

    if (!upstreamResponse.ok) {
      const body = await upstreamResponse.text();
      res.status(502).json({
        message: "Upstream API request failed",
        status: upstreamResponse.status,
        details: body.slice(0, 500),
      });
      return;
    }

    const raw = (await upstreamResponse.json()) as LeakOsintResponse;
    if (typeof raw["Error code"] === "string") {
      res.status(502).json({ message: `Upstream API error: ${raw["Error code"]}` });
      return;
    }

    const report = toReportPayload(query, raw);
    console.info(`[EXTERNAL API] report generated for ${maskQuery(query)}`);
    res.json(report);
  } catch (error) {
    res.status(502).json({
      message: "Failed to reach upstream API",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(port, () => {
  console.log(`GhostInTheHash API listening on http://localhost:${port}`);
});
