export type Role = {
  company: string;
  title: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
};

export type Education = {
  school: string;
  credential: string;
  period: string;
  detail: string;
};

export const roles: Role[] = [
  {
    company: "Horecons",
    title: "Frontend Developer",
    period: "Oct 2025 — Present",
    location: "Ghazir / Beirut, Lebanon · On-site",
    summary:
      "Frontend development on TheBridge ERP and internal operations systems.",
    highlights: [
      "Build and ship features across TheBridge ERP — SalesSphere, Stock Management, ProjectPilot, and other operations modules — in Angular and TypeScript.",
      "Turn operational requirements into scalable frontend logic: reusable screens, CRUD workflows, routing flows, forms, tables, filters, and dashboards wired to REST APIs.",
      "Contribute to React and Next.js applications for external UAE event projects and interactive web experiences.",
      "Connect frontend flows to n8n automation and lead-capture pipelines.",
    ],
  },
  {
    company: "Interphase — Core Development Team",
    title: "Frontend Developer",
    period: "Mar 2024 — Sep 2025",
    location: "Lebanon",
    summary:
      "Frontend modules for Populus, an ERP-style business platform with configurable workflows.",
    highlights: [
      "Built a full-featured Kanban board: task states, workflow logic, board columns, filters, and automation-engine behavior on dynamic data.",
      "Worked on form-builder features — dynamic fields, reusable sections, validation flows, state transitions, and submission logic.",
      "Implemented reusable UI structures and configurable sections for website-builder features.",
      "Managed complex frontend state for screens where data moves between statuses, modules, and user actions.",
    ],
  },
];

export const education: Education[] = [
  {
    school: "42 Beirut",
    credential: "Software Engineering / Computer Science Projects",
    period: "2024 — 2025",
    detail:
      "C, C++, algorithms, memory management, Linux, Git, shell scripting, and peer code review.",
  },
  {
    school: "Institut Renée Mouawad",
    credential: "B.A. in Business Administration",
    period: "2020 — 2022",
    detail:
      "The business-side foundation behind how I read operational requirements today.",
  },
];
