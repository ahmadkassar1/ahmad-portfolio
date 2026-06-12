"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperience } from "@/lib/experience-store";
import { worldPalette } from "@/lib/moods";

/**
 * The holographic core at the deck's center: a slowly counter-rotating
 * wireframe icosahedron pair around an emissive heart, floating on a
 * sine bob. Purely ambient — it never reacts to input, and it stills
 * completely for reduced-motion visitors.
 */
export function HoloCore() {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (useExperience.getState().ambientStill) return;
    const t = state.clock.elapsedTime;
    if (outerRef.current) outerRef.current.rotation.y += delta * 0.12;
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.2;
      innerRef.current.rotation.x += delta * 0.07;
    }
    if (groupRef.current)
      groupRef.current.position.y = 1.7 + Math.sin(t * 0.6) * 0.08;
  });

  return (
    <group ref={groupRef} position={[0, 1.7, 0]}>
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshStandardMaterial
          color={worldPalette.accent}
          emissive={worldPalette.accent}
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.66, 0]} />
        <meshStandardMaterial
          color={worldPalette.accentBright}
          emissive={worldPalette.accentBright}
          emissiveIntensity={0.4}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshBasicMaterial color={worldPalette.accentBright} />
      </mesh>
      <pointLight color={worldPalette.accent} intensity={6} distance={7} decay={2} />

      {/* Pedestal under the core. */}
      <mesh position={[0, -1.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 1.05, 0.5, 32]} />
        <meshStandardMaterial color={worldPalette.panel} roughness={0.8} metalness={0.4} />
      </mesh>
    </group>
  );
}
