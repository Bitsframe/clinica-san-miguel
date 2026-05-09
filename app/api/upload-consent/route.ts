import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { appointmentId, pdfBase64, formType = 'telemedicine' } = await req.json();
    console.log('[upload-consent] incoming', { appointmentId: String(appointmentId || ''), formType, hasPdf: !!pdfBase64, pdfLength: pdfBase64?.length });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseSecretKey =
      process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
      console.error('[upload-consent] missing env', { supabaseUrlDefined: !!supabaseUrl, secretKeyDefined: !!supabaseSecretKey });
      return NextResponse.json({ error: 'Supabase environment variables are missing' }, { status: 500 });
    }

    if (!appointmentId || !pdfBase64) {
      console.error('[upload-consent] missing input', { hasAppointmentId: !!appointmentId, hasPdf: !!pdfBase64 });
      return NextResponse.json({ error: 'appointmentId and pdfBase64 are required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseSecretKey);

    const buffer = Buffer.from(pdfBase64, 'base64');
    const tableName = 'signed_form';

    // Map form type to bucket and column
    const formMap: Record<string, { bucket: string; column: string }> = {
      telemedicine: { bucket: 'telemedicine_signed_form', column: 'telemedicine_form_path' },
      hipaa: { bucket: 'HIPAACompliance_form', column: 'hipaacompliance_form_path' },
      general: { bucket: 'GeneralSurgery_form', column: 'generalsurgery_form_path' },
    };

    const mapping = formMap[formType] || formMap.telemedicine;
    const bucket = mapping.bucket;
    const column = mapping.column;
    const path = `${appointmentId}/consent.pdf`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: 'application/pdf',
        upsert: true,
      });
    if (uploadError) {
      console.error('[upload-consent] upload error', { message: uploadError.message, name: uploadError.name });
    } else {
      console.log('[upload-consent] upload ok', { bucket, path, uploadData });
    }

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message, code: uploadError.name }, { status: 500 });
    }

    // Store the clean path (no domain); public URL/signed URL is derived as needed
    const storedPath = `${bucket}/${path}`;

    const { data: upsertData, error: upsertError } = await supabase
      .from(tableName)
      .upsert(
        { appointment_id: appointmentId, [column]: storedPath },
        { onConflict: 'appointment_id' }
      )
      .select('appointment_id')
      .single();
    if (upsertError) {
      console.error('[upload-consent] upsert error', { message: upsertError.message, code: upsertError.code });
    } else {
      console.log('[upload-consent] upsert ok', { appointmentId, storedPath, upsertData });
    }

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message, code: upsertError.code }, { status: 500 });
    }

    // Generate a short-lived signed URL (e.g., 24h) for immediate access if needed
    const { data: signed } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 60 * 24);

    console.log('[upload-consent] success', { formType, bucket, column, path, signedUrl: signed?.signedUrl ? 'present' : 'missing' });

    return NextResponse.json({ path, storedPath, signedUrl: signed?.signedUrl, bucket, column }, { status: 200 });
  } catch (err: any) {
    console.error('[upload-consent] unexpected error', err?.message || err);
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}

// Helpful trace for accidental GETs
export async function GET() {
  console.log('[upload-consent] GET hit');
  return NextResponse.json({ error: 'Method not allowed. Use POST.' }, { status: 405 });
}
