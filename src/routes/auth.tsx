import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" && s.next.startsWith("/") && !s.next.startsWith("//") ? s.next : "",
  }),
  head: () => ({
    meta: [
      { title: "Iniciar sesión · Moteles Villavicencio" },
      { name: "description", content: "Accede al panel de administración." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Auth,
});

const emailSchema = z.string().trim().email().max(255);
const passwordSchema = z.string().min(8).max(72);

function Auth() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const dest = next || "/dashboard";
  const [loading, setLoading] = useState(false);
  const [signIn, setSignIn] = useState({ email: "", password: "" });
  const [signUp, setSignUp] = useState({ email: "", password: "", name: "", phone: "" });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSchema.safeParse(signIn.email).success || !passwordSchema.safeParse(signIn.password).success) {
      toast.error("Datos inválidos"); return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(signIn);
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("¡Bienvenido!"); navigate({ to: dest }); }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSchema.safeParse(signUp.email).success || !passwordSchema.safeParse(signUp.password).success) {
      toast.error("Email o contraseña inválida (mín 8 caracteres)"); return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: signUp.email,
      password: signUp.password,
      options: {
        emailRedirectTo: `${window.location.origin}${dest}`,
        data: { full_name: signUp.name, phone: signUp.phone },
      },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Cuenta creada. Revisa tu correo si es necesario.");
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      try {
        sessionStorage.setItem("post_auth_dest", dest);
      } catch { /* storage bloqueado */ }
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/auth/callback`,
      });
      if ("error" in result && result.error) {
        toast.error(result.error.message ?? "No se pudo iniciar con Google");
        return;
      }
      if ("redirected" in result && result.redirected) return;
      // Popup flow: la sesión ya quedó establecida por el helper.
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        toast.success("¡Bienvenido!");
        navigate({ to: dest });
      } else {
        toast.error("No se completó el inicio con Google");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error con Google");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--gold)_15%,transparent),transparent_60%)]" />
      <Link to="/" className="absolute left-6 top-6 z-10 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver
      </Link>
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Card className="border p-8 shadow-[var(--shadow-soft)]">
            <h1 className="mb-2 text-center text-3xl font-semibold">
              <span className="gold-text">{t("brand")}</span>
            </h1>
            <p className="mb-6 text-center text-sm text-muted-foreground">Panel de administración</p>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">{t("auth.signIn")}</TabsTrigger>
                <TabsTrigger value="signup">{t("auth.signUp")}</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-6 space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label>{t("auth.email")}</Label>
                    <Input type="email" required value={signIn.email} onChange={(e) => setSignIn({ ...signIn, email: e.target.value })} />
                  </div>
                  <div>
                    <Label>{t("auth.password")}</Label>
                    <Input type="password" required value={signIn.password} onChange={(e) => setSignIn({ ...signIn, password: e.target.value })} />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">{t("auth.signIn")}</Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-6 space-y-4">
                <form onSubmit={handleSignUp} className="space-y-3">
                  <div>
                    <Label>{t("auth.fullName")}</Label>
                    <Input required maxLength={80} value={signUp.name} onChange={(e) => setSignUp({ ...signUp, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>{t("auth.phone")}</Label>
                    <Input type="tel" maxLength={20} value={signUp.phone} onChange={(e) => setSignUp({ ...signUp, phone: e.target.value })} />
                  </div>
                  <div>
                    <Label>{t("auth.email")}</Label>
                    <Input type="email" required value={signUp.email} onChange={(e) => setSignUp({ ...signUp, email: e.target.value })} />
                  </div>
                  <div>
                    <Label>{t("auth.password")}</Label>
                    <Input type="password" required value={signUp.password} onChange={(e) => setSignUp({ ...signUp, password: e.target.value })} />
                    <p className="mt-1 text-xs text-muted-foreground">{t("auth.passwordHint")}</p>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">{t("auth.signUp")}</Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">o</span>
              </div>
            </div>
            <Button variant="outline" onClick={handleGoogle} className="w-full">{t("auth.google")}</Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
