/**
 * Redacto — PII detection. Pure, deterministic pattern matching over extracted
 * text; runs entirely client-side. High-precision structured identifiers
 * (Luhn-validated card numbers, SSN/EIN shapes, email, phone, IP) so the
 * auto-suggestions a reviewer sees are trustworthy rather than noisy.
 */

export type PiiType = "email" | "ssn" | "ein" | "card" | "phone" | "ip" | "date";

export type Match = {
  type: PiiType;
  label: string;
  value: string;
  start: number;
  end: number;
};

export const PII_LABEL: Record<PiiType, string> = {
  email: "Email",
  ssn: "SSN",
  ein: "EIN",
  card: "Card number",
  phone: "Phone",
  ip: "IP address",
  date: "Date",
};

/** Luhn checksum — gates card-number candidates so we don't redact any 16
 *  digits that merely look like a card. */
export function luhnValid(candidate: string): boolean {
  const d = candidate.replace(/\D/g, "");
  if (d.length < 13 || d.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = d.charCodeAt(i) - 48;
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

const PATTERNS: { type: PiiType; re: RegExp; validate?: (m: string) => boolean }[] = [
  { type: "email", re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g },
  { type: "ssn", re: /\b\d{3}-\d{2}-\d{4}\b/g },
  { type: "ein", re: /\b\d{2}-\d{7}\b/g },
  { type: "card", re: /\b\d(?:[ -]?\d){12,18}\b/g, validate: luhnValid },
  { type: "phone", re: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g },
  { type: "ip", re: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g },
  { type: "date", re: /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g },
];

/** Find all PII matches in a text blob, de-overlapped (earliest, then longest
 *  wins) so a card number isn't also flagged as three phone fragments. */
export function detectPII(text: string): Match[] {
  const raw: Match[] = [];
  for (const { type, re, validate } of PATTERNS) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const value = m[0];
      if (validate && !validate(value)) continue;
      raw.push({ type, label: PII_LABEL[type], value, start: m.index, end: m.index + value.length });
    }
  }
  raw.sort((a, b) => a.start - b.start || b.value.length - a.value.length);
  const out: Match[] = [];
  let lastEnd = -1;
  for (const m of raw) {
    if (m.start >= lastEnd) {
      out.push(m);
      lastEnd = m.end;
    }
  }
  return out;
}

export function summarize(matches: Match[]): { type: PiiType; label: string; count: number }[] {
  const counts = new Map<PiiType, number>();
  for (const m of matches) counts.set(m.type, (counts.get(m.type) ?? 0) + 1);
  return [...counts.entries()].map(([type, count]) => ({ type, label: PII_LABEL[type], count }));
}
