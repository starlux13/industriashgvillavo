import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { Tenant } from "@/lib/tenants";

const SECTIONS = ["rooms", "services", "gallery", "attractions", "reviews", "faq", "contact"] as const;

export function TenantNavbar({ tenant }: { tenant: Tenant }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7 }}
      className={`fixed inset-x-0 top-0 z-40 transition-all ${
        scrolled ? "glass shadow-[var(--shadow-soft)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={tenant.logoUrl} alt={tenant.name} className="h-9 w-auto" />
          <span className={`hidden font-display text-lg font-semibold sm:inline ${scrolled ? "text-foreground" : "text-white"}`}>
            {tenant.name}
          </span>
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {SECTIONS.map((s) => (
            <li key={s}>
              <a
                href={`#${s}`}
                className={`text-sm font-medium transition hover:text-[color:var(--gold)] ${
                  scrolled ? "text-foreground/80" : "text-white/90"
                }`}
              >
                {t(`nav.${s}`)}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm" className={scrolled ? "" : "text-white hover:bg-white/10"}>
            <Link to={user ? "/dashboard" : "/auth"}>
              {user ? t("nav.dashboard") : t("nav.login")}
            </Link>
          </Button>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`grid h-10 w-10 place-items-center rounded-full md:hidden ${scrolled ? "text-foreground" : "text-white"}`}
          aria-label="menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="glass border-t md:hidden">
          <ul className="flex flex-col gap-1 p-4">
            {SECTIONS.map((s) => (
              <li key={s}>
                <a
                  href={`#${s}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-2 text-sm hover:bg-muted"
                >
                  {t(`nav.${s}`)}
                </a>
              </li>
            ))}
            <li>
              <Link
                to={user ? "/dashboard" : "/auth"}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-2 text-sm hover:bg-muted"
              >
                {user ? t("nav.dashboard") : t("nav.login")}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </motion.nav>
  );
}
