"use client";

import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  PerformanceMonitor,
  Sparkles,
} from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import { useExperience } from "@/lib/experience-store";
import { worldPalette } from "@/lib/moods";
import { STATION_RADIUS } from "@/data/stations";
import { AboutArea } from "@/components/world/about-area";
import { CameraRig } from "@/components/world/camera-rig";
import { ContactTerminal } from "@/components/world/contact-terminal";
import { Effects } from "@/components/world/effects";
import { HoloCore } from "@/components/world/holo-core";
import { Lighting } from "@/components/world/lighting";
import { Particles } from "@/components/world/particles";
import { ProjectStations } from "@/components/world/project-station";
import { Room } from "@/components/world/room";
import { SkillsConstellation } from "@/components/world/skills-constellation";

/**
 * Image-based lighting, baked once from a handful of cool light cards
 * (no HDRI fetch — the CSP pins connect-src to 'self', so everything is
 * procedural). Gives the metallic trims and tech shapes something to
 * reflect instead of reading flat black. frames={1} renders the env map
 * a single time; the cards never move.
 */
function WorldEnvironment() {
  return (
    <Environment frames={1} resolution={256} environmentIntensity={0.5} background={false}>
      <Lightformer
        form="rect"
        intensity={2.2}
        color={worldPalette.accentBright}
        position={[0, 5, -9]}
        scale={[12, 8, 1]}
      />
      <Lightformer
        form="circle"
        intensity={1.4}
        color="#aebaff"
        position={[-9, 4, 5]}
        scale={6}
      />
      <Lightformer
        form="rect"
        intensity={1.1}
        color={worldPalette.accent}
        position={[9, 3, 5]}
        scale={[6, 6, 1]}
      />
      <Lightformer
        form="ring"
        intensity={1.6}
        color={worldPalette.accentBright}
        position={[0, -4, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={5}
      />
    </Environment>
  );
}

/**
 * Canvas root. Only ever mounted client-side (dynamic ssr:false in
 * ops-deck). DPR and effects degrade through the quality tiers, and
 * PerformanceMonitor walks quality down live if the GPU can't keep up.
 */
export function WorldCanvas() {
  const quality = useExperience((s) => s.quality);
  const setQuality = useExperience((s) => s.setQuality);
  const ambientStill = useExperience((s) => s.ambientStill);

  const dpr: [number, number] =
    quality === "high" ? [1, 2] : quality === "medium" ? [1, 1.5] : [0.75, 1];

  // Everything above the "low" tier gets the richer dressing (IBL, contact
  // shadows, sparkles). PerformanceMonitor can ratchet quality down live,
  // which unmounts these automatically on a struggling GPU.
  const rich = quality !== "low";

  return (
    <Canvas
      // "percentage" = PCFShadowMap. The boolean/default would request
      // PCFSoftShadowMap, which three 0.184 deprecated and warns about every
      // frame before falling back to exactly this — so this is the same
      // picture without the console spam.
      shadows={rich ? "percentage" : false}
      dpr={dpr}
      gl={{
        antialias: quality !== "low",
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 14, 22], fov: 42, near: 0.1, far: 80 }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(worldPalette.ground);
        scene.fog = new THREE.Fog(worldPalette.fog, 14, 38);
      }}
      // Clicking empty space (no object hit) releases the camera and stops
      // the tour. clearFocus no-ops unless focusing/focused, so a missed
      // click while idle is harmless. Object onClicks call stopPropagation,
      // so this only fires for genuine empty-space clicks.
      onPointerMissed={() => {
        const s = useExperience.getState();
        s.stopTour();
        s.clearFocus();
      }}
    >
      <PerformanceMonitor
        onDecline={() => {
          const q = useExperience.getState().quality;
          if (q === "high") setQuality("medium");
          else if (q === "medium") setQuality("low");
        }}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <Lighting />
          {rich && <WorldEnvironment />}
          <Room />
          {/* Soft baked contact shadow under the whole deck — grounds the
              floating core, pedestals, and columns far more cheaply than
              raising the directional shadow-map resolution. frames={1}
              renders the shadow once; after that each frame is just a
              no-op count check, so there's no recurring GPU cost. */}
          {rich && (
            <ContactShadows
              position={[0, 0.015, 0]}
              scale={(STATION_RADIUS + 6) * 2}
              blur={2.6}
              far={6}
              opacity={0.55}
              resolution={quality === "high" ? 1024 : 512}
              frames={1}
              color="#05060a"
            />
          )}
          <HoloCore />
          {/* Holographic motes drifting around the core. speed 0 (frozen)
              for reduced-motion visitors. */}
          {rich && (
            <Sparkles
              count={quality === "high" ? 120 : 60}
              position={[0, 2.4, 0]}
              scale={[STATION_RADIUS * 1.7, 5, STATION_RADIUS * 1.7]}
              size={2.4}
              speed={ambientStill ? 0 : 0.3}
              opacity={0.5}
              color={worldPalette.accentBright}
              noise={1}
            />
          )}
          <SkillsConstellation />
          <Particles />
          <ProjectStations />
          <AboutArea />
          <ContactTerminal />
          <Effects />
        </Suspense>
      </PerformanceMonitor>
    </Canvas>
  );
}
