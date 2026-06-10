import { MetaLabel } from "@/components/meta-label";
import { Reveal } from "@/components/motion/reveal";
import { GreekBar, MicroAction, MiniChip } from "@/components/vignettes/bits";

/* A scroll-snap strip of component-scale vignettes — the granularity the
   big project blocks can't show. Native scroll, no JS. */

function DetailCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-64 shrink-0 snap-start rounded-xl border border-line bg-panel p-4">
      <MetaLabel className="mb-4">{label}</MetaLabel>
      {/* The mock internals are decorative — the label above is the
          card's accessible content. */}
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

export function DetailStrip() {
  return (
    <section
      aria-label="Interface details"
      className="border-y border-line bg-panel/30"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              The details are the job
            </h2>
            <p className="font-mono text-xs text-ink-faint">
              component-scale work, scroll <span aria-hidden="true">→</span>
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            tabIndex={0}
            role="group"
            aria-label="Scrollable gallery of interface components"
            className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-color:var(--line-bright)_transparent] [scrollbar-width:thin]"
          >
            <DetailCard label="Data table">
              <div className="flex items-center justify-between border-b border-line-bright pb-2">
                <span className="flex items-center gap-1 font-mono text-[10px] text-ink">
                  Amount <span aria-hidden="true" className="text-accent-bright">↓</span>
                </span>
                <span className="font-mono text-[10px] text-ink-faint">Status</span>
              </div>
              <div className="mt-2.5 space-y-2.5">
                {[
                  { value: "$2,340", tone: "good" as const, label: "Paid" },
                  { value: "$1,120", tone: "warn" as const, label: "Due" },
                  { value: "$860", tone: "good" as const, label: "Paid" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tabular-nums text-ink-soft">
                      {row.value}
                    </span>
                    <MiniChip tone={row.tone}>{row.label}</MiniChip>
                  </div>
                ))}
              </div>
            </DetailCard>

            <DetailCard label="Filters">
              <div className="flex flex-wrap gap-1.5">
                <MiniChip tone="accent">This month ×</MiniChip>
                <MiniChip tone="accent">Beirut ×</MiniChip>
                <MiniChip>+ Add filter</MiniChip>
              </div>
              <div className="mt-3.5 space-y-2">
                <div className="flex h-7 items-center rounded-md border border-line bg-ground/60 px-2.5">
                  <GreekBar w="w-16" tone="bg-white/8" h="h-1" />
                </div>
                <div className="flex h-7 items-center justify-between rounded-md border border-accent/50 bg-accent/8 px-2.5">
                  <GreekBar w="w-12" tone="bg-accent/40" h="h-1" />
                  <span aria-hidden="true" className="font-mono text-[9px] text-accent-bright">
                    ▾
                  </span>
                </div>
              </div>
            </DetailCard>

            <DetailCard label="Form validation">
              <div className="space-y-2.5">
                <div>
                  <GreekBar w="w-10" tone="bg-white/10" h="h-1" />
                  <div className="mt-1.5 flex h-7 items-center rounded-md border border-line bg-ground/60 px-2.5">
                    <GreekBar w="w-20" tone="bg-white/8" h="h-1" />
                  </div>
                </div>
                <div>
                  <GreekBar w="w-12" tone="bg-white/10" h="h-1" />
                  <div className="mt-1.5 flex h-7 items-center rounded-md border border-bad/50 bg-bad/5 px-2.5">
                    <GreekBar w="w-14" tone="bg-bad/30" h="h-1" />
                  </div>
                  <p className="mt-1 font-mono text-[9px] text-bad">
                    Required field
                  </p>
                </div>
              </div>
            </DetailCard>

            <DetailCard label="Kanban card">
              <div className="rounded-lg border border-line bg-ground/50 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-ink-faint">
                    ERP-198
                  </span>
                  <span aria-hidden="true" className="h-4 w-4 rounded-full bg-white/10" />
                </div>
                <div className="mt-2">
                  <GreekBar w="w-24" h="h-1" tone="bg-white/15" />
                </div>
                <div className="mt-2 flex gap-1.5">
                  <MiniChip tone="accent">Stock</MiniChip>
                  <MiniChip tone="warn">Review</MiniChip>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between px-1">
                <span className="font-mono text-[9px] text-ink-faint">
                  In progress
                </span>
                <span aria-hidden="true" className="font-mono text-[9px] text-ink-faint">
                  ⋮⋮
                </span>
              </div>
            </DetailCard>

            <DetailCard label="Order status">
              <div className="space-y-2.5">
                {[
                  { label: "Received", done: true },
                  { label: "Preparing", done: true },
                  { label: "On the way", done: false },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 rounded-full ${
                        step.done ? "bg-good" : "border border-line-bright"
                      }`}
                    />
                    <span
                      className={`font-mono text-[10px] ${
                        step.done ? "text-ink-soft" : "text-ink-faint"
                      }`}
                    >
                      {step.label}
                    </span>
                    {i === 1 ? <MiniChip tone="good">now</MiniChip> : null}
                  </div>
                ))}
              </div>
            </DetailCard>

            <DetailCard label="Empty state">
              <div className="flex flex-col items-center rounded-lg border border-dashed border-line-bright py-5">
                <span aria-hidden="true" className="h-7 w-7 rounded-lg bg-white/6" />
                <GreekBar w="w-20" h="h-1" tone="bg-white/10" />
                <span className="mt-2.5">
                  <MicroAction>Create first record</MicroAction>
                </span>
              </div>
            </DetailCard>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
