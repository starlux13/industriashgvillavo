-- Revoke public execute from SECURITY DEFINER helpers; keep them callable where needed
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Tighten the reservations insert policy
DROP POLICY IF EXISTS "Anyone can request a reservation" ON public.reservations;
CREATE POLICY "Anyone can request a reservation" ON public.reservations
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    check_in >= CURRENT_DATE
    AND check_out > check_in
    AND guests > 0
    AND length(guest_alias) > 0
    AND length(room_type) > 0
    AND (user_id IS NULL OR auth.uid() = user_id)
  );