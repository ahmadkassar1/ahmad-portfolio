import { HeroSculpture } from "@/components/hero-sculpture";
import { MetaLabel } from "@/components/meta-label";
import { site } from "@/data/site";

/* Server component on purpose: the text column animates with CSS only
   (.rise / .fade-rise), so the headline paints — and counts as LCP —
   before any JavaScript arrives. */

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-32 sm:pt-40 lg:grid-cols-12 lg:gap-6 lg:pb-32">
        <div className="relative z-10 lg:col-span-5">
          <div className="fade-rise">
            <MetaLabel>Ahmad Kassar — Frontend Developer, Beirut</MetaLabel>
          </div>

          <h1 className="text-display rise mt-6 text-ink [animation-delay:80ms]">
            Interfaces that{" "}
            <em className="font-serif italic text-accent-bright">
              run the business
            </em>
            .
          </h1>

          <p className="fade-rise mt-7 max-w-md text-lg leading-relaxed text-ink-soft [animation-delay:160ms]">
            ERP modules, CRM pipelines, dashboards, and storefronts — in
            Angular, React, and Next.js. Currently building TheBridge ERP at
            Horecons.
          </p>

          <div className="fade-rise mt-9 flex flex-wrap items-center gap-x-7 gap-y-5 [animation-delay:240ms]">
            <a
              href="#work"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-ground transition-colors hover:bg-accent-bright"
            >
              See the work
            </a>
            <a
              href="#contact"
              className="group text-sm font-medium text-ink transition-colors hover:text-accent-bright"
            >
              Get in touch{" "}
              <span
                className="inline-block transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </a>
          </div>

          <p className="fade-rise mt-8 flex items-center gap-2 font-mono text-xs text-ink-faint [animation-delay:320ms]">
            <span className="h-1.5 w-1.5 rounded-full bg-good" aria-hidden="true" />
            {site.availability}
          </p>
        </div>

        {/* The sculpture intrudes into the type column's territory on
            large screens — the overlap is what keeps it off one plane. */}
        <div className="lg:col-span-7 lg:-ml-10">
          <HeroSculpture />
        </div>
      </div>
    </section>
  );
}
