-- ==============================================================================
-- SWITCH 1.0 YOUTH EMPOWERMENT PLATFORM: SUPABASE POSTGRESQL SCHEMA
-- Includes Row Level Security (RLS) & Cyber Threat Defense Policies
-- ==============================================================================

-- 1. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  age_bracket TEXT NOT NULL CHECK (age_bracket IN ('15-20', '21-25', '26-30', '31-35', '36-40')),
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Prefer not to say')),
  state_of_residence TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Tracks Table
CREATE TABLE IF NOT EXISTS public.tracks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Tech', 'Vocational')),
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_weeks INTEGER NOT NULL,
  skills TEXT[] NOT NULL,
  tools_covered TEXT[] NOT NULL,
  career_roles TEXT[] NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anyone can view tracks
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for tracks"
  ON public.tracks FOR SELECT
  TO public
  USING (is_active = TRUE);

-- 3. Registrations Table
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  track_id TEXT REFERENCES public.tracks(id) NOT NULL,
  learning_mode TEXT NOT NULL CHECK (learning_mode IN ('Online / Virtual', 'Physical Center / Hybrid')),
  status TEXT DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'confirmed', 'waitlisted', 'completed')),
  registration_number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own registration"
  ON public.registrations FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE,
  paystack_reference TEXT UNIQUE NOT NULL,
  amount_kobo BIGINT NOT NULL DEFAULT 500000, -- ₦5,000 NGN Token Fee
  currency TEXT DEFAULT 'NGN',
  status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed')),
  channel TEXT,
  paid_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own payment receipts"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON public.registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_reg_no ON public.registrations(registration_number);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON public.payments(paystack_reference);
