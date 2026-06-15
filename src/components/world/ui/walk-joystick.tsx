"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { resetWalkInput, walkInput } from "@/lib/walk-input";

const RADIUS = 44; // max knob travel, px

/**
 * On-screen thumbstick for Walk mode on touch devices. Writes a normalized
 * vector into the walkInput singleton (read by WalkControls each frame).
 * Lives in the HUD layer, so it must opt back into pointer events.
 */
export function WalkJoystick() {
  const baseRef = useRef<HTMLDivElement>(null);
  const activeId = useRef<number | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  // Never leave the camera drifting if the stick unmounts mid-push.
  useEffect(() => resetWalkInput, []);

  const apply = (clientX: number, clientY: number) => {
    const base = baseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > RADIUS) {
      dx = (dx / dist) * RADIUS;
      dy = (dy / dist) * RADIUS;
    }
    setKnob({ x: dx, y: dy });
    walkInput.x = dx / RADIUS; // strafe right
    walkInput.y = -dy / RADIUS; // forward = up the screen
  };

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    activeId.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    apply(e.clientX, e.clientY);
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (activeId.current === e.pointerId) apply(e.clientX, e.clientY);
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (activeId.current !== e.pointerId) return;
    activeId.current = null;
    setKnob({ x: 0, y: 0 });
    resetWalkInput();
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      aria-hidden="true"
      className="pointer-events-auto absolute bottom-24 left-5 grid h-28 w-28 touch-none select-none place-items-center rounded-full border border-line bg-panel/45 backdrop-blur-md"
    >
      <div
        className="h-12 w-12 rounded-full border border-line-bright bg-ink/15 transition-transform duration-75"
        style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
      />
    </div>
  );
}
