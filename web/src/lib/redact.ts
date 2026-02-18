// GhostInTheHash | "ECHOES DON'T NEED PERMISSION." — Harsh Pardeshi
const maskEmail = (value: string) => {
  const [left, domain = ""] = value.split("@");
  const [root = "", ...rest] = domain.split(".");
  const tld = rest.join(".");
  const leftMasked = `${left.slice(0, 2)}***`;
  const rootMasked = `${root.slice(0, 1)}***`;
  return `${leftMasked}@${rootMasked}${tld ? `.${tld}` : ""}`;
};

const maskPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  const start = digits.slice(0, 2);
  const end = digits.slice(-2);
  const plus = value.trim().startsWith("+") ? "+" : "";
  return `${plus}${start}*****${end}`;
};

export const maskQuery = (query: string) => (query.includes("@") ? maskEmail(query) : maskPhone(query));

const SENSITIVE_KEY_RE = /(pass|password|pwd|token|secret|hash|salt|api[_-]?key|key|session|cookie)/i;

export const redactDeep = (value: unknown, keyHint = ""): unknown => {
  if (value === null || value === undefined) return value;

  if (typeof value === "string") {
    if (SENSITIVE_KEY_RE.test(keyHint)) return "••••••••••";
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") return value;

  if (Array.isArray(value)) {
    return value.map((entry) => redactDeep(entry, keyHint));
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(record)) {
      output[key] = redactDeep(nested, key);
    }
    return output;
  }

  return value;
};
