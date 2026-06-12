"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FloatCube from "@/components/ui/FloatCube";

/* Line-artowe ikony w stylu referencji (cienka kreska) */
const ICONS = {
  clock: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="28" cy="30" r="16" />
      <path d="M28 21 V30 L35 34" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 10 h12" strokeLinecap="round" />
      <path d="M28 10 v4" strokeLinecap="round" />
      <path d="M41.5 17.5 l3 -3" strokeLinecap="round" />
    </svg>
  ),
  chip: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="16" y="16" width="24" height="24" rx="3" />
      <rect x="23" y="23" width="10" height="10" rx="1.5" opacity="0.5" />
      {[20, 28, 36].map((x) => (
        <g key={x}>
          <path d={`M${x} 16 V9`} strokeLinecap="round" />
          <path d={`M${x} 47 V40`} strokeLinecap="round" />
          <path d={`M16 ${x} H9`} strokeLinecap="round" />
          <path d={`M47 ${x} H40`} strokeLinecap="round" />
        </g>
      ))}
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="18" y="8" width="20" height="40" rx="4" />
      <path d="M18 14 H38 M18 42 H38" opacity="0.5" />
      <path d="M25 45 h6" strokeLinecap="round" />
      <path d="M23 22 h10 M23 27 h7" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),
  price: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M16 10 h18 l8 8 v28 h-26 z" strokeLinejoin="round" />
      <path d="M34 10 v8 h8" strokeLinejoin="round" />
      <path d="M22 26 h12 M22 32 h12 M22 38 h7" strokeLinecap="round" opacity="0.5" />
      <circle cx="38" cy="40" r="8" fill="#0e0f1e" />
      <circle cx="38" cy="40" r="8" />
      <path d="M35 43.5 l6 -7 M35 36.5 h5 M35.5 40 h4" strokeLinecap="round" strokeWidth="1.3" />
    </svg>
  ),
};

const FEATURES = [
  {
    icon: ICONS.clock,
    title: "Gotowe w 48h",
    body: "Nie czekasz tygodniami na agencję. Od dostarczenia materiałów do strony online — 48 godzin.",
  },
  {
    icon: ICONS.chip,
    title: "AI-powered",
    body: "Nowoczesny stack technologiczny i narzędzia AI — lepsza jakość, niższy koszt niż tradycyjna agencja.",
  },
  {
    icon: ICONS.phone,
    title: "Mobile first",
    body: "Ponad 70% Twoich klientów szuka na telefonie. Strona wygląda i działa idealnie na każdym ekranie.",
  },
  {
    icon: ICONS.price,
    title: "Bez ukrytych kosztów",
    body: "Od 599 zł to cena finalna za całą stronę. Żadnych niespodzianek po fakturze.",
  },
];

export default function FeatureColumns() {
  const ref = useRef<HTMLElement>(null);

  /* Bloki wjeżdżają od lewej do prawej PO KOLEI, sprzężone ze scrollem
     (GSAP ScrollTrigger scrub — jak słowa w Statement) */
  useEffect(() => {
    if (!ref.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const cols = ref.current.querySelectorAll<HTMLElement>(".fc-col");
    const tween = gsap.fromTo(
      cols,
      { x: -120, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        ease: "power3.out",
        stagger: 0.25,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          end: "top 25%",
          scrub: 0.5,
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative px-6 md:px-0 pb-28 md:pb-40 overflow-hidden"
      style={{ background: "#0e0f1e" }}
    >
      <FloatCube className="absolute left-[4%] -top-10 hidden lg:block" size={40} variant="ink" duration={20} />
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        style={{ borderTop: "1px solid var(--hairline)" }}
      >
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            whileHover="hover"
            className="fc-col group px-8 md:px-10 pt-12 pb-10 transition-colors duration-300 hover:bg-white/[0.04] will-change-transform"
            style={{
              borderLeft: i > 0 ? "1px solid var(--hairline)" : "none",
            }}
          >
            <motion.div
              variants={{ hover: { y: -6, rotate: -3 } }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="w-14 h-14 text-[var(--ink)] mb-10 group-hover:text-[#818cf8] transition-colors duration-300"
            >
              {f.icon}
            </motion.div>
            <h3 className="text-xl font-semibold tracking-tight text-[var(--ink)] mb-4">
              {f.title}
            </h3>
            <p className="text-[15px] leading-relaxed text-[var(--ink)]/60">{f.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
