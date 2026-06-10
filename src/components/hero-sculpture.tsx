"use client";

import { useEffect, useRef, useState } from "react";
import {
  m,
  stagger,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { EASE } from "@/components/motion/reveal";
import { GreekBar, MiniChip, Sparkline } from "@/components/vignettes/bits";

const COLUMNS = ["Backlog", "In progress", "Done"] as const;
const CARD_ID = "ERP-214";

/** Static greeked cards per column, around which the live card moves. */
const columnCards: { w: string; tag?: string }[][] = [
  [{ w: "w-16", tag: "API" }, { w: "w-12" }],
  [{ w: "w-14" }],
  [{ w: "w-12", tag: "v2" }],
];

const kpiSteps = ["12,480", "12,540", "12,610", "12,660"];

const container = {
  hidden: {},
  show: { transition: { delayChildren: stagger(0.12, { startDelay: 0.2 }) } },
};

const panel = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

function PanelShell({
  z,
  className,
  children,
  dim = false,
  decorative = false,
}: {
  z: number;
  className: string;
  children: React.ReactNode;
  dim?: boolean;
  decorative?: boolean;
}) {
  return (
    <m.div
      variants={panel}
      aria-hidden={decorative || undefined}
      // preserve-3d here too — without it this wrapper flattens the
      // children's translateZ and the whole depth illusion dies.
      className={`absolute [transform-style:preserve-3d] ${className}`}
    >
      <div
        style={{ transform: `translateZ(${z}px)` }}
        className={`rounded-xl border border-line-bright bg-panel shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_28px_56px_-28px_rgba(0,0,0,0.9)] ${
          dim ? "opacity-50" : ""
        }`}
      >
        {children}
      </div>
    </m.div>
  );
}

export function HeroSculpture() {
  const reduced = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);
  const movedByUser = useRef(false);
  const [finePointer, setFinePointer] = useState(false);
  const [inView, setInView] = useState(true);
  const [paused, setPaused] = useState(false);

  // Ambient state the scene cycles through.
  const [liveCol, setLiveCol] = useState(1);
  const [dealWon, setDealWon] = useState(false);
  const [kpiIndex, setKpiIndex] = useState(0);
  // Bumped on user interaction so the ambient interval restarts and the
  // user gets a full quiet window before the demo moves anything itself.
  const [resetKey, setResetKey] = useState(0);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-5, 5]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateX = useSpring(useTransform(my, [0, 1], [4, -4]), {
    stiffness: 120,
    damping: 18,
  });

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFinePointer(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const node = sceneRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => setInView(entries[entries.length - 1].isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // The card button unmounts and remounts when it changes column — restore
  // keyboard focus to the new node after a user-initiated move.
  useEffect(() => {
    if (movedByUser.current) {
      movedByUser.current = false;
      cardRef.current?.focus();
    }
  }, [liveCol]);

  // One quiet state change every few seconds — never two at once, paused
  // offscreen, in hidden tabs, under reduced motion, and via the control.
  useEffect(() => {
    if (reduced || !inView || paused) return;
    let step = 0;
    const tick = () => {
      if (document.hidden) return;
      step = (step + 1) % 3;
      if (step === 0) setLiveCol((col) => (col + 1) % COLUMNS.length);
      if (step === 1) setDealWon((won) => !won);
      if (step === 2) setKpiIndex((i) => (i + 1) % kpiSteps.length);
    };
    const id = window.setInterval(tick, 5500);
    return () => window.clearInterval(id);
  }, [reduced, inView, paused, resetKey]);

  const tiltActive = finePointer && !reduced;

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!tiltActive || !sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width);
    my.set((event.clientY - rect.top) / rect.height);
  }

  function onPointerLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  function moveCard() {
    movedByUser.current = true;
    setLiveCol((col) => (col + 1) % COLUMNS.length);
    setResetKey((key) => key + 1);
  }

  return (
    <div
      ref={sceneRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative mx-auto w-full max-w-[34rem] [perspective:1100px]"
    >
      <p className="sr-only">
        Decorative dashboard scene: a sprint board, a deals list, and a revenue
        chart, drawn in the style of the ERP software I build. It contains one
        working control — a task card you can move between columns.
      </p>
      {/* Announces user-initiated card moves to screen readers. */}
      <p aria-live="polite" className="sr-only">
        {`Task ${CARD_ID} is in ${COLUMNS[liveCol]}.`}
      </p>

      <m.div
        variants={container}
        initial="hidden"
        animate="show"
        style={
          tiltActive
            ? { rotateX, rotateY, transformStyle: "preserve-3d" }
            : { transformStyle: "preserve-3d" }
        }
        className="relative h-[340px] sm:h-[420px]"
      >
        {/* Backdrop data table — texture layer. */}
        <PanelShell z={-40} dim decorative className="left-0 top-8 w-[56%]">
          <div className="space-y-3 p-4">
            {["w-28", "w-20", "w-24", "w-16", "w-24"].map((w, i) => (
              <div key={i} className="flex items-center gap-3">
                <GreekBar w="w-3" tone="bg-white/6" />
                <GreekBar w={w} tone="bg-white/8" />
                <GreekBar w="w-8" tone="bg-white/6" />
              </div>
            ))}
          </div>
        </PanelShell>

        {/* Kanban — the interactive panel. Scaffolding is decorative; the
            live card button carries the full context in its name. */}
        <PanelShell z={30} className="left-[4%] top-[16%] w-[64%]">
          <div aria-hidden="true" className="border-b border-line px-3.5 py-2">
            <p className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">
              Sprint board
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 p-2.5">
            {COLUMNS.map((column, colIndex) => (
              <div key={column} className="rounded-lg bg-ground/50 p-1.5">
                <p
                  aria-hidden="true"
                  className="px-1 pb-1.5 font-mono text-[8px] uppercase tracking-wider text-ink-faint"
                >
                  {column}
                </p>
                <div className="space-y-1.5">
                  <div aria-hidden="true" className="space-y-1.5">
                    {columnCards[colIndex].map((card, i) => (
                      <div
                        key={i}
                        className="rounded-md border border-line bg-panel p-1.5"
                      >
                        <GreekBar w={card.w} h="h-1" />
                        {card.tag ? (
                          <span className="mt-1.5 inline-block rounded bg-white/8 px-1 font-mono text-[7px] text-ink-faint">
                            {card.tag}
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  {liveCol === colIndex ? (
                    <m.button
                      ref={cardRef}
                      layout
                      layoutId="live-card"
                      type="button"
                      onClick={moveCard}
                      aria-label={`Demo task ${CARD_ID}, in ${COLUMNS[liveCol]} — move it to the next column`}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      className="block w-full cursor-pointer rounded-md border border-accent/60 bg-accent/10 p-1.5 text-left"
                    >
                      <GreekBar w="w-14" h="h-1" tone="bg-accent/50" />
                      <span className="mt-1.5 inline-block rounded bg-accent/20 px-1 font-mono text-[7px] text-accent-bright">
                        {CARD_ID}
                      </span>
                    </m.button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </PanelShell>

        {/* CRM deals — ambient status flip. */}
        <PanelShell z={80} decorative className="right-0 top-0 w-[46%]">
          <div className="border-b border-line px-3.5 py-2">
            <p className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">
              Deals
            </p>
          </div>
          <div className="divide-y divide-line/70">
            <div className="flex items-center gap-2.5 px-3 py-2">
              <GreekBar w="w-12" />
              <span className="ml-auto font-mono text-[9px] text-ink-soft">
                $6.5k
              </span>
              <m.span
                key={dealWon ? "won" : "pending"}
                initial={reduced ? false : { opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <MiniChip tone={dealWon ? "good" : "warn"}>
                  {dealWon ? "Won" : "Pending"}
                </MiniChip>
              </m.span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2">
              <GreekBar w="w-9" />
              <span className="ml-auto font-mono text-[9px] text-ink-soft">
                $2.1k
              </span>
              <MiniChip tone="accent">AI draft</MiniChip>
            </div>
          </div>
        </PanelShell>

        {/* Revenue KPI — ambient tick. */}
        <PanelShell z={110} decorative className="bottom-0 right-[3%] w-[42%]">
          <div className="p-3.5">
            <p className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">
              Revenue · 30d
            </p>
            <p className="mt-1 font-mono text-lg tabular-nums text-ink">
              ${kpiSteps[kpiIndex]}
            </p>
            <Sparkline className="mt-2 h-8 w-full" />
          </div>
        </PanelShell>
      </m.div>

      <div className="mt-5 flex items-center justify-center gap-4 sm:justify-end">
        <p className="font-mono text-[11px] text-ink-faint">
          <span aria-hidden="true">↳ </span>interactive — try moving the{" "}
          {CARD_ID} card
        </p>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-ink-faint transition-colors hover:border-accent-bright hover:text-accent-bright"
        >
          {paused ? "play scene" : "pause scene"}
        </button>
      </div>
    </div>
  );
}
