// GhostInTheHash | "SHADOWS HAVE CHECKSUMS." — Harsh Pardeshi
import type { ReportPayload } from "./types";

const sanitizeForFilename = (value: string): string => value.replace(/[^a-zA-Z0-9_-]/g, "_");

const timestampForFilename = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}${pad(
    date.getMinutes()
  )}${pad(date.getSeconds())}`;
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
};

const nl = "\r\n";

export const downloadReportTxt = (report: ReportPayload) => {
  const sources = report.results.length;
  const fields = report.results.reduce((acc, r) => acc + r.fields.length, 0);
  const sensitiveFields = report.results.reduce((acc, r) => acc + r.fields.filter((f) => f.isSensitive).length, 0);

  const lines: string[] = [];
  lines.push("GHOSTINTHEHASH REPORT");
  lines.push(`Timestamp: ${new Date(report.generatedAt).toLocaleString()}`);
  lines.push(`Query (masked): ${report.maskedQuery}`);
  lines.push(`Disclaimer: ${report.disclaimer}`);
  lines.push(`Sources: ${sources} | Fields: ${fields} | Sensitive: ${sensitiveFields}`);
  lines.push("");

  for (const source of report.results) {
    lines.push(`=== SOURCE: ${source.sourceName} ===`);
    if (source.summary) lines.push(`Summary: ${source.summary}`);
    lines.push("Fields:");

    for (const field of source.fields) {
      const sensitiveMark = field.isSensitive ? " [SENSITIVE]" : "";
      lines.push(`- ${field.label}${sensitiveMark}: ${field.value}`);
    }

    lines.push("");
  }

  lines.push("—");
  lines.push("GhostInTheHash");
  lines.push("\"Trust is a log file.\" — Harsh Pardeshi");

  const text = lines.join(nl);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });

  const stamp = timestampForFilename(new Date(report.generatedAt || Date.now()));
  const filename = `GhostInTheHash_${sanitizeForFilename(report.maskedQuery)}_${stamp}.txt`;
  downloadBlob(blob, filename);
};
