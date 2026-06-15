"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_SCHEMA,
  GEN_META,
  GEN_ORDER,
  decodeSchema,
  encodeSchema,
  makeField,
  type Entity,
  type Field,
  type GenKind,
  type Schema,
} from "@/lib/lab/fixtura/schema";
import { generateDataset } from "@/lib/lab/fixtura/engine";
import { EXT, MIME, serialize, type Format } from "@/lib/lab/fixtura/export";
import { infer, type InferMode } from "@/lib/lab/fixtura/infer";

const input =
  "w-full rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15";
const btn =
  "inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50";
const primaryBtn =
  "inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700";

export default function FixturaPage() {
  const [schema, setSchema] = useState<Schema>(DEFAULT_SCHEMA);
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_SCHEMA.entities[0].id);
  const [importing, setImporting] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const idRef = useRef(1000);
  const uid = (p: string) => `${p}_${idRef.current++}`;

  // Deterministic dataset — recomputed from (schema + seed) on any change.
  const dataset = useMemo(() => generateDataset(schema), [schema]);
  const selected = schema.entities.find((e) => e.id === selectedId) ?? schema.entities[0];
  const selectedRows = dataset.find((d) => d.id === selected?.id)?.rows ?? [];

  // Load a shared schema from the URL hash.
  useEffect(() => {
    const m = window.location.hash.match(/s=([^&]+)/);
    if (m) {
      const loaded = decodeSchema(m[1]);
      if (loaded && loaded.entities[0]) {
        setSchema(loaded);
        setSelectedId(loaded.entities[0].id);
      }
    }
  }, []);

  const flash = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 2200);
  };

  // --- schema mutations ------------------------------------------------------
  const patchEntity = (id: string, patch: Partial<Entity>) =>
    setSchema((s) => ({ ...s, entities: s.entities.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
  const patchField = (eid: string, fid: string, patch: Partial<Field>) =>
    setSchema((s) => ({
      ...s,
      entities: s.entities.map((e) =>
        e.id === eid ? { ...e, fields: e.fields.map((f) => (f.id === fid ? { ...f, ...patch } : f)) } : e,
      ),
    }));
  const addField = (eid: string) =>
    setSchema((s) => ({
      ...s,
      entities: s.entities.map((e) =>
        e.id === eid ? { ...e, fields: [...e.fields, makeField("word", uid("f"), `field_${e.fields.length + 1}`)] } : e,
      ),
    }));
  const removeField = (eid: string, fid: string) =>
    patchEntity(eid, { fields: schema.entities.find((e) => e.id === eid)!.fields.filter((f) => f.id !== fid) });
  const addEntity = () => {
    const id = uid("e");
    setSchema((s) => ({
      ...s,
      entities: [
        ...s.entities,
        { id, name: `table_${s.entities.length + 1}`, count: 10, fields: [makeField("uuid", uid("f"), "id")] },
      ],
    }));
    setSelectedId(id);
  };
  const removeEntity = (id: string) =>
    setSchema((s) => {
      const entities = s.entities.filter((e) => e.id !== id);
      if (entities.length) setSelectedId(entities[0].id);
      return { ...s, entities: entities.length ? entities : s.entities };
    });

  // --- export / share --------------------------------------------------------
  const download = (format: Format) => {
    const text = serialize(format, dataset, dataset.find((d) => d.id === selected.id));
    const blob = new Blob([text], { type: MIME[format] });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${format === "json" ? schema.name : selected.name}.${EXT[format]}`;
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
    flash(`Exported ${format.toUpperCase()}`);
  };
  const copyJson = async () => {
    await navigator.clipboard.writeText(serialize("json", dataset));
    flash("Dataset JSON copied");
  };
  const share = async () => {
    const url = `${location.origin}${location.pathname}#s=${encodeSchema(schema)}`;
    history.replaceState(null, "", url);
    await navigator.clipboard.writeText(url);
    flash("Shareable link copied");
  };

  const otherEntities = schema.entities.filter((e) => e.id !== selected?.id);

  return (
    <div className="flex h-dvh flex-col bg-zinc-100 font-sans text-zinc-900 antialiased">
      {/* Topbar */}
      <header className="flex shrink-0 flex-wrap items-center gap-3 border-b border-zinc-200 bg-white px-4 py-2.5">
        <Link href="/lab" className="shrink-0 font-mono text-xs text-zinc-400 hover:text-zinc-900">
          ← Lab
        </Link>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-indigo-600 text-sm font-semibold text-white">
          ƒ
        </span>
        <input
          aria-label="Schema name"
          value={schema.name}
          onChange={(e) => setSchema((s) => ({ ...s, name: e.target.value }))}
          className="w-28 rounded-md px-2 py-1 text-sm font-medium outline-none hover:bg-zinc-50 focus:bg-zinc-50"
        />
        <label className="flex items-center gap-2 text-sm text-zinc-500">
          <span className="font-mono text-xs">seed</span>
          <input
            aria-label="Seed"
            value={schema.seed}
            onChange={(e) => setSchema((s) => ({ ...s, seed: e.target.value }))}
            className="w-32 rounded-md border border-zinc-300 px-2 py-1 font-mono text-xs outline-none focus:border-indigo-600"
          />
        </label>
        <div className="ml-auto flex items-center gap-1.5">
          <button className={btn} onClick={() => setImporting(true)}>
            Import schema
          </button>
          <button className={btn} onClick={copyJson}>
            Copy JSON
          </button>
          <div className="relative">
            <button className={btn} onClick={() => setExportOpen((o) => !o)} aria-expanded={exportOpen}>
              Export ▾
            </button>
            {exportOpen && (
              <div className="absolute right-0 z-30 mt-1 w-44 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
                {(["json", "csv", "ndjson", "sql"] as Format[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => download(f)}
                    className="block w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                  >
                    {f === "json" ? "JSON (all entities)" : `${f.toUpperCase()} (${selected?.name})`}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className={primaryBtn} onClick={share}>
            Share
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Schema editor */}
        <aside className="flex shrink-0 flex-col overflow-y-auto border-b border-zinc-200 bg-white lg:w-[22rem] lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">Entities</span>
            <button onClick={addEntity} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              + Entity
            </button>
          </div>

          {/* Entity tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-zinc-100 p-3">
            {schema.entities.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelectedId(e.id)}
                className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
                  e.id === selected?.id ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {e.name}
              </button>
            ))}
          </div>

          {selected && (
            <div className="flex-1 space-y-4 p-4">
              <div className="flex items-center gap-2">
                <input
                  aria-label="Entity name"
                  value={selected.name}
                  onChange={(e) => patchEntity(selected.id, { name: e.target.value.replace(/\s+/g, "_") })}
                  className={`${input} font-mono`}
                />
                <label className="flex shrink-0 items-center gap-1.5 text-xs text-zinc-500">
                  rows
                  <input
                    type="number"
                    min={0}
                    max={5000}
                    value={selected.count}
                    onChange={(e) => patchEntity(selected.id, { count: Math.max(0, Number(e.target.value)) })}
                    className="w-16 rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-indigo-600"
                  />
                </label>
                {schema.entities.length > 1 && (
                  <button
                    onClick={() => removeEntity(selected.id)}
                    aria-label="Delete entity"
                    className="shrink-0 rounded-md border border-zinc-300 px-2 py-1.5 text-zinc-400 hover:border-red-300 hover:text-red-600"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {selected.fields.map((f) => (
                  <FieldEditor
                    key={f.id}
                    field={f}
                    otherEntities={otherEntities}
                    schema={schema}
                    onChange={(patch) => patchField(selected.id, f.id, patch)}
                    onRemove={() => removeField(selected.id, f.id)}
                  />
                ))}
              </div>

              <button onClick={() => addField(selected.id)} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                + Field
              </button>
            </div>
          )}
        </aside>

        {/* Preview */}
        <main className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
          <div className="mb-3 flex items-center gap-2 text-sm text-zinc-500">
            <span className="font-medium text-zinc-700">{selected?.name}</span>
            <span className="text-zinc-400">·</span>
            <span>{selectedRows.length} rows</span>
            <span className="text-zinc-400">·</span>
            <span className="font-mono text-xs">deterministic from seed “{schema.seed}”</span>
          </div>

          <div className="overflow-auto rounded-xl border border-zinc-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-zinc-50">
                <tr className="border-b border-zinc-200">
                  {selected?.fields.map((f) => (
                    <th key={f.id} className="whitespace-nowrap px-3 py-2.5 align-bottom">
                      <span className="block font-medium text-zinc-700">{f.name}</span>
                      <span className="block font-mono text-[10px] font-normal uppercase tracking-wide text-indigo-500">
                        {f.kind === "reference" ? "ref" : f.kind}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedRows.slice(0, 100).map((row, i) => (
                  <tr key={i} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/60">
                    {selected?.fields.map((f) => {
                      const v = row[f.name];
                      return (
                        <td key={f.id} className="max-w-[22rem] truncate px-3 py-2 font-mono text-xs text-zinc-700">
                          {v === null ? <span className="text-zinc-300">null</span> : String(v)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedRows.length > 100 && (
            <p className="mt-2 text-xs text-zinc-400">Showing first 100 of {selectedRows.length} — export for the full set.</p>
          )}
        </main>
      </div>

      {importing && (
        <ImportModal
          onClose={() => setImporting(false)}
          onInferred={(name, fields) => {
            const id = uid("e");
            setSchema((s) => ({
              ...s,
              entities: [
                ...s.entities,
                { id, name, count: 10, fields: fields.map((f) => ({ ...f, id: uid("f") })) },
              ],
            }));
            setSelectedId(id);
            setImporting(false);
            flash(`Imported “${name}” (${fields.length} fields)`);
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function FieldEditor({
  field,
  otherEntities,
  schema,
  onChange,
  onRemove,
}: {
  field: Field;
  otherEntities: Entity[];
  schema: Schema;
  onChange: (patch: Partial<Field>) => void;
  onRemove: () => void;
}) {
  const meta = GEN_META[field.kind];
  const refTarget = schema.entities.find((e) => e.id === field.refEntityId);

  return (
    <div className="rounded-lg border border-zinc-200 p-2.5">
      <div className="flex items-center gap-2">
        <input
          aria-label="Field name"
          value={field.name}
          onChange={(e) => onChange({ name: e.target.value.replace(/\s+/g, "_") })}
          className={`${input} font-mono`}
        />
        <select
          aria-label="Field type"
          value={field.kind}
          onChange={(e) => {
            const kind = e.target.value as GenKind;
            const next = makeField(kind, field.id, field.name);
            onChange({ ...next });
          }}
          className={`${input} max-w-[44%]`}
        >
          {["id", "person", "business", "number", "datetime", "text", "web", "ref"].map((g) => (
            <optgroup key={g} label={g}>
              {GEN_ORDER.filter((k) => GEN_META[k].group === g).map((k) => (
                <option key={k} value={k}>
                  {GEN_META[k].label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <button
          onClick={onRemove}
          aria-label="Remove field"
          className="shrink-0 rounded-md px-1.5 text-zinc-300 hover:text-red-600"
        >
          ×
        </button>
      </div>

      {/* contextual options */}
      {meta.opts.includes("range") && (
        <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
          <span>min</span>
          <input type="number" value={field.min ?? 0} onChange={(e) => onChange({ min: Number(e.target.value) })} className="w-20 rounded border border-zinc-300 px-2 py-1 text-xs outline-none focus:border-indigo-600" />
          <span>max</span>
          <input type="number" value={field.max ?? 0} onChange={(e) => onChange({ max: Number(e.target.value) })} className="w-20 rounded border border-zinc-300 px-2 py-1 text-xs outline-none focus:border-indigo-600" />
          {meta.opts.includes("decimals") && (
            <>
              <span>dp</span>
              <input type="number" min={0} max={6} value={field.decimals ?? 2} onChange={(e) => onChange({ decimals: Number(e.target.value) })} className="w-14 rounded border border-zinc-300 px-2 py-1 text-xs outline-none focus:border-indigo-600" />
            </>
          )}
        </div>
      )}
      {meta.opts.includes("values") && (
        <input
          aria-label="Enum values (comma separated)"
          value={(field.values ?? []).join(", ")}
          onChange={(e) => onChange({ values: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })}
          placeholder="comma, separated, values"
          className={`${input} mt-2 text-xs`}
        />
      )}
      {field.kind === "reference" && (
        <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
          <span>→</span>
          <select
            value={field.refEntityId ?? ""}
            onChange={(e) => onChange({ refEntityId: e.target.value, refField: undefined })}
            className="flex-1 rounded border border-zinc-300 px-2 py-1 text-xs outline-none focus:border-indigo-600"
          >
            <option value="">entity…</option>
            {otherEntities.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
          {refTarget && (
            <select
              value={field.refField ?? "id"}
              onChange={(e) => onChange({ refField: e.target.value })}
              className="flex-1 rounded border border-zinc-300 px-2 py-1 font-mono text-xs outline-none focus:border-indigo-600"
            >
              {refTarget.fields
                .filter((f) => f.kind !== "reference")
                .map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name}
                  </option>
                ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
}

const SAMPLES: Record<InferMode, string> = {
  json: `{\n  "id": "8f14e45f",\n  "email": "ada@acme.io",\n  "amount": 49.0,\n  "status": "paid",\n  "created_at": "2024-06-12T09:30:00Z"\n}`,
  ts: `interface Invoice {\n  id: string;\n  customer: string;\n  total: number;\n  status: 'draft' | 'sent' | 'paid';\n  due_at: Date;\n}`,
  sql: `CREATE TABLE products (\n  id uuid PRIMARY KEY,\n  name varchar(120),\n  price numeric(10,2),\n  in_stock boolean,\n  created_at timestamp\n);`,
};

function ImportModal({
  onClose,
  onInferred,
}: {
  onClose: () => void;
  onInferred: (name: string, fields: { name: string; kind: GenKind; values?: string[] }[]) => void;
}) {
  const [mode, setMode] = useState<InferMode>("json");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const run = () => {
    const result = infer(mode, text || SAMPLES[mode]);
    if ("error" in result) setError(result.error);
    else onInferred(result.name, result.fields);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/40 p-4 py-[10vh] backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Import schema"
        className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Infer a schema</h2>
          <button onClick={onClose} aria-label="Close" className="text-zinc-400 hover:text-zinc-900">
            Esc
          </button>
        </div>
        <div className="mb-3 inline-flex rounded-lg border border-zinc-200 p-0.5">
          {(["json", "ts", "sql"] as InferMode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${mode === m ? "bg-zinc-900 text-white" : "text-zinc-500"}`}
            >
              {m === "json" ? "Sample JSON" : m === "ts" ? "TS interface" : "SQL DDL"}
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError(null);
          }}
          placeholder={SAMPLES[mode]}
          rows={9}
          className="w-full rounded-lg border border-zinc-300 bg-zinc-50 p-3 font-mono text-xs outline-none focus:border-indigo-600"
        />
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button className={btn} onClick={() => setText(SAMPLES[mode])}>
            Use example
          </button>
          <button className={primaryBtn} onClick={run}>
            Infer fields
          </button>
        </div>
      </div>
    </div>
  );
}
