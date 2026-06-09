"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "Projekt i strategia",
    desc: "Analizuję Twój biznes i branżę. Dobieramy kolory, układ i treść pod Twoich konkretnych klientów — nie generyczny szablon.",
  },
  {
    num: "02",
    title: "AI-powered build",
    desc: "Buduję stronę z nowoczesnym stackiem technologicznym i narzędziami AI. Szybciej, lepiej i taniej niż tradycyjna agencja.",
  },
  {
    num: "03",
    title: "Mobile first",
    desc: "Każda sekcja testowana na telefonie, tablecie i komputerze. Ponad 70% klientów hydraulika, restauracji czy salonu szuka przez telefon.",
  },
  {
    num: "04",
    title: "Gotowe w 48 godzin",
    desc: "Od dostarczenia materiałów do gotowej strony online — 48 godzin. Bez czekania tygodniami na agencję.",
  },
];

function StepsPanel({ scrollProgress }: { scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollProgress, "change", (v) => {
    setVisible(v > 0.02);
    setActive(v < 0.25 ? 0 : v < 0.50 ? 1 : v < 0.75 ? 2 : 3);
  });

  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute inset-0 flex items-center"
      style={{ zIndex: 10 }}
    >
      {/* Left gradient for text readability */}
      <div
        className="absolute inset-y-0 left-0 w-full md:w-[55%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(8,11,20,0.88) 0%, rgba(8,11,20,0.70) 60%, transparent 100%)",
        }}
      />

      {/* Steps content */}
      <div className="relative z-10 w-full md:max-w-[44%] px-8 md:px-16">
        {/* Section label */}
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-indigo-400 mb-8">
          Jak działamy
        </p>

        {/* Steps list */}
        <div className="flex flex-col gap-0">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: i === active ? 1 : 0.32,
              }}
              transition={{ duration: 0.4 }}
              className="border-t border-white/[0.08] py-6 cursor-default"
            >
              <div className="flex items-start gap-5">
                {/* Number */}
                <span
                  className="text-xs font-mono tracking-widest mt-0.5 flex-shrink-0 transition-colors duration-300"
                  style={{ color: i === active ? "#6366f1" : "#4b5563" }}
                >
                  {step.num}
                </span>

                {/* Text */}
                <div>
                  <h3 className="text-base font-semibold text-white leading-snug mb-0">
                    {step.title}
                  </h3>

                  {/* Description — only shown for active step */}
                  <motion.div
                    animate={{
                      height: i === active ? "auto" : 0,
                      opacity: i === active ? 1 : 0,
                    }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <p className="text-sm text-[#94a3b8] leading-relaxed mt-2 max-w-xs">
                      {step.desc}
                    </p>
                  </motion.div>
                </div>

                {/* Active dot */}
                <motion.div
                  animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 0.5 }}
                  transition={{ duration: 0.3 }}
                  className="ml-auto mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400"
                />
              </div>
            </motion.div>
          ))}
          <div className="border-t border-white/[0.08]" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Mobile fallback ──────────────────────────────────────────────────────────

function MobileSteps() {
  return (
    <section className="md:hidden py-20 px-6" style={{ background: "#080b14" }}>
      <p className="text-xs font-mono tracking-[0.2em] uppercase text-indigo-400 mb-8">
        Jak działamy
      </p>
      {STEPS.map((step, i) => (
        <div key={i} className="border-t border-white/[0.08] py-6">
          <div className="flex gap-5">
            <span className="text-xs font-mono text-indigo-400 tracking-widest mt-0.5">{step.num}</span>
            <div>
              <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-[#94a3b8] leading-relaxed">{step.desc}</p>
            </div>
          </div>
        </div>
      ))}
      <div className="border-t border-white/[0.08]" />
    </section>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <>
      {/* Mobile layout */}
      <MobileSteps />

      {/* Desktop sticky scroll */}
      <section
        ref={sectionRef}
        className="hidden md:block"
        style={{ height: "400vh", position: "relative" }}
      >
        <div style={{ position: "sticky", top: 0, height: "100vh" }}>
          <StepsPanel scrollProgress={scrollYProgress} />
        </div>
      </section>
    </>
  );
}
