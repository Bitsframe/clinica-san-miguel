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
      console.log('[Services] Fetching services for locationID:', locationID);
      
      let { data, error } = await supabase.from(tableName).select("title");

      if (data) {
        console.log('[Services] Raw services from DB:', data.map((item: any) => item.title));
        
        let serviceData = data.map((item: any) => item.title);
        
        // Filter out "Dentist" service if location is not 2 or 3
        console.log('[Services] Checking if should filter Dentist:', {
          locationID,
          locationIDType: typeof locationID,
          shouldShowDentist: locationID === 2 || locationID === 3
        });
        
        if (locationID !== 2 && locationID !== 3) {
          console.log('[Services] Filtering out Dentist service');
          serviceData = serviceData.filter((service: string) => {
            const isDentist = service.toLowerCase() === 'dentist';
            console.log(`[Services] Service "${service}" - isDentist: ${isDentist}`);
            return !isDentist;
          });
        } else {
          console.log('[Services] Location is 2 or 3, keeping Dentist service');
        }
        
        console.log('[Services] Final filtered services:', serviceData);
        setServicesState(serviceData);
      }
    };

    fetchServices();
  }, [tableName, locationID]);

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
    setScheduleDate(null);
    setScheduleSlot("");
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
    setIsSubmitting(true);

    try {
      // Validate required fields
      const requiredFields = [
        'first_name',
        'last_name',
        'sex',
        'phone',
        'service',
        'dob',
        'street_address',
        'date_and_time',
      ];

      const validateData = validateFormData(
        {
          email: email || '', // Provide empty string if email is null/undefined
          phone,
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
          sex,
          phone,
          service,
          dob: dob ? dob.toISOString().split('T')[0] : null,
          street_address,
          date_and_time,
        }[field]) {
          toast.warning(`Please fill in the ${field}`);
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare date_and_time in format: "locationID|DD-MM-YYYY - HH:MM AM/PM"
      let formattedDateTime: string | null = null;
      if (scheduleDate && scheduleSlot) {
        const day = String(scheduleDate.getDate()).padStart(2, '0');
        const month = String(scheduleDate.getMonth() + 1).padStart(2, '0');
        const year = scheduleDate.getFullYear();
        
        // Format: "11|19-02-2026 - 5:00 PM"
        formattedDateTime = `${locationID}|${day}-${month}-${year} - ${scheduleSlot}`;
      }

      // Call the edge function
      const edgeResponse = await fetch(
        'https://vsvueqtgulraaczqnnvh.supabase.co/functions/v1/appointment-insert-with-dob-check',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            firstname: firstName,
            lastname: lastName,
            email: email && email.trim() ? email : null,
            phone: phone.startsWith('+1') ? phone : `+1${phone}`,
            gender: sex,
            dob: dob ? dob.toISOString().split('T')[0] : null,
            locationid: locationID,
            onsite: false,
            text_opt,
            email_opt,
            address: `${street_address}, ${state}, ${zipcode}`,
            service: service,
            date_and_time: formattedDateTime,
          }),
        }
      );

      if (!edgeResponse.ok) {
        const errorData = await edgeResponse.json();
        throw new Error(errorData.message || 'Failed to book appointment');
      }

      const result = await edgeResponse.json();

      // Show success message
      toast.success("Appointment Booked Successfully");

      // Send confirmation email only if email is provided
      if (email && email.trim()) {
        const lang = locale;
        const emailType = EmailBodyTempEnum.CONFIRMATION_OF_FORM_SUBMISSION;
        const emailData: any = {
          email,
          name: `${firstName} ${lastName}`,
          location: detailedData[0],
          service: service,
        };

        try {
          await sendEmail({
            lang,
            emailType,
            data: emailData
          });
        } catch (emailError) {
          // Silently fail to not disrupt appointment booking
        }
      }

      // Reset form and close modal
      resetForm();
      handleClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
    resetForm,
  };
}


