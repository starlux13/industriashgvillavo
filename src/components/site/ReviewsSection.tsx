import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tenant } from "@/lib/tenants";

interface Review {
  id: string;
  display_name: string;
  location: string | null;
  rating: number;
  comment: string;
}

// Seed / placeholder reviews shown when DB has none
const SEED: Review[] = [
  { id: "1", display_name: "Carlos M.", location: "Bogotá, Colombia", rating: 5, comment: "Increíble experiencia, todo impecable. Volveremos sin duda." },
  { id: "2", display_name: "Ana L.", location: "Villavicencio", rating: 5, comment: "El lugar es hermoso, muy privado y elegante." },
  { id: "3", display_name: "Sofía R.", location: "Medellín", rating: 4, comment: "Buena atención y servicios de primera. Recomendado." },
  { id: "4", display_name: "Javier P.", location: "Cali", rating: 5, comment: "Un refugio perfecto para desconectarse. Diez de diez." },
];

export function ReviewsSection({ tenant }: { tenant: Tenant }) {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>(SEED);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    supabase
      .from("reviews_public" as never)
      .select("id, display_name, rating, comment")
      .eq("tenant_slug", tenant.slug)
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => {
        if (data && (data as unknown as Review[]).length > 0)
          setReviews((data as unknown as Review[]).map((r) => ({ ...r, location: null })));
      });
  }, [tenant.slug]);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % reviews.length), 5000);
    return () => clearInterval(id);
  }, [reviews.length]);

  const current = reviews[idx];

  return (
    <section id="reviews" className="relative py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-4xl font-semibold sm:text-5xl"
        >
          <span className="gold-text">{t("reviews.title")}</span>
        </motion.h2>

        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl border bg-card p-10 shadow-[var(--shadow-soft)]"
        >
          <Quote className="mx-auto mb-6 h-10 w-10 text-[color:var(--gold)]" />
          <p className="mb-6 text-xl italic leading-relaxed text-foreground/90">
            "{current.comment}"
          </p>
          <div className="mb-3 flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < current.rating ? "fill-[color:var(--gold)] text-[color:var(--gold)]" : "text-muted"
                }`}
              />
            ))}
          </div>
          <p className="font-semibold">{current.display_name}</p>
          {current.location && (
            <p className="text-sm text-muted-foreground">{current.location}</p>
          )}
        </motion.div>

        <div className="mt-6 flex justify-center gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Review ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-8 bg-[color:var(--gold)]" : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
