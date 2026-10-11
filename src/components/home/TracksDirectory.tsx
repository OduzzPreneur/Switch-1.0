'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TRACKS } from '@/data/tracks';
import { TrackCategory } from '@/types';
import { Search, Sparkles, Clock, CheckCircle2, ArrowRight, Laptop, Wrench, Shield } from 'lucide-react';

export default function TracksDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<'All' | TrackCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTracks = TRACKS.filter((track) => {
    const matchesCategory = selectedCategory === 'All' || track.category === selectedCategory;
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      track.toolsCovered.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="tracks" className="py-20 bg-slate-50 text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-switch-teal/10 text-switch-teal text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-switch-orange" />
            Empowerment Curriculum
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-switch-dark tracking-tight">
            12 High-Income Tech & Vocational Tracks
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Carefully curated to meet modern industry demands. Select your discipline, acquire actionable skills, and step into financial independence.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === 'All'
                  ? 'bg-switch-teal text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All 12 Tracks
            </button>
            <button
              onClick={() => setSelectedCategory('Tech')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === 'Tech'
                  ? 'bg-switch-teal text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Laptop className="w-3.5 h-3.5 text-switch-orange" />
              Tech Tracks (6)
            </button>
            <button
              onClick={() => setSelectedCategory('Vocational')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === 'Vocational'
                  ? 'bg-switch-teal text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-switch-orange" />
              Vocational Trades (6)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tracks, skills, or tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-switch-teal focus:border-transparent transition-all"
            />
          </div>

        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTracks.map((track) => (
            <div
              key={track.id}
              className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
            >
              {/* Card Top Banner */}
              <div className="p-6 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      track.category === 'Tech'
                        ? 'bg-teal-50 text-switch-teal border-teal-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {track.category === 'Tech' ? (
                      <Laptop className="w-3 h-3 mr-1 text-switch-teal" />
                    ) : (
                      <Wrench className="w-3 h-3 mr-1 text-amber-600" />
                    )}
                    {track.category}
                  </span>

                  <span className="inline-flex items-center text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3 mr-1" />
                    {track.durationWeeks} Weeks
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-switch-teal transition-colors min-h-[3.25rem] flex items-center leading-snug">
                  {track.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed min-h-[2rem]">
                  {track.tagline}
                </p>
              </div>

              {/* Card Middle: Skills & Tools */}
              <div className="p-6 pt-4 flex-1 flex flex-col justify-between space-y-4">
                
                {/* Core Skills */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Core Competencies
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {track.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 mr-1 shrink-0" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Practical Tools */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Tools & Equipment
                  </div>
                  <p className="text-xs text-slate-600 font-medium line-clamp-2 min-h-[2rem] leading-relaxed">
                    {track.toolsCovered.join(' · ')}
                  </p>
                </div>

                {/* Career Outcome */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Career Opportunities
                  </div>
                  <p className="text-xs text-slate-700 font-semibold line-clamp-2 min-h-[2rem] leading-relaxed">
                    {track.careerRoles.join(' · ')}
                  </p>
                </div>

              </div>

              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Registration</span>
                  <span className="text-sm font-extrabold text-switch-teal">
                    ₦5,000
                  </span>
                </div>

                <Link
                  href={`/register?track=${track.id}`}
                  className="inline-flex items-center gap-1.5 bg-switch-teal hover:bg-switch-orange text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                  <span>Select Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* Empty state if search yield no tracks */}
        {filteredTracks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-600 font-medium">No tracks matched &quot;{searchQuery}&quot;.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 text-xs font-bold text-switch-teal underline"
            >
              Reset Search & Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
