'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const faqs = [
  {
    q: 'What is Switch 1.0 and who is behind it?',
    a: 'Switch 1.0 is an intensive youth empowerment initiative designed to equip participants aged 15–40 with high-income tech skills and vital vocational trades. It is powered by The Switch in strategic partnership with GOFAMINT Youth Fellowship (GYF - Strong & Able) and technical industry stakeholders.',
  },
  {
    q: 'What is the registration fee for Switch 1.0?',
    a: 'The registration fee is ₦5,000, paid online via Paystack upon submitting your registration. This covers onboarding, course materials, and certification processing.',
  },
  {
    q: 'How will lectures and practicals be conducted (Online or In-Person)?',
    a: 'As announced, specific training center allocations and virtual streaming schedules will be published in the Student Portal prior to orientation.',
  },
  {
    q: 'How do I pay the registration fee?',
    a: 'Payment is processed securely through Paystack on the registration page. You can pay using your debit card, bank transfer, or USSD. Upon payment verification, your registration number and portal access are generated immediately.',
  },
  {
    q: 'Can I apply if I am a complete beginner with no prior experience?',
    a: 'Yes! All 12 tracks are structured with comprehensive foundational modules that transition into intermediate practical projects. Dedicated mentors will guide you step by step.',
  },
  {
    q: 'Can students currently attending secondary school apply?',
    a: 'No. Switch 1.0 requires a minimum educational qualification of a Senior Secondary Certificate Examination (SSCE, WAEC, NECO, GCE, or NABTEB). The programme is designed strictly for secondary school leavers, tertiary students, graduates, job seekers, and working professionals.',
  },
  {
    q: 'Will I receive a certificate upon completion?',
    a: 'Yes. Every student who completes their track coursework, submits the required capstone/practical project, and passes the final assessment will receive a verified, tamper-proof Switch 1.0 Certificate of Completion.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-switch-teal/10 text-switch-teal text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-switch-orange" />
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-switch-dark tracking-tight">
              Got Questions? We Have Answers.
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Everything you need to know about the Switch 1.0 empowerment program.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <ScrollReveal
                key={index}
                animation="fade-up"
                delay={index * 40}
              >
                <div className="border border-slate-200 rounded-2xl overflow-hidden transition-colors bg-slate-50/50 hover:bg-slate-50">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-switch-orange' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
