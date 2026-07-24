import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { TENANT_LIST } from "@/lib/tenants";
import { useTranslation } from "react-i18next";
import { ArrowRight, Eye } from "lucide-react";

export function TenantSelector() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const lang = ((i18n.language || "es").startsWith("en") ? "en" : "es") as "es" | "en";

  const handleClick = (idx: number, slug: string) => {
    if (activeIdx === idx) {
      // second click = enter
      navigate({ to: "/site/$tenant", params: { tenant: slug } });
    } else {
      setActiveIdx(idx);
    }
  };

  return (
    <section className="relative isolate min-h-screen w-full overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_75%)]" />

      <div className="relative z-10 mx-auto mb-14 max-w-3xl px-6 text-center">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-3 text-4xl font-semibold sm:text-6xl"
        >
          <span className="gold-text">{t("selector.title")}</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-muted-foreground"
        >
          {t("selector.subtitle")}
        </motion.p>
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-3">
        {TENANT_LIST.map((tenant, idx) => {
          const active = activeIdx === idx;
          return (
            <motion.button
              type="button"
              key={tenant.slug}
              data-tenant={tenant.slug}
              onClick={() => handleClick(idx, tenant.slug)}
              onMouseLeave={() => activeIdx === idx && setActiveIdx(null)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.12 }}
              whileHover={{ y: -6 }}
              className="group relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/10 text-left shadow-[var(--shadow-soft)] focus:outline-none focus:ring-2 focus:ring-[color:var(--gold)]"
              aria-label={`${tenant.name} — ${active ? t("selector.enter") : t("selector.preview")}`}
            >
              {/* Image layer */}
              <motion.div
                animate={{ scale: active ? 1.08 : 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${tenant.heroImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: active
                    ? `linear-gradient(180deg, transparent 20%, ${tenant.accent}cc 100%)`
                    : `linear-gradient(180deg, transparent 40%, oklch(0.14 0.02 155 / 0.85) 100%)`,
                }}
              />

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col justify-end p-8">
                <img
                  src={tenant.logoUrl}
                  alt={tenant.name}
                  loading="lazy"
                  className="mb-4 h-20 w-auto object-contain drop-shadow-2xl"
                />
                <h3 className="mb-1 text-2xl font-bold tracking-wide text-white sm:text-3xl">
                  {tenant.name}
                </h3>
                <p className="mb-5 max-w-xs text-sm text-white/85">
                  {tenant.tagline[lang]}
                </p>

                <motion.div
                  animate={{
                    y: active ? 0 : 8,
                    opacity: active ? 1 : 0.7,
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-white"
                >
                  {active ? (
                    <>
                      <span>{t("selector.enter")}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      <span>{t("selector.preview")}</span>
                    </>
                  )}
                </motion.div>
              </div>

              {/* Corner accent */}
              <div
                className="absolute right-6 top-6 h-2 w-2 rounded-full"
                style={{ backgroundColor: tenant.accent, boxShadow: `0 0 20px ${tenant.accent}` }}
              />
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
