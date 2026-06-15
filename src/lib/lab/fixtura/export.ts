import type { GeneratedEntity, Row } from "@/lib/lab/fixtura/engine";

export type Format = "json" | "csv" | "ndjson" | "sql";

function cell(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

/** RFC-4180-ish CSV escaping. */
function csvField(v: unknown): string {
  const s = cell(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function rowsToCsv(rows: Row[]): string {
  if (rows.length === 0) return "";
  const cols = Object.keys(rows[0]);
  const head = cols.map(csvField).join(",");
  const body = rows.map((r) => cols.map((c) => csvField(r[c])).join(",")).join("\n");
  return `${head}\n${body}`;
}

function rowsToNdjson(rows: Row[]): string {
  return rows.map((r) => JSON.stringify(r)).join("\n");
}

function sqlValue(v: unknown): string {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
  return `'${String(v).replace(/'/g, "''")}'`;
}

function rowsToSql(table: string, rows: Row[]): string {
  if (rows.length === 0) return `-- ${table}: no rows`;
  const cols = Object.keys(rows[0]);
  const colList = cols.map((c) => `"${c}"`).join(", ");
  return rows
    .map((r) => `INSERT INTO "${table}" (${colList}) VALUES (${cols.map((c) => sqlValue(r[c])).join(", ")});`)
    .join("\n");
}

/** JSON exports the whole dataset; tabular formats serialize a single entity. */
export function serialize(format: Format, dataset: GeneratedEntity[], entity?: GeneratedEntity): string {
  if (format === "json") {
    return JSON.stringify(
      Object.fromEntries(dataset.map((e) => [e.name, e.rows])),
      null,
      2,
    );
  }
  const e = entity ?? dataset[0];
  if (!e) return "";
  if (format === "csv") return rowsToCsv(e.rows);
  if (format === "ndjson") return rowsToNdjson(e.rows);
  return rowsToSql(e.name, e.rows);
}

export const MIME: Record<Format, string> = {
  json: "application/json",
  csv: "text/csv",
  ndjson: "application/x-ndjson",
  sql: "text/plain",
};

export const EXT: Record<Format, string> = { json: "json", csv: "csv", ndjson: "ndjson", sql: "sql" };
