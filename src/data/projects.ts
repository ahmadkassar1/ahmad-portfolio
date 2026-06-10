export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  index: string;
  name: string;
  kind: string;
  stack: string[];
  /** One outcome-first sentence — the only prose at showcase level. */
  outcome: string;
  /** Up to two supporting points. */
  highlights: string[];
  /** Which coded vignette renders as this project's visual. */
  vignette: "pipeline" | "qr-menu" | "publishing" | "storefront";
  /**
   * Public links for this project.
   * TODO: add real URLs when the repos/demos are public, e.g.
   *   links: [
   *     { label: "GitHub", href: "https://github.com/ahmadkassar1/<repo>" },
   *     { label: "Live demo", href: "https://<demo-url>" },
   *   ]
   * Rows without links simply don't render a link row.
   */
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    index: "01",
    name: "AI Lead Generation & CRM Pipeline",
    kind: "SaaS product",
    stack: ["Next.js", "TypeScript", "Supabase", "AI workflows"],
    outcome:
      "A compact SaaS that takes a business lead from first contact to closed — capture, pipeline stages, follow-ups, and AI-drafted outreach in one system.",
    highlights: [
      "Built around sales operations from the start: pipeline logic, API routes, and automation hooks shape the whole data model.",
      "Lead capture stores straight into Supabase and surfaces in a CRM-style pipeline with stages and follow-ups.",
    ],
    vignette: "pipeline",
    links: [],
  },
  {
    index: "02",
    name: "Restaurant QR Menu & Ordering",
    kind: "Multi-tenant product",
    stack: ["Next.js", "Angular", "Supabase"],
    outcome:
      "One reusable codebase any venue can be onboarded onto — QR menu browsing, product management, and ordering flows tuned for phones at the table.",
    highlights: [
      "The operator side gets the same care as the guest side: admin screens for restaurant data, categories, and menu items.",
      "Reusable business patterns make onboarding another restaurant a configuration exercise.",
    ],
    vignette: "qr-menu",
    links: [],
  },
  {
    index: "03",
    name: "Content Publishing Platform",
    kind: "Editorial platform",
    stack: ["Next.js", "TypeScript", "Supabase", "SEO"],
    outcome:
      "A content site with a real editorial workflow behind it: database-backed articles, categories, and a newsletter funnel, publishable from an admin screen.",
    highlights: [
      "Admin publishing workflow from draft to live, on reusable page layouts with per-page SEO metadata.",
      "Newsletter collection wired into the same data layer, ready for an email pipeline.",
    ],
    vignette: "publishing",
    links: [],
  },
  {
    index: "04",
    name: "Scoopadoop E-Commerce Store",
    kind: "Storefront",
    stack: ["Angular", "TypeScript", "Signals", "SCSS"],
    outcome:
      "A storefront where browsing, product detail, and cart flows stay instant — interaction state runs on Angular signals end to end.",
    highlights: [
      "Reactive state with Angular Signals keeps interactions, loading states, and flow changes predictable.",
      "Reusable component patterns and clean routing — the structure holds up as the catalog grows.",
    ],
    vignette: "storefront",
    links: [],
  },
];
