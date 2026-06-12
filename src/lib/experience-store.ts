import { create } from "zustand";
import type { DeviceProfile, Quality } from "@/lib/device-profile";

/**
 * Experience store — single source of truth for the deck.
 *
 * Mode: SSR always renders the ledger; the client may flip to "world"
 * after mount, so the first client render must match the server (mode
 * starts at "ledger"). The store is only ever read from client
 * components, so the module-scope instance never leaks across requests.
 *
 * Focus is generalized: stations, orbiting techs, the About desk, and
 * the Contact terminal are all camera targets. Camera phases:
 * intro → idle ⇄ (focusing → focused → returning). Guards keep the rig
 * from wedging: no focusing before the intro lands, and switching
 * targets mid-flight or mid-return simply retargets.
 */
export type Mode = "ledger" | "world";
export type CameraPhase =
  | "intro"
  | "idle"
  | "focusing"
  | "focused"
  | "returning";
export type PanelKind = "project" | "tech" | "about" | "contact" | "toolbox";
export type TargetKind = "station" | "tech" | "about" | "contact";
export type FocusTarget = { kind: TargetKind; id: string };

/** Which panel a camera target opens on arrival. */
const PANEL_FOR_KIND: Record<TargetKind, PanelKind> = {
  station: "project",
  tech: "tech",
  about: "about",
  contact: "contact",
};

/** Auto-tour itinerary: the four stations, then the desk, then contact. */
export const TOUR_STOPS: FocusTarget[] = [
  { kind: "station", id: "pipeline" },
  { kind: "station", id: "qr-menu" },
  { kind: "station", id: "publishing" },
  { kind: "station", id: "storefront" },
  { kind: "about", id: "about" },
  { kind: "contact", id: "contact" },
];

type ExperienceState = {
  mode: Mode;
  profile: DeviceProfile | null;
  quality: Quality;
  /** Reduced-motion visitor opted into the world: ambient motion stills
   *  and camera transitions become near-instant cuts. */
  ambientStill: boolean;
  phase: CameraPhase;
  introDone: boolean;
  focusTarget: FocusTarget | null;
  hoveredTarget: FocusTarget | null;
  openPanel: PanelKind | null;
  tourActive: boolean;
  tourIndex: number;

  setProfile: (profile: DeviceProfile) => void;
  setQuality: (quality: Quality) => void;
  enterWorld: () => void;
  exitToLedger: () => void;
  finishIntro: () => void;
  focusOn: (target: FocusTarget) => void;
  /** Convenience used by stations and the HUD dock. */
  focusStation: (id: string) => void;
  clearFocus: () => void;
  /** Camera rig reports arrival at the focused target. */
  arriveAtTarget: () => void;
  /** Camera rig reports it returned home. */
  arriveHome: () => void;
  setHovered: (target: FocusTarget | null) => void;
  showPanel: (panel: PanelKind) => void;
  closePanel: () => void;
  startTour: () => void;
  stopTour: () => void;
  advanceTour: () => void;
};

export const useExperience = create<ExperienceState>((set, get) => ({
  mode: "ledger",
  profile: null,
  quality: "medium",
  ambientStill: false,
  phase: "intro",
  introDone: false,
  focusTarget: null,
  hoveredTarget: null,
  openPanel: null,
  tourActive: false,
  tourIndex: 0,

  setProfile: (profile) =>
    set({
      profile,
      quality: profile.quality,
      ambientStill: profile.prefersReducedMotion,
    }),

  setQuality: (quality) => set({ quality }),

  enterWorld: () => {
    const { mode, profile } = get();
    if (mode === "world" || !profile?.webglOk) return;
    set({
      mode: "world",
      phase: "intro",
      introDone: false,
      focusTarget: null,
      openPanel: null,
      tourActive: false,
    });
  },

  exitToLedger: () =>
    set({
      mode: "ledger",
      phase: "intro",
      introDone: false,
      focusTarget: null,
      hoveredTarget: null,
      openPanel: null,
      tourActive: false,
    }),

  finishIntro: () => {
    // Idempotent — the rig may report arrival across several frames.
    if (get().introDone) return;
    set({ introDone: true, phase: "idle" });
  },

  focusOn: (target) => {
    const { introDone, phase, focusTarget } = get();
    // Guard: no focusing until the intro has landed.
    if (!introDone) return;
    const same =
      focusTarget?.kind === target.kind && focusTarget?.id === target.id;
    if (same && (phase === "focusing" || phase === "focused")) return;
    // Valid from idle, focused (target switch), and returning (retarget
    // mid-flight) — the rig just damps toward the new goal. The panel
    // closes for the flight; arrival opens the right one.
    set({ focusTarget: target, phase: "focusing", openPanel: null });
  },

  focusStation: (id) => get().focusOn({ kind: "station", id }),

  clearFocus: () => {
    const { phase } = get();
    if (phase !== "focusing" && phase !== "focused") return;
    set({ phase: "returning", openPanel: null });
  },

  arriveAtTarget: () => {
    const { phase, focusTarget } = get();
    if (phase !== "focusing" || !focusTarget) return;
    set({ phase: "focused", openPanel: PANEL_FOR_KIND[focusTarget.kind] });
  },

  arriveHome: () => {
    if (get().phase !== "returning") return;
    set({ phase: "idle", focusTarget: null });
  },

  setHovered: (target) => set({ hoveredTarget: target }),

  showPanel: (panel) => set({ openPanel: panel }),

  closePanel: () => {
    const { openPanel, phase, focusTarget } = get();
    if (!openPanel) return;
    // Closing the panel that belongs to the focused target also
    // releases the camera; the toolbox (no camera target) just closes.
    const belongsToFocus =
      focusTarget && openPanel === PANEL_FOR_KIND[focusTarget.kind];
    if (belongsToFocus && (phase === "focused" || phase === "focusing"))
      set({ openPanel: null, phase: "returning" });
    else set({ openPanel: null });
  },

  startTour: () => {
    const { introDone } = get();
    if (!introDone) return;
    set({ tourActive: true, tourIndex: 0 });
    get().focusOn(TOUR_STOPS[0]);
  },

  stopTour: () => set({ tourActive: false }),

  advanceTour: () => {
    const { tourActive, tourIndex } = get();
    if (!tourActive) return;
    const next = tourIndex + 1;
    if (next >= TOUR_STOPS.length) {
      // Tour complete — release the camera and end the tour.
      set({ tourActive: false, tourIndex: 0 });
      get().clearFocus();
      return;
    }
    set({ tourIndex: next });
    get().focusOn(TOUR_STOPS[next]);
  },
}));
