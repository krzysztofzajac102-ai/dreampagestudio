"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FloatCube from "@/components/ui/FloatCube";

/*
  Słowa-bloki wjeżdżają od lewej do prawej, sprzężone ze scrollem
  (GSAP ScrollTrigger scrub) — jak w referencji.
*/
const WORDS = "Zaprojektowane dla Twojego biznesu, daleko od przestarzałych rozwiązań.".split(" ");
const ACCENT_WORDS = new Set(["Twojego", "biznesu,"]);

export default function Statement() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const words = ref.current.querySelectorAll<HTMLElement>(".st-word");
    const tween = gsap.fromTo(
      words,
      { x: -90, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 78%",
          end: "top 22%",
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
      className="relative px-6 md:px-12 py-28 md:py-44 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a0a14 0%, #0e0f1e 70%)" }}
    >
      <FloatCube className="absolute right-[8%] top-16 hidden md:block" size={64} variant="indigo" />
      <FloatCube className="absolute right-[22%] bottom-12 hidden md:block" size={36} variant="cyan" delay={1.4} duration={12} />
      <h2 className="relative max-w-5xl text-[var(--ink)] font-medium tracking-[-0.03em] leading-[1.08] text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
        {WORDS.map((w, i) => (
          <span
            key={i}
            className="st-word inline-block will-change-transform mr-[0.26em]"
            style={
              ACCENT_WORDS.has(w)
                ? {
                    background: "linear-gradient(120deg, #818cf8, #a78bfa)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }
                : undefined
            }
          >
            {w}
          </span>
        ))}
      </h2>
    </section>
  );
}
