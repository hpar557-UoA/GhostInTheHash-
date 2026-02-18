// GhostInTheHash | "SILENCE IS A PACKET TOO." — Harsh Pardeshi
import { delay } from "./delay";
import type { ReportPayload } from "./types";

const API_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "http://localhost:5050" : "");
const DEFAULT_DELAY = Number(import.meta.env.VITE_MIN_DELAY_MS ?? 5000);

export const fetchReport = async (query: string, minDelayMs = DEFAULT_DELAY): Promise<ReportPayload> => {
  if (!API_URL) {
    throw new Error("VITE_API_URL is not configured for this deployment.");
  }

  const request = fetch(`${API_URL}/api/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  }).then(async (response) => {
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message ?? "Failed to generate report");
    }
    return (await response.json()) as ReportPayload;
  });

  const [report] = await Promise.all([request, delay(minDelayMs)]);
  return report;
};
