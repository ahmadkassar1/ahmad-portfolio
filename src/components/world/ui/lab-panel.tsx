"use client";

import Link from "next/link";
import { labProjects } from "@/data/lab";
import { useExperience } from "@/lib/experience-store";
import { PanelShell } from "@/components/world/ui/panel-shell";

/**
 * The Lab panel — opens when the Lab pod is focused. Lists the self-
 * contained builds; live ones link straight to their route, in-progress
 * ones are shown but inert. Reuses PanelShell, so it inherits the world's
 * panel chrome (no separate styling to drift).
 */
export function LabPanel() {
  const openPanel = useExperience((s) => s.openPanel);
  const closePanel = useExperience((s) => s.closePanel);

  if (openPanel !== "lab") return null;

  return (
    <PanelShell eyebrow="Experiments" title="The Lab" onClose={closePanel}>
      <div className="space-y-5">
        <p className="text-sm leading-relaxed text-ink-soft">
          Self-contained builds — each a different corner of frontend work, running entirely in the
          browser. Open one, or browse them all.
        </p>

        <ul className="space-y-2.5">
          {labProjects.map((p) =>
            p.status === "live" ? (
              <li key={p.slug}>
                <Link
                  href={`/lab/${p.slug}`}
                  className="block rounded-xl border border-line p-4 transition-colors hover:border-line-bright hover:bg-ink/5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 rounded-full"
                        style={{ background: p.accent }}
                      />
                      <span className="font-medium text-ink">{p.name}</span>
                    </span>
                    <span className="font-mono text-xs text-accent-bright">Open →</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{p.blurb}</p>
                </Link>
              </li>
            ) : (
              <li
                key={p.slug}
                className="rounded-xl border border-line/60 p-4 opacity-70"
                aria-disabled="true"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full"
                      style={{ background: p.accent }}
                    />
                    <span className="font-medium text-ink-soft">{p.name}</span>
                  </span>
                  <span className="font-mono text-xs text-ink-faint">Building</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-faint">{p.blurb}</p>
              </li>
            ),
          )}
        </ul>

        <Link
          href="/lab"
          className="inline-block font-mono text-xs text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          Browse the full Lab ↗
        </Link>
      </div>
    </PanelShell>
  );
}
