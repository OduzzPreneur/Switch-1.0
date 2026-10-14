'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { TRACKS } from '@/data/tracks';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  getOrInitDefaultStudent,
  getStudentAttendanceStats,
  getStudentAssessmentStats,
  submitAssessment,
  Assessment,
  AssessmentSubmission,
} from '@/lib/portalState';
import {
  syncFetchAttendance,
  syncFetchAssessments,
  syncFetchSubmissions,
  syncSubmitAssessment,
} from '@/lib/portalApi';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  BookOpen,
  Download,
  LogOut,
  Clock,
  Sparkles,
  Award,
  Video,
  FileText,
  AlertCircle,
  Bell,
  GraduationCap,
  CalendarDays,
  FileCheck2,
  PlayCircle,
  ExternalLink,
  ChevronRight,
  Send,
  MapPin,
  Check,
  HelpCircle,
  Info,
} from 'lucide-react';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active Tab state (synced with search param if provided)
  const [activeTab, setActiveTab] = useState<
    'overview' | 'curriculum' | 'blueprint-courses' | 'session-recordings' | 'assessments' | 'timetable'
  >('overview');

  const [student, setStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Dynamic Metrics & Portal Data
  const [attendanceStats, setAttendanceStats] = useState({
    totalSessions: 0,
    presentCount: 0,
    percentage: 0,
    records: [] as any[],
  });

  const [assessmentStats, setAssessmentStats] = useState({
    totalAssigned: 0,
    submittedCount: 0,
    approvedCount: 0,
    assessmentsWithStatus: [] as any[],
  });

  // Modal / Submission State
  const [selectedAssessmentForSub, setSelectedAssessmentForSub] = useState<Assessment | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  // Sync tab with URL search parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (
      tabParam &&
      ['overview', 'curriculum', 'blueprint-courses', 'session-recordings', 'assessments', 'timetable'].includes(
        tabParam
      )
    ) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  // Load Student Session & Synchronize Metrics
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      let currentStudent = null;

      // 1. Try Supabase Auth session if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user && isMounted) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .maybeSingle();

            const { data: reg } = await supabase
              .from('registrations')
              .select('*')
              .eq('user_id', user.id)
              .maybeSingle();

            if (profile && reg) {
              currentStudent = {
                fullName: profile.full_name,
                email: profile.email,
                phone: profile.phone,
                ageBracket: profile.age_bracket,
                gender: profile.gender,
                stateOfResidence: profile.state_of_residence,
                trackId: reg.track_id,
                learningMode: reg.learning_mode,
                registrationNumber: reg.registration_number,
                paymentReference: 'Verified Cloud Account',
                amountPaid: 5000,
                paymentStatus: 'verified',
              };
            }
          }
        } catch (supabaseErr) {
          console.warn('Supabase fallback:', supabaseErr);
        }
      }

      // 2. Check localStorage session fallback or initialize default
      if (!currentStudent && typeof window !== 'undefined') {
        currentStudent = getOrInitDefaultStudent();
      }

      if (isMounted && currentStudent) {
        setStudent(currentStudent);

        // Load dynamic metrics immediately from cache
        const att = getStudentAttendanceStats(currentStudent.registrationNumber);
        setAttendanceStats(att);

        const asm = getStudentAssessmentStats(
          currentStudent.registrationNumber,
          currentStudent.trackId
        );
        setAssessmentStats(asm);

        setLoading(false);

        // Fetch live database updates from Supabase
        const regNo = currentStudent.registrationNumber;
        const trackId = currentStudent.trackId;
        Promise.all([
          syncFetchAttendance(trackId, regNo),
          syncFetchAssessments(trackId),
          syncFetchSubmissions(regNo),
        ]).then(() => {
          if (isMounted) {
            const freshAtt = getStudentAttendanceStats(regNo);
            setAttendanceStats(freshAtt);
            const freshAsm = getStudentAssessmentStats(regNo, trackId);
            setAssessmentStats(freshAsm);
          }
        }).catch((syncErr) => {
          console.warn('Dashboard live sync note:', syncErr);
        });
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('switch_student_session');
    }
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    router.push('/login');
  };

  const handleAssessmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssessmentForSub || !student) return;
    setSubmitting(true);

    try {
      // 1. Immediate local cache write
      submitAssessment(
        selectedAssessmentForSub.id,
        student.registrationNumber,
        student.fullName,
        submissionUrl.trim(),
        submissionNotes.trim()
      );

      // 2. Live Supabase database sync
      await syncSubmitAssessment(
        selectedAssessmentForSub.id,
        student.registrationNumber,
        student.fullName,
        submissionUrl.trim(),
        submissionNotes.trim()
      );

      // Refresh assessment metrics
      const updatedAsm = getStudentAssessmentStats(
        student.registrationNumber,
        student.trackId
      );
      setAssessmentStats(updatedAsm);

      setSubmissionFeedback('Assessment submission received successfully! Your instructor will review and grade it.');
      setSubmissionUrl('');
      setSubmissionNotes('');
      setTimeout(() => {
        setSelectedAssessmentForSub(null);
        setSubmissionFeedback(null);
      }, 2500);
    } catch (err: any) {
      alert('Error submitting assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !student) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-switch-teal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">Loading student portal...</p>
        </div>
      </div>
    );
  }

  const enrolledTrack = TRACKS.find((t) => t.id === student?.trackId) || TRACKS[0];
  const firstName = student.fullName ? student.fullName.split(' ')[0] : 'Fellow';

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20">
      
      {/* Mobile-only quick module switcher (Hidden on desktop to eliminate double navbars) */}
      <div className="lg:hidden bg-[#071E26] text-white border-b border-white/10 sticky top-16 sm:top-[72px] z-30 shadow-md">
        <div className="px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {[
            { label: 'Overview', tab: 'overview' },
            { label: 'Curriculum', tab: 'curriculum' },
            { label: 'Blueprint', tab: 'blueprint-courses' },
            { label: 'Recordings', tab: 'session-recordings' },
            { label: 'Assessments', tab: 'assessments' },
            { label: 'Timetable', tab: 'timetable' },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab as any)}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                activeTab === item.tab
                  ? 'bg-switch-teal text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN DASHBOARD CONTENT AREA                                               */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">

        {/* 3MTT INSPIRED HERO BANNER (Image 2 Reference) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-[#071E26] text-white p-6 sm:p-8 shadow-md">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Switch 1.0 Youth Empowerment</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Hello {firstName}, Welcome to your Switch 1.0 Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Your practical technical training in <strong>{enrolledTrack.title}</strong> is active. Access your curriculum, review session recordings, and track assessment milestones.
            </p>
          </div>

          {/* Decorative Background Graphics */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 flex items-center justify-end pr-6 pointer-events-none select-none hidden md:flex">
            <Award className="w-56 h-56 text-white" />
          </div>
        </div>

        {/* 3MTT INSPIRED METRIC / STATUS CARDS (Image 4 Reference) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Student ID Card (Emerald Green) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-5 shadow-sm border border-emerald-500">
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
                    Student ID
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono tracking-wide mt-2">
                  {student.registrationNumber}
                </div>
                <div className="text-xs text-emerald-100 font-medium">
                  Cohort 1.0 · Verified Student
                </div>
              </div>

              {/* Large checkmark watermark */}
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Check className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Subtle Watermark */}
            <CheckCircle2 className="absolute -right-4 -bottom-4 w-28 h-28 text-emerald-500/30 pointer-events-none" />
          </div>

          {/* Card 2: Approved Assessments (Dark Slate) */}
          <div className="relative overflow-hidden rounded-2xl bg-[#0B1E28] text-white p-5 shadow-sm border border-slate-700">
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Approved Assessments
                  </span>
                </div>
                <div className="text-3xl font-black tracking-tight text-white mt-2">
                  {assessmentStats.approvedCount}
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  {assessmentStats.submittedCount} Submitted · {assessmentStats.totalAssigned} Total Tasks
                </div>
              </div>

              <button
                onClick={() => setActiveTab('assessments')}
                className="text-xs font-bold text-switch-teal hover:underline pt-1"
              >
                View tasks →
              </button>
            </div>

            {/* Watermark icon */}
            <FileText className="absolute -right-4 -bottom-4 w-28 h-28 text-white/5 pointer-events-none" />
          </div>

          {/* Card 3: Attendance Progress (Orange) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white p-5 shadow-sm border border-orange-400">
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                    <CalendarDays className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold text-orange-100 uppercase tracking-wider">
                    Attendance Progress
                  </span>
                </div>
                <div className="text-3xl font-black tracking-tight text-white mt-2">
                  {attendanceStats.totalSessions > 0 ? `${attendanceStats.percentage}%` : '100%'}
                </div>
                <div className="text-xs text-orange-100 font-medium">
                  {attendanceStats.presentCount} of {attendanceStats.totalSessions || 2} Sessions Logged
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Watermark icon */}
            <Sparkles className="absolute -right-4 -bottom-4 w-28 h-28 text-orange-400/30 pointer-events-none" />
          </div>

        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW                                                           */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Enrolled Track Highlight Card */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-switch-teal bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                    Enrolled Discipline · {enrolledTrack.category}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">
                    {enrolledTrack.title}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Duration</span>
                  <span className="text-sm font-bold text-slate-800">{enrolledTrack.durationWeeks} Weeks Practical</span>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {enrolledTrack.description}
              </p>

              {/* Skills and Tools Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-switch-teal" />
                    <span>Skills You Will Acquire</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {enrolledTrack.skills.map((s) => (
                      <li key={s} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-switch-teal" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-switch-orange" />
                    <span>Practical Tools Covered</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {enrolledTrack.toolsCovered.map((t) => (
                      <li key={t} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-switch-orange" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Weekly Milestone Progress Bar */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Cohort 1.0 Milestone Progress</span>
                  <span className="text-switch-teal">Week 1 of {enrolledTrack.durationWeeks}</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="w-[15%] h-full bg-gradient-to-r from-switch-teal to-teal-500 rounded-full" />
                </div>
                <div className="text-[11px] text-slate-500">
                  Week 1 Foundational modules in progress. Mentor review scheduled this Friday.
                </div>
              </div>
            </div>

            {/* Right Column: Verified Records & Fast Links */}
            <div className="space-y-6">
              
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Verified Registration Record</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Registration Fee:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ₦5,000 (Verified)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gateway:</span>
                    <span className="font-bold text-slate-800">Paystack Verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Registration ID:</span>
                    <span className="font-mono font-bold text-switch-teal">{student.registrationNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Preferred Mode:</span>
                    <span className="font-bold text-slate-800">{student.learningMode || 'Physical Center / Hybrid'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Certification:</span>
                    <span className="font-bold text-slate-800">Tamper-Proof Digital</span>
                  </div>
                </div>

                <Link
                  href="/dashboard/profile"
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Manage Profile & Save Slip</span>
                </Link>
              </div>

              {/* Support & Community Card */}
              <div className="bg-gradient-to-br from-switch-teal to-[#071E26] text-white rounded-3xl p-6 shadow-md space-y-3">
                <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">
                  Switch 1.0 Community
                </span>
                <h4 className="text-base font-bold">
                  Peer Learning & Technical Mentors
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Join fellow cohort participants in your track group. Connect with assigned instructors for questions and hands-on lab troubleshooting.
                </p>
                <div className="pt-1">
                  <a
                    href="https://t.me/switch_initiative"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/10"
                  >
                    <span>Join Track Telegram Group</span>
                    <ExternalLink className="w-3 h-3 text-orange-300" />
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: TRACK CURRICULUM                                                   */}
        {/* ========================================================================= */}
        {activeTab === 'curriculum' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {enrolledTrack.title} · Week-by-Week Roadmap
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Practical, outcome-oriented curriculum designed for rapid capability growth ({enrolledTrack.durationWeeks} Weeks).
                </p>
              </div>
              <span className="text-xs font-bold text-switch-teal bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 self-start sm:self-auto">
                Cohort 1.0 Syllabus
              </span>
            </div>

            <div className="space-y-4">
              {[
                {
                  week: 'Week 1',
                  status: 'Active (Current)',
                  title: 'Foundations, Safety Standards & Tooling Setup',
                  desc: 'Comprehensive fundamentals, safety protocols, workshop setup, baseline evaluations, and hardware/software environment configuration.',
                  topics: ['Orientation & Track Overview', 'Safety & Environmental Standards', 'Essential Theory & Lab Equipment Setup'],
                },
                {
                  week: 'Week 2–3',
                  status: 'Upcoming',
                  title: 'Hands-on Technical Drills & Component Architecture',
                  desc: 'Diving deep into component sizing, real-world demonstrations, schematic calculations, and mentor-guided lab experiments.',
                  topics: ['Component Sizing & Selection', 'Practical Schematics & Wiring', 'Field Diagnostic Drills'],
                },
                {
                  week: 'Week 4–6',
                  status: 'Upcoming',
                  title: 'Applied Projects & Real-World System Deployment',
                  desc: 'Building actual working prototypes, tackling client case studies, and diagnosing and fixing real-world failure modes.',
                  topics: ['System Assembly & Configuration', 'Troubleshooting & Fault Finding', 'Quality Assurance Checklists'],
                },
                {
                  week: 'Week 7–8',
                  status: 'Upcoming',
                  title: 'Optimization, Regulations & Enterprise Standards',
                  desc: 'Performance tuning, safety auditing, load balancing, regulatory compliance, and craftsmanship refinement.',
                  topics: ['Efficiency Optimization', 'Compliance Standards & Inspection', 'Maintenance & Service Protocols'],
                },
                {
                  week: 'Final Milestone',
                  status: 'Upcoming',
                  title: 'Capstone Showcase & Professional Defense',
                  desc: 'Final practical project defense, portfolio compilation, graduation evaluation, and digital credential issuance.',
                  topics: ['Capstone Presentation', 'Client Ready Portfolio', 'Certification Assessment'],
                },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/60 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-switch-teal bg-teal-100 px-2.5 py-0.5 rounded-md">
                        {item.week}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border self-start sm:self-auto ${
                      item.status.includes('Active')
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-slate-200/60 text-slate-600 border-slate-300'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {item.topics.map((t) => (
                      <span key={t} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-medium">
                        • {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BLUEPRINT COURSES                                                  */}
        {/* ========================================================================= */}
        {activeTab === 'blueprint-courses' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200 mb-2">
                <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                <span>Foundational Professional Curriculum</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Switch 1.0 Blueprint Core Courses
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Mandatory core career modules that accompany every technical track to ensure work readiness, ethics, and entrepreneurship.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Module 1: Digital Workplace & Productivity Essentials',
                  desc: 'Master professional communication, cloud documentation, Notion, Google Workspace, and project tracking.',
                  progress: '100% Completed',
                  statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  actionLabel: 'Review Content',
                },
                {
                  title: 'Module 2: Professional Ethics, Integrity & Customer Service',
                  desc: 'Core ethical principles, client contract handling, punctuality, and workplace compliance for emerging technicians.',
                  progress: 'In Progress (40%)',
                  statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
                  actionLabel: 'Continue Learning',
                },
                {
                  title: 'Module 3: Freelancing & Technical Entrepreneurship',
                  desc: 'How to price services, invoice clients, write winning proposals on Upwork/LinkedIn, and build an independent business.',
                  progress: 'Starts Week 3',
                  statusColor: 'bg-slate-100 text-slate-600 border-slate-200',
                  actionLabel: 'Preview Syllabus',
                },
                {
                  title: 'Module 4: Financial Literacy & Capital Management',
                  desc: 'Budgeting project revenues, separating business funds, micro-loans, and managing equipment depreciation.',
                  progress: 'Starts Week 5',
                  statusColor: 'bg-slate-100 text-slate-600 border-slate-200',
                  actionLabel: 'Preview Syllabus',
                },
              ].map((course, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-sm transition-all space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${course.statusColor}`}>
                        {course.progress}
                      </span>
                      <BookOpen className="w-4 h-4 text-slate-400" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{course.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{course.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium">Self-Paced · Included</span>
                    <button className="text-xs font-bold text-switch-teal hover:underline flex items-center gap-1">
                      <span>{course.actionLabel}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SESSION RECORDINGS                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'session-recordings' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Live Workshop & Lecture Playback Archive
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Access 24/7 recordings of all instructor webinars, practical demonstrations, and Q&A sessions.
                </p>
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200 self-start sm:self-auto flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" />
                <span>Recorded HD Streams</span>
              </span>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'Session 1: Cohort 1.0 Orientation & Track Technical Kickoff',
                  date: 'October 11, 2026',
                  duration: '1 hr 45 mins',
                  speaker: 'Engr. Babatunde Alabi',
                  topics: 'Course expectations, grading policy, laboratory safety, practical equipment introduction.',
                  link: 'https://youtube.com',
                },
                {
                  title: 'Session 2: Deep Dive into Core Sizing, Chemistry & Inverter Topologies',
                  date: 'October 12, 2026',
                  duration: '2 hrs 10 mins',
                  speaker: 'Engr. Babatunde Alabi',
                  topics: 'Mathematical sizing calculations, battery surge capacities, and single line diagrams.',
                  link: 'https://youtube.com',
                },
              ].map((recording, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-switch-dark text-white flex items-center justify-center shrink-0 shadow-sm">
                      <PlayCircle className="w-6 h-6 text-switch-orange" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold text-slate-900">{recording.title}</span>
                      </div>
                      <p className="text-xs text-slate-600">{recording.topics}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                        <span>{recording.date}</span>
                        <span>•</span>
                        <span>{recording.duration}</span>
                        <span>•</span>
                        <span className="text-switch-teal font-semibold">{recording.speaker}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={recording.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-switch-teal hover:bg-switch-teal-700 text-white text-xs font-bold transition-colors shadow-2xs"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Watch Recording</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: ASSESSMENTS                                                        */}
        {/* ========================================================================= */}
        {activeTab === 'assessments' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Assessments & Practical Deliverables
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Submit required lab assignments, quizzes, and capstone checkpoints for instructor grading.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  Approved: <strong className="text-emerald-700">{assessmentStats.approvedCount}</strong> / {assessmentStats.totalAssigned}
                </span>
              </div>
            </div>

            {/* Assessment Task Cards */}
            <div className="space-y-4">
              {assessmentStats.assessmentsWithStatus.map((asm: any) => {
                const isApproved = asm.submission?.status === 'approved';
                const isSubmitted = Boolean(asm.submission);

                return (
                  <div key={asm.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-switch-teal bg-teal-100 px-2.5 py-0.5 rounded-md">
                          Week {asm.weekNumber}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{asm.title}</h4>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        {isApproved ? (
                          <span className="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Approved ({asm.submission.score}/100)
                          </span>
                        ) : isSubmitted ? (
                          <span className="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-300">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            Submitted (Under Instructor Review)
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-300">
                            <AlertCircle className="w-3.5 h-3.5 mr-1" />
                            Pending Submission
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {asm.description}
                    </p>

                    {/* Instructor Feedback Display if Graded */}
                    {asm.submission?.feedback && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                        <strong className="font-bold flex items-center gap-1 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Instructor Evaluation & Feedback:</span>
                        </strong>
                        <p className="text-slate-700">{asm.submission.feedback}</p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-400">
                        Max Score: <strong className="text-slate-700 font-mono">{asm.maxScore} pts</strong>
                      </div>

                      <div>
                        {isApproved ? (
                          <span className="text-xs text-emerald-600 font-bold">
                            ✓ Graded & Recorded
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedAssessmentForSub(asm)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-switch-teal hover:bg-switch-teal-700 text-white text-xs font-bold transition-colors shadow-2xs"
                          >
                            <Send className="w-3 h-3" />
                            <span>{isSubmitted ? 'Update Submission' : 'Submit Lab Assignment'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: TIMETABLE & VENUE                                                  */}
        {/* ========================================================================= */}
        {activeTab === 'timetable' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">
                Timetable & Physical Center Allocations
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Official scheduling for both virtual live sessions and Switch 1.0 regional practical hubs.
              </p>
            </div>

            {/* Official Announcement Banner */}
            <div className="p-5 bg-teal-50 border border-teal-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-switch-teal" />
                <h4 className="text-sm font-bold text-switch-teal">
                  Cohort 1.0 Hub Allocation & Attendance Notice
                </h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Attendance is mandatory for all registered practical sessions. Please present your <strong>Official Registration Slip</strong> (available under My Profile) at the security check-in desk upon arrival at the hub.
              </p>
            </div>

            {/* Timetable Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-switch-teal" />
                    <span>Virtual Stream Stream Schedule</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-teal-100 text-switch-teal text-[10px] font-bold">Live Stream</span>
                </div>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span>Friday Evening:</span>
                    <strong className="text-slate-800">6:00 PM – 8:00 PM (Theory Drill)</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span>Saturday Morning:</span>
                    <strong className="text-slate-800">10:00 AM – 1:00 PM (Live Walkthrough)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Meeting Link:</span>
                    <span className="text-switch-teal font-mono font-bold">meet.switch.ng/cohort1</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-switch-orange" />
                    <span>Physical Practical Workshop Hub</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-orange-100 text-switch-orange text-[10px] font-bold">In-Person</span>
                </div>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span>Assigned Hub:</span>
                    <strong className="text-slate-800">Switch Hub A (Lagos Central)</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span>Workshop Days:</span>
                    <strong className="text-slate-800">Saturdays (2:00 PM – 5:30 PM)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-in Requirement:</span>
                    <strong className="text-emerald-700">Registration Slip + ID</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 4. STUDENT SUBMISSION MODAL                                               */}
      {/* ========================================================================= */}
      {selectedAssessmentForSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-switch-teal uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded">
                  Assignment Submission
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {selectedAssessmentForSub.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAssessmentForSub(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {submissionFeedback && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{submissionFeedback}</span>
              </div>
            )}

            <form onSubmit={handleAssessmentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Project / Documentation Deliverable Link
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://docs.google.com/... or https://github.com/..."
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-switch-teal text-slate-900"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Paste link to your Google Doc, Drive folder, GitHub repository, or Figma board.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Student Notes / Technical Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of how you solved the lab task, components calculated, or challenges encountered..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-switch-teal text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssessmentForSub(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-switch-teal hover:bg-switch-teal-700 text-white font-bold transition-all shadow-sm disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Confirm Submission'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center bg-slate-50"><p className="text-xs text-slate-500 font-semibold">Loading Student Portal...</p></div>}>
      <DashboardContent />
    </Suspense>
  );
}
