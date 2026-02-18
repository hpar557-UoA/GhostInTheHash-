// GhostInTheHash | "THE DARK DOESN'T SLEEP — IT AUTOMATES." — Harsh Pardeshi
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s()\-]{7,20}$/;

export const isEmail = (input: string): boolean => EMAIL_RE.test(input.trim());

export const isPhone = (input: string): boolean => PHONE_RE.test(input.trim());

export const isValidQuery = (input: string): boolean => isEmail(input) || isPhone(input);
