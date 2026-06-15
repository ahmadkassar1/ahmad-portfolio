"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import * as THREE from "three";
import { labArea } from "@/data/areas";
import { makeLabelTexture } from "@/lib/canvas-textures";
import { useExperience } from "@/lib/experience-store";
import { worldPalette } from "@/lib/moods";

/**
 * The Lab pod — a self-contained experiment capsule floating in the front
 * gap of the deck. On-brand with the holo core (accent-lit wireframe shell)
 * but smaller and clickable: three tiny "experiments" orbit an emissive
 * heart inside a slowly spinning frame. Clicking it (or the HUD's Lab tab)
 * flies the camera over and opens the Lab panel — same focus pattern as the
 * project stations, so the UI and the scene stay in sync.
 */
export function LabStation() {
  const groupRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const motesRef = useRef<THREE.Group>(null);
  const labelRef = useRef<THREE.Group>(null);
  const trimRef = useRef<THREE.MeshStandardMaterial>(null);

  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const camera = useThree((s) => s.camera);
  const focusOn = useExperience((s) => s.focusOn);
  const setHoveredTarget = useExperience((s) => s.setHovered);
  const isFocused = useExperience((s) => s.focusTarget?.kind === "lab");

  const labelTexture = useMemo(
    () => makeLabelTexture({ text: "Lab", sub: "Experiments" }),
    [],
  );
  useEffect(() => () => labelTexture.dispose(), [labelTexture]);

  // Three small orbiting experiment shapes (radius, speed, phase, kind).
  const motes = useMemo(
    () => [
      { r: 0.46, speed: 0.9, phase: 0.0, kind: 0 },
      { r: 0.5, speed: -0.7, phase: 2.1, kind: 1 },
      { r: 0.42, speed: 1.1, phase: 4.0, kind: 2 },
    ],
    [],
  );

  useFrame((state, delta) => {
    const still = useExperience.getState().ambientStill;
    const t = state.clock.elapsedTime;

    if (groupRef.current && !still) {
      groupRef.current.position.y = labArea.position[1] + Math.sin(t * 0.7) * 0.06;
    }
    if (shellRef.current && !still) shellRef.current.rotation.y += delta * 0.18;
    if (ringRef.current && !still) {
      ringRef.current.rotation.z += delta * 0.5;
      ringRef.current.rotation.x = Math.PI / 2.4;
    }
    if (motesRef.current) {
      motesRef.current.children.forEach((child, i) => {
        const m = motes[i];
        const a = m.phase + (still ? 0 : t * m.speed);
        child.position.set(Math.cos(a) * m.r, Math.sin(a * 1.3) * 0.12, Math.sin(a) * m.r);
        if (!still) child.rotation.y += delta * 1.2;
      });
    }
    // Label always faces the camera so "LAB" reads from any angle.
    if (labelRef.current) labelRef.current.quaternion.copy(camera.quaternion);

    // Hover/focus emissive + scale ramp, eased in place.
    const target = isFocused ? 2.0 : hovered ? 1.4 : 0.7;
    if (trimRef.current) {
      trimRef.current.emissiveIntensity = THREE.MathUtils.damp(
        trimRef.current.emissiveIntensity,
        target,
        8,
        delta,
      );
    }
    if (groupRef.current) {
      const s = isFocused ? 1.15 : hovered ? 1.08 : 1;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.damp(groupRef.current.scale.x, s, 8, delta),
      );
    }
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    setHoveredTarget({ kind: "lab", id: "lab" });
  };
  const onOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
    setHoveredTarget(null);
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    focusOn({ kind: "lab", id: "lab" });
  };

  return (
    <group ref={groupRef} position={labArea.position}>
      <group onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
        {/* Invisible collider so the whole capsule is an easy target. */}
        <mesh visible={false}>
          <sphereGeometry args={[0.95, 12, 12]} />
          <meshBasicMaterial />
        </mesh>

        {/* Wireframe shell. */}
        <mesh ref={shellRef}>
          <icosahedronGeometry args={[0.72, 0]} />
          <meshStandardMaterial
            color={worldPalette.accent}
            emissive={worldPalette.accent}
            emissiveIntensity={0.5}
            wireframe
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Emissive heart. */}
        <mesh>
          <icosahedronGeometry args={[0.22, 0]} />
          <meshBasicMaterial color={worldPalette.accentBright} />
        </mesh>
        <pointLight color={worldPalette.accent} intensity={3} distance={5} decay={2} />

        {/* Spinning frame ring (the hover/focus glow lives here). */}
        <mesh ref={ringRef}>
          <torusGeometry args={[0.92, 0.018, 8, 56]} />
          <meshStandardMaterial
            ref={trimRef}
            color={worldPalette.accentBright}
            emissive={worldPalette.accentBright}
            emissiveIntensity={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Orbiting experiments. */}
        <group ref={motesRef}>
          {motes.map((m, i) => (
            <mesh key={i}>
              {m.kind === 0 ? (
                <octahedronGeometry args={[0.08, 0]} />
              ) : m.kind === 1 ? (
                <boxGeometry args={[0.11, 0.11, 0.11]} />
              ) : (
                <tetrahedronGeometry args={[0.1, 0]} />
              )}
              <meshStandardMaterial
                color="#171a22"
                emissive={worldPalette.accentBright}
                emissiveIntensity={0.9}
                roughness={0.4}
                metalness={0.3}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* Always-visible billboarded label. */}
      <group ref={labelRef} position={[0, 1.25, 0]}>
        <mesh raycast={() => null}>
          <planeGeometry args={[1.1, 0.34]} />
          <meshBasicMaterial map={labelTexture} transparent depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}
