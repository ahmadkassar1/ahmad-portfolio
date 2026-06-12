"use client";

import { useExperience } from "@/lib/experience-store";

/**
 * Intro veil — covers the canvas while the camera flies in (the scene
 * itself is procedural, so there are no assets to wait on). Fades out
 * when the rig reports the intro landed, then unmounts via the
 * transition's pointer-events.
 */
export function WorldLoader() {
  const introDone = useExperience((s) => s.introDone);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none absolute inset-0 z-[60] flex items-center justify-center bg-[#0b0d12] transition-opacity duration-1000 ${
        introDone ? "opacity-0" : "opacity-60"
      }`}
    >
      {!introDone && (
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint">
            Ops Deck
          </p>
          <p className="mt-2 font-mono text-xs text-ink-soft">entering…</p>
        </div>
      )}
    </div>
  );
}
