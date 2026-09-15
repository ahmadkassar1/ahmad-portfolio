// CV facts from the attached PDF. Publication choices remain pending Gate A.
// The unedited evidence file is private and must never be imported by the site.
export interface CVLink {
  kind: 'linkedin' | 'github';
  sourceText: string;
  url: string;
}
export interface Experience {
  title: string;
  employer: string;
  location: string;
  start: string;
  end: string;
  datesAsWritten: string;
  achievements: string[];
  tools: string[];
}
export interface Education {
  title: string;
  institution: string;
  start: string;
  end: string;
  datesAsWritten: string;
  description: string | null;
}
export interface Credential {
  title: string;
  issuer: string | null;
  jurisdiction: string | null;
  issuedAsWritten: string | null;
  expiresAsWritten: string | null;
}
export interface SectionItem {
  title: string;
  tools: string[];
  achievements: string[];
  datesAsWritten: string | null;
  links: CVLink[];
}
export interface CVContent {
  identity: { name: string; location: string; language: 'en' };
  headline: string;
  summary: string;
  contact: { email: string; phone: string | null };
  links: CVLink[];
  experience: Experience[];
  education: Education[];
  credentials: Credential[];
  licences: Credential[];
  skills: { title: string; items: string[] }[];
  languages: { name: string; proficiency: string }[];
  sections: { title: string; items: SectionItem[] }[];
}
export interface SourceMapping {
  field: string;
  startLine: number;
  endLine: number;
  method: 'source-substring' | 'verbatim-bullet' | 'https-prefix';
}

