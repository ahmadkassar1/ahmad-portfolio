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
      "B2B ERP features across project management, finance, accounting, sales, and stock management. Angular and TypeScript business workflows, plus React and Next.js event applications with n8n lead capture.",
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
