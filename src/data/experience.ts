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
    period: "Oct 2025 – Feb 2026",
    summary:
      "The screens Horecons runs its operations on: sales, stock, and project modules in TheBridge ERP, plus Next.js event builds with n8n-connected lead flows.",
  },
  {
    platform: "Populus",
    context: "Interphase",
    period: "Mar 2024 – Sep 2025",
    summary:
      "Kanban boards, form-builder flows, and website-builder modules on an ERP-style platform with configurable workflows.",
  },
];

export const training =
  "Programming Advices · Scrimba Learn React · 42 Beirut assessment participation";
