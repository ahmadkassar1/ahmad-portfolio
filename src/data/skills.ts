export type SkillGroup = {
  label: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "HTML", "CSS / SCSS", "SQL"],
  },
  {
    label: "Frameworks & UI",
    items: [
      "Angular — standalone components, signals",
      "React",
      "Next.js — App Router",
      "Tailwind CSS",
      "Component-driven design (shadcn/ui patterns)",
    ],
  },
  {
    label: "State & data",
    items: [
      "Angular Signals · SignalStore concepts",
      "RxJS",
      "REST APIs · async programming",
      "Supabase",
      "Routing, guards & navigation flows",
    ],
  },
  {
    label: "Tooling",
    items: [
      "Git / GitHub",
      "Angular CLI · Vite · Webpack",
      "Vercel",
      "Linux & shell",
      "n8n automation",
    ],
  },
  {
    label: "Systems foundations",
    items: [
      "C / C++",
      "Algorithms & data structures",
      "Memory management",
      "Peer code review",
    ],
  },
];
