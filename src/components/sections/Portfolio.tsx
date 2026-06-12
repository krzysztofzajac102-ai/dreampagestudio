"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import FloatCube from "@/components/ui/FloatCube";

const WA_LINK = "https://wa.me/48511814165";
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PROJECTS = [
  {
    name: "CzysteWnętrza",
    label: "Usługi sprzątania",
    desc: "Strona dla lokalnej firmy sprzątającej. Cennik usług, formularz wyceny i opinie klientów.",
    accent: "#00d4ff",
    stats: [
      { icon: "users", value: "+45%", label: "zapytań w 2 mies." },
      { icon: "bolt", value: "97/100", label: "mobile PageSpeed" },
    ],
    img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&h=1200&fit=crop&q=80",
  },
  {
    name: "PremiumDetal",
    label: "Detailing samochodowy",
    desc: "Luksusowy detailing z Sierakowic. Galeria realizacji, pakiety usług i rezerwacja terminów.",
    accent: "#f59e0b",
    stats: [
      { icon: "calendar", value: "+70%", label: "rezerwacji online" },
      { icon: "bolt", value: "1.2s", label: "czas ładowania" },
    ],
    img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&h=1200&fit=crop&q=80",
  },
  {
    name: "AudioMobile",
    label: "Car audio / usługi mobilne",
    desc: "Montaż car audio z dojazdem do klienta. Konfigurator zestawów i wycena przez formularz.",
    accent: "#d4a853",
    stats: [
      { icon: "users", value: "+38", label: "leadów miesięcznie" },
      { icon: "pin", value: "Top 3", label: "w Google lokalnie" },
    ],
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&h=1200&fit=crop&q=80",
  },
  {
    name: "GruntExpert",
    label: "Budownictwo / prace ziemne",
    desc: "Strona firmy budowlanej z Koszalina. Zakres usług, park maszynowy i szybka wycena.",
    accent: "#f97316",
    stats: [
      { icon: "chart", value: "+50", label: "wycen kwartalnie" },
      { icon: "bolt", value: "95/100", label: "Core Web Vitals" },
    ],
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&h=1200&fit=crop&q=80",
  },
  {
    name: "RzeczoznawcaPro",
    label: "Rzeczoznawca samochodowy",
    desc: "Ekspertyzy i wyceny pojazdów w Gdańsku. Opis usług, certyfikaty i kontakt ekspresowy.",
    accent: "#eab308",
    stats: [
      { icon: "chart", value: "+120%", label: "ruchu organicznego" },
      { icon: "bolt", value: "98/100", label: "mobile PageSpeed" },
    ],
    img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&h=1200&fit=crop&q=80",
  },
];

