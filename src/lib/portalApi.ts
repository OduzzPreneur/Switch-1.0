// ==============================================================================
// SWITCH 1.0 PORTAL LIVE DATA API CLIENT
// Connects to live Supabase API endpoints with automatic local storage fallback
// ==============================================================================

import {
  getAttendanceRecords,
  saveAttendanceRecords,
  getAssessments as getLocalAssessments,
  getSubmissions as getLocalSubmissions,
  getInstructors as getLocalInstructors,
  saveInstructors,
  addInstructor,
  approveInstructor,
  suspendInstructor,
  AttendanceRecord,
  Assessment,
  AssessmentSubmission,
  Instructor,
} from '@/lib/portalState';

// 1. ATTENDANCE API
export async function syncFetchAttendance(trackId?: string, regNo?: string): Promise<AttendanceRecord[]> {
  try {
    const params = new URLSearchParams();
    if (trackId) params.append('trackId', trackId);
    if (regNo) params.append('regNo', regNo);

    const res = await fetch(`/api/portal/attendance?${params.toString()}`);
    const data = await res.json();

    if (data.success && data.records && !data.fallback) {
      // Map Supabase snake_case to app camelCase
      const mapped: AttendanceRecord[] = data.records.map((r: any) => ({
        id: r.id,
        trackId: r.track_id,
        sessionDate: r.session_date,
        sessionWeek: r.session_week,
        sessionTitle: r.session_title,
        studentRegNo: r.student_reg_no,
        studentName: r.student_name || 'Enrolled Student',
        status: r.status,
        markedByInstructorId: r.marked_by || 'inst-1',
        markedAt: r.marked_at,
      }));
      saveAttendanceRecords(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Live attendance sync notice, using local cache:', err);
  }

  return getAttendanceRecords();
}

export async function syncMarkAttendance(
  trackId: string,
  sessionDate: string,
  sessionWeek: number,
  sessionTitle: string,
  instructorId: string,
  entries: { studentRegNo: string; studentName: string; status: 'present' | 'late' | 'absent' }[]
): Promise<AttendanceRecord[]> {
  // Always update local cache immediately for instantaneous UI feedback
  const current = getAttendanceRecords();
  const existingFiltered = current.filter(
    (r) => !(r.trackId === trackId && r.sessionDate === sessionDate)
  );

  const newRecords: AttendanceRecord[] = entries.map((entry) => ({
    id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    trackId,
    sessionDate,
    sessionWeek,
    sessionTitle,
    studentRegNo: entry.studentRegNo,
    studentName: entry.studentName,
    status: entry.status,
    markedByInstructorId: instructorId,
    markedAt: new Date().toISOString(),
  }));

  const updatedLocal = [...newRecords, ...existingFiltered];
  saveAttendanceRecords(updatedLocal);

  // Sync to live Supabase backend
  try {
    await fetch('/api/portal/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trackId,
        sessionDate,
        sessionWeek,
        sessionTitle,
        instructorId,
        entries,
      }),
    });
  } catch (err) {
    console.warn('Live attendance upload notice:', err);
  }

  return updatedLocal;
}

// 2. ASSESSMENTS API
export async function syncFetchAssessments(trackId?: string): Promise<Assessment[]> {
  try {
    const params = trackId ? `?trackId=${encodeURIComponent(trackId)}` : '';
    const res = await fetch(`/api/portal/assessments${params}`);
    const data = await res.json();

    if (data.success && data.assessments && !data.fallback) {
      const mapped: Assessment[] = data.assessments.map((a: any) => ({
        id: a.id,
        trackId: a.track_id,
        weekNumber: a.week_number,
        title: a.title,
        type: a.type,
        description: a.description,
        maxScore: a.max_score,
        dueDate: a.due_date,
        createdByInstructorId: a.created_by || 'inst-1',
        createdAt: a.created_at,
      }));
      return mapped;
    }
  } catch (err) {
    console.warn('Live assessments fetch notice, using local cache:', err);
  }

  return getLocalAssessments(trackId);
}

