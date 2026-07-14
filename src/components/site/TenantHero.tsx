import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Tenant } from "@/lib/tenants";

export function TenantHero({ tenant }: { tenant: Tenant }) {
  const { t, i18n } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const lang = ((i18n.language || "es").startsWith("en") ? "en" : "es") as "es" | "en";

  return (
    <section ref={ref} className="relative isolate h-screen w-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <img src={tenant.heroImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/85" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 text-center text-white"
      >
        <motion.img
          initial={{ opacity: 0, y: -12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9 }}
          src={tenant.logoUrl}
          alt={tenant.name}
          className="mb-6 h-28 w-auto drop-shadow-2xl sm:h-36"
        />
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mb-4 font-display text-5xl leading-none tracking-tight sm:text-7xl md:text-8xl"
        >
          {tenant.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.9 }}
          className="mb-10 max-w-2xl text-lg text-white/85"
        >
          {tenant.tagline[lang]}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            asChild
            size="lg"
            className="rounded-full px-8"
            style={{ backgroundColor: tenant.accent, color: "white" }}
          >
            <a href="#booking">{t("hero.book")}</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-white/30 bg-white/5 px-8 text-white backdrop-blur hover:bg-white/10"
          >
            <a href={`https://wa.me/${tenant.whatsapp}`} target="_blank" rel="noopener noreferrer">
              {t("hero.whatsapp")}
            </a>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/80"
      >
        <span className="text-xs uppercase tracking-widest">{t("hero.scroll")}</span>
        <ChevronDown className="h-5 w-5" />
      </motion.div>
    </section>
  );
}
