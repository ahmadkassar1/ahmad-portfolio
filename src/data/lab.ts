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
    slug: "atelier",
    name: "Atelier",
    tagline:
      "Generative art studio — parametric compositions you can tune by hand, reseed, and export as a high-resolution image.",
    blurb: "Generative art studio — parametric, reseedable, exportable.",
    tags: ["Canvas", "Generative", "Export"],
    status: "building",
    accent: "#8a93b8",
  },
  {
    slug: "tempo",
    name: "Tempo",
    tagline:
      "A small, fast browser game with a real game loop, particle feedback, and a local leaderboard. Built to feel good to play.",
    blurb: "A fast browser game — game loop, juice, local leaderboard.",
    tags: ["Game", "Canvas", "Game loop"],
    status: "building",
    accent: "#7396ff",
  },
];
