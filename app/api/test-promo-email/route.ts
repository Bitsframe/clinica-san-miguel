import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/utils/emailService';
import { EmailBodyTempEnum } from '@/utils/emailService/templateDetails';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      name, 
      promoCode, 
      discountPercentage = 10,
      language = 'en' 
    } = body;

    // Validate required fields
    if (!email || !name || !promoCode) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, or promoCode' },
        { status: 400 }
      );
    }

    // Mock location data (you can replace with real data from database)
    const mockLocationData = {
      title: 'Clinica San Miguel - Dallas',
      address: '123 Main Street, Dallas, TX 75001',
      phone: '+1 (469) 886-8060'
    };

    // Send the promo code email
    await sendEmail({
      lang: language as 'en' | 'es',
      emailType: EmailBodyTempEnum.FEEDBACK_SUBMISSION_SUCCESS,
      data: {
        email: email,
        name: name,
        location: mockLocationData,
        service: 'General Consultation', // Mock service
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        promoCode: promoCode,
        discountPercentage: discountPercentage
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Promo code email sent successfully!',
      details: {
        email,
        promoCode,
        discountPercentage,
        language
      }
    });

  } catch (error: any) {
    console.error('Error sending promo email:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send promo email', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}