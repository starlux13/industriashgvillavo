import puntoGLogo from "@/assets/punto-g-logo.png.asset.json";
import lomaVerdeLogo from "@/assets/loma-verde-logo.png.asset.json";
import paloAltoLogo from "@/assets/palo-alto-logo.png.asset.json";
import roomPuntoG from "@/assets/room-punto-g.jpg";
import roomLomaVerde from "@/assets/room-loma-verde.jpg";
import roomPaloAlto from "@/assets/room-palo-alto.jpg";

export type TenantSlug = "punto-g" | "loma-verde" | "palo-alto";

export interface Tenant {
  slug: TenantSlug;
  name: string;
  tagline: { es: string; en: string };
  logoUrl: string;
  heroImage: string;
  accent: string; // hex for meta / decoration
  whatsapp: string; // digits only, no +
  phone: string;
  address: string;
  mapsEmbed: string; // iframe src
  mapsLink: string;
  coords: { lat: number; lng: number };
}

export const TENANTS: Record<TenantSlug, Tenant> = {
  "punto-g": {
    slug: "punto-g",
    name: "PUNTO G",
    tagline: {
      es: "Placer, discreción y lujo en el corazón de Villavicencio",
      en: "Pleasure, discretion and luxury in the heart of Villavicencio",
    },
    logoUrl: puntoGLogo.url,
    heroImage: roomPuntoG,
    accent: "#8b1e2c",
    whatsapp: "573000000001",
    phone: "+57 300 000 0001",
    address: "Villavicencio, Meta, Colombia",
    mapsEmbed: "https://www.google.com/maps?q=Motel+Punto+G+Villavicencio&output=embed",
    mapsLink: "https://maps.app.goo.gl/dkXB7cBkdoAi6vkd7",
    coords: { lat: 4.135, lng: -73.626 },
  },
  "loma-verde": {
    slug: "loma-verde",
    name: "LOMA VERDE",
    tagline: {
      es: "Naturaleza · Privacidad · Pasión",
      en: "Nature · Privacy · Passion",
    },
    logoUrl: lomaVerdeLogo.url,
    heroImage: roomLomaVerde,
    accent: "#1e4d2b",
    whatsapp: "573000000002",
    phone: "+57 300 000 0002",
    address: "Villavicencio, Meta, Colombia",
    mapsEmbed:
      "https://www.google.com/maps?q=Motel+Loma+Verde+Villavicencio&ll=4.1678865,-73.6678935&z=17&output=embed",
    mapsLink:
      "https://www.google.com/maps/place/Motel+Loma+Verde/@4.1678865,-73.6704684,17z",
    coords: { lat: 4.1678865, lng: -73.6678935 },
  },
  "palo-alto": {
    slug: "palo-alto",
    name: "PALO ALTO GLAMPING",
    tagline: {
      es: "Glamping romántico bajo las estrellas de los llanos",
      en: "Romantic glamping under the plains' starry skies",
    },
    logoUrl: paloAltoLogo.url,
    heroImage: roomPaloAlto,
    accent: "#c47a3d",
    whatsapp: "573000000003",
    phone: "+57 300 000 0003",
    address: "Villavicencio, Meta, Colombia",
    mapsEmbed:
      "https://www.google.com/maps?q=Palo+Alto+Glamping+Villavicencio&ll=4.1669875,-73.6642656&z=18&output=embed",
    mapsLink:
      "https://www.google.com/maps/place/Palo+Alto+Glamping/@4.1669875,-73.6655531,18z",
    coords: { lat: 4.1669875, lng: -73.6642656 },
  },
};

export const TENANT_LIST: Tenant[] = [
  TENANTS["punto-g"],
  TENANTS["loma-verde"],
  TENANTS["palo-alto"],
];

export function isTenantSlug(v: string): v is TenantSlug {
  return v === "punto-g" || v === "loma-verde" || v === "palo-alto";
}
