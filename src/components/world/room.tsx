"use client";

import { useEffect, useMemo } from "react";
import { Stars } from "@react-three/drei";
import { makeFloorTexture } from "@/lib/canvas-textures";
import { worldPalette } from "@/lib/moods";
import { STATION_RADIUS } from "@/data/stations";

/**
 * The deck itself: a gridded floor disc dissolving into fog, a raised
 * outer rim, a ring of low columns past the stations, and a sparse star
 * field beyond everything. Geometry only — all texture is procedural.
 */
export function Room() {
  const floorTexture = useMemo(() => makeFloorTexture(), []);
  useEffect(() => () => floorTexture.dispose(), [floorTexture]);

  const columns = useMemo(() => {
    const ring: { position: [number, number, number]; rotation: number }[] = [];
    const count = 10;
    const radius = STATION_RADIUS + 4.4;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.PI / count;
      ring.push({
        position: [Math.cos(angle) * radius, 1.6, Math.sin(angle) * radius],
        rotation: -angle + Math.PI / 2,
      });
    }
    return ring;
  }, []);

  return (
    <group>
      {/* Floor disc with the radial grid. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[STATION_RADIUS + 6, 64]} />
        <meshStandardMaterial
          map={floorTexture}
          color="#ffffff"
          roughness={0.85}
          metalness={0.2}
        />
      </mesh>

      {/* Raised rim just past the columns. */}
      <mesh position={[0, 0.05, 0]}>
        <torusGeometry args={[STATION_RADIUS + 5.2, 0.06, 8, 96]} />
        <meshStandardMaterial
          color={worldPalette.accent}
          emissive={worldPalette.accent}
          emissiveIntensity={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Perimeter columns — simple boxes, fog swallows their tops. */}
      {columns.map((column, i) => (
        <mesh
          key={i}
          position={column.position}
          rotation={[0, column.rotation, 0]}
          castShadow
        >
          <boxGeometry args={[0.5, 3.2, 0.5]} />
          <meshStandardMaterial
            color={worldPalette.panel}
            roughness={0.9}
            metalness={0.3}
          />
        </mesh>
      ))}

      {/* Distant procedural star field (drei generates points, no assets). */}
      <Stars radius={50} depth={20} count={1600} factor={3} saturation={0} fade speed={0.4} />
    </group>
  );
}
