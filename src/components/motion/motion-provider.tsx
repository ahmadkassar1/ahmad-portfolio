"use client";

import { LazyMotion, MotionConfig } from "motion/react";

const loadFeatures = () =>
  import("./features").then((module) => module.default);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion strict features={loadFeatures}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
