"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

/*
  Miękka indygo poświata podążająca za kursorem (desktop).
  Spring daje "płynące" opóźnienie — efekt premium, nie nachalny.
*/
export default function CursorGlow() {
  const mx = useMotionValue(-600);
  const my = useMotionValue(-600);
  const x = useSpring(mx, { stiffness: 90, damping: 18, mass: 0.6 });
  const y = useSpring(my, { stiffness: 90, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[5] hidden md:block"
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
    >
      <div
        className="w-[480px] h-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(99,102,241,0.07) 35%, transparent 65%)",
        }}
      />
    </motion.div>
  );
}
