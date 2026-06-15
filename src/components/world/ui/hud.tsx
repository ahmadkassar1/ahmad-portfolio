"use client";

import { site } from "@/data/site";
import { stations } from "@/data/stations";
import { useExperience } from "@/lib/experience-store";
import { moods } from "@/lib/moods";
import { WalkJoystick } from "@/components/world/ui/walk-joystick";

/**
 * The HUD — the world's DOM control surface. Every action the 3D scene
 * offers (and everything it can't) lives here: station focus, the About
 * desk, the Contact terminal, the toolbox, the auto-tour, and the way
 * back to the ledger. Hidden *and* inert during the intro so nothing
 * invisible can take focus.
 */
export function Hud() {
  const introDone = useExperience((s) => s.introDone);
  const focusTarget = useExperience((s) => s.focusTarget);
  const phase = useExperience((s) => s.phase);
  const openPanel = useExperience((s) => s.openPanel);
  const tourActive = useExperience((s) => s.tourActive);
  const focusOn = useExperience((s) => s.focusOn);
  const clearFocus = useExperience((s) => s.clearFocus);
  const showPanel = useExperience((s) => s.showPanel);
  const startTour = useExperience((s) => s.startTour);
  const stopTour = useExperience((s) => s.stopTour);
  const exitToLedger = useExperience((s) => s.exitToLedger);
  const navMode = useExperience((s) => s.navMode);
  const toggleNavMode = useExperience((s) => s.toggleNavMode);
  const coarse = useExperience((s) => s.profile?.isCoarsePointer ?? false);

  const moveHint =
    navMode === "walk"
      ? coarse
        ? "Joystick to move · drag to look · tap a station"
        : "WASD / arrows to move · drag to look · click a station"
      : "Drag to orbit · tap a station or a floating tech";

  const inFlight = phase === "focused" || phase === "focusing";
  const isOn = (kind: string, id?: string) =>
    inFlight &&
    focusTarget?.kind === kind &&
    (id === undefined || focusTarget.id === id);

  const toggleTarget = (kind: "station" | "about" | "contact" | "lab", id: string) => {
    stopTour();
    if (isOn(kind, id)) clearFocus();
    else focusOn({ kind, id });
  };

  return (
    <div
      inert={!introDone}
      // pointer-events-none lets drag/click/touch fall through to the canvas
      // (OrbitControls + mesh raycasting); only the interactive islands below
      // (the dock) opt back in with pointer-events-auto. z-[55] keeps the dock
      // above the z-50 panels so an open panel can't cover it on mobile.
      className={`pointer-events-none absolute inset-0 z-[55] transition-opacity duration-700 ${
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

      {/* Navigation hint, only while idle and nothing is open. */}
      {phase === "idle" && !openPanel && !tourActive && (
        <p
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-6 max-w-[92vw] -translate-x-1/2 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint"
        >
          {moveHint}
        </p>
      )}

      {/* Touch movement stick — Walk mode only. */}
      {navMode === "walk" && coarse && <WalkJoystick />}

      {/* Tour indicator. */}
      {tourActive && (
        <p
          role="status"
          className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.18em] text-accent-bright"
        >
          Auto-tour — interact anywhere to stop
        </p>
      )}

      {/* Dock. */}
      <nav
        aria-label="Deck controls"
        className="absolute inset-x-0 bottom-5 flex justify-center px-4"
      >
        <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-line bg-panel/85 px-3 py-2.5 backdrop-blur-md">
          {stations.map((station) => (
            <button
              key={station.id}
              type="button"
              onClick={() => toggleTarget("station", station.id)}
              aria-pressed={isOn("station", station.id)}
              className={`rounded-xl px-3 py-2 font-mono text-xs transition-colors ${
                isOn("station", station.id)
                  ? "bg-ink/10 text-ink"
                  : "text-ink-soft hover:bg-ink/5 hover:text-ink"
              }`}
            >
              <span
                aria-hidden="true"
                className="mr-1.5"
                style={{ color: moods[station.mood].bright }}
              >
                ◆
              </span>
              {station.index} {station.shortName}
            </button>
          ))}

          <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />

          <button
            type="button"
            onClick={() => toggleTarget("about", "about")}
            aria-pressed={isOn("about")}
            className={`rounded-xl px-3 py-2 font-mono text-xs transition-colors ${
              isOn("about")
                ? "bg-ink/10 text-ink"
                : "text-ink-soft hover:bg-ink/5 hover:text-ink"
            }`}
          >
            About
          </button>
          <button
            type="button"
            onClick={() => {
              stopTour();
              showPanel("toolbox");
            }}
            aria-pressed={openPanel === "toolbox"}
            className="rounded-xl px-3 py-2 font-mono text-xs text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
          >
            Toolbox
          </button>
          <button
            type="button"
            onClick={() => toggleTarget("contact", "contact")}
            aria-pressed={isOn("contact")}
            className={`rounded-xl px-3 py-2 font-mono text-xs transition-colors ${
              isOn("contact")
                ? "bg-ink/10 text-ink"
                : "text-ink-soft hover:bg-ink/5 hover:text-ink"
            }`}
          >
            Contact
          </button>

          <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />

          <button
            type="button"
            onClick={toggleNavMode}
            aria-pressed={navMode === "walk"}
            title={
              navMode === "walk"
                ? "Walking — switch to orbit view"
                : "Orbit view — switch to first-person walking"
            }
            className={`rounded-xl px-3 py-2 font-mono text-xs transition-colors ${
              navMode === "walk"
                ? "bg-ink/10 text-accent-bright"
                : "text-ink-soft hover:bg-ink/5 hover:text-ink"
            }`}
          >
            {navMode === "walk" ? "Walking" : "Walk"}
          </button>
          <button
            type="button"
            onClick={() => (tourActive ? stopTour() : startTour())}
            aria-pressed={tourActive}
            className={`rounded-xl px-3 py-2 font-mono text-xs transition-colors ${
              tourActive
                ? "bg-ink/10 text-accent-bright"
                : "text-ink-soft hover:bg-ink/5 hover:text-ink"
            }`}
          >
            {tourActive ? "Stop tour" : "Tour"}
          </button>
          <button
            type="button"
            onClick={() => toggleTarget("lab", "lab")}
            aria-pressed={isOn("lab")}
            className={`rounded-xl px-3 py-2 font-mono text-xs transition-colors ${
              isOn("lab")
                ? "bg-ink/10 text-accent-bright"
                : "text-ink-soft hover:bg-ink/5 hover:text-ink"
            }`}
          >
            Lab
          </button>
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
