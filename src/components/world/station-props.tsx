"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Station } from "@/data/stations";
import { makeQrTexture, makeScreenTexture } from "@/lib/canvas-textures";
import { useExperience } from "@/lib/experience-store";
import { moods } from "@/lib/moods";

/**
 * The holographic prop floating over each pedestal — a tiny procedural
 * diorama of what the project is, one per vignette kind. Each slowly
 * bobs and yaws (stilled for reduced motion) and brightens on hover.
 */
export function StationProps({
  station,
  hovered,
}: {
  station: Station;
  hovered: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const phase = useMemo(() => station.angle * 2.3, [station]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    if (useExperience.getState().ambientStill) return;
    const t = state.clock.elapsedTime;
    group.position.y = 1.78 + Math.sin(t * 0.8 + phase) * 0.06;
    group.rotation.y = Math.sin(t * 0.3 + phase) * 0.22;
  });

  return (
    <group ref={groupRef} position={[0, 1.78, 0]}>
      {station.id === "pipeline" && <PipelineProp station={station} hovered={hovered} />}
      {station.id === "qr-menu" && <QrMenuProp station={station} hovered={hovered} />}
      {station.id === "publishing" && <PublishingProp station={station} hovered={hovered} />}
      {station.id === "storefront" && <StorefrontProp station={station} hovered={hovered} />}
    </group>
  );
}

type PropProps = { station: Station; hovered: boolean };

/** CRM pipeline: four stage blocks with a pulse running left to right. */
function PipelineProp({ station, hovered }: PropProps) {
  const mood = moods[station.mood];
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const pulse = pulseRef.current;
    if (!pulse) return;
    if (useExperience.getState().ambientStill) {
      pulse.position.x = 0;
      return;
    }
    // Sweep -0.6 → 0.6 then snap back, like a lead moving through stages.
    const t = (state.clock.elapsedTime * 0.45) % 1;
    pulse.position.x = -0.6 + t * 1.2;
  });

  return (
    <group>
      {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <boxGeometry args={[0.26, 0.34 + i * 0.05, 0.1]} />
          <meshStandardMaterial
            color={mood.dim}
            emissive={mood.color}
            emissiveIntensity={hovered ? 0.65 : 0.3}
            transparent
            opacity={0.92}
          />
        </mesh>
      ))}
      {/* Rail the pulse rides on. */}
      <mesh position={[0, -0.26, 0]}>
        <boxGeometry args={[1.5, 0.02, 0.02]} />
        <meshBasicMaterial color={mood.dim} />
      </mesh>
      <mesh ref={pulseRef} position={[-0.6, -0.26, 0]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color={mood.bright} />
      </mesh>
    </group>
  );
}

/** QR ordering: a phone-ish slab with a painted QR plate. */
function QrMenuProp({ station, hovered }: PropProps) {
  const mood = moods[station.mood];
  const qrTexture = useMemo(() => makeQrTexture(7, mood.color), [mood]);
  useEffect(() => () => qrTexture.dispose(), [qrTexture]);

  return (
    <group>
      <mesh>
        <boxGeometry args={[0.55, 0.95, 0.05]} />
        <meshStandardMaterial
          color="#14161c"
          emissive={mood.color}
          emissiveIntensity={hovered ? 0.35 : 0.12}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, 0.08, 0.03]}>
        <planeGeometry args={[0.42, 0.42]} />
        <meshBasicMaterial map={qrTexture} />
      </mesh>
      <mesh position={[0, -0.32, 0.03]}>
        <planeGeometry args={[0.34, 0.05]} />
        <meshBasicMaterial color={mood.color} />
      </mesh>
    </group>
  );
}

/** Publishing: a fanned stack of article "pages". */
function PublishingProp({ station, hovered }: PropProps) {
  const mood = moods[station.mood];
  const screenTexture = useMemo(
    () => makeScreenTexture({ seed: 19, accent: mood.color, rows: 7 }),
    [mood],
  );
  useEffect(() => () => screenTexture.dispose(), [screenTexture]);

  return (
    <group rotation={[0.1, 0, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[i * 0.06 - 0.06, i * 0.05 - 0.05, -i * 0.04]} rotation={[0, -0.08 * i, 0]}>
          <planeGeometry args={[0.78, 0.5]} />
          {i === 0 ? (
            <meshBasicMaterial map={screenTexture} transparent opacity={0.95} />
          ) : (
            <meshStandardMaterial
              color="#14161c"
              emissive={mood.color}
              emissiveIntensity={hovered ? 0.3 : 0.12}
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
            />
          )}
        </mesh>
      ))}
    </group>
  );
}

/** Storefront: a two-shelf rack of product blocks. */
function StorefrontProp({ station, hovered }: PropProps) {
  const mood = moods[station.mood];
  return (
    <group>
      {[0.12, -0.22].map((y, shelf) => (
        <group key={shelf} position={[0, y, 0]}>
          <mesh>
            <boxGeometry args={[0.9, 0.03, 0.3]} />
            <meshStandardMaterial color="#14161c" roughness={0.6} metalness={0.3} />
          </mesh>
          {[-0.3, 0, 0.3].map((x, i) => (
            <mesh key={i} position={[x, 0.12, 0]}>
              {(shelf + i) % 2 === 0 ? (
                <boxGeometry args={[0.16, 0.18, 0.16]} />
              ) : (
                <cylinderGeometry args={[0.08, 0.08, 0.18, 14]} />
              )}
              <meshStandardMaterial
                color={mood.dim}
                emissive={mood.color}
                emissiveIntensity={hovered ? 0.55 : 0.22}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
