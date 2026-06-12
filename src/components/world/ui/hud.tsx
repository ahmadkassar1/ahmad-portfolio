"use client";

import { site } from "@/data/site";
import { stations } from "@/data/stations";
import { useExperience } from "@/lib/experience-store";
import { moods } from "@/lib/moods";

/**
 * The HUD — the world's DOM control surface. Every action the 3D scene
 * offers (and everything it can't) lives here: station focus, info
 * panels, and the way back to the ledger. Hidden *and* inert during the
 * intro so nothing invisible can take focus.
 */
export function Hud() {
  const introDone = useExperience((s) => s.introDone);
  const focusedStation = useExperience((s) => s.focusedStation);
  const phase = useExperience((s) => s.phase);
  const openPanel = useExperience((s) => s.openPanel);
  const focusStation = useExperience((s) => s.focusStation);
  const clearFocus = useExperience((s) => s.clearFocus);
  const showPanel = useExperience((s) => s.showPanel);
  const exitToLedger = useExperience((s) => s.exitToLedger);

  const onStation = (id: string) => {
    if (focusedStation === id && (phase === "focused" || phase === "focusing"))
      clearFocus();
    else focusStation(id);
  };

  return (
    <div
      inert={!introDone}
      className={`absolute inset-0 z-50 transition-opacity duration-700 ${
        introDone ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Identity chip. */}
      <header className="pointer-events-none absolute left-6 top-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
          Ops Deck
        </p>
        <p className="mt-1 text-sm font-medium text-ink">
          {site.name} — {site.role}
        </p>
      </header>

      {/* Orbit hint, only while idle and nothing is open. */}
      {phase === "idle" && !openPanel && (
        <p
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-6 hidden -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint sm:block"
        >
          Drag to orbit — pick a station
        </p>
      )}

      {/* Dock. */}
      <nav
        aria-label="Deck controls"
        className="absolute inset-x-0 bottom-5 flex justify-center px-4"
      >
        <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-line bg-panel/85 px-3 py-2.5 backdrop-blur-md">
          {stations.map((station) => {
            const active =
              focusedStation === station.id &&
              (phase === "focused" || phase === "focusing");
            return (
              <button
                key={station.id}
                type="button"
                onClick={() => onStation(station.id)}
                aria-pressed={active}
                className={`rounded-xl px-3 py-2 font-mono text-xs transition-colors ${
                  active
                    ? "bg-ink/10 text-ink"
                    : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                }`}
              >
                <span aria-hidden="true" className="mr-1.5" style={{ color: moods[station.mood].bright }}>
                  ◆
                </span>
                {station.index} {station.shortName}
              </button>
            );
          })}

          <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />

          <button
            type="button"
            onClick={() => showPanel("about")}
            aria-pressed={openPanel === "about"}
            className="rounded-xl px-3 py-2 font-mono text-xs text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => showPanel("toolbox")}
            aria-pressed={openPanel === "toolbox"}
            className="rounded-xl px-3 py-2 font-mono text-xs text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
          >
            Toolbox
          </button>
          <button
            type="button"
            onClick={() => showPanel("contact")}
            aria-pressed={openPanel === "contact"}
            className="rounded-xl px-3 py-2 font-mono text-xs text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
          >
            Contact
          </button>

          <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />

          <button
            type="button"
            onClick={exitToLedger}
            className="rounded-xl border border-line px-3 py-2 font-mono text-xs text-ink-soft transition-colors hover:border-line-bright hover:text-ink"
          >
            Ledger view
          </button>
        </div>
      </nav>
    </div>
  );
}
