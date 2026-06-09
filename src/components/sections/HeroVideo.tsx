"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const WA_LINK = "https://wa.me/48511814165";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const currentTimeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const wasScrolledRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    video.load();

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const loop = () => {
      const isMobile = window.innerWidth < 768;
      const heroMaxScroll = (isMobile ? 5 : 7) * window.innerHeight;
      const scrollTop = window.scrollY;
      const heroProgress = Math.min(1, scrollTop / heroMaxScroll);

      // Nav blur
      const nowScrolled = scrollTop > 20;
      if (nowScrolled !== wasScrolledRef.current) {
        wasScrolledRef.current = nowScrolled;
        if (navRef.current) {
          navRef.current.style.backdropFilter = nowScrolled ? "blur(12px)" : "";
          navRef.current.style.backgroundColor = nowScrolled ? "rgba(8,11,20,0.8)" : "";
          navRef.current.style.borderBottom = nowScrolled ? "1px solid rgba(255,255,255,0.06)" : "";
        }
      }

      // Progress bar
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${heroProgress * 100}%`;
      }
      if (progressTrackRef.current) {
        progressTrackRef.current.style.opacity = scrollTop < heroMaxScroll ? "1" : "0";
      }

      // Text fade + parallax (fades by 20% of hero scroll)
      const textFadeEnd = heroMaxScroll * 0.2;
      const textOpacity = Math.max(0, 1 - scrollTop / textFadeEnd);
      const parallaxY = scrollTop * 0.1;
      if (textRef.current) {
        textRef.current.style.opacity = String(textOpacity);
        textRef.current.style.transform = `translateY(calc(-50% - ${parallaxY}px))`;
      }

      // Scroll hint (fades at 5% of hero)
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = scrollTop < heroMaxScroll * 0.05 ? "1" : "0";
      }

      // Video scrubbing
      if (video.readyState >= 2 && video.duration) {
        const targetTime = heroProgress * video.duration;
        currentTimeRef.current += (targetTime - currentTimeRef.current) * 0.08;

        try {
          video.currentTime = Math.max(0, Math.min(video.duration, currentTimeRef.current));
        } catch (_) {}

        const ctx = canvas.getContext("2d");
        if (ctx) {
          const vW = video.videoWidth;
          const vH = video.videoHeight;
          const cW = canvas.width;
          const cH = canvas.height;

          if (vW && vH) {
            // cover behavior — crop to fill canvas
            const vAspect = vW / vH;
            const cAspect = cW / cH;
            let sx = 0, sy = 0, sw = vW, sh = vH;
            if (vAspect > cAspect) {
              sw = vH * cAspect;
              sx = (vW - sw) / 2;
            } else {
              sh = vW / cAspect;
              sy = (vH - sh) / 2;
            }
            ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cW, cH);
          }
        }
      }

      // Canvas + overlay fade out at end of hero (90–100%)
      const fadeStart = heroMaxScroll * 0.9;
      const canvasOpacity = scrollTop > fadeStart
        ? Math.max(0, 1 - (scrollTop - fadeStart) / (heroMaxScroll * 0.1))
        : 1;

      if (canvasOpacity === 0) {
        canvas.style.display = "none";
      } else {
        canvas.style.display = "block";
        canvas.style.opacity = String(canvasOpacity);
      }
      if (overlayRef.current) {
        overlayRef.current.style.opacity = String(canvasOpacity);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <>
      {/* Hidden video source */}
      <video
        ref={videoRef}
        src="/transition.mp4"
        preload="auto"
        muted
        playsInline
        style={{ display: "none" }}
      />

      {/* Canvas — video frames */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
        }}
      />

      {/* Gradient overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background: [
            "radial-gradient(ellipse at 50% 0%, rgba(30,30,40,0.4) 0%, transparent 50%)",
            "linear-gradient(180deg, rgba(5,5,15,0.7) 0%, transparent 50%)",
            "radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.85) 0%, transparent 50%)",
          ].join(", "),
        }}
      />

      {/* Progress bar */}
      <div
        ref={progressTrackRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          zIndex: 30,
          background: "rgba(99,102,241,0.15)",
          transition: "opacity 0.4s",
        }}
      >
        <div
          ref={progressBarRef}
          style={{
            height: "100%",
            width: "0%",
            background: "#6366f1",
            transition: "none",
          }}
        />
      </div>

      {/* Nav */}
      <nav
        ref={navRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          transition: "background-color 0.3s, backdrop-filter 0.3s, border-color 0.3s",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-white text-base tracking-tight">
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

      {/* Hero text — fixed, fades + parallax on scroll */}
      <div
        ref={textRef}
        style={{
          position: "fixed",
          left: "8%",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          maxWidth: "clamp(280px, 44vw, 600px)",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            fontSize: "clamp(40px, 6vw, 80px)",
            fontWeight: 700,
            color: "white",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Strona która
          <br />
          <span style={{ color: "#818cf8" }}>sprzedaje.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            color: "#94a3b8",
            marginTop: 16,
            fontSize: 16,
            lineHeight: 1.6,
            maxWidth: 360,
          }}
        >
          Pełna strona www dla Twojego biznesu — od 599 zł, gotowa w 48h.
        </motion.p>

        <motion.a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "inline-block",
            marginTop: 28,
            padding: "14px 32px",
            background: "#6366f1",
            color: "white",
            borderRadius: 14,
            fontWeight: 600,
            fontSize: 15,
            textDecoration: "none",
          }}
        >
          Napisz na WhatsApp →
        </motion.a>
      </div>

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        style={{
          position: "fixed",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          textAlign: "center",
          transition: "opacity 0.4s",
          pointerEvents: "none",
        }}
      >
        <motion.span
          style={{
            display: "block",
            fontSize: 11,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
          }}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          PRZEWIŃ ABY ODKRYĆ
        </motion.span>
      </div>

      {/* Scroll space — 500vh mobile, 700vh desktop */}
      <div className="h-[500vh] md:h-[700vh]" />
    </>
  );
}
