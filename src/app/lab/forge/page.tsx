"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import Link from "next/link";
import { FieldRender } from "@/components/lab/forge/field-render";
import { Inspector } from "@/components/lab/forge/inspector";
import {
  DEFAULT_FORM,
  FIELD_META,
  PALETTE,
  decodeSchema,
  encodeSchema,
  makeField,
  type Field,
  type FieldType,
  type FormSchema,
} from "@/lib/lab/forge-schema";

type Present = { schema: FormSchema; selectedId: string | null };
type History = { past: Present[]; present: Present; future: Present[] };

type Action =
  | { t: "add"; field: Field; index?: number }
  | { t: "update"; patch: Partial<Field> }
  | { t: "title"; title: string }
  | { t: "select"; id: string | null }
  | { t: "delete" }
  | { t: "duplicate"; id: string }
  | { t: "move"; from: number; to: number }
  | { t: "load"; schema: FormSchema }
  | { t: "undo" }
  | { t: "redo" }
  | { t: "reset" };

const STRUCTURAL = new Set(["add", "delete", "duplicate", "move", "load", "reset"]);

function reducer(state: History, action: Action): History {
  // Undo/redo shuttle the present between the two stacks.
  if (action.t === "undo") {
    if (!state.past.length) return state;
    const prev = state.past[state.past.length - 1];
    return { past: state.past.slice(0, -1), present: prev, future: [state.present, ...state.future] };
  }
  if (action.t === "redo") {
    if (!state.future.length) return state;
    const next = state.future[0];
    return { past: [...state.past, state.present], present: next, future: state.future.slice(1) };
  }

  const { schema, selectedId } = state.present;
  let present = state.present;

  switch (action.t) {
    case "add": {
      const fields = [...schema.fields];
      const at = action.index ?? fields.length;
      fields.splice(at, 0, action.field);
      present = { schema: { ...schema, fields }, selectedId: action.field.id };
      break;
    }
    case "update":
      present = {
        ...state.present,
        schema: {
          ...schema,
          fields: schema.fields.map((f) => (f.id === selectedId ? { ...f, ...action.patch } : f)),
        },
      };
      break;
    case "title":
      present = { ...state.present, schema: { ...schema, title: action.title } };
      break;
    case "select":
      present = { ...state.present, selectedId: action.id };
      break;
    case "delete":
      present = {
        schema: { ...schema, fields: schema.fields.filter((f) => f.id !== selectedId) },
        selectedId: null,
      };
      break;
    case "duplicate": {
      const idx = schema.fields.findIndex((f) => f.id === selectedId);
      if (idx < 0) break;
      const copy: Field = { ...schema.fields[idx], id: action.id, name: action.id };
      const fields = [...schema.fields];
      fields.splice(idx + 1, 0, copy);
      present = { schema: { ...schema, fields }, selectedId: copy.id };
      break;
    }
    case "move": {
      const fields = [...schema.fields];
      const [m] = fields.splice(action.from, 1);
      fields.splice(action.to, 0, m);
      present = { ...state.present, schema: { ...schema, fields } };
      break;
    }
    case "load":
      present = { schema: action.schema, selectedId: null };
      break;
    case "reset":
      present = { schema: DEFAULT_FORM, selectedId: null };
      break;
  }

  // Structural edits are undoable; live text edits (update/title/select) are not,
  // so undo reverts whole fields rather than every keystroke.
  if (STRUCTURAL.has(action.t)) {
    return { past: [...state.past, state.present].slice(-50), present, future: [] };
  }
  return { ...state, present };
}

const init: History = { past: [], present: { schema: DEFAULT_FORM, selectedId: "f_name" }, future: [] };

const btn =
  "inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40";

