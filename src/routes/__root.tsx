import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import "@/lib/i18n";
import { AuthProvider } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PrivacyModal } from "@/components/PrivacyModal";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Página no encontrada.</p>
        <Link to="/" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Volver al inicio</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Algo salió mal</h1>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >Reintentar</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Moteles Villavicencio · Elige tu experiencia" },
      { name: "description", content: "Punto G, Loma Verde y Palo Alto Glamping. Tres refugios exclusivos en Villavicencio para vivir momentos inolvidables." },
      { property: "og:title", content: "Moteles Villavicencio · Elige tu experiencia" },
      { property: "og:description", content: "Punto G, Loma Verde y Palo Alto Glamping. Tres refugios exclusivos en Villavicencio para vivir momentos inolvidables." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Moteles Villavicencio · Elige tu experiencia" },
      { name: "twitter:description", content: "Punto G, Loma Verde y Palo Alto Glamping. Tres refugios exclusivos en Villavicencio para vivir momentos inolvidables." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c7ab3477-ea13-47c8-8719-4327859c5a3f/id-preview-5f86b07f--3beaf976-78e3-47c4-8cf4-9b2b7ca6cd62.lovable.app-1783825844426.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c7ab3477-ea13-47c8-8719-4327859c5a3f/id-preview-5f86b07f--3beaf976-78e3-47c4-8cf4-9b2b7ca6cd62.lovable.app-1783825844426.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("motels.loaded.v1")) {
      setLoaded(true);
    }
  }, []);

  const handleDone = () => {
    sessionStorage.setItem("motels.loaded.v1", "1");
    setLoaded(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AuthProvider>
          {!loaded && <LoadingScreen onDone={handleDone} />}
          <PrivacyModal />
          <Outlet />
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
