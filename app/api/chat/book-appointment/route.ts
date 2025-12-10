import { NextRequest, NextResponse } from 'next/server';
import { supabaseWebchat as supabase } from '@/lib/supabase-webchat';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Chat Appointment Booking Request:', body);

    const {
      patientName,
      phoneNumber,
      email,
      dateOfBirth,
      address,
      appointmentType,
      appointmentDate,
      appointmentTime,
      isNewPatient,
      notes
    } = body;

    // Validate required fields
    if (!patientName || !phoneNumber || !appointmentDate || !appointmentTime) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: patientName, phoneNumber, appointmentDate, or appointmentTime'
      }, { status: 400 });
    }

    // Parse patient name
    const nameParts = patientName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || firstName;

    // Step 1: Check if patient exists or create new patient
    let patientId;
    
    const { data: existingPatient } = await supabase
      .from('patients')
      .select('id')
      .eq('phone', phoneNumber)
      .single();

    if (existingPatient) {
      patientId = existingPatient.id;
      console.log('Existing patient found:', patientId);
      
      // Update patient info if provided
      const updateData: any = {};
      if (email) updateData.email = email;
      if (dateOfBirth) updateData.date_of_birth = dateOfBirth;
      
      if (Object.keys(updateData).length > 0) {
        await supabase
          .from('patients')
          .update(updateData)
          .eq('id', patientId);
      }
    } else {
      // Create new patient
      const { data: newPatient, error: patientError } = await supabase
        .from('patients')
        .insert({
          first_name: firstName,
          last_name: lastName,
          phone: phoneNumber,
          date_of_birth: dateOfBirth || null,
          email: email || null,
          consent_sms: true,
          consent_voice: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (patientError) {
        console.error('Error creating patient:', patientError);
        console.error('Patient error details:', JSON.stringify(patientError, null, 2));
        return NextResponse.json({
          success: false,
          message: `Failed to create patient record: ${patientError.message || 'Unknown error'}`
        }, { status: 500 });
      }

      patientId = newPatient.id;
      console.log('New patient created:', patientId);
    }

    // Step 2: Get first available clinic
    const { data: clinic, error: clinicError } = await supabase
      .from('clinics')
      .select('id')
      .eq('active', true)
      .limit(1)
      .single();

    if (clinicError) {
      console.error('Error fetching clinic:', clinicError);
    }

    if (!clinic) {
      console.error('No active clinic found in database');
      return NextResponse.json({
        success: false,
        message: 'No active clinic found. Please contact support.'
      }, { status: 500 });
    }

    console.log('Using clinic:', clinic.id);

    // Step 3: Create appointment
    // Convert 12-hour time format to 24-hour format
    let time24Hour = appointmentTime;
    const timeMatch = appointmentTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
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
    
    const appointmentDateTime = `${appointmentDate}T${time24Hour}:00`;
    
    // Generate confirmation code (max 10 chars for DB)
    const tempId = Date.now().toString().substring(6); // Get last 7 digits
    const confirmationCode = `CH${tempId}`; // CH + 7 digits = 9 chars
    
    console.log('Creating appointment with data:', {
      patient_id: patientId,
      clinic_id: clinic.id,
      appointment_date: appointmentDateTime,
      service_type: appointmentType || 'consultation',
      status: 'confirmed',
      confirmation_code: confirmationCode
    });

    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        patient_id: patientId,
        clinic_id: clinic.id,
        appointment_date: appointmentDateTime,
        service_type: appointmentType || 'consultation',
        status: 'confirmed',
        confirmation_code: confirmationCode,
        notes: notes || `Booked via web chat. ${isNewPatient ? 'New patient.' : 'Returning patient.'}`,
        duration_minutes: 30,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (appointmentError) {
      console.error('Error creating appointment:', appointmentError);
      console.error('Appointment error details:', JSON.stringify(appointmentError, null, 2));
      return NextResponse.json({
        success: false,
        message: `Failed to create appointment: ${appointmentError.message || 'Unknown error'}`
      }, { status: 500 });
    }

    console.log('Appointment created successfully:', appointment);

    // Step 4: Log interaction
    await supabase.from('interactions').insert({
      session_id: `chat-${Date.now()}`,
      patient_id: patientId,
      channel: 'web_chat',
      direction: 'inbound',
      message_body: `Appointment booked: ${appointmentType || 'consultation'} on ${appointmentDate} at ${appointmentTime}`,
      from_number: phoneNumber,
      intent: 'appointment_booking',
      metadata: {
        appointment_id: appointment.id,
        source: 'web_chat'
      },
      created_at: new Date().toISOString()
    });

    console.log('Appointment created successfully:', appointment.id);
    console.log('Confirmation code:', confirmationCode);

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Perfect! Your appointment has been confirmed. Your confirmation code is ${confirmationCode}. You're scheduled for ${appointmentType || 'consultation'} on ${appointmentDate} at ${appointmentTime}.`,
      appointmentId: appointment.id,
      confirmationCode: confirmationCode,
      patientId: patientId
    });

  } catch (error: any) {
    console.error('Error in chat book-appointment API:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while booking your appointment. Please try again or call our office directly.'
    }, { status: 500 });
  }
}
