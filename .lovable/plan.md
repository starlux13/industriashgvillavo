# Plan: Blindaje, pagos y notificaciones multi-canal

## Contexto
El escaneo de seguridad detectó exactamente **3 hallazgos** (warn) que aparecieron al intentar publicar. Ya arreglé el crash blanco por `i18n.language` undefined en SSR. Este plan cierra los 3 hallazgos, endurece la app, agrega pagos con máxima flexibilidad y notificaciones triples (email + WhatsApp + SMS) con deslinde legal.

---

## Fase A — Los 3 hallazgos de seguridad + crash SSR

**Ya hecho este turno:** `i18n.language` blindado + `lng:"es"` fijo → app deja de romperse en SSR.

**Migración SQL:**
1. `REVOKE EXECUTE ON FUNCTION public.has_role FROM PUBLIC, anon, authenticated` + `GRANT EXECUTE ... TO service_role` (la función se sigue usando en policies vía `SECURITY DEFINER`, no necesita ser callable por usuarios).
2. **Reservations:** quitar `anon` del INSERT, restringir a `authenticated` con validación estricta (fechas coherentes, ≤6 huéspedes, teléfono formato E.164, `guest_alias` ≤120 chars, `notes` ≤1000, rate limit vía trigger que cuenta reservas de las últimas 24h por `user_id` y bloquea >10).
3. **Reviews:** políticas `UPDATE` / `DELETE` scoped a `auth.uid() = user_id` para que el autor gestione lo suyo.

Marcar los 3 findings como `mark_as_fixed`.

---

## Fase B — Endurecimiento de plataforma

- **Auth:** habilitar HIBP (leaked password check), configurar Google OAuth (proveedor social), `min_password_length=10`.
- **Headers de seguridad** en el server entry: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restrictiva, y **CSP** con nonce (evita XSS incluso ante inputs mal escapados).
- **Zod** en cada server function y ruta pública (validación estricta de todo input).
- **Rate limiting** por IP en endpoints públicos (reservas, contacto, webhooks) usando tabla `rate_limits` en la DB.
- **CSRF/Origin check** en rutas de estado (`/api/public/*`) validando `Origin` header.
- **RLS revisada:** confirmar que ninguna tabla tiene grant `anon` innecesario, `search_path` fijo en todas las funciones SECURITY DEFINER.
- **HTTPS/candado:** Lovable ya sirve todo por TLS con certificados válidos → el candado aparecerá cerrado solo con no cargar recursos http mixtos (verifico que todas las imágenes/fuentes vayan por https).

---

## Fase C — Pagos "máxima flexibilidad"

Enfoque recomendado tras investigar Colombia + reservas de motel:

**C1. Habilito Stripe integrado de Lovable** (`enable_stripe_payments`) — checkout con tarjeta nacional + internacional, tax opcional, Stripe funge como merchant of record cuando aplica. Sin cuenta previa del dueño para arrancar.

**C2. Modalidad transferencia manual** (Bancolombia / Nequi / Daviplata):
- Panel en admin donde el dueño configura número de cuenta, titular, tipo, banco por sede.
- En checkout el huésped elige: **Pagar con tarjeta** (Stripe) o **Transferir** (muestra datos + subida de comprobante a Supabase Storage).
- Estado de reserva: `pending_payment` → `paid` (auto al confirmar Stripe webhook, o manual al validar comprobante).

**C3. Notificaciones triples al confirmarse el pago:**
- **Email** al cliente + al correo de la empresa (Lovable Emails — cero config, incluye plantilla con logo del tenant, alias del huésped, fechas, monto, decoración, comprobante).
- **WhatsApp** a ambos (via API de WhatsApp Cloud si el dueño da número + token, o fallback a `wa.me` con link).
- **SMS** a ambos (requiere conector Twilio o similar — costo por SMS; queda listo el código y solo pide credenciales cuando el dueño las tenga).

