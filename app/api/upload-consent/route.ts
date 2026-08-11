import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { appointmentId, pdfBase64, formType = 'telemedicine' } = await req.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseSecretKey =
      process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
      return NextResponse.json({ error: 'Supabase environment variables are missing' }, { status: 500 });
    }

    if (!appointmentId || !pdfBase64) {
      return NextResponse.json({ error: 'appointmentId and pdfBase64 are required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseSecretKey);

    const buffer = Buffer.from(pdfBase64, 'base64');
    const tableName = 'signed_form';

    const formMap: Record<string, { bucket: string; column: string }> = {
      telemedicine: { bucket: 'telemedicine_signed_form', column: 'telemedicine_form_path' },
      hipaa: { bucket: 'HIPAACompliance_form', column: 'hipaacompliance_form_path' },
      general: { bucket: 'GeneralSurgery_form', column: 'generalsurgery_form_path' },
    };

    const mapping = formMap[formType] || formMap.telemedicine;
    const bucket = mapping.bucket;
    const column = mapping.column;
    const path = `${appointmentId}/consent.pdf`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message, code: uploadError.name }, { status: 500 });
    }

    const storedPath = `${bucket}/${path}`;

    const { error: upsertError } = await supabase
      .from(tableName)
      .upsert(
        { appointment_id: appointmentId, [column]: storedPath },
        { onConflict: 'appointment_id' }
      )
      .select('appointment_id')
      .single();

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message, code: upsertError.code }, { status: 500 });
    }

    const { data: signed } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 60 * 24);

    return NextResponse.json({ path, storedPath, signedUrl: signed?.signedUrl, bucket, column }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    console.error('[upload-consent]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed. Use POST.' }, { status: 405 });
}
