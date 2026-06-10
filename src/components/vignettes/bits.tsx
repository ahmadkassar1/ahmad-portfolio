import type { ReactNode } from "react";

/* Shared primitives for the hand-coded UI vignettes. Text is greeked into
   bars except where a real label adds credibility (numbers, statuses). */

export function GreekBar({
  w = "w-16",
  tone = "bg-white/10",
  h = "h-1.5",
}: {
  w?: string;
  tone?: string;
  h?: string;
}) {
  return <span aria-hidden="true" className={`block ${h} ${w} rounded-full ${tone}`} />;
}

const chipTones = {
  good: "bg-good/15 text-good",
  warn: "bg-warn/15 text-warn",
  bad: "bg-bad/15 text-bad",
  accent: "bg-accent/20 text-accent-bright",
  neutral: "bg-white/8 text-ink-faint",
} as const;

export function MiniChip({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof chipTones;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-px font-mono text-[9px] leading-4 ${chipTones[tone]}`}
    >
      {children}
    </span>
  );
}

/** The one spec for solid-accent micro-buttons inside vignettes.
 *  rounded-full is reserved for category/filter pills. */
export function MicroAction({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md bg-accent px-2.5 py-1 font-mono text-[9px] font-medium text-ground">
      {children}
    </span>
  );
}

/** The one spec for numeric row metadata inside vignettes.
 *  Pass dim for de-emphasized figures (e.g. view counts). */
export function Value({
  dim = false,
  children,
}: {
  dim?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={`font-mono text-[10px] tabular-nums ${
        dim ? "text-ink-faint" : "text-ink-soft"
      }`}
    >
      {children}
    </span>
  );
}

export function BrowserFrame({
  url,
  children,
  className = "",
}: {
  url: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-line-bright bg-panel shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_48px_-24px_rgba(0,0,0,0.85)] ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-line px-3.5 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </span>
        <span className="mx-auto rounded bg-ground/70 px-2.5 py-0.5 font-mono text-[9px] text-ink-faint">
          {url}
        </span>
        <span aria-hidden="true" className="w-9" />
      </div>
      {children}
    </div>
  );
}

export function PhoneFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[1.75rem] border border-line-bright bg-panel p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_28px_56px_-24px_rgba(0,0,0,0.9)] ${className}`}
    >
      <div className="overflow-hidden rounded-[1.35rem] bg-ground/80">
        <div aria-hidden="true" className="mx-auto mt-2 h-1 w-12 rounded-full bg-white/10" />
        {children}
      </div>
    </div>
  );
}

export function Sparkline({
  className = "",
  stroke = "var(--accent-bright)",
}: {
  className?: string;
  stroke?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 36"
      fill="none"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
    >
      <path
        d="M2 30 L16 26 L30 28 L44 20 L58 22 L72 14 L86 17 L100 8 L118 4"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 30 L16 26 L30 28 L44 20 L58 22 L72 14 L86 17 L100 8 L118 4 V36 H2 Z"
        fill={stroke}
        opacity="0.08"
        stroke="none"
      />
    </svg>
  );
}
