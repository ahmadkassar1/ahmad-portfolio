import type { Metadata } from "next";
import Link from "next/link";
import { labProjects } from "@/data/lab";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "Self-contained builds and experiments — a SaaS analytics console, a form builder, a generative art studio, and a browser game.",
};

export default function LabIndex() {
  return (
    // Transparent surface: the layout's --ground + blueprint grid show
    // through, so the Lab reads as a native part of the portfolio.
    <main className="relative min-h-dvh font-sans text-ink">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <Link
          href="/"
          className="font-mono text-xs text-ink-faint transition-colors hover:text-accent-bright"
        >
          ← Ahmad Kassar
        </Link>

        <header className="mt-10 max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">The Lab</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Builds &amp; <span className="font-serif italic text-accent-bright">experiments</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-ink-soft">
            Four self-contained projects — each a different corner of frontend work, built to be
            production-real rather than a throwaway demo. No external services; everything runs in
            the browser.
          </p>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {labProjects.map((p) => {
            const inner = (
              <>
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-lg text-sm font-semibold text-ground"
                    style={{ backgroundColor: p.accent }}
                  >
                    {p.name[0]}
                  </span>
                  <h2 className="text-lg font-semibold tracking-tight">{p.name}</h2>
                  {p.status === "building" ? (
                    <span className="ml-auto rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-ink-faint">
                      Building
                    </span>
                  ) : (
                    <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-[11px] text-accent-bright">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" /> Live
                    </span>
                  )}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">{p.tagline}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-faint"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {p.status === "live" && (
                  <span className="mt-5 font-mono text-xs text-accent-bright">Open project →</span>
                )}
              </>
            );

            const cardCls =
              "flex h-full flex-col rounded-2xl border border-line bg-panel/60 p-7 backdrop-blur-sm transition-colors";

            return p.status === "live" ? (
              <Link key={p.slug} href={`/lab/${p.slug}`} className={`${cardCls} hover:border-line-bright`}>
                {inner}
              </Link>
            ) : (
              <div key={p.slug} className={`${cardCls} opacity-70`}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
