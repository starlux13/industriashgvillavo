-- 1. App roles enum
CREATE TYPE public.app_role AS ENUM ('developer', 'admin', 'employee', 'user');

-- 2. Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  document_id TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- 3. User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 4. has_role security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Additional policies using has_role
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'developer'));
CREATE POLICY "Admins read all profiles" ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'developer'));

-- 5. Auto-create profile + assign default 'user' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, document_id)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'document_id'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Reservations
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tenant_slug TEXT NOT NULL,
  guest_alias TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 2,
  room_type TEXT NOT NULL,
  decoration TEXT,
  contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reservations TO authenticated;
GRANT INSERT ON public.reservations TO anon;
GRANT ALL ON public.reservations TO service_role;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can request a reservation" ON public.reservations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users see own reservations" ON public.reservations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Staff see all reservations" ON public.reservations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'developer') OR public.has_role(auth.uid(), 'employee'));
CREATE POLICY "Staff update reservations" ON public.reservations FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'developer') OR public.has_role(auth.uid(), 'employee'));

-- 7. Access requests (people asking for panel access)
CREATE TABLE public.access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_role app_role NOT NULL DEFAULT 'employee',
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.access_requests TO authenticated;
GRANT ALL ON public.access_requests TO service_role;
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users create own request" ON public.access_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users see own request" ON public.access_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage requests" ON public.access_requests FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'developer'));

-- 8. Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tenant_slug TEXT NOT NULL,
  display_name TEXT NOT NULL,
  location TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT INSERT ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads approved reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (approved = true);
CREATE POLICY "Users create own reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Staff moderate reviews" ON public.reviews FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'developer') OR public.has_role(auth.uid(), 'employee'));

-- 9. Site content (editable by developer)
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_slug TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_slug, key)
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads site content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Developers edit site content" ON public.site_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'developer'));