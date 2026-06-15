/**
 * The Lab — self-contained builds that live as code-split routes inside the
 * portfolio (so both the live demo and the public repo link work with no
 * external deploy). Single source of truth for the gallery page and the
 * in-world Lab panel.
 */
export type LabProject = {
  slug: string;
  name: string;
  /** Long line for the gallery cards. */
  tagline: string;
  /** Short line for the compact in-world panel. */
  blurb: string;
  tags: string[];
  status: "live" | "building";
  /** Identity color for the project (used sparingly — chips, initials). */
  accent: string;
};

export const labProjects: LabProject[] = [
  {
    slug: "helm",
    name: "Helm",
    tagline:
      "Analytics console for a fictional email + webhooks API — KPIs, hand-built SVG charts, a command palette, and a live deliveries table.",
    blurb: "SaaS analytics dashboard — charts, command palette, live table.",
    tags: ["Dashboard", "Data viz", "⌘K"],
    status: "live",
    accent: "#5aa9a0",
  },
  {
    slug: "forge",
    name: "Forge",
    tagline:
      "Drag-and-drop form builder: compose fields on a canvas, edit properties, undo/redo, preview, and export a shareable schema.",
    blurb: "Drag-and-drop form builder — undo/redo, preview, shareable schema.",
    tags: ["Builder", "Drag & drop", "Schema"],
    status: "live",
    accent: "#c9a35c",
  },
  {
    slug: "fixtura",
    name: "Fixtura",
    tagline:
      "Deterministic mock-data studio — infer a schema from sample JSON, a TS interface, or SQL DDL, then generate realistic, relationally-consistent fixtures you can reproduce by seed and export to JSON/CSV/SQL.",
    blurb: "Deterministic mock-data studio — seedable, relational, multi-format export.",
    tags: ["Dev tool", "Generator", "Deterministic"],
    status: "live",
    accent: "#4f46e5",
  },
  {
    slug: "redacto",
    name: "Redacto",
    tagline:
      "Provably-local document redaction — auto-detect and truly burn out PII from a PDF or image, with nothing ever leaving your browser (the CSP is the proof).",
    blurb: "On-device PDF/image redaction — detect & truly remove PII, zero upload.",
    tags: ["Privacy", "PDF", "On-device"],
    status: "building",
    accent: "#b91c1c",
  },
  {
    slug: "margin-lab",
    name: "Margin Lab",
    tagline:
      "Pricing & margin modeler for product makers — turn costs and platform fees into defensible prices, break-even points, and side-by-side what-if scenarios.",
    blurb: "Pricing & margin modeler — solves the circular fee math, runs scenarios.",
    tags: ["Modeling", "Pricing", "Charts"],
    status: "live",
    accent: "#15803d",
  },
];
