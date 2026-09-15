'use client';

import { motion, MotionConfig, useReducedMotion } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { theme } from '@/styles/tokens';

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div ref={ref} className={`reveal ${className}`}
      initial={{ y: reduce ? 0 : theme.motion.distance }}
      whileInView={{ y: 0 }} viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: reduce ? 0 : theme.motion.reveal, ease: theme.motion.ease }}
      onAnimationStart={() => { if (ref.current) ref.current.style.willChange = 'transform'; }}
      onAnimationComplete={() => { if (ref.current) ref.current.style.willChange = 'auto'; }}>
      {children}
    </motion.div>
  );
}
