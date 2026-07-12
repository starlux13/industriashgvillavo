import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TENANTS, isTenantSlug } from "@/lib/tenants";
import { TenantNavbar } from "@/components/site/TenantNavbar";
import { TenantHero } from "@/components/site/TenantHero";
import { RoomsSection } from "@/components/site/RoomsSection";
import { ServicesSection } from "@/components/site/ServicesSection";
import { GallerySection } from "@/components/site/GallerySection";
import { AttractionsSection } from "@/components/site/AttractionsSection";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { FaqSection } from "@/components/site/FaqSection";
import { ContactSection } from "@/components/site/ContactSection";
import { BookingSection } from "@/components/site/BookingSection";
import { TenantFooter } from "@/components/site/TenantFooter";
import { FloatingActions } from "@/components/FloatingActions";

export const Route = createFileRoute("/site/$tenant")({
  loader: ({ params }) => {
    if (!isTenantSlug(params.tenant)) throw notFound();
    return { tenant: TENANTS[params.tenant] };
  },
  head: ({ loaderData }) => {
    const t = loaderData?.tenant;
    return {
      meta: [
        { title: t ? `${t.name} · Villavicencio` : "Motel" },
        { name: "description", content: t?.tagline.es ?? "" },
        { property: "og:title", content: t?.name ?? "Motel" },
        { property: "og:description", content: t?.tagline.es ?? "" },
        { property: "og:type", content: "website" },
      ],
      links: t ? [{ rel: "canonical", href: `/site/${t.slug}` }] : [],
    };
  },
  component: TenantSite,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">Sitio no encontrado.</p>
        <Link to="/" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">Volver</Link>
      </div>
    </div>
  ),
});

function TenantSite() {
  const { tenant } = Route.useLoaderData();
  const [selectedRoom, setSelectedRoom] = useState<string | undefined>();

  useEffect(() => {
    document.body.setAttribute("data-tenant", tenant.slug);
    return () => { document.body.removeAttribute("data-tenant"); };
  }, [tenant.slug]);

  const handleBook = (room: string) => {
    setSelectedRoom(room);
    setTimeout(() => {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="relative">
      <TenantNavbar tenant={tenant} />
      <TenantHero tenant={tenant} />
      <RoomsSection tenant={tenant} onBook={handleBook} />
      <ServicesSection />
      <GallerySection tenant={tenant} />
      <AttractionsSection />
      <ReviewsSection tenant={tenant} />
      <BookingSection tenant={tenant} defaultRoomType={selectedRoom} />
      <FaqSection />
      <ContactSection tenant={tenant} />
      <TenantFooter tenant={tenant} />
      <FloatingActions whatsapp={tenant.whatsapp} />
    </div>
  );
}
