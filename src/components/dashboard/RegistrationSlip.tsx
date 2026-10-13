'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, Download, Printer, Award, QrCode } from 'lucide-react';
import SwitchLogo from '@/components/common/SwitchLogo';

interface RegistrationSlipProps {
  student: {
    fullName: string;
    email: string;
    phone: string;
    registrationNumber: string;
    trackTitle: string;
    trackCategory: string;
    learningMode: string;
    stateOfResidence: string;
    gender: string;
    ageBracket: string;
    paymentReference: string;
    amountPaid: number;
    verifiedAt?: string;
  };
  onClose?: () => void;
}

export default function RegistrationSlip({ student, onClose }: RegistrationSlipProps) {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = student.verifiedAt
    ? new Date(student.verifiedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'October 2026';

  return (
    <div className="space-y-4">
      {/* Action Controls for Screen View */}
      <div className="flex items-center justify-between print:hidden bg-slate-900 text-white p-4 rounded-2xl shadow-md">
        <div>
          <h4 className="text-sm font-bold">Official Registration Slip</h4>
          <p className="text-xs text-slate-400">Tamper-proof enrollment verification certificate</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-switch-teal hover:bg-switch-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Slip Sheet (Printable A4 Target) */}
      <div
        id="registration-slip-printable"
        className="bg-white text-slate-900 border-2 border-slate-300 rounded-3xl p-6 sm:p-10 shadow-xl max-w-3xl mx-auto relative overflow-hidden print:border-none print:shadow-none print:p-0 print:m-0"
      >
        {/* Subtle Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <SwitchLogo className="w-[500px] h-[500px]" />
        </div>

        {/* Top Header */}
        <div className="border-b-2 border-slate-800 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SwitchLogo className="w-14 h-14" />
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950">
                  SWITCH 1.0
                </h1>
                <p className="text-xs font-bold text-switch-teal uppercase tracking-widest">
                  Youth Tech & Vocational Empowerment Platform
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  In Partnership with GOFAMINT Youth Fellowship (GYF)
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                VERIFIED ENROLLMENT
              </span>
              <div className="text-xs font-mono font-bold text-slate-700">
                SLIP REF: {student.registrationNumber}
              </div>
            </div>
          </div>
        </div>

        {/* Student Credential Header Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-switch-teal text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-white ring-2 ring-switch-teal/20">
              {student.fullName ? student.fullName.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-950">
                {student.fullName}
              </h2>
              <div className="text-xs text-slate-600 font-medium">
                Cohort 1.0 Participant · <span>{student.email}</span>
              </div>
              <div className="text-xs text-switch-teal font-bold mt-0.5">
                {student.phone}
              </div>
            </div>
          </div>

          <div className="text-center sm:text-right bg-white p-3 rounded-xl border border-slate-200 shadow-2xs w-full sm:w-auto">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Registration ID</div>
            <div className="text-lg font-black font-mono text-switch-dark tracking-wide">
              {student.registrationNumber}
            </div>
          </div>
        </div>

        {/* Academic & Program Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Enrolled Discipline
            </span>
            <div className="text-sm font-black text-slate-900">
              {student.trackTitle}
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <span className="px-2 py-0.5 rounded bg-teal-50 text-switch-teal font-bold text-[10px]">
                {student.trackCategory} Discipline
              </span>
              <span>•</span>
              <span className="font-semibold">{student.learningMode}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Personal & Center Details
            </span>
            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px]">State:</span>
                <span className="font-bold">{student.stateOfResidence}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Gender:</span>
                <span className="font-bold">{student.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Age Bracket:</span>
                <span className="font-bold">{student.ageBracket}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Admission Cohort:</span>
                <span className="font-bold text-switch-teal">Cohort 1.0 (2026)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial & Verification Stamp Card */}
        <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Token Registration Fee Paid & Verified</span>
            </div>
            <p className="text-xs text-emerald-800">
              Amount: <strong className="font-mono">₦{student.amountPaid.toLocaleString()} NGN</strong> · Confirmed via Paystack Secure Cloud Gateway
            </p>
            <div className="text-[11px] font-mono text-emerald-700">
              Transaction Reference: <span className="font-bold">{student.paymentReference}</span>
            </div>
          </div>

          <div className="shrink-0 text-center sm:text-right">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Verification Date</span>
            <span className="text-xs font-bold text-slate-800">{formattedDate}</span>
          </div>
        </div>

        {/* Security Barcode & Signature Footer */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-slate-100 rounded-xl border border-slate-300 flex items-center justify-center p-1.5">
              <QrCode className="w-12 h-12 text-slate-800" />
            </div>
            <div className="text-[10px] text-slate-500 font-mono space-y-0.5">
              <div>HASH: SHA256-SW1-{student.registrationNumber.slice(-5)}</div>
              <div>TAMPER-PROOF VERIFIED RECORD</div>
              <div>SWITCH INITIATIVE / GYF EMPOWERMENT</div>
            </div>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <div className="h-8 flex items-end justify-center sm:justify-end">
              <span className="font-serif italic font-bold text-sm text-slate-800 border-b border-slate-400 pb-0.5 px-4">
                Dean O. Babatunde
              </span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Central Admissions & Certification Office
            </div>
          </div>
        </div>

        {/* Important Terms Footer */}
        <div className="mt-6 pt-3 border-t border-slate-100 text-[9px] text-slate-400 text-center leading-relaxed">
          This document serves as proof of student registration for Switch 1.0 Cohort 1.0. Present this slip or digital copy on physical hub workshop orientation days. Retention of this record is mandatory for graduation credential issuance.
        </div>
      </div>
    </div>
  );
}
