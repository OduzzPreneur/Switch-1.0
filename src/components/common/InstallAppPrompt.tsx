'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share2, PlusSquare } from 'lucide-react';
import SwitchLogo from '@/components/common/SwitchLogo';

export default function InstallAppPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSTip, setShowIOSTip] = useState(false);

  useEffect(() => {
    // 1. Don't show if already running in standalone PWA mode
    if (typeof window === 'undefined') return;

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    // 2. Check if user dismissed recently (dismissed for 3 days)
    const dismissedTime = localStorage.getItem('switch_app_install_dismissed');
    if (dismissedTime) {
      const daysSinceDismiss = (Date.now() - Number(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss < 3) return;
    }

    // 3. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // 4. Capture native browser beforeinstallprompt (Android / Chrome / Edge / Desktop)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Reveal prompt after short pleasant delay
      setTimeout(() => setShowPrompt(true), 2500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If on iOS or mobile device and no prompt fired after 4 seconds, show gentle install option
    const timer = setTimeout(() => {
      if (isIosDevice) {
        setShowPrompt(true);
      }
    }, 4000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setShowPrompt(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    } else if (isIOS) {
      setShowIOSTip(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('switch_app_install_dismissed', Date.now().toString());
    }
  };

  if (!showPrompt) return null;

  return (
    <aside
      aria-label="Install Switch 1.0 App"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
      <div className="bg-[#071E26]/95 backdrop-blur-md text-white rounded-2xl border border-switch-teal/40 shadow-2xl p-4 relative overflow-hidden">
        {/* Top vibrant brand bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-switch-teal via-switch-orange to-amber-400" />

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Dismiss install prompt"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 pr-6">
          <div className="w-11 h-11 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shrink-0 shadow-md">
            <SwitchLogo className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-white tracking-tight">
                Install Switch 1.0 App
              </h4>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-switch-teal/30 text-teal-300 border border-teal-500/30">
                PWA
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              Add to your home screen for fast one-tap access to courses, timetable, and attendance.
            </p>
          </div>
        </div>

        {/* iOS Specific Instructions Tooltip */}
        {showIOSTip && isIOS && (
          <div className="mt-3 p-2.5 rounded-xl bg-white/10 border border-white/15 text-[11px] text-slate-200 space-y-1 animate-in fade-in">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <Share2 className="w-3.5 h-3.5" />
              <span>How to Install on iPhone / iPad:</span>
            </div>
            <p className="leading-relaxed">
              1. Tap the <strong>Share</strong> button at the bottom of Safari.<br />
              2. Scroll down and select <strong>&quot;Add to Home Screen&quot;</strong>.
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={handleDismiss}
            className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors px-2 py-1.5"
          >
            Not now
          </button>

          <button
            onClick={handleInstallClick}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-switch-teal to-teal-600 hover:from-switch-orange hover:to-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all transform active:scale-95"
          >
            {isIOS && !showIOSTip ? (
              <>
                <Share2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Show How to Install</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Install App</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
