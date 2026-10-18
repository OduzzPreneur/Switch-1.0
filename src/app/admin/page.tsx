'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TRACKS, findTrackById } from '@/data/tracks';
import {
  getInstructors,
  getAttendanceRecords,
  getSubmissions,
  getOrInitDefaultStudent,
  Instructor,
} from '@/lib/portalState';
import {
  syncFetchInstructors,
  syncCreateInstructor,
  syncUpdateInstructorStatus,
} from '@/lib/portalApi';
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserCheck,
  Users,
  BookOpen,
  Plus,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Award,
  Layers,
  Calendar,
  LogOut,
  Key,
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');

  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [activeTab, setActiveTab] = useState<'instructors' | 'students'>('instructors');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add Instructor Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmittingInst, setIsSubmittingInst] = useState(false);
  const [newInstData, setNewInstData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    trackId: TRACKS[0].id,
    bio: '',
    experienceYears: 1,
  });

  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Check Admin Session Guard via Server Endpoint + local metadata
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        if (!res.ok || !data.success) {
          router.replace('/admin/login');
          return;
        }
        if (isMounted) {
          setAdminEmail(data.admin?.email || 'admin@switch.ng');
          setCheckingAuth(false);
        }
      } catch {
        router.replace('/admin/login');
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);

  // Load Instructors with Supabase sync + local fallback
  useEffect(() => {
    if (!checkingAuth) {
      syncFetchInstructors().then((list) => {
        setInstructors(list);
      });
    }
  }, [checkingAuth]);

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch (e) {
      // fallback
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('switch_admin_session');
    }
    router.replace('/admin/login');
  };

  const handleApprove = async (id: string, name: string) => {
    await syncUpdateInstructorStatus(id, 'approved');
    const updated = await syncFetchInstructors();
    setInstructors(updated);
    setActionNotice(`Instructor ${name} has been approved! They can now access attendance and assessments in the instructor portal.`);
    setTimeout(() => setActionNotice(null), 6000);
  };

  const handleSuspend = async (id: string, name: string) => {
    await syncUpdateInstructorStatus(id, 'suspended');
    const updated = await syncFetchInstructors();
    setInstructors(updated);
    setActionNotice(`Instructor ${name} access has been suspended.`);
    setTimeout(() => setActionNotice(null), 6000);
  };

  const handleOpenAsInstructor = (inst: Instructor) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'switch_instructor_session',
        JSON.stringify({
          authenticated: true,
          instructor: inst,
          token: `switch_inst_token_${Date.now()}`,
        })
      );
    }
    router.push('/instructor');
  };

  const handleAddInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstData.fullName.trim() || !newInstData.email.trim() || !newInstData.password.trim()) return;

    setIsSubmittingInst(true);
    try {
      const passToUse = newInstData.password.trim();
      const created = await syncCreateInstructor({
        fullName: newInstData.fullName.trim(),
        email: newInstData.email.trim(),
        phone: newInstData.phone.trim(),
        trackId: newInstData.trackId,
        password: passToUse,
        bio: newInstData.bio.trim(),
        experienceYears: Number(newInstData.experienceYears) || 1,
        status: 'approved',
      });

      const freshList = await syncFetchInstructors();
      setInstructors(freshList);
      setShowAddModal(false);
      setActionNotice(
        `✓ Provisioned ${created.fullName}! Credentials: Email: ${created.email} | Passcode: ${passToUse}. Login active at /instructor/login.`
      );
      setNewInstData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        trackId: TRACKS[0].id,
        bio: '',
        experienceYears: 1,
      });
      setTimeout(() => setActionNotice(null), 10000);
    } finally {
      setIsSubmittingInst(false);
    }
  };

  // Metrics
  const pendingCount = instructors.filter((i) => i.status === 'pending').length;
  const approvedCount = instructors.filter((i) => i.status === 'approved').length;
  const attendanceCount = getAttendanceRecords().length;
  const student = getOrInitDefaultStudent();

  // Filtered instructors
  const filteredInstructors = instructors.filter((inst) => {
    const matchesStatus = statusFilter === 'all' || inst.status === statusFilter;
    const matchesSearch =
      inst.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.trackId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest font-bold text-slate-400">Verifying Admin Credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="bg-[#071E26] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                <Shield className="w-3.5 h-3.5" />
                <span>Switch 1.0 Central Administration</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Admin Management Console
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Approve course instructors, assign tracks, provision faculty credentials, and oversee attendance across all 12 tracks.
              </p>
            </div>

            {/* Admin Profile & Logout Control */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 px-3.5 py-2 rounded-2xl flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold text-xs">
                  ADM
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">{adminEmail || 'admin@switch.ng'}</div>
                  <div className="text-[10px] text-purple-300 font-semibold">Master Administrator</div>
                </div>
              </div>

              <button
                onClick={handleAdminLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors shadow-2xs"
                title="Sign out of Admin Console"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          <ShieldCheck className="absolute -right-6 -bottom-6 w-48 h-48 text-white/5 pointer-events-none" />
        </div>

        {/* Global Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Instructors</span>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{instructors.length}</div>
            <div className="text-[11px] text-emerald-600 font-bold">{approvedCount} Approved · {pendingCount} Pending</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Approvals</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600">{pendingCount}</div>
            <div className="text-[11px] text-slate-500">Awaiting admin review</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Enrolled Students</span>
              <UserCheck className="w-5 h-5 text-switch-teal" />
            </div>
            <div className="text-2xl font-black text-slate-900">1+ Registered</div>
            <div className="text-[11px] text-emerald-600 font-bold">100% Fee Verified</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Logged</span>
              <Calendar className="w-5 h-5 text-switch-orange" />
            </div>
            <div className="text-2xl font-black text-slate-900">{attendanceCount} Records</div>
            <div className="text-[11px] text-slate-500">Across practical labs</div>
          </div>
        </div>

        {/* Action Notification Alert */}
        {actionNotice && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs sm:text-sm flex items-center gap-3 shadow-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{actionNotice}</span>
          </div>
        )}

        {/* Tab Controls & Search Filter Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('instructors')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'instructors'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Instructor Approval & Roster ({instructors.length})
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'students'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Student Enrollment Directory
              </button>
            </div>

            {activeTab === 'instructors' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shadow-2xs self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Instructor Applicant</span>
              </button>
            )}
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: INSTRUCTOR APPROVAL & MANAGEMENT                                  */}
          {/* ========================================================================= */}
          {activeTab === 'instructors' && (
            <div className="space-y-4">
              
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by instructor name, email, track..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="all">All Instructors ({instructors.length})</option>
                    <option value="pending">Pending Approval ({pendingCount})</option>
                    <option value="approved">Approved ({approvedCount})</option>
                  </select>
                </div>
              </div>

              {/* Instructors Table / List */}
              <div className="space-y-3 pt-2">
                {filteredInstructors.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No instructors found matching the current filters.
                  </div>
                ) : (
                  filteredInstructors.map((inst) => {
                    const trackObj = findTrackById(inst.trackId);
                    const isApproved = inst.status === 'approved';
                    const isPending = inst.status === 'pending';

                    return (
                      <div
                        key={inst.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          isPending
                            ? 'border-amber-300 bg-amber-50/40'
                            : 'border-slate-200 bg-white hover:bg-slate-50/70'
                        } flex flex-col md:flex-row md:items-center justify-between gap-4`}
                      >
                        {/* Instructor Info */}
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 ${
                            isApproved ? 'bg-purple-600 text-white' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {inst.fullName.charAt(0)}
                          </div>
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-bold text-slate-900">{inst.fullName}</h3>
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                                isApproved
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : isPending
                                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                                  : 'bg-rose-50 text-rose-700 border-rose-300'
                              }`}>
                                {isApproved ? 'Approved Instructor' : isPending ? 'Pending Approval' : 'Suspended'}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                              {inst.email} · {inst.phone}
                            </div>
                            <p className="text-xs text-slate-600 pt-0.5 line-clamp-2 max-w-xl">
                              {inst.bio}
                            </p>
                            <div className="flex items-center gap-2 pt-1 text-[11px]">
                              <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                Track: {trackObj?.title || inst.trackId}
                              </span>
                              <span className="text-slate-400">
                                Experience: {inst.experienceYears} Years
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Approval Action Controls */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0">
                          {isPending ? (
                            <button
                              onClick={() => handleApprove(inst.id, inst.fullName)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Approve Instructor</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                Active Instructor
                              </span>
                              <button
                                onClick={() => handleSuspend(inst.id, inst.fullName)}
                                className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                              >
                                Suspend
                              </button>
                            </div>
                          )}

                          <button
                            onClick={() => handleOpenAsInstructor(inst)}
                            className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                            title="Launch Instructor Workspace as this instructor"
                          >
                            <span>Launch Workspace</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: STUDENT ENROLLMENT DIRECTORY                                       */}
          {/* ========================================================================= */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              {student ? (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-switch-teal text-white flex items-center justify-center font-black text-xl">
                      {student?.fullName ? student.fullName.charAt(0) : 'S'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{student?.fullName}</h4>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Verified Paid (₦5,000)
                        </span>
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        Reg ID: <strong className="font-mono text-switch-teal">{student?.registrationNumber}</strong> · {student?.email}
                      </div>
                      <div className="text-slate-600 mt-0.5">
                        Track: <strong>{findTrackById(student?.trackId)?.title}</strong> ({student?.learningMode})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-switch-teal hover:bg-switch-teal-700 text-white font-bold transition-colors"
                    >
                      <span>View Student Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                  No active student session in local cache. Registered student records are persisted securely in the Supabase database.
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Add Instructor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Provision New Course Instructor
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct Admin Provisioning: Assign course track and set the instructor login passcode.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddInstructor} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Instructor Full Name & Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Amina Bello or Engr. John Doe"
                  value={newInstData.fullName}
                  onChange={(e) => setNewInstData({ ...newInstData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="instructor@switch.ng"
                    value={newInstData.email}
                    onChange={(e) => setNewInstData({ ...newInstData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 000 0000"
                    value={newInstData.phone}
                    onChange={(e) => setNewInstData({ ...newInstData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Assigned Teaching Track
                  </label>
                  <select
                    value={newInstData.trackId}
                    onChange={(e) => setNewInstData({ ...newInstData, trackId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900 font-medium"
                  >
                    {TRACKS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Login Passcode
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter secure passcode"
                    value={newInstData.password}
                    onChange={(e) => setNewInstData({ ...newInstData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Professional Bio & Technical Background
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of practical field expertise, previous projects, certifications..."
                  value={newInstData.bio}
                  onChange={(e) => setNewInstData({ ...newInstData, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900 font-medium"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 text-[11px] leading-relaxed">
                The instructor will be provisioned directly with active approval. They can immediately log in at <code className="bg-purple-100 px-1 py-0.5 rounded text-purple-800 font-mono">/instructor/login</code> with the email and passcode specified above.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                  disabled={isSubmittingInst}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingInst}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  {isSubmittingInst ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Provisioning...</span>
                    </>
                  ) : (
                    <span>Provision & Authorize</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
