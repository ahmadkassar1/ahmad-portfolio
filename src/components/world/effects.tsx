"use client";

import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useExperience } from "@/lib/experience-store";

/**
 * Postprocessing: bloom lifts the emissive trims and the holo core;
 * the vignette pulls the eye to the deck's center. Skipped entirely on
 * the low tier — the composer's extra render target is the single most
 * expensive thing in the scene.
 */
export function Effects() {
  const quality = useExperience((s) => s.quality);
  if (quality === "low") return null;

  return (
    <EffectComposer multisampling={quality === "high" ? 4 : 0}>
      <Bloom
        intensity={0.55}
        luminanceThreshold={0.32}
        luminanceSmoothing={0.18}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.18} darkness={0.78} />
    </EffectComposer>
  );
}
