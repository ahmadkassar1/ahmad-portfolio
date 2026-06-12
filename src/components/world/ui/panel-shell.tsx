"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

/**
 * Accessible floating panel over the world. Real DOM, real dialog
 * semantics: labelled, focus moves in on open and back out on close,
 * Tab is trapped inside. Escape is handled by the deck's global handler
 * (one unwind layer per press), not here.
 */
export function PanelShell({
  title,
  eyebrow,
  onClose,
  children,
}: {
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const headingId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    panelRef.current
      ?.querySelector<HTMLElement>("[data-panel-close]")
      ?.focus();
    return () => returnFocusRef.current?.focus?.();
  }, []);

  // Minimal focus trap — cycle Tab between the panel's tabbables.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const tabbables = panel.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (tabbables.length === 0) return;
      const first = tabbables[0];
      const last = tabbables[tabbables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      className="panel-in fixed inset-x-4 bottom-4 z-50 max-h-[72vh] overflow-y-auto rounded-2xl border border-line bg-panel/95 p-6 backdrop-blur-md sm:inset-x-auto sm:right-6 sm:top-1/2 sm:bottom-auto sm:w-[26rem] sm:max-h-[80vh] sm:-translate-y-1/2 sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              {eyebrow}
            </p>
          )}
          <h2 id={headingId} className="mt-1 text-xl font-semibold text-ink">
            {title}
          </h2>
        </div>
        <button
          type="button"
          data-panel-close
          onClick={onClose}
          aria-label={`Close ${title} panel`}
          className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-ink-soft transition-colors hover:border-line-bright hover:text-ink"
        >
          ESC
        </button>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
