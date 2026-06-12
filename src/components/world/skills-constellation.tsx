"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useCursor, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { techs, type Tech } from "@/data/tech";
import { makeLabelTexture } from "@/lib/canvas-textures";
import { useExperience } from "@/lib/experience-store";
import { techWorldPositions } from "@/lib/tech-positions";

/**
 * The skills constellation: every technology orbits the holo core as a
 * living symbolic object. Orbits freeze while any tech is focused (so
 * the camera's target holds still) and for reduced-motion visitors —
 * frozen objects stay fully interactive. Hovering names the object;
 * clicking flies the camera in and opens the tech panel.
 */
export function SkillsConstellation() {
  return (
    <>
      {techs.map((tech) => (
        <TechObject key={tech.id} tech={tech} />
      ))}
    </>
  );
}

function orbitPosition(tech: Tech, time: number, out: THREE.Vector3) {
  const angle = tech.orbit.phase + time * tech.orbit.speed;
  out.set(
    Math.cos(angle) * tech.orbit.radius,
    tech.orbit.height + Math.sin(time * 0.7 + tech.orbit.phase) * 0.08,
    Math.sin(angle) * tech.orbit.radius,
  );
  return out;
}

function TechObject({ tech }: { tech: Tech }) {
  const groupRef = useRef<THREE.Group>(null);
  // Own orbit clock — accumulates only while orbiting is allowed, so a
  // freeze is a true pause instead of a jump on resume.
  const timeRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const focusOn = useExperience((s) => s.focusOn);
  const setHoveredTarget = useExperience((s) => s.setHovered);
  const isFocused = useExperience(
    (s) => s.focusTarget?.kind === "tech" && s.focusTarget.id === tech.id,
  );

  const labelTexture = useMemo(
    () => makeLabelTexture({ text: tech.name, sub: tech.level }),
    [tech],
  );
  useEffect(() => () => labelTexture.dispose(), [labelTexture]);

  // Seed the rig-readable position before any frame runs, and clean up
  // so the rig can never chase a stale entry.
  useEffect(() => {
    const v = orbitPosition(tech, 0, new THREE.Vector3());
    techWorldPositions.set(tech.id, v);
    return () => {
      techWorldPositions.delete(tech.id);
    };
  }, [tech]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const s = useExperience.getState();

    // Orbit unless stilled or any tech holds the camera's attention.
    const frozen = s.ambientStill || s.focusTarget?.kind === "tech";
    if (!frozen) timeRef.current += delta;
    orbitPosition(tech, timeRef.current, group.position);
    const stored = techWorldPositions.get(tech.id);
    if (stored) stored.copy(group.position);

    if (!frozen) group.rotation.y += delta * 0.4;

    // Hover/focus feedback: scale and emissive ramp, eased in place.
    // The shape's standard materials are reached through the group so
    // render never touches them.
    const targetScale = isFocused ? 1.3 : hovered ? 1.18 : 1;
    group.scale.setScalar(
      THREE.MathUtils.damp(group.scale.x, targetScale, 8, delta),
    );
    const glow = isFocused ? 1.6 : hovered ? 1.1 : 0.35;
    group.traverse((child) => {
      const material = (child as THREE.Mesh).material;
      if (material instanceof THREE.MeshStandardMaterial)
        material.emissiveIntensity = THREE.MathUtils.damp(
          material.emissiveIntensity,
          glow,
          8,
          delta,
        );
    });
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    setHoveredTarget({ kind: "tech", id: tech.id });
  };
  const onOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
    setHoveredTarget(null);
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    focusOn({ kind: "tech", id: tech.id });
  };

  return (
    <group ref={groupRef}>
      <group onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
        <TechShape tech={tech} />
      </group>
      {/* Name plate, revealed on hover/focus — faces the camera enough
          from any orbit angle thanks to the slow yaw. */}
      <mesh position={[0, 0.55, 0]} visible={hovered || isFocused}>
        <planeGeometry args={[1.05, 0.33]} />
        <meshBasicMaterial map={labelTexture} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Shared material props — every body mesh ramps together via the
 *  parent group's traversal. R3F disposes declarative materials. */
function BodyMaterial({ color }: { color: string }) {
  return (
    <meshStandardMaterial
      color="#171a22"
      emissive={color}
      emissiveIntensity={0.35}
      roughness={0.45}
      metalness={0.3}
    />
  );
}

/** One symbolic procedural shape per technology. */
function TechShape({ tech }: { tech: Tech }) {
  const c = tech.color;
  switch (tech.shape) {
    case "atom": // React — nucleus + two crossed electron rings
      return (
        <group>
          <mesh>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial color={c} />
          </mesh>
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.24, 0.018, 8, 40]} />
            <BodyMaterial color={c} />
          </mesh>
          <mesh rotation={[-Math.PI / 3, 0, Math.PI / 3]}>
            <torusGeometry args={[0.24, 0.018, 8, 40]} />
            <BodyMaterial color={c} />
          </mesh>
        </group>
      );
    case "shield": // Angular
      return (
        <mesh>
          <octahedronGeometry args={[0.24, 0]} />
          <BodyMaterial color={c} />
        </mesh>
      );
    case "ring": // Next.js — ring with inner disc
      return (
        <group>
          <mesh>
            <torusGeometry args={[0.2, 0.045, 10, 40]} />
            <BodyMaterial color={c} />
          </mesh>
          <mesh>
            <circleGeometry args={[0.09, 24]} />
            <meshBasicMaterial color={c} />
          </mesh>
        </group>
      );
    case "block": // TypeScript
      return (
        <RoundedBox args={[0.32, 0.32, 0.32]} radius={0.05}>
          <BodyMaterial color={c} />
        </RoundedBox>
      );
    case "waves": // Tailwind — twin slanted slats
      return (
        <group rotation={[0, 0, -0.25]}>
          <mesh position={[-0.06, 0.07, 0]}>
            <boxGeometry args={[0.36, 0.07, 0.1]} />
            <BodyMaterial color={c} />
          </mesh>
          <mesh position={[0.06, -0.07, 0]}>
            <boxGeometry args={[0.36, 0.07, 0.1]} />
            <BodyMaterial color={c} />
          </mesh>
        </group>
      );
    case "bolt": // Supabase — twin offset cones
      return (
        <group>
          <mesh position={[0.05, 0.1, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.13, 0.24, 4]} />
            <BodyMaterial color={c} />
          </mesh>
          <mesh position={[-0.05, -0.1, 0]}>
            <coneGeometry args={[0.13, 0.24, 4]} />
            <BodyMaterial color={c} />
          </mesh>
        </group>
      );
    case "knot": // RxJS — a stream tied in time
      return (
        <mesh>
          <torusKnotGeometry args={[0.16, 0.05, 64, 8]} />
          <BodyMaterial color={c} />
        </mesh>
      );
    case "crystal": // C/C++
      return (
        <mesh>
          <icosahedronGeometry args={[0.22, 0]} />
          <BodyMaterial color={c} />
        </mesh>
      );
    case "drum": // SQL — stacked cylinders
      return (
        <group>
          <mesh position={[0, 0.09, 0]}>
            <cylinderGeometry args={[0.17, 0.17, 0.12, 20]} />
            <BodyMaterial color={c} />
          </mesh>
          <mesh position={[0, -0.07, 0]}>
            <cylinderGeometry args={[0.17, 0.17, 0.12, 20]} />
            <BodyMaterial color={c} />
          </mesh>
          <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.1, 0.16, 20]} />
            <meshBasicMaterial color={c} />
          </mesh>
        </group>
      );
    case "branch": // Git — a tiny commit graph
      return (
        <group>
          <mesh>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshBasicMaterial color={c} />
          </mesh>
          <mesh position={[0.1, 0.12, 0]} rotation={[0, 0, -0.7]}>
            <cylinderGeometry args={[0.018, 0.018, 0.26, 6]} />
            <BodyMaterial color={c} />
          </mesh>
          <mesh position={[0, -0.14, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.2, 6]} />
            <BodyMaterial color={c} />
          </mesh>
          <mesh position={[0.2, 0.22, 0]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshBasicMaterial color={c} />
          </mesh>
          <mesh position={[0, -0.26, 0]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshBasicMaterial color={c} />
          </mesh>
        </group>
      );
  }
}
