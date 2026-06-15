export type ProjectLink = {
  label: string;
  href: string;
  /** "demo" renders as the primary (filled) button; "repo"/undefined as a
   *  secondary outline link. */
  type?: "demo" | "repo";
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
  /** What building this proves — capability, not features. */
  demonstrates: string;
  /** Which coded vignette renders as this project's visual. */
  vignette: "pipeline" | "qr-menu" | "publishing" | "storefront";
  /**
   * Public links for this project (rendered by ProjectPanel; "demo" is the
   * primary button, "repo" a secondary outline link). Rows with no links
   * render nothing.
   *
   * NOTE (2026-06-15): the repos below are currently PRIVATE, so a public
   * visitor following a repo link gets a 404. To make these work for
   * recruiters, flip the repo to public in its GitHub settings (and redeploy
   * a live demo), then add it here, e.g.:
   *   links: [
   *     { type: "demo", label: "Live demo", href: "https://<demo-url>" },
   *     { type: "repo", label: "GitHub",    href: "https://github.com/ahmadkassar1/<repo>" },
   *   ]
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
      "A compact SaaS that takes a business lead from first contact to closed. Capture, pipeline stages, follow-ups, and AI-drafted outreach in one system.",
    highlights: [
      "Built around sales operations from the start: pipeline logic, API routes, and automation hooks shape the whole data model.",
      "Lead capture stores straight into Supabase and surfaces in a CRM-style pipeline with stages and follow-ups.",
    ],
    demonstrates:
      "One person owned the whole shape of it: schema, pipeline state, and the AI integration that writes into both.",
    vignette: "pipeline",
    links: [],
  },
  {
    index: "02",
    name: "Restaurant QR Menu & Ordering",
    kind: "Multi-tenant product",
    stack: ["Next.js", "Angular", "Supabase"],
    outcome:
      "One reusable codebase any venue can be onboarded onto: QR menu browsing, product management, and ordering flows tuned for phones at the table.",
    highlights: [
      "The operator side gets the same care as the guest side: admin screens for restaurant data, categories, and menu items.",
      "Reusable business patterns make onboarding another restaurant a configuration exercise.",
    ],
    demonstrates:
      "Two audiences, one codebase: staff at a laptop, guests on a phone at the table, and the tenant model that keeps them out of each other's way.",
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
    demonstrates:
      "The publishing workflow came first: article schema, categories, and per-page SEO all hang off decisions made before any UI existed.",
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
    demonstrates:
      "Fine-grained reactivity end to end: every cart change, filter, and loading state derives from signals instead of duplicated flags.",
    vignette: "storefront",
    // Matched to the `ecommerce-project` repo by its Angular e-commerce
    // description. Repo is currently PRIVATE (link 404s until made public);
    // its old Vercel demo is down. Flip the repo public / redeploy, then this
    // works as-is. Swap the href if Scoopadoop lives in a different repo.
    links: [
      {
        type: "repo",
        label: "GitHub",
        href: "https://github.com/ahmadkassar1/ecommerce-project",
      },
    ],
  },
];
