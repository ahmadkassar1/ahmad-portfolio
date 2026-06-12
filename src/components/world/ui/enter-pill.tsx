"use client";

/**
 * The opt-in to the world, floating over the ledger. Shown to visitors
 * who didn't auto-enter (reduced motion, small screens, weak GPUs — all
 * of whom keep the full 2D site) and to anyone who exited the deck.
 * Only rendered when WebGL actually works, so it never dead-ends.
 */
export function EnterPill({ onEnter }: { onEnter: () => void }) {
  return (
    <button
      type="button"
      onClick={onEnter}
      className="fade-rise fixed bottom-6 right-6 z-30 flex items-center gap-2.5 rounded-full border border-line bg-panel/90 px-5 py-3 font-mono text-xs text-ink shadow-lg backdrop-blur-md transition-colors hover:border-accent-bright"
    >
      <span aria-hidden="true" className="text-accent-bright">
        ◈
      </span>
      Enter the Ops Deck
      <span className="text-ink-faint">— interactive 3D</span>
    </button>
  );
}
