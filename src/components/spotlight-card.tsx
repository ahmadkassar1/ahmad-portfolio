"use client";

import { useRef } from "react";

/** Wraps a vignette stage; paints a pointer-following highlight via the
 *  .spotlight CSS — pure custom-property updates, rAF-throttled. */
export function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node) return;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--mx", `${clientX - rect.left}px`);
      node.style.setProperty("--my", `${clientY - rect.top}px`);
    });
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className={`spotlight ${className}`}
    >
      {children}
    </div>
  );
}
