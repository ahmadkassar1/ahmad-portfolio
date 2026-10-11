import { site } from "@/data/site";

// Shared by the ledger and the Ops Deck so both views tell the same story.
export const aboutNarrative = [
  "I build business interfaces where the details matter: sales and stock screens, configurable forms, kanban boards and customer-facing flows. My work at Horecons and Interphase has centered on Angular and TypeScript.",
  "My training includes online coursework with Programming Advices and Scrimba, and participation in the four-week assessment at 42 Beirut. I keep applying that foundation through frontend projects and practical problem solving.",
  "For personal projects I also use React, Next.js and Supabase. I focus on reusable components, predictable state, accessible controls and verification of the interactions people rely on.",
];

export const aboutFacts = [
  { label: "Location", value: site.location },
  { label: "Languages", value: "Arabic & English" },
  { label: "Focus", value: "Business software & product interfaces" },
  { label: "Personal projects", value: "React, Next.js + Supabase" },
];
