import { createElement, type ReactNode } from "react";

/**
 * The single spec for small mono uppercase meta labels (section eyebrows,
 * fact labels, group headings) so the type treatment can't drift per file.
 * The tag union covers every real usage; createElement sidesteps the
 * JSX-generic-tag children inference that broke under newer @types/react.
 */
export function MetaLabel({
  as = "p",
  className,
  children,
}: {
  as?: "p" | "span" | "dt" | "h2" | "h3" | "h4";
  className?: string;
  children: ReactNode;
}) {
  return createElement(
    as,
    {
      className: `font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint${
        className ? ` ${className}` : ""
      }`,
    },
    children,
  );
}
