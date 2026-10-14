import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/admin';

export async function GET() {
  try {
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('instructors')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, instructors: data });
      }
    }

    return NextResponse.json({
      success: true,
      fallback: true,
      message: 'Using local instructor storage.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, trackId, bio, experienceYears, status, password } = body;

    if (!fullName || !email || !trackId) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and track are required.' },
        { status: 400 }
      );
    }

    const newInstructor = {
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      track_id: trackId,
      bio: bio?.trim() || '',
      experience_years: Number(experienceYears) || 0,
      status: status || 'approved',
      approved_at: status === 'approved' ? new Date().toISOString() : null,
    };

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('instructors')
        .insert([newInstructor])
        .select()
        .single();

      if (error) {
        console.warn('Supabase instructor insert warning:', error.message);
      } else {
        return NextResponse.json({ success: true, instructor: data });
      }
    }

    return NextResponse.json({
      success: true,
      fallback: true,
      instructor: {
        id: `inst-${Date.now()}`,
        ...newInstructor,
        password: password || 'switch123',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'ID and status required.' }, { status: 400 });
    }

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('instructors')
        .update({
          status,
          approved_at: status === 'approved' ? new Date().toISOString() : null,
        })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, instructor: data });
      }
    }

    return NextResponse.json({ success: true, fallback: true, id, status });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
