// ==============================================================================
// SWITCH 1.0 PORTAL STATE MANAGEMENT & PERSISTENCE
// Provides unified data models and sync for Students, Instructors, and Admin
// ==============================================================================

import { TRACKS } from '@/data/tracks';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export interface Instructor {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  trackId: string;
  status: 'pending' | 'approved' | 'suspended';
  bio: string;
  experienceYears: number;
  approvedAt?: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  trackId: string;
  sessionDate: string;
  sessionWeek: number;
  sessionTitle: string;
  studentRegNo: string;
  studentName: string;
  status: 'present' | 'late' | 'absent';
  markedByInstructorId: string;
  markedAt: string;
}

export interface Assessment {
  id: string;
  trackId: string;
  weekNumber: number;
  title: string;
  type: 'Practical Lab' | 'Capstone Project' | 'Knowledge Check';
  description: string;
  maxScore: number;
  dueDate: string;
  createdByInstructorId: string;
  createdAt: string;
}

export interface AssessmentSubmission {
  id: string;
  assessmentId: string;
  studentRegNo: string;
  studentName: string;
  submissionUrl: string;
  notes?: string;
  score?: number;
  feedback?: string;
  status: 'submitted' | 'approved' | 'needs_revision';
  submittedAt: string;
  gradedAt?: string;
  gradedByInstructorId?: string;
}

// Default Seed Data
const DEFAULT_INSTRUCTORS: Instructor[] = [
  {
    id: 'inst-1',
    fullName: 'Engr. Babatunde Alabi',
    email: 'babatunde.alabi@switch.ng',
    phone: '+234 803 123 4567',
    trackId: 'solar-energy',
    status: 'approved',
    bio: 'Lead Renewable Energy Engineer with 11+ years practical field experience deploying hybrid mini-grids and commercial PV systems.',
    experienceYears: 11,
    approvedAt: '2026-10-01T10:00:00Z',
    createdAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'inst-2',
    fullName: 'Chioma Okonkwo',
    email: 'chioma.okonkwo@switch.ng',
    phone: '+234 812 987 6543',
    trackId: 'software-engineering',
    status: 'approved',
    bio: 'Principal Fullstack Engineer specializing in Next.js, Node.js, distributed microservices and fintech architecture.',
    experienceYears: 8,
    approvedAt: '2026-10-02T12:00:00Z',
    createdAt: '2026-10-01T09:30:00Z',
  },
  {
    id: 'inst-3',
    fullName: 'Oluwaseun Adeleke',
    email: 'oluwaseun.adeleke@switch.ng',
    phone: '+234 805 456 7890',
    trackId: 'uiux-design',
    status: 'pending',
    bio: 'Lead UX Researcher & Product Architect, certified Design Sprint facilitator.',
    experienceYears: 6,
    createdAt: '2026-10-12T14:15:00Z',
  },
  {
    id: 'inst-4',
    fullName: 'Ibrahim Danladi',
    email: 'ibrahim.danladi@switch.ng',
    phone: '+234 809 333 2211',
    trackId: 'cybersecurity',
    status: 'pending',
    bio: 'Certified Ethical Hacker (CEH) and SOC analyst focused on enterprise defensive posture.',
    experienceYears: 5,
    createdAt: '2026-10-13T09:00:00Z',
  },
];

const DEFAULT_ASSESSMENTS: Assessment[] = [
  {
    id: 'asm-1',
    trackId: 'solar-energy',
    weekNumber: 1,
    title: 'Lab 1: PV Array & Battery Bank Load Audit',
    type: 'Practical Lab',
    description: 'Perform a comprehensive kilowatt-hour (kWh) calculation for a 3-bedroom residential apartment with surge overhead and inverter sizing.',
    maxScore: 100,
    dueDate: '2026-10-25T23:59:59Z',
    createdByInstructorId: 'inst-1',
    createdAt: '2026-10-05T10:00:00Z',
  },
  {
    id: 'asm-2',
    trackId: 'solar-energy',
    weekNumber: 2,
    title: 'Lab 2: Charge Controller & Earthing Safety Specs',
    type: 'Practical Lab',
    description: 'Document proper MPPT vs PWM specifications and sketch single-line diagram with surge lightning protection earthing rod grounding.',
    maxScore: 100,
    dueDate: '2026-11-02T23:59:59Z',
    createdByInstructorId: 'inst-1',
    createdAt: '2026-10-08T10:00:00Z',
  },
  {
    id: 'asm-3',
    trackId: 'software-engineering',
    weekNumber: 1,
    title: 'Lab 1: Git Workflow & Responsive Semantic Layout',
    type: 'Practical Lab',
    description: 'Build a fully responsive mobile-first portfolio page in Tailwind CSS with semantic HTML5 elements and deploy on Vercel.',
    maxScore: 100,
    dueDate: '2026-10-24T23:59:59Z',
    createdByInstructorId: 'inst-2',
    createdAt: '2026-10-06T10:00:00Z',
  },
];

