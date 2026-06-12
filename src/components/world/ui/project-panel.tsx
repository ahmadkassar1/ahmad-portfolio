"use client";

import { projects } from "@/data/projects";
import { stations } from "@/data/stations";
import { useExperience } from "@/lib/experience-store";
import { moods } from "@/lib/moods";
import { PanelShell } from "@/components/world/ui/panel-shell";

/**
 * The focused station's project, in real DOM. Same content the ledger
 * shows in Selected Work — outcome first, highlights, what it
 * demonstrates, stack, links when they exist.
 */
export function ProjectPanel() {
  const openPanel = useExperience((s) => s.openPanel);
  const focusedStation = useExperience((s) => s.focusedStation);
  const closePanel = useExperience((s) => s.closePanel);

  if (openPanel !== "project" || !focusedStation) return null;

  const station = stations.find((s) => s.id === focusedStation);
  const project = projects.find((p) => p.vignette === focusedStation);
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
          {project.stack.map((item) => (
            <li
              key={item}
              className="rounded-full border border-line px-3 py-1 font-mono text-xs text-ink-soft"
            >
              {item}
            </li>
          ))}
        </ul>

        {project.links.length > 0 && (
          <div className="flex gap-4 border-t border-line pt-4">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-accent-bright underline-offset-4 hover:underline"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </PanelShell>
  );
}
