import { MetaLabel } from "@/components/meta-label";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export function SelectedWork() {
  return (
    <section id="work" className="scroll-mt-24">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <SectionHeading
          index="01"
          title="Selected work"
          lede="Personal product builds — each one a complete application with real business logic behind it. The ERP work I do professionally is internal; it lives under experience below."
        />

        <div className="mt-16">
          {projects.map((project, index) => (
            <Reveal key={project.name} delay={Math.min(index * 0.05, 0.15)}>
              <article className="grid gap-6 border-t border-line py-12 md:grid-cols-12 md:gap-10 md:py-14">
                <div className="md:col-span-4">
                  <p className="font-mono text-sm text-accent" aria-hidden="true">
                    {project.index}
                  </p>
                  <MetaLabel className="mt-3">{project.kind}</MetaLabel>
                  <ul
                    aria-label="Stack"
                    className="mt-5 flex flex-wrap gap-x-2 gap-y-1.5 font-mono text-xs text-ink-soft"
                  >
                    {project.stack.map((tech, techIndex) => (
                      <li key={tech}>
                        {tech}
                        {techIndex < project.stack.length - 1 ? (
                          <span className="ml-2 text-ink-faint" aria-hidden="true">
                            ·
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-8">
                  <h3 className="text-xl font-semibold tracking-tight text-ink">
                    {project.name}
                  </h3>
                  <p className="mt-4 leading-relaxed text-ink-soft">
                    {project.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {project.highlights.map((highlight) => (
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
                  {project.links.length > 0 ? (
                    <div className="mt-7 flex flex-wrap gap-6">
                      {project.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group text-sm font-medium text-accent transition-colors hover:text-accent-deep"
                        >
                          {link.label}{" "}
                          <span
                            className="inline-block transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          >
                            ↗
                          </span>
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="border-t border-line pt-8">
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-sm font-medium text-ink transition-colors hover:text-accent"
            >
              More code on GitHub{" "}
              <span
                className="inline-block transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                ↗
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
