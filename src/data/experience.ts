/* Deliberately compact: this site leads with work and capability —
   employment history is supporting evidence, not the spine. */

export type Shipped = {
  platform: string;
  context: string;
  period: string;
  summary: string;
};

export const shipped: Shipped[] = [
  {
    platform: "TheBridge ERP",
    context: "Horecons",
    period: "2025 — now",
    summary:
      "The screens Horecons runs its operations on: sales, stock, and project modules in TheBridge ERP, plus Next.js event builds with n8n-connected lead flows.",
  },
  {
    platform: "Populus",
    context: "Interphase",
    period: "2024 — 2025",
    summary:
      "Kanban boards, form-builder flows, and website-builder modules on an ERP-style platform with configurable workflows.",
  },
];

export const training =
  "42 Beirut — systems programming, peer review · business degree before code";
