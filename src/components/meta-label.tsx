import type { ElementType, ReactNode } from "react";

/**
 * The single spec for small mono uppercase meta labels (section eyebrows,
 * fact labels, group headings) so the type treatment can't drift per file.
 */
export function MetaLabel({
  as: Tag = "p",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={`font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint${
        className ? ` ${className}` : ""
      }`}
    >
      {children}
    </Tag>
  );
}
