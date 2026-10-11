'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TRACKS } from '@/data/tracks';
import { TOKEN_AMOUNT_NGN } from '@/lib/security';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  User,
  BookOpen,
  Sparkles,
  AlertCircle,
  Clock,
  Printer,
} from 'lucide-react';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara'
];

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    ageBracket: '21-25',
    gender: 'Male',
    stateOfResidence: 'Lagos',
    learningMode: 'Online / Virtual',
    trackId: TRACKS[0].id,
    password: '',
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<any | null>(null);

  // Pre-select track if query param exists
  useEffect(() => {
    const trackParam = searchParams.get('track');
    if (trackParam && TRACKS.some((t) => t.id === trackParam)) {
      setFormData((prev) => ({ ...prev, trackId: trackParam }));
    }
  }, [searchParams]);

  const selectedTrack = TRACKS.find((t) => t.id === formData.trackId) || TRACKS[0];

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      setErrorMsg('Please enter your full legal name (minimum 3 characters).');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please provide a valid email address for your student portal.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMsg('Please provide a valid phone number for SMS cohort updates.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setErrorMsg('Please choose a password with at least 6 characters for your portal.');
      return;
    }

    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStep(3);
  };

  // Trigger Paystack Payment
  const handlePayment = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Send registration payload to server route
      const res = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: TOKEN_AMOUNT_NGN,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Payment initialization failed. Please try again.');
      }

      // 2. If mock/demo mode or direct callback
      if (data.mock || data.data?.authorization_url?.includes('mock=true')) {
        // Complete mock registration directly
        await verifyAndCompleteRegistration(data.reference || `MOCK_REF_${Date.now()}`);
      } else if (data.data?.authorization_url) {
        // Redirect to real Paystack gateway
        window.location.href = data.data.authorization_url;
      } else {
        throw new Error('Unable to retrieve payment checkout window.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during payment processing.');
      setIsSubmitting(false);
    }
  };

  const verifyAndCompleteRegistration = async (reference: string) => {
    try {
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference,
          studentData: formData,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.message || 'Verification could not be finalized.');
      }

      // Save student profile to local storage for portal session demonstration
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'switch_student_session',
          JSON.stringify(verifyData.registration)
        );
      }

      setRegistrationSuccess(verifyData.registration);
      setIsSubmitting(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Please contact support.');
      setIsSubmitting(false);
    }
  };

  // SUCCESS RECEIPT SCREEN
  if (registrationSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Token Verified & Slot Confirmed
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-switch-dark">
            Welcome to Switch 1.0!
          </h2>
          <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
            Your registration fee of <strong>₦{TOKEN_AMOUNT_NGN.toLocaleString()}</strong> has been securely confirmed. Your student record has been generated.
          </p>

          {/* Receipt Breakdown Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 my-8 text-left space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Student Name:</span>
              <span className="font-bold text-slate-800">{registrationSuccess.fullName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Registration Number:</span>
              <span className="font-bold text-switch-teal">{registrationSuccess.registrationNumber}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Enrolled Track:</span>
              <span className="font-bold text-slate-800">{selectedTrack.title}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Category:</span>
              <span className="font-bold text-slate-800">{selectedTrack.category}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Amount Paid:</span>
              <span className="font-bold text-emerald-600">₦{TOKEN_AMOUNT_NGN.toLocaleString()} (Verified)</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Payment Ref:</span>
              <span className="text-slate-600 text-[11px] truncate max-w-[200px]">{registrationSuccess.paymentReference}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-switch-teal hover:bg-switch-teal-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md"
            >
              <span>Access Student Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-3.5 rounded-xl text-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Registration Slip</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-switch-orange/10 text-switch-orange text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-switch-orange" />
          Cohort 1.0 Enrollment
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-switch-dark tracking-tight">
          Student Onboarding & Registration
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
          Complete your profile, choose your track from the 12 disciplines, and finalize your subsidized <strong>₦5,000</strong> token payment.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mt-8 max-w-md mx-auto">
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 1 ? 'text-switch-teal' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-switch-teal text-white' : 'bg-slate-200'}`}>1</span>
            <span>Profile</span>
          </div>
          <div className="w-8 h-[2px] bg-slate-200" />
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 2 ? 'text-switch-teal' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-switch-teal text-white' : 'bg-slate-200'}`}>2</span>
            <span>Track</span>
          </div>
          <div className="w-8 h-[2px] bg-slate-200" />
          <div className={`flex items-center gap-2 text-xs font-bold ${step === 3 ? 'text-switch-teal' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 3 ? 'bg-switch-teal text-white' : 'bg-slate-200'}`}>3</span>
            <span>Token Payment</span>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Registration Alert: </strong>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {/* Step 1: Personal & Demographic Info */}
      {step === 1 && (
        <form onSubmit={handleNextStep1} className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-switch-teal" />
              <span>Step 1: Personal Information</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Required for your official student record and digital certificate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Full Name (Legal Name) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tobi Isaac Odubona"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-switch-teal"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. tobi@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-switch-teal"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Phone Number (WhatsApp Active) *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 08012345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-switch-teal"
              />
            </div>

            {/* Age Bracket */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Age Bracket *
                </label>
                <span className="text-[10px] text-emerald-600 font-bold">Ages 15 to 40</span>
              </div>
              <select
                value={formData.ageBracket}
                onChange={(e) => setFormData({ ...formData, ageBracket: e.target.value as any })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-switch-teal"
              >
                <option value="15-20">15 – 20 Years</option>
                <option value="21-25">21 – 25 Years</option>
                <option value="26-30">26 – 30 Years</option>
                <option value="31-35">31 – 35 Years</option>
                <option value="36-40">36 – 40 Years</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-switch-teal"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* State of Residence */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                State of Residence (Nigeria) *
              </label>
              <select
                value={formData.stateOfResidence}
                onChange={(e) => setFormData({ ...formData, stateOfResidence: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-switch-teal"
              >
                {NIGERIAN_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Portal Password *
              </label>
              <input
                type="password"
                required
                placeholder="Choose a password (min 6 chars)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-switch-teal"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-switch-teal hover:bg-switch-teal-700 text-white font-bold px-7 py-3 rounded-xl text-sm transition-all shadow"
            >
              <span>Continue to Track Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Track Selection */}
      {step === 2 && (
        <form onSubmit={handleNextStep2} className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-switch-teal" />
              <span>Step 2: Choose Your Track</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select one of the 12 Tech & Vocational disciplines for Switch 1.0 Cohort.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto p-1">
            {TRACKS.map((t) => {
              const isSelected = formData.trackId === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setFormData({ ...formData, trackId: t.id })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-switch-teal bg-teal-50/50 ring-2 ring-switch-teal shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.category === 'Tech' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'}`}>
                      {t.category} Track
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {t.durationWeeks} Weeks
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {t.tagline}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Delivery Mode Choice */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Preferred Learning Format *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors ${
                  formData.learningMode === 'Online / Virtual'
                    ? 'border-switch-teal bg-teal-50/40 text-switch-teal font-bold'
                    : 'border-slate-200 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="learningMode"
                  value="Online / Virtual"
                  checked={formData.learningMode === 'Online / Virtual'}
                  onChange={() => setFormData({ ...formData, learningMode: 'Online / Virtual' })}
                  className="text-switch-teal"
                />
                <span className="text-xs">100% Online / Virtual Streams</span>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors ${
                  formData.learningMode === 'Physical Center / Hybrid'
                    ? 'border-switch-teal bg-teal-50/40 text-switch-teal font-bold'
                    : 'border-slate-200 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="learningMode"
                  value="Physical Center / Hybrid"
                  checked={formData.learningMode === 'Physical Center / Hybrid'}
                  onChange={() => setFormData({ ...formData, learningMode: 'Physical Center / Hybrid' })}
                  className="text-switch-teal"
                />
                <span className="text-xs">Physical Center / Hybrid Sessions</span>
              </label>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Note: Specific physical venue allocations will be communicated via official announcements.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Profile</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-switch-teal hover:bg-switch-teal-700 text-white font-bold px-7 py-3 rounded-xl text-sm transition-all shadow"
            >
              <span>Continue to Token Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Token Fee & Paystack Checkout */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-switch-orange" />
              <span>Step 3: Registration Token Payment</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Finalize your student registration with the subsidized token fee of <strong>₦{TOKEN_AMOUNT_NGN.toLocaleString()}</strong>.
            </p>
          </div>

          {/* Review Summary */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Applicant:</span>
              <span className="font-bold text-slate-800">{formData.fullName} ({formData.email})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Selected Track:</span>
              <span className="font-bold text-switch-teal">{selectedTrack.title} ({selectedTrack.category})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Mode:</span>
              <span className="font-bold text-slate-800">{formData.learningMode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Commercial Tuition Value:</span>
              <span className="line-through text-slate-400">₦185,000</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
              <span className="font-bold text-slate-900">Commitment Token Due:</span>
              <span className="font-extrabold text-switch-orange">₦{TOKEN_AMOUNT_NGN.toLocaleString()}</span>
            </div>
          </div>

          {/* Security & Partner reassurance */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Partner Empowerment Guarantee</span>
            </div>
            <p className="text-[11px] text-emerald-700">
              Subsidized by GOFAMINT Youth Fellowship (GYF - Strong & Able). Paystack handles checkout with 256-bit bank grade encryption.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Tracks</span>
            </button>

            <button
              type="button"
              onClick={handlePayment}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-switch-orange to-orange-500 hover:from-switch-orange-600 hover:to-orange-600 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-orange-500/25 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Verifying with Paystack...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₦{TOKEN_AMOUNT_NGN.toLocaleString()} with Paystack</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Login link */}
      <div className="text-center mt-6 text-xs text-slate-500">
        Already registered and paid?{' '}
        <Link href="/login" className="font-bold text-switch-teal hover:underline">
          Sign into your Student Portal here
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading enrollment form...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
