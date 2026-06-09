"use client";

import React, { useRef, useCallback } from "react";
import { useInView } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "Rozmawiamy",
    desc: "Opisujesz mi swój biznes — czym się zajmujesz, kto jest Twoim klientem, co chcesz osiągnąć. Wystarczy jedna wiadomość na WhatsApp.",
    wide: true,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
      </svg>
    ),
    detail: "WhatsApp, email lub telefon — jak Ci wygodniej.",
  },
  {
    num: "02",
    title: "Projektujemy",
    desc: "Przygotowuję darmowy szkic strony — bez zobowiązań. Widzisz jak będzie wyglądać Twoja strona zanim zapłacisz złotówkę.",
    wide: false,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
      </svg>
    ),
    detail: "Darmowy szkic. Zero ryzyka.",
  },
  {
    num: "03",
    title: "Budujemy",
    desc: "Buduję stronę na nowoczesnym stacku — szybką, responsywną, zoptymalizowaną pod SEO. Ty skupiasz się na swoim biznesie.",
    wide: false,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
      </svg>
    ),
    detail: "Next.js, Tailwind, hosting w cenie.",
  },
  {
    num: "04",
    title: "Publikujesz",
    desc: "Strona online w 48 godzin od akceptacji szkicu. Dostajesz 14 dni darmowych poprawek — aż będzie idealnie.",
    wide: true,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"/>
      </svg>
    ),
    detail: "14 dni darmowych poprawek po starcie.",
  },
] as const;

const INJECTED_STYLES = `
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
  }
  @media (max-width: 768px) {
    .bento-grid { grid-template-columns: 1fr; }
  }

  .bento-item {
    position: relative;
    background: #0a0a0a;
    overflow: hidden;
    transition: background 0.3s ease;
  }
  .bento-item:hover { background: #111111; }

  .bento-glow {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(
      380px circle at var(--mx, 50%) var(--my, 50%),
      rgba(255,255,255,0.035) 0%,
      transparent 65%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  .bento-item:hover .bento-glow { opacity: 1; }

  .bento-item-wide {
    grid-column: span 2;
  }
  @media (max-width: 768px) {
    .bento-item-wide { grid-column: span 1; }
  }

  .bento-border-grid {
    background-color: #1a1a1a;
  }

  .bento-num {
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
  }

  @keyframes bento-fade-up {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .bento-animate {
    animation: bento-fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
`;

function BentoCell({
  step,
  index,
  visible,
}: {
  step: (typeof STEPS)[number];
  index: number;
  visible: boolean;
}) {
  const cellRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cellRef.current) return;
    const rect = cellRef.current.getBoundingClientRect();
    cellRef.current.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    cellRef.current.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div
      ref={cellRef}
      className={`bento-item${step.wide ? " bento-item-wide" : ""}`}
      onMouseMove={handleMouseMove}
      style={
        visible
          ? { animationDelay: `${index * 80}ms` }
          : { opacity: 0 }
      }
    >
      <div className={visible ? "bento-animate" : ""} style={{ animationDelay: `${index * 80}ms` }}>
        <div className="bento-glow" />
        <div className="relative z-10 p-8 md:p-10 h-full flex flex-col gap-6">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="bento-num text-[11px] font-semibold tracking-[0.2em] text-white/20 uppercase select-none">
                {step.num}
              </span>
              <div className="w-px h-4 bg-white/10" />
              <div className="text-white/40">{step.icon}</div>
            </div>
            <span className="text-[11px] text-white/20 font-medium tracking-wide">{step.detail}</span>
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
            {step.title}
          </h3>

          {/* Description */}
          <p className="text-white/40 text-[15px] leading-relaxed font-light flex-1">
            {step.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CyberneticBentoGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section ref={sectionRef} className="relative bg-black py-20 md:py-28 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />

      {/* Section header */}
      <div
        className="max-w-7xl mx-auto px-6 mb-14"
        style={
          isVisible
            ? { animation: "bento-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) both" }
            : { opacity: 0 }
        }
      >
        <p className="text-[11px] text-white/25 font-semibold uppercase tracking-[0.25em] mb-4">
          Proces
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          Jak działamy
        </h2>
      </div>

      {/* Grid wrapper — 1px gap creates the dividing lines */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="bento-border-grid rounded-2xl overflow-hidden">
          <div className="bento-grid">
            {STEPS.map((step, i) => (
              <BentoCell key={step.num} step={step} index={i} visible={isVisible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
