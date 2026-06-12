"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { DPSLogoIcon } from "@/components/ui/DPSLogo";
import FloatCube from "@/components/ui/FloatCube";
import Magnetic from "@/components/ui/Magnetic";

const WA_LINK = "https://wa.me/48511814165";
const EMAIL = "dreampage.studio.pl@gmail.com";

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#0a0a14] shrink-0" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function CTAFooter() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <>
      <section
        ref={sectionRef}
        className="relative py-32 md:py-40 px-6 overflow-hidden"
        style={{ background: "#0e0f1e" }}
      >
        {/* Subtelna siatka w tle */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundSize: "60px 60px",
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, #0e0f1e 100%)",
          }}
          aria-hidden="true"
        />

        <FloatCube className="absolute left-[14%] top-32 hidden lg:block" size={46} variant="indigo" delay={0.6} />
        <FloatCube className="absolute right-[13%] bottom-36 hidden lg:block" size={32} variant="cyan" delay={2} duration={12} />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          {/* Ikona */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.55, ease: EASE }}
            className="flex justify-center mb-10"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              <DPSLogoIcon className="h-8 w-auto text-[var(--ink)]/80" />
            </div>
          </motion.div>

          {/* Nagłówek */}
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
            className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-[-0.03em] text-[var(--ink)] mb-6"
          >
            Czas na stronę,
            <br />
            <span className="text-[var(--ink)]/40">która sprzedaje.</span>
          </motion.h2>

          {/* Podtekst */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
            className="mb-12"
          >
            <p className="text-[var(--ink)]/65 text-lg md:text-xl font-light leading-relaxed max-w-lg mx-auto">
              Napisz teraz — odpiszę w kilka godzin
              i&nbsp;zaczynam od&nbsp;darmowego szkicu.
            </p>
            <p className="text-[var(--ink)]/40 text-sm mt-3 tracking-wide">
              Zero ryzyka. Płacisz dopiero gdy projekt Ci się spodoba.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
          >
            <Magnetic strength={0.22}>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-semibold text-lg text-[#0a0a14] transition-all hover:bg-white/85 active:scale-[0.98]"
                style={{
                  background: "#ffffff",
                  boxShadow:
                    "0 4px 20px rgba(255,255,255,0.1), 0 24px 48px -16px rgba(0,0,0,0.6)",
                }}
              >
                {WA_ICON}
                Napisz na WhatsApp
              </a>
            </Magnetic>
          </motion.div>

          {/* Pasek zaufania */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-6 text-[var(--ink)]/45 text-sm">
              <span>Darmowy szkic</span>
              <span className="text-[var(--ink)]/20">·</span>
              <span>Gotowe w 48h</span>
              <span className="text-[var(--ink)]/20">·</span>
              <span>od 599 zł</span>
            </div>
            <a
              href={`mailto:${EMAIL}`}
              className="text-[var(--ink)]/45 text-sm hover:text-[var(--ink)]/80 transition-colors"
            >
              {EMAIL}
            </a>
          </motion.div>
        </div>
      </section>

      <footer
        className="py-6 px-6"
        style={{ background: "#0a0a14", borderTop: "1px solid var(--hairline)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-[var(--ink)]/40">
          <div className="flex items-center gap-2">
            <DPSLogoIcon className="h-4 w-auto text-[var(--ink)]/40" />
            <span>DreamPageStudio © 2026</span>
          </div>
          <span>{EMAIL}</span>
        </div>
      </footer>
    </>
  );
}
