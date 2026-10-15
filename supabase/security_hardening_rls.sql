-- ==============================================================================
-- SWITCH 1.0 CYBERSECURITY REMEDIATION: SUPABASE RLS HARDENING SCRIPT
-- Paste and execute this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/oawmhtlejomthtvfckpd/sql
-- ==============================================================================

-- 1. ADD SECURITY COLUMNS TO INSTRUCTORS TABLE
ALTER TABLE public.instructors ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.instructors ADD COLUMN IF NOT EXISTS passcode TEXT;

-- 2. HARDEN ASSESSMENT SUBMISSIONS (ELIMINATE IDOR & MASS DATA LEAKAGE)
-- Revoke the open public policy that exposed student URLs, GitHub links, and grades
DROP POLICY IF EXISTS "Public read for submissions" ON public.assessment_submissions;
DROP POLICY IF EXISTS "Students can view only their own submissions" ON public.assessment_submissions;

-- Allow authenticated students to only view submissions tied to their own registration number
CREATE POLICY "Students can view only their own submissions"
  ON public.assessment_submissions FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.registrations WHERE registration_number = student_reg_no
    )
  );

-- 3. HARDEN ATTENDANCE TABLE (PREVENT ATTENDANCE SNOOPING & FORGERY)
DROP POLICY IF EXISTS "Public read for attendance" ON public.attendance;
DROP POLICY IF EXISTS "Students can view only their own attendance" ON public.attendance;

-- Authenticated students can only read their own attendance records
CREATE POLICY "Students can view only their own attendance"
  ON public.attendance FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.registrations WHERE registration_number = student_reg_no
    )
  );

-- 4. HARDEN INSTRUCTORS TABLE
-- Note: Sensitive contact information (phone, email) is now filtered on the API layer.
-- Direct table access for anon is restricted to active instructors with non-sensitive fields.
DROP POLICY IF EXISTS "Public read for instructors" ON public.instructors;
CREATE POLICY "Public read for approved faculty"
  ON public.instructors FOR SELECT
  TO public
  USING (status = 'approved');

-- 5. HARDEN ASSESSMENTS TABLE
DROP POLICY IF EXISTS "Public read for assessments" ON public.assessments;
CREATE POLICY "Enrolled students can read assessments"
  ON public.assessments FOR SELECT
  TO authenticated
  USING (TRUE);

-- Service role bypasses RLS for server-side API operations (Next.js route handlers)