export const cv: CVContent = {
  "identity": {
    "name": "Ahmad Kassar",
    "location": "Beirut, Lebanon",
    "language": "en"
  },
  "headline": "FULL-STACK DEVELOPER — WEB APPS & ERP SYSTEMS",
  "summary": "Full-stack developer with 3 years building ERP and business-platform software end to end: Angular and TypeScript on the client, Next.js API routes, Node.js, and PostgreSQL behind it. Shipped features on two production systems — TheBridge (Horecons' sales and inventory ERP) and Populus (Interphase's configurable business platform) — across order entry, inventory, task boards, form builders, and workflow automation. Independently designed, built, and deployed 4 products, including an AI lead-generation SaaS and a multi-tenant restaurant ordering platform on Next.js and Supabase, plus n8n and LLM-driven automation. Beirut-based, comfortable owning a feature from database schema to shipped UI.",
  "contact": {
    "email": "ahmadkassar771@gmail.com",
    "phone": null
  },
  "links": [
    {
      "kind": "linkedin",
      "sourceText": "linkedin.com/in/ahmad-kassar-2627ab2bb",
      "url": "https://linkedin.com/in/ahmad-kassar-2627ab2bb"
    },
    {
      "kind": "github",
      "sourceText": "github.com/ahmadkassar1",
      "url": "https://github.com/ahmadkassar1"
    }
  ],
  "experience": [
    {
      "title": "Frontend Developer",
      "employer": "Horecons",
      "location": "Ghazir, Lebanon",
      "start": "Oct 2025",
      "end": "Present",
      "datesAsWritten": "Oct 2025 – Present",
      "achievements": [
        "Extend TheBridge, the ERP Horecons runs its daily sales and inventory operations on, shipping Angular features built with standalone components and signals through pull-request review.",
        "Build responsive, keyboard-accessible CRUD screens across 3 ERP modules — SalesSphere (sales), Stock Management (inventory), and ProjectPilot (projects) — all integrated with REST APIs through RxJS async data flows.",
        "Design entry-time form validation in the SalesSphere order flow that catches data-entry errors before an order is submitted, covered with Jasmine unit tests.",
        "Deliver React and Next.js web applications for clients in the UAE, landed against fixed event-date deadlines and handed over with post-launch support.",
        "Automate lead capture by wiring form submissions into n8n workflows, so new leads enter the pipeline without manual re-entry."
      ],
      "tools": [
        "Angular",
        "REST APIs",
        "RxJS",
        "Jasmine",
        "React",
        "Next.js",
        "n8n"
      ]
    },
    {
      "title": "Frontend Developer",
      "employer": "Interphase",
      "location": "Beirut, Lebanon",
      "start": "Mar 2024",
      "end": "Sep 2025",
      "datesAsWritten": "Mar 2024 – Sep 2025",
      "achievements": [
        "Developed 3 core modules of Populus, a business platform where teams configure their own workflows — the Kanban task board, form builder, and website builder — using Angular and TypeScript in Agile sprints.",
        "Owned the Kanban task board build — task states, columns, filters, and the automation engine that moved tasks between states — plus the client-side state management behind board interactions.",
        "Constructed the form builder with Angular reactive forms and RxJS-driven submission logic: dynamic fields, modular form sections, validation flows, and state transitions behind user-configured workflows.",
        "Implemented the website builder's composable sections and UI blocks with semantic HTML5 structure, which end users arranged and customized without developer involvement."
      ],
      "tools": [
        "Angular",
        "TypeScript",
        "RxJS",
        "HTML5"
      ]
    }
  ],
  "education": [
    {
      "title": "Software Engineering Program (project-based, peer-to-peer)",
      "institution": "42 Beirut",
      "start": "2024",
      "end": "2025",
      "datesAsWritten": "2024 – 2025",
      "description": "Completed alongside the full-time role at Interphase: C and C++, algorithms, data structures, memory management, Linux, Git, shell scripting, debugging, and peer code review."
    },
    {
      "title": "B.A. in Business Administration",
      "institution": "Institut Renee Mouawad",
      "start": "2020",
      "end": "2022",
      "datesAsWritten": "2020 – 2022",
      "description": null
    }
  ],
  "credentials": [],
  "licences": [],
  "skills": [
    {
      "title": "Frontend",
      "items": [
        "TypeScript",
        "JavaScript (ES6+)",
        "Angular (standalone components, signals, RxJS)",
        "React",
        "Next.js (App Router)",
        "HTML5",
        "CSS3",
        "Tailwind CSS",
        "SCSS",
        "shadcn/ui",
        "reactive forms",
        "responsive mobile-first design",
        "accessibility (a11y)",
        "SEO"
      ]
    },
    {
      "title": "Backend and Data",
      "items": [
        "Node.js",
        "Next.js API routes",
        "REST API design and integration",
        "PostgreSQL",
        "Supabase (auth, row-level security)",
        "SQL",
        "database schema design",
        "multi-tenant architecture",
        "authentication and role-based access"
      ]
    },
    {
      "title": "AI and Automation",
      "items": [
        "LLM API integration (OpenAI, Claude)",
        "AI-generated content inside product flows",
        "prompt design",
        "n8n workflow automation",
        "webhooks and third-party API integrations",
        "automated lead-capture pipelines"
      ]
    },
    {
      "title": "Engineering and Delivery",
      "items": [
        "Git",
        "GitHub",
        "pull-request code review",
        "unit testing (Jasmine, Jest)",
        "Agile sprints",
        "Angular CLI",
        "Vite",
        "Webpack",
        "Vercel CI/CD pipelines",
        "Linux",
        "shell scripting",
        "C and C++ fundamentals"
      ]
    }
  ],
  "languages": [
    {
      "name": "Arabic",
      "proficiency": "Native"
    },
    {
      "name": "English",
      "proficiency": "Professional working proficiency"
    }
  ],
  "sections": [
    {
      "title": "PROJECTS",
      "items": [
        {
          "title": "AI Lead-Generation and CRM Pipeline SaaS",
          "tools": [
            "Next.js",
            "TypeScript",
            "Supabase",
            "API routes",
            "LLM integration"
          ],
          "achievements": [
            "Built a SaaS-style lead-management product that moved leads from capture to closed deal: forms stored submissions in Supabase and fed a CRM pipeline with stages, follow-ups, and AI-drafted outreach messages.",
            "Modeled the database schema, pipeline stages, and API routes, and integrated the AI generation step so each lead record carried a ready-to-send outreach draft."
          ],
          "datesAsWritten": null,
          "links": []
        },
        {
          "title": "Restaurant QR Menu and Ordering Platform",
          "tools": [
            "Next.js",
            "Supabase (PostgreSQL)",
            "multi-tenant architecture"
          ],
          "achievements": [
            "Created a multi-tenant restaurant platform with QR menu browsing, product and category management, pricing, and ordering flows, designed mobile-first for diners using their own phones at the table.",
            "Enabled each new venue to onboard through configuration rather than code, with admin screens managing restaurant data, categories, and menu items per tenant."
          ],
          "datesAsWritten": null,
          "links": []
        },
        {
          "title": "Content Publishing Platform",
          "tools": [
            "Next.js",
            "TypeScript",
            "Supabase",
            "Tailwind CSS"
          ],
          "achievements": [
            "Developed a content platform with a full editorial workflow — database-backed articles, categories, newsletter signup, and an admin publishing flow from draft to live — deployed through a Vercel CI/CD pipeline.",
            "Standardized page layouts with per-page SEO metadata and connected newsletter capture to the same data layer as the articles."
          ],
          "datesAsWritten": null,
          "links": []
        },
        {
          "title": "Scoopadoop E-Commerce Store",
          "tools": [
            "Angular (signals)",
            "TypeScript",
            "SCSS",
            "REST APIs"
          ],
          "achievements": [
            "Derived every cart change, filter, and loading state from Angular signals' fine-grained reactivity, replacing duplicated flag variables and the redundant re-renders they caused.",
            "Structured product browsing, category navigation, product detail, and cart checkout as 4 separate routed views sharing one component architecture, so each flow could change without touching the others."
          ],
          "datesAsWritten": null,
          "links": []
        }
      ]
    }
  ]
};

