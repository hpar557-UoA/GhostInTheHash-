// GhostInTheHash | "THE WIRE REMEMBERS." — Harsh Pardeshi
export type ReportField = {
  label: string;
  value: string;
  isSensitive?: boolean;
  monospace?: boolean;
};

export type ReportSource = {
  sourceName: string;
  sourceIcon?: string;
  summary: string;
  fields: ReportField[];
};

export type ReportPayload = {
  query: string;
  generatedAt: string;
  disclaimer: string;
  maskedQuery: string;
  results: ReportSource[];
  raw?: unknown;
};
