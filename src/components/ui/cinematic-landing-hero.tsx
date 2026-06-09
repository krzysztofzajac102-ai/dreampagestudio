"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { DPSLogoFull, DPSLogoIcon, DPSLogoStacked } from "@/components/ui/DPSLogo";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const WA_LINK = "https://wa.me/48511814165";

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  .film-grain {
    position: absolute; inset: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 50; opacity: 0.04; mix-blend-mode: overlay;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-theme {
    background-size: 60px 60px;
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px);
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  /* Monochrome display text — no color tint */
  .text-hero-display {
    font-family: var(--font-playfair, Georgia, serif);
    color: #ffffff;
    letter-spacing: -0.02em;
  }

  .text-hero-display-fade {
    font-family: var(--font-playfair, Georgia, serif);
    background: linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.45) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: translateZ(0);
    filter: drop-shadow(0px 8px 24px rgba(255,255,255,0.12));
  }

  .text-cta-display {
    font-family: var(--font-playfair, Georgia, serif);
    background: linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.5) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: translateZ(0);
  }

  .text-card-mono {
    background: linear-gradient(180deg, #FFFFFF 0%, #888888 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: translateZ(0);
    filter:
      drop-shadow(0px 8px 20px rgba(0,0,0,0.9))
      drop-shadow(0px 2px 6px rgba(0,0,0,0.7));
  }

  /* Pure black card — premium monochrome depth */
  .premium-depth-card {
    background: linear-gradient(160deg, #1c1c1e 0%, #000000 100%);
    box-shadow:
      0 40px 100px -20px rgba(0,0,0,0.95),
      0 20px 40px -20px rgba(0,0,0,0.8),
      inset 0 1px 0 rgba(255,255,255,0.12),
      inset 0 -1px 0 rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    position: relative;
  }

  .card-sheen {
    position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
    background: radial-gradient(700px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.04) 0%, transparent 40%);
    mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  /* Realistic iPhone hardware */
  .iphone-bezel {
    background-color: #0a0a0a;
    box-shadow:
      inset 0 0 0 2px #3a3a3c,
      inset 0 0 0 7px #000,
      0 40px 80px -15px rgba(0,0,0,0.95),
      0 15px 25px -5px rgba(0,0,0,0.8);
    transform-style: preserve-3d;
  }

  .hardware-btn {
    background: linear-gradient(90deg, #3a3a3c 0%, #1c1c1e 100%);
    box-shadow:
      -2px 0 5px rgba(0,0,0,0.9),
      inset -1px 0 1px rgba(255,255,255,0.1),
      inset 1px 0 2px rgba(0,0,0,0.9);
    border-left: 1px solid rgba(255,255,255,0.04);
  }

  .screen-glare {
    background: linear-gradient(120deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 40%);
  }

  .widget-depth {
    background: rgba(255,255,255,0.03);
    box-shadow:
      0 4px 12px rgba(0,0,0,0.4),
      inset 0 1px 0 rgba(255,255,255,0.06),
      inset 0 -1px 0 rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.05);
  }

  .floating-ui-badge {
    background: rgba(30,30,30,0.85);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.1),
      0 20px 40px -10px rgba(0,0,0,0.9),
      inset 0 1px 0 rgba(255,255,255,0.12);
  }

  /* Tactile buttons — monochrome */
  .btn-modern-light, .btn-modern-dark {
    transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .btn-modern-light {
    background: #ffffff;
    color: #000000;
    box-shadow:
      0 0 0 1px rgba(0,0,0,0.08),
      0 2px 4px rgba(0,0,0,0.12),
      0 12px 24px -4px rgba(0,0,0,0.35),
      inset 0 1px 0 rgba(255,255,255,1);
  }
  .btn-modern-light:hover {
    transform: translateY(-2px);
    box-shadow:
      0 0 0 1px rgba(0,0,0,0.05),
      0 6px 16px rgba(0,0,0,0.2),
      0 24px 36px -8px rgba(0,0,0,0.45),
      inset 0 1px 0 rgba(255,255,255,1);
  }
  .btn-modern-light:active {
    transform: translateY(1px);
    background: #f0f0f0;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(0,0,0,0.08);
  }
  .btn-modern-dark {
    background: rgba(255,255,255,0.06);
    color: #ffffff;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.1),
      0 2px 4px rgba(0,0,0,0.5),
      0 12px 24px -4px rgba(0,0,0,0.8),
      inset 0 1px 0 rgba(255,255,255,0.1);
  }
  .btn-modern-dark:hover {
    transform: translateY(-2px);
    background: rgba(255,255,255,0.1);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.15),
      0 8px 20px rgba(0,0,0,0.6),
      0 24px 40px -8px rgba(0,0,0,0.9),
      inset 0 1px 0 rgba(255,255,255,0.15);
  }
  .btn-modern-dark:active {
    transform: translateY(1px);
    background: rgba(255,255,255,0.04);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.06), inset 0 2px 6px rgba(0,0,0,0.8);
  }

  .progress-ring {
    transform: rotate(-90deg);
    transform-origin: center;
    stroke-dasharray: 402;
    stroke-dashoffset: 402;
    stroke-linecap: round;
  }

  .transform-style-3d { transform-style: preserve-3d; }
