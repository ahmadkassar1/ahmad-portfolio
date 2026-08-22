import { create } from "zustand";
import type { DeviceProfile, Quality } from "@/lib/device-profile";

export type Mode = "ledger" | "world";
export type CameraPhase =
  | "intro"
  | "idle"
  | "focusing"
  | "focused"
  | "returning";
export type PanelKind = "project" | "tech" | "about" | "contact" | "toolbox" | "lab";
export type TargetKind = "station" | "tech" | "about" | "contact" | "lab";
export type FocusTarget = { kind: TargetKind; id: string };
export type NavMode = "orbit" | "walk";

const PANEL_FOR_KIND: Record<TargetKind, PanelKind> = {
  station: "project",
  tech: "tech",
  about: "about",
  contact: "contact",
  lab: "lab",
};

export const TOUR_STOPS: FocusTarget[] = [
  { kind: "station", id: "pipeline" },
  { kind: "station", id: "qr-menu" },
  { kind: "station", id: "publishing" },
  { kind: "station", id: "storefront" },
  { kind: "about", id: "about" },
  { kind: "contact", id: "contact" },
  { kind: "lab", id: "lab" },
];

type ExperienceState = {
  mode: Mode;
  profile: DeviceProfile | null;
  quality: Quality;
  ambientStill: boolean;
  phase: CameraPhase;
  introDone: boolean;
  navMode: NavMode;
  focusTarget: FocusTarget | null;
  hoveredTarget: FocusTarget | null;
  openPanel: PanelKind | null;
  tourActive: boolean;
  tourIndex: number;

  setProfile: (profile: DeviceProfile) => void;
  setNavMode: (mode: NavMode) => void;
  toggleNavMode: () => void;
  setQuality: (quality: Quality) => void;
  enterWorld: () => void;
  exitToLedger: () => void;
  finishIntro: () => void;
  focusOn: (target: FocusTarget) => void;
  focusStation: (id: string) => void;
  clearFocus: () => void;
  arriveAtTarget: () => void;
  arriveHome: () => void;
  setHovered: (target: FocusTarget | null) => void;
  showPanel: (panel: PanelKind) => void;
  closePanel: () => void;
  startTour: () => void;
  stopTour: () => void;
  advanceTour: () => void;
};

function navTransitionPatch(state: ExperienceState, mode: NavMode) {
  if (state.navMode === mode) return {};
  const focused = state.phase === "focused" || state.phase === "focusing";
  return {
    navMode: mode,
    tourActive: false,
    openPanel: focused ? null : state.openPanel,
    phase: focused ? ("returning" as CameraPhase) : state.phase,
  };
}

export const useExperience = create<ExperienceState>((set, get) => ({
  mode: "ledger",
  profile: null,
  quality: "medium",
  ambientStill: false,
  phase: "intro",
  introDone: false,
  navMode: "orbit",
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

  setNavMode: (mode) => set((s) => navTransitionPatch(s, mode)),
  toggleNavMode: () => {
    const state = get();
    const next = state.navMode === "walk" ? "orbit" : "walk";
    set(navTransitionPatch(state, next));
  },

  enterWorld: () => {
    const { mode, profile } = get();
    if (mode === "world" || !profile?.webglOk) return;
    set({
      mode: "world",
      phase: "intro",
      introDone: false,
      focusTarget: null,
      hoveredTarget: null,
      openPanel: null,
      tourActive: false,
      tourIndex: 0,
      navMode: "orbit",
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
      tourIndex: 0,
      navMode: "orbit",
    }),

  finishIntro: () => {
    if (get().introDone) return;
    set({ introDone: true, phase: "idle" });
  },

  focusOn: (target) => {
    const { introDone, phase, focusTarget } = get();
    if (!introDone) return;
    const same =
      focusTarget?.kind === target.kind && focusTarget?.id === target.id;
    if (same && (phase === "focusing" || phase === "focused")) return;
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

  showPanel: (panel) => {
    const state = get();
    if (panel === "toolbox") set({ openPanel: panel, tourActive: false });
    else set({ openPanel: panel });
    if (state.tourActive && panel === "toolbox") get().stopTour();
  },

  closePanel: () => {
    const { openPanel, phase, focusTarget } = get();
    if (!openPanel) return;
    const belongsToFocus =
      focusTarget && openPanel === PANEL_FOR_KIND[focusTarget.kind];
    if (belongsToFocus && (phase === "focused" || phase === "focusing"))
      set({ openPanel: null, phase: "returning" });
    else set({ openPanel: null });
  },

  startTour: () => {
    const { introDone } = get();
    if (!introDone) return;
    set({ tourActive: true, tourIndex: 0, openPanel: null });
    get().focusOn(TOUR_STOPS[0]);
  },

  stopTour: () => set({ tourActive: false }),

  advanceTour: () => {
    const { tourActive, tourIndex } = get();
    if (!tourActive) return;
    const next = tourIndex + 1;
    if (next >= TOUR_STOPS.length) {
      set({ tourActive: false, tourIndex: 0 });
      get().clearFocus();
      return;
    }
    set({ tourIndex: next });
    get().focusOn(TOUR_STOPS[next]);
  },
}));
