"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import * as THREE from "three";
import { techs, type Tech } from "@/data/tech";
import { makeLabelTexture, makeTechMark } from "@/lib/canvas-textures";
import { useExperience } from "@/lib/experience-store";
import { techWorldPositions } from "@/lib/tech-positions";

/**
 * The skills constellation: every technology orbits the holo core as a
 * recognizable logo medallion — a brand-tinted, emissive hex coin carrying
 * the tech's procedurally-drawn mark (no fetched assets; the CSP forbids
 * them). The medallion billboards to the camera so the logo always reads,
 * with a slow-spinning accent ring for life. Orbits freeze while any tech
 * is focused (so the camera's target holds still) and for reduced-motion
 * visitors — frozen medallions stay fully interactive. Hovering brightens
 * and names the object; clicking flies the camera in and opens the tech
 * panel.
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
  // The billboarded face — coin, ring, logo, and name plate all live here so
  // they turn to the camera together.
  const faceRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  // Own orbit clock — accumulates only while orbiting is allowed, so a
  // freeze is a true pause instead of a jump on resume.
  const timeRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const camera = useThree((s) => s.camera);
  const focusOn = useExperience((s) => s.focusOn);
  const setHoveredTarget = useExperience((s) => s.setHovered);
  const isFocused = useExperience(
    (s) => s.focusTarget?.kind === "tech" && s.focusTarget.id === tech.id,
  );

  const markTexture = useMemo(
    () => makeTechMark({ id: tech.id, name: tech.name, color: tech.color }),
    [tech],
  );
  const labelTexture = useMemo(
    () => makeLabelTexture({ text: tech.name, sub: tech.level }),
    [tech],
  );
  useEffect(
    () => () => {
      markTexture.dispose();
      labelTexture.dispose();
    },
    [markTexture, labelTexture],
  );

  // Seed the rig-readable position before any frame runs, and clean up
  // so the rig can never chase a stale entry.
  useEffect(() => {
    const v = orbitPosition(tech, 0, new THREE.Vector3());
    techWorldPositions.set(tech.id, v);
    return () => {
      techWorldPositions.delete(tech.id);
    };
  }, [tech]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const s = useExperience.getState();

    // Orbit unless stilled or any tech holds the camera's attention.
    const frozen = s.ambientStill || s.focusTarget?.kind === "tech";
    if (!frozen) timeRef.current += delta;
    orbitPosition(tech, timeRef.current, group.position);
    const stored = techWorldPositions.get(tech.id);
    if (stored) stored.copy(group.position);

    // Billboard the medallion so the logo faces the viewer from any orbit
    // angle (and from anywhere the walker stands).
    if (faceRef.current) faceRef.current.quaternion.copy(camera.quaternion);
    // The accent ring carries the "rotation" without hiding the logo.
    if (ringRef.current && !frozen) ringRef.current.rotation.z += delta * 0.7;

    // Hover/focus feedback: scale + emissive ramp, eased in place. Standard
    // materials (coin + ring) ramp via traversal; the logo/name planes are
    // unlit so they stay crisply legible.
    const targetScale = isFocused ? 1.3 : hovered ? 1.16 : 1;
    group.scale.setScalar(
      THREE.MathUtils.damp(group.scale.x, targetScale, 8, delta),
    );
    const active = isFocused || hovered;
    const pulse =
      active && !s.ambientStill ? Math.sin(state.clock.elapsedTime * 4) * 0.3 : 0;
    const glow = (isFocused ? 1.7 : hovered ? 1.2 : 0.55) + pulse;
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
      <group ref={faceRef} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
        {/* Hex coin — the click/hit target. Cylinder rotated so its flat
            face points along local +Z (toward the camera once billboarded). */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.07, 6]} />
          <meshStandardMaterial
            color="#10131a"
            emissive={tech.color}
            emissiveIntensity={0.55}
            roughness={0.4}
            metalness={0.5}
          />
        </mesh>

        {/* Slow-spinning rim accent. */}
        <mesh ref={ringRef} position={[0, 0, 0.005]}>
          <torusGeometry args={[0.46, 0.012, 8, 56]} />
          <meshStandardMaterial
            color={tech.color}
            emissive={tech.color}
            emissiveIntensity={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* The logo mark, sitting just proud of the coin face. Unlit so it
            never reads dark; non-raycasting so the coin behind owns clicks. */}
        <mesh position={[0, 0, 0.045]} raycast={() => null}>
          <planeGeometry args={[0.6, 0.6]} />
          <meshBasicMaterial map={markTexture} transparent depthWrite={false} />
        </mesh>

        {/* Name + level plate, revealed on hover/focus. */}
        <mesh position={[0, 0.66, 0]} visible={hovered || isFocused} raycast={() => null}>
          <planeGeometry args={[1.05, 0.33]} />
          <meshBasicMaterial map={labelTexture} transparent depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}
