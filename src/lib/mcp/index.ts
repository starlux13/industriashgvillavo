import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listTenants from "./tools/list-tenants";
import listMyReservations from "./tools/list-my-reservations";
import createReservation from "./tools/create-reservation";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "moteles-villavicencio-mcp",
  title: "Moteles Villavicencio",
  version: "0.1.0",
  instructions:
    "Herramientas para consultar los moteles disponibles (Punto G, Loma Verde, Palo Alto Glamping), ver tus reservas y crear nuevas reservas como el usuario autenticado.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listTenants, listMyReservations, createReservation],
});
