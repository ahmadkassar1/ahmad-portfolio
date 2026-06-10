export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  index: string;
  name: string;
  kind: string;
  stack: string[];
  /** The context / problem the project addresses. */
  description: string;
  /** What was built and what it achieved. */
  highlights: string[];
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
    kind: "SaaS product · Personal build",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "AI workflows"],
    description:
      "Small businesses lose leads because capture, follow-up, and outreach live in different tools. This is a compact SaaS-style system that takes a lead from first contact to closed — in one place.",
    highlights: [
      "Lead capture flows store directly into Supabase and surface in a CRM-style pipeline with stages, follow-ups, and AI-generated outreach drafts.",
      "Built around sales operations from the start: pipeline logic, API routes, and automation hooks shape the whole data model.",
      "Internal screens for tracking leads and client follow-ups, with responsive layouts and validated form handling throughout.",
    ],
    links: [],
  },
  {
    index: "02",
    name: "Restaurant QR Menu & Ordering Platform",
    kind: "Multi-tenant product · Personal build",
    stack: ["Next.js", "Angular", "Supabase", "Responsive UI"],
    description:
      "Restaurants want QR menus and ordering without paying for a custom build each time. This platform is one reusable codebase a venue can be onboarded onto: menu, categories, pricing, and ordering flows.",
    highlights: [
      "Guest-facing QR menu browsing with categories, product detail, and ordering-focused UI flows tuned for phones at the table.",
      "Admin screens for managing restaurant data, categories, and menu items — the operator side gets the same care as the guest side.",
      "Designed as a product from day one — reusable business patterns make onboarding another restaurant a configuration exercise.",
    ],
    links: [],
  },
  {
    index: "03",
    name: "Content Publishing Platform",
    kind: "Editorial site · Personal build",
    stack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "SEO"],
    description:
      "A content site with a real editorial workflow behind it. Articles, categories, and a newsletter funnel — all manageable from an admin screen, without touching code.",
    highlights: [
      "Database-backed content management in Supabase with an admin publishing workflow from draft to live.",
      "Dynamic article and category pages built on reusable layouts, with per-page SEO metadata.",
      "Newsletter collection wired into the same data layer, ready for an email pipeline.",
    ],
    links: [],
  },
  {
    index: "04",
    name: "Scoopadoop E-Commerce Store",
    kind: "Storefront · Personal build",
    stack: ["Angular", "TypeScript", "Angular Signals", "SCSS", "REST APIs"],
    description:
      "A modern storefront built to exercise Angular's newest reactivity model — signals — on a real shopping experience: browsing, categories, product detail, and cart flows.",
    highlights: [
      "Reactive state handled with Angular Signals: user interactions, selected products, loading states, and flow changes stay predictable.",
      "Category-based navigation, product details, and cart-style flows on responsive shopping layouts.",
      "Reusable component patterns and clean routing — the structure holds up as the catalog grows.",
    ],
    links: [],
  },
];
