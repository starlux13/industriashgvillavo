-- Drop public SELECT policy on base table
DROP POLICY IF EXISTS "Anyone reads approved reviews" ON public.reviews;

-- Author can read own reviews (even unapproved)
CREATE POLICY "Users read own reviews"
ON public.reviews
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Public sanitized view: mask display_name to "First L.", drop location entirely
CREATE OR REPLACE VIEW public.reviews_public
WITH (security_invoker = on) AS
SELECT
  id,
  tenant_slug,
  rating,
  comment,
  created_at,
  CASE
    WHEN display_name ~ '^[^ ]+ .+' THEN
      split_part(display_name, ' ', 1) || ' ' || upper(left(split_part(display_name, ' ', 2), 1)) || '.'
    ELSE
      left(display_name, 1) || '.'
  END AS display_name
FROM public.reviews
WHERE approved = true;

GRANT SELECT ON public.reviews_public TO anon, authenticated;