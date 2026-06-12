"use client";

import { useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { DPSLogoFull } from "@/components/ui/DPSLogo";
import Magnetic from "@/components/ui/Magnetic";

const WA_LINK = "https://wa.me/48511814165";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 80));

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* frosted tło po scrollu — czytelność też nad ciemnymi sekcjami */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: scrolled ? 1 : 0,
          background: "rgba(10,10,20,0.72)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
        aria-hidden
      />
      <nav className="relative flex items-center justify-between px-5 md:px-10 h-16 md:h-20">
        {/* Left links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#proces"
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)]/70 hover:text-[var(--ink)] transition-colors"
          >
            Proces
          </a>
          <a
            href="#oferta"
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)]/70 hover:text-[var(--ink)] transition-colors"
          >
            Oferta
          </a>
          <a
            href="#faq"
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)]/70 hover:text-[var(--ink)] transition-colors"
          >
            FAQ
          </a>
        </div>

        {/* Logo — na mobile po lewej, na desktopie wyśrodkowane */}
        <a
          href="#"
          className="text-[var(--ink)] md:absolute md:left-1/2 md:-translate-x-1/2"
          aria-label="DreamPageStudio — start"
        >
          <DPSLogoFull iconClass="h-5 w-auto" nameClass="text-[15px] font-semibold tracking-tight" />
        </a>

        {/* Right CTAs */}
        <div className="flex items-center gap-3 ml-auto">
          <a
            href="#oferta"
            className="hidden sm:inline-flex items-center px-5 h-10 rounded-full text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)] bg-white/10 hover:bg-white/20 transition-colors"
            style={{ backdropFilter: "blur(8px)" }}
          >
            Cennik
          </a>
          <Magnetic>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 h-10 rounded-full text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0a0a14] bg-white hover:bg-white/85 transition-colors"
            >
              Zamów stronę
            </a>
          </Magnetic>
        </div>
      </nav>
    </header>
  );
}
