-- ==============================================================================
-- SWITCH 1.0: PHASE 2 CLOUD PORTAL SCHEMA (INSTRUCTORS, ATTENDANCE, ASSESSMENTS)
-- Copy and paste this directly into your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/oawmhtlejomthtvfckpd/sql
-- ==============================================================================

-- 1. Instructors Table
CREATE TABLE IF NOT EXISTS public.instructors (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  track_id TEXT REFERENCES public.tracks(id) NOT NULL,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'suspended')),
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read for instructors" ON public.instructors;
CREATE POLICY "Public read for instructors"
  ON public.instructors FOR SELECT
  TO public
  USING (TRUE);

-- 2. Student Attendance Table
CREATE TABLE IF NOT EXISTS public.attendance (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  track_id TEXT REFERENCES public.tracks(id) NOT NULL,
  session_date DATE NOT NULL,
  session_week INTEGER NOT NULL,
  session_title TEXT NOT NULL,
  student_reg_no TEXT NOT NULL,
  student_name TEXT,
  status TEXT NOT NULL CHECK (status IN ('present', 'late', 'absent')),
  marked_by TEXT,
  marked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(track_id, session_date, student_reg_no)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read for attendance" ON public.attendance;
CREATE POLICY "Public read for attendance"
  ON public.attendance FOR SELECT
  TO public
  USING (TRUE);

-- 3. Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  track_id TEXT REFERENCES public.tracks(id) NOT NULL,
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Practical Lab', 'Capstone Project', 'Knowledge Check')),
  description TEXT NOT NULL,
  max_score INTEGER NOT NULL DEFAULT 100,
  due_date TIMESTAMPTZ NOT NULL,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read for assessments" ON public.assessments;
CREATE POLICY "Public read for assessments"
  ON public.assessments FOR SELECT
  TO public
  USING (TRUE);

-- 4. Assessment Submissions Table
CREATE TABLE IF NOT EXISTS public.assessment_submissions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  assessment_id TEXT NOT NULL,
  student_reg_no TEXT NOT NULL,
  student_name TEXT,
  submission_url TEXT NOT NULL,
  notes TEXT,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  feedback TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'needs_revision')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  graded_at TIMESTAMPTZ,
  graded_by TEXT,
  UNIQUE(assessment_id, student_reg_no)
);

ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read for submissions" ON public.assessment_submissions;
CREATE POLICY "Public read for submissions"
  ON public.assessment_submissions FOR SELECT
  TO public
  USING (TRUE);

-- 5. Seed Initial Approved Instructors (if not already present)
INSERT INTO public.instructors (id, full_name, email, phone, track_id, status, bio, experience_years, approved_at) VALUES
('inst-1', 'Engr. Babatunde Alabi', 'babatunde.alabi@switch.ng', '+234 803 123 4567', 'solar-technology', 'approved', 'Lead Renewable Energy Engineer with 11+ years practical field experience deploying hybrid mini-grids and commercial PV systems.', 11, NOW()),
('inst-2', 'Chioma Okonkwo', 'chioma.okonkwo@switch.ng', '+234 802 987 6543', 'web-development', 'approved', 'Senior Fullstack Software Architect specializing in React, Next.js, and cloud microservices.', 8, NOW()),
('inst-3', 'Oluwaseun Adeleke', 'oluwaseun.adeleke@switch.ng', '+234 805 456 7890', 'uiux-design', 'pending', 'Lead UX Researcher & Product Architect, certified Design Sprint facilitator.', 6, NULL),
('inst-4', 'Ibrahim Danladi', 'ibrahim.danladi@switch.ng', '+234 809 333 2211', 'cybersecurity', 'pending', 'Certified Ethical Hacker (CEH) and SOC analyst focused on enterprise defensive posture.', 5, NULL)
ON CONFLICT (email) DO NOTHING;
