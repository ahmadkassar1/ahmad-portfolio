export type Capability = {
  index: string;
  title: string;
  description: string;
};

export const capabilities: Capability[] = [
  {
    index: "01",
    title: "ERP & business operations",
    description:
      "Project management, finance, accounting, sales, and stock workflows, with reusable forms, data tables, filters, and validation.",
  },
  {
    index: "02",
    title: "AI & workflow automation",
    description:
      "CRM pipelines, AI-generated outreach drafts, lead capture, and n8n automation that connect business data to the next action.",
  },
  {
    index: "03",
    title: "Full-stack SaaS applications",
    description:
      "Responsive applications connected to backend API routes, Supabase, and PostgreSQL, including multi-tenant menus, ordering, and admin tools.",
  },
  {
    index: "04",
    title: "Interactive web experiences",
    description:
      "Course players, storefronts, dashboards, and interactive web demos with clear state management, accessible controls, and responsive layouts.",
  },
];

export type Principle = {
  title: string;
  detail: string;
};

export const principles: Principle[] = [
  {
    title: "The operator comes first",
    detail:
      "I design for the person processing orders at 4pm, tired, with a queue behind them.",
  },
  {
    title: "State is the product",
    detail:
      "Most business UI fails at state. Flows have to survive bad data, slow networks, and half-finished inputs.",
  },
  {
    title: "Structure over cleverness",
    detail:
      "A component that survives its second feature request beats one that impresses on day one.",
  },
  {
    title: "Dense is not noisy",
    detail:
      "Hierarchy, rhythm, and restraint are what make heavy data feel calm.",
  },
];
