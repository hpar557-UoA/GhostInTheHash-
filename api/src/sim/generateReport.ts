// GhostInTheHash | "SILENCE IS A PACKET TOO." — Harsh Pardeshi
import type { ReportField, ReportPayload, ReportSource } from "../types.js";
import { isEmail } from "../utils/validate.js";
import { maskQuery } from "../utils/maskLog.js";

const SOURCE_CATALOG = [
  { name: "WraithArchive Mirror", icon: "🗂️", summary: "Synthetic record fragments tied to leaked aliases and recycled handles." },
  { name: "SpecterAuth Cache", icon: "🔐", summary: "Illustrative authentication artifacts showing weak credential hygiene patterns." },
  { name: "PhantomCommerce Ledger", icon: "🧾", summary: "Demo billing metadata often correlated with account reset abuse." },
  { name: "NightRelay Node", icon: "🌐", summary: "Synthetic network traces revealing suspicious replay timing." },
  { name: "EclipseForum Dump", icon: "💬", summary: "Fabricated community dump entries used for credential stuffing tutorials." },
  { name: "ObsidianTicket Vault", icon: "🎟️", summary: "Mock support-system exports with identity verification weak points." },
  { name: "HexLab Telemetry", icon: "📡", summary: "Demonstration telemetry snapshots for behavior-based risk modeling." },
  { name: "GhoulCloud Backup", icon: "☁️", summary: "Fictional backup metadata showing stale secret retention." },
];

const LOCATIONS = ["synthetic://Sector-7", "demo://Harbor-Node", "synthetic://Ridge-42", "demo://Delta-Yard"];
const USERNAMES = ["demo.runner", "synthetic_user", "ghost.demo", "lab.synthetic", "crawler.demo"];

const hashString = (value: string): number => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const createRng = (seed: number) => {
  let state = seed || 1;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let output = Math.imul(state ^ (state >>> 15), 1 | state);
    output ^= output + Math.imul(output ^ (output >>> 7), 61 | output);
    return ((output ^ (output >>> 14)) >>> 0) / 4294967296;
  };
};

const pick = <T>(items: T[], rng: () => number): T => items[Math.floor(rng() * items.length)];

const shuffleDeterministic = <T>(items: T[], rng: () => number): T[] => {
  const output = [...items];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }
  return output;
};

const makeSyntheticHash = (rng: () => number): string => {
  const alphabet = "abcdef0123456789";
  let output = "";
  for (let i = 0; i < 40; i += 1) output += alphabet[Math.floor(rng() * alphabet.length)];
  return `synthetic_sha1_${output}`;
};

const makeEncryptedPassword = (rng: () => number): string => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let output = "";
  for (let i = 0; i < 44; i += 1) output += alphabet[Math.floor(rng() * alphabet.length)];
  return `demo_b64_${output}`;
};

const makeIp = (rng: () => number): string =>
  `10.${Math.floor(rng() * 255)}.${Math.floor(rng() * 255)}.${Math.floor(rng() * 255)}`;

const makeDob = (rng: () => number): string => {
  const year = 1980 + Math.floor(rng() * 22);
  const month = `${1 + Math.floor(rng() * 12)}`.padStart(2, "0");
  const day = `${1 + Math.floor(rng() * 28)}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildFields = (query: string, rng: () => number): ReportField[] => {
  const emailInput = isEmail(query);
  const reuseDetected = rng() > 0.45;
  const hasWeakLegacyHash = rng() > 0.55;

  const fields: ReportField[] = [
    {
      label: emailInput ? "Email" : "Telephone",
      value: query,
      monospace: true,
    },
    { label: "Username", value: pick(USERNAMES, rng) },
    { label: "Hash", value: makeSyntheticHash(rng), isSensitive: true, monospace: true },
    {
      label: "Encrypted Password",
      value: makeEncryptedPassword(rng),
      isSensitive: true,
      monospace: true,
    },
    { label: "Location", value: pick(LOCATIONS, rng) },
    { label: "IP", value: makeIp(rng), monospace: true },
    { label: "DOB", value: makeDob(rng) },
    {
      label: "Reuse Indicator",
      value: reuseDetected ? "synthetic_reuse_match:demo" : "synthetic_reuse_match:none",
      isSensitive: true,
      monospace: true,
    },
    {
      label: "Legacy Hash State",
      value: hasWeakLegacyHash ? "demo_legacy_hash_present" : "synthetic_modern_hash_only",
      isSensitive: true,
      monospace: true,
    },
    {
      label: "Reset Token",
      value: `synthetic_token_${Math.floor(rng() * 1_000_000).toString().padStart(6, "0")}`,
      isSensitive: true,
      monospace: true,
    },
  ];

  const fieldCount = 5 + Math.floor(rng() * 4);
  return fields.slice(0, fieldCount);
};

const buildChart = (baseRiskScore: number, rng: () => number): Array<{ t: string; risk: number }> => {
  return Array.from({ length: 10 }).map((_, index) => {
    const variance = Math.round((rng() - 0.5) * 14);
    const risk = Math.max(5, Math.min(100, baseRiskScore + variance));
    return { t: `T-${9 - index}`, risk };
  });
};

const getReuseRisk = (score: number): "Low" | "Medium" | "High" => {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
};

export const generateReport = (query: string): ReportPayload => {
  const seed = hashString(query.toLowerCase());
  const rng = createRng(seed);

  const sourceCount = 4 + Math.floor(rng() * 4);
  const shuffled = shuffleDeterministic(SOURCE_CATALOG, rng);
  const selectedSources = shuffled.slice(0, sourceCount);

  const results: ReportSource[] = selectedSources.map((source) => ({
    sourceName: source.name,
    sourceIcon: source.icon,
    summary: source.summary,
    fields: buildFields(query, rng),
  }));

  const totalFields = results.reduce((sum, source) => sum + source.fields.length, 0);
  const sensitiveFields = results.reduce(
    (sum, source) => sum + source.fields.filter((field) => field.isSensitive).length,
    0
  );

  const reuseFlags = results.reduce(
    (sum, source) =>
      sum +
      source.fields.filter(
        (field) => field.label === "Reuse Indicator" && /synthetic_reuse_match:demo/i.test(field.value)
      ).length,
    0
  );

  const baseRiskScore = Math.max(0, Math.min(100, 18 + totalFields * 2 + sensitiveFields * 4 + reuseFlags * 6));
  const reuseRisk = getReuseRisk(baseRiskScore);

  const suggestedActions = [
    "Use a unique password for every account.",
    "Enable MFA on primary email and financial accounts.",
    "Rotate old credentials stored in browsers.",
    "Turn on account breach and login alerts.",
    "Use rate limiting and lockout controls for shared services.",
  ];

  const whatAttackersDoNext = [
    "Run automated credential stuffing across major services.",
    "Pivot from reused passwords to password reset abuse.",
    "Target inboxes first to intercept verification flows.",
    "Escalate to account takeover and resale of access.",
  ];

  return {
    query,
    generatedAt: new Date().toISOString(),
    disclaimer: "SIMULATED REPORT (legacy) — this generator is not used when external API mode is enabled.",
    maskedQuery: maskQuery(query),
    results,
    raw: {
      mode: "simulation",
      seed,
      stats: {
        totalFields,
        sensitiveFields,
        baseRiskScore,
        reuseRisk,
      },
      suggestedActions,
      whatAttackersDoNext,
      chart: buildChart(baseRiskScore, rng),
    },
  };
};
