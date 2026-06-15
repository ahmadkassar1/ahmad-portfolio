"use client";

import type { Field } from "@/lib/lab/forge-schema";

const inputCls =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/15 disabled:bg-zinc-50";

/**
 * Renders one field as a real control. `interactive=false` is the builder's
 * static preview (no focus, no state); `interactive=true` is the live form,
 * driven by value/onChange with inline validation errors.
 */
export function FieldRender({
  field,
  value,
  onChange,
  error,
  interactive = true,
}: {
  field: Field;
  value?: string | boolean;
  onChange?: (v: string | boolean) => void;
  error?: string;
  interactive?: boolean;
}) {
  if (field.type === "heading") {
    return (
      <h3 className="border-b border-zinc-200 pb-2 pt-2 text-base font-semibold tracking-tight text-zinc-900">
        {field.label}
      </h3>
    );
  }

  const labelId = `${field.id}-label`;
  const common = {
    id: field.id,
    name: field.name || field.id,
    disabled: !interactive,
    "aria-labelledby": labelId,
    "aria-invalid": !!error,
  };

  const control = (() => {
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            {...common}
            rows={3}
            placeholder={field.placeholder}
            value={(value as string) ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
            className={`${inputCls} resize-y`}
          />
        );
      case "select":
        return (
          <select
            {...common}
            value={(value as string) ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
            className={inputCls}
          >
            <option value="">Select…</option>
            {(field.options ?? []).map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div role="radiogroup" aria-labelledby={labelId} className="mt-1 space-y-1.5">
            {(field.options ?? []).map((o) => (
              <label key={o} className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="radio"
                  name={field.name || field.id}
                  value={o}
                  disabled={!interactive}
                  checked={value === o}
                  onChange={() => onChange?.(o)}
                  className="h-4 w-4 accent-amber-700"
                />
                {o}
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <label className="flex items-center gap-2.5 text-sm text-zinc-700">
            <input
              type="checkbox"
              {...common}
              checked={!!value}
              onChange={(e) => onChange?.(e.target.checked)}
              className="h-4 w-4 accent-amber-700"
            />
            {field.label}
          </label>
        );
      default:
        return (
          <input
            {...common}
            type={field.type === "number" ? "number" : field.type === "email" ? "email" : field.type === "date" ? "date" : "text"}
            placeholder={field.placeholder}
            value={(value as string) ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
            className={inputCls}
          />
        );
    }
  })();

  // Checkbox shows its label inline (above), so skip the stacked label.
  const showStackedLabel = field.type !== "checkbox";

  return (
    <div>
      {showStackedLabel && (
        <label id={labelId} htmlFor={field.id} className="mb-1.5 block text-sm font-medium text-zinc-800">
          {field.label}
          {field.required && <span className="ml-0.5 text-amber-700">*</span>}
        </label>
      )}
      {control}
      {field.help && !error && <p className="mt-1 text-xs text-zinc-500">{field.help}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
