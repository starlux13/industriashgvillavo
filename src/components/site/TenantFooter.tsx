import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { Tenant } from "@/lib/tenants";

export function TenantFooter({ tenant }: { tenant: Tenant }) {
  const { t } = useTranslation();
  return (
    <footer className="border-t bg-card py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-4">
        <div>
          <img src={tenant.logoUrl} alt={tenant.name} className="mb-3 h-14 w-auto" />
          <p className="text-sm text-muted-foreground">{tenant.name}</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider">{t("footer.explore")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#rooms">{t("nav.rooms")}</a></li>
            <li><a href="#services">{t("nav.services")}</a></li>
            <li><a href="#gallery">{t("nav.gallery")}</a></li>
            <li><a href="#contact">{t("nav.contact")}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider">{t("footer.legal")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#">{t("footer.privacy")}</a></li>
            <li><a href="#">{t("footer.termsLink")}</a></li>
            <li><Link to="/auth" search={{ next: "" }}>{t("nav.login")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider">{t("footer.contact")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{tenant.phone}</li>
            <li>{tenant.address}</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t px-6 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {tenant.name}. {t("footer.rights")}
      </div>
    </footer>
  );
}
