'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import SwitchLogo from '@/components/common/SwitchLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [passkey, setPasskey] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), passkey: passkey.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Administrative verification failed.');
      }

      // Store authenticated admin session
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'switch_admin_session',
          JSON.stringify({
            authenticated: true,
            ...data.admin,
          })
        );
      }

      router.push('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please verify administrative credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-slate-900">
      <div className="max-w-md w-full bg-[#071E26] border border-purple-500/20 rounded-3xl shadow-2xl p-8 sm:p-10 relative overflow-hidden text-white">
        
        {/* Subtle accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-switch-teal to-switch-orange" />

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-purple-950/60 border border-purple-500/30 text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Shield className="w-7 h-7 text-purple-400" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-500/20 mb-2">
            Restricted Access
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Administrative Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in with verified leadership credentials to manage tracks, instructors, and cohorts.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Demo Credentials Helper Pill */}
        <div className="mb-5 p-3 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs flex items-center justify-between gap-2">
          <div className="text-left text-[11px] text-purple-200">
            <span className="font-bold text-white block">Default Admin Account:</span>
            <span className="font-mono text-purple-300">admin@switch.ng</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail('admin@switch.ng');
              setPasskey('Switch2026@AdminSecured!');
            }}
            className="px-2.5 py-1 rounded-lg bg-purple-600/40 hover:bg-purple-600 text-purple-100 text-[10px] font-bold transition-colors border border-purple-500/30"
          >
            Auto-fill
          </button>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@switch.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Security Passkey
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPasskey ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-950/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPasskey(!showPasskey)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-purple-600/30 disabled:opacity-60"
          >
            {loading ? (
              <span>Authenticating Console...</span>
            ) : (
              <>
                <span>Access Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-slate-400">
          Not an administrator?{' '}
          <Link href="/login" className="font-bold text-switch-teal hover:underline">
            Student Login
          </Link>
          {' · '}
          <Link href="/instructor/login" className="font-bold text-amber-400 hover:underline">
            Instructor Portal
          </Link>
        </div>

      </div>
    </div>
  );
}
