"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const WA_LINK = "https://wa.me/48511814165";
const MESSENGER_LINK = "https://m.me/1195093887010857";

const trackLead = () => {
  if (typeof window !== "undefined" && (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq)
    (window as unknown as { fbq: (...a: unknown[]) => void }).fbq("track", "Lead");
};

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
          {/* Messenger */}
          <motion.a
            href={MESSENGER_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Napisz na Messengerze"
            onClick={trackLead}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
            style={{
              background: "linear-gradient(135deg, #00B2FF 0%, #006AFF 55%, #A033FF 100%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.12 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" aria-hidden>
              <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.15.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.98-.87c.17-.08.36-.09.53-.04.91.25 1.88.38 2.91.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm6 7.46-2.94 4.66c-.47.74-1.47.93-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.94-4.66c.47-.74 1.47-.93 2.17-.4l2.34 1.75c.21.16.51.16.72 0l3.16-2.4c.42-.32.97.18.69.63z" />
            </svg>
          </motion.a>

          {/* WhatsApp */}
          <motion.a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Napisz na WhatsApp"
            onClick={trackLead}
            className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
            style={{ backgroundColor: "#25D366" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: "#25D366" }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white relative z-10" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </motion.a>
        </div>
      )}
    </AnimatePresence>
  );
}