const DEFAULT_SUBMISSIONS: AssessmentSubmission[] = [
  {
    id: 'sub-1',
    assessmentId: 'asm-1',
    studentRegNo: 'SW1-2026-74651',
    studentName: 'Odubona Tobi Isaac',
    submissionUrl: 'https://docs.google.com/document/d/solar-audit-lab-1-odubona',
    notes: 'Completed full inverter load calculation sheet with safety factor of 1.25 and 48V 200Ah Lithium battery configuration.',
    score: 95,
    feedback: 'Excellent breakdown of continuous vs inductive surge loads. Inverter sizing methodology is spot on.',
    status: 'approved',
    submittedAt: '2026-10-10T14:30:00Z',
    gradedAt: '2026-10-11T16:00:00Z',
    gradedByInstructorId: 'inst-1',
  },
];

const DEFAULT_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    trackId: 'solar-energy',
    sessionDate: '2026-10-11',
    sessionWeek: 1,
    sessionTitle: 'Orientation & Solar Fundamentals',
    studentRegNo: 'SW1-2026-74651',
    studentName: 'Odubona Tobi Isaac',
    status: 'present',
    markedByInstructorId: 'inst-1',
    markedAt: '2026-10-11T11:00:00Z',
  },
  {
    id: 'att-2',
    trackId: 'solar-energy',
    sessionDate: '2026-10-12',
    sessionWeek: 1,
    sessionTitle: 'Photovoltaic Physics & Cell Chemistries',
    studentRegNo: 'SW1-2026-74651',
    studentName: 'Odubona Tobi Isaac',
    status: 'present',
    markedByInstructorId: 'inst-1',
    markedAt: '2026-10-12T11:30:00Z',
  },
];

// Helper: safe local storage read/write
function getStorage<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving storage key ${key}:`, e);
  }
}

// INSTRUCTOR API
export function getInstructors(): Instructor[] {
  return getStorage<Instructor[]>('switch_portal_instructors', DEFAULT_INSTRUCTORS);
}

export function saveInstructors(instructors: Instructor[]): void {
  setStorage('switch_portal_instructors', instructors);
}

export function approveInstructor(id: string): Instructor[] {
  const current = getInstructors();
  const updated = current.map((inst) =>
    inst.id === id
      ? { ...inst, status: 'approved' as const, approvedAt: new Date().toISOString() }
      : inst
  );
  saveInstructors(updated);
  return updated;
}

export function suspendInstructor(id: string): Instructor[] {
  const current = getInstructors();
  const updated = current.map((inst) =>
    inst.id === id ? { ...inst, status: 'suspended' as const } : inst
  );
  saveInstructors(updated);
  return updated;
}

export function addInstructor(
  data: Omit<Instructor, 'id' | 'status' | 'createdAt'> & { status?: 'pending' | 'approved' | 'suspended' }
): Instructor {
  const current = getInstructors();
  const newInstructor: Instructor = {
    ...data,
    id: `inst-${Date.now()}`,
    status: data.status || 'approved',
    createdAt: new Date().toISOString(),
  };
  saveInstructors([newInstructor, ...current]);
  return newInstructor;
}

// ATTENDANCE API
export function getAttendanceRecords(): AttendanceRecord[] {
  return getStorage<AttendanceRecord[]>('switch_portal_attendance', DEFAULT_ATTENDANCE);
}

export function saveAttendanceRecords(records: AttendanceRecord[]): void {
  setStorage('switch_portal_attendance', records);
}

export function markBulkAttendance(
  trackId: string,
  sessionDate: string,
  sessionWeek: number,
  sessionTitle: string,
  instructorId: string,
  entries: { studentRegNo: string; studentName: string; status: 'present' | 'late' | 'absent' }[]
): AttendanceRecord[] {
  const current = getAttendanceRecords();
  // Filter out any existing records for this specific track + sessionDate + student
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

  const updated = [...newRecords, ...existingFiltered];
  saveAttendanceRecords(updated);
  return updated;
}

export function getStudentAttendanceStats(regNo: string): {
  totalSessions: number;
  presentCount: number;
  percentage: number;
  records: AttendanceRecord[];
} {
  const all = getAttendanceRecords();
  const studentRecords = all.filter((r) => r.studentRegNo === regNo);
  const total = studentRecords.length;
  if (total === 0) {
    return { totalSessions: 0, presentCount: 0, percentage: 0, records: [] };
  }
  const presentCount = studentRecords.filter(
    (r) => r.status === 'present' || r.status === 'late'
  ).length;
  const percentage = Math.round((presentCount / total) * 100);
  return { totalSessions: total, presentCount, percentage, records: studentRecords };
}

// ASSESSMENTS API
export function getAssessments(trackId?: string): Assessment[] {
  const all = getStorage<Assessment[]>('switch_portal_assessments', DEFAULT_ASSESSMENTS);
  if (trackId) {
    return all.filter((a) => a.trackId === trackId);
  }
  return all;
}

export function createAssessment(data: Omit<Assessment, 'id' | 'createdAt'>): Assessment {
  const current = getAssessments();
  const newAssessment: Assessment = {
    ...data,
    id: `asm-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  setStorage('switch_portal_assessments', [newAssessment, ...current]);
  return newAssessment;
}

