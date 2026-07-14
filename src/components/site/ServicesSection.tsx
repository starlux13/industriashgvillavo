import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Wifi, Car, Waves, Snowflake, Wine, Lock, Heart, Sparkles, Coffee, Cigarette, Users, Bath } from "lucide-react";

const SERVICES = [
  { icon: Wifi, es: "Wi-Fi de alta velocidad", en: "High-speed Wi-Fi" },
  { icon: Car, es: "Parqueadero privado", en: "Private parking" },
  { icon: Waves, es: "Jacuzzi disponible", en: "Jacuzzi available" },
  { icon: Snowflake, es: "Aire acondicionado", en: "Air conditioning" },
  { icon: Wine, es: "Bar & consumos", en: "Bar & drinks" },
  { icon: Lock, es: "Privacidad total", en: "Total privacy" },
  { icon: Heart, es: "Kit sensual disponible", en: "Sensual kit available" },
  { icon: Sparkles, es: "Decoraciones a medida", en: "Custom decorations" },
  { icon: Coffee, es: "Desayuno opcional", en: "Optional breakfast" },
  { icon: Bath, es: "Servicio de taxi", en: "Taxi service" },
  { icon: Users, es: "Camas king/queen", en: "King/Queen beds" },
  { icon: Cigarette, es: "Zonas designadas", en: "Designated zones" },
];

export function ServicesSection() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "es").startsWith("en") ? "en" : "es";

  return (
    <section id="services" className="relative bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="mb-3 text-4xl font-semibold sm:text-5xl">
            <span className="gold-text">{t("services.title")}</span>
          </h2>
          <p className="text-muted-foreground">{t("services.subtitle")}</p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)]"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-tenant text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{lang === "es" ? s.es : s.en}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
