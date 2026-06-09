"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EyeOff, ShieldOff, TrendingUp } from "lucide-react";

const problems = [
  {
    Icon: EyeOff,
    title: "Klienci Cię nie znajdują",
    desc: "Google Maps to za mało. Hydraulik, restauracja czy salon — klient szuka strony www, żeby poznać ofertę i ceny, zanim w ogóle zadzwoni.",
  },
  {
    Icon: ShieldOff,
    title: "Tracisz zaufanie",
    desc: 'Brak strony budzi wątpliwości. "Czy ta firma w ogóle istnieje?" — to pierwsze pytanie każdego klienta, który Cię nie znajdzie online.',
  },
  {
    Icon: TrendingUp,
    title: "Konkurencja Cię wyprzedza",
    desc: "Lokalny konkurent ze stroną zdobywa klientów 24/7, nawet w nocy. Każde zapytanie bez Twojej strony trafia do kogoś innego.",
  },
];

export default function Problem() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
            Bez strony www
            <br />
            <span className="text-[#a1a1aa]">Twoja firma jest niewidoczna dla klientów</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {problems.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl border border-white/8 hover:border-indigo-500/40 transition-all duration-300 hover:bg-white/[0.02] cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-5">
                <Icon className="w-5 h-5 text-indigo-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
