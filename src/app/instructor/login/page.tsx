'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import SwitchLogo from '@/components/common/SwitchLogo';

export default function InstructorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInstructorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      // 1. Check local storage for any admin-registered instructor
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('switch_portal_instructors');
        if (stored) {
          try {
            const list = JSON.parse(stored);
            const found = list.find(
              (i: any) => i.email.toLowerCase() === email.trim().toLowerCase()
            );
            if (found) {
              if (found.status === 'pending') {
                throw new Error('Your instructor account is pending administrator review. Teaching tools will unlock once approved.');
              }
              if (found.status === 'suspended') {
                throw new Error('Your instructor access has been suspended by administration.');
              }
              localStorage.setItem('switch_instructor_session', JSON.stringify(found));
              router.push('/instructor');
              return;
            }
          } catch (e) {
            // fallback
          }
        }
      }

      // 2. Query instructor auth endpoint
      const res = await fetch('/api/instructor/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Instructor sign in failed.');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('switch_instructor_session', JSON.stringify(data.instructor));
      }

      router.push('/instructor');
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to sign in. Please verify your credentials.');
      setLoading(false);
    }
  };

  const handleQuickFill = (testEmail: string) => {
    setEmail(testEmail);
    setPassword('switch123');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-slate-900">
      <div className="max-w-md w-full bg-[#071E26] border border-amber-500/20 rounded-3xl shadow-2xl p-8 sm:p-10 relative overflow-hidden text-white">
        
        {/* Top amber accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-switch-teal" />

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-950/60 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Briefcase className="w-7 h-7 text-amber-400" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20 mb-2">
            Faculty Access
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Course Instructor Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to mark live student attendance, publish practical lab assignments, and grade submissions.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 bg-rose-950/50 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleInstructorLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Instructor Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="instructor@switch.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Password / Passcode
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-950/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-orange-600/25 disabled:opacity-60"
          >
            {loading ? (
              <span>Authenticating Instructor...</span>
            ) : (
              <>
                <span>Sign In to Instructor Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Testing helper pills */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
            Quick Testing Accounts (Method A Vetted)
          </span>
          <div className="flex flex-wrap gap-1.5 justify-center">
            <button
              type="button"
              onClick={() => handleQuickFill('babatunde.alabi@switch.ng')}
              className="text-[10px] bg-white/5 hover:bg-white/10 text-amber-300 px-2 py-1 rounded-lg border border-white/10 transition-colors"
            >
              Solar Energy Lead
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('chioma.okonkwo@switch.ng')}
              className="text-[10px] bg-white/5 hover:bg-white/10 text-emerald-300 px-2 py-1 rounded-lg border border-white/10 transition-colors"
            >
              Software Eng. Lead
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('oluwaseun.adeleke@switch.ng')}
              className="text-[10px] bg-white/5 hover:bg-white/10 text-rose-300 px-2 py-1 rounded-lg border border-white/10 transition-colors"
              title="Test pending approval gate"
            >
              UI/UX (Pending)
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          Not an instructor?{' '}
          <Link href="/login" className="font-bold text-switch-teal hover:underline">
            Student Portal
          </Link>
          {' · '}
          <Link href="/admin/login" className="font-bold text-purple-400 hover:underline">
            Admin Console
          </Link>
        </div>

      </div>
    </div>
  );
}
