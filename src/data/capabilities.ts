export type Capability = {
  index: string;
  title: string;
  description: string;
};

export const capabilities: Capability[] = [
  {
    index: "01",
    title: "Operations software",
    description:
      "ERP modules for stock, sales, and projects: forms, tables, filters, and validation that catches a mistake before an order ships wrong.",
  },
  {
    index: "02",
    title: "Pipelines & workflows",
    description:
      "Kanban boards, CRM stages, form builders, automation-connected flows. State that moves between columns and statuses without surprising anyone.",
  },
  {
    index: "03",
    title: "Dashboards & internal tools",
    description:
      "KPI surfaces, data tables, and admin panels, built for the people who look at them eight hours a day.",
  },
  {
    index: "04",
    title: "Commerce & content",
    description:
      "Storefronts, QR ordering, and publishing platforms: customer-facing products built with the same discipline as the back office.",
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
