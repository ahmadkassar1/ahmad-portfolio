"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useExperience } from "@/lib/experience-store";
import { STATION_RADIUS } from "@/data/stations";
import { walkInput } from "@/lib/walk-input";

/**
 * First-person Walk controller. Active only while idle and navMode==='walk'
 * — every other phase (intro, focus flights) belongs to the CameraRig, and
 * orbit mode belongs to OrbitControls. Move with WASD/arrows or the on-
 * screen joystick; look by dragging. The camera holds a fixed eye height
 * and is clamped to the walkable ring (and pushed out of the core), so you
 * can roam the deck on foot without leaving the floor or clipping the
 * centerpiece.
 *
 * Look-drag never steals object clicks: R3F only fires a mesh onClick when
 * the object is hit on BOTH pointerdown and pointerup, so a drag that
 * rotates the view past an object simply doesn't click it.
 */

const EYE_HEIGHT = 1.7;
const SPEED = 4.6;
const MAX_R = STATION_RADIUS + 4.4; // stay inside the column ring
const CORE_R = 2.3; // don't walk through the holo core
const LOOK_SENS = 0.0026;
const PITCH_MIN = -Math.PI * 0.33;
const PITCH_MAX = Math.PI * 0.28;

type Dir = "f" | "b" | "l" | "r";
const KEY_MAP: Record<string, Dir> = {
  KeyW: "f",
  ArrowUp: "f",
  KeyS: "b",
  ArrowDown: "b",
  KeyA: "l",
  ArrowLeft: "l",
  KeyD: "r",
  ArrowRight: "r",
};

export function WalkControls() {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const navMode = useExperience((s) => s.navMode);

  const yaw = useRef(0);
  const pitch = useRef(0);
  const keys = useRef<Set<Dir>>(new Set());
  const drag = useRef({ active: false, x: 0, y: 0, id: -1 });
  const wasActive = useRef(false);
  const fwd = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());

  // Attach input listeners only while walk mode is selected.
  useEffect(() => {
    if (navMode !== "walk") return;
    const el = gl.domElement;

    const onKeyDown = (e: KeyboardEvent) => {
      const dir = KEY_MAP[e.code];
      if (!dir) return;
      const st = useExperience.getState();
      // Ignore (and don't swallow) keys while a panel is open or mid-flight,
      // so arrow keys can still scroll an open panel.
      if (st.openPanel || st.phase !== "idle" || st.navMode !== "walk") return;
      keys.current.add(dir);
      if (e.code.startsWith("Arrow")) e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const dir = KEY_MAP[e.code];
      if (dir) keys.current.delete(dir);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      drag.current = { active: true, x: e.clientX, y: e.clientY, id: e.pointerId };
    };
    const onPointerMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.active || e.pointerId !== d.id) return;
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      d.x = e.clientX;
      d.y = e.clientY;
      yaw.current -= dx * LOOK_SENS;
      pitch.current = THREE.MathUtils.clamp(
        pitch.current - dy * LOOK_SENS,
        PITCH_MIN,
        PITCH_MAX,
      );
    };
    const endDrag = (e: PointerEvent) => {
      if (e.pointerId === drag.current.id) drag.current.active = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      keys.current.clear();
      drag.current.active = false;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [navMode, gl]);

  useFrame((_, rawDelta) => {
    const s = useExperience.getState();
    const active = s.navMode === "walk" && s.phase === "idle";
    if (!active) {
      wasActive.current = false;
      return;
    }
    const delta = Math.min(rawDelta, 1 / 30);

    // Seed orientation from wherever the camera currently looks (after the
    // intro flight, a focus excursion, or an orbit→walk toggle) so taking
    // over never snaps the view.
    if (!wasActive.current) {
      const e = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");
      yaw.current = e.y;
      // Stand looking level-ahead rather than inheriting the steep downward
      // tilt of the intro/focus camera; the visitor drags from here.
      pitch.current = -0.05;
      wasActive.current = true;
    }

    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");

    // Movement pauses while a panel is open so reading isn't disturbed.
    if (!s.openPanel) {
      const mf = THREE.MathUtils.clamp(
        (keys.current.has("f") ? 1 : 0) -
          (keys.current.has("b") ? 1 : 0) +
          walkInput.y,
        -1,
        1,
      );
      const mr = THREE.MathUtils.clamp(
        (keys.current.has("r") ? 1 : 0) -
          (keys.current.has("l") ? 1 : 0) +
          walkInput.x,
        -1,
        1,
      );
      if (mf !== 0 || mr !== 0) {
        fwd.current.set(0, 0, -1).applyQuaternion(camera.quaternion);
        fwd.current.y = 0;
        fwd.current.normalize();
        right.current.set(1, 0, 0).applyQuaternion(camera.quaternion);
        right.current.y = 0;
        right.current.normalize();
        const step = SPEED * delta;
        camera.position.addScaledVector(fwd.current, mf * step);
        camera.position.addScaledVector(right.current, mr * step);

        // Keep inside the ring and outside the core.
        const r = Math.hypot(camera.position.x, camera.position.z);
        if (r > MAX_R) {
          camera.position.x *= MAX_R / r;
          camera.position.z *= MAX_R / r;
        } else if (r < CORE_R && r > 1e-3) {
          camera.position.x *= CORE_R / r;
          camera.position.z *= CORE_R / r;
        }
      }
    }

    // Ease to standing eye height (covers the descent from the intro/orbit
    // camera height when walk takes over).
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      EYE_HEIGHT,
      6,
      delta,
    );
  });

  return null;
}
