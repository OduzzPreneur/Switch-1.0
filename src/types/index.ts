export type TrackCategory = 'Tech' | 'Vocational';

export interface CourseTrack {
  id: string;
  title: string;
  category: TrackCategory;
  tagline: string;
  description: string;
  durationWeeks: number;
  skills: string[];
  toolsCovered: string[];
  careerRoles: string[];
  prerequisites: string;
  colorScheme: {
    accent: string;
    badgeBg: string;
    border: string;
  };
  featured?: boolean;
}

export type AgeBracket = '15-20' | '21-25' | '26-30' | '31-35' | '36-40';
export type Gender = 'Male' | 'Female' | 'Prefer not to say';
export type DeliveryMode = 'Online / Virtual' | 'Physical Center / Hybrid';

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  ageBracket: AgeBracket;
  gender: Gender;
  stateOfResidence: string;
  learningMode: DeliveryMode;
  trackId: string;
  registrationNumber?: string;
  paymentStatus: 'pending' | 'verified' | 'failed';
  amountPaid: number;
  paymentReference?: string;
  paidAt?: string;
  createdAt: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  category: 'Action Required' | 'Cohort Update' | 'Venue & Timetable' | 'General';
  date: string;
  summary: string;
  actionLabel?: string;
  actionUrl?: string;
  isUrgent?: boolean;
}
