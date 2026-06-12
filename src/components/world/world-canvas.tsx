"use client";

import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import { useExperience } from "@/lib/experience-store";
import { worldPalette } from "@/lib/moods";
import { CameraRig } from "@/components/world/camera-rig";
import { Effects } from "@/components/world/effects";
import { HoloCore } from "@/components/world/holo-core";
import { Lighting } from "@/components/world/lighting";
import { Particles } from "@/components/world/particles";
import { ProjectStations } from "@/components/world/project-station";
import { Room } from "@/components/world/room";

/**
 * Canvas root. Only ever mounted client-side (dynamic ssr:false in
 * ops-deck). DPR and effects degrade through the quality tiers, and
 * PerformanceMonitor walks quality down live if the GPU can't keep up.
 */
export function WorldCanvas() {
  const quality = useExperience((s) => s.quality);
  const setQuality = useExperience((s) => s.setQuality);

  const dpr: [number, number] =
    quality === "high" ? [1, 2] : quality === "medium" ? [1, 1.5] : [0.75, 1];

  return (
    <Canvas
      shadows={quality !== "low"}
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
          <Room />
          <HoloCore />
          <Particles />
          <ProjectStations />
          <Effects />
        </Suspense>
      </PerformanceMonitor>
    </Canvas>
  );
}
