import type { ReactNode } from "react";
import { MetaLabel } from "@/components/meta-label";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/spotlight-card";
import { PipelineVignette } from "@/components/vignettes/pipeline-vignette";
import { PublishingVignette } from "@/components/vignettes/publishing-vignette";
import { QrMenuVignette } from "@/components/vignettes/qr-menu-vignette";
import { StorefrontVignette } from "@/components/vignettes/storefront-vignette";
import { projects, type Project } from "@/data/projects";
import { site } from "@/data/site";

// Keyed by the Project union so a renamed or missing vignette fails to
// compile instead of silently rendering an empty art panel.
const vignettes: Record<Project["vignette"], ReactNode> = {
  pipeline: <PipelineVignette />,
  "qr-menu": <QrMenuVignette />,
  publishing: <PublishingVignette />,
  storefront: <StorefrontVignette />,
};

export function SelectedWork() {
  return (
    <section id="work" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6 py-28 sm:py-36">
        <SectionHeading
          index="01"
          title="Selected work"
          lede="Personal product builds, drawn as the interfaces they are. The ERP work I ship professionally is internal — it lives under experience."
        />

        <div className="mt-20 space-y-24 sm:space-y-32">
          {projects.map((project, index) => {
            const flip = index % 2 === 1;
            return (
              <Reveal key={project.name}>
                <article className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
                  <SpotlightCard
                    className={`rounded-2xl border border-line bg-ground/40 p-6 [background-image:radial-gradient(var(--line)_1px,transparent_1px)] [background-size:18px_18px] sm:p-10 lg:col-span-7 ${
                      flip ? "lg:order-2" : ""
                    }`}
                  >
                    <div
                      role="img"
                      aria-label={`Stylized interface mockup of ${project.name}`}
                    >
                      <div aria-hidden="true">
                        {vignettes[project.vignette]}
                      </div>
                    </div>
                  </SpotlightCard>

                  <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                    <div className="flex items-baseline gap-3">
                      <span
                        aria-hidden="true"
                        className="font-mono text-sm text-accent-bright"
                      >
                        {project.index}
                      </span>
                      <MetaLabel as="span">{project.kind}</MetaLabel>
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                      {project.name}
                    </h3>
                    <p className="mt-4 leading-relaxed text-ink-soft">
                      {project.outcome}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {project.highlights.map((highlight) => (
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
                    <ul
                      aria-label="Stack"
                      className="mt-7 flex flex-wrap gap-2"
                    >
                      {project.stack.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-full border border-line px-3 py-1 font-mono text-xs text-ink-soft"
                        >
                          {tech}
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
                            className="group text-sm font-medium text-ink transition-colors hover:text-accent-bright"
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
            );
          })}
        </div>

        <Reveal>
          <div className="mt-24 border-t border-line pt-8">
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-sm font-medium text-ink transition-colors hover:text-accent-bright"
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
