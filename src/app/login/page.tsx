'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        // Successfully signed in via Supabase
        router.push('/dashboard');
      } else {
        // Fallback / Demonstration mode when Supabase credentials are pending
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('switch_student_session');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.email && parsed.email.toLowerCase() === email.toLowerCase()) {
              router.push('/dashboard');
              return;
            }
          }

          // Allow standard demo entry
          localStorage.setItem(
            'switch_student_session',
            JSON.stringify({
              fullName: email.split('@')[0].toUpperCase(),
              email,
              trackId: 'software-engineering',
              registrationNumber: 'SW1-2026-92144',
              paymentStatus: 'verified',
              amountPaid: 5000,
            })
          );
        }
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to sign in. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 relative overflow-hidden">
        
        {/* Subtle top brand accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-switch-teal via-switch-orange to-amber-500" />

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-teal-50 border border-teal-200 text-switch-teal rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Lock className="w-6 h-6 text-switch-teal" />
          </div>
          <h1 className="text-2xl font-black text-switch-dark tracking-tight">
            Student Portal Sign In
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your Switch 1.0 curriculum, timetable, and verified token status.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Registered Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-switch-teal"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-semibold text-switch-teal hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-switch-teal"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-switch-teal hover:bg-switch-teal-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow disabled:opacity-60"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          Not yet registered for Switch 1.0?{' '}
          <Link href="/register" className="font-bold text-switch-orange hover:underline">
            Register & Pay ₦5,000 Token
          </Link>
        </div>

      </div>
    </div>
  );
}
