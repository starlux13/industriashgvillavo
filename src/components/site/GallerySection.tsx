import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import type { Tenant } from "@/lib/tenants";

export function GallerySection({ tenant }: { tenant: Tenant }) {
  const { t } = useTranslation();
  const images = Array.from({ length: 8 }, () => tenant.heroImage);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="gallery" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="mb-3 text-4xl font-semibold sm:text-5xl">
            <span className="gold-text">{t("gallery.title")}</span>
          </h2>
          <p className="text-muted-foreground">{t("gallery.subtitle")}</p>
        </motion.div>

        {/* Masonry */}
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
          {images.map((img, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => setOpen(i)}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="block w-full overflow-hidden rounded-2xl"
              style={{ aspectRatio: `${(i % 3) + 3}/${(i % 2) + 3}` }}
            >
              <img
                src={img}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 backdrop-blur"
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={images[open]}
              alt=""
              className="max-h-[85vh] max-w-full rounded-2xl object-contain"
            />
            <button
              onClick={() => setOpen(null)}
              aria-label="close"
              className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white backdrop-blur"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
