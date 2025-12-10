import { NextRequest, NextResponse } from 'next/server';
import { supabaseWebchat as supabase } from '@/lib/supabase-webchat';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Chat Appointment Reschedule Request:', body);

    const {
      phoneNumber,
      confirmationCode,
      appointmentId,
      newDate,
      newTime,
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
      // Search by confirmation code or extract ID from code
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

    // Check if appointment can be rescheduled
    if (appointment.status === 'cancelled') {
      return NextResponse.json({
        success: false,
        message: 'This appointment has been cancelled and cannot be rescheduled. Please book a new appointment.'
      }, { status: 400 });
    }

    if (appointment.status === 'completed') {
      return NextResponse.json({
        success: false,
        message: 'This appointment has already been completed. Please book a new appointment.'
      }, { status: 400 });
    }

    // Step 3: Update the appointment
    const updateData: any = {
      status: 'scheduled',
      updated_at: new Date().toISOString()
    };

    if (newDate && newTime) {
      // Convert 12-hour time format to 24-hour format
      let time24Hour = newTime;
      const timeMatch = newTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2];
        const period = timeMatch[3].toUpperCase();
        
        if (period === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }
        
        time24Hour = `${hours.toString().padStart(2, '0')}:${minutes}`;
      }
      
      updateData.appointment_date = `${newDate}T${time24Hour}:00`;
    }

    if (reason) {
      updateData.notes = `${appointment.notes || ''}\n\nRescheduled via web chat: ${reason}`;
    }

    const { data: updatedAppointment, error: updateError } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', appointment.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating appointment:', updateError);
      return NextResponse.json({
        success: false,
        message: 'Failed to reschedule appointment'
      }, { status: 500 });
    }

    // Step 4: Log interaction
    await supabase.from('interactions').insert({
      session_id: `chat-reschedule-${Date.now()}`,
      patient_id: patient.id,
      channel: 'web_chat',
      direction: 'inbound',
      message_body: `Appointment rescheduled to ${newDate} at ${newTime}. Reason: ${reason || 'Not specified'}`,
      from_number: phoneNumber,
      intent: 'appointment_reschedule',
      metadata: {
        appointment_id: appointment.id,
        old_date: appointment.appointment_date,
        new_date: updateData.appointment_date,
        source: 'web_chat'
      },
      created_at: new Date().toISOString()
    });

    console.log('Appointment rescheduled successfully:', appointment.id);

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Your appointment has been successfully rescheduled to ${newDate} at ${newTime}. You'll receive a confirmation shortly.`,
      appointmentId: appointment.id,
      newDate: updateData.appointment_date
    });

  } catch (error: any) {
    console.error('Error in chat reschedule-appointment API:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while rescheduling your appointment. Please try again or call our office directly.'
    }, { status: 500 });
  }
}
