'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function PartnerHeader() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Only the partner logos */}
        <div className="flex items-center gap-6 sm:gap-8">
          {/* The Switch Logo */}
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14">
              <Image
                src="/logos/switch-logo.svg"
                alt="The Switch 1.0"
                fill
                sizes="56px"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Divider */}
          <div className="h-9 w-[1px] bg-slate-200" />

          {/* GOFAMINT Youth Fellowship Logo */}
          <div className="relative w-11 h-11 sm:w-13 sm:h-13">
            <Image
              src="/logos/gofamint-logo.jpg"
              alt="GOFAMINT Youth Fellowship"
              fill
              sizes="52px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </header>
  );
}
