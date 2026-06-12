"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32, range } from "@/lib/prng";
import { useExperience } from "@/lib/experience-store";
import { STATION_RADIUS } from "@/data/stations";

const COUNT_BY_QUALITY = { high: 360, medium: 220, low: 90 } as const;

/**
 * Ambient dust: a single Points cloud drifting slowly upward, wrapping
 * at the ceiling. Positions are seeded so the cloud is identical every
 * visit. The drift loop touches the buffer in place — no allocations —
 * and parks entirely for reduced-motion visitors.
 */
export function Particles() {
  const quality = useExperience((s) => s.quality);
  const count = COUNT_BY_QUALITY[quality];
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const rand = mulberry32(42);
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const spread = STATION_RADIUS + 5;
    for (let i = 0; i < count; i++) {
      positions[i * 3] = range(rand, -spread, spread);
      positions[i * 3 + 1] = range(rand, 0.1, 6);
      positions[i * 3 + 2] = range(rand, -spread, spread);
      speeds[i] = range(rand, 0.04, 0.16);
    }
    return { positions, speeds };
  }, [count]);

  useFrame((_, delta) => {
    if (useExperience.getState().ambientStill) return;
    const points = pointsRef.current;
    if (!points) return;
    const attr = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      let y = arr[i * 3 + 1] + speeds[i] * delta;
      if (y > 6) y = 0.1;
      arr[i * 3 + 1] = y;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} key={count}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#7396ff"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  );
}
