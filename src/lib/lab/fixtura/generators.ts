import type { Field, GenKind } from "@/lib/lab/fixtura/schema";

/** Small bundled word banks — enough variety for realistic rows, zero fetch. */
const FIRST = [
  "Ada", "Noah", "Mara", "Leo", "Ines", "Omar", "Yuki", "Tariq", "Lena", "Sven",
  "Priya", "Diego", "Nour", "Kai", "Elin", "Hugo", "Aisha", "Theo", "Maya", "Cyrus",
  "Freya", "Idris", "Sora", "Bruno", "Lucia", "Amir",
];
const LAST = [
  "Lovelace", "Okafor", "Reyes", "Novak", "Haddad", "Tanaka", "Costa", "Bauer", "Singh",
  "Moreau", "Rossi", "Ahmed", "Larsen", "Mendez", "Khan", "Silva", "Weber", "Park",
  "Ferreira", "Nilsson", "Mwangi", "Vargas",
];
const COMPANIES = [
  "Northwind", "Lumen", "Meridian", "Harbor", "Acme", "Formwork", "Parcel", "Cobalt",
  "Beacon", "Ledger", "Sundry", "Quay", "Atlas", "Verge", "Halcyon", "Tessera",
];
const CITIES = [
  "Lisbon", "Beirut", "Austin", "Tallinn", "Nairobi", "Osaka", "Porto", "Medellín",
  "Helsinki", "Lyon", "Cape Town", "Vienna", "Bristol", "Gdańsk", "Da Nang", "Quito",
];
const COUNTRIES = [
  "Portugal", "Lebanon", "United States", "Estonia", "Kenya", "Japan", "Colombia",
  "Finland", "France", "South Africa", "Austria", "United Kingdom", "Poland", "Vietnam",
];
const TITLES = [
  "Software Engineer", "Staff Engineer", "Product Designer", "Founder", "Data Analyst",
  "Engineering Manager", "Support Lead", "Operations Manager", "Marketing Lead", "QA Engineer",
];
const STREETS = ["Oak", "Maple", "Harbor", "Sterling", "Quay", "Birch", "Vine", "Castle", "Market", "Linden"];
const WORDS = [
  "ledger", "harbor", "signal", "cobalt", "atlas", "vector", "ember", "quartz", "drift",
  "summit", "fathom", "lattice", "tidal", "ranger", "willow", "nimbus", "forge", "delta",
];
const TLDS = ["io", "com", "dev", "co", "app", "sh"];

const SENTENCE_LEN = [5, 9];
const PARA_SENT = [3, 5];

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}
function intIn(rng: () => number, min: number, max: number): number {
  return Math.floor(min + rng() * (max - min + 1));
}
function pad(n: number, w = 2): string {
  return n.toString().padStart(w, "0");
}
function hex(rng: () => number, len: number): string {
  let s = "";
  for (let i = 0; i < len; i++) s += Math.floor(rng() * 16).toString(16);
  return s;
}

// Fixed epoch window (no Date.now → deterministic & SSR-safe): ~2 years to mid-2024.
const DATE_BASE = Date.UTC(2022, 5, 1);
const DATE_SPAN = 1000 * 60 * 60 * 24 * 760;

function words(rng: () => number, n: number): string {
  return Array.from({ length: n }, () => pick(rng, WORDS)).join(" ");
}
function sentence(rng: () => number): string {
  const w = words(rng, intIn(rng, SENTENCE_LEN[0], SENTENCE_LEN[1]));
  return w.charAt(0).toUpperCase() + w.slice(1) + ".";
}

/** Generate a single value for a (non-reference) field. `index` powers
 *  auto-increment; `rng` is the shared seeded stream. */
export function genValue(field: Field, rng: () => number, index: number): unknown {
  if (field.nullPct && rng() * 100 < field.nullPct) return null;

  const kind: GenKind = field.kind;
  switch (kind) {
    case "uuid":
      return `${hex(rng, 8)}-${hex(rng, 4)}-4${hex(rng, 3)}-${hex(rng, 4)}-${hex(rng, 12)}`;
    case "increment":
      return (field.min ?? 1) + index;
    case "firstName":
      return pick(rng, FIRST);
    case "lastName":
      return pick(rng, LAST);
    case "fullName":
      return `${pick(rng, FIRST)} ${pick(rng, LAST)}`;
    case "email": {
      const f = pick(rng, FIRST).toLowerCase();
      const l = pick(rng, LAST).toLowerCase();
      const sep = pick(rng, [".", "_", ""]);
      return `${f}${sep}${l}@${pick(rng, COMPANIES).toLowerCase()}.${pick(rng, TLDS)}`;
    }
    case "username":
      return `${pick(rng, FIRST).toLowerCase()}_${pick(rng, LAST).toLowerCase().slice(0, 4)}`;
    case "phone":
      return `+1 ${intIn(rng, 200, 989)} ${pad(intIn(rng, 200, 999), 3)} ${pad(intIn(rng, 0, 9999), 4)}`;
    case "company":
      return pick(rng, COMPANIES);
    case "jobTitle":
      return pick(rng, TITLES);
    case "city":
      return pick(rng, CITIES);
    case "country":
      return pick(rng, COUNTRIES);
    case "street":
      return `${intIn(rng, 1, 240)} ${pick(rng, STREETS)} St`;
    case "int": {
      // Defensive: a clipboard-shared schema or a cleared input can deliver
      // NaN / undefined here; never propagate NaN into a row.
      const lo = Number.isFinite(field.min) ? (field.min as number) : 0;
      const hi = Number.isFinite(field.max) ? (field.max as number) : 1000;
      return intIn(rng, Math.min(lo, hi), Math.max(lo, hi));
    }
    case "float":
    case "money": {
      const lo = Number.isFinite(field.min) ? (field.min as number) : 0;
      const hi = Number.isFinite(field.max) ? (field.max as number) : kind === "money" ? 500 : 100;
      const min = Math.min(lo, hi);
      const max = Math.max(lo, hi);
      // toFixed throws RangeError outside 0–100; clamp to a sane 0–6.
      const dp = Math.min(6, Math.max(0, Number.isFinite(field.decimals) ? Math.trunc(field.decimals as number) : 2));
      const v = min + rng() * (max - min);
      return Number(v.toFixed(dp));
    }
    case "bool":
      return rng() < 0.5;
    case "date":
      return new Date(DATE_BASE + rng() * DATE_SPAN).toISOString().slice(0, 10);
    case "datetime":
      return new Date(DATE_BASE + rng() * DATE_SPAN).toISOString().replace(/\.\d+Z$/, "Z");
    case "enum":
      return field.values && field.values.length ? pick(rng, field.values) : null;
    case "word":
      return pick(rng, WORDS);
    case "sentence":
      return sentence(rng);
    case "paragraph":
      return Array.from({ length: intIn(rng, PARA_SENT[0], PARA_SENT[1]) }, () => sentence(rng)).join(" ");
    case "url":
      return `https://${pick(rng, COMPANIES).toLowerCase()}.${pick(rng, TLDS)}/${pick(rng, WORDS)}`;
    case "domain":
      return `${pick(rng, COMPANIES).toLowerCase()}.${pick(rng, TLDS)}`;
    case "color":
      return `#${hex(rng, 6)}`;
    case "ipv4":
      return `${intIn(rng, 10, 250)}.${intIn(rng, 0, 255)}.${intIn(rng, 0, 255)}.${intIn(rng, 1, 254)}`;
    case "reference":
      return null; // resolved in a second pass by the engine
  }
}
