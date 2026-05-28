"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  /** Delay in seconds */
  delay?: number;
  /** Use plain fade instead of fade-up */
  fade?: boolean;
}

/**
 * Wraps children in a motion.div that fades (+ optionally slides) into view
 * once the element enters the viewport. Fires once only.
 */
export function AnimateIn({ children, className, delay = 0, fade = false }: AnimateInProps) {
  return (
    <motion.div
      className={className}
      variants={fade ? fadeIn : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger container — wraps a list of AnimateIn children so they animate in sequence.
 */
const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0 },
  },
};

interface StaggerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
}

export function StaggerIn({ children, className, delay = 0, stagger = 0.1 }: StaggerProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Child item for use inside StaggerIn.
 */
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeUp} transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}>
      {children}
    </motion.div>
  );
}
