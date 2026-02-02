import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { supabase } from "@/supabaseClient";
import { validateFormData } from "@/utils/validationCheck";
import { EmailBodyTempEnum } from "@/utils/emailService/templateDetails";
import { sendEmail } from "@/utils/emailService";
import { submitAppointmentFlow } from "@/lib/submitAppointment";

export interface MedicalFormType {
  chief_complaint: string;
  onset: string;
  location: string;
  severity: string;
  symptoms_description: string;
  relieving_factors: string[];
  medical_conditions: string;
  surgeries: string;
  allergies: string;
  current_medications: string;
  family_history: {
    hypertension: boolean;
    diabetes: boolean;
    cancer: boolean;
    heart_disease: boolean;
    unknown: boolean;
  };
  tobacco_use: boolean;
  alcohol_use: boolean;
  drug_use: boolean;
  occupation: string;
  cancer_type: string;
}

const initialMedicalForm: MedicalFormType = {
  chief_complaint: "",
  onset: "",
  location: "",
  severity: "",
  symptoms_description: "",
  relieving_factors: [],
  medical_conditions: "",
  surgeries: "",
  allergies: "",
  current_medications: "",
  family_history: {
    hypertension: false,
    diabetes: false,
    cancer: false,
    heart_disease: false,
    unknown: false,
  },
  tobacco_use: false,
  alcohol_use: false,
  drug_use: false,
  occupation: "",
  cancer_type: "",
};

export const medicalFields = [
  { key: 'chief_complaint', label: 'Reason for Visit' },
  { key: 'onset', label: 'how long are you feeling this?' },
  { key: 'location', label: 'Location' },
  { key: 'severity', label: 'Severity' },
  { key: 'symptoms_description', label: 'Symptom Details' },
  { key: 'relieving_factors', label: 'Relieving Factors' },
  { key: 'medical_conditions', label: 'Medical Conditions' },
  { key: 'surgeries', label: 'Surgeries' },
  { key: 'allergies', label: 'Allergies' },
  { key: 'current_medications', label: 'Current Medications' },
  { key: 'occupation', label: 'Occupation' },
];

export const perPage = 8;

const formatDuration = (days: number) => {
  if (days === 0) return 'Today';
  const years = Math.floor(days / 365);
  const remainingDays = days % 365;
  const months = Math.floor(remainingDays / 30);
  const finalDays = remainingDays % 30;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  if (finalDays > 0) parts.push(`${finalDays} day${finalDays > 1 ? 's' : ''}`);

  return `${parts.join(', ')} ago`;
};

