/**
 * Fixtura — schema model for the deterministic mock-data studio. A schema is
 * a small JSON document (entities → fields → generators) plus a seed. Given
 * the same schema + seed, generation is byte-identical (the wedge for stable
 * snapshot tests). Everything is client-side; nothing leaves the browser.
 */

export type GenKind =
  | "uuid"
  | "increment"
  | "firstName"
  | "lastName"
  | "fullName"
  | "email"
  | "username"
  | "phone"
  | "company"
  | "jobTitle"
  | "city"
  | "country"
  | "street"
  | "int"
  | "float"
  | "money"
  | "bool"
  | "date"
  | "datetime"
  | "enum"
  | "word"
  | "sentence"
  | "paragraph"
  | "url"
  | "domain"
  | "color"
  | "ipv4"
  | "reference";

export type Field = {
  id: string;
  name: string;
  kind: GenKind;
  min?: number;
  max?: number;
  decimals?: number;
  values?: string[]; // enum
  nullPct?: number; // 0..100 chance of null
  refEntityId?: string; // reference
  refField?: string;
};

export type Entity = { id: string; name: string; count: number; fields: Field[] };
export type Schema = { name: string; seed: string; entities: Entity[] };

export type GenGroup = "id" | "person" | "business" | "number" | "datetime" | "text" | "web" | "ref";

export const GEN_META: Record<
  GenKind,
  { label: string; group: GenGroup; sample: string; opts: ("range" | "decimals" | "values")[] }
> = {
  uuid: { label: "UUID", group: "id", sample: "8f14e45f…", opts: [] },
  increment: { label: "Auto-increment", group: "id", sample: "1, 2, 3…", opts: ["range"] },
  firstName: { label: "First name", group: "person", sample: "Ada", opts: [] },
  lastName: { label: "Last name", group: "person", sample: "Lovelace", opts: [] },
  fullName: { label: "Full name", group: "person", sample: "Ada Lovelace", opts: [] },
  email: { label: "Email", group: "person", sample: "ada@acme.io", opts: [] },
  username: { label: "Username", group: "person", sample: "ada_l", opts: [] },
  phone: { label: "Phone", group: "person", sample: "+1 415 …", opts: [] },
  company: { label: "Company", group: "business", sample: "Northwind", opts: [] },
  jobTitle: { label: "Job title", group: "business", sample: "Staff Engineer", opts: [] },
  city: { label: "City", group: "business", sample: "Lisbon", opts: [] },
  country: { label: "Country", group: "business", sample: "Portugal", opts: [] },
  street: { label: "Street address", group: "business", sample: "12 Oak St", opts: [] },
  int: { label: "Integer", group: "number", sample: "42", opts: ["range"] },
  float: { label: "Decimal", group: "number", sample: "3.14", opts: ["range", "decimals"] },
  money: { label: "Money", group: "number", sample: "49.00", opts: ["range", "decimals"] },
  bool: { label: "Boolean", group: "number", sample: "true", opts: [] },
  date: { label: "Date", group: "datetime", sample: "2024-06-12", opts: [] },
  datetime: { label: "Date-time (ISO)", group: "datetime", sample: "2024-06-12T09:…", opts: [] },
  enum: { label: "Enum / pick one", group: "text", sample: "active", opts: ["values"] },
  word: { label: "Word", group: "text", sample: "ledger", opts: [] },
  sentence: { label: "Sentence", group: "text", sample: "A short line.", opts: [] },
  paragraph: { label: "Paragraph", group: "text", sample: "Lorem…", opts: [] },
  url: { label: "URL", group: "web", sample: "https://…", opts: [] },
  domain: { label: "Domain", group: "web", sample: "acme.io", opts: [] },
  color: { label: "Hex color", group: "web", sample: "#4f46e5", opts: [] },
  ipv4: { label: "IPv4", group: "web", sample: "10.0.0.1", opts: [] },
  reference: { label: "Reference →", group: "ref", sample: "(foreign key)", opts: [] },
};

export const GEN_ORDER: GenKind[] = [
  "uuid", "increment", "fullName", "firstName", "lastName", "email", "username", "phone",
  "company", "jobTitle", "city", "country", "street",
  "int", "float", "money", "bool",
  "date", "datetime", "enum",
  "word", "sentence", "paragraph",
  "url", "domain", "color", "ipv4",
  "reference",
];

export function makeField(kind: GenKind, id: string, name?: string): Field {
  const f: Field = { id, name: name ?? GEN_META[kind].label.toLowerCase().replace(/[^a-z]+/g, "_"), kind };
  if (kind === "int") {
    f.min = 0;
    f.max = 1000;
  }
  if (kind === "float" || kind === "money") {
    f.min = 0;
    f.max = kind === "money" ? 500 : 100;
    f.decimals = 2;
  }
  if (kind === "enum") f.values = ["active", "pending", "archived"];
  return f;
}

/** A real two-entity starter: users, and orders that reference them. */
export const DEFAULT_SCHEMA: Schema = {
  name: "store",
  seed: "fixtura-01",
  entities: [
    {
      id: "e_users",
      name: "users",
      count: 8,
      fields: [
        { id: "u_id", name: "id", kind: "uuid" },
        { id: "u_name", name: "name", kind: "fullName" },
        { id: "u_email", name: "email", kind: "email" },
        { id: "u_country", name: "country", kind: "country" },
        { id: "u_plan", name: "plan", kind: "enum", values: ["free", "pro", "team"] },
        { id: "u_created", name: "created_at", kind: "datetime" },
      ],
    },
    {
      id: "e_orders",
      name: "orders",
      count: 14,
      fields: [
        { id: "o_id", name: "id", kind: "uuid" },
        { id: "o_user", name: "user_id", kind: "reference", refEntityId: "e_users", refField: "id" },
        { id: "o_total", name: "total", kind: "money", min: 9, max: 480, decimals: 2 },
        { id: "o_status", name: "status", kind: "enum", values: ["paid", "refunded", "pending", "failed"] },
        { id: "o_created", name: "created_at", kind: "datetime" },
      ],
    },
  ],
};

export function encodeSchema(schema: Schema): string {
  return btoa(encodeURIComponent(JSON.stringify(schema)));
}

export function decodeSchema(s: string): Schema | null {
  try {
    const obj = JSON.parse(decodeURIComponent(atob(s)));
    if (obj && Array.isArray(obj.entities) && typeof obj.seed === "string") return obj as Schema;
  } catch {
    /* ignore */
  }
  return null;
}
