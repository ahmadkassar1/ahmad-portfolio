import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/spotlight-card";
import { capabilities } from "@/data/capabilities";

export function Capabilities() {
  return (
    <section id="capabilities" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <SectionHeading
          index="02"
          title="What I build"
          lede="The common thread: software where the interface is the product, and getting state wrong costs someone real money."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {capabilities.map((capability, index) => (
            <Reveal key={capability.title} delay={Math.min(index * 0.06, 0.18)}>
              <SpotlightCard className="h-full rounded-2xl border border-line bg-panel p-7 sm:p-8">
                <span
                  aria-hidden="true"
                  className="font-mono text-sm text-accent-bright"
                >
                  {capability.index}
                </span>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">
                  {capability.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {capability.description}
                </p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
