import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, LogOut, Shield } from "lucide-react";
import { TENANT_LIST } from "@/lib/tenants";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Panel · Moteles Villavicencio" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

interface Reservation {
  id: string;
  tenant_slug: string;
  guest_alias: string;
  check_in: string;
  check_out: string;
  guests: number;
  room_type: string;
  status: string;
  contact_phone: string | null;
  created_at: string;
}

function Dashboard() {
  const { user, roles, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tab, setTab] = useState<string>("all");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { next: "" } });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("reservations")
      .select("id, tenant_slug, guest_alias, check_in, check_out, guests, room_type, status, contact_phone, created_at")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => setReservations((data ?? []) as Reservation[]));
  }, [user, roles]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-sm text-muted-foreground">Cargando…</div>
      </div>
    );
  }

  const filtered = tab === "all" ? reservations : reservations.filter((r) => r.tenant_slug === tab);
  const primaryRole = roles[0] ?? "user";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Inicio
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-lg font-semibold">Panel de administración</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1"><Shield className="h-3 w-3" /> {primaryRole}</Badge>
            <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="mr-1 h-4 w-4" /> Salir</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {TENANT_LIST.map((t) => {
            const count = reservations.filter((r) => r.tenant_slug === t.slug).length;
            return (
              <Card key={t.slug} className="p-6">
                <div className="flex items-center gap-3">
                  <img src={t.logoUrl} alt={t.name} className="h-12 w-auto" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t.name}</p>
                    <p className="text-2xl font-bold gold-text">{count}</p>
                    <p className="text-xs text-muted-foreground">reservas</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h2 className="mr-auto text-lg font-semibold">Reservas recientes</h2>
            <Button size="sm" variant={tab === "all" ? "default" : "outline"} onClick={() => setTab("all")}>Todas</Button>
            {TENANT_LIST.map((t) => (
              <Button key={t.slug} size="sm" variant={tab === t.slug ? "default" : "outline"} onClick={() => setTab(t.slug)}>
                {t.name}
              </Button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alias</TableHead>
                  <TableHead>Sitio</TableHead>
                  <TableHead>Habitación</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Huéspedes</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                      No hay reservas aún.
                    </TableCell>
                  </TableRow>
                ) : filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.guest_alias}</TableCell>
                    <TableCell>{r.tenant_slug}</TableCell>
                    <TableCell>{r.room_type}</TableCell>
                    <TableCell>{r.check_in}</TableCell>
                    <TableCell>{r.check_out}</TableCell>
                    <TableCell>{r.guests}</TableCell>
                    <TableCell className="text-xs">{r.contact_phone}</TableCell>
                    <TableCell><Badge variant="outline">{r.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
}
