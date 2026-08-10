import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroImg from "@/assets/hero-mountains.jpg";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";

export function LandingHero() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} className="relative isolate h-screen w-full overflow-hidden">
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <img
          src={heroImg}
          alt=""
          width={1920}
          height={1080}
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9 }}
          className="mb-4 text-xs uppercase tracking-[0.4em] text-[color:var(--gold)]"
        >
          {t("landing.eyebrow")}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mb-6 max-w-4xl font-display text-5xl leading-[1.05] sm:text-7xl md:text-8xl"
        >
          {t("landing.titleA")} <span className="gold-text italic">{t("landing.titleAccent")}</span> {t("landing.titleB")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.9 }}
          className="mb-10 max-w-xl text-base text-white/85 sm:text-lg"
        >
          {t("landing.subtitle")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            asChild
            size="lg"
            className="rounded-full bg-[color:var(--gold)] px-8 text-[color:oklch(0.14_0.02_155)] hover:opacity-90"
          >
            <a href="#tenants">{t("hero.book")}</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-white/30 bg-white/5 px-8 text-white backdrop-blur hover:bg-white/10"
          >
            <Link to="/auth" search={{ next: "" }}>{t("nav.login")}</Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/80"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
}
