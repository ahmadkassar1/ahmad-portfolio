"use client";

import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { easing } from "maath";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { aboutArea, contactArea } from "@/data/areas";
import { stations, stationCameraPosition, stationPosition } from "@/data/stations";
import { useExperience, type FocusTarget } from "@/lib/experience-store";
import { getTechPosition } from "@/lib/tech-positions";

const HOME_POS = new THREE.Vector3(0, 3.6, 10.8);
const HOME_TARGET = new THREE.Vector3(0, 1.1, 0);
const INTRO_POS = new THREE.Vector3(0, 14, 22);

/** Resolve a focus target into camera position + look target. Tech
 *  objects orbit, so their goal reads the live (frozen-on-focus)
 *  position the constellation publishes. */
function resolveGoal(
  target: FocusTarget,
  outPos: THREE.Vector3,
  outLook: THREE.Vector3,
) {
  switch (target.kind) {
    case "station": {
      const station = stations.find((s) => s.id === target.id);
      if (!station) return false;
      outPos.set(...stationCameraPosition(station));
      const [sx, , sz] = stationPosition(station);
      outLook.set(sx, 1.15, sz);
      return true;
    }
    case "tech": {
      const pos = getTechPosition(target.id);
      if (!pos) return false;
      outLook.copy(pos);
      // Park radially outward from the core, slightly above the object.
      const radial = Math.hypot(pos.x, pos.z) || 1;
      outPos.set(
        pos.x + (pos.x / radial) * 1.9,
        pos.y + 0.25,
        pos.z + (pos.z / radial) * 1.9,
      );
      return true;
    }
    case "about":
      outPos.set(...aboutArea.cameraPosition);
      outLook.set(...aboutArea.cameraTarget);
      return true;
    case "contact":
      outPos.set(...contactArea.cameraPosition);
      outLook.set(...contactArea.cameraTarget);
      return true;
  }
}

/**
 * Camera state machine. Phases: intro → idle ⇄ (focusing → focused →
 * returning). During idle, OrbitControls own the camera; in every other
 * phase controls are disabled and the rig damps position + look target
 * toward the phase goal. Reduced-motion visitors get near-instant cuts
 * instead of flights. All vectors are reused — nothing allocates per
 * frame.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  // Goal vectors, retargeted on state change, damped toward every frame.
  const goalPos = useRef(new THREE.Vector3().copy(HOME_POS));
  const goalTarget = useRef(new THREE.Vector3().copy(HOME_TARGET));
  // The current look target the camera damps through (decoupled from
  // OrbitControls' target so handoff between modes stays smooth).
  const lookAt = useRef(new THREE.Vector3().copy(HOME_TARGET));

  const phase = useExperience((s) => s.phase);
  const focusTarget = useExperience((s) => s.focusTarget);
  const ambientStill = useExperience((s) => s.ambientStill);

  // Place the camera at the intro start exactly once per world entry.
  useEffect(() => {
    if (useExperience.getState().phase !== "intro") return;
    if (ambientStill) {
      // Reduced-motion visitors who opted in skip the flythrough.
      camera.position.copy(HOME_POS);
      lookAt.current.copy(HOME_TARGET);
      camera.lookAt(HOME_TARGET);
      useExperience.getState().finishIntro();
    } else {
      camera.position.copy(INTRO_POS);
      camera.lookAt(HOME_TARGET);
    }
    // Run on mount only — phase changes after this are the rig's own doing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Retarget goals whenever the machine moves.
  useEffect(() => {
    if (phase === "focusing" && focusTarget) {
      if (!resolveGoal(focusTarget, goalPos.current, goalTarget.current)) {
        // Unresolvable target (shouldn't happen) — release rather than wedge.
        useExperience.getState().clearFocus();
      }
    } else if (phase === "returning" || phase === "intro") {
      goalPos.current.copy(HOME_POS);
      goalTarget.current.copy(HOME_TARGET);
    }
  }, [phase, focusTarget]);

  useFrame((_, rawDelta) => {
    // Clamp delta so a backgrounded tab doesn't teleport the camera.
    const delta = Math.min(rawDelta, 1 / 30);
    const s = useExperience.getState();

    if (s.phase === "idle") {
      // OrbitControls own the camera; keep our look target in sync so the
      // next handoff starts from where the user actually left it.
      const controls = controlsRef.current;
      if (controls) lookAt.current.copy(controls.target);
      return;
    }

    // Reduced motion: transitions become fast cuts, not flights.
    const speed = s.ambientStill ? 0.07 : s.phase === "intro" ? 0.9 : 0.45;
    easing.damp3(camera.position, goalPos.current, speed, delta);
    easing.damp3(lookAt.current, goalTarget.current, speed * 0.8, delta);
    camera.lookAt(lookAt.current);

    // Keep controls' target in sync while they're disabled so re-enabling
    // them in idle doesn't snap the view.
    const controls = controlsRef.current;
    if (controls) controls.target.copy(lookAt.current);

    const dist = camera.position.distanceTo(goalPos.current);
    if (s.phase === "intro" && dist < 0.35) s.finishIntro();
    else if (s.phase === "focusing" && dist < 0.18) s.arriveAtTarget();
    else if (s.phase === "returning" && dist < 0.3) s.arriveHome();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={phase === "idle"}
      enableDamping
      dampingFactor={0.08}
      enablePan={false}
      minDistance={5}
      maxDistance={16}
      minPolarAngle={Math.PI * 0.18}
      maxPolarAngle={Math.PI * 0.46}
      target={[HOME_TARGET.x, HOME_TARGET.y, HOME_TARGET.z]}
    />
  );
}
