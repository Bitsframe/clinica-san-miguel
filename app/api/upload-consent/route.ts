import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { appointmentId, pdfBase64 } = await req.json();

    if (!appointmentId || !pdfBase64) {
      return NextResponse.json({ error: 'appointmentId and pdfBase64 are required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase environment variables are missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const buffer = Buffer.from(pdfBase64, 'base64');
    const path = `signed_form/${appointmentId}/consent.pdf`;

    const { error: uploadError } = await supabase.storage
      .from('signed_form')
      .upload(path, buffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { error: updateError } = await supabase
      .from('Appoinments')
      .update({ signed_form_path: path })
      .eq('id', appointmentId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Generate a short-lived signed URL (e.g., 24h) for immediate access if needed
    const { data: signed } = await supabase.storage
      .from('signed_form')
      .createSignedUrl(path, 60 * 60 * 24);

    return NextResponse.json({ path, signedUrl: signed?.signedUrl }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}
