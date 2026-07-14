import { createFileRoute } from "@tanstack/react-router";
import { LandingHero } from "@/components/LandingHero";
import { TenantSelector } from "@/components/TenantSelector";
import { FloatingActions } from "@/components/FloatingActions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Industrias HG" },
      { name: "description", content: "Punto G, Loma Verde y Palo Alto Glamping. Tres refugios exclusivos en Villavicencio para vivir momentos inolvidables." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen bg-background">
      <LandingHero />
      <div id="tenants">
        <TenantSelector />
      </div>
      <FloatingActions />
    </main>
  );
}
