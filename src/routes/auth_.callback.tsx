import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth_/callback")({
  head: () => ({
    meta: [
      { title: "Conectando cuenta · Moteles Villavicencio" },
      { name: "description", content: "Finalizando el inicio de sesión seguro." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let done = false;
    const go = (path: string) => {
      if (done) return;
      done = true;
      navigate({ to: path });
    };
    const dest = (() => {
      try {
        const d = sessionStorage.getItem("post_auth_dest");
        sessionStorage.removeItem("post_auth_dest");
        return d && d.startsWith("/") && !d.startsWith("//") ? d : "/dashboard";
      } catch {
        return "/dashboard";
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) go(dest);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) go(dest);
    });

    const timer = setTimeout(() => {
      if (!done) go("/auth?next=" + encodeURIComponent(dest));
    }, 6000);

    return () => {
      clearTimeout(timer);
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-[var(--gold)]" />
        <p className="text-sm text-muted-foreground">Finalizando inicio de sesión…</p>
      </div>
    </div>
  );
}
