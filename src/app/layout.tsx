import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import InstallAppPrompt from '@/components/common/InstallAppPrompt';

export const metadata: Metadata = {
  title: 'Switch 1.0 | Youth Tech & Vocational Empowerment Platform',
  description:
    'Switch 1.0 is an intensive youth empowerment initiative (Ages 15–40) featuring 12 tech and vocational tracks. Subsidized in partnership with GOFAMINT Youth Fellowship.',
  keywords: [
    'Switch 1.0',
    'GOFAMINT Youth Fellowship',
    'Tech Skills Nigeria',
    'Vocational Training',
    'Youth Empowerment',
    'Web Development',
    'UI/UX Design',
    'Cloud Computing & AI',
    'Data Analysis',
    'Cybersecurity',
    'Cisco Networking',
    'Robotics',
    'Graphic Design',
    'Fashion Design',
    'Solar & Inverter Technology',
    'Agriculture and Hydroponics',
    'CCTV & IoT',
  ],
  authors: [{ name: 'The Switch Initiative & GYF' }],
  icons: {
    icon: '/logos/switch-logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 antialiased selection:bg-switch-teal selection:text-white">
        {/* Global Navigation Header */}
        <Navbar />

        {/* Main Application Body */}
        <main className="flex-1">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />

        {/* PWA / Add-to-Home-Screen Install Banner */}
        <InstallAppPrompt />
      </body>
    </html>
  );
}
