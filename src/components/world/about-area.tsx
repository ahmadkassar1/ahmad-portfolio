"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useCursor, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { aboutArea } from "@/data/areas";
import { makeLabelTexture, makeScreenTexture } from "@/lib/canvas-textures";
import { useExperience } from "@/lib/experience-store";
import { worldPalette } from "@/lib/moods";

/**
 * The About desk — the person behind the deck as a physical place: a
 * workstation with a lit monitor, keyboard, coffee, and a book stack,
 * sitting in the left wing of the ring. Clicking anything on it flies
 * the camera over and opens the About panel.
 */
export function AboutArea() {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const focusOn = useExperience((s) => s.focusOn);
  const setHoveredTarget = useExperience((s) => s.setHovered);
  const isFocused = useExperience((s) => s.focusTarget?.kind === "about");

  const screenTexture = useMemo(
    () => makeScreenTexture({ seed: 27, accent: worldPalette.accent, rows: 8 }),
    [],
  );
  const labelTexture = useMemo(
    () => makeLabelTexture({ text: "About", sub: "The person behind it" }),
    [],
  );
  useEffect(
    () => () => {
      screenTexture.dispose();
      labelTexture.dispose();
    },
    [screenTexture, labelTexture],
  );

  const glowRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((_, delta) => {
    const material = glowRef.current;
    if (!material) return;
    material.emissiveIntensity = THREE.MathUtils.damp(
      material.emissiveIntensity,
      isFocused ? 1.4 : hovered ? 1.0 : 0.45,
      8,
      delta,
    );
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    setHoveredTarget({ kind: "about", id: "about" });
  };
  const onOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
    setHoveredTarget(null);
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    focusOn({ kind: "about", id: "about" });
  };

  return (
    <group position={aboutArea.position} rotation={[0, aboutArea.rotation, 0]}>
      <group onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
        {/* Desk top + legs. */}
        <RoundedBox args={[2.2, 0.08, 1.1]} radius={0.02} position={[0, 0.78, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={worldPalette.panel} roughness={0.7} metalness={0.25} />
        </RoundedBox>
        {(
          [
            [-1.0, 0.39, 0.45],
            [1.0, 0.39, 0.45],
            [-1.0, 0.39, -0.45],
            [1.0, 0.39, -0.45],
          ] as const
        ).map((p, i) => (
          <mesh key={i} position={p} castShadow>
            <boxGeometry args={[0.07, 0.78, 0.07]} />
            <meshStandardMaterial color="#0f1117" roughness={0.85} metalness={0.3} />
          </mesh>
        ))}

        {/* Monitor on a stand, screen alive with seeded activity rows. */}
        <mesh position={[0, 0.94, -0.28]}>
          <boxGeometry args={[0.1, 0.22, 0.1]} />
          <meshStandardMaterial color="#0f1117" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.28, -0.28]} castShadow>
          <boxGeometry args={[1.18, 0.7, 0.06]} />
          <meshStandardMaterial
            ref={glowRef}
            color="#0f1117"
            emissive={worldPalette.accent}
            emissiveIntensity={0.45}
            roughness={0.5}
          />
        </mesh>
        <mesh position={[0, 1.28, -0.245]}>
          <planeGeometry args={[1.06, 0.6]} />
          <meshBasicMaterial map={screenTexture} />
        </mesh>

        {/* Keyboard, mug with a torus handle, book stack. */}
        <mesh position={[0, 0.84, 0.18]}>
          <boxGeometry args={[0.62, 0.03, 0.22]} />
          <meshStandardMaterial color="#1c1f27" roughness={0.6} />
        </mesh>
        <group position={[0.62, 0.88, 0.16]}>
          <mesh>
            <cylinderGeometry args={[0.07, 0.06, 0.12, 16]} />
            <meshStandardMaterial color="#c9a35c" roughness={0.5} />
          </mesh>
          <mesh position={[0.085, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.045, 0.012, 8, 16]} />
            <meshStandardMaterial color="#c9a35c" roughness={0.5} />
          </mesh>
        </group>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            position={[-0.72, 0.85 + i * 0.045, 0.05]}
            rotation={[0, i * 0.18 - 0.1, 0]}
            castShadow
          >
            <boxGeometry args={[0.34, 0.04, 0.24]} />
            <meshStandardMaterial
              color={["#22345f", "#2c4536", "#4f2f2a"][i]}
              roughness={0.8}
            />
          </mesh>
        ))}

        {/* Desk lamp — the one extra light this corner earns. */}
        <mesh position={[-0.95, 1.0, -0.35]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
          <meshStandardMaterial color="#1c1f27" roughness={0.7} />
        </mesh>
        <pointLight position={[-0.8, 1.25, -0.25]} intensity={1.6} distance={3.2} decay={2} color="#ffe2b8" />
      </group>

      {/* Floating label, revealed on hover. */}
      <mesh position={[0, 1.95, 0]} visible={hovered || isFocused}>
        <planeGeometry args={[1.4, 0.44]} />
        <meshBasicMaterial map={labelTexture} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}
