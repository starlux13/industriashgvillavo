import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { ArrowUp, MessageCircle, Moon, Sun, Languages } from "lucide-react";
import { useEffect, useState } from "react";

export function FloatingActions({ whatsapp }: { whatsapp?: string }) {
  const { theme, setTheme } = useTheme();
  const { i18n, t } = useTranslation();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleLang = () => i18n.changeLanguage(i18n.language.startsWith("es") ? "en" : "es");
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const btn =
    "grid h-12 w-12 place-items-center rounded-full glass shadow-[var(--shadow-soft)] transition-transform hover:scale-110";

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="top"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label={t("floating.top")}
            className={btn}
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
      <button aria-label={t("floating.lang")} onClick={toggleLang} className={btn}>
        <Languages className="h-5 w-5" />
      </button>
      <button aria-label={t("floating.theme")} onClick={toggleTheme} className={btn}>
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
      {whatsapp && (
        <motion.a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_40px_-8px_rgba(37,211,102,0.5)]"
        >
          <MessageCircle className="h-6 w-6" />
        </motion.a>
      )}
    </div>
  );
}
