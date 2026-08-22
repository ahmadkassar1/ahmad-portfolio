"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useExperience } from "@/lib/experience-store";
import { STATION_RADIUS } from "@/data/stations";
import { resetWalkInput, walkInput } from "@/lib/walk-input";

const EYE_HEIGHT = 1.7;
const SPEED = 4.8;
const MAX_R = STATION_RADIUS + 4.4;
const CORE_R = 2.3;
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

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest("input, textarea, select, button, a, [contenteditable='true'], [role='dialog']"),
  );
}

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

  useEffect(() => {
    if (navMode !== "walk") return;
    const el = gl.domElement;

    const resetInput = () => {
      keys.current.clear();
      drag.current.active = false;
      resetWalkInput();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const dir = KEY_MAP[e.code];
      if (!dir || e.repeat || isEditableTarget(e.target)) return;
      const st = useExperience.getState();
      if (st.openPanel || st.phase !== "idle" || st.navMode !== "walk") return;
      keys.current.add(dir);
      e.preventDefault();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const dir = KEY_MAP[e.code];
      if (dir) keys.current.delete(dir);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const st = useExperience.getState();
      if (st.phase !== "idle" || st.navMode !== "walk") return;
      drag.current = { active: true, x: e.clientX, y: e.clientY, id: e.pointerId };
      el.setPointerCapture?.(e.pointerId);
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
      if (e.pointerId !== drag.current.id) return;
      drag.current.active = false;
      try {
        if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId);
      } catch {
        // Pointer capture may already have been released by the browser.
      }
    };

    const onVisibility = () => {
      if (document.hidden) resetInput();
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", resetInput);
    document.addEventListener("visibilitychange", onVisibility);
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    return () => {
      resetInput();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", resetInput);
      document.removeEventListener("visibilitychange", onVisibility);
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
      keys.current.clear();
      resetWalkInput();
      wasActive.current = false;
      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);

    if (!wasActive.current) {
      const e = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");
      yaw.current = e.y;
      pitch.current = THREE.MathUtils.clamp(e.x, PITCH_MIN, PITCH_MAX);
      wasActive.current = true;
    }

    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");

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

        const diagonalScale = mf !== 0 && mr !== 0 ? Math.SQRT1_2 : 1;
        const step = SPEED * delta * diagonalScale;
        camera.position.addScaledVector(fwd.current, mf * step);
        camera.position.addScaledVector(right.current, mr * step);

        const r = Math.hypot(camera.position.x, camera.position.z);
        if (r > MAX_R) {
          camera.position.x *= MAX_R / r;
          camera.position.z *= MAX_R / r;
        } else if (r < CORE_R) {
          if (r > 1e-3) {
            camera.position.x *= CORE_R / r;
            camera.position.z *= CORE_R / r;
          } else {
            camera.position.z = CORE_R;
          }
        }
      }
    }

    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      EYE_HEIGHT,
      7,
      delta,
    );
  });

  return null;
}
