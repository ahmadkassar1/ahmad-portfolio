"use client";

import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { easing } from "maath";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { aboutArea, contactArea, labArea } from "@/data/areas";
import { stations, stationCameraPosition, stationPosition } from "@/data/stations";
import { useExperience, type CameraPhase, type FocusTarget } from "@/lib/experience-store";
import { getTechPosition } from "@/lib/tech-positions";
import { WalkControls } from "@/components/world/walk-controls";

const HOME_POS = new THREE.Vector3(0, 3.6, 10.8);
const HOME_TARGET = new THREE.Vector3(0, 1.1, 0);
const INTRO_POS = new THREE.Vector3(0, 14, 22);
const ORBIT_HANDOFF_DISTANCE = 6;
const MAX_TRANSITION_DELTA = 0.1;

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
    case "lab":
      outPos.set(...labArea.cameraPosition);
      outLook.set(...labArea.cameraTarget);
      return true;
  }
}

export function CameraRig() {
  const camera = useThree((s) => s.camera);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const goalPos = useRef(new THREE.Vector3().copy(HOME_POS));
  const goalTarget = useRef(new THREE.Vector3().copy(HOME_TARGET));
  const lookAt = useRef(new THREE.Vector3().copy(HOME_TARGET));
  const returnPos = useRef(new THREE.Vector3().copy(HOME_POS));
  const returnTarget = useRef(new THREE.Vector3().copy(HOME_TARGET));
  const previousPhase = useRef<CameraPhase>("intro");

  const phase = useExperience((s) => s.phase);
  const focusTarget = useExperience((s) => s.focusTarget);
  const ambientStill = useExperience((s) => s.ambientStill);
  const navMode = useExperience((s) => s.navMode);
  const coarsePointer = useExperience((s) => s.profile?.isCoarsePointer ?? false);
  const fwdTmp = useRef(new THREE.Vector3());

  useEffect(() => {
    if (useExperience.getState().phase !== "intro") return;
    if (ambientStill) {
      camera.position.copy(HOME_POS);
      lookAt.current.copy(HOME_TARGET);
      camera.lookAt(HOME_TARGET);
      returnPos.current.copy(HOME_POS);
      returnTarget.current.copy(HOME_TARGET);
      useExperience.getState().finishIntro();
      return;
    }
    camera.position.copy(INTRO_POS);
    lookAt.current.copy(HOME_TARGET);
    camera.lookAt(HOME_TARGET);
    const t = setTimeout(() => useExperience.getState().finishIntro(), 3500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (navMode !== "orbit" || useExperience.getState().phase !== "idle") return;
    camera.getWorldDirection(fwdTmp.current);
    const target = fwdTmp.current
      .normalize()
      .multiplyScalar(ORBIT_HANDOFF_DISTANCE)
      .add(camera.position);
    lookAt.current.copy(target);
    const c = controlsRef.current;
    if (c) {
      c.target.copy(target);
      c.update();
    }
  }, [navMode, camera]);

  useEffect(() => {
    const prev = previousPhase.current;

    if (phase === "focusing" && prev === "idle") {
      returnPos.current.copy(camera.position);
      returnTarget.current.copy(lookAt.current);
    }

    if (phase === "focusing" && focusTarget) {
      if (!resolveGoal(focusTarget, goalPos.current, goalTarget.current)) {
        useExperience.getState().clearFocus();
      }
    } else if (phase === "returning") {
      goalPos.current.copy(returnPos.current);
      goalTarget.current.copy(returnTarget.current);
    } else if (phase === "intro") {
      goalPos.current.copy(HOME_POS);
      goalTarget.current.copy(HOME_TARGET);
    }

    previousPhase.current = phase;
  }, [phase, focusTarget, camera]);

  useFrame((_, rawDelta) => {
    // Keep transitions tied to real elapsed time on low-FPS devices while
    // still capping huge deltas after a backgrounded tab. A 1/30 cap made a
    // 10fps device animate roughly 3x slower than intended.
    const delta = Math.min(rawDelta, MAX_TRANSITION_DELTA);
    const s = useExperience.getState();

    if (s.phase === "idle") {
      const controls = controlsRef.current;
      if (s.navMode === "orbit") {
        if (controls) lookAt.current.copy(controls.target);
      } else {
        camera.getWorldDirection(fwdTmp.current);
        lookAt.current.copy(camera.position).addScaledVector(fwdTmp.current, 6);
        if (controls) controls.target.copy(lookAt.current);
      }
      return;
    }

    const dist = camera.position.distanceTo(goalPos.current);

    let speed = s.ambientStill ? 0.06 : s.phase === "intro" ? 0.72 : 0.24;
    if (!s.ambientStill && s.phase !== "intro") {
      const t = THREE.MathUtils.clamp(dist / 8, 0.35, 1);
      speed *= 0.7 + 0.3 * t;
    }

    easing.damp3(camera.position, goalPos.current, speed, delta);
    easing.damp3(lookAt.current, goalTarget.current, speed * 0.82, delta);
    camera.lookAt(lookAt.current);

    const controls = controlsRef.current;
    if (controls) controls.target.copy(lookAt.current);

    if (s.phase === "intro" && dist < 0.4) {
      returnPos.current.copy(HOME_POS);
      returnTarget.current.copy(HOME_TARGET);
      s.finishIntro();
    } else if (s.phase === "focusing" && dist < 0.22) {
      s.arriveAtTarget();
    } else if (s.phase === "returning" && dist < 0.24) {
      s.arriveHome();
    }
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enabled={phase === "idle" && navMode === "orbit"}
        enableDamping
        dampingFactor={0.075}
        enablePan={false}
        minDistance={4.5}
        maxDistance={coarsePointer ? 18 : 16}
        minPolarAngle={Math.PI * 0.16}
        maxPolarAngle={coarsePointer ? Math.PI * 0.52 : Math.PI * 0.48}
        target={[HOME_TARGET.x, HOME_TARGET.y, HOME_TARGET.z]}
      />
      <WalkControls />
    </>
  );
}
