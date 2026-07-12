import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Phone, MessageCircle, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import type { Tenant } from "@/lib/tenants";

export function ContactSection({ tenant }: { tenant: Tenant }) {
  const { t } = useTranslation();
  return (
    <section id="contact" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="mb-3 text-4xl font-semibold sm:text-5xl">
            <span className="gold-text">{t("contact.title")}</span>
          </h2>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border shadow-[var(--shadow-soft)]">
            <iframe
              src={tenant.mapsEmbed}
              title={`${tenant.name} — Google Maps`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[400px] w-full"
            />
          </div>

          <div className="space-y-4">
            <a
              href={`tel:${tenant.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-1"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl gradient-tenant text-white">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">{t("contact.phone")}</div>
                <div className="font-semibold">{tenant.phone}</div>
              </div>
            </a>
            <a
              href={`https://wa.me/${tenant.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-1"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#25D366] text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">{t("contact.whatsapp")}</div>
                <div className="font-semibold">+{tenant.whatsapp}</div>
              </div>
            </a>
            <a
              href={tenant.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-1"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl gradient-tenant text-white">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">{t("contact.address")}</div>
                <div className="font-semibold">{tenant.address}</div>
              </div>
            </a>
            <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)]">
              <div className="grid h-12 w-12 place-items-center rounded-xl gradient-tenant text-white">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">{t("contact.hours")}</div>
                <div className="font-semibold">{t("contact.hours247")}</div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-11 w-11 place-items-center rounded-full border bg-card"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-11 w-11 place-items-center rounded-full border bg-card"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
