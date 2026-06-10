import { MetaLabel } from "@/components/meta-label";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/data/site";

const facts = [
  { label: "Location", value: site.location },
  { label: "Languages", value: "Arabic (native) · English (professional)" },
  { label: "Currently", value: "Frontend Developer at Horecons" },
  { label: "Training", value: "42 Beirut · B.A. Business Administration" },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-24">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <SectionHeading index="03" title="About" />

        <div className="mt-12 grid gap-12 md:grid-cols-12">
          <Reveal className="space-y-6 text-base leading-relaxed text-ink-soft md:col-span-7">
            <p>
              I came to software from the business side. I finished a degree in
              business administration before I wrote a line of production code —
              and that background still shapes how I work. When I build a
              stock-management screen or a sales pipeline, I&apos;m thinking
              about the person processing orders with it, not just the
              component tree.
            </p>
            <p>
              The engineering rigor came from 42 Beirut: a year of C, C++,
              algorithms, and peer-reviewed projects before moving into frontend
              work professionally. Two years and two ERP platforms later, my
              comfort zone is exactly the kind of software most portfolios
              avoid — dense, stateful, business-critical interfaces.
            </p>
            <p>
              Day to day I work in Angular and TypeScript at Horecons on
              TheBridge ERP, and build my own products in Next.js and Supabase.
              I care about clean data flow, components that survive their
              second feature request, and shipping things people actually
              operate their business on.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-4 md:col-start-9">
            <dl className="space-y-6 border-l border-line pl-6">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <MetaLabel as="dt">{fact.label}</MetaLabel>
                  <dd className="mt-1.5 text-sm text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