export async function syncCreateAssessment(
  data: Omit<Assessment, 'id' | 'createdAt'>
): Promise<Assessment> {
  const localNew: Assessment = {
    ...data,
    id: `asm-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch('/api/portal/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trackId: data.trackId,
        weekNumber: data.weekNumber,
        title: data.title,
        type: data.type,
        description: data.description,
        maxScore: data.maxScore,
        dueDate: data.dueDate,
        instructorId: data.createdByInstructorId,
      }),
    });
    const resData = await res.json();
    if (resData.success && resData.assessment) {
      return {
        id: resData.assessment.id,
        trackId: resData.assessment.track_id || data.trackId,
        weekNumber: resData.assessment.week_number || data.weekNumber,
        title: resData.assessment.title || data.title,
        type: resData.assessment.type || data.type,
        description: resData.assessment.description || data.description,
        maxScore: resData.assessment.max_score || data.maxScore,
        dueDate: resData.assessment.due_date || data.dueDate,
        createdByInstructorId: data.createdByInstructorId,
        createdAt: resData.assessment.created_at || new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('Live assessment create notice:', err);
  }

  return localNew;
}

// 3. SUBMISSIONS & GRADING API
export async function syncFetchSubmissions(regNo?: string): Promise<AssessmentSubmission[]> {
  try {
    const params = regNo ? `?regNo=${encodeURIComponent(regNo)}` : '';
    const res = await fetch(`/api/portal/submissions${params}`);
    const data = await res.json();

    if (data.success && data.submissions && !data.fallback) {
      const mapped: AssessmentSubmission[] = data.submissions.map((s: any) => ({
        id: s.id,
        assessmentId: s.assessment_id,
        studentRegNo: s.student_reg_no,
        studentName: s.student_name || 'Odubona Tobi Isaac',
        submissionUrl: s.submission_url,
        notes: s.notes,
        score: s.score,
        feedback: s.feedback,
        status: s.status,
        submittedAt: s.submitted_at,
        gradedAt: s.graded_at,
        gradedByInstructorId: s.graded_by,
      }));
      return mapped;
    }
  } catch (err) {
    console.warn('Live submissions fetch notice, using local cache:', err);
  }

  return getLocalSubmissions();
}

export async function syncSubmitAssessment(
  assessmentId: string,
  studentRegNo: string,
  studentName: string,
  submissionUrl: string,
  notes?: string
): Promise<AssessmentSubmission> {
  const localSub: AssessmentSubmission = {
    id: `sub-${Date.now()}`,
    assessmentId,
    studentRegNo,
    studentName,
    submissionUrl,
    notes,
    status: 'submitted',
    submittedAt: new Date().toISOString(),
  };

  try {
    await fetch('/api/portal/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assessmentId,
        studentRegNo,
        submissionUrl,
        notes,
      }),
    });
  } catch (err) {
    console.warn('Live submission upload notice:', err);
  }

  return localSub;
}

export async function syncGradeSubmission(
  submissionId: string,
  score: number,
  feedback: string,
  instructorId: string
): Promise<void> {
  try {
    await fetch('/api/portal/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submissionId,
        score,
        feedback,
        status: 'approved',
      }),
    });
  } catch (err) {
    console.warn('Live grading upload notice:', err);
  }
}

// 4. INSTRUCTOR DIRECTORY API
export async function syncFetchInstructors(): Promise<Instructor[]> {
  try {
    const res = await fetch('/api/portal/instructors');
    const data = await res.json();

    if (data.success && data.instructors && !data.fallback) {
      const mapped: Instructor[] = data.instructors.map((i: any) => ({
        id: i.id,
        fullName: i.full_name,
        email: i.email,
        phone: i.phone,
        trackId: i.track_id,
        status: i.status,
        bio: i.bio || '',
        experienceYears: i.experience_years || 0,
        approvedAt: i.approved_at,
        createdAt: i.created_at,
      }));
      saveInstructors(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Live instructors fetch notice, using local cache:', err);
  }

  return getLocalInstructors();
}

export async function syncCreateInstructor(params: {
  fullName: string;
  email: string;
  phone: string;
  trackId: string;
  password?: string;
  bio?: string;
  experienceYears?: number;
  status?: 'approved' | 'pending' | 'suspended';
}): Promise<Instructor> {
  // Update local cache first
  const localInst = addInstructor({
    fullName: params.fullName,
    email: params.email,
    phone: params.phone,
    trackId: params.trackId,
    bio: params.bio || '',
    experienceYears: params.experienceYears || 0,
    status: params.status || 'approved',
  });

  try {
    const res = await fetch('/api/portal/instructors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: params.fullName,
        email: params.email,
        phone: params.phone,
        trackId: params.trackId,
        password: params.password,
        bio: params.bio,
        experienceYears: params.experienceYears,
        status: params.status || 'approved',
      }),
    });
    const data = await res.json();
    if (data.success && data.instructor) {
      return {
        id: data.instructor.id,
        fullName: data.instructor.full_name,
        email: data.instructor.email,
        phone: data.instructor.phone,
        trackId: data.instructor.track_id,
        status: data.instructor.status,
        bio: data.instructor.bio || '',
        experienceYears: data.instructor.experience_years || 0,
        createdAt: data.instructor.created_at,
      };
    }
  } catch (err) {
    console.warn('Live instructor creation notice:', err);
  }

  return localInst;
}

export async function syncUpdateInstructorStatus(
  id: string,
  status: 'approved' | 'pending' | 'suspended'
): Promise<void> {
  // Update local storage
  if (status === 'approved') {
    approveInstructor(id);
  } else if (status === 'suspended') {
    suspendInstructor(id);
  }

  // Sync to live Supabase backend
  try {
    await fetch('/api/portal/instructors', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, instructorId: id, status }),
    });
  } catch (err) {
    console.warn('Live instructor status update notice:', err);
  }
}
