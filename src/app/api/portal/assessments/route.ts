import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/admin';
import { getAuthContext } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const trackId = searchParams.get('trackId');

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      let query = supabaseAdmin.from('assessments').select('*');

      if (trackId) {
        query = query.eq('track_id', trackId);
      }

      const { data, error } = await query.order('week_number', { ascending: true });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, assessments: data });
      }
    }

    return NextResponse.json({
      success: true,
      fallback: true,
      message: 'Using local assessments fallback.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext(req);

    // Only instructors and administrators may create assessments
    if (!auth || (auth.role !== 'instructor' && auth.role !== 'admin')) {
      return NextResponse.json(
        { success: false, message: 'Only instructors and administrators can publish course assessments.' },
        { status: 403 }
      );
    }
    const body = await req.json();
    const { trackId, weekNumber, title, type, description, maxScore, dueDate, instructorId } = body;

    if (!trackId || !title || !description) {
      return NextResponse.json(
        { success: false, message: 'Track, title, and description are required.' },
        { status: 400 }
      );
    }

    const newAssessment = {
      track_id: trackId,
      week_number: Number(weekNumber) || 1,
      title: title.trim(),
      type: type || 'Practical Lab',
      description: description.trim(),
      max_score: Number(maxScore) || 100,
      due_date: dueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
    };

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('assessments')
        .insert([newAssessment])
        .select()
        .single();

      if (error) {
        console.warn('Supabase assessment insert notice:', error.message);
      } else {
        return NextResponse.json({ success: true, assessment: data });
      }
    }

    return NextResponse.json({
      success: true,
      fallback: true,
      assessment: {
        id: `asm-${Date.now()}`,
        ...newAssessment,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
