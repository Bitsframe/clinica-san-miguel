import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, recipients, subject, html } = body;

    if (!recipients || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: recipients, subject, or html' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: from || 'Clinica San Miguel <onboarding@resend.dev>',
      to: recipients,
      subject: subject,
      html: html,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
