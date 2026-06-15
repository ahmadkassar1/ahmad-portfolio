import { mulberry32 } from "@/lib/prng";
import { genValue } from "@/lib/lab/fixtura/generators";
import type { Schema } from "@/lib/lab/fixtura/schema";

export type Row = Record<string, unknown>;
export type GeneratedEntity = { id: string; name: string; rows: Row[] };

/** FNV-1a → uint32 so a string seed maps to a stable PRNG seed. */
function hashSeed(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Generate the full dataset deterministically from (schema + seed). One
 * shared PRNG stream drives every field of every row, so the same seed
 * reproduces byte-identical output. Two passes: scalars first, then
 * references — children sample real parent values, so foreign keys always
 * resolve (referential integrity).
 */
export function generateDataset(schema: Schema): GeneratedEntity[] {
  const rng = mulberry32(hashSeed(schema.seed));
  const out: GeneratedEntity[] = schema.entities.map((e) => ({ id: e.id, name: e.name, rows: [] }));
  const byId = new Map(out.map((e) => [e.id, e]));

  // Pass 1 — scalar fields.
  schema.entities.forEach((entity, ei) => {
    const target = out[ei];
    const count = Math.max(0, Math.min(entity.count || 0, 5000));
    for (let i = 0; i < count; i++) {
      const row: Row = {};
      for (const field of entity.fields) {
        if (field.kind !== "reference") row[field.name] = genValue(field, rng, i);
      }
      target.rows.push(row);
    }
  });

  // Pass 2 — references sample existing parent values.
  schema.entities.forEach((entity, ei) => {
    const target = out[ei];
    for (const field of entity.fields) {
      if (field.kind !== "reference") continue;
      const parent = field.refEntityId ? byId.get(field.refEntityId) : undefined;
      const key = field.refField || "id";
      if (!parent || parent.rows.length === 0) {
        for (const row of target.rows) row[field.name] = null;
        continue;
      }
      for (const row of target.rows) {
        const pick = parent.rows[Math.floor(rng() * parent.rows.length) % parent.rows.length];
        row[field.name] = pick[key] ?? Object.values(pick)[0] ?? null;
      }
    }
  });

  return out;
}
