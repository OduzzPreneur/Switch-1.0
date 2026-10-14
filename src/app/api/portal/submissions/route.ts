import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const regNo = searchParams.get('regNo');
    const assessmentId = searchParams.get('assessmentId');

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      let query = supabaseAdmin.from('assessment_submissions').select('*');

      if (regNo) {
        query = query.eq('student_reg_no', regNo);
      }
      if (assessmentId) {
        query = query.eq('assessment_id', assessmentId);
      }

      const { data, error } = await query.order('submitted_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, submissions: data });
      }
    }

    return NextResponse.json({
      success: true,
      fallback: true,
      message: 'Using local submissions fallback.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { assessmentId, studentRegNo, submissionUrl, notes } = body;

    if (!assessmentId || !studentRegNo || !submissionUrl) {
      return NextResponse.json(
        { success: false, message: 'Assessment ID, student registration number, and submission URL are required.' },
        { status: 400 }
      );
    }

    const newSub = {
      assessment_id: assessmentId,
      student_reg_no: studentRegNo,
      submission_url: submissionUrl.trim(),
      notes: notes?.trim() || '',
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    };

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('assessment_submissions')
        .upsert([newSub], { onConflict: 'assessment_id, student_reg_no' })
        .select()
        .single();

      if (error) {
        console.warn('Supabase submission upsert notice:', error.message);
      } else {
        return NextResponse.json({ success: true, submission: data });
      }
    }

    return NextResponse.json({
      success: true,
      fallback: true,
      submission: {
        id: `sub-${Date.now()}`,
        ...newSub,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { submissionId, score, feedback, status } = body;

    if (!submissionId || score === undefined) {
      return NextResponse.json(
        { success: false, message: 'Submission ID and score are required.' },
        { status: 400 }
      );
    }

    const updates = {
      score: Number(score),
      feedback: feedback?.trim() || '',
      status: status || 'approved',
      graded_at: new Date().toISOString(),
    };

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('assessment_submissions')
        .update(updates)
        .eq('id', submissionId)
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, submission: data });
      }
    }

    return NextResponse.json({
      success: true,
      fallback: true,
      submissionId,
      ...updates,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
