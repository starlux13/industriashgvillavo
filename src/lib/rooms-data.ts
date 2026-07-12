import type { TenantSlug } from "./tenants";
import roomPuntoG from "@/assets/room-punto-g.jpg";
import roomLomaVerde from "@/assets/room-loma-verde.jpg";
import roomPaloAlto from "@/assets/room-palo-alto.jpg";

export type RoomType = "suite" | "cabin" | "room" | "tent";

export interface Room {
  id: string;
  type: RoomType;
  nameEs: string;
  nameEn: string;
  price: number; // COP per night
  capacity: number;
  image: string;
  features: string[]; // service keys
}

export const ROOMS_BY_TENANT: Record<TenantSlug, Room[]> = {
  "punto-g": [
    {
      id: "pg-suite",
      type: "suite",
      nameEs: "Suite Presidencial Fantasía",
      nameEn: "Fantasy Presidential Suite",
      price: 380000,
      capacity: 2,
      image: roomPuntoG,
      features: ["wifi", "jacuzzi", "ac", "parking", "drinks", "privacy", "toys", "deco"],
    },
    {
      id: "pg-standard",
      type: "room",
      nameEs: "Habitación Íntima",
      nameEn: "Intimate Room",
      price: 180000,
      capacity: 2,
      image: roomPuntoG,
      features: ["wifi", "ac", "parking", "drinks", "privacy"],
    },
    {
      id: "pg-jacuzzi",
      type: "room",
      nameEs: "Suite con Jacuzzi",
      nameEn: "Jacuzzi Suite",
      price: 260000,
      capacity: 2,
      image: roomPuntoG,
      features: ["wifi", "jacuzzi", "ac", "parking", "drinks", "privacy"],
    },
  ],
  "loma-verde": [
    {
      id: "lv-cabin-lux",
      type: "cabin",
      nameEs: "Cabaña de Montaña",
      nameEn: "Mountain Cabin",
      price: 320000,
      capacity: 2,
      image: roomLomaVerde,
      features: ["wifi", "jacuzzi", "ac", "parking", "drinks", "privacy", "deco"],
    },
    {
      id: "lv-cabin-standard",
      type: "cabin",
      nameEs: "Cabaña Bosque",
      nameEn: "Forest Cabin",
      price: 240000,
      capacity: 2,
      image: roomLomaVerde,
      features: ["wifi", "ac", "parking", "drinks", "privacy"],
    },
    {
      id: "lv-suite",
      type: "suite",
      nameEs: "Suite Presidencial Verde",
      nameEn: "Green Presidential Suite",
      price: 420000,
      capacity: 2,
      image: roomLomaVerde,
      features: ["wifi", "jacuzzi", "ac", "parking", "drinks", "privacy", "toys", "deco"],
    },
  ],
  "palo-alto": [
    {
      id: "pa-tent",
      type: "tent",
      nameEs: "Glamping Estrellas",
      nameEn: "Starry Glamping",
      price: 290000,
      capacity: 2,
      image: roomPaloAlto,
      features: ["wifi", "jacuzzi", "parking", "drinks", "privacy", "deco"],
    },
    {
      id: "pa-tent-premium",
      type: "tent",
      nameEs: "Glamping Premium",
      nameEn: "Premium Glamping",
      price: 380000,
      capacity: 2,
      image: roomPaloAlto,
      features: ["wifi", "jacuzzi", "parking", "drinks", "privacy", "deco", "toys"],
    },
    {
      id: "pa-cabin",
      type: "cabin",
      nameEs: "Cabaña del Bosque",
      nameEn: "Forest Cabin",
      price: 260000,
      capacity: 2,
      image: roomPaloAlto,
      features: ["wifi", "parking", "drinks", "privacy"],
    },
  ],
};
