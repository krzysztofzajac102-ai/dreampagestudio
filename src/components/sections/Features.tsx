"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ─── Icons ─────────────────────────────────────────────────────────────────────

function ClockIcon() {
  return (
    <div className="mb-8">
      <svg viewBox="0 0 80 80" fill="none" className="w-[72px] h-[72px] block">
        <ellipse cx="40" cy="31" rx="19" ry="9.5" stroke="#0a0a14" strokeWidth="1.5" />
        <line x1="21" y1="31" x2="21" y2="50" stroke="#0a0a14" strokeWidth="1.5" />
        <line x1="59" y1="31" x2="59" y2="50" stroke="#0a0a14" strokeWidth="1.5" />
        <path d="M21,50 A19,9.5 0 0 0 59,50" stroke="#0a0a14" strokeWidth="1.5" fill="none" />
        <line x1="40" y1="31" x2="40" y2="21.5" stroke="#0a0a14" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="40" y1="31" x2="50" y2="33.5" stroke="#0a0a14" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="40" cy="31" r="2" fill="#0a0a14" />
        <line x1="40" y1="21.7" x2="40" y2="24" stroke="#0a0a14" strokeWidth="1" />
        <line x1="57.2" y1="26.5" x2="55.8" y2="28.2" stroke="#0a0a14" strokeWidth="1" />
        <line x1="57.2" y1="35.5" x2="55.8" y2="33.8" stroke="#0a0a14" strokeWidth="1" />
        <line x1="40" y1="40.3" x2="40" y2="38" stroke="#0a0a14" strokeWidth="1" />
      </svg>
    </div>
  );
}

function NetworkIcon() {
  return (
    <div className="mb-8">
      <svg viewBox="0 0 80 80" fill="none" className="w-[72px] h-[72px] block">
        <polygon points="40,20 54,28 54,46 40,54 26,46 26,28" stroke="#0a0a14" strokeWidth="1.5" />
        <line x1="33" y1="32" x2="47" y2="42" stroke="#0a0a14" strokeWidth="1" />
        <line x1="47" y1="32" x2="33" y2="42" stroke="#0a0a14" strokeWidth="1" />
        <circle cx="40" cy="9" r="4.5" stroke="#0a0a14" strokeWidth="1.5" />
        <circle cx="64" cy="56" r="4.5" stroke="#0a0a14" strokeWidth="1.5" />
        <circle cx="16" cy="56" r="4.5" stroke="#0a0a14" strokeWidth="1.5" />
        <line x1="40" y1="13.5" x2="40" y2="20" stroke="#0a0a14" strokeWidth="1.5" />
        <line x1="60.5" y1="53.2" x2="54" y2="46" stroke="#0a0a14" strokeWidth="1.5" />
        <line x1="19.5" y1="53.2" x2="26" y2="46" stroke="#0a0a14" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function PhoneIcon() {
  return (
    <div className="mb-8">
      <svg viewBox="0 0 80 80" fill="none" className="w-[72px] h-[72px] block">
        <rect x="22" y="11" width="28" height="50" rx="3.5" stroke="#0a0a14" strokeWidth="1.5" />
        <path d="M50,11 L58,6 L58,56 L50,61" stroke="#0a0a14" strokeWidth="1.5" />
        <path d="M22,11 L50,11 L58,6 L30,6 Z" stroke="#0a0a14" strokeWidth="1.5" />
        <rect x="26" y="18" width="20" height="30" rx="1" stroke="#0a0a14" strokeWidth="1" />
        <line x1="29" y1="23" x2="43" y2="23" stroke="#0a0a14" strokeWidth="0.8" />
        <line x1="29" y1="28" x2="43" y2="28" stroke="#0a0a14" strokeWidth="0.8" />
        <line x1="29" y1="33" x2="40" y2="33" stroke="#0a0a14" strokeWidth="0.8" />
        <line x1="29" y1="38" x2="43" y2="38" stroke="#0a0a14" strokeWidth="0.8" />
        <circle cx="36" cy="53" r="3" stroke="#0a0a14" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

function DocumentIcon() {
  return (
    <div className="mb-8">
      <svg viewBox="0 0 80 80" fill="none" className="w-[72px] h-[72px] block">
        <rect x="18" y="10" width="32" height="46" rx="2" stroke="#0a0a14" strokeWidth="1.5" />
        <path d="M50,10 L58,15 L58,61 L50,56" stroke="#0a0a14" strokeWidth="1.5" />
        <path d="M18,10 L50,10 L58,15 L26,15 Z" stroke="#0a0a14" strokeWidth="1.5" />
        <line x1="24" y1="22" x2="44" y2="22" stroke="#0a0a14" strokeWidth="1" />
        <line x1="24" y1="28" x2="44" y2="28" stroke="#0a0a14" strokeWidth="1" />
        <line x1="24" y1="34" x2="37" y2="34" stroke="#0a0a14" strokeWidth="1" />
        <circle cx="34" cy="47" r="7" stroke="#0a0a14" strokeWidth="1.2" />
        <path d="M30,47 L33.5,50.5 L39.5,42.5" stroke="#0a0a14" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    Icon: ClockIcon,
    title: "Gotowe w 48h",
    desc: "Nie czekasz tygodniami na agencję. Od dostarczenia materiałów do strony online — 48 godzin.",
  },
  {
    Icon: NetworkIcon,
    title: "AI-powered",
    desc: "Nowoczesny stack technologiczny i narzędzia AI — lepsza jakość, niższy koszt niż tradycyjna agencja.",
  },
  {
    Icon: PhoneIcon,
    title: "Mobile first",
    desc: "Ponad 70% Twoich klientów szuka na telefonie. Strona wygląda i działa idealnie na każdym ekranie.",
  },
  {
    Icon: DocumentIcon,
    title: "Bez ukrytych kosztów",
    desc: "Od 599 zł to cena finalna za całą stronę. Żadnych niespodzianek po fakturze.",
  },
] as const;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: EASE },
  }),
};

const headingVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <>
      {/* Dark → light bridge */}
      <div className="h-20 bg-gradient-to-b from-[#000000] to-[#f7f7f8]" />

      <section ref={sectionRef} className="py-20 md:py-28 px-6" style={{ background: "#f7f7f8" }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            variants={headingVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="mb-16"
          >
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#9ca3af] mb-4">
              Nasze cechy
            </p>
            <h2 className="text-4xl md:text-5xl xl:text-[2.75rem] font-bold tracking-tight text-[#0a0a14] leading-[1.15] max-w-lg">
              Zaprojektowane dla Twojego biznesu,{" "}
              <span className="text-[#9ca3af]">daleko od przestarzałych rozwiązań.</span>
            </h2>
          </motion.div>

          {/* Cards grid */}
          <div
            className="grid grid-cols-2 md:grid-cols-4"
            style={{ borderTop: "1px solid #e5e7eb" }}
          >
            {FEATURES.map(({ Icon, title, desc }, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                className={[
                  "flex flex-col pt-10 px-6 md:px-10 xl:px-12 pb-10",
                  // Mobile 2-col: border-r only on col 0 (i%2===0), not last
                  // Desktop 4-col: border-r on items 0-2
                  i === 0 ? "border-r border-[#e5e7eb]" :
                  i === 1 ? "md:border-r border-[#e5e7eb]" :
                  i === 2 ? "border-r border-[#e5e7eb]" : "",
                ].join(" ")}
              >
                <Icon />
                <h3 className="font-bold text-lg text-[#0a0a14] mb-3 leading-snug">
                  {title}
                </h3>
                <p className="text-sm text-[#6b7280] leading-relaxed max-w-[210px]">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Light → dark bridge */}
      <div className="h-20 bg-gradient-to-b from-[#f7f7f8] to-[#0d0d0d]" />
    </>
  );
}