export const provenance: readonly SourceMapping[] = [
  {
    "field": "identity.name",
    "startLine": 1,
    "endLine": 1,
    "method": "source-substring"
  },
  {
    "field": "identity.location",
    "startLine": 3,
    "endLine": 3,
    "method": "source-substring"
  },
  {
    "field": "headline",
    "startLine": 2,
    "endLine": 2,
    "method": "source-substring"
  },
  {
    "field": "summary",
    "startLine": 7,
    "endLine": 13,
    "method": "source-substring"
  },
  {
    "field": "contact.email",
    "startLine": 3,
    "endLine": 3,
    "method": "source-substring"
  },
  {
    "field": "links.0.sourceText",
    "startLine": 4,
    "endLine": 4,
    "method": "source-substring"
  },
  {
    "field": "links.0.url",
    "startLine": 4,
    "endLine": 4,
    "method": "https-prefix"
  },
  {
    "field": "links.1.sourceText",
    "startLine": 4,
    "endLine": 4,
    "method": "source-substring"
  },
  {
    "field": "links.1.url",
    "startLine": 4,
    "endLine": 4,
    "method": "https-prefix"
  },
  {
    "field": "experience.0.title",
    "startLine": 28,
    "endLine": 28,
    "method": "source-substring"
  },
  {
    "field": "experience.0.employer",
    "startLine": 28,
    "endLine": 28,
    "method": "source-substring"
  },
  {
    "field": "experience.0.start",
    "startLine": 28,
    "endLine": 28,
    "method": "source-substring"
  },
  {
    "field": "experience.0.end",
    "startLine": 28,
    "endLine": 28,
    "method": "source-substring"
  },
  {
    "field": "experience.0.datesAsWritten",
    "startLine": 28,
    "endLine": 28,
    "method": "source-substring"
  },
  {
    "field": "experience.0.location",
    "startLine": 29,
    "endLine": 29,
    "method": "source-substring"
  },
  {
    "field": "experience.0.achievements.0",
    "startLine": 30,
    "endLine": 31,
    "method": "verbatim-bullet"
  },
  {
    "field": "experience.0.achievements.1",
    "startLine": 32,
    "endLine": 34,
    "method": "verbatim-bullet"
  },
  {
    "field": "experience.0.achievements.2",
    "startLine": 35,
    "endLine": 36,
    "method": "verbatim-bullet"
  },
  {
    "field": "experience.0.achievements.3",
    "startLine": 37,
    "endLine": 38,
    "method": "verbatim-bullet"
  },
  {
    "field": "experience.0.achievements.4",
    "startLine": 39,
    "endLine": 40,
    "method": "verbatim-bullet"
  },
  {
    "field": "experience.0.tools.0",
    "startLine": 30,
    "endLine": 31,
    "method": "source-substring"
  },
  {
    "field": "experience.0.tools.1",
    "startLine": 32,
    "endLine": 34,
    "method": "source-substring"
  },
  {
    "field": "experience.0.tools.2",
    "startLine": 32,
    "endLine": 34,
    "method": "source-substring"
  },
  {
    "field": "experience.0.tools.3",
    "startLine": 35,
    "endLine": 36,
    "method": "source-substring"
  },
  {
    "field": "experience.0.tools.4",
    "startLine": 37,
    "endLine": 38,
    "method": "source-substring"
  },
  {
    "field": "experience.0.tools.5",
    "startLine": 37,
    "endLine": 38,
    "method": "source-substring"
  },
  {
    "field": "experience.0.tools.6",
    "startLine": 39,
    "endLine": 40,
    "method": "source-substring"
  },
  {
    "field": "experience.1.title",
    "startLine": 41,
    "endLine": 41,
    "method": "source-substring"
  },
  {
    "field": "experience.1.employer",
    "startLine": 41,
    "endLine": 41,
    "method": "source-substring"
  },
  {
    "field": "experience.1.start",
    "startLine": 41,
    "endLine": 41,
    "method": "source-substring"
  },
  {
    "field": "experience.1.end",
    "startLine": 41,
    "endLine": 41,
    "method": "source-substring"
  },
  {
    "field": "experience.1.datesAsWritten",
    "startLine": 41,
    "endLine": 41,
    "method": "source-substring"
  },
  {
    "field": "experience.1.location",
    "startLine": 42,
    "endLine": 42,
    "method": "source-substring"
  },
  {
    "field": "experience.1.achievements.0",
    "startLine": 43,
    "endLine": 44,
    "method": "verbatim-bullet"
  },
  {
    "field": "experience.1.achievements.1",
    "startLine": 45,
    "endLine": 46,
    "method": "verbatim-bullet"
  },
  {
    "field": "experience.1.achievements.2",
    "startLine": 47,
    "endLine": 48,
    "method": "verbatim-bullet"
  },
  {
    "field": "experience.1.achievements.3",
    "startLine": 49,
    "endLine": 50,
    "method": "verbatim-bullet"
  },
  {
    "field": "experience.1.tools.0",
    "startLine": 43,
    "endLine": 44,
    "method": "source-substring"
  },
  {
    "field": "experience.1.tools.1",
    "startLine": 43,
    "endLine": 44,
    "method": "source-substring"
  },
  {
    "field": "experience.1.tools.2",
    "startLine": 47,
    "endLine": 48,
    "method": "source-substring"
  },
  {
    "field": "experience.1.tools.3",
    "startLine": 49,
    "endLine": 50,
    "method": "source-substring"
  },
  {
    "field": "skills.0.title",
    "startLine": 16,
    "endLine": 16,
    "method": "source-substring"
  },
  {
    "field": "skills.0.items.0",
    "startLine": 16,
    "endLine": 18,
    "method": "source-substring"
  },
  {
    "field": "skills.0.items.1",
    "startLine": 16,
    "endLine": 18,
    "method": "source-substring"
  },
  {
    "field": "skills.0.items.2",
    "startLine": 16,
    "endLine": 18,
    "method": "source-substring"
  },
  {
    "field": "skills.0.items.3",
    "startLine": 16,
    "endLine": 18,
    "method": "source-substring"
  },
  {
    "field": "skills.0.items.4",
    "startLine": 16,
    "endLine": 18,
    "method": "source-substring"
  },
  {
    "field": "skills.0.items.5",
    "startLine": 16,
    "endLine": 18,
    "method": "source-substring"
  },
  {
    "field": "skills.0.items.6",
    "startLine": 16,
    "endLine": 18,
    "method": "source-substring"
  },
  {
    "field": "skills.0.items.7",
    "startLine": 16,
    "endLine": 18,
    "method": "source-substring"
  },
  {
    "field": "skills.0.items.8",
    "startLine": 16,
    "endLine": 18,
    "method": "source-substring"
  },
  {
    "field": "skills.0.items.9",
    "startLine": 16,
    "endLine": 18,
    "method": "source-substring"
  },
  {
    "field": "skills.0.items.10",
    "startLine": 16,
    "endLine": 18,
    "method": "source-substring"
  },
  {
    "field": "skills.0.items.11",
    "startLine": 16,
    "endLine": 18,
    "method": "source-substring"
  },
  {
    "field": "skills.0.items.12",
    "startLine": 16,
    "endLine": 18,
    "method": "source-substring"
  },
  {
    "field": "skills.0.items.13",
    "startLine": 16,
    "endLine": 18,
    "method": "source-substring"
  },
  {
    "field": "skills.1.title",
    "startLine": 19,
    "endLine": 19,
    "method": "source-substring"
  },
  {
    "field": "skills.1.items.0",
    "startLine": 19,
    "endLine": 21,
    "method": "source-substring"
  },
  {
    "field": "skills.1.items.1",
    "startLine": 19,
    "endLine": 21,
    "method": "source-substring"
  },
  {
    "field": "skills.1.items.2",
    "startLine": 19,
    "endLine": 21,
    "method": "source-substring"
  },
  {
    "field": "skills.1.items.3",
    "startLine": 19,
    "endLine": 21,
    "method": "source-substring"
  },
  {
    "field": "skills.1.items.4",
    "startLine": 19,
    "endLine": 21,
    "method": "source-substring"
  },
  {
    "field": "skills.1.items.5",
    "startLine": 19,
    "endLine": 21,
    "method": "source-substring"
  },
  {
    "field": "skills.1.items.6",
    "startLine": 19,
    "endLine": 21,
    "method": "source-substring"
  },
  {
    "field": "skills.1.items.7",
    "startLine": 19,
    "endLine": 21,
    "method": "source-substring"
  },
  {
    "field": "skills.1.items.8",
    "startLine": 19,
    "endLine": 21,
    "method": "source-substring"
  },
  {
    "field": "skills.2.title",
    "startLine": 22,
    "endLine": 22,
    "method": "source-substring"
  },
  {
    "field": "skills.2.items.0",
    "startLine": 22,
    "endLine": 23,
    "method": "source-substring"
  },
  {
    "field": "skills.2.items.1",
    "startLine": 22,
    "endLine": 23,
    "method": "source-substring"
  },
  {
    "field": "skills.2.items.2",
    "startLine": 22,
    "endLine": 23,
    "method": "source-substring"
  },
  {
    "field": "skills.2.items.3",
    "startLine": 22,
    "endLine": 23,
    "method": "source-substring"
  },
  {
    "field": "skills.2.items.4",
    "startLine": 22,
    "endLine": 23,
    "method": "source-substring"
  },
  {
    "field": "skills.2.items.5",
    "startLine": 22,
    "endLine": 23,
    "method": "source-substring"
  },
  {
    "field": "skills.3.title",
    "startLine": 24,
    "endLine": 24,
    "method": "source-substring"
  },
  {
    "field": "skills.3.items.0",
    "startLine": 24,
    "endLine": 25,
    "method": "source-substring"
  },
  {
    "field": "skills.3.items.1",
    "startLine": 24,
    "endLine": 25,
    "method": "source-substring"
  },
  {
    "field": "skills.3.items.2",
    "startLine": 24,
    "endLine": 25,
    "method": "source-substring"
  },
  {
    "field": "skills.3.items.3",
    "startLine": 24,
    "endLine": 25,
    "method": "source-substring"
  },
  {
    "field": "skills.3.items.4",
    "startLine": 24,
    "endLine": 25,
    "method": "source-substring"
  },
  {
    "field": "skills.3.items.5",
    "startLine": 24,
    "endLine": 25,
    "method": "source-substring"
  },
  {
    "field": "skills.3.items.6",
    "startLine": 24,
    "endLine": 25,
    "method": "source-substring"
  },
  {
    "field": "skills.3.items.7",
    "startLine": 24,
    "endLine": 25,
    "method": "source-substring"
  },
  {
    "field": "skills.3.items.8",
    "startLine": 24,
    "endLine": 25,
    "method": "source-substring"
  },
  {
    "field": "skills.3.items.9",
    "startLine": 24,
    "endLine": 25,
    "method": "source-substring"
  },
  {
    "field": "skills.3.items.10",
    "startLine": 24,
    "endLine": 25,
    "method": "source-substring"
  },
  {
    "field": "skills.3.items.11",
    "startLine": 24,
    "endLine": 25,
    "method": "source-substring"
  },
  {
    "field": "sections.0.title",
    "startLine": 51,
    "endLine": 51,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.0.title",
    "startLine": 52,
    "endLine": 52,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.0.tools.0",
    "startLine": 52,
    "endLine": 52,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.0.tools.1",
    "startLine": 52,
    "endLine": 52,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.0.tools.2",
    "startLine": 52,
    "endLine": 52,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.0.tools.3",
    "startLine": 52,
    "endLine": 52,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.0.tools.4",
    "startLine": 52,
    "endLine": 52,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.0.achievements.0",
    "startLine": 53,
    "endLine": 55,
    "method": "verbatim-bullet"
  },
  {
    "field": "sections.0.items.0.achievements.1",
    "startLine": 56,
    "endLine": 57,
    "method": "verbatim-bullet"
  },
  {
    "field": "sections.0.items.1.title",
    "startLine": 58,
    "endLine": 58,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.1.tools.0",
    "startLine": 58,
    "endLine": 58,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.1.tools.1",
    "startLine": 58,
    "endLine": 58,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.1.tools.2",
    "startLine": 58,
    "endLine": 58,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.1.achievements.0",
    "startLine": 59,
    "endLine": 60,
    "method": "verbatim-bullet"
  },
  {
    "field": "sections.0.items.1.achievements.1",
    "startLine": 61,
    "endLine": 62,
    "method": "verbatim-bullet"
  },
  {
    "field": "sections.0.items.2.title",
    "startLine": 63,
    "endLine": 63,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.2.tools.0",
    "startLine": 63,
    "endLine": 63,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.2.tools.1",
    "startLine": 63,
    "endLine": 63,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.2.tools.2",
    "startLine": 63,
    "endLine": 63,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.2.tools.3",
    "startLine": 63,
    "endLine": 63,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.2.achievements.0",
    "startLine": 64,
    "endLine": 66,
    "method": "verbatim-bullet"
  },
  {
    "field": "sections.0.items.2.achievements.1",
    "startLine": 67,
    "endLine": 68,
    "method": "verbatim-bullet"
  },
  {
    "field": "sections.0.items.3.title",
    "startLine": 69,
    "endLine": 69,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.3.tools.0",
    "startLine": 69,
    "endLine": 69,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.3.tools.1",
    "startLine": 69,
    "endLine": 69,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.3.tools.2",
    "startLine": 69,
    "endLine": 69,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.3.tools.3",
    "startLine": 69,
    "endLine": 69,
    "method": "source-substring"
  },
  {
    "field": "sections.0.items.3.achievements.0",
    "startLine": 70,
    "endLine": 71,
    "method": "verbatim-bullet"
  },
  {
    "field": "sections.0.items.3.achievements.1",
    "startLine": 72,
    "endLine": 73,
    "method": "verbatim-bullet"
  },
  {
    "field": "education.0.title",
    "startLine": 76,
    "endLine": 76,
    "method": "source-substring"
  },
  {
    "field": "education.0.institution",
    "startLine": 76,
    "endLine": 76,
    "method": "source-substring"
  },
  {
    "field": "education.0.start",
    "startLine": 76,
    "endLine": 76,
    "method": "source-substring"
  },
  {
    "field": "education.0.end",
    "startLine": 76,
    "endLine": 76,
    "method": "source-substring"
  },
  {
    "field": "education.0.datesAsWritten",
    "startLine": 76,
    "endLine": 76,
    "method": "source-substring"
  },
  {
    "field": "education.0.description",
    "startLine": 77,
    "endLine": 78,
    "method": "source-substring"
  },
  {
    "field": "education.1.title",
    "startLine": 80,
    "endLine": 80,
    "method": "source-substring"
  },
  {
    "field": "education.1.institution",
    "startLine": 80,
    "endLine": 80,
    "method": "source-substring"
  },
  {
    "field": "education.1.start",
    "startLine": 80,
    "endLine": 80,
    "method": "source-substring"
  },
  {
    "field": "education.1.end",
    "startLine": 80,
    "endLine": 80,
    "method": "source-substring"
  },
  {
    "field": "education.1.datesAsWritten",
    "startLine": 80,
    "endLine": 80,
    "method": "source-substring"
  },
  {
    "field": "languages.0.name",
    "startLine": 83,
    "endLine": 83,
    "method": "source-substring"
  },
  {
    "field": "languages.0.proficiency",
    "startLine": 83,
    "endLine": 83,
    "method": "source-substring"
  },
  {
    "field": "languages.1.name",
    "startLine": 83,
    "endLine": 83,
    "method": "source-substring"
  },
  {
    "field": "languages.1.proficiency",
    "startLine": 83,
    "endLine": 83,
    "method": "source-substring"
  }
];
