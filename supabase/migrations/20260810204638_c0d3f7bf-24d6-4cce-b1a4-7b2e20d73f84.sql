-- Make the masking view the only public read path
ALTER VIEW public.reviews_public SET (security_invoker = off);
ALTER VIEW public.reviews_public OWNER TO postgres;

DROP POLICY IF EXISTS "Public can read approved reviews" ON public.reviews;

REVOKE ALL ON public.reviews FROM anon;

GRANT SELECT ON public.reviews_public TO anon, authenticated;