"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";

/*
  Kostka 3D v2 (czysty CSS 3D + framer):
  - gradientowe, podświetlane ściany z wewnętrznym glow (głębia zamiast "drucianej" ramki)
  - miękki cień eliptyczny pod spodem, oddychający z lewitacją
  - INTERAKTYWNA: pochyla się za kursorem (spring) i rośnie na hover
  Respektuje prefers-reduced-motion (globals.css).
*/

type Variant = "indigo" | "cyan" | "ink";

const COLORS: Record<
  Variant,
  { faceA: string; faceB: string; edge: string; glow: string; shadow: string }
> = {
  indigo: {
    faceA: "rgba(129,140,248,0.38)",
    faceB: "rgba(139,92,246,0.12)",
    edge: "rgba(129,140,248,0.75)",
    glow: "rgba(99,102,241,0.45)",
    shadow: "rgba(0,0,0,0.6)",
  },
  cyan: {
    faceA: "rgba(34,211,238,0.34)",
    faceB: "rgba(103,232,249,0.10)",
    edge: "rgba(103,232,249,0.7)",
    glow: "rgba(34,211,238,0.45)",
    shadow: "rgba(0,0,0,0.6)",
  },
  ink: {
    faceA: "rgba(255,255,255,0.16)",
    faceB: "rgba(255,255,255,0.04)",
    edge: "rgba(255,255,255,0.4)",
    glow: "rgba(255,255,255,0.14)",
    shadow: "rgba(0,0,0,0.55)",
  },
};

export default function FloatCube({
  size = 56,
  variant = "indigo",
  duration = 16,
  floatDuration = 6,
  delay = 0,
  className = "",
}: {
  size?: number;
  variant?: Variant;
  duration?: number;
  floatDuration?: number;
  delay?: number;
  className?: string;
}) {
  const c = COLORS[variant];
  const half = size / 2;

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 14, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 140, damping: 14, mass: 0.4 });

  const faceStyle = (transform: string): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    background: `linear-gradient(135deg, ${c.faceA}, ${c.faceB})`,
    border: `1px solid ${c.edge}`,
    boxShadow: `inset 0 0 ${size * 0.3}px ${c.glow}`,
    transform,
    backfaceVisibility: "visible",
  });

  return (
    <motion.div
      aria-hidden
      className={`${className}`}
      style={{ width: size, height: size + 18, perspective: 600 }}
      whileHover={{ scale: 1.16 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 46);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 46);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {/* lewitacja */}
      <div
        style={{
          width: size,
          height: size,
          animation: `fc-float ${floatDuration}s ease-in-out ${delay}s infinite`,
        }}
      >
        {/* tilt za kursorem (spring) */}
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            rotateX: srx,
            rotateY: sry,
            transformStyle: "preserve-3d",
          }}
        >
          {/* bazowy obrót */}
          <div
            style={{
              width: "100%",
              height: "100%",
              transformStyle: "preserve-3d",
              animation: `fc-spin ${duration}s linear ${delay}s infinite`,
            }}
          >
            <div style={faceStyle(`translateZ(${half}px)`)} />
            <div style={faceStyle(`rotateY(180deg) translateZ(${half}px)`)} />
            <div style={faceStyle(`rotateY(90deg) translateZ(${half}px)`)} />
            <div style={faceStyle(`rotateY(-90deg) translateZ(${half}px)`)} />
            <div style={faceStyle(`rotateX(90deg) translateZ(${half}px)`)} />
            <div style={faceStyle(`rotateX(-90deg) translateZ(${half}px)`)} />
          </div>
        </motion.div>
      </div>

      {/* cień pod kostką — oddycha w kontrze do lewitacji */}
      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          bottom: 0,
          height: size * 0.16,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${c.shadow} 0%, transparent 70%)`,
          filter: "blur(3px)",
          animation: `fc-shadow ${floatDuration}s ease-in-out ${delay}s infinite`,
        }}
      />
    </motion.div>
  );
}
