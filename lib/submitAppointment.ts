import { SupabaseClient } from '@supabase/supabase-js';

export type MedicalFormShape = {
  chief_complaint?: string;
  location?: string;
  severity?: string;
  symptoms_description?: string;
  relieving_factors?: string;
  medical_conditions?: string;
  surgeries?: string;
  allergies?: string;
  current_medications?: string;
  family_history?: {
    hypertension?: boolean;
    diabetes?: boolean;
    cancer?: boolean;
    heart_disease?: boolean;
    unknown?: boolean;
  };
  tobacco_use?: boolean;
  alcohol_use?: boolean;
  drug_use?: boolean;
  occupation?: string;
  cancer_type?: string;
};

export type SubmitAppointmentOptions = {
  primaryTable: string;
  duplicateCheck?: { location_id: any; date_and_time?: string | null };
  email?: {
    sendEmail: (args: any) => Promise<any>;
    emailType: any;
    lang: any;
    emailData: any;
  };
  invokeEdge?: boolean;
};

export async function submitAppointmentFlow(params: {
  supabase: SupabaseClient;
  postData: any;
  medicalForm: MedicalFormShape;
  onsetDate: Date | null;
  reliefSelect: string;
  reliefOther: string;
  surgeryChoice: string;
  allergyChoice: string;
  options: SubmitAppointmentOptions;
}) {
  const {
    supabase,
    postData,
    medicalForm,
    onsetDate,
    reliefSelect,
    reliefOther,
    surgeryChoice,
    allergyChoice,
    options,
  } = params;

  const parseIntOrNull = (value?: string) => {
    if (!value || value.trim() === '') return null;
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const stringToJsonArray = (value?: string) => {
    if (!value || value.trim() === '') return null;
    return value.split(',').map((v) => v.trim()).filter(Boolean);
  };

  const booleanToString = (value?: boolean) => (value ? 'yes' : 'no');

  // Optional duplicate check
  if (options.duplicateCheck?.location_id && options.duplicateCheck.date_and_time) {
    const { error: existingSlotError, data: existingSlot } = await supabase
      .from('Appoinments')
      .select('id')
      .eq('location_id', options.duplicateCheck.location_id)
      .eq('date_and_time', options.duplicateCheck.date_and_time)
      .limit(1)
      .maybeSingle();

    if (existingSlotError) {
      return { success: false, error: existingSlotError };
    }
    if (existingSlot) {
      return { success: false, error: new Error('slot_unavailable') };
    }
  }

  const { data: insertData, error: insertError } = await supabase
    .from(options.primaryTable)
    .insert([postData])
    .select();

  if (insertError) {
    return { success: false, error: insertError };
  }

  const appointmentId = insertData?.[0]?.id ?? null;
  let intakeData: any = null;

  if (appointmentId) {
    const intakeFormData = {
      appointment_id: appointmentId,
      chief_complaint: medicalForm.chief_complaint || null,
      onset: onsetDate ? onsetDate.toISOString().split('T')[0] : null,
      location: medicalForm.location || null,
      severity: parseIntOrNull(medicalForm.severity),
      symptoms_description: medicalForm.symptoms_description || null,
      relieving_factors: reliefSelect
        ? JSON.stringify({
            select: reliefSelect,
            other: reliefSelect === 'Other' ? reliefOther || '' : '',
          })
        : null,
      medical_conditions: stringToJsonArray(medicalForm.medical_conditions),
      surgeries: surgeryChoice
        ? JSON.stringify({
            choice: surgeryChoice === 'Yes',
            details: surgeryChoice === 'Yes' ? medicalForm.surgeries || '' : '',
          })
        : null,
      allergies: allergyChoice
        ? JSON.stringify({
            choice: allergyChoice === 'Yes',
            details: allergyChoice === 'Yes' ? medicalForm.allergies || '' : '',
          })
        : null,
      current_medications: stringToJsonArray(medicalForm.current_medications),
      fh_diabetes: medicalForm.family_history?.diabetes || false,
      fh_hypertension: medicalForm.family_history?.hypertension || false,
      fh_cancer: medicalForm.family_history?.cancer || false,
      fh_heart_disease: medicalForm.family_history?.heart_disease || false,
      cancer_type: medicalForm.family_history?.cancer ? medicalForm.cancer_type || null : null,
      tobacco_use: booleanToString(medicalForm.tobacco_use),
      alcohol_use: booleanToString(medicalForm.alcohol_use),
      drug_use: booleanToString(medicalForm.drug_use),
      occupation: medicalForm.occupation || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: intakeInsert, error: intakeError } = await supabase
      .from('intake_form')
      .insert([intakeFormData])
      .select()
      .single();

    if (intakeError) {
      // Non-blocking: main appointment flow continues even if intake save fails.
    } else {
      intakeData = intakeInsert;
    }
  }

  if (options.invokeEdge && intakeData) {
    try {
      const { error: edgeFunctionError } = await supabase.functions.invoke('intake-form-soap-ts', {
        body: intakeData,
      });
      if (edgeFunctionError) {
        // Non-blocking edge function failure.
      }
    } catch {
      // Non-blocking edge function failure.
    }
  }

  if (options.email) {
    try {
      await options.email.sendEmail({
        lang: options.email.lang,
        emailType: options.email.emailType,
        data: options.email.emailData,
      });
    } catch {
      // Non-blocking email failure.
    }
  }

  return { success: true, appointmentId, intakeData };
}
