"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox, useCursor } from "@react-three/drei";
import * as THREE from "three";
import { stations, stationPosition, type Station } from "@/data/stations";
import { makeLabelTexture } from "@/lib/canvas-textures";
import { useExperience } from "@/lib/experience-store";
import { moods, worldPalette } from "@/lib/moods";
import { StationProps } from "@/components/world/station-props";

export function ProjectStations() {
  return (
    <>
      {stations.map((station) => (
        <ProjectStation key={station.id} station={station} />
      ))}
    </>
  );
}

/**
 * One project pedestal: rounded slab, mood-colored trim ring, a painted
 * label plate, and the project's holo prop floating above. Click (or the
 * HUD button — same store action) flies the camera in and opens the
 * panel. Pointer events stop propagation so overlapping hitboxes never
 * double-fire.
 */
function ProjectStation({ station }: { station: Station }) {
  const mood = moods[station.mood];
  const position = useMemo(() => stationPosition(station), [station]);
  // Pedestals face the core.
  const faceCenter = Math.atan2(-position[0], -position[2]);

  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const focusStation = useExperience((s) => s.focusStation);
  const setHoveredStation = useExperience((s) => s.setHovered);
  const isFocused = useExperience((s) => s.focusedStation === station.id);

  const labelTexture = useMemo(
    () => makeLabelTexture({ text: `${station.index} ${station.shortName}` }),
    [station],
  );
  useEffect(() => () => labelTexture.dispose(), [labelTexture]);

  const trimRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    // Ease the trim's emissive level toward its state target in place.
    const material = trimRef.current;
    if (!material) return;
    const target = isFocused ? 2.2 : hovered ? 1.5 : 0.7;
    material.emissiveIntensity = THREE.MathUtils.damp(
      material.emissiveIntensity,
      target,
      8,
      delta,
    );
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    setHoveredStation(station.id);
  };
  const onOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
    setHoveredStation(null);
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    focusStation(station.id);
  };

  return (
    <group position={position} rotation={[0, faceCenter, 0]}>
      {/* Hit area + pedestal. */}
      <group onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
        <RoundedBox args={[1.9, 0.9, 1.3]} radius={0.07} position={[0, 0.45, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={worldPalette.panel} roughness={0.75} metalness={0.35} />
        </RoundedBox>

        {/* Mood trim ring around the pedestal's waist. */}
        <mesh position={[0, 0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.18, 0.025, 8, 48]} />
          <meshStandardMaterial
            ref={trimRef}
            color={mood.color}
            emissive={mood.color}
            emissiveIntensity={0.7}
            roughness={0.35}
          />
        </mesh>

        {/* Label plate angled toward the visitor's approach. */}
        <mesh position={[0, 1.02, 0.52]} rotation={[-0.5, 0, 0]}>
          <planeGeometry args={[1.5, 0.47]} />
          <meshBasicMaterial map={labelTexture} transparent />
        </mesh>

        <StationProps station={station} hovered={hovered || isFocused} />
      </group>
    </group>
  );
}
