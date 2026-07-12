import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Wifi, Car, Waves, Snowflake, Wine, Lock, Heart, Sparkles, BedDouble } from "lucide-react";
import type { Tenant } from "@/lib/tenants";
import { ROOMS_BY_TENANT, type RoomType } from "@/lib/rooms-data";

const FEATURE_ICONS: Record<string, { icon: React.ElementType; labelEs: string; labelEn: string }> = {
  wifi: { icon: Wifi, labelEs: "Wi-Fi", labelEn: "Wi-Fi" },
  parking: { icon: Car, labelEs: "Parqueadero privado", labelEn: "Private parking" },
  jacuzzi: { icon: Waves, labelEs: "Jacuzzi", labelEn: "Jacuzzi" },
  ac: { icon: Snowflake, labelEs: "Aire acondicionado", labelEn: "Air conditioning" },
  drinks: { icon: Wine, labelEs: "Bar & consumos", labelEn: "Bar & drinks" },
  privacy: { icon: Lock, labelEs: "Privacidad total", labelEn: "Total privacy" },
  toys: { icon: Heart, labelEs: "Kit sensual", labelEn: "Sensual kit" },
  deco: { icon: Sparkles, labelEs: "Decoración", labelEn: "Decoration" },
};

export function RoomsSection({ tenant, onBook }: { tenant: Tenant; onBook: (roomType: string) => void }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language.startsWith("en") ? "en" : "es") as "es" | "en";
  const rooms = ROOMS_BY_TENANT[tenant.slug];
  const [guests, setGuests] = useState<string>("any");
  const [type, setType] = useState<RoomType | "all">("all");
  const [maxPrice, setMaxPrice] = useState<number>(500000);

  const filtered = useMemo(
    () =>
      rooms.filter(
        (r) =>
          (type === "all" || r.type === type) &&
          (guests === "any" || r.capacity >= parseInt(guests, 10)) &&
          r.price <= maxPrice,
      ),
    [rooms, type, guests, maxPrice],
  );

  return (
    <section id="rooms" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="mb-3 text-4xl font-semibold sm:text-5xl">
            <span className="gold-text">{t("rooms.title")}</span>
          </h2>
          <p className="text-muted-foreground">{t("rooms.subtitle")}</p>
        </motion.div>

        {/* Filters */}
        <div className="mb-10 grid gap-4 rounded-2xl border bg-card p-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
              {t("rooms.filterGuests")}
            </label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">—</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
              {t("rooms.filterType")}
            </label>
            <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("rooms.types.all")}</SelectItem>
                <SelectItem value="suite">{t("rooms.types.suite")}</SelectItem>
                <SelectItem value="cabin">{t("rooms.types.cabin")}</SelectItem>
                <SelectItem value="room">{t("rooms.types.room")}</SelectItem>
                <SelectItem value="tent">{t("rooms.types.tent")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
              {t("rooms.filterPrice")}: ${maxPrice.toLocaleString("es-CO")}
            </label>
            <Slider
              min={100000}
              max={500000}
              step={20000}
              value={[maxPrice]}
              onValueChange={(v) => setMaxPrice(v[0])}
              className="mt-3"
            />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -6 }}
            >
              <Card className="group overflow-hidden border-white/10 bg-card p-0 shadow-[var(--shadow-soft)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={room.image}
                    alt={room[lang === "es" ? "nameEs" : "nameEn"]}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div
                    className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium text-white backdrop-blur"
                    style={{ backgroundColor: `${tenant.accent}cc` }}
                  >
                    {t(`rooms.types.${room.type}`)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold">
                    {room[lang === "es" ? "nameEs" : "nameEn"]}
                  </h3>
                  <div className="mb-4 flex items-baseline gap-2">
                    <span className="gold-text text-2xl font-bold">
                      ${room.price.toLocaleString("es-CO")}
                    </span>
                    <span className="text-xs text-muted-foreground">{t("rooms.night")}</span>
                  </div>
                  <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <BedDouble className="h-4 w-4" />
                    {room.capacity} {t("rooms.guests")}
                  </div>
                  <div className="mb-5 flex flex-wrap gap-2">
                    {room.features.map((f) => {
                      const meta = FEATURE_ICONS[f];
                      if (!meta) return null;
                      const Icon = meta.icon;
                      return (
                        <div
                          key={f}
                          title={meta[lang === "es" ? "labelEs" : "labelEn"]}
                          className="grid h-8 w-8 place-items-center rounded-full bg-muted text-[color:var(--gold)]"
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    onClick={() => onBook(room[lang === "es" ? "nameEs" : "nameEn"])}
                    className="w-full rounded-full"
                    style={{ backgroundColor: tenant.accent, color: "white" }}
                  >
                    {t("rooms.book")}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
