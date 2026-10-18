'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TRACKS, findTrackById } from '@/data/tracks';
import {
  getInstructors,
  getAttendanceRecords,
  getAssessments as getLocalAssessments,
  getSubmissions as getLocalSubmissions,
  getOrInitDefaultStudent,
  Instructor,
  Assessment,
  AssessmentSubmission,
} from '@/lib/portalState';
import {
  syncFetchAssessments,
  syncCreateAssessment,
  syncFetchSubmissions,
  syncGradeSubmission,
  syncMarkAttendance,
} from '@/lib/portalApi';
import {
  Briefcase,
  ShieldAlert,
  CheckCircle2,
  CalendarCheck,
  FileCheck2,
  Plus,
  Send,
  Users,
  Clock,
  ExternalLink,
  Award,
  Layers,
  ArrowRight,
  Shield,
  HelpCircle,
  LogOut,
  User,
} from 'lucide-react';

function InstructorPortalContent() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentInstructor, setCurrentInstructor] = useState<Instructor | null>(null);
  const [activeTab, setActiveTab] = useState<'attendance' | 'assessments' | 'grade'>('attendance');

  // Attendance Form State
  const [sessionWeek, setSessionWeek] = useState(1);
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionTitle, setSessionTitle] = useState('Practical Workshop Lab 1');
  const [attendanceStatuses, setAttendanceStatuses] = useState<{ [regNo: string]: 'present' | 'late' | 'absent' }>({});
  const [attendanceNotice, setAttendanceNotice] = useState<string | null>(null);
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);

  // Create Assessment Form State
  const [newAsm, setNewAsm] = useState({
    weekNumber: 1,
    title: '',
    type: 'Practical Lab' as 'Practical Lab' | 'Capstone Project' | 'Knowledge Check',
    description: '',
    maxScore: 100,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  const [assessmentNotice, setAssessmentNotice] = useState<string | null>(null);
  const [isCreatingAsm, setIsCreatingAsm] = useState(false);

  // Grade Submissions State
  const [gradingScores, setGradingScores] = useState<{ [subId: string]: number }>({});
  const [gradingFeedbacks, setGradingFeedbacks] = useState<{ [subId: string]: string }>({});
  const [gradeNotice, setGradeNotice] = useState<string | null>(null);
  const [isGrading, setIsGrading] = useState<string | null>(null);

  // Live Data lists
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);

  // Load registered student roster
  const [studentRoster, setStudentRoster] = useState<any[]>([]);

  // 1. Check Instructor Auth Session
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      // 1. Try local cache first for instant load
      if (typeof window !== 'undefined') {
        const sessionStr = localStorage.getItem('switch_instructor_session');
        if (sessionStr) {
          try {
            const parsed = JSON.parse(sessionStr);
            if (parsed.authenticated && parsed.instructor) {
              if (isMounted) {
                setCurrentInstructor(parsed.instructor);
                setCheckingAuth(false);
              }
            }
          } catch {
            // ignore
          }
        }
      }

      // 2. Verify with server endpoint
      try {
        const res = await fetch('/api/instructor/auth');
        const data = await res.json();
        if (data.success && data.instructor) {
          if (isMounted) {
            setCurrentInstructor(data.instructor);
            setCheckingAuth(false);
            if (typeof window !== 'undefined') {
              localStorage.setItem(
                'switch_instructor_session',
                JSON.stringify({ authenticated: true, instructor: data.instructor })
              );
            }
          }
          return;
        }
      } catch (err) {
        console.warn('Instructor auth check notice:', err);
      }

      // 3. Fallback: If neither succeeds, redirect to login
      if (isMounted) {
        router.replace('/instructor/login');
      }
    }

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);

  // 2. Load dynamic assessments & submissions from Supabase/cache
  useEffect(() => {
    if (!checkingAuth && currentInstructor) {
      syncFetchAssessments(currentInstructor.trackId).then((asms) => setAssessments(asms));
      syncFetchSubmissions().then((subs) => setSubmissions(subs));

      const defaultStd = getOrInitDefaultStudent();
      const roster = defaultStd
        ? [
            defaultStd,
            {
              fullName: 'Adekoya Michael',
              registrationNumber: 'SW1-2026-88192',
              trackId: currentInstructor.trackId,
              learningMode: 'Physical Center / Hybrid',
            },
          ]
        : [
            {
              fullName: 'Adekoya Michael',
              registrationNumber: 'SW1-2026-88192',
              trackId: currentInstructor.trackId,
              learningMode: 'Physical Center / Hybrid',
            },
          ];

      setStudentRoster(roster);
      const initialStatuses: { [regNo: string]: 'present' | 'late' | 'absent' } = {};
      roster.forEach((s) => {
        initialStatuses[s.registrationNumber] = 'present';
      });
      setAttendanceStatuses(initialStatuses);
    }
  }, [checkingAuth, currentInstructor]);

  const handleInstructorLogout = async () => {
    try {
      await fetch('/api/instructor/auth', { method: 'DELETE' });
    } catch (e) {
      // fallback
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('switch_instructor_session');
    }
    router.replace('/instructor/login');
  };

  const isApproved = currentInstructor?.status === 'approved';
  const assignedTrack = findTrackById(currentInstructor?.trackId) || TRACKS[0];

  // 1. Submit Attendance Handler with live Supabase sync
  const handleSaveAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInstructor || !isApproved) return;
    setIsSavingAttendance(true);

    const entries = studentRoster.map((std) => ({
      studentRegNo: std.registrationNumber,
      studentName: std.fullName,
      status: attendanceStatuses[std.registrationNumber] || 'present',
    }));

    try {
      await syncMarkAttendance(
        assignedTrack.id,
        sessionDate,
        Number(sessionWeek),
        sessionTitle,
        currentInstructor.id,
        entries
      );

      setAttendanceNotice(
        `✓ Attendance for "${sessionTitle}" recorded successfully for ${entries.length} student(s)! Student progress bars have been updated.`
      );
      setTimeout(() => setAttendanceNotice(null), 6000);
    } finally {
      setIsSavingAttendance(false);
    }
  };

  // 2. Create Assessment Handler with live Supabase sync
  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInstructor || !isApproved || !newAsm.title) return;
    setIsCreatingAsm(true);

    try {
      await syncCreateAssessment({
        trackId: assignedTrack.id,
        weekNumber: Number(newAsm.weekNumber),
        title: newAsm.title.trim(),
        type: newAsm.type,
        description: newAsm.description.trim(),
        maxScore: Number(newAsm.maxScore) || 100,
        dueDate: new Date(newAsm.dueDate).toISOString(),
        createdByInstructorId: currentInstructor.id,
      });

      const updatedAsms = await syncFetchAssessments(assignedTrack.id);
      setAssessments(updatedAsms);

      setAssessmentNotice(`✓ New assessment "${newAsm.title}" published! Students in ${assignedTrack.title} can now view and submit this deliverable.`);
      setNewAsm({
        weekNumber: Number(newAsm.weekNumber) + 1,
        title: '',
        type: 'Practical Lab',
        description: '',
        maxScore: 100,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      setTimeout(() => setAssessmentNotice(null), 6000);
    } finally {
      setIsCreatingAsm(false);
    }
  };

  // 3. Grade Submission Handler with live Supabase sync
  const handleGradeSubmission = async (submissionId: string) => {
    if (!currentInstructor || !isApproved) return;
    setIsGrading(submissionId);

    const score = gradingScores[submissionId] ?? 90;
    const feedback = gradingFeedbacks[submissionId] ?? 'Well done on completing the practical lab requirements. Specifications and calculations are verified.';

    try {
      await syncGradeSubmission(submissionId, score, feedback, currentInstructor.id);
      const updatedSubs = await syncFetchSubmissions();
      setSubmissions(updatedSubs);

      setGradeNotice(`✓ Assessment approved with grade ${score}/100! The student's "Approved Assessments" card now reflects this achievement.`);
      setTimeout(() => setGradeNotice(null), 6000);
    } finally {
      setIsGrading(null);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest font-bold text-slate-400">Verifying Faculty Authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header with Authenticated Instructor Profile */}
        <div className="bg-[#071E26] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Switch 1.0 Faculty Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Course Instructor Workspace
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Record weekly student attendance, publish practical lab assignments, and grade deliverables for {assignedTrack.title}.
              </p>
            </div>

            {/* Authenticated Instructor Profile & Logout Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 px-3.5 py-2.5 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {currentInstructor?.fullName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">{currentInstructor?.fullName}</div>
                  <div className="text-[10px] text-amber-300 font-semibold">{currentInstructor?.email}</div>
                  <div className="text-[9px] text-slate-300 font-mono mt-0.5">{assignedTrack.title}</div>
                </div>
              </div>

              <button
                onClick={handleInstructorLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors shadow-2xs"
                title="Sign out of Faculty Workspace"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* APPROVAL CHECK GATE                                                       */}
        {/* ========================================================================= */}
        {!isApproved ? (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-8 shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 text-amber-800" />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  Status: Pending Administrative Review
                </div>
                <h3 className="text-lg font-black text-amber-950">
                  Account Pending Administrative Verification
                </h3>
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed max-w-2xl">
                  Instructor <strong>{currentInstructor?.fullName}</strong> has been registered for the <strong>{assignedTrack.title}</strong> track, but this faculty account has not yet been approved by the Switch 1.0 central administration.
                </p>
                <p className="text-xs text-amber-800 font-medium">
                  Once an administrator approves your profile, attendance marking and assessment evaluation tools will automatically unlock on this page.
                </p>

                <div className="pt-3 flex items-center gap-3">
                  <button
                    onClick={handleInstructorLogout}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Return to Login</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* UNLOCKED INSTRUCTOR TEACHING SUITE                                        */
          /* ========================================================================= */
          <div className="space-y-6">

            {/* Instructor Track Summary Bar */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black text-xl shadow-sm">
                  {currentInstructor?.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">{currentInstructor?.fullName}</h3>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">
                      Approved Lead Instructor
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Teaching Track: <strong className="text-slate-800">{assignedTrack.title}</strong> ({assignedTrack.category})
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    activeTab === 'attendance'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Mark Attendance
                </button>
                <button
                  onClick={() => setActiveTab('assessments')}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    activeTab === 'assessments'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Create Assessments ({assessments.length})
                </button>
                <button
                  onClick={() => setActiveTab('grade')}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    activeTab === 'grade'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Grade Submissions ({submissions.length})
                </button>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* 1. MARK STUDENT ATTENDANCE TAB                                        */}
            {/* ===================================================================== */}
            {activeTab === 'attendance' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-amber-600" />
                    <span>Weekly Student Attendance Register</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select session details and toggle student presence. Saving updates the student's Attendance Progress card in real-time.
                  </p>
                </div>

                {attendanceNotice && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{attendanceNotice}</span>
                  </div>
                )}

                <form onSubmit={handleSaveAttendance} className="space-y-6">
                  {/* Session Metadata Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Curriculum Week
                      </label>
                      <select
                        value={sessionWeek}
                        onChange={(e) => setSessionWeek(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                          <option key={w} value={w}>
                            Week {w}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Session Date
                      </label>
                      <input
                        type="date"
                        value={sessionDate}
                        onChange={(e) => setSessionDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Session Title / Workshop Topic
                      </label>
                      <input
                        type="text"
                        value={sessionTitle}
                        onChange={(e) => setSessionTitle(e.target.value)}
                        placeholder="e.g. Lab 1: PV Array Sizing"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Student Roster Table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 border-b border-slate-100 pb-2">
                      <span>Enrolled Track Participants ({studentRoster.length})</span>
                      <button
                        type="button"
                        onClick={() => {
                          const allP: any = {};
                          studentRoster.forEach((s) => (allP[s.registrationNumber] = 'present'));
                          setAttendanceStatuses(allP);
                        }}
                        className="text-amber-600 hover:underline"
                      >
                        Mark All as Present
                      </button>
                    </div>

                    {studentRoster.map((std) => {
                      const currentStatus = attendanceStatuses[std.registrationNumber] || 'present';

                      return (
                        <div
                          key={std.registrationNumber}
                          className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-switch-teal text-white flex items-center justify-center font-bold text-sm">
                              {std.fullName.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">{std.fullName}</div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                ID: <span className="text-switch-teal font-bold">{std.registrationNumber}</span> · {std.learningMode}
                              </div>
                            </div>
                          </div>

                          {/* Attendance Status Selector */}
                          <div className="flex items-center gap-1.5 self-start sm:self-auto">
                            {(['present', 'late', 'absent'] as const).map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() =>
                                  setAttendanceStatuses({
                                    ...attendanceStatuses,
                                    [std.registrationNumber]: status,
                                  })
                                }
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                                  currentStatus === status
                                    ? status === 'present'
                                      ? 'bg-emerald-600 text-white shadow-2xs'
                                      : status === 'late'
                                      ? 'bg-amber-500 text-white shadow-2xs'
                                      : 'bg-rose-600 text-white shadow-2xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSavingAttendance}
                      className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md disabled:opacity-60"
                    >
                      {isSavingAttendance ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving Register to Database...</span>
                        </>
                      ) : (
                        <>
                          <CalendarCheck className="w-4 h-4" />
                          <span>Save & Submit Attendance Register</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ===================================================================== */}
            {/* 2. CREATE ASSESSMENTS TAB                                             */}
            {/* ===================================================================== */}
            {activeTab === 'assessments' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Form to Create New Assessment */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-amber-600" />
                      <span>Create & Publish New Assessment</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Assign practical deliverables or milestone quizzes to participants in {assignedTrack.title}.
                    </p>
                  </div>

                  {assessmentNotice && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-xs">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="font-semibold">{assessmentNotice}</span>
                    </div>
                  )}

                  <form onSubmit={handleCreateAssessment} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Assessment Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Practical Lab 2: Charge Controller & Earthing Specs"
                        value={newAsm.title}
                        onChange={(e) => setNewAsm({ ...newAsm, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">
                          Curriculum Week
                        </label>
                        <select
                          value={newAsm.weekNumber}
                          onChange={(e) => setNewAsm({ ...newAsm, weekNumber: Number(e.target.value) })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((w) => (
                            <option key={w} value={w}>
                              Week {w}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">
                          Assessment Type
                        </label>
                        <select
                          value={newAsm.type}
                          onChange={(e) => setNewAsm({ ...newAsm, type: e.target.value as any })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                        >
                          <option value="Practical Lab">Practical Lab</option>
                          <option value="Capstone Project">Capstone Project</option>
                          <option value="Knowledge Check">Knowledge Check</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">
                          Due Date
                        </label>
                        <input
                          type="date"
                          value={newAsm.dueDate}
                          onChange={(e) => setNewAsm({ ...newAsm, dueDate: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Detailed Lab Instructions & Acceptance Criteria
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Specify problem statement, calculations, required tools, diagrams, and expected deliverable format (Google Docs, PDF, or GitHub)..."
                        value={newAsm.description}
                        onChange={(e) => setNewAsm({ ...newAsm, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 font-medium"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isCreatingAsm}
                        className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md disabled:opacity-60"
                      >
                        {isCreatingAsm ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Publishing to Student Dashboard...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Publish Assessment to Student Dashboard</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Existing Published Assessments List */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Published Assessments ({assessments.length})
                  </h4>

                  <div className="space-y-3 text-xs">
                    {assessments.map((a) => (
                      <div key={a.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{a.title}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                            Week {a.weekNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2">{a.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ===================================================================== */}
            {/* 3. GRADE SUBMISSIONS TAB                                              */}
            {/* ===================================================================== */}
            {activeTab === 'grade' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-amber-600" />
                    <span>Review & Grade Student Submissions</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Evaluate practical deliverables and assign scores. When approved, the student's Approved Assessments card increments.
                  </p>
                </div>

                {gradeNotice && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{gradeNotice}</span>
                  </div>
                )}

                {submissions.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No student submissions received yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((sub) => {
                      const asmObj = assessments.find((a) => a.id === sub.assessmentId);
                      const isApprovedSub = sub.status === 'approved';

                      return (
                        <div
                          key={sub.id}
                          className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900">{sub.studentName}</h4>
                                <span className="font-mono text-xs text-switch-teal font-bold">
                                  ({sub.studentRegNo})
                                </span>
                              </div>
                              <div className="text-xs text-slate-500">
                                Task: <strong>{asmObj?.title || 'Practical Lab'}</strong>
                              </div>
                            </div>

                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${
                              isApprovedSub
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}>
                              {isApprovedSub ? `Approved (${sub.score}/100)` : 'Awaiting Instructor Grading'}
                            </span>
                          </div>

                          {/* Student Deliverable Link & Notes */}
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-600">Deliverable URL:</span>
                              <a
                                href={sub.submissionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-switch-teal font-semibold hover:underline inline-flex items-center gap-1"
                              >
                                <span className="truncate max-w-md">{sub.submissionUrl}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>

                            {sub.notes && (
                              <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                                <strong className="text-slate-700">Student Notes: </strong>
                                {sub.notes}
                              </p>
                            )}
                          </div>

                          {/* Grading Inputs */}
                          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-end gap-3 text-xs">
                            <div className="w-full sm:w-32">
                              <label className="block font-bold text-slate-700 uppercase mb-1">
                                Score (out of 100)
                              </label>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                defaultValue={sub.score || 95}
                                onChange={(e) =>
                                  setGradingScores({
                                    ...gradingScores,
                                    [sub.id]: Number(e.target.value),
                                  })
                                }
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-900"
                              />
                            </div>

                            <div className="flex-1 w-full">
                              <label className="block font-bold text-slate-700 uppercase mb-1">
                                Instructor Evaluation Feedback
                              </label>
                              <input
                                type="text"
                                defaultValue={sub.feedback || 'Excellent practical load audit calculation and component sizing.'}
                                onChange={(e) =>
                                  setGradingFeedbacks({
                                    ...gradingFeedbacks,
                                    [sub.id]: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => handleGradeSubmission(sub.id)}
                              disabled={isGrading === sub.id}
                              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm shrink-0 flex items-center justify-center gap-1.5"
                            >
                              {isGrading === sub.id ? (
                                <>
                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Recording...</span>
                                </>
                              ) : (
                                <span>{isApprovedSub ? 'Update Grade' : 'Approve & Record Grade'}</span>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default function InstructorPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center bg-slate-50"><p className="text-xs text-slate-500 font-semibold">Loading Instructor Portal...</p></div>}>
      <InstructorPortalContent />
    </Suspense>
  );
}
