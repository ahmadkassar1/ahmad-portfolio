/**
 * The skills constellation — each technology is a living procedural
 * object orbiting the holo core. Shapes are symbolic (React's atom,
 * RxJS's stream knot, SQL's drum) and every claim in the panel copy is
 * real experience, no invented metrics. Colors are desaturated cousins
 * of the tech's identity hue, pulled toward the Cobalt Ledger palette.
 */
export type TechShape =
  | "atom" // React — electron rings around a nucleus
  | "shield" // Angular — octahedron
  | "ring" // Next.js — ring and disc
  | "block" // TypeScript — rounded cube
  | "waves" // Tailwind — twin slanted slats
  | "bolt" // Supabase — twin cones
  | "knot" // RxJS — torus knot, a stream tied in time
  | "crystal" // C/C++ — icosahedron
  | "drum" // SQL — stacked cylinders
  | "branch"; // Git — commit graph

export type Tech = {
  id: string;
  name: string;
  shape: TechShape;
  /** Emissive hue — desaturated to sit inside the world's palette. */
  color: string;
  /** Honest qualitative level — no invented numbers. */
  level: string;
  summary: string;
  usedAt: string[];
  /** Station ids (Project.vignette) this tech shipped in. */
  projectIds: string[];
  /** Orbit parameters around the holo core. */
  orbit: { radius: number; height: number; speed: number; phase: number };
};

export const techs: Tech[] = [
  {
    id: "typescript",
    name: "TypeScript",
    shape: "block",
    color: "#4d7cff",
    level: "Daily driver",
    summary:
      "The common language across everything — ERP modules at work, personal products at home. Strictness is the point: typed state machines and typed API layers are how dense UIs stay predictable.",
    usedAt: ["Horecons — TheBridge ERP", "Every personal product"],
    projectIds: ["pipeline", "qr-menu", "publishing", "storefront"],
    orbit: { radius: 2.5, height: 2.5, speed: 0.16, phase: 0.3 },
  },
  {
    id: "angular",
    name: "Angular",
    shape: "shield",
    color: "#c9786b",
    level: "Daily driver — the day job",
    summary:
      "Two ERP platforms of standalone components, signals, and guarded routing. The kind of Angular where a form has forty fields and the state still has to make sense.",
    usedAt: ["Horecons — TheBridge ERP"],
    projectIds: ["storefront", "qr-menu"],
    orbit: { radius: 3.1, height: 1.6, speed: 0.12, phase: 1.1 },
  },
  {
    id: "react",
    name: "React",
    shape: "atom",
    color: "#6fb7c9",
    level: "Production",
    summary:
      "The second hand I write with — component thinking transfers from Angular, and this very world (React Three Fiber on React 19) is built in it.",
    usedAt: ["Personal products", "This portfolio"],
    projectIds: ["pipeline", "publishing"],
    orbit: { radius: 2.8, height: 2.1, speed: 0.18, phase: 2.0 },
  },
  {
    id: "nextjs",
    name: "Next.js",
    shape: "ring",
    color: "#d8d5cc",
    level: "Production — own products",
    summary:
      "App Router, server components, static rendering. Every personal product ships on it, including this site — the 2D ledger is fully server-rendered under this 3D world.",
    usedAt: ["AI CRM pipeline", "QR ordering", "Publishing platform"],
    projectIds: ["pipeline", "qr-menu", "publishing"],
    orbit: { radius: 3.3, height: 2.4, speed: 0.1, phase: 2.9 },
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    shape: "waves",
    color: "#5da8a0",
    level: "Production",
    summary:
      "Design systems as utilities — this site's Cobalt Ledger system is Tailwind v4 theme tokens end to end, one palette shared by the 2D ledger and the 3D world.",
    usedAt: ["Personal products", "This portfolio"],
    projectIds: ["pipeline", "publishing"],
    orbit: { radius: 2.4, height: 1.2, speed: 0.2, phase: 3.7 },
  },
  {
    id: "supabase",
    name: "Supabase",
    shape: "bolt",
    color: "#6fae8a",
    level: "Production — own products",
    summary:
      "Postgres, auth, and row-level security behind every personal product. Schema design comes first; the UI hangs off decisions made in the database.",
    usedAt: ["AI CRM pipeline", "QR ordering", "Publishing platform"],
    projectIds: ["pipeline", "qr-menu", "publishing"],
    orbit: { radius: 2.9, height: 1.4, speed: 0.14, phase: 4.5 },
  },
  {
    id: "rxjs",
    name: "RxJS",
    shape: "knot",
    color: "#9a7fd1",
    level: "Solid — ERP data flows",
    summary:
      "Streams, operators, and the discipline of unsubscribing. The ERP's live data — filters, search, socket updates — flows through observables.",
    usedAt: ["Horecons — TheBridge ERP"],
    projectIds: ["storefront"],
    orbit: { radius: 2.6, height: 2.8, speed: 0.13, phase: 5.2 },
  },
  {
    id: "cpp",
    name: "C / C++",
    shape: "crystal",
    color: "#8a93b8",
    level: "Foundations — 42 Beirut",
    summary:
      "A year of memory management, algorithms, and peer-reviewed projects before frontend became the job. It's why 'how does this actually work' is the default question.",
    usedAt: ["42 Beirut"],
    projectIds: [],
    orbit: { radius: 3.2, height: 1.0, speed: 0.09, phase: 0.9 },
  },
  {
    id: "sql",
    name: "SQL",
    shape: "drum",
    color: "#c9a35c",
    level: "Solid",
    summary:
      "Schemas, joins, and the queries behind business screens — stock levels, pipelines, order history. Postgres at home, ERP databases at work.",
    usedAt: ["Horecons — TheBridge ERP", "Supabase products"],
    projectIds: ["pipeline", "publishing"],
    orbit: { radius: 2.7, height: 0.9, speed: 0.17, phase: 1.8 },
  },
  {
    id: "git",
    name: "Git",
    shape: "branch",
    color: "#c98a5c",
    level: "Daily driver",
    summary:
      "Branching, reviewing, and the habit of small honest commits — drilled in at 42's peer review culture, used everywhere since.",
    usedAt: ["Everywhere, since 42 Beirut"],
    projectIds: [],
    orbit: { radius: 3.0, height: 2.0, speed: 0.11, phase: 4.0 },
  },
];

export function getTech(id: string): Tech | undefined {
  return techs.find((t) => t.id === id);
}

/** Map a Project.stack entry to a tech in the constellation, if present. */
export function techIdForStackItem(stackItem: string): string | null {
  const norm = stackItem.toLowerCase();
  const hit = techs.find(
    (t) =>
      norm === t.name.toLowerCase() ||
      norm.startsWith(t.name.toLowerCase()) ||
      (t.id === "cpp" && (norm.includes("c++") || norm === "c")),
  );
  return hit ? hit.id : null;
}
