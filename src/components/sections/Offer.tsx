"use client";

import { motion, useInView, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import FloatCube from "@/components/ui/FloatCube";

const WA_LINK = "https://wa.me/48511814165";

const included = [
  "One-page strona internetowa",
  "Responsywna — mobile, tablet, desktop",
  "Formularz kontaktowy",
  "Podłączenie Twojej domeny",
  "Certyfikat SSL (HTTPS)",
  "Dostawa w 48h od akceptacji szkicu",
  "14 dni bezpłatnych poprawek",
];

const PROCESS = [
  { n: "01", label: "Darmowy szkic", sub: "Widzisz projekt przed decyzją" },
  { n: "02", label: "Akceptujesz", sub: "Dopiero wtedy płacisz" },
  { n: "03", label: "Strona w 48h", sub: "Online, gotowa na klientów" },
];

const INJECTED = `
  @keyframes offer-glow {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.7; }
  }
  .offer-glow-pulse {
    animation: offer-glow 4s ease-in-out infinite;
  }
`;

export default function Offer() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    stiffness: 200,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
    stiffness: 200,
    damping: 25,
  });

  return (
    <section
      ref={sectionRef}
      id="oferta"
      className="relative py-24 md:py-32 px-6 overflow-hidden"
      style={{ background: "#0e0f1e" }}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED }} />

      <FloatCube className="absolute left-[10%] top-28 hidden lg:block" size={52} variant="indigo" delay={0.4} />
      <FloatCube className="absolute right-[9%] bottom-24 hidden lg:block" size={34} variant="ink" delay={1.8} duration={13} />

      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-[11px] text-[var(--ink)]/45 font-semibold uppercase tracking-[0.25em] mb-4">
            Cennik
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-[-0.03em] text-[var(--ink)]">
            Jeden pakiet.
            <br />
            <span className="text-[var(--ink)]/40">Wszystko w środku.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md mx-auto"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            ref={cardRef}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              background: "linear-gradient(160deg, #161a2e 0%, #0d1020 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 40px 80px -24px rgba(13,16,32,0.45), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
            onMouseMove={(e) => {
              if (!cardRef.current) return;
              const r = cardRef.current.getBoundingClientRect();
              mouseX.set((e.clientX - r.left) / r.width - 0.5);
              mouseY.set((e.clientY - r.top) / r.height - 0.5);
            }}
            onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Inner shine */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{
                background: "radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.03) 0%, transparent 50%)",
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 p-8">
              {/* "Zero ryzyka" badge */}
              <div className="flex justify-center mb-8">
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-white/70 tracking-wide"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                  Darmowy szkic przed decyzją
                </div>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-2">
                  jednorazowa płatność
                </p>
                <div className="text-6xl font-semibold text-white tracking-tight leading-none">
                  od 599 zł
                </div>
                <p className="text-white/25 text-xs mt-2">cena finalna, bez niespodzianek</p>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/8 mb-6" />

              {/* Feature list */}
              <ul className="space-y-3 mb-8">
                {included.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg
                      className="w-4 h-4 text-white/50 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-white/75">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <div className="h-px bg-white/8 mb-6" />

              {/* Process steps */}
              <div className="mb-8">
                <p className="text-[10px] text-white/25 uppercase tracking-widest mb-4">
                  Jak to działa
                </p>
                <div className="flex items-start gap-2">
                  {PROCESS.map(({ n, label, sub }, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center text-center">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white/50 mb-2"
                        style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                      >
                        {n}
                      </div>
                      <p className="text-[11px] font-semibold text-white/80 leading-tight mb-0.5">
                        {label}
                      </p>
                      <p className="text-[9px] text-white/30 leading-tight">{sub}</p>
                      {i < PROCESS.length - 1 && (
                        <div className="absolute" style={{ display: "none" }} />
                      )}
                    </div>
                  ))}
                </div>
                {/* connecting line */}
                <div className="relative mt-3 flex items-center px-5">
                  <div className="flex-1 h-px bg-white/10" />
                  <div className="mx-2 text-white/20 text-[10px]">→</div>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
              </div>

              {/* CTA */}
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-black font-semibold text-[15px] transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: "#ffffff",
                  boxShadow: "0 4px 20px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,1)",
                }}
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Zacznij od darmowego szkicu
              </a>

              <p className="text-center text-[11px] text-white/20 mt-4">
                Szkic za darmo. Płacisz dopiero gdy projekt Ci się podoba.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
