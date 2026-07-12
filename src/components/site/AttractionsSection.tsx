import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MapPin, Clock } from "lucide-react";

const ATTRACTIONS = [
  {
    nameEs: "Parque Las Malocas",
    nameEn: "Las Malocas Park",
    descEs: "Icónico parque temático con cultura llanera y show de joropo.",
    descEn: "Iconic theme park with llanera culture and joropo show.",
    distance: "8 km",
    time: "15 min",
    img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop",
  },
  {
    nameEs: "Bioparque Los Ocarros",
    nameEn: "Los Ocarros Biopark",
    descEs: "Zoológico especializado en fauna de los llanos orientales.",
    descEn: "Zoo specialized in eastern plains wildlife.",
    distance: "6 km",
    time: "12 min",
    img: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&auto=format&fit=crop",
  },
  {
    nameEs: "Mirador La Piedra del Amor",
    nameEn: "Love Rock Viewpoint",
    descEs: "Vista panorámica de Villavicencio, ideal al atardecer.",
    descEn: "Panoramic view of Villavicencio, ideal at sunset.",
    distance: "4 km",
    time: "10 min",
    img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop",
  },
  {
    nameEs: "Monumento Cristo Rey",
    nameEn: "Christ the King Monument",
    descEs: "Escultura icónica con impresionantes vistas de la ciudad.",
    descEn: "Iconic sculpture with impressive city views.",
    distance: "5 km",
    time: "12 min",
    img: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&auto=format&fit=crop",
  },
];

export function AttractionsSection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("en") ? "en" : "es";

  return (
    <section id="attractions" className="relative bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="mb-3 text-4xl font-semibold sm:text-5xl">
            <span className="gold-text">{t("attractions.title")}</span>
          </h2>
          <p className="text-muted-foreground">{t("attractions.subtitle")}</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ATTRACTIONS.map((a, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={a.img}
                  alt={lang === "es" ? a.nameEs : a.nameEn}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-5">
                <h3 className="mb-1 font-semibold">{lang === "es" ? a.nameEs : a.nameEn}</h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  {lang === "es" ? a.descEs : a.descEn}
                </p>
                <div className="flex items-center gap-4 text-xs text-[color:var(--gold)]">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.distance}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.time}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
