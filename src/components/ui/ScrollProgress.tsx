"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/* Cienki gradientowy pasek postępu scrolla na górze strony.
   useSpring wymusza ścieżkę JS (bug natywnego scroll-timeline w Framer 12). */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.4 });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60] pointer-events-none"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #6366f1, #8b5cf6 55%, #22d3ee)",
      }}
    />
  );
}
