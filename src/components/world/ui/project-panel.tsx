"use client";

import { projects } from "@/data/projects";
import { stations } from "@/data/stations";
import { techIdForStackItem } from "@/data/tech";
import { useExperience } from "@/lib/experience-store";
import { moods } from "@/lib/moods";
import { PanelShell } from "@/components/world/ui/panel-shell";

/**
 * The focused station's project, in real DOM. Same content the ledger
 * shows in Selected Work — outcome first, highlights, what it
 * demonstrates, stack, links when they exist. Stack chips that match a
 * tech in the constellation fly the camera to that tech.
 */
export function ProjectPanel() {
  const openPanel = useExperience((s) => s.openPanel);
  const focusTarget = useExperience((s) => s.focusTarget);
  const closePanel = useExperience((s) => s.closePanel);
  const focusOn = useExperience((s) => s.focusOn);

  if (openPanel !== "project" || focusTarget?.kind !== "station") return null;

  const station = stations.find((s) => s.id === focusTarget.id);
  const project = projects.find((p) => p.vignette === focusTarget.id);
  if (!station || !project) return null;

  const mood = moods[station.mood];

  return (
    <PanelShell
      eyebrow={`Station ${project.index} — ${project.kind}`}
      title={project.name}
      onClose={closePanel}
    >
      <div className="space-y-5">
        <p className="text-sm leading-relaxed text-ink">{project.outcome}</p>

        <ul className="space-y-3">
          {project.highlights.map((highlight) => (
            <li
              key={highlight}
              className="border-l pl-4 text-sm leading-relaxed text-ink-soft"
              style={{ borderColor: mood.color }}
            >
              {highlight}
            </li>
          ))}
        </ul>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            What it shows
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            {project.demonstrates}
          </p>
        </div>

        <ul className="flex flex-wrap gap-2" aria-label="Stack">
          {project.stack.map((item) => {
            const techId = techIdForStackItem(item);
            return (
              <li key={item}>
                {techId ? (
                  <button
                    type="button"
                    onClick={() => focusOn({ kind: "tech", id: techId })}
                    title={`Fly to ${item} in the constellation`}
                    className="rounded-full border border-line px-3 py-1 font-mono text-xs text-ink-soft transition-colors hover:border-line-bright hover:text-ink"
                  >
                    {item} →
                  </button>
                ) : (
                  <span className="inline-block rounded-full border border-line px-3 py-1 font-mono text-xs text-ink-soft">
                    {item}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        {project.links.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5 border-t border-line pt-4">
            {project.links.map((link) =>
              link.type === "demo" ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-accent px-4 py-2 font-mono text-xs font-medium text-ground transition-colors hover:bg-accent-bright"
                >
                  {link.label} ↗
                </a>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line px-4 py-2 font-mono text-xs text-ink-soft transition-colors hover:border-line-bright hover:text-ink"
                >
                  {link.label} ↗
                </a>
              ),
            )}
          </div>
        )}
      </div>
    </PanelShell>
  );
}