export default function ForgePage() {
  const [state, dispatch] = useReducer(reducer, init);
  const { schema, selectedId } = state.present;
  const idRef = useRef(1000);
  const newId = () => `fld_${idRef.current++}`;
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [preview, setPreview] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const selected = schema.fields.find((f) => f.id === selectedId) ?? null;

  // Load a shared form from the URL hash on mount (#f=...).
  useEffect(() => {
    const m = window.location.hash.match(/f=([^&]+)/);
    if (m) {
      const loaded = decodeSchema(m[1]);
      if (loaded) dispatch({ t: "load", schema: loaded });
    }
  }, []);

  // Keyboard: ⌘Z / ⌘⇧Z for undo/redo.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        dispatch({ t: e.shiftKey ? "redo" : "undo" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const onDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOver(null);
    const addType = e.dataTransfer.getData("forge/add") as FieldType;
    const moveFrom = e.dataTransfer.getData("forge/move");
    if (addType) dispatch({ t: "add", field: makeField(addType, newId()), index });
    else if (moveFrom !== "") {
      const from = Number(moveFrom);
      const to = from < index ? index - 1 : index;
      if (from !== to) dispatch({ t: "move", from, to });
    }
  };

  const copyText = async (text: string, ok: string) => {
    try {
      if (!navigator.clipboard) throw new Error("unavailable");
      await navigator.clipboard.writeText(text);
      flash(ok);
    } catch {
      flash("Couldn’t copy automatically — select and copy manually");
    }
  };
  const copyJson = () => copyText(JSON.stringify(schema, null, 2), "Schema JSON copied to clipboard");
  const share = () => {
    const url = `${window.location.origin}${window.location.pathname}#f=${encodeSchema(schema)}`;
    window.history.replaceState(null, "", url);
    copyText(url, "Shareable link copied");
  };
  const download = () => {
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${schema.title.toLowerCase().replace(/\s+/g, "-") || "form"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-dvh flex-col bg-zinc-100 font-sans text-zinc-900 antialiased">
      {/* Topbar */}
      <header className="flex shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4 py-2.5">
        <Link href="/lab" className="shrink-0 font-mono text-xs text-zinc-400 hover:text-zinc-900">
          ← Lab
        </Link>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-amber-700 text-sm font-semibold text-white">
          F
        </span>
        <input
          aria-label="Form title"
          value={schema.title}
          onChange={(e) => dispatch({ t: "title", title: e.target.value })}
          className="min-w-0 flex-1 rounded-md px-2 py-1 text-sm font-medium outline-none hover:bg-zinc-50 focus:bg-zinc-50"
        />
        <div className="flex shrink-0 items-center gap-1.5">
          <button className={btn} onClick={() => dispatch({ t: "undo" })} disabled={!state.past.length} title="Undo (⌘Z)">
            ↶
          </button>
          <button className={btn} onClick={() => dispatch({ t: "redo" })} disabled={!state.future.length} title="Redo (⌘⇧Z)">
            ↷
          </button>
          <button className={btn} onClick={copyJson}>
            Copy JSON
          </button>
          <button className={btn} onClick={download}>
            Export
          </button>
          <button className={btn} onClick={share}>
            Share
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-800"
            onClick={() => setPreview(true)}
          >
            Preview
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Palette */}
        <aside className="shrink-0 overflow-y-auto border-b border-zinc-200 bg-white p-3 lg:w-56 lg:border-b-0 lg:border-r">
          <div className="flex gap-3 lg:block">
            {PALETTE.map((grp) => (
              <div key={grp.group} className="lg:mb-5">
                <p className="mb-2 hidden text-xs font-medium uppercase tracking-wide text-zinc-400 lg:block">
                  {grp.label}
                </p>
                <div className="flex gap-2 lg:flex-col">
                  {grp.types.map((type) => (
                    <button
                      key={type}
                      type="button"
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("forge/add", type)}
                      onClick={() => dispatch({ t: "add", field: makeField(type, newId()) })}
                      className="flex shrink-0 items-center gap-2.5 rounded-lg border border-zinc-200 px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:border-amber-700/40 hover:bg-amber-50/50"
                    >
                      <span className="grid h-6 w-6 place-items-center rounded bg-zinc-100 font-mono text-xs text-zinc-500">
                        {FIELD_META[type].glyph}
                      </span>
                      <span className="hidden lg:inline">{FIELD_META[type].label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Canvas */}
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto max-w-xl">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-1 text-xl font-semibold tracking-tight">{schema.title}</h2>
              <p className="mb-6 text-sm text-zinc-400">Click a field to edit it · drag the handle to reorder</p>

              {schema.fields.length === 0 && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDrop(e, 0)}
                  className="rounded-xl border-2 border-dashed border-zinc-200 py-16 text-center text-sm text-zinc-400"
                >
                  Add fields from the left to start building.
                </div>
              )}

              <div className="space-y-1">
                {schema.fields.map((f, i) => (
                  <div
                    key={f.id}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(i);
                    }}
                    onDrop={(e) => onDrop(e, i)}
                    className={dragOver === i ? "border-t-2 border-amber-700" : "border-t-2 border-transparent"}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => dispatch({ t: "select", id: f.id })}
                      onKeyDown={(e) => e.key === "Enter" && dispatch({ t: "select", id: f.id })}
                      className={`group relative cursor-pointer rounded-xl border p-4 transition-colors ${
                        selectedId === f.id
                          ? "border-amber-700/60 bg-amber-50/40 ring-1 ring-amber-700/20"
                          : "border-transparent hover:border-zinc-200 hover:bg-zinc-50/60"
                      }`}
                    >
                      <div className="pointer-events-none">
                        <FieldRender field={f} interactive={false} />
                      </div>

                      {/* Row controls */}
                      <div className="absolute right-2 top-2 flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          aria-label="Move up"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (i > 0) dispatch({ t: "move", from: i, to: i - 1 });
                          }}
                          disabled={i === 0}
                          className="grid h-6 w-6 place-items-center rounded text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          aria-label="Move down"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (i < schema.fields.length - 1) dispatch({ t: "move", from: i, to: i + 1 });
                          }}
                          disabled={i === schema.fields.length - 1}
                          className="grid h-6 w-6 place-items-center rounded text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 disabled:opacity-30"
                        >
                          ↓
                        </button>
                        <span
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData("forge/move", String(i))}
                          aria-hidden="true"
                          title="Drag to reorder"
                          className="grid h-6 w-6 cursor-grab place-items-center rounded text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 active:cursor-grabbing"
                        >
                          ⠿
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Tail drop zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(schema.fields.length);
                  }}
                  onDrop={(e) => onDrop(e, schema.fields.length)}
                  className={`h-6 rounded ${dragOver === schema.fields.length ? "border-t-2 border-amber-700" : ""}`}
                />
              </div>
            </div>
          </div>
        </main>

        {/* Inspector */}
        <aside className="shrink-0 overflow-y-auto border-t border-zinc-200 bg-white lg:w-80 lg:border-l lg:border-t-0">
          <Inspector
            selected={selected}
            onUpdate={(patch) => dispatch({ t: "update", patch })}
            onDelete={() => dispatch({ t: "delete" })}
            onDuplicate={() => dispatch({ t: "duplicate", id: newId() })}
          />
        </aside>
      </div>

      {preview && <PreviewModal schema={schema} onClose={() => setPreview(false)} />}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function validate(schema: FormSchema, values: Record<string, string | boolean>): Record<string, string> {
  const errs: Record<string, string> = {};
  for (const f of schema.fields) {
    if (f.type === "heading") continue;
    const v = values[f.id];
    if (f.required && (v === undefined || v === "" || v === false)) {
      errs[f.id] = "This field is required.";
    } else if (f.type === "email" && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(v))) {
      errs[f.id] = "Enter a valid email address.";
    }
  }
  return errs;
}

