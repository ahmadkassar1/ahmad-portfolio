import { MetaLabel } from "@/components/meta-label";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { aboutFacts, aboutNarrative } from "@/data/about";
import { principles } from "@/data/capabilities";

export function About() {
  return (
    <section id="approach" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <SectionHeading index="03" title="Approach" />

        <Reveal>
          <p className="mt-12 max-w-3xl font-serif text-2xl italic leading-snug text-ink sm:text-3xl">
            Interfaces should make everyday work easier.{" "}
            <span className="text-accent-bright">That shapes what I build.</span>
          </p>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <Reveal className="space-y-6 text-base leading-relaxed text-ink-soft lg:col-span-7">
            {aboutNarrative.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <dl className="space-y-6 rounded-2xl border border-line bg-panel p-7">
              {aboutFacts.map((fact) => (
                <div key={fact.label}>
                  <MetaLabel as="dt">{fact.label}</MetaLabel>
                  <dd className="mt-1.5 text-sm text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-16 border-t border-line pt-10">
            <MetaLabel as="h3">Principles</MetaLabel>
            <div className="mt-7 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {principles.map((principle, index) => (
                <div key={principle.title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="font-mono text-sm text-accent-bright"
                  >
                    0{index + 1}
                  </span>
                  <div>
                    <h4 className="font-medium text-ink">{principle.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                      {principle.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
