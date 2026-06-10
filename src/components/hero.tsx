"use client";

import { motion, stagger } from "motion/react";
import { MetaLabel } from "@/components/meta-label";
import { EASE } from "@/components/motion/reveal";
import { site } from "@/data/site";

const container = {
  hidden: {},
  show: {
    transition: { delayChildren: stagger(0.1, { startDelay: 0.1 }) },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <MetaLabel>{label}</MetaLabel>
      <p className="mt-2 text-sm text-ink-soft">{children}</p>
    </div>
  );
}

export function Hero() {
  return (
    <section>
      <div className="mx-auto max-w-5xl px-6 pb-20 pt-36 sm:pb-28 sm:pt-48">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <MetaLabel>Ahmad Kassar — Frontend Developer, Beirut</MetaLabel>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            Building the front end of software that{" "}
            <em className="font-serif font-medium italic text-accent">
              runs real businesses
            </em>
            .
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft"
          >
            Two years shipping ERP modules, dashboards, and workflow tools in
            Angular, React, and Next.js. Currently building TheBridge ERP at
            Horecons.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-5"
          >
            <a
              href="#work"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
            >
              Selected work
            </a>
            <a
              href="#contact"
              className="group text-sm font-medium text-ink transition-colors hover:text-accent"
            >
              Get in touch{" "}
              <span
                className="inline-block transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </a>
            <span className="flex items-center gap-2 font-mono text-xs text-ink-faint">
              <span
                className="h-1.5 w-1.5 rounded-full bg-accent"
                aria-hidden="true"
              />
              {site.availability}
            </span>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-20 grid gap-8 border-t border-line pt-8 sm:grid-cols-3"
          >
            <Fact label="Currently">Frontend Developer · Horecons</Fact>
            <Fact label="Previously">Interphase — Core Development Team</Fact>
            <Fact label="Elsewhere">
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group transition-colors hover:text-accent"
              >
                GitHub{" "}
                <span
                  className="inline-block transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </a>
              <span className="mx-2 text-ink-faint" aria-hidden="true">
                /
              </span>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group transition-colors hover:text-accent"
              >
                LinkedIn{" "}
                <span
                  className="inline-block transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </a>
            </Fact>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
