'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TRACKS } from '@/data/tracks';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  BookOpen,
  Download,
  Lock,
  LogOut,
  ExternalLink,
  Clock,
  Sparkles,
  Award,
  Video,
  FileText,
  AlertCircle,
  Bell,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'schedule' | 'resources'>('overview');
  
  const [student, setStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if session exists in localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('switch_student_session');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setStudent(parsed);
          setLoading(false);
          return;
        } catch (e) {
          console.error(e);
        }
      }
    }

    // If no student session found, redirect to login
    router.push('/login');
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('switch_student_session');
    }
    router.push('/login');
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

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20">
      
      {/* Reference Image 1 Inspired Student Profile Ribbon */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Left: Avatar initial + Name + Mode */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-switch-teal text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-white ring-2 ring-switch-teal/20">
                {student.fullName ? student.fullName.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    {student.fullName}
                  </h2>
                  <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Verified Student
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                  <span className="text-switch-teal font-semibold">Self-paced · Cohort 1.0</span>
                  <span>•</span>
                  <span>ID: <strong className="font-mono text-slate-700">{student.registrationNumber}</strong></span>
                </div>
              </div>
            </div>

            {/* Right: Quick action pills (matching Image 1 layout) */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <a
                href="#curriculum"
                onClick={() => setActiveTab('curriculum')}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-colors shadow-2xs"
              >
                Jump to my week
              </a>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-colors shadow-2xs inline-flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>Save registration slip</span>
              </button>
              <Link
                href="/forgot-password"
                className="px-3 py-1.5 rounded-lg border border-switch-teal/30 bg-teal-50/50 hover:bg-teal-50 text-switch-teal font-semibold transition-colors shadow-2xs"
              >
                Change password
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-semibold transition-colors shadow-2xs inline-flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                <span>Lock / Exit</span>
              </button>
              <span className="text-[10px] text-slate-400 font-mono pl-1">v1.0</span>
            </div>

          </div>
        </div>
      </div>

      {/* Secondary Dashboard Navigation Tabs (Matching Image 1) */}
      <div className="bg-switch-dark text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto text-xs py-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-bold rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-switch-teal text-white border-b-2 border-switch-orange'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-4 py-2 font-bold rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === 'curriculum'
                  ? 'bg-switch-teal text-white border-b-2 border-switch-orange'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Track Curriculum
            </button>
            <Link
              href="/coming-soon?module=Blueprint Courses"
              className="px-4 py-2 font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-t-lg transition-colors whitespace-nowrap"
            >
              Blueprint Courses <span className="text-[9px] text-orange-400 font-normal">(Coming Soon)</span>
            </Link>
            <Link
              href="/coming-soon?module=Session Recordings"
              className="px-4 py-2 font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-t-lg transition-colors whitespace-nowrap"
            >
              Session Recordings <span className="text-[9px] text-orange-400 font-normal">(Coming Soon)</span>
            </Link>
            <Link
              href="/coming-soon?module=Assessments"
              className="px-4 py-2 font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-t-lg transition-colors whitespace-nowrap"
            >
              Assessments <span className="text-[9px] text-orange-400 font-normal">(Coming Soon)</span>
            </Link>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 font-bold rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === 'schedule'
                  ? 'bg-switch-teal text-white border-b-2 border-switch-orange'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Timetable & Venues
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Dynamic Action Required Announcement */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-4 shadow-xs">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-xl shrink-0 mt-0.5">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
              <span>Official Cohort 1.0 Action Notice</span>
              <span className="text-[10px] font-extrabold uppercase bg-amber-200/80 text-amber-800 px-2 py-0.5 rounded">Action Center</span>
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Welcome to Switch 1.0! Training dates and physical center allocations across designated <strong>GOFAMINT Youth Fellowship hubs</strong> are currently being assigned. Ensure your contact details and WhatsApp phone number are kept active.
            </p>
          </div>
        </div>

        {/* Tab 1: Overview */}
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

              {/* Weekly Progress Bar */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Cohort 1.0 Milestone Progress</span>
                  <span className="text-switch-teal">Week 1 of {enrolledTrack.durationWeeks}</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="w-[12%] h-full bg-gradient-to-r from-switch-teal to-teal-500 rounded-full" />
                </div>
                <div className="text-[11px] text-slate-500">
                  Orientation and foundational modules kicking off.
                </div>
              </div>
            </div>

            {/* Verified Payment & Registration Details */}
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
                    <span className="font-bold text-slate-800">{student.learningMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Certification:</span>
                    <span className="font-bold text-slate-800">Tamper-Proof Digital</span>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Registration Slip</span>
                </button>
              </div>

              {/* Partner Sponsorship Note */}
              <div className="bg-gradient-to-br from-switch-teal to-switch-dark text-white rounded-3xl p-6 shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">
                    Sponsorship Partner
                  </span>
                </div>
                <h4 className="text-base font-bold">
                  GOFAMINT Youth Fellowship (GYF)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Equipping you with industry-grade capacity and economic independence in partnership with GOFAMINT Youth Fellowship.
                </p>
                <div className="text-[10px] text-emerald-300 font-bold">
                  • GYF: Strong & Able
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Curriculum Outline */}
        {activeTab === 'curriculum' && (
          <div id="curriculum" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">
                {enrolledTrack.title} · Week-by-Week Roadmap
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Practical, outcome-oriented curriculum designed for rapid capability growth.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { week: 'Week 1–2', title: 'Foundations & Tooling Setup', desc: 'Core fundamentals, safety/environment installation, essential theory, and baseline evaluation.' },
                { week: 'Week 3–5', title: 'Hands-on Technical Drills & Component Architecture', desc: 'Diving deep into practical exercises, live demonstrations, and mentor-guided labs.' },
                { week: 'Week 6–8', title: 'Applied Projects & Real-World Case Studies', desc: 'Building actual working prototypes, client-style deliverables, and resolving real-world failure modes.' },
                { week: 'Week 9–10', title: 'Optimization, Compliance & Industry Standards', desc: 'Performance tuning, safety auditing, code review or technical craftsmanship refinement.' },
                { week: 'Week 11–12', title: 'Capstone Showcase & Certification Assessment', desc: 'Final project defense, portfolio compilation, graduation evaluation, and digital credential issuance.' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-switch-teal bg-teal-100/60 px-2 py-0.5 rounded">
                      {item.week}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600">{item.desc}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto shrink-0">
                    Included in ₦5,000 Token
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Timetable & Venues */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">
                Timetable & Physical Center Allocations
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Session scheduling for virtual streams and GOFAMINT Youth Fellowship physical hubs.
              </p>
            </div>

            <div className="p-5 bg-teal-50 border border-teal-200 rounded-2xl space-y-2">
              <h4 className="text-sm font-bold text-switch-teal">
                Announcement Update: Cohort 1.0 Center Allocations
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                As announced by the central organizing committee, exact physical centers and virtual live stream links will be populated here 72 hours prior to week 1 orientation. You will also receive an SMS notification on your registered phone number.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-slate-900">Virtual Stream Schedule:</span>
                <p className="text-slate-600">Weekend evening sessions + weekday recorded playback available 24/7 on the portal.</p>
              </div>
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-slate-900">Physical Practical Workshops:</span>
                <p className="text-slate-600">Conducted at designated regional GOFAMINT youth empowerment centers with certified technical mentors.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
