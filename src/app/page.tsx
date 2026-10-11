import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import TracksDirectory from '@/components/home/TracksDirectory';
import EligibilitySection from '@/components/home/EligibilitySection';
import FAQSection from '@/components/home/FAQSection';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <TracksDirectory />
      <EligibilitySection />
      <FAQSection />
    </div>
  );
}
