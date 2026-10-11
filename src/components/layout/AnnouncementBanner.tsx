'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Megaphone, X, ArrowRight, Bell } from 'lucide-react';
import { ANNOUNCEMENTS } from '@/data/tracks';

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const urgentNotice = ANNOUNCEMENTS.find((a) => a.isUrgent) || ANNOUNCEMENTS[0];

  if (!isVisible || !urgentNotice) return null;

  return (
    <div className="bg-gradient-to-r from-switch-teal-700 via-switch-teal to-switch-teal-800 text-white text-xs sm:text-sm px-4 py-2.5 shadow-sm border-b border-switch-teal-600/40 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="inline-flex items-center gap-1 bg-switch-orange text-white text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 animate-pulse">
            <Bell className="w-3 h-3" />
            NOTICE
          </span>
          <p className="font-medium truncate text-white/95">
            <span className="font-semibold">{urgentNotice.title}:</span>{' '}
            <span className="text-white/80 hidden md:inline">{urgentNotice.summary}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {urgentNotice.actionUrl && (
            <Link
              href={urgentNotice.actionUrl}
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded transition-colors"
            >
              {urgentNotice.actionLabel || 'Learn More'}
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white p-0.5 rounded transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