export function useRequestAppointmentLogic({
  detailedData,
  locationID,
  locale,
  handleClose,
  visitType,
  patientType,
  genderOptions,
}: {
  detailedData: any;
  locationID: number;
  locale: string;
  handleClose: any;
  visitType: string[];
  patientType: string[];
  genderOptions: string[];
}) {
  const tableName = locale === "es" ? "services_es" : "services";

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [sex, setSex] = useState("");
  const [state, setState] = useState('');
  const [zipcode, setzipcode] = useState('');
  const [street_address, setStreet_address] = useState('');
  const [service, setService] = useState("");
  const [phone, setPhone] = useState("");
  const [inOfficePatient, setInOfficePatient] = useState("");
  const [date_and_time, setDate_and_time] = useState("");
  const [email_opt, setEmail_opt] = useState(false);
  const [text_opt, setText_opt] = useState(false);
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onsetDate, setOnsetDate] = useState<Date | null>(null);
  const [reliefOther, setReliefOther] = useState("");
  const [reliefSelect, setReliefSelect] = useState("");
  const [surgeryChoice, setSurgeryChoice] = useState("");
  const [allergyChoice, setAllergyChoice] = useState("");
  const [medicalForm, setMedicalForm] = useState<MedicalFormType>(initialMedicalForm);
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [scheduleSlot, setScheduleSlot] = useState<string>("");
  const [servicesState, setServicesState] = useState<string[] | null | undefined>([]);

  // Set default service if not set and services are loaded
  useEffect(() => {
    if (!service && servicesState && servicesState.length > 0) {
      setService(servicesState[0]);
    }
  }, [servicesState, service]);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      let { data, error } = await supabase.from(tableName).select("title");

      if (data) {
        const serviceData = data.map((item: any) => item.title);
        setServicesState(serviceData);
      }
    };

    fetchServices();
  }, [tableName]);

  // Handlers
  const handleMedicalChange = (key: string, value: string) => {
    setMedicalForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFamilyHistoryChange = (key: string, checked: boolean) => {
    setMedicalForm((prev: any) => {
      // If "unknown" is selected, clear all other flags
      if (key === 'unknown' && checked) {
        return {
          ...prev,
          cancer_type: '',
          family_history: {
            hypertension: false,
            diabetes: false,
            cancer: false,
            heart_disease: false,
            unknown: true,
          },
        };
      }

      // If selecting any specific history, unset unknown
      const nextFamily = {
        ...prev.family_history,
        [key]: checked,
        unknown: key === 'unknown' ? checked : false,
      };

      // Clear cancer type when cancer unchecked or unknown toggled off all
      const nextCancerType =
        key === 'cancer' && !checked ? '' : prev.cancer_type;

      return {
        ...prev,
        cancer_type: nextFamily.cancer ? nextCancerType : '',
        family_history: nextFamily,
      };
    });
  };

  const handleBooleanFieldChange = (key: string, checked: boolean) => {
    setMedicalForm((prev: any) => ({ ...prev, [key]: checked }));
  };

  const handleOnsetDateChange = (date: Date | null) => {
    setOnsetDate(date);
    if (!date) {
      setMedicalForm((prev) => ({ ...prev, onset: "" }));
      return;
    }

    const selected = moment(date).startOf('day');
    const today = moment().startOf('day');
    const diffDays = today.diff(selected, 'days');

    setMedicalForm((prev) => ({
      ...prev,
      onset: selected.format('YYYY-MM-DD'),
    }));
  };

  const selectDateTimeSlotHandle = (date: Date | '', time?: string | '') => {
    if (date && time) {
      setScheduleDate(date as Date);
      setScheduleSlot(time as string);
      const formated_date = moment(date).format('DD-MM-YYYY');
      const createSlotForDB = `${locationID}|${formated_date} - ${time}`;
      setDate_and_time(createSlotForDB);
    } else {
      setScheduleDate(date ? (date as Date) : null);
      setScheduleSlot("");
      setDate_and_time("");
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setDob(null);
    setSex("");
    setService("");
    setPhone("");
    setInOfficePatient("");
    setDate_and_time("");
    setEmail_opt(false);
    setText_opt(false);
    setState('');
    setzipcode('');
    setStreet_address('');
    setReliefOther("");
    setReliefSelect("");
    setSurgeryChoice("");
    setAllergyChoice("");
    setMedicalForm(initialMedicalForm);
    setPage(1);
  };

  // Test helper to quickly populate fields for QA/debugging
  const fillTestData = () => {
    const onsetSampleDate = new Date('2025-12-18');
    const sample = {
      first_name: 'Test',
      last_name: 'Patient',
      email_address: 'test@example.com',
      phone: '+1 (555) 123-4567',
      dob: new Date('1990-05-10'),
      sex: genderOptions[0] || 'Male',
      state: 'Texas',
      zipcode: '75001',
      street_address: '123 Demo Street',
      service: servicesState?.[0] || 'Test Service',
      visit_type: visitType[0] || '',
      patient_type: patientType[0] || '',
      date_and_time: `${detailedData?.[0]?.id || locationID}|20-12-2025 - 10:00 AM`,
      email_opt_in: true,
      text_opt_in: true,
      medical: {
        chief_complaint: 'Shortness of breath',
        onsetDate: onsetSampleDate,
        location: 'Chest',
        severity: '6',
        symptoms_description:
          'Patient reports difficulty breathing, worse with exertion and when lying flat',
        relieving_select: 'Other',
        relieving_other: 'Sitting upright provides mild relief',
        medical_conditions: ['Asthma'],
        surgeries: 'Appendectomy (2015)',
        surgeries_choice: 'Yes',
        allergies: 'Penicillin',
        allergies_choice: 'Yes',
        current_medications: ['Albuterol inhaler'],
        fh_diabetes: false,
        fh_hypertension: true,
        fh_cancer: true,
        fh_heart_disease: false,
        fh_unknown: false,
        cancer_type: 'Carcinoma',
        tobacco_use: false,
        alcohol_use: false,
        drug_use: false,
        occupation: 'Teacher',
      },
    };

    setFirstName(sample.first_name);
    setLastName(sample.last_name);
    setEmail(sample.email_address);
    setPhone(sample.phone);
    setDob(sample.dob);
    setSex(sample.sex);
    setState(sample.state);
    setzipcode(sample.zipcode);
    setStreet_address(sample.street_address);
    setService(sample.service as string);
    setInOfficePatient(sample.visit_type);
    setDate_and_time(sample.date_and_time);
    setEmail_opt(sample.email_opt_in);
    setText_opt(sample.text_opt_in);
    setReliefSelect(sample.medical.relieving_select);
    setReliefOther(sample.medical.relieving_other);
    setSurgeryChoice(sample.medical.surgeries_choice);
    setAllergyChoice(sample.medical.allergies_choice);

    // Set onset/duration via existing handler for consistent formatting
    handleOnsetDateChange(sample.medical.onsetDate);

    setMedicalForm((prev) => ({
      ...prev,
      chief_complaint: sample.medical.chief_complaint,
      location: sample.medical.location,
      severity: sample.medical.severity,
      symptoms_description: sample.medical.symptoms_description,
      relieving_factors:
        sample.medical.relieving_select === 'Other'
          ? [sample.medical.relieving_other]
          : [sample.medical.relieving_select],
      medical_conditions: sample.medical.medical_conditions.join(', '),
      surgeries: sample.medical.surgeries,
      allergies: sample.medical.allergies,
      current_medications: sample.medical.current_medications.join(', '),
      family_history: {
        hypertension: sample.medical.fh_hypertension,
        diabetes: sample.medical.fh_diabetes,
        cancer: sample.medical.fh_cancer,
        heart_disease: sample.medical.fh_heart_disease,
        unknown: sample.medical.fh_unknown,
      },
      tobacco_use: sample.medical.tobacco_use,
      alcohol_use: sample.medical.alcohol_use,
      drug_use: sample.medical.drug_use,
      occupation: sample.medical.occupation,
      cancer_type: sample.medical.cancer_type,
    }));

    setPage(1);
  };

  const submitAppointmentDetails = async () => {
    if (isSubmitting) return;

    // [BookNow] Button clicked
    const appointmentDetails: any = {
      location_id: locationID,
      service: service,
      date_and_time: date_and_time,
    };

    // [BookNow] appointmentDetails
    // Insert into allpatients table as per new requirement
    const allPatientsData = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      phone: phone,
      treatmenttype: service,
      gender: sex,
      lastvisit: scheduleDate ? scheduleDate.toISOString() : null,
      locationid: locationID,
      onsite: false,
      text_opt,
      email_opt,
      note: '',
      dob: dob ? dob.toISOString().split('T')[0] : null,
      address: `${street_address}, ${state}, ${zipcode}`,
    };
    let patientId = null;
    let patientCount = 0;
    // [BookNow] allPatientsData to insert
    try {
      // Check for existing patient by phone + email
      const { data: existingPatients, error: existingPatientError } = await supabase
        .from('allpatients')
        .select('id, created_at')
        .eq('phone', phone)
        .eq('email', email)
        .order('created_at', { ascending: true });

      if (existingPatientError) {
        console.error('[BookNow] Error fetching existing patient:', existingPatientError);
      }

      if (existingPatients && existingPatients.length > 0) {
        patientId = existingPatients[existingPatients.length - 1].id; // latest
        patientCount = existingPatients.length;
      } else {
        const { data: insertedPatients, error: insertError } = await supabase
          .from('allpatients')
          .insert([allPatientsData])
          .select('id');

        if (insertError) {
          console.error('[BookNow] Error inserting into allpatients:', insertError);
        } else if (insertedPatients && insertedPatients.length > 0) {
          patientId = insertedPatients[0].id;
          patientCount = 1;
        }
      }
    } catch (err) {
      console.error('[BookNow] Error inserting/fetching from allpatients:', err);
    }

    if (!patientId) {
      toast.error('Unable to identify patient record. Please try again.');
      setIsSubmitting(false);
      return;
    }

    // Insert into Appoinments table as per new requirement
    // Format date_and_time as 'locationid|date - time' (already formatted in RequestAppointment)
    let dateAndTime = date_and_time;
    // [BookNow] dateAndTime
    const appoinmentData = {
      location_id: locationID,
      first_name: firstName,
      last_name: lastName,
      email_address: email,
      dob: dob ? dob.toISOString().split('T')[0] : null,
      sex: sex,
      service: service,
      phone: phone,
      date_and_time: dateAndTime,
      patient_id: patientId
    };
    // Check for existing appointment with same date_and_time and location_id
    let appointmentId = null;
    try {
      const { data: existingAppointments, error: checkError } = await supabase
        .from('Appoinments')
        .select('id')
        .eq('date_and_time', dateAndTime)
        .eq('location_id', locationID);
      if (checkError) {
        console.error('[BookNow] Error checking for existing appointment:', checkError);
      }
      if (existingAppointments && existingAppointments.length > 0) {
        // Appointment already exists for this slot
        appointmentId = existingAppointments[0].id;
        console.error('[BookNow] Duplicate appointment: An appointment already exists for this date and time.');
        toast.error('Sorry, Appointment time slot is not available, Please select any other time slot');
        setIsSubmitting(false);
        return; // Stop further processing
      } else {
        // Insert appointment into Appoinments table, now including location_id
        const { data: appointmentInsertData, error: appointmentInsertError } = await supabase.from('Appoinments').insert([
          {
            service,
            date_and_time: dateAndTime,
            patient_id: patientId,
            location_id: locationID,
            new_patient: patientCount === 1 // true if new, false if old
          }
        ]).select('id');
        // [BookNow] Appoinments insert result
        if (appointmentInsertError) {
          throw appointmentInsertError;
        }
        if (appointmentInsertData && appointmentInsertData.length > 0) {
          appointmentId = appointmentInsertData[0].id;
        }
      }
    } catch (err) {
      console.error('[BookNow] Error inserting/checking into Appoinments:', err);
      toast.error(`Error submitting appointment: ${err}`);
      setIsSubmitting(false);
      return;
    }

    // Prepare intake_form data
    const intakeFormData = {
      appointment_id: appointmentId,
      chief_complaint: medicalForm.chief_complaint || null,
      location: medicalForm.location || null,
      severity: medicalForm.severity ? parseInt(medicalForm.severity) : null,
      symptoms_description: medicalForm.symptoms_description || null,
      medical_conditions: medicalForm.medical_conditions ? [medicalForm.medical_conditions] : null,
      surgeries: medicalForm.surgeries || null,
      allergies: medicalForm.allergies ? [medicalForm.allergies] : null,
      current_medications: typeof medicalForm.current_medications === 'string' ? [medicalForm.current_medications] : null,
      fh_diabetes: medicalForm.family_history?.diabetes ?? null,
      fh_hypertension: medicalForm.family_history?.hypertension ?? null,
      fh_cancer: medicalForm.family_history?.cancer ?? null,
      fh_heart_disease: medicalForm.family_history?.heart_disease ?? null,
      tobacco_use: medicalForm.tobacco_use ? 'true' : 'false',
      alcohol_use: medicalForm.alcohol_use ? 'true' : 'false',
      drug_use: medicalForm.drug_use ? 'true' : 'false',
      occupation: medicalForm.occupation || null,
      onset: onsetDate ? onsetDate.toISOString().split('T')[0] : null,
      relieving_factors: Array.isArray(medicalForm.relieving_factors) && medicalForm.relieving_factors.length > 0 ? medicalForm.relieving_factors : null,
      cancer_type: medicalForm.cancer_type || null,
    };

    // Insert into intake_form table
    let intakeFormId = null;
    try {
      const { data: intakeFormInsertData, error: intakeFormError } = await supabase
        .from('intake_form')
        .insert([intakeFormData])
        .select('id');
      
      if (intakeFormError) {
        throw intakeFormError;
      }
      
      if (intakeFormInsertData && intakeFormInsertData.length > 0) {
        intakeFormId = intakeFormInsertData[0].id;
      }
      
      // Show success message after successful database inserts
      if (appointmentId) {
        toast.success("Appointment Booked Successfully");
      }
    } catch (err) {
      console.error('Error inserting into intake_form:', err);
      toast.error('Error saving medical information. Appointment may have been created but medical details were not saved.');
      setIsSubmitting(false);
      return;
    }

    const requiredFields = [
      'first_name',
      'last_name',
      'email_address',
      'sex',
      'phone',
      'service',
      'dob',
      'state',
      'zipcode',
      'street_address',
      'date_and_time',
    ];
    const validateData = validateFormData(
      {
        email,
        phone,
        state,
        zipcode,
        street_address,
      },
      true
    );
    if (!validateData) {
      setIsSubmitting(false);
      return;
    }
    for (const field of requiredFields) {
      if (field === "service") {
        if (!service || (servicesState && servicesState.length > 0 && !servicesState.includes(service))) {
          toast.warning(`Please select a valid service`);
          setIsSubmitting(false);
          return;
        }
      } else if (!{
        first_name: firstName,
        last_name: lastName,
        email_address: email,
        sex,
        phone,
        service,
        dob: dob ? dob.toISOString().split('T')[0] : null,
        state,
        zipcode,
        street_address,
        date_and_time,
      }[field]) {
        toast.warning(`Please fill in the ${field}`);
        setIsSubmitting(false);
        return;
      }
    }
    const postData = {
      ...appointmentDetails,
    };
    const lang = locale;
    const emailType = EmailBodyTempEnum.CONFIRMATION_OF_FORM_SUBMISSION;
    const emailData: any = {
      email,
      name: `${firstName} ${lastName}`,
      location: detailedData[0],
      service: service,
    };
    const result = await submitAppointmentFlow({
      supabase,
      postData,
      medicalForm: {
        ...medicalForm,
        symptoms_description: medicalForm.symptoms_description || '',
        medical_conditions: medicalForm.medical_conditions || '',
        allergies: medicalForm.allergies || '',
        relieving_factors: Array.isArray(medicalForm.relieving_factors)
          ? medicalForm.relieving_factors.join(', ')
          : (medicalForm.relieving_factors || ''),
      },
      onsetDate,
      reliefSelect: reliefSelect || '',
      reliefOther,
      surgeryChoice,
      allergyChoice,
      options: {
        primaryTable: 'Appoinments',
        invokeEdge: true,
        email: {
          sendEmail,
          emailType,
          lang,
          emailData,
        }
      }
    });
    if (!result.success) {
      // Error already handled above or in duplicate check
      // Don't return here - appointment was already successfully inserted above
      console.error('submitAppointmentFlow failed but appointment was already created:', result.error);
    } else {
      // Trigger Supabase Edge Function with intake_form data after successful email
      try {
        const soapApiResponse = await fetch('https://ivwviiupkkrrrtmnksyk.supabase.co/functions/v1/intake-form-soap-ts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            ...intakeFormData,
            id: intakeFormId, // Add the intake_form id from database
          }),
        });

        if (!soapApiResponse.ok) {
          console.error('SOAP API error:', soapApiResponse.statusText);
          toast.warning('Appointment booked but failed to sync medical records');
        } else {
          const soapResult = await soapApiResponse.json();
          console.log('SOAP API response:', soapResult);
        }
      } catch (apiError) {
        console.error('Error calling SOAP API:', apiError);
        toast.warning('Appointment booked but failed to sync medical records');
      }
    }
    
    // Reset form and close modal
    resetForm();
    handleClose();
    setIsSubmitting(false);
  };

  const medicalPages = Math.max(1, Math.ceil(medicalFields.length / perPage));
  const totalPages = 1 + medicalPages;

  return {
    // State
    firstName,
    lastName,
    email,
    dob,
    sex,
    state,
    zipcode,
    street_address,
    service,
    phone,
    inOfficePatient,
    date_and_time,
    email_opt,
    text_opt,
    page,
    isSubmitting,
    onsetDate,
    reliefOther,
    reliefSelect,
    surgeryChoice,
    allergyChoice,
    medicalForm,
    scheduleDate,
    scheduleSlot,
    servicesState,
    medicalPages,
    totalPages,

    // Setters
    setFirstName,
    setLastName,
    setEmail,
    setDob,
    setSex,
    setState,
    setzipcode,
    setStreet_address,
    setService,
    setPhone,
    setInOfficePatient,
    setPage,
    setEmail_opt,
    setText_opt,
    setReliefOther,
    setReliefSelect,
    setSurgeryChoice,
    setAllergyChoice,
    setMedicalForm,

    // Handlers
    handleMedicalChange,
    handleFamilyHistoryChange,
    handleBooleanFieldChange,
    handleOnsetDateChange,
    selectDateTimeSlotHandle,
    submitAppointmentDetails,
    fillTestData,
  };
}