function PreviewModal({ schema, onClose }: { schema: FormSchema; onClose: () => void }) {
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, string | boolean> | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(schema, values);
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-zinc-900/40 p-4 py-[8vh] backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Form preview"
        className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-7 shadow-2xl sm:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">Live preview</span>
          <button onClick={onClose} aria-label="Close preview" className="text-zinc-400 hover:text-zinc-900">
            Esc
          </button>
        </div>

        {submitted ? (
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Submitted ✓</h2>
            <p className="mt-1 text-sm text-zinc-500">This is the payload the form would send:</p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-xs text-zinc-100">
              {JSON.stringify(
                Object.fromEntries(
                  schema.fields
                    .filter((f) => f.type !== "heading")
                    .map((f) => [f.name || f.id, submitted[f.id] ?? ""]),
                ),
                null,
                2,
              )}
            </pre>
            <button
              onClick={() => {
                setSubmitted(null);
                setValues({});
                setErrors({});
              }}
              className="mt-5 text-sm font-medium text-amber-700 hover:text-amber-800"
            >
              ← Fill it again
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5" noValidate>
            <h2 className="text-xl font-semibold tracking-tight">{schema.title}</h2>
            {schema.fields.map((f) => (
              <FieldRender
                key={f.id}
                field={f}
                value={values[f.id]}
                error={errors[f.id]}
                onChange={(v) => setValues((s) => ({ ...s, [f.id]: v }))}
              />
            ))}
            <button
              type="submit"
              className="w-full rounded-lg bg-amber-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-800"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
