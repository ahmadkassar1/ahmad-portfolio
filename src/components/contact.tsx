import { MetaLabel } from "@/components/meta-label";
import { Reveal } from "@/components/motion/reveal";
import { CopyEmailButton } from "@/components/ui/copy-email-button";
import { site } from "@/data/site";

export function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden">
      {/* Structural wash, not decoration: pulls the closing section forward. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(70%_55%_at_50%_115%,rgba(77,124,255,0.12),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-6xl px-6 py-32 sm:py-44">
        <Reveal>
          <MetaLabel>05 — Contact</MetaLabel>
          <h2 className="text-display-lg mt-8 max-w-4xl text-ink">
            Let&apos;s build something that{" "}
            <em className="font-serif italic text-accent-bright">works</em>.
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
            I&apos;m open to frontend roles and freelance projects — remote, or
            on-site in Lebanon. The fastest way to reach me is email; I usually
            reply within a day.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${site.email}`}
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-ground transition-colors hover:bg-accent-bright"
            >
              Email me
            </a>
            <CopyEmailButton email={site.email} />
          </div>

          <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-8 font-mono text-sm">
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-ink-soft transition-colors hover:text-accent-bright"
            >
              GitHub{" "}
              <span
                className="inline-block transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                ↗
              </span>
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-ink-soft transition-colors hover:text-accent-bright"
            >
              LinkedIn{" "}
              <span
                className="inline-block transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                ↗
              </span>
            </a>
            <span className="text-ink-faint">{site.location}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
