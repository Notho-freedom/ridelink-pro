
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.user_type AS ENUM ('driver', 'passenger', 'both');
CREATE TYPE public.trip_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE public.payment_method AS ENUM ('online', 'cash', 'both');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'refunded');
CREATE TYPE public.request_status AS ENUM ('open', 'matched', 'cancelled', 'expired');
CREATE TYPE public.notification_type AS ENUM ('match', 'booking', 'message', 'request', 'payment', 'system');

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  role user_type NOT NULL DEFAULT 'both',
  country TEXT,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- User roles (for admin system)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Trips (planned rides)
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_city TEXT NOT NULL,
  from_address TEXT,
  from_lat DOUBLE PRECISION,
  from_lng DOUBLE PRECISION,
  to_city TEXT NOT NULL,
  to_address TEXT,
  to_lat DOUBLE PRECISION,
  to_lng DOUBLE PRECISION,
  date DATE NOT NULL,
  departure_time TIME NOT NULL,
  seats_available INTEGER NOT NULL DEFAULT 3,
  price_per_seat NUMERIC(10,2) NOT NULL DEFAULT 0,
  vehicle TEXT,
  status trip_status NOT NULL DEFAULT 'active',
  accepted_payment payment_method NOT NULL DEFAULT 'both',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trips are viewable by everyone" ON public.trips FOR SELECT USING (true);
CREATE POLICY "Drivers can create trips" ON public.trips FOR INSERT WITH CHECK (auth.uid() = driver_id);
CREATE POLICY "Drivers can update own trips" ON public.trips FOR UPDATE USING (auth.uid() = driver_id);
CREATE POLICY "Drivers can delete own trips" ON public.trips FOR DELETE USING (auth.uid() = driver_id);
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_trips_date ON public.trips (date);
CREATE INDEX idx_trips_driver ON public.trips (driver_id);

-- Availabilities (driver available mode)
CREATE TABLE public.availabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  radius_km INTEGER NOT NULL DEFAULT 50,
  date DATE NOT NULL,
  time_from TIME NOT NULL,
  time_to TIME NOT NULL,
  seats INTEGER NOT NULL DEFAULT 4,
  vehicle TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.availabilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Availabilities are viewable by everyone" ON public.availabilities FOR SELECT USING (true);
CREATE POLICY "Drivers can create availabilities" ON public.availabilities FOR INSERT WITH CHECK (auth.uid() = driver_id);
CREATE POLICY "Drivers can update own availabilities" ON public.availabilities FOR UPDATE USING (auth.uid() = driver_id);
CREATE POLICY "Drivers can delete own availabilities" ON public.availabilities FOR DELETE USING (auth.uid() = driver_id);
CREATE TRIGGER update_availabilities_updated_at BEFORE UPDATE ON public.availabilities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Ride requests (open passenger requests)
CREATE TABLE public.ride_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passenger_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_city TEXT NOT NULL,
  from_lat DOUBLE PRECISION,
  from_lng DOUBLE PRECISION,
  to_city TEXT NOT NULL,
  to_lat DOUBLE PRECISION,
  to_lng DOUBLE PRECISION,
  date DATE NOT NULL,
  time TIME,
  seats_needed INTEGER NOT NULL DEFAULT 1,
  status request_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ride_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Requests are viewable by everyone" ON public.ride_requests FOR SELECT USING (true);
CREATE POLICY "Passengers can create requests" ON public.ride_requests FOR INSERT WITH CHECK (auth.uid() = passenger_id);
CREATE POLICY "Passengers can update own requests" ON public.ride_requests FOR UPDATE USING (auth.uid() = passenger_id);
CREATE POLICY "Passengers can delete own requests" ON public.ride_requests FOR DELETE USING (auth.uid() = passenger_id);
CREATE TRIGGER update_ride_requests_updated_at BEFORE UPDATE ON public.ride_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  availability_id UUID REFERENCES public.availabilities(id) ON DELETE SET NULL,
  passenger_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seats_booked INTEGER NOT NULL DEFAULT 1,
  payment_method payment_method NOT NULL DEFAULT 'cash',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status booking_status NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = passenger_id OR auth.uid() = driver_id);
CREATE POLICY "Passengers can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = passenger_id);
CREATE POLICY "Involved users can update bookings" ON public.bookings FOR UPDATE USING (auth.uid() = passenger_id OR auth.uid() = driver_id);
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages of own bookings" ON public.messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND (passenger_id = auth.uid() OR driver_id = auth.uid())));
CREATE POLICY "Users can send messages in own bookings" ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND (passenger_id = auth.uid() OR driver_id = auth.uid())));
CREATE POLICY "Users can mark messages as read" ON public.messages FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND (passenger_id = auth.uid() OR driver_id = auth.uid())));
CREATE INDEX idx_messages_booking ON public.messages (booking_id, created_at);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type notification_type NOT NULL DEFAULT 'system',
  data JSONB DEFAULT '{}',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE INDEX idx_notifications_user ON public.notifications (user_id, read, created_at DESC);

-- Push subscriptions
CREATE TABLE public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own push subs" ON public.push_subscriptions FOR ALL USING (auth.uid() = user_id);

-- Enable Realtime for messages and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
