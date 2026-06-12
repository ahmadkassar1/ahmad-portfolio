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
 * Camera phases: intro → idle ⇄ (focusing → focused → returning).
 * Guards below keep the rig from wedging: you can't focus before the
 * intro lands, and switching stations mid-return simply retargets.
 */
export type Mode = "ledger" | "world";
export type CameraPhase =
  | "intro"
  | "idle"
  | "focusing"
  | "focused"
  | "returning";
export type PanelKind = "project" | "about" | "contact" | "toolbox";

type ExperienceState = {
  mode: Mode;
  profile: DeviceProfile | null;
  quality: Quality;
  /** Reduced-motion visitor opted into the world: ambient motion stills. */
  ambientStill: boolean;
  phase: CameraPhase;
  introDone: boolean;
  focusedStation: string | null;
  hoveredStation: string | null;
  openPanel: PanelKind | null;

  setProfile: (profile: DeviceProfile) => void;
  setQuality: (quality: Quality) => void;
  enterWorld: () => void;
  exitToLedger: () => void;
  finishIntro: () => void;
  focusStation: (id: string) => void;
  clearFocus: () => void;
  /** Camera rig reports arrival at the focused station. */
  arriveAtStation: () => void;
  /** Camera rig reports it returned home. */
  arriveHome: () => void;
  setHovered: (id: string | null) => void;
  showPanel: (panel: PanelKind) => void;
  closePanel: () => void;
};

export const useExperience = create<ExperienceState>((set, get) => ({
  mode: "ledger",
  profile: null,
  quality: "medium",
  ambientStill: false,
  phase: "intro",
  introDone: false,
  focusedStation: null,
  hoveredStation: null,
  openPanel: null,

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
      focusedStation: null,
      openPanel: null,
    });
  },

  exitToLedger: () =>
    set({
      mode: "ledger",
      phase: "intro",
      introDone: false,
      focusedStation: null,
      hoveredStation: null,
      openPanel: null,
    }),

  finishIntro: () => {
    // Idempotent — the rig may report arrival across several frames.
    if (get().introDone) return;
    set({ introDone: true, phase: "idle" });
  },

  focusStation: (id) => {
    const { introDone, phase, focusedStation } = get();
    // Guard: no focusing until the intro has landed.
    if (!introDone) return;
    if (focusedStation === id && (phase === "focusing" || phase === "focused"))
      return;
    // Valid from idle, focused (station switch), and returning (retarget
    // mid-flight) — the rig just damps toward the new target.
    set({
      focusedStation: id,
      phase: "focusing",
      // Panel content swaps instantly on station switch.
      openPanel: phase === "focused" ? "project" : null,
    });
  },

  clearFocus: () => {
    const { phase } = get();
    if (phase !== "focusing" && phase !== "focused") return;
    set({ phase: "returning", openPanel: null });
  },

  arriveAtStation: () => {
    if (get().phase !== "focusing") return;
    set({ phase: "focused", openPanel: "project" });
  },

  arriveHome: () => {
    if (get().phase !== "returning") return;
    set({ phase: "idle", focusedStation: null });
  },

  setHovered: (id) => set({ hoveredStation: id }),

  showPanel: (panel) => set({ openPanel: panel }),

  closePanel: () => {
    const { openPanel, phase } = get();
    if (!openPanel) return;
    // Closing the project panel also releases the camera.
    if (openPanel === "project" && (phase === "focused" || phase === "focusing"))
      set({ openPanel: null, phase: "returning" });
    else set({ openPanel: null });
  },
}));
