"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const faqs = [
  {
    q: "Czym jest darmowy szkic i jak to działa?",
    a: "Przed jakąkolwiek płatnością przygotowuję dla Ciebie wstępny szkic strony — układ sekcji, kolory, wstępne treści. Jeśli podoba się i chcesz kontynuować — ustalamy szczegóły i ruszamy. Jeśli nie — nie płacisz absolutnie nic. Zero ryzyka z Twojej strony.",
  },
  {
    q: "Ile trwa realizacja strony?",
    a: "48 godzin od momentu, gdy dostarczysz materiały (logo, teksty, zdjęcia) i zaakceptujesz szkic. Jeśli nie masz gotowych materiałów — pomogę Ci je przygotować na podstawie rozmowy o Twojej firmie.",
  },
  {
    q: "Jak wygląda płatność?",
    a: "Najpierw dostajesz darmowy szkic — za darmo, bez zobowiązań. Jeśli szkic Ci się podoba i chcesz zamówić stronę — płatność jednorazowa przed startem prac. BLIK lub przelew. Dzięki temu wiesz dokładnie co zamawiasz zanim wydasz złotówkę.",
  },
  {
    q: "Co dokładnie wchodzi w cenę 599 zł?",
    a: "Jedna strona (one-pager), responsywna na wszystkich urządzeniach, formularz kontaktowy, podłączenie Twojej domeny, certyfikat SSL i 14 dni darmowych poprawek po oddaniu. Cena finalna — bez ukrytych kosztów i aneksów.",
  },
  {
    q: "Czy będę mógł samodzielnie edytować stronę?",
    a: "Przez 14 dni po oddaniu strony poprawki są bezpłatne — wystarczy napisać na WhatsApp. Po tym czasie wyceniam zmiany indywidualnie, zwykle to drobne kwoty.",
  },
  {
    q: "Czy potrzebuję własnej domeny?",
    a: "Jeśli masz — świetnie. Jeśli nie — pomogę Ci kupić odpowiednią za ok. 50–100 zł/rok i wszystko skonfiguruję.",
  },
  {
    q: "Dla jakich biznesów robisz strony?",
    a: "Dla każdego lokalnego biznesu: usługi (hydraulik, elektryk, malarz, stolarz), gastronomia (restauracja, bar, catering), beauty (salon, kosmetyczka, fizjoterapeuta), sklepy i wiele innych branż. Strony, które rzeczywiście przyciągają klientów.",
  },
];

function FAQItem({ q, a, i, isInView }: { q: string; a: string; i: number; isInView: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.08 + i * 0.07, duration: 0.5, ease: EASE }}
      className="border-b last:border-0"
      style={{ borderColor: "rgba(255,255,255,0.07)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 cursor-pointer"
      >
        <span className="text-white/80 font-medium text-[15px] leading-snug">{q}</span>
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200"
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            background: open ? "rgba(255,255,255,0.08)" : "transparent",
          }}
        >
          <svg
            className="w-3 h-3 text-white/50 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-white/40 leading-relaxed text-sm">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} id="faq" className="py-24 md:py-32 px-6 bg-black">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE }}
          className="mb-16"
        >
          <p className="text-[11px] text-white/25 font-semibold uppercase tracking-[0.25em] mb-4">
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Masz pytania?
            <br />
            <span className="text-white/35">Mam odpowiedzi.</span>
          </h2>
        </motion.div>

        <div>
          {faqs.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} i={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
