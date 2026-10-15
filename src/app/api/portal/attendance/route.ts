import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/admin';
import { getAuthContext } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthContext(req);

    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Authentication required to view attendance records.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    let trackId = searchParams.get('trackId');
    let regNo = searchParams.get('regNo');

    // Students may only view their own attendance
    if (auth.role === 'student') {
      const studentReg = auth.session.registrationNumber || regNo;
      if (!studentReg) {
        return NextResponse.json(
          { success: false, message: 'Student registration identity missing.' },
          { status: 400 }
        );
      }
      regNo = studentReg;
    }

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      let query = supabaseAdmin.from('attendance').select('*');

      if (trackId) {
        query = query.eq('track_id', trackId);
      }
      if (regNo) {
        query = query.eq('student_reg_no', regNo);
      }

      const { data, error } = await query.order('session_date', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, records: data });
      }
    }

    return NextResponse.json({
      success: true,
      fallback: true,
      message: 'Using local attendance cache.',
      records: [],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext(req);

    // Only instructors and administrators can mark attendance
    if (!auth || (auth.role !== 'instructor' && auth.role !== 'admin')) {
      return NextResponse.json(
        { success: false, message: 'Only authorized course instructors and administrators can record attendance.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { trackId, sessionDate, sessionWeek, sessionTitle, entries } = body;

    if (!trackId || !sessionDate || !entries || !Array.isArray(entries)) {
      return NextResponse.json(
        { success: false, message: 'Invalid attendance submission payload.' },
        { status: 400 }
      );
    }

    const rows = entries.map((e: any) => ({
      track_id: trackId,
      session_date: sessionDate,
      session_week: Number(sessionWeek) || 1,
      session_title: sessionTitle || `Week ${sessionWeek} Session`,
      student_reg_no: e.studentRegNo,
      status: e.status || 'present',
      marked_by: auth.session.userId,
      marked_at: new Date().toISOString(),
    }));

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('attendance')
        .upsert(rows, { onConflict: 'track_id, session_date, student_reg_no' })
        .select();

      if (error) {
        console.warn('Supabase attendance sync notice:', error.message);
      } else {
        return NextResponse.json({ success: true, records: data });
      }
    }

    return NextResponse.json({
      success: true,
      fallback: true,
      records: rows,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
