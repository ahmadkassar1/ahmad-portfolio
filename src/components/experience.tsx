import { MetaLabel } from "@/components/meta-label";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { education, roles } from "@/data/experience";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <SectionHeading
          index="02"
          title="Experience"
          lede="Two ERP platforms, two teams, one through-line: turning operational requirements into interfaces people run their day on."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {roles.map((role, index) => (
            <Reveal key={role.company} delay={Math.min(index * 0.08, 0.16)}>
              <article className="h-full rounded-2xl border border-line bg-panel p-7 sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-mono text-sm text-accent-bright">
                    {role.period}
                  </p>
                  <p className="font-mono text-xs text-ink-faint">
                    {role.location}
                  </p>
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">
                  {role.title}{" "}
                  <span className="font-normal text-ink-soft">
                    · {role.company}
                  </span>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {role.summary}
                </p>
                <ul className="mt-5 space-y-3 border-t border-line pt-5">
                  {role.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex gap-3 text-sm leading-relaxed text-ink-soft"
                    >
                      <span
                        aria-hidden="true"
                        className="select-none text-accent-bright"
                      >
                        —
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12">
            <MetaLabel as="h3">Education & training</MetaLabel>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {education.map((entry) => (
                <div
                  key={entry.school}
                  className="rounded-xl border border-line px-6 py-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium text-ink">{entry.credential}</p>
                    <p className="font-mono text-xs text-ink-faint">
                      {entry.period}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">{entry.school}</p>
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
