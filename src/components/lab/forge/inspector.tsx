"use client";

import { FIELD_META, type Field } from "@/lib/lab/forge-schema";

const field =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/15";
const labelCls = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500";

/** Properties panel for the selected field. */
export function Inspector({
  selected,
  onUpdate,
  onDelete,
  onDuplicate,
}: {
  selected: Field | null;
  onUpdate: (patch: Partial<Field>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  if (!selected) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-zinc-400">Select a field to edit its properties.</p>
      </div>
    );
  }

  const meta = FIELD_META[selected.type];

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-200 px-5 py-4">
        <p className="text-xs uppercase tracking-wide text-zinc-400">{meta.label}</p>
        <p className="mt-0.5 font-mono text-xs text-zinc-500">#{selected.name || selected.id}</p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        <div>
          <label className={labelCls}>{selected.type === "heading" ? "Heading text" : "Label"}</label>
          <input
            className={field}
            value={selected.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
          />
        </div>

        {selected.type !== "heading" && (
          <div>
            <label className={labelCls}>Field key</label>
            <input
              className={`${field} font-mono`}
              value={selected.name ?? ""}
              onChange={(e) => onUpdate({ name: e.target.value.replace(/\s+/g, "_") })}
            />
          </div>
        )}

        {meta.hasPlaceholder && (
          <div>
            <label className={labelCls}>Placeholder</label>
            <input
              className={field}
              value={selected.placeholder ?? ""}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
            />
          </div>
        )}

        {meta.hasOptions && (
          <div>
            <label className={labelCls}>Options</label>
            <div className="space-y-2">
              {(selected.options ?? []).map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={field}
                    value={opt}
                    onChange={(e) => {
                      const options = [...(selected.options ?? [])];
                      options[i] = e.target.value;
                      onUpdate({ options });
                    }}
                  />
                  <button
                    type="button"
                    aria-label={`Remove option ${i + 1}`}
                    onClick={() => onUpdate({ options: (selected.options ?? []).filter((_, j) => j !== i) })}
                    className="shrink-0 rounded-lg border border-zinc-300 px-2.5 text-zinc-400 transition-colors hover:border-zinc-400 hover:text-zinc-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => onUpdate({ options: [...(selected.options ?? []), `Option ${(selected.options?.length ?? 0) + 1}`] })}
                className="text-sm font-medium text-amber-700 hover:text-amber-800"
              >
                + Add option
              </button>
            </div>
          </div>
        )}

        {selected.type !== "heading" && (
          <>
            <div>
              <label className={labelCls}>Help text</label>
              <input
                className={field}
                value={selected.help ?? ""}
                onChange={(e) => onUpdate({ help: e.target.value })}
                placeholder="Optional hint shown under the field"
              />
            </div>

            <label className="flex items-center gap-2.5 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={!!selected.required}
                onChange={(e) => onUpdate({ required: e.target.checked })}
                className="h-4 w-4 accent-amber-700"
              />
              Required
            </label>
          </>
        )}
      </div>

      <div className="flex gap-2 border-t border-zinc-200 p-4">
        <button
          type="button"
          onClick={onDuplicate}
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Duplicate
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
