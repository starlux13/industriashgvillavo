-- 1. Restrict has_role EXECUTE
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;

-- 2. Reservations: authenticated-only with strict validation
DROP POLICY IF EXISTS "Anyone can request a reservation" ON public.reservations;

CREATE POLICY "Authenticated users create own reservation"
ON public.reservations
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND check_in >= CURRENT_DATE
  AND check_out > check_in
  AND check_out < check_in + interval '30 days'
  AND guests BETWEEN 1 AND 6
  AND length(coalesce(guest_alias,'')) BETWEEN 1 AND 120
  AND length(coalesce(room_type,'')) BETWEEN 1 AND 60
  AND length(coalesce(notes,'')) <= 1000
  AND (contact_phone IS NULL OR contact_phone ~ '^\+?[0-9]{7,15}$')
);

-- Rate limit: max 10 reservations per user per 24h
CREATE OR REPLACE FUNCTION public.enforce_reservation_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count int;
BEGIN
  SELECT count(*) INTO recent_count
  FROM public.reservations
  WHERE user_id = NEW.user_id
    AND created_at > now() - interval '24 hours';
  IF recent_count >= 10 THEN
    RAISE EXCEPTION 'Rate limit exceeded: max 10 reservations per 24h';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.enforce_reservation_rate_limit() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS reservations_rate_limit ON public.reservations;
CREATE TRIGGER reservations_rate_limit
  BEFORE INSERT ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.enforce_reservation_rate_limit();

-- 3. Reviews: users manage their own
CREATE POLICY "Users update own review"
ON public.reviews
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own review"
ON public.reviews
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);