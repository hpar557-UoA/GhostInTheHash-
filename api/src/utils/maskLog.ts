// GhostInTheHash | "EVERY TRACE TELLS A STORY." — Harsh Pardeshi
import { isEmail } from "./validate.js";

const maskEmail = (value: string): string => {
  const [left, domain = ""] = value.split("@");
  const domainParts = domain.split(".");
  const root = domainParts[0] || "";
  const tld = domainParts.slice(1).join(".");

  const leftMasked = left.length <= 2 ? `${left[0] ?? "*"}***` : `${left.slice(0, 2)}***`;
  const rootMasked = root.length <= 1 ? `${root[0] ?? "*"}***` : `${root[0]}***`;

  return `${leftMasked}@${rootMasked}${tld ? `.${tld}` : ""}`;
};

const maskPhone = (value: string): string => {
  const normalized = value.replace(/\s+/g, "");
  const digits = normalized.replace(/\D/g, "");
  if (!digits) return "***";

  const prefix = normalized.startsWith("+") ? "+" : "";
  const start = digits.slice(0, 2);
  const end = digits.slice(-2);
  return `${prefix}${start}*****${end}`;
};

export const maskQuery = (query: string): string => (isEmail(query) ? maskEmail(query) : maskPhone(query));
