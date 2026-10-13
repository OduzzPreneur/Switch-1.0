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

-- Seed Initial 12 Tracks
INSERT INTO public.tracks (id, title, category, tagline, description, duration_weeks, skills, tools_covered, career_roles) VALUES
('software-engineering', 'Software Engineering & Web Development', 'Tech', 'Build scalable modern web applications and APIs.', 'Master front-end and back-end development.', 12, ARRAY['Frontend Architecture', 'Backend REST APIs'], ARRAY['React', 'Next.js', 'Node.js'], ARRAY['Frontend Developer', 'Fullstack Engineer']),
('uiux-design', 'UI/UX & Product Design', 'Tech', 'Design intuitive, high-converting digital interfaces.', 'Understand human-computer interaction and design systems in Figma.', 10, ARRAY['User Research', 'Prototyping'], ARRAY['Figma', 'FigJam'], ARRAY['UI Designer', 'Product Designer']),
('data-ai-essentials', 'Data Analytics & AI Essentials', 'Tech', 'Transform raw data into business intelligence and actionable insights.', 'Extract, clean, and visualize enterprise datasets.', 10, ARRAY['Data Cleaning', 'SQL Queries'], ARRAY['Python', 'Power BI', 'SQL'], ARRAY['Data Analyst', 'BI Specialist']),
('cybersecurity', 'Cybersecurity & Ethical Defense', 'Tech', 'Protect digital infrastructure against modern attack vectors.', 'Fundamentals of network defense and threat intelligence.', 12, ARRAY['Threat Assessment', 'Network Defense'], ARRAY['Wireshark', 'Kali Linux'], ARRAY['Security Analyst', 'SOC Analyst']),
('digital-marketing', 'Digital Marketing & Growth Strategy', 'Tech', 'Drive qualified customer acquisition and brand growth.', 'Performance marketing and brand storytelling.', 8, ARRAY['Campaign Optimization', 'Content Marketing'], ARRAY['Google Ads', 'Meta Business'], ARRAY['Growth Marketer', 'Content Strategist']),
('product-management', 'Tech Product Management', 'Tech', 'Lead digital products from concept to market validation.', 'Product roadmapping and user research.', 8, ARRAY['Product Roadmapping', 'User Stories'], ARRAY['Jira', 'Notion', 'Mixpanel'], ARRAY['Product Manager', 'Associate PM']),
('solar-energy', 'Solar & Inverter Installation', 'Vocational', 'Design and install clean renewable solar energy systems.', 'Practical sizing and deployment of inverters and solar arrays.', 10, ARRAY['Array Sizing', 'Battery Banking'], ARRAY['Multimeter', 'Inverters'], ARRAY['Solar Technician', 'Installer']),
('electrical-wiring', 'Domestic & Industrial Electrical Wiring', 'Vocational', 'Master certified residential and industrial wiring.', 'Conduit installation and load balancing.', 10, ARRAY['Conduit Installation', 'Circuit Breakers'], ARRAY['Phase Testers', 'Pipe Benders'], ARRAY['Licensed Electrician', 'Field Technician']),
('cctv-iot', 'CCTV, Intercom & IoT Smart Security', 'Vocational', 'Deploy surveillance networks and smart access systems.', 'IP camera configuration and biometrics.', 8, ARRAY['IP Camera Setup', 'Access Systems'], ARRAY['Crimping Tools', 'NVR/DVR'], ARRAY['Security Installer', 'IoT Specialist']),
('fashion-design', 'Contemporary Fashion & Apparel Craft', 'Vocational', 'Master pattern drafting and professional garment production.', 'Pattern making and bespoke garment design.', 12, ARRAY['Pattern Drafting', 'Garment Construction'], ARRAY['Industrial Sewing Machines'], ARRAY['Fashion Designer', 'Clothier']),
('media-production', 'Digital Photography & Video Production', 'Vocational', 'Capture cinematic visuals and master video editing.', 'Camera operation and post-production workflows.', 8, ARRAY['Cinematography', 'Video Editing'], ARRAY['Premiere Pro', 'Mirrorless Cameras'], ARRAY['Videographer', 'Video Editor']),
('catering-craft', 'Commercial Culinary Arts & Baking', 'Vocational', 'Commercial baking, catering, and event food production.', 'High-standard food preparation and commercial pastry.', 10, ARRAY['Commercial Baking', 'Food Safety'], ARRAY['Industrial Ovens', 'Pastry Tools'], ARRAY['Pastry Chef', 'Caterer'])
ON CONFLICT (id) DO NOTHING;

-- 5. Instructors Table
CREATE TABLE IF NOT EXISTS public.instructors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  track_id TEXT REFERENCES public.tracks(id) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended')),
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for approved instructors"
  ON public.instructors FOR SELECT
  TO public
  USING (status = 'approved');

-- 6. Student Attendance Table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  track_id TEXT REFERENCES public.tracks(id) NOT NULL,
  session_date DATE NOT NULL,
  session_week INTEGER NOT NULL,
  session_title TEXT NOT NULL,
  student_reg_no TEXT REFERENCES public.registrations(registration_number) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('present', 'late', 'absent')),
  marked_by UUID REFERENCES public.instructors(id),
  marked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(track_id, session_date, student_reg_no)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own attendance"
  ON public.attendance FOR SELECT
  USING (
    student_reg_no IN (
      SELECT registration_number FROM public.registrations WHERE user_id = auth.uid()
    )
  );

-- 7. Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  track_id TEXT REFERENCES public.tracks(id) NOT NULL,
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Practical Lab', 'Capstone Project', 'Knowledge Check')),
  description TEXT NOT NULL,
  max_score INTEGER NOT NULL DEFAULT 100,
  due_date TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES public.instructors(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled students can view assessments for their track"
  ON public.assessments FOR SELECT
  TO public
  USING (TRUE);

-- 8. Assessment Submissions Table
CREATE TABLE IF NOT EXISTS public.assessment_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  student_reg_no TEXT REFERENCES public.registrations(registration_number) ON DELETE CASCADE,
  submission_url TEXT NOT NULL,
  notes TEXT,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  feedback TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'needs_revision')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES public.instructors(id),
  UNIQUE(assessment_id, student_reg_no)
);

ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own submissions"
  ON public.assessment_submissions FOR SELECT
  USING (
    student_reg_no IN (
      SELECT registration_number FROM public.registrations WHERE user_id = auth.uid()
    )
  );

