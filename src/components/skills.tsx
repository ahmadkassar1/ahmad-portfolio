import { MetaLabel } from "@/components/meta-label";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { skillGroups } from "@/data/skills";

export function Skills() {
  return (
    <section id="toolbox" className="scroll-mt-24">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <SectionHeading
          index="04"
          title="Toolbox"
          lede="The tools I reach for, grouped by what they're for."
        />

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, index) => (
            <Reveal key={group.label} delay={Math.min(index * 0.05, 0.15)}>
              <MetaLabel as="h3" className="border-b border-line pb-3">
                {group.label}
              </MetaLabel>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((skill) => (
                  <li key={skill} className="text-sm leading-relaxed text-ink-soft">
                    {skill}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
