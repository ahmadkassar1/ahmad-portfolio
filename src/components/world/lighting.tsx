"use client";

import { useExperience } from "@/lib/experience-store";
import { moods } from "@/lib/moods";
import { stations, stationPosition } from "@/data/stations";

/**
 * Deck lighting: a dim ambient wash, one shadow-casting key from high
 * above the core, a cool fill, and a small mood-tinted pool over each
 * station. Shadow resolution steps down with quality; low tier disables
 * shadows entirely at the Canvas level.
 */
export function Lighting() {
  const quality = useExperience((s) => s.quality);
  const shadowMap = quality === "high" ? 2048 : 1024;

  return (
    <>
      <ambientLight intensity={0.22} color="#aebaff" />
      <directionalLight
        position={[4, 12, 6]}
        intensity={1.1}
        color="#dfe6ff"
        castShadow={quality !== "low"}
        shadow-mapSize-width={shadowMap}
        shadow-mapSize-height={shadowMap}
        shadow-camera-near={2}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-6, 5, -4]} intensity={0.25} color="#4d7cff" />

      {stations.map((station) => {
        const [x, , z] = stationPosition(station);
        return (
          <pointLight
            key={station.id}
            position={[x, 2.6, z]}
            intensity={2.2}
            distance={5.5}
            decay={2}
            color={moods[station.mood].color}
          />
        );
      })}
    </>
  );
}
