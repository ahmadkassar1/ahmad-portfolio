"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, type ReactNode } from "react";
import { probeDevice } from "@/lib/device-profile";
import { useExperience } from "@/lib/experience-store";
import { EnterPill } from "@/components/world/ui/enter-pill";
import { Hud } from "@/components/world/ui/hud";
import { WorldLoader } from "@/components/world/ui/loader";
import { ProjectPanel } from "@/components/world/ui/project-panel";
import { InfoPanels } from "@/components/world/ui/info-panels";

// ssr:false is only legal inside a client component — the canvas touches
// window/WebGL at module scope and must never be evaluated on the server.
const WorldCanvas = dynamic(
  () => import("@/components/world/world-canvas").then((m) => m.WorldCanvas),
  { ssr: false },
);

/**
 * Ops Deck — the client shell that decides which experience the visitor
 * gets. SSR and the first client render always show the ledger (children);
 * after mount we probe the device and capable, motion-tolerant visitors
 * auto-enter the world. Everyone else keeps the ledger plus an opt-in pill.
 */
export function OpsDeck({ children }: { children: ReactNode }) {
  const mode = useExperience((s) => s.mode);
  const profile = useExperience((s) => s.profile);
  const setProfile = useExperience((s) => s.setProfile);
  const enterWorld = useExperience((s) => s.enterWorld);
  // The element focused before entering the world, restored on exit.
  const focusReturnRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const p = probeDevice();
    setProfile(p);
    if (p.autoEnter) useExperience.getState().enterWorld();
  }, [setProfile]);

  // Scroll lock + focus bookkeeping while the world is up.
  useEffect(() => {
    if (mode !== "world") return;
    focusReturnRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      focusReturnRef.current?.focus?.();
    };
  }, [mode]);

  // Escape unwinds one layer at a time: panel → station focus. Exiting
  // the world itself stays an explicit HUD action so a stray Escape
  // can't yank someone out of the experience.
  useEffect(() => {
    if (mode !== "world") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const s = useExperience.getState();
      if (s.openPanel) s.closePanel();
      else if (s.phase === "focused" || s.phase === "focusing") s.clearFocus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  const inWorld = mode === "world";

  return (
    <>
      {/* The ledger stays mounted so exiting the world is instant; hidden
          removes it from both paint and the a11y tree while the deck owns
          the page. */}
      <div hidden={inWorld}>{children}</div>

      {!inWorld && profile?.webglOk && <EnterPill onEnter={enterWorld} />}

      {inWorld && (
        <div className="fixed inset-0 z-40 bg-[#0b0d12]">
          {/* The scene is decoration; every action and all content it
              gestures at is reachable through the DOM HUD and panels. */}
          <div aria-hidden="true" className="absolute inset-0">
            <WorldCanvas />
          </div>
          <WorldLoader />
          <Hud />
          <ProjectPanel />
          <InfoPanels />
        </div>
      )}
    </>
  );
}
