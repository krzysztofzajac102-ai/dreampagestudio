"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import HeroAnimation from "@/components/ui/HeroAnimation";

const WA_LINK = "https://wa.me/48511814165";
const WORDS = ["Koniec z tysiącami.", "Strona od 599 zł.", "Gotowa w 48h."];

export default function HeroText() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  const opacity = useTransform(scrollY, [0, 480], [1, 0]);
  const translateY = useTransform(scrollY, [0, 480], [0, -40]);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 20));
    return () => unsub();
  }, [scrollY]);

  return (
    <section
      className="relative min-h-screen flex flex-col"
      style={{ zIndex: 10, background: "#080b14" }}
    >
      {/* Nav */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-md bg-[#080b14]/80 border-b border-white/[0.06]"
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-semibold text-white text-base tracking-tight">
            DreamPageStudio
          </span>
          <div className="hidden sm:flex items-center gap-6">
            <a
              href="#oferta"
              className="text-sm text-[#94a3b8] hover:text-white transition-colors"
            >
              Oferta
            </a>
            <a
              href="#faq"
              className="text-sm text-[#94a3b8] hover:text-white transition-colors"
            >
              FAQ
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors text-white text-sm font-medium"
            >
              Napisz na WhatsApp
            </a>
          </div>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-medium"
          >
            WhatsApp
          </a>
        </div>
      </nav>

      {/* Hero content — fades on scroll */}
      <motion.div
        style={{ opacity, y: translateY }}
        className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 px-6 pt-24 pb-16 max-w-7xl mx-auto w-full"
      >
        {/* Left: text */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:flex-1 lg:max-w-xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Strony od 599 zł &middot; Gotowe w 48h
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6">
            {WORDS.map((word, i) => (
              <motion.span
                key={i}
                className="block"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.55, ease: "easeOut" }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-lg text-[#94a3b8] max-w-md mb-10 leading-relaxed"
          >
            Pełna, sprzedająca strona www dla Twojego biznesu — bez agencyjnych cen.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <motion.a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold text-base overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              <motion.span
                className="absolute inset-0 bg-indigo-400/25 rounded-xl"
                animate={{ opacity: [0, 0.7, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="relative">Napisz na WhatsApp →</span>
            </motion.a>

            <a
              href="#oferta"
              className="text-[#94a3b8] hover:text-white text-sm transition-colors underline underline-offset-4"
            >
              Zobacz ofertę
            </a>
          </motion.div>
        </div>

        {/* Right: phone animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
          className="lg:flex-1 w-full max-w-sm sm:max-w-md lg:max-w-none"
        >
          <HeroAnimation />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#4b5563]">
          scroll to discover
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-[#4b5563]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#4b5563]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
