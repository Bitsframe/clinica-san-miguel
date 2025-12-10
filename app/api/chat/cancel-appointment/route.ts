import { NextRequest, NextResponse } from 'next/server';
import { supabaseWebchat as supabase } from '@/lib/supabase-webchat';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Chat Appointment Cancel Request:', body);

    const {
      phoneNumber,
      confirmationCode,
      appointmentId,
      reason
    } = body;

    // Validate required fields
    if (!phoneNumber || (!confirmationCode && !appointmentId)) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: phoneNumber and either confirmationCode or appointmentId'
      }, { status: 400 });
    }

    // Step 1: Find the patient
    const { data: patient } = await supabase
      .from('patients')
      .select('id')
      .eq('phone', phoneNumber)
      .single();

    if (!patient) {
      return NextResponse.json({
        success: false,
        message: 'No patient found with this phone number'
      }, { status: 404 });
    }

    // Step 2: Find the appointment
    let appointment;
    if (appointmentId) {
      const { data } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .eq('patient_id', patient.id)
        .single();
      appointment = data;
    } else if (confirmationCode) {
      const { data } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patient.id)
        .eq('confirmation_code', confirmationCode)
        .single();
      appointment = data;
    }

    if (!appointment) {
      return NextResponse.json({
        success: false,
        message: 'No appointment found with the provided information'
      }, { status: 404 });
    }

    // Check if appointment can be cancelled
    if (appointment.status === 'cancelled') {
      return NextResponse.json({
        success: false,
        message: 'This appointment has already been cancelled.'
      }, { status: 400 });
    }

    if (appointment.status === 'completed') {
      return NextResponse.json({
        success: false,
        message: 'This appointment has already been completed and cannot be cancelled.'
      }, { status: 400 });
    }

    // Step 3: Cancel the appointment
    const updateData: any = {
      status: 'cancelled',
      notes: `${appointment.notes || ''}\n\nCancelled via web chat. Reason: ${reason || 'Not specified'}`,
      updated_at: new Date().toISOString()
    };

    const { data: cancelledAppointment, error: updateError } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', appointment.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error cancelling appointment:', updateError);
      return NextResponse.json({
        success: false,
        message: 'Failed to cancel appointment'
      }, { status: 500 });
    }

    // Step 4: Log interaction
    await supabase.from('interactions').insert({
      session_id: `chat-cancel-${Date.now()}`,
      patient_id: patient.id,
      channel: 'web_chat',
      direction: 'inbound',
      message_body: `Appointment cancelled. Reason: ${reason || 'Not specified'}`,
      from_number: phoneNumber,
      intent: 'appointment_cancellation',
      metadata: {
        appointment_id: appointment.id,
        cancelled_date: appointment.appointment_date,
        source: 'web_chat'
      },
      created_at: new Date().toISOString()
    });

    console.log('Appointment cancelled successfully:', appointment.id);

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Your appointment has been successfully cancelled. If you'd like to reschedule, please let me know.`,
      appointmentId: appointment.id
    });

  } catch (error: any) {
    console.error('Error in chat cancel-appointment API:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while cancelling your appointment. Please try again or call our office directly.'
    }, { status: 500 });
  }
}
