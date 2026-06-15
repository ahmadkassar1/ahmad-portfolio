/**
 * Forge — form schema model. A built form is a small JSON document; the
 * builder, the live preview, and the shareable URL all read from this one
 * shape. No runtime dependencies — encode/decode use the platform's base64.
 */

export type FieldType =
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "date"
  | "select"
  | "radio"
  | "checkbox"
  | "heading";

export type Field = {
  id: string;
  type: FieldType;
  label: string;
  /** Submission key. */
  name?: string;
  placeholder?: string;
  help?: string;
  required?: boolean;
  /** select / radio. */
  options?: string[];
};

export type FormSchema = { title: string; fields: Field[] };

export type FieldGroup = "input" | "choice" | "layout";

export const FIELD_META: Record<
  FieldType,
  { label: string; glyph: string; group: FieldGroup; hasPlaceholder: boolean; hasOptions: boolean }
> = {
  text: { label: "Short text", glyph: "T", group: "input", hasPlaceholder: true, hasOptions: false },
  email: { label: "Email", glyph: "@", group: "input", hasPlaceholder: true, hasOptions: false },
  number: { label: "Number", glyph: "#", group: "input", hasPlaceholder: true, hasOptions: false },
  textarea: { label: "Paragraph", glyph: "¶", group: "input", hasPlaceholder: true, hasOptions: false },
  date: { label: "Date", glyph: "◷", group: "input", hasPlaceholder: false, hasOptions: false },
  select: { label: "Dropdown", glyph: "▾", group: "choice", hasPlaceholder: false, hasOptions: true },
  radio: { label: "Single choice", glyph: "◉", group: "choice", hasPlaceholder: false, hasOptions: true },
  checkbox: { label: "Checkbox", glyph: "☑", group: "choice", hasPlaceholder: false, hasOptions: false },
  heading: { label: "Section heading", glyph: "H", group: "layout", hasPlaceholder: false, hasOptions: false },
};

export const PALETTE: { group: FieldGroup; label: string; types: FieldType[] }[] = [
  { group: "input", label: "Inputs", types: ["text", "email", "number", "textarea", "date"] },
  { group: "choice", label: "Choices", types: ["select", "radio", "checkbox"] },
  { group: "layout", label: "Layout", types: ["heading"] },
];

export function makeField(type: FieldType, id: string): Field {
  const meta = FIELD_META[type];
  const f: Field = { id, type, label: meta.label, name: id };
  if (meta.hasPlaceholder) f.placeholder = "";
  if (meta.hasOptions) f.options = ["Option one", "Option two", "Option three"];
  if (type === "heading") f.label = "Section heading";
  return f;
}

/** A real, specific starter form — never an empty canvas. */
export const DEFAULT_FORM: FormSchema = {
  title: "Request early access",
  fields: [
    { id: "f_intro", type: "heading", label: "Tell us about your team" },
    { id: "f_name", type: "text", label: "Full name", name: "name", placeholder: "Ada Lovelace", required: true },
    {
      id: "f_email",
      type: "email",
      label: "Work email",
      name: "email",
      placeholder: "you@company.com",
      required: true,
      help: "We’ll only use this to send your invite.",
    },
    {
      id: "f_size",
      type: "select",
      label: "Team size",
      name: "team_size",
      required: true,
      options: ["Just me", "2–10", "11–50", "51–200", "200+"],
    },
    {
      id: "f_use",
      type: "textarea",
      label: "What are you hoping to build?",
      name: "use_case",
      placeholder: "A sentence or two is plenty.",
    },
    { id: "f_updates", type: "checkbox", label: "Send me occasional product updates", name: "updates" },
  ],
};

/** URL-safe share encoding (client only; tolerant of bad input on decode). */
export function encodeSchema(schema: FormSchema): string {
  return btoa(encodeURIComponent(JSON.stringify(schema)));
}

export function decodeSchema(s: string): FormSchema | null {
  try {
    const obj = JSON.parse(decodeURIComponent(atob(s)));
    if (obj && typeof obj.title === "string" && Array.isArray(obj.fields)) {
      return obj as FormSchema;
    }
  } catch {
    /* fall through */
  }
  return null;
}
