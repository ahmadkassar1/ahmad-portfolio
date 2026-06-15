import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "Self-contained builds and experiments — a SaaS analytics console, a form builder, a generative art studio, and a browser game.",
};

type LabProject = {
  slug: string;
  name: string;
  tagline: string;
  tags: string[];
  status: "live" | "building";
  accent: string;
};

const projects: LabProject[] = [
  {
    slug: "helm",
    name: "Helm",
    tagline:
      "Analytics console for a fictional email + webhooks API — KPIs, hand-built SVG charts, a command palette, and a live deliveries table.",
    tags: ["Dashboard", "Data viz", "⌘K"],
    status: "live",
    accent: "#0f766e",
  },
  {
    slug: "forge",
    name: "Forge",
    tagline:
      "Drag-and-drop form builder: compose fields on a canvas, edit properties, undo/redo, preview, and export a shareable schema.",
    tags: ["Builder", "Drag & drop", "Schema"],
    status: "building",
    accent: "#b45309",
  },
  {
    slug: "atelier",
    name: "Atelier",
    tagline:
      "Generative art studio — parametric compositions you can tune by hand, reseed, and export as a high-resolution image.",
    tags: ["Canvas", "Generative", "Export"],
    status: "building",
    accent: "#3f3f46",
  },
  {
    slug: "tempo",
    name: "Tempo",
    tagline:
      "A small, fast browser game with a real game loop, particle feedback, and a local leaderboard. Built to feel good to play.",
    tags: ["Game", "Canvas", "Game loop"],
    status: "building",
    accent: "#1d4ed8",
  },
];

export default function LabIndex() {
  return (
    <div className="min-h-dvh bg-zinc-50 font-sans text-zinc-900 antialiased">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <Link href="/" className="font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-900">
          ← Ahmad Kassar
        </Link>

        <header className="mt-8 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">The Lab</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Builds &amp; experiments
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Four self-contained projects — each a different corner of frontend work, built to be
            production-real rather than a demo. No external services; everything runs in the browser.
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2">
          {projects.map((p) => {
            const inner = (
              <div className="flex h-full flex-col bg-white p-7 transition-colors group-hover:bg-zinc-50">
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-lg text-sm font-semibold text-white"
                    style={{ backgroundColor: p.accent }}
                  >
                    {p.name[0]}
                  </span>
                  <h2 className="text-lg font-semibold tracking-tight">{p.name}</h2>
                  {p.status === "building" ? (
                    <span className="ml-auto rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500">
                      Building
                    </span>
                  ) : (
                    <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-600" /> Live
                    </span>
                  )}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-600">{p.tagline}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-zinc-200 px-2.5 py-1 font-mono text-xs text-zinc-500"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {p.status === "live" && (
                  <span className="mt-5 text-sm font-medium text-teal-700">Open project →</span>
                )}
              </div>
            );

            return p.status === "live" ? (
              <Link key={p.slug} href={`/lab/${p.slug}`} className="group block">
                {inner}
              </Link>
            ) : (
              <div key={p.slug} className="group block opacity-90">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
