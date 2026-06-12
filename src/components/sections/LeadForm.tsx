"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import FloatCube from "@/components/ui/FloatCube";

const WEBHOOK_URL = "https://kzajac.app.n8n.cloud/webhook/dps-lead-form";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface FormData {
  imie: string;
  telefon: string;
  branza: string;
  wiadomosc: string;
}

type FormState = "idle" | "loading" | "success" | "error";

export default function LeadForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const [formData, setFormData] = useState<FormData>({
    imie: "",
    telefon: "",
    branza: "",
    wiadomosc: "",
  });
  const [formState, setFormState] = useState<FormState>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState === "loading" || formState === "success") return;
    setFormState("loading");
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Network error");
      setFormState("success");
    } catch {
      setFormState("error");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="formularz"
      className="relative py-24 md:py-32 px-6 overflow-hidden"
      style={{ background: "#0a0a14" }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundSize: "60px 60px",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)",
        }}
        aria-hidden="true"
      />
      <FloatCube
        className="absolute left-[8%] top-24 hidden lg:block"
        size={36}
        variant="indigo"
        delay={1}
      />
      <FloatCube
        className="absolute right-[7%] bottom-24 hidden lg:block"
        size={28}
        variant="cyan"
        delay={2.5}
        duration={14}
      />

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Darmowy szkic w 24h
          </div>
          <h2 className="text-3xl md:text-5xl font-medium tracking-[-0.03em] text-[var(--ink)] mb-4">
            Napisz co potrzebujesz
          </h2>
          <p className="text-[var(--ink)]/55 text-lg leading-relaxed">
            Wypełnij formularz — odezwiemy się w kilka godzin
            <br className="hidden md:block" />i przygotujemy darmowy szkic
            Twojej strony.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.65, ease: EASE }}
          className="rounded-2xl p-8 md:p-10"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 64px -16px rgba(0,0,0,0.5)",
          }}
        >
          {formState === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="text-center py-8"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{
                  background: "rgba(52,211,153,0.12)",
                  border: "1px solid rgba(52,211,153,0.2)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 stroke-emerald-400 fill-none"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-[var(--ink)] mb-3">
                Dziękujemy!
              </h3>
              <p className="text-[var(--ink)]/55 leading-relaxed">
                Dostaliśmy Twoje zgłoszenie. Odezwiemy się wkrótce
                <br className="hidden md:block" />z darmowym szkicem Twojej
                strony.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  label="Imię"
                  name="imie"
                  type="text"
                  placeholder="Jan Kowalski"
                  value={formData.imie}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="Telefon"
                  name="telefon"
                  type="tel"
                  placeholder="511 814 165"
                  value={formData.telefon}
                  onChange={handleChange}
                  required
                />
              </div>
              <FormField
                label="Branża"
                name="branza"
                type="text"
                placeholder="np. Fryzjer, Fotograf, Sklep..."
                value={formData.branza}
                onChange={handleChange}
                required
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[var(--ink)]/70">
                  Wiadomość{" "}
                  <span className="text-[var(--ink)]/30">(opcjonalne)</span>
                </label>
                <textarea
                  name="wiadomosc"
                  value={formData.wiadomosc}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Opisz czego szukasz, jakie funkcje są ważne..."
                  className="rounded-xl px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink)]/30 resize-none outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onFocus={(e) => {
                    e.target.style.border =
                      "1px solid rgba(255,255,255,0.22)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(99,102,241,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border =
                      "1px solid rgba(255,255,255,0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {formState === "error" && (
                <p className="text-sm text-red-400/80 text-center">
                  Coś poszło nie tak. Spróbuj ponownie lub napisz na WhatsApp.
                </p>
              )}

              <button
                type="submit"
                disabled={formState === "loading"}
                className="w-full py-4 rounded-xl font-semibold text-base text-[#0a0a14] transition-all hover:bg-white/85 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: "#ffffff",
                  boxShadow:
                    "0 4px 20px rgba(255,255,255,0.08), 0 16px 40px -12px rgba(0,0,0,0.6)",
                }}
              >
                {formState === "loading" ? (
                  <span className="inline-flex items-center gap-2 justify-center">
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeOpacity="0.3"
                      />
                      <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    Wysyłanie...
                  </span>
                ) : (
                  "Wyślij i odbierz darmowy szkic"
                )}
              </button>

              <p className="text-center text-xs text-[var(--ink)]/35">
                Zero spamu. Odpisujemy w ciągu kilku godzin.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function FormField({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="text-sm font-medium text-[var(--ink)]/70"
      >
        {label}{" "}
        {required && <span className="text-[var(--ink)]/30">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="rounded-xl px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink)]/30 outline-none transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onFocus={(e) => {
          e.target.style.border = "1px solid rgba(255,255,255,0.22)";
          e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
        }}
        onBlur={(e) => {
          e.target.style.border = "1px solid rgba(255,255,255,0.08)";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}
