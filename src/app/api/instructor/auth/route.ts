import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/admin';

// Default seeded instructors list for development fallback
const SEEDED_INSTRUCTORS = [
  {
    id: 'inst-1',
    full_name: 'Engr. Babatunde Alabi',
    email: 'babatunde.alabi@switch.ng',
    track_id: 'solar-energy',
    status: 'approved',
    phone: '+234 803 123 4567',
  },
  {
    id: 'inst-2',
    full_name: 'Chioma Okonkwo',
    email: 'chioma.okonkwo@switch.ng',
    track_id: 'software-engineering',
    status: 'approved',
    phone: '+234 812 987 6543',
  },
  {
    id: 'inst-3',
    full_name: 'Oluwaseun Adeleke',
    email: 'oluwaseun.adeleke@switch.ng',
    track_id: 'uiux-design',
    status: 'pending',
    phone: '+234 805 456 7890',
  },
  {
    id: 'inst-4',
    full_name: 'Ibrahim Danladi',
    email: 'ibrahim.danladi@switch.ng',
    track_id: 'cybersecurity',
    status: 'pending',
    phone: '+234 809 333 2211',
  },
];

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Supabase instructors query
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      try {
        const { data: inst, error } = await supabaseAdmin
          .from('instructors')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (inst && !error) {
          if (inst.status === 'pending') {
            return NextResponse.json(
              {
                success: false,
                status: 'pending',
                message: 'Your instructor account is pending administrator review. Teaching tools will unlock once approved by Switch 1.0 leadership.',
              },
              { status: 403 }
            );
          }

          if (inst.status === 'suspended') {
            return NextResponse.json(
              {
                success: false,
                status: 'suspended',
                message: 'Your instructor access has been suspended. Please contact Switch 1.0 administrative console.',
              },
              { status: 403 }
            );
          }

          return NextResponse.json({
            success: true,
            instructor: {
              id: inst.id,
              fullName: inst.full_name,
              email: inst.email,
              phone: inst.phone,
              trackId: inst.track_id,
              status: inst.status,
              bio: inst.bio,
            },
          });
        }
      } catch (dbErr) {
        console.warn('Supabase instructor auth fallback:', dbErr);
      }
    }

    // 2. Check seeded instructors fallback
    const matched = SEEDED_INSTRUCTORS.find(
      (i) => i.email.toLowerCase() === cleanEmail
    );

    if (matched) {
      if (matched.status === 'pending') {
        return NextResponse.json(
          {
            success: false,
            status: 'pending',
            message: 'Your instructor account is pending administrator review. Teaching tools will unlock once approved.',
          },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        instructor: {
          id: matched.id,
          fullName: matched.full_name,
          email: matched.email,
          phone: matched.phone,
          trackId: matched.track_id,
          status: matched.status,
        },
      });
    }

    // Allow test admin-created instructor accounts
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid instructor credentials. Instructors must be provisioned or approved by Switch 1.0 Administration.',
      },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
