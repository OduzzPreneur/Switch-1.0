import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 text-center">
        <div className="w-14 h-14 bg-teal-50 border border-teal-200 text-switch-teal rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Compass className="w-7 h-7 text-switch-teal animate-spin" />
        </div>
        <h1 className="text-3xl font-black text-switch-dark tracking-tight mb-2">
          Page Not Found
        </h1>
        <p className="text-xs text-slate-500 mb-6">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-switch-teal hover:bg-switch-teal-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}
