import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Bed, Mountain, Sparkles, Wine, Wifi, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const ICONS = [Mountain, Bed, Heart, Wine, Wifi, Sparkles];

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [iconIdx, setIconIdx] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const dur = 2200;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setProgress(p * 100);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 300);
    };
    raf = requestAnimationFrame(tick);
    const swap = setInterval(() => setIconIdx((i) => (i + 1) % ICONS.length), 350);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(swap);
    };
  }, [onDone]);

  const Icon = ICONS[iconIdx];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      >
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-[color:var(--gold)] opacity-10 blur-3xl" />
          <div className="absolute -right-40 bottom-1/3 h-96 w-96 rounded-full bg-primary opacity-10 blur-3xl" />
        </div>

        <motion.div
          key={iconIdx}
          initial={{ scale: 0.6, opacity: 0, rotateY: -60 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.6, opacity: 0, rotateY: 60 }}
          transition={{ duration: 0.35 }}
          className="mb-8"
        >
          <div className="grid h-24 w-24 place-items-center rounded-3xl glass shadow-[var(--shadow-glow)]">
            <Icon className="h-10 w-10 text-[color:var(--gold)]" />
          </div>
        </motion.div>

        <h1 className="mb-2 gold-text text-4xl font-semibold tracking-wide sm:text-5xl">
          {t("brand")}
        </h1>
        <p className="mb-10 text-sm text-muted-foreground">{t("loading")}</p>

        <div className="h-1.5 w-72 max-w-[80vw] overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, var(--gold), color-mix(in oklab, var(--gold) 60%, white))",
            }}
            transition={{ ease: "linear" }}
          />
        </div>
        <p className="mt-3 text-xs tabular-nums text-muted-foreground">
          {Math.floor(progress)}%
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
