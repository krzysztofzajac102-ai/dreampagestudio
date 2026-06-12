"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";

const IsoWorld = dynamic(() => import("@/components/ui/IsoWorld"), { ssr: false });

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Zakresy progresu scrolla dla kroków — zsynchronizowane ze strefami kamery w IsoWorld */
const STEPS = [
  {
    n: "01",
    title: "Brief na WhatsApp",
    body: "Jedna wiadomość wystarczy. Opisujesz czym się zajmujesz i czego potrzebujesz — bez spotkań, formularzy i firmowego żargonu. Resztą zajmuję się ja.",
    range: [0.1, 0.34],
  },
  {
    n: "02",
    title: "Darmowy szkic",
    body: "W 24h dostajesz szkic swojej strony: układ sekcji, kolory, wstępne treści. Oceniasz bez zobowiązań — płacisz dopiero wtedy, gdy projekt Ci się podoba.",
    range: [0.34, 0.57],
  },
  {
    n: "03",
    title: "Realizacja w 48h",
    body: "Po akceptacji buduję pełną stronę: responsywną, szybką, z formularzem kontaktowym i treściami dopasowanymi do Twojej branży. Gotową na klientów.",
    range: [0.57, 0.78],
  },
  {
    n: "04",
    title: "Start i wsparcie",
    body: "Podpinam Twoją domenę, certyfikat SSL i analitykę. Przez 14 dni po starcie poprawki są bezpłatne — strona po prostu działa i sprzedaje.",
    range: [0.78, 1.01],
  },
] as const;

export default function HeroProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [active, setActive] = useState(-1);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = STEPS.findIndex((s) => v >= s.range[0] && v < s.range[1]);
    if (idx !== active) setActive(idx);
  });

  /* Hero — tekst odchyla się w głąb sceny i odpływa (jak w referencji).
     useSpring wymusza ścieżkę JS — natywne CSS scroll-timeline w Framer 12
     błędnie mapuje progress kontenera na scroll całej strony. */
  const SPRING = { stiffness: 260, damping: 34, mass: 0.6 };
  const heroOpacity = useSpring(useTransform(scrollYProgress, [0, 0.09], [1, 0]), SPRING);
  const heroY = useSpring(useTransform(scrollYProgress, [0, 0.12], [0, -110]), SPRING);
  const heroRotateX = useSpring(useTransform(scrollYProgress, [0, 0.12], [0, 28]), SPRING);
  const heroScale = useSpring(useTransform(scrollYProgress, [0, 0.12], [1, 0.94]), SPRING);
  const cueOpacity = useSpring(useTransform(scrollYProgress, [0, 0.05], [1, 0]), SPRING);
  const stepsOpacity = useSpring(useTransform(scrollYProgress, [0.08, 0.14], [0, 1]), SPRING);
  /* Bez wygaszania sceny na końcu — kamera kończy podróż przy 92% scrolla
     (CAM_END w IsoWorld) i stoi, więc krok 04 jest czytany przy pełnej,
     spokojnej scenie, a odklejenie sticky następuje na ukończonym kadrze. */

  return (
    <div ref={containerRef} id="proces" className="relative" style={{ height: "560vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: "#0a0a14" }}>
        {/* Scena 3D */}
        <div className="absolute inset-0">
          <IsoWorld progress={scrollYProgress} />
        </div>

        {/* miękki blend na dole kadru — scena wtapia się w kolor następnej
            sekcji, więc odklejenie sticky jest niewidoczne */}
        <div
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(180deg, transparent, #0a0a14)" }}
          aria-hidden
        />

        {/* Hero */}
        <motion.div
          style={{
            opacity: heroOpacity,
            y: heroY,
            rotateX: heroRotateX,
            scale: heroScale,
            transformPerspective: 900,
            transformOrigin: "center 30%",
          }}
          className="absolute inset-x-0 top-0 pt-28 md:pt-36 px-6 text-center pointer-events-none"
        >
          <h1 className="text-[var(--ink)] font-medium tracking-[-0.03em] leading-[1.02] text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            Nowy standard
            <br />
            stron dla firm
          </h1>
          <p className="mt-7 md:mt-9 text-base md:text-xl text-[var(--ink)]/75 leading-relaxed max-w-xl mx-auto">
            Projekt, realizacja i start w 48 godzin.{" "}
            <br className="hidden sm:block" />
            Strona, która wygląda premium i&nbsp;przyciąga klientów — od&nbsp;599&nbsp;zł.
          </p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute bottom-8 inset-x-0 flex justify-center pointer-events-none"
        >
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--ink)]/80 pb-2"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.4)" }}
          >
            Scroll — poznaj proces
          </span>
        </motion.div>

        {/* Kroki 01–04 — przypięte po lewej */}
        <motion.div
          style={{ opacity: stepsOpacity }}
          className="absolute left-0 bottom-0 top-0 flex items-end md:items-center pointer-events-none"
        >
          <div className="px-6 md:px-12 pb-10 md:pb-0 w-full max-w-xl">
            {STEPS.map((step, i) => {
              const isActive = i === active;
              return (
                <div key={step.n} className="py-1.5 md:py-2">
                  <div className="flex items-center gap-4 md:gap-5">
                    <motion.span
                      animate={{
                        backgroundColor: isActive ? "#ffffff" : "rgba(255,255,255,0)",
                        boxShadow: isActive
                          ? "0 10px 28px -6px rgba(13,16,32,0.22)"
                          : "0 0 0 rgba(0,0,0,0)",
                        scale: isActive ? 1 : 0.92,
                      }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl flex items-center justify-center text-xs md:text-sm font-bold"
                      style={{ color: isActive ? "#0a0a14" : "#f4f6fb" }}
                    >
                      {step.n}
                    </motion.span>
                    <motion.h3
                      animate={{
                        fontSize: isActive ? "1.55rem" : "0.95rem",
                        opacity: isActive ? 1 : 0.62,
                      }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="font-semibold tracking-tight text-[var(--ink)] leading-none"
                    >
                      {step.title}
                    </motion.h3>
                  </div>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-4 md:gap-5 pt-3 pb-1">
                          <div className="w-10 md:w-12 shrink-0 flex justify-center">
                            <motion.div
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{ duration: 0.5, ease: EASE }}
                              className="w-px origin-top"
                              style={{ background: "rgba(255,255,255,0.75)" }}
                            />
                          </div>
                          <p className="text-sm md:text-[15px] leading-relaxed text-[var(--ink)]/80 max-w-md">
                            {step.body}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
