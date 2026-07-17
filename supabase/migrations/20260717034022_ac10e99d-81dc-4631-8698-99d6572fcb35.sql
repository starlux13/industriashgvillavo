GRANT SELECT ON public.reviews TO anon, authenticated;
DROP POLICY IF EXISTS "Public can read approved reviews" ON public.reviews;
CREATE POLICY "Public can read approved reviews" ON public.reviews
  FOR SELECT
  TO anon, authenticated
  USING (approved = true);