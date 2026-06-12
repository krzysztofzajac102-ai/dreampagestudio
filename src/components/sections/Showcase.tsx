"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import FloatCube from "@/components/ui/FloatCube";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Mockup przeglądarki z mini-stroną — zamiast zdjęcia stockowego */
function BrowserMockup() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#11131f",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 30px 70px -20px rgba(0,0,0,0.7)",
      }}
    >
      {/* pasek przeglądarki */}
      <div
        className="flex items-center gap-2 px-4 h-9"
        style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid var(--hairline)" }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#fda4af" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#fcd34d" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#86efac" }} />
        <span
          className="ml-3 flex-1 max-w-[200px] h-5 rounded-full text-[9px] flex items-center px-3 text-[var(--ink)]/50 bg-white/10"
        >
          twojafirma.pl
        </span>
      </div>
      {/* mini landing */}
      <div className="aspect-[4/3] relative" style={{ background: "linear-gradient(150deg, #0d1020 0%, #1c2240 55%, #3b3f73 100%)" }}>
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div className="h-2.5 w-16 rounded-full bg-white/70" />
            <div className="flex gap-2">
              <div className="h-2 w-8 rounded-full bg-white/25" />
              <div className="h-2 w-8 rounded-full bg-white/25" />
              <div className="h-2 w-8 rounded-full bg-white/25" />
            </div>
          </div>
          <div className="h-4 md:h-6 w-3/4 rounded-full bg-white/85 mb-3" />
          <div className="h-4 md:h-6 w-1/2 rounded-full bg-white/85 mb-5" />
          <div className="h-2 w-2/3 rounded-full bg-white/30 mb-2" />
          <div className="h-2 w-1/2 rounded-full bg-white/30 mb-6 md:mb-8" />
          <div className="flex gap-3">
            <div className="h-8 md:h-9 w-28 rounded-full bg-white" />
            <div className="h-8 md:h-9 w-28 rounded-full border border-white/30" />
          </div>
          <div className="mt-auto grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 md:h-20 rounded-lg bg-white/10 border border-white/10 p-2.5">
                <div className="h-1.5 w-2/3 rounded-full bg-white/50 mb-1.5" />
                <div className="h-1.5 w-1/2 rounded-full bg-white/25" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Mockup pochylający się za kursorem (3D tilt) */
function TiltMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), {
    stiffness: 180,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), {
    stiffness: 180,
    damping: 22,
  });

  return (
    <div style={{ perspective: 1100 }}>
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={(e) => {
          if (!ref.current) return;
          const r = ref.current.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseLeave={() => {
          mx.set(0);
          my.set(0);
        }}
      >
        <BrowserMockup />
      </motion.div>
    </div>
  );
}

export default function Showcase() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="relative px-6 md:px-12 py-28 md:py-40 overflow-hidden"
      style={{
        borderTop: "1px solid var(--hairline)",
        background: "linear-gradient(180deg, #0e0f1e 0%, #0a0a14 100%)",
      }}
    >
      <FloatCube className="absolute right-[6%] top-12 hidden lg:block" size={48} variant="indigo" delay={0.8} />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <TiltMockup />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.12, duration: 0.7, ease: EASE }}
        >
          <h2 className="text-[var(--ink)] font-medium tracking-[-0.03em] leading-[1.05] text-4xl sm:text-5xl lg:text-6xl mb-7">
            Standard premium.
            <br />
            Na każdej stronie.
          </h2>
          <p className="text-[var(--ink)]/60 text-base md:text-lg leading-relaxed max-w-md mb-10">
            Każdy projekt traktuję jak własną wizytówkę: dopracowana typografia,
            szybkość ładowania, responsywność i treści, które prowadzą klienta
            prosto do kontaktu.
          </p>
          <a
            href="#oferta"
            className="inline-flex items-center px-7 h-12 rounded-full text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0a0a14] bg-white hover:bg-white/85 transition-colors"
          >
            Zobacz ofertę
          </a>
        </motion.div>
      </div>
    </section>
  );
}