// SUBMISSIONS API
export function getSubmissions(): AssessmentSubmission[] {
  return getStorage<AssessmentSubmission[]>('switch_portal_submissions', DEFAULT_SUBMISSIONS);
}

export function submitAssessment(
  assessmentId: string,
  studentRegNo: string,
  studentName: string,
  submissionUrl: string,
  notes?: string
): AssessmentSubmission {
  const current = getSubmissions();
  const existingIdx = current.findIndex(
    (s) => s.assessmentId === assessmentId && s.studentRegNo === studentRegNo
  );

  const newSub: AssessmentSubmission = {
    id: existingIdx >= 0 ? current[existingIdx].id : `sub-${Date.now()}`,
    assessmentId,
    studentRegNo,
    studentName,
    submissionUrl,
    notes,
    status: 'submitted',
    submittedAt: new Date().toISOString(),
  };

  let updated: AssessmentSubmission[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = newSub;
  } else {
    updated = [newSub, ...current];
  }
  setStorage('switch_portal_submissions', updated);
  return newSub;
}

export function gradeSubmission(
  submissionId: string,
  score: number,
  feedback: string,
  instructorId: string
): AssessmentSubmission[] {
  const current = getSubmissions();
  const updated = current.map((sub) =>
    sub.id === submissionId
      ? {
          ...sub,
          score,
          feedback,
          status: 'approved' as const,
          gradedAt: new Date().toISOString(),
          gradedByInstructorId: instructorId,
        }
      : sub
  );
  setStorage('switch_portal_submissions', updated);
  return updated;
}

export function getStudentAssessmentStats(regNo: string, trackId: string): {
  totalAssigned: number;
  submittedCount: number;
  approvedCount: number;
  assessmentsWithStatus: Array<Assessment & { submission?: AssessmentSubmission }>;
} {
  const assessments = getAssessments(trackId);
  const submissions = getSubmissions().filter((s) => s.studentRegNo === regNo);

  const merged = assessments.map((a) => {
    const sub = submissions.find((s) => s.assessmentId === a.id);
    return {
      ...a,
      submission: sub,
    };
  });

  const submittedCount = merged.filter((m) => Boolean(m.submission)).length;
  const approvedCount = merged.filter((m) => m.submission?.status === 'approved').length;

  return {
    totalAssigned: assessments.length,
    submittedCount,
    approvedCount,
    assessmentsWithStatus: merged,
  };
}

// DEFAULT STUDENT SESSION (Initializes if localStorage is empty)
export function getOrInitDefaultStudent(): any {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('switch_student_session');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
  }

  // Pre-seed default student if none exists
  const defaultStudent = {
    fullName: 'Odubona Tobi Isaac',
    email: 'odubonatobi@gmail.com',
    phone: '+234 814 567 8901',
    ageBracket: '21-25',
    gender: 'Male',
    stateOfResidence: 'Lagos',
    trackId: 'solar-energy',
    learningMode: 'Physical Center / Hybrid',
    registrationNumber: 'SW1-2026-74651',
    paymentReference: 'PSTK-REF-74651-SWITCH',
    amountPaid: 5000,
    paymentStatus: 'verified',
    cohort: 'Cohort 1.0',
    verifiedAt: '2026-10-10T12:00:00Z',
    bio: 'Renewable energy enthusiast passionate about solar micro-inverter installation, rural electrification, and clean power solutions.',
    emergencyContact: '+234 802 334 5566 (Brother - Samuel Odubona)',
  };

  localStorage.setItem('switch_student_session', JSON.stringify(defaultStudent));
  return defaultStudent;
}
