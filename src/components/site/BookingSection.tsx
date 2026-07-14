import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { generateAlias } from "@/lib/booking-names";
import type { Tenant } from "@/lib/tenants";

const bookingSchema = z.object({
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  guests: z.number().int().min(1).max(10),
  roomType: z.string().min(1).max(80),
  decoration: z.string().max(80).optional(),
  phone: z.string().trim().min(7).max(20),
  name: z.string().trim().max(80).optional(),
});

export function BookingSection({
  tenant,
  defaultRoomType,
}: {
  tenant: Tenant;
  defaultRoomType?: string;
}) {
  const { t } = useTranslation();
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [alias, setAlias] = useState<string>(() => generateAlias());

  useEffect(() => {
    setAlias(generateAlias());
  }, [tenant.slug]);

  const [form, setForm] = useState({
    checkIn: today,
    checkOut: tomorrow,
    guests: 2,
    roomType: defaultRoomType ?? "",
    decoration: "none",
    phone: "",
    name: "",
  });

  useEffect(() => {
    if (defaultRoomType) setForm((f) => ({ ...f, roomType: defaultRoomType }));
  }, [defaultRoomType]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = bookingSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }

    // Persist to DB only if authenticated (RLS requires it). Public users still get WhatsApp.
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { error } = await supabase.from("reservations").insert({
        user_id: userData.user.id,
        tenant_slug: tenant.slug,
        guest_alias: alias,
        check_in: form.checkIn,
        check_out: form.checkOut,
        guests: form.guests,
        room_type: form.roomType || "Habitación",
        decoration: form.decoration === "none" ? null : form.decoration,
        contact_phone: form.phone,
        notes: form.name ? `Nombre: ${form.name}` : null,
      });
      if (error) console.warn("reservation insert skipped:", error.message);
    }

    const msg = encodeURIComponent(
      `Hola ${tenant.name}! Quiero hacer una reserva:\n` +
        `• Alias: ${alias}\n` +
        `• Check-in: ${form.checkIn}\n` +
        `• Check-out: ${form.checkOut}\n` +
        `• Huéspedes: ${form.guests}\n` +
        `• Habitación: ${form.roomType}\n` +
        `• Decoración: ${form.decoration}\n` +
        `• Teléfono: ${form.phone}`,
    );
    window.open(`https://wa.me/${tenant.whatsapp}?text=${msg}`, "_blank");
    toast.success(t("booking.success"));
  };

  return (
    <section id="booking" className="relative bg-muted/30 py-24">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="mb-3 text-4xl font-semibold sm:text-5xl">
            <span className="gold-text">{t("booking.title")}</span>
          </h2>
          <p className="text-muted-foreground">{t("booking.subtitle")}</p>
        </motion.div>

        <Card className="border p-8 shadow-[var(--shadow-soft)]">
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="in">{t("booking.checkIn")}</Label>
              <Input
                id="in"
                type="date"
                min={today}
                value={form.checkIn}
                onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="out">{t("booking.checkOut")}</Label>
              <Input
                id="out"
                type="date"
                min={form.checkIn}
                value={form.checkOut}
                onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="g">{t("booking.guests")}</Label>
              <Input
                id="g"
                type="number"
                min={1}
                max={10}
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: parseInt(e.target.value, 10) || 1 })}
                required
              />
            </div>
            <div>
              <Label htmlFor="rt">{t("booking.roomType")}</Label>
              <Select
                value={form.roomType}
                onValueChange={(v) => setForm({ ...form, roomType: v })}
              >
                <SelectTrigger id="rt"><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Suite Presidencial">{t("rooms.types.suite")}</SelectItem>
                  <SelectItem value="Cabaña">{t("rooms.types.cabin")}</SelectItem>
                  <SelectItem value="Habitación">{t("rooms.types.room")}</SelectItem>
                  <SelectItem value="Glamping">{t("rooms.types.tent")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="dec">{t("booking.decoration")}</Label>
              <Select
                value={form.decoration}
                onValueChange={(v) => setForm({ ...form, decoration: v })}
              >
                <SelectTrigger id="dec"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("booking.decorationOptions.none")}</SelectItem>
                  <SelectItem value="birthday">{t("booking.decorationOptions.birthday")}</SelectItem>
                  <SelectItem value="romantic">{t("booking.decorationOptions.romantic")}</SelectItem>
                  <SelectItem value="anniversary">{t("booking.decorationOptions.anniversary")}</SelectItem>
                  <SelectItem value="bachelor">{t("booking.decorationOptions.bachelor")}</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-muted-foreground">{t("booking.decorationHint")}</p>
            </div>
            <div>
              <Label htmlFor="ph">{t("booking.phone")}</Label>
              <Input
                id="ph"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+57 300 123 4567"
                required
                maxLength={20}
              />
            </div>
            <div>
              <Label htmlFor="nm">{t("booking.name")}</Label>
              <Input
                id="nm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={80}
              />
            </div>

            <div className="rounded-xl border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/10 p-3 text-sm sm:col-span-2">
              <span className="text-muted-foreground">{t("booking.alias")}: </span>
              <span className="font-semibold gold-text">{alias}</span>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full sm:col-span-2"
              style={{ backgroundColor: tenant.accent, color: "white" }}
            >
              {t("booking.submit")}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