/* Ikony statystyk — line-art w stylu referencji */
const STAT_ICONS: Record<string, React.ReactNode> = {
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M16 14.7c2.3.2 4 1.4 4.5 3.8" strokeLinecap="round" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden>
      <path d="M13 3 5 13.5h5L10.5 21 19 10.5h-5.5L13 3z" strokeLinejoin="round" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden>
      <rect x="4" y="6" width="16" height="14" rx="2.5" />
      <path d="M4 10.5h16M8.5 4v3.5M15.5 4v3.5" strokeLinecap="round" />
      <path d="M8.5 14.5h3" strokeLinecap="round" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden>
      <path d="M12 21s-6.5-5.4-6.5-10A6.5 6.5 0 0 1 18.5 11c0 4.6-6.5 10-6.5 10z" strokeLinejoin="round" />
      <circle cx="12" cy="10.7" r="2.3" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden>
      <path d="M4 19h16" strokeLinecap="round" />
      <path d="M5 15l4.5-4.5 3 3L19 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.5 7H19v3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function ProjectCard({
  project,
  index,
  isInView,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  isInView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 22,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1 + index * 0.15, duration: 0.7, ease: EASE }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={(e) => {
          if (!cardRef.current) return;
          const r = cardRef.current.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        whileHover={{ y: -8 }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          background: "#0d1117",
          border: "1px solid rgba(255,255,255,0.08)",
          borderTop: `4px solid ${project.accent}`,
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        }}
        className="group relative rounded-2xl overflow-hidden p-7 md:p-8 h-full"
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 24px 60px -16px ${project.accent}40`;
          (e.currentTarget as HTMLDivElement).style.borderColor = `${project.accent}66`;
          (e.currentTarget as HTMLDivElement).style.borderTopColor = project.accent;
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
          (e.currentTarget as HTMLDivElement).style.borderTopColor = project.accent;
        }}
      >
        {/* Numer projektu w tle */}
        <span
          className="absolute -top-2 right-4 text-[7rem] font-bold leading-none select-none pointer-events-none"
          style={{ color: "#ffffff", opacity: 0.06 }}
          aria-hidden
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Mockup przeglądarki */}
        <div
          className="relative rounded-xl overflow-hidden mb-7"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="flex items-center gap-1.5 px-3 h-8"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#f87171" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#fbbf24" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#34d399" }} />
          </div>
          <div className="relative aspect-[8/5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.img}
              alt={project.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to top, rgba(8,11,20,0.45), transparent 55%)",
              }}
            />
          </div>
        </div>

        {/* Label kategorii */}
        <p
          className="text-[12px] font-bold uppercase tracking-[0.18em] mb-3"
          style={{ color: "#a5b4fc" }}
        >
          {project.label}
        </p>

        <h3 className="text-2xl md:text-[1.7rem] font-bold text-white mb-3 tracking-tight">
          {project.name}
        </h3>
        <p className="text-[15px] leading-relaxed text-[#94a3b8] mb-6">{project.desc}</p>

        {/* Box ze statystykami */}
        <div
          className="rounded-2xl px-5 py-5 mb-7 space-y-4"
          style={{
            border: "1px solid rgba(129,140,248,0.22)",
            background: "rgba(129,140,248,0.04)",
          }}
        >
          {project.stats.map((s) => (
            <div key={s.label} className="flex items-center gap-4">
              <span
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(129,140,248,0.14)", color: "#a5b4fc" }}
              >
                {STAT_ICONS[s.icon]}
              </span>
              <p className="text-[15px] text-[#cbd5e1]">
                <span className="text-lg font-bold text-white mr-1.5">{s.value}</span>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Przyciski */}
        <div className="flex flex-wrap gap-3">
          <a
            href={`${WA_LINK}?text=${encodeURIComponent(
              `Dzień dobry! Chcę stronę podobną do projektu ${project.name}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 h-12 rounded-2xl font-semibold text-[15px] text-[#0a0a14] transition-transform hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: "#a5b4fc" }}
          >
            Chcę taką stronę
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4" aria-hidden>
              <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#oferta"
            className="inline-flex items-center gap-2 px-6 h-12 rounded-2xl font-semibold text-[15px] transition-colors hover:bg-white/5"
            style={{ border: "1.5px solid rgba(129,140,248,0.5)", color: "#a5b4fc" }}
          >
            Zobacz ofertę
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Portfolio() {
  const headRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, amount: 0.4 });
  const cardsInView = useInView(cardsRef, { once: true, amount: 0.12 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.5 });

  return (
    <section id="realizacje" className="relative" style={{ background: "#0a0a14" }}>
      <div className="h-16 md:h-24" aria-hidden />

      {/* Nagłówek */}
      <motion.div
        ref={headRef}
        initial={{ opacity: 0, y: 40 }}
        animate={headInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative max-w-6xl mx-auto px-6 pt-10 md:pt-16 text-center"
      >
        <FloatCube className="absolute left-[3%] top-8 hidden md:block" size={44} variant="indigo" />
        <FloatCube className="absolute right-[4%] top-24 hidden md:block" size={30} variant="cyan" delay={1.1} duration={11} />
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: "#818cf8" }}>
          Nasze realizacje
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-[-0.03em] text-white mb-5">
          Strony, które już sprzedają
        </h2>
        <p className="text-[#94a3b8] text-base md:text-lg max-w-xl mx-auto">
          Każdy projekt to realna firma — z prawdziwymi klientami i wynikami
        </p>
      </motion.div>

      {/* Zoom parallax */}
      <ZoomParallax images={PROJECTS.map((p) => ({ src: p.img, alt: p.name }))} />

      {/* Karty projektów */}
      <div ref={cardsRef} className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.name} project={p} index={i} isInView={cardsInView} />
        ))}
      </div>

      {/* CTA */}
      <motion.div
        ref={ctaRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-center pt-20 pb-10 px-6"
      >
        <p className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-8">
          Twoja firma może być następna
        </p>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex items-center gap-3 px-9 py-4 rounded-full font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
          style={{ background: "#6366f1", boxShadow: "0 18px 44px -12px rgba(99,102,241,0.55)" }}
        >
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: "#6366f1" }}
            animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0, 0.45] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <span className="relative z-10 flex items-center gap-3">
            {WA_ICON}
            Napisz na WhatsApp
          </span>
        </a>
      </motion.div>

      {/* płynne przejście do cennika */}
      <div
        className="h-24 md:h-32"
        style={{ background: "linear-gradient(180deg, #0a0a14 0%, #0e0f1e 100%)" }}
        aria-hidden
      />
    </section>
  );
}
