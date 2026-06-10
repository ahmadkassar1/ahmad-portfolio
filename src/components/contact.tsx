import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { CopyEmailButton } from "@/components/ui/copy-email-button";
import { site } from "@/data/site";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <SectionHeading index="05" title="Contact" />

        <Reveal delay={0.05}>
          <p className="mt-10 max-w-2xl text-2xl font-medium leading-snug tracking-tight text-ink sm:text-3xl">
            I&apos;m open to{" "}
            <em className="font-serif italic text-accent">frontend roles</em> and
            freelance projects — remote, or on-site in Lebanon.
          </p>
          <p className="mt-5 max-w-xl leading-relaxed text-ink-soft">
            If you&apos;re hiring, or you have a product that needs a serious
            front end, the fastest way to reach me is email. I usually reply
            within a day.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${site.email}`}
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
            >
              Email me
            </a>
            <CopyEmailButton email={site.email} />
          </div>

          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-8 font-mono text-sm">
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-ink-soft transition-colors hover:text-accent"
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
              className="group text-ink-soft transition-colors hover:text-accent"
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
