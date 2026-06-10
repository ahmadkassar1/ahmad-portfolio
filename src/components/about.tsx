import { MetaLabel } from "@/components/meta-label";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { principles } from "@/data/capabilities";

const facts = [
  { label: "Location", value: "Beirut (UTC+3)" },
  { label: "Languages", value: "Works in Arabic & English" },
  { label: "Focus", value: "Business software & product interfaces" },
  { label: "Own products", value: "Next.js + Supabase" },
];

export function About() {
  return (
    <section id="approach" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <SectionHeading index="03" title="Approach" />

        <Reveal>
          <p className="mt-12 max-w-3xl font-serif text-2xl italic leading-snug text-ink sm:text-3xl">
            I studied business before I wrote software.{" "}
            <span className="text-accent-bright">It changed what I build.</span>
          </p>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <Reveal className="space-y-6 text-base leading-relaxed text-ink-soft lg:col-span-7">
            <p>
              I finished a degree in business administration before I wrote a
              line of production code, and that background still shapes how I
              work. A stock-management screen or a sales pipeline is a tool in
              someone&apos;s workday before it&apos;s anything else, and I
              build it in that order.
            </p>
            <p>
              The engineering rigor came from 42 Beirut: a year of C, C++,
              algorithms, and peer-reviewed projects before frontend became the
              day job. Two ERP platforms later, my comfort zone is exactly the
              kind of software most portfolios avoid — dense, stateful,
              business-critical interfaces.
            </p>
            <p>
              Most of my work lives in Angular and TypeScript on large business
              platforms; my own products run on Next.js and Supabase. Either
              way, the bar is the same: clean data flow, predictable state, and
              software people actually operate their business on.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <dl className="space-y-6 rounded-2xl border border-line bg-panel p-7">
              {facts.map((fact) => (
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