`;

export default function CinematicHero({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;
      cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          mainCardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(mockupRef.current, { rotationY: xVal * 10, rotationX: -yVal * 10, ease: "power3.out", duration: 1.4 });
        }
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => { window.removeEventListener("mousemove", handleMouseMove); cancelAnimationFrame(requestRef.current); };
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const ctx = gsap.context(() => {
      gsap.set(".text-track", { autoAlpha: 0, y: 50, scale: 0.9, filter: "blur(16px)", rotationX: -15 });
      gsap.set(".text-days", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".main-card", { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set([".card-left-text", ".card-right-text", ".mockup-scroll-wrapper", ".floating-badge", ".phone-widget"], { autoAlpha: 0 });
      gsap.set(".cta-wrapper", { autoAlpha: 0, scale: 0.85, filter: "blur(24px)" });

      gsap.timeline({ delay: 0.2 })
        .to(".text-track", { duration: 1.6, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out" })
        .to(".text-days", { duration: 1.2, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=0.9");

      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=7000",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })
        .to([".hero-text-wrapper", ".bg-grid-theme"], { scale: 1.1, filter: "blur(18px)", opacity: 0.15, ease: "power2.inOut", duration: 2 }, 0)
        .to(".main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        .to(".main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.5 })
        .fromTo(".mockup-scroll-wrapper",
          { y: 280, z: -450, rotationX: 45, rotationY: -25, autoAlpha: 0, scale: 0.65 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.5 }, "-=0.8")
        .fromTo(".phone-widget",
          { y: 35, autoAlpha: 0, scale: 0.96 },
          { y: 0, autoAlpha: 1, scale: 1, stagger: 0.12, ease: "back.out(1.2)", duration: 1.4 }, "-=1.4")
        .to(".progress-ring", { strokeDashoffset: 60, duration: 2, ease: "power3.inOut" }, "-=1.1")
        .to(".counter-val", { innerHTML: 48, snap: { innerHTML: 1 }, duration: 1.8, ease: "expo.out" }, "-=1.8")
        .fromTo(".floating-badge",
          { y: 80, autoAlpha: 0, scale: 0.75, rotationZ: -8 },
          { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.4)", duration: 1.4, stagger: 0.18 }, "-=1.8")
        .fromTo(".card-left-text", { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.4 }, "-=1.4")
        .fromTo(".card-right-text", { x: 40, autoAlpha: 0, scale: 0.85 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.4 }, "<")
        .to({}, { duration: 2.5 })
        .set(".hero-text-wrapper", { autoAlpha: 0 })
        .set(".cta-wrapper", { autoAlpha: 1 })
        .to({}, { duration: 1.5 })
        .to([".mockup-scroll-wrapper", ".floating-badge", ".card-left-text", ".card-right-text"],
          { scale: 0.92, y: -40, z: -150, autoAlpha: 0, ease: "power3.in", duration: 1.1, stagger: 0.04 })
        .to(".main-card", {
          width: isMobile ? "92vw" : "82vw",
          height: isMobile ? "88vh" : "82vh",
          borderRadius: isMobile ? "28px" : "36px",
          ease: "expo.inOut", duration: 1.8,
        }, "pullback")
        .to(".cta-wrapper", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.8 }, "pullback")
        .to(".main-card", { y: -window.innerHeight - 300, ease: "power3.in", duration: 1.4 });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-screen h-screen overflow-hidden flex items-center justify-center bg-black text-white font-sans antialiased",
        className
      )}
      style={{ perspective: "1500px" }}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-40" aria-hidden="true" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[60] px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <DPSLogoFull className="text-white" iconClass="h-5 w-auto" nameClass="text-[15px] font-semibold tracking-tight" />
          <div className="hidden sm:flex items-center gap-8">
            <a href="#oferta" className="text-sm text-white/50 hover:text-white transition-colors">Oferta</a>
            <a href="#faq" className="text-sm text-white/50 hover:text-white transition-colors">FAQ</a>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors">
              Napisz na WhatsApp
            </a>
          </div>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
            className="sm:hidden px-3.5 py-1.5 rounded-full bg-white text-black text-sm font-medium">
            WhatsApp
          </a>
        </div>
      </nav>

      {/* === L1: hero taglines === */}
      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 will-change-transform transform-style-3d">
        <h1 className="text-track gsap-reveal text-hero-display text-[clamp(1.75rem,7.5vw,6rem)] font-bold mb-1 whitespace-nowrap">
          Koniec z tysiącami.
        </h1>
        <h1 className="text-days gsap-reveal text-hero-display-fade text-[clamp(1.75rem,7.5vw,6rem)] font-black whitespace-nowrap">
          Strona od 599 zł.
        </h1>
      </div>

      {/* === L2: CTA === */}
      <div className="cta-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 gsap-reveal pointer-events-auto will-change-transform">
        <h2 className="text-cta-display text-4xl md:text-6xl lg:text-7xl font-bold mb-5 tracking-tight">
          Strona gotowa w 48h.
        </h2>
        <p className="text-white/40 text-lg md:text-xl mb-12 max-w-lg mx-auto font-light leading-relaxed">
          Napisz teraz — odpiszę w ciągu kilku godzin i zaczynamy od darmowego szkicu. Zero ryzyka.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
            className="btn-modern-light flex items-center justify-center gap-3 px-8 py-4 rounded-2xl focus:outline-none">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <div className="text-left">
              <div className="text-[10px] font-semibold tracking-widest text-black/40 uppercase">Napisz na</div>
              <div className="text-lg font-bold leading-none tracking-tight">WhatsApp</div>
            </div>
          </a>
          <a href="#oferta"
            className="btn-modern-dark flex items-center justify-center gap-3 px-8 py-4 rounded-2xl focus:outline-none">
            <div className="text-left">
              <div className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">Sprawdź</div>
              <div className="text-lg font-bold leading-none tracking-tight">Ofertę</div>
            </div>
            <svg className="w-4 h-4 shrink-0 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>

      {/* === L3: Deep black card === */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[82vw] h-[88vh] md:h-[82vh] rounded-[28px] md:rounded-[36px]"
        >
          <div className="card-sheen" aria-hidden="true" />

          <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col justify-evenly lg:grid lg:grid-cols-3 items-center lg:gap-8 z-10 py-6 lg:py-0">

            {/* Right / Top: DPS Logo */}
            <div className="card-right-text gsap-reveal order-1 lg:order-3 flex justify-center lg:justify-end z-20 w-full">
              <DPSLogoStacked
                className="text-white opacity-90"
                size={72}
              />
            </div>

            {/* Center: iPhone mockup */}
            <div
              className="mockup-scroll-wrapper order-2 lg:order-2 relative w-full h-[360px] lg:h-[580px] flex items-center justify-center z-10"
              style={{ perspective: "1000px" }}
            >
              <div className="relative w-full h-full flex items-center justify-center transform scale-[0.65] md:scale-[0.85] lg:scale-100">
                <div
                  ref={mockupRef}
                  className="relative w-[270px] h-[560px] rounded-[3rem] iphone-bezel flex flex-col will-change-transform transform-style-3d"
                >
                  <div className="absolute top-[118px] -left-[3px] w-[3px] h-[24px] hardware-btn rounded-l-md" aria-hidden="true" />
                  <div className="absolute top-[156px] -left-[3px] w-[3px] h-[44px] hardware-btn rounded-l-md" aria-hidden="true" />
                  <div className="absolute top-[214px] -left-[3px] w-[3px] h-[44px] hardware-btn rounded-l-md" aria-hidden="true" />
                  <div className="absolute top-[166px] -right-[3px] w-[3px] h-[68px] hardware-btn rounded-r-md scale-x-[-1]" aria-hidden="true" />

                  <div className="absolute inset-[7px] bg-black rounded-[2.5rem] overflow-hidden text-white z-10">
                    <div className="absolute inset-0 screen-glare z-40 pointer-events-none" aria-hidden="true" />
                    <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[96px] h-[26px] bg-black rounded-full z-50 flex items-center justify-end px-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
                    </div>

                    <div className="relative w-full h-full pt-11 px-5 pb-7 flex flex-col">
                      {/* Header */}
                      <div className="phone-widget flex justify-between items-center mb-7">
                        <div>
                          <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium block mb-0.5">Projekt</span>
                          <span className="text-base font-semibold tracking-tight text-white">dreampage.studio</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center border border-white/10">
                          <DPSLogoIcon className="h-4 w-auto text-white/60" />
                        </div>
                      </div>

                      {/* Ring */}
                      <div className="phone-widget relative w-40 h-40 mx-auto flex items-center justify-center mb-7 drop-shadow-[0_12px_20px_rgba(0,0,0,0.9)]">
                        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                          <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                          <circle className="progress-ring" cx="80" cy="80" r="60" fill="none" stroke="#ffffff" strokeWidth="10" />
                        </svg>
                        <div className="text-center z-10">
                          <span className="counter-val block text-4xl font-black tracking-tighter text-white">0</span>
                          <span className="block text-[9px] text-white/25 uppercase tracking-widest font-medium mt-0.5">Godzin</span>
                        </div>
                      </div>

                      {/* Widgets — storytelling: inquiry → sketch ready */}
                      <div className="space-y-2.5">
                        {/* Widget 1: new inquiry */}
                        <div className="phone-widget widget-depth rounded-2xl p-3 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white/6 flex items-center justify-center border border-white/08 shrink-0 relative">
                            <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-white border border-black/40" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-white/85 leading-none mb-1">Nowe zapytanie</p>
                            <p className="text-[10px] text-white/35 leading-none">Marek W. • teraz</p>
                          </div>
                          <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                        </div>
                        {/* Widget 2: sketch done */}
                        <div className="phone-widget widget-depth rounded-2xl p-3 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white/6 flex items-center justify-center border border-white/08 shrink-0">
                            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-white/85 leading-none mb-1">Szkic gotowy</p>
                            <p className="text-[10px] text-white/35 leading-none">marekwbudowlany.pl</p>
                          </div>
                          <span className="text-[9px] text-white/30 font-medium tracking-wide">✓</span>
                        </div>
                      </div>

                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/15 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Badge top-left */}
                <div className="floating-badge absolute flex top-4 lg:top-10 left-[-10px] lg:left-[-72px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-3.5 items-center gap-2.5 lg:gap-3 z-30">
                  <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center border border-white/12 shrink-0">
                    <svg className="w-3.5 h-3.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold tracking-tight">Gotowe w 48h</p>
                    <p className="text-white/30 text-[10px]">Gwarantowana dostawa</p>
                  </div>
                </div>

                {/* Badge bottom-right */}
                <div className="floating-badge absolute flex bottom-10 lg:bottom-16 right-[-10px] lg:right-[-72px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-3.5 items-center gap-2.5 lg:gap-3 z-30">
                  <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center border border-white/12 shrink-0">
                    <svg className="w-3.5 h-3.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold tracking-tight">Darmowy szkic</p>
                    <p className="text-white/30 text-[10px]">Zero ryzyka</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Left / Bottom: description */}
            <div className="card-left-text gsap-reveal order-3 lg:order-1 flex flex-col justify-center text-center lg:text-left z-20 w-full px-4 lg:px-0">
              <h3 className="text-white text-2xl md:text-3xl lg:text-[1.75rem] font-bold mb-0 lg:mb-4 tracking-tight leading-snug">
                Sprzedająca strona.<br className="hidden lg:block" /> Błyskawicznie.
              </h3>
              <p className="hidden md:block text-white/40 text-sm lg:text-base font-light leading-relaxed max-w-xs">
                Profesjonalne strony dla lokalnych biznesów — od&nbsp;599&nbsp;zł, w&nbsp;48&nbsp;godzin, bez agencyjnych cen.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
