import type { GenKind } from "@/lib/lab/fixtura/schema";

export type InferredField = { name: string; kind: GenKind; values?: string[] };
export type InferResult = { name: string; fields: InferredField[] } | { error: string };

/** Refine a generator choice from the field name (the strongest signal). */
function byName(name: string, fallback: GenKind): GenKind {
  const n = name.toLowerCase();
  if (/^id$|_id$|uuid|guid/.test(n)) return "uuid";
  if (/email/.test(n)) return "email";
  if (/first.?name/.test(n)) return "firstName";
  if (/last.?name|surname/.test(n)) return "lastName";
  if (/full.?name|^name$|customer|author|user(name)?/.test(n)) return n.includes("user") ? "username" : "fullName";
  if (/phone|mobile|tel/.test(n)) return "phone";
  if (/company|org|vendor|merchant/.test(n)) return "company";
  if (/title|role|position/.test(n)) return "jobTitle";
  if (/city|town/.test(n)) return "city";
  if (/country|nation/.test(n)) return "country";
  if (/street|address|addr/.test(n)) return "street";
  if (/price|amount|total|cost|revenue|salary|balance|fee/.test(n)) return "money";
  if (/url|link|href|website/.test(n)) return "url";
  if (/domain|host/.test(n)) return "domain";
  if (/colou?r/.test(n)) return "color";
  if (/ip(_?addr)?/.test(n)) return "ipv4";
  if (/status|state|type|kind|category|tier|plan/.test(n)) return "enum";
  if (/(_at$|date|created|updated|timestamp|time)/.test(n)) return "datetime";
  return fallback;
}

function fromJsonValue(name: string, v: unknown): InferredField {
  if (typeof v === "number") return { name, kind: byName(name, Number.isInteger(v) ? "int" : "float") };
  if (typeof v === "boolean") return { name, kind: "bool" };
  if (typeof v === "string") {
    if (/^\d{4}-\d{2}-\d{2}/.test(v)) return { name, kind: "datetime" };
    if (/^[\w.+-]+@[\w-]+\.\w+$/.test(v)) return { name, kind: "email" };
    return { name, kind: byName(name, "word") };
  }
  return { name, kind: byName(name, "word") };
}

function inferFromJson(text: string): InferResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { error: "That isn't valid JSON." };
  }
  const sample = Array.isArray(parsed) ? parsed[0] : parsed;
  if (!sample || typeof sample !== "object") return { error: "Expected a JSON object or an array of objects." };
  const fields = Object.entries(sample as Record<string, unknown>).map(([k, v]) => fromJsonValue(k, v));
  return { name: "record", fields };
}

function tsTypeToKind(name: string, t: string): InferredField {
  const type = t.trim();
  // string-literal union → enum
  const lits = type.match(/'([^']+)'|"([^"]+)"/g);
  if (lits && /\|/.test(type)) {
    return { name, kind: "enum", values: lits.map((l) => l.replace(/['"]/g, "")) };
  }
  if (/^number\b/.test(type)) return { name, kind: byName(name, "int") };
  if (/^boolean\b/.test(type)) return { name, kind: "bool" };
  if (/^Date\b/.test(type)) return { name, kind: "datetime" };
  return { name, kind: byName(name, "word") };
}

function inferFromTs(text: string): InferResult {
  const nameMatch = text.match(/(?:interface|type)\s+(\w+)/);
  const fields: InferredField[] = [];
  const re = /(\w+)\s*\??\s*:\s*([^;\n}]+)[;\n]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) fields.push(tsTypeToKind(m[1], m[2]));
  if (fields.length === 0) return { error: "Couldn't find any `field: type` lines." };
  return { name: (nameMatch?.[1] ?? "record").toLowerCase(), fields };
}

function sqlTypeToKind(name: string, t: string): InferredField {
  const type = t.toLowerCase();
  if (/uuid/.test(type)) return { name, kind: "uuid" };
  if (/serial|^int|bigint|smallint/.test(type)) return { name, kind: byName(name, "int") };
  if (/numeric|decimal|real|double|float/.test(type)) return { name, kind: byName(name, "money") };
  if (/bool/.test(type)) return { name, kind: "bool" };
  if (/timestamp|datetime/.test(type)) return { name, kind: "datetime" };
  if (/date/.test(type)) return { name, kind: "date" };
  return { name, kind: byName(name, "word") };
}

function inferFromSql(text: string): InferResult {
  const tableMatch = text.match(/create\s+table\s+(?:if\s+not\s+exists\s+)?["`]?(\w+)["`]?/i);
  const open = text.indexOf("(");
  const close = text.lastIndexOf(")");
  if (open < 0 || close < 0) return { error: "Couldn't find a CREATE TABLE (...) body." };
  const body = text.slice(open + 1, close);
  const fields: InferredField[] = [];
  for (const raw of body.split(/,(?![^(]*\))/)) {
    const line = raw.trim();
    if (!line || /^(primary|foreign|constraint|unique|key|check|index)\b/i.test(line)) continue;
    const m = line.match(/^["`]?(\w+)["`]?\s+(\w+)/);
    if (m) fields.push(sqlTypeToKind(m[1], m[2]));
  }
  if (fields.length === 0) return { error: "Couldn't parse any columns." };
  return { name: (tableMatch?.[1] ?? "record").toLowerCase(), fields };
}

export type InferMode = "json" | "ts" | "sql";

export function infer(mode: InferMode, text: string): InferResult {
  if (!text.trim()) return { error: "Paste something first." };
  if (mode === "json") return inferFromJson(text);
  if (mode === "ts") return inferFromTs(text);
  return inferFromSql(text);
}