**C4. Deslinde legal en Términos y Condiciones:**
Sección específica redactada con lenguaje jurídico apropiado para Colombia (Ley 527 de 1999 comercio electrónico, Ley 1581 protección de datos, Estatuto del Consumidor):
- Los desarrolladores actúan como **medio tecnológico de acceso**, no como intermediarios financieros.
- La responsabilidad por movimientos bancarios recae en las entidades emisoras y receptoras.
- El comprobante enviado al cliente + empresa constituye evidencia probatoria.
- Cláusula de "fuerza mayor bancaria" para transferencias en limbo entre entidades.
- Política de reembolsos, cancelaciones (con antelación) y no-show.
- Consentimiento expreso de tratamiento de datos + hábeas data.
- Aceptación registrada con timestamp + IP + user-agent en tabla `terms_acceptances`.

---

## Fase D — Rediseño visual "gobierno ultrasecreto"

- Paleta más profunda: negro-obsidiana con acentos por tenant (rojo sangre PUNTO G / verde bosque LOMA VERDE / dorado quemado PALO ALTO).
- Tipografía: **Cinzel** (display, tipo condecoración/sello oficial) + **Space Grotesk** (UI) + **JetBrains Mono** (metadatos/códigos de reserva → look "clasificado").
- Efectos: grano fílmico sutil, viñeteado, HUD overlays con líneas cruz/coordenadas, marcas de agua tipo "CONFIDENCIAL", scanlines en hover de cards, transiciones con `mask-image` reveal.
- Framer Motion: scroll-linked parallax multi-capa (4 profundidades), animación de "descifrado" en textos hero (chars mezclan símbolos y se resuelven), cards con `perspective` real (rotateX/Y en mouse move).
- Loader tipo "acceso autorizado" con progreso hex + coordenadas GPS falsas.
- URL/breadcrumb estilo terminal en el navbar (`> punto-g:~$ /habitaciones`).

---

## Detalles técnicos

**Migración SQL fase A:**
```sql
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;

DROP POLICY IF EXISTS "Anyone can create reservation" ON public.reservations;
CREATE POLICY "Auth users create own reservation" ON public.reservations
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND check_in > now()
    AND check_out > check_in
    AND check_out < check_in + interval '30 days'
    AND guests BETWEEN 1 AND 6
    AND length(coalesce(notes,'')) <= 1000
    AND length(coalesce(guest_alias,'')) <= 120
    AND contact_phone ~ '^\+?[0-9]{7,15}$'
  );

CREATE POLICY "Users update own review" ON public.reviews
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own review" ON public.reviews
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- rate limit reservas
CREATE OR REPLACE FUNCTION public.enforce_reservation_rate_limit() ...
```

**Nuevas tablas:** `payments`, `payment_methods_config` (por tenant), `terms_acceptances`, `rate_limits`, `audit_log`.

**Server functions:** `createCheckoutSession`, `handleStripeWebhook` (ruta `/api/public/webhooks/stripe`), `uploadTransferProof`, `sendReservationNotifications`.

**Riesgos:** SMS requiere credenciales Twilio del dueño; WhatsApp Business API igual. Sin ellos queda con fallback (`mailto:` + `wa.me` link). Stripe se puede activar sin cuenta previa; para live payments el dueño hará KYC luego.

---

## Orden de ejecución (turnos)

1. **Este turno:** Migración fase A + marcar findings + endurecimiento SQL/headers/HIBP + Google OAuth.
2. **Siguiente turno:** Habilitar Stripe + tabla payments + checkout dual (tarjeta/transferencia) + subida de comprobante + T&C completos.
3. **Turno 3:** Notificaciones (email siempre, WhatsApp/SMS con fallback) + admin config bancaria por tenant.
4. **Turno 4:** Rediseño visual completo estilo "clasificado" + microinteracciones + loader temático.

¿Arranco con la fase A ahora?