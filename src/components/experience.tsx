import { MetaLabel } from "@/components/meta-label";
import { Reveal } from "@/components/motion/reveal";
import { shipped, training } from "@/data/experience";

/* Deliberately quiet: a proof footnote, not a résumé chapter. */

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 border-y border-line bg-panel/30">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <Reveal>
          <MetaLabel as="h2">Where this has shipped</MetaLabel>
          <div className="mt-7 grid gap-10 lg:grid-cols-2">
            {shipped.map((entry) => (
              <div key={entry.platform}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-medium text-ink">
                    {entry.platform}{" "}
                    <span className="font-normal text-ink-soft">
                      · {entry.context}
                    </span>
                  </h3>
                  <span className="font-mono text-xs text-ink-faint">
                    {entry.period}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {entry.summary}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-10 border-t border-line pt-6 font-mono text-xs text-ink-faint">
            {training}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
