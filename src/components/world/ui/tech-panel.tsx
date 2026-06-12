"use client";

import { getTech } from "@/data/tech";
import { projects } from "@/data/projects";
import { stations } from "@/data/stations";
import { useExperience } from "@/lib/experience-store";
import { PanelShell } from "@/components/world/ui/panel-shell";

/**
 * The focused technology, in real DOM: honest level, where it's used,
 * and jump buttons to the stations it shipped in — the camera flies
 * straight from the tech to the project.
 */
export function TechPanel() {
  const openPanel = useExperience((s) => s.openPanel);
  const focusTarget = useExperience((s) => s.focusTarget);
  const closePanel = useExperience((s) => s.closePanel);
  const focusStation = useExperience((s) => s.focusStation);

  if (openPanel !== "tech" || focusTarget?.kind !== "tech") return null;

  const tech = getTech(focusTarget.id);
  if (!tech) return null;

  const related = tech.projectIds
    .map((id) => ({
      station: stations.find((s) => s.id === id),
      project: projects.find((p) => p.vignette === id),
    }))
    .filter((r) => r.station && r.project);

  return (
    <PanelShell eyebrow="Tech" title={tech.name} onClose={closePanel}>
      <div className="space-y-5">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: tech.color }}
          />
          <p className="font-mono text-xs text-ink">{tech.level}</p>
        </div>

        <p className="text-sm leading-relaxed text-ink-soft">{tech.summary}</p>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            Where it&apos;s used
          </p>
          <ul className="mt-2 space-y-1.5">
            {tech.usedAt.map((place) => (
              <li key={place} className="text-sm text-ink-soft">
                {place}
              </li>
            ))}
          </ul>
        </div>

        {related.length > 0 && (
          <div className="border-t border-line pt-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              Shipped in
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {related.map(({ station, project }) => (
                <button
                  key={station!.id}
                  type="button"
                  onClick={() => focusStation(station!.id)}
                  className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-ink-soft transition-colors hover:border-line-bright hover:text-ink"
                >
                  {project!.index} {station!.shortName} →
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </PanelShell>
  );
}
