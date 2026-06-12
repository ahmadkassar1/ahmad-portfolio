"use client";

import { aboutFacts, aboutNarrative } from "@/data/about";
import { principles } from "@/data/capabilities";
import { skillGroups } from "@/data/skills";
import { site } from "@/data/site";
import { useExperience } from "@/lib/experience-store";
import { PanelShell } from "@/components/world/ui/panel-shell";

/**
 * About / Contact / Toolbox panels — the rest of the ledger's content,
 * reachable from the HUD so the world never hides anything behind WebGL.
 */
export function InfoPanels() {
  const openPanel = useExperience((s) => s.openPanel);
  const closePanel = useExperience((s) => s.closePanel);

  if (openPanel === "about")
    return (
      <PanelShell eyebrow="Approach" title="About Ahmad" onClose={closePanel}>
        <div className="space-y-4">
          {aboutNarrative.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-sm leading-relaxed text-ink-soft">
              {paragraph}
            </p>
          ))}

          <dl className="space-y-4 border-t border-line pt-5">
            {aboutFacts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-sm text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="border-t border-line pt-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              Principles
            </p>
            <ul className="mt-3 space-y-3">
              {principles.map((principle) => (
                <li key={principle.title}>
                  <p className="text-sm font-medium text-ink">{principle.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">
                    {principle.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PanelShell>
    );

  if (openPanel === "contact")
    return (
      <PanelShell eyebrow="05" title="Contact" onClose={closePanel}>
        <div className="space-y-5">
          <p className="text-sm leading-relaxed text-ink-soft">
            I take on products, interfaces, and systems — with teams that are
            hiring, clients with something to build, or collaborators with a
            good idea.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="block rounded-xl border border-line px-4 py-3 font-mono text-sm text-accent-bright transition-colors hover:border-line-bright"
          >
            {site.email}
          </a>
          <div className="flex gap-4">
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-ink-soft underline-offset-4 hover:text-ink hover:underline"
            >
              GitHub ↗
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-ink-soft underline-offset-4 hover:text-ink hover:underline"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>
      </PanelShell>
    );

  if (openPanel === "toolbox")
    return (
      <PanelShell eyebrow="04" title="Toolbox" onClose={closePanel}>
        <div className="space-y-5">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                {group.label}
              </p>
              <ul className="mt-2 space-y-1.5">
                {group.items.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-ink-soft">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </PanelShell>
    );

  return null;
}
