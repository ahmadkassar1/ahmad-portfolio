import { site } from "@/data/site";

// Shared by the ledger and the Ops Deck so both views tell the same story.
export const aboutNarrative = [
  "I am a full-stack developer and ERP specialist with 3+ years of web development experience. My work focuses on B2B business software, from project management, finance, accounting, sales, and stock management to configurable forms and Kanban workflows.",
  "At Horecons and Interphase, I built Angular and TypeScript features for business platforms. My project work also spans React and Next.js applications, backend API routes, Supabase, PostgreSQL, AI-integrated CRM features, and n8n automation.",
  "I focus on reusable components, clear data flows, accessible controls, and automated tests. My training includes coursework with Programming Advices and Scrimba, plus participation in the four-week assessment at 42 Beirut.",
];

export const aboutFacts = [
  { label: "Location", value: site.location },
  { label: "Languages", value: "Arabic & English" },
  { label: "Focus", value: "B2B ERP, SaaS & AI integrations" },
  { label: "Development", value: "Interfaces, APIs & data" },
];
