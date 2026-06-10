import { MetaLabel } from "@/components/meta-label";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { education, roles } from "@/data/experience";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <SectionHeading
          index="02"
          title="Experience"
          lede="Two ERP platforms, two teams, one through-line: turning operational requirements into interfaces people run their day on."
        />

        <div className="mt-16">
          {roles.map((role) => (
            <Reveal key={role.company}>
              <article className="grid gap-6 border-t border-line py-12 md:grid-cols-12 md:gap-10">
                <div className="md:col-span-4">
                  <p className="font-mono text-sm text-ink">{role.period}</p>
                  <p className="mt-2 font-mono text-xs text-ink-faint">
                    {role.location}
                  </p>
                </div>
                <div className="md:col-span-8">
                  <h3 className="text-xl font-semibold tracking-tight text-ink">
                    {role.title}{" "}
                    <span className="font-normal text-ink-soft">
                      · {role.company}
                    </span>
                  </h3>
                  <p className="mt-3 text-ink-soft">{role.summary}</p>
                  <ul className="mt-5 space-y-3">
                    {role.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex gap-3 text-sm leading-relaxed text-ink-soft"
                      >
                        <span
                          aria-hidden="true"
                          className="select-none text-accent"
                        >
                          —
                        </span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="border-t border-line pt-10">
            <MetaLabel as="h3">Education & training</MetaLabel>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              {education.map((entry) => (
                <div key={entry.school}>
                  <p className="font-mono text-sm text-ink">{entry.period}</p>
                  <p className="mt-2 font-medium text-ink">{entry.credential}</p>
                  <p className="text-sm text-ink-soft">{entry.school}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {entry.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
