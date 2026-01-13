import { useEffect, useState, useImperativeHandle, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { supabase } from "@/supabaseClient";
import { toast } from "react-toastify";
import { validateFormData } from "@/utils/validationCheck";
import { EmailBodyTempEnum } from "@/utils/emailService/templateDetails";
import { sendEmail } from "@/utils/emailService";
import { submitAppointmentFlow } from "@/lib/submitAppointment";

export function useCSAFormLogic({ location, ref, onSuccess }: { location?: any; ref?: any; onSuccess?: () => void } = {}) {
    const t = useTranslations("appoinment_form");
    const locale = useLocale();
    const tableName = locale === "es" ? "services_es" : "services";
    // Real-time transcript state
    // Store transcript as object with role and text for compatibility with TranscriptDisplay
    const [currentTranscript, setCurrentTranscript] = useState<{ role: "agent" | "user"; text: string } | null>(null);
    // Handler for real-time transcript updates from VoiceIntake
    const onTranscript = (event: { role?: string, transcript?: string, transcriptType?: string }) => {
        if (event.transcript && event.role) {
            setCurrentTranscript({
                role: event.role === "agent" ? "agent" : "user",
                text: event.transcript
            });
        }
    };

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [sex, setSex] = useState("");
    const [dob, setDob] = useState<Date | null>(null);
    const [services, setServices] = useState<string[] | null | undefined>([]);
    const [service, setService] = useState("");
    const [phone, setPhone] = useState("");
    type DateAndTimeType = string | { date: string; time: string };
    const [date_and_time, setDate_and_time] = useState<DateAndTimeType>("");
    const [email_opt, setEmail_opt] = useState(false);
    const [text_opt, setText_opt] = useState(false);
    const [onsetDate, setOnsetDate] = useState<Date | null>(null);
    const [reliefSelect, setReliefSelect] = useState<string[]>([]);
    const [reliefOther, setReliefOther] = useState("");
    const [surgeryChoice, setSurgeryChoice] = useState("");
    const [allergyChoice, setAllergyChoice] = useState("");
    const [inOfficePatient, setInOfficePatient] = useState(true); // default to in-office
    const [newPatient, setNewPatient] = useState(true); // default to new
    const [medicalForm, setMedicalForm] = useState({
        chief_complaint: "",
        location: "",
        severity: "",
        symptoms_description: [] as string[],
        relieving_factors: "",
        medical_conditions: [] as string[],
        surgeries: "",
        allergies: [] as string[],
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
        state: "",
        zipcode: "",
        // Preventive/Reproductive history fields
        num_pregnancies: "",
        birth_control: "",
        pap_smear: "",
        pap_smear_date: "",
        mammogram: "",
        mammogram_date: "",
        prostate_exam: "",
        prostate_exam_date: "",
    });

    const genderOptions = [t("form_f8a"), t("form_f8b"), t("form_f8c")];

    // Autofill function for normalized API data
    const autofillFromNormalized = (normalized: any) => {
        // Demographics & schedule
        if (normalized.first_name !== undefined) setFirstName(normalized.first_name || "");
        if (normalized.last_name !== undefined) setLastName(normalized.last_name || "");
        if (normalized.email !== undefined) setEmail(normalized.email || "");
        if (normalized.street_address !== undefined) setStreetAddress(normalized.street_address || "");
        if (normalized.streetAddress !== undefined) setStreetAddress(normalized.streetAddress || "");
        if (normalized.phone !== undefined) setPhone(normalized.phone || "");
        if (normalized.phoneNumber !== undefined) setPhone(normalized.phoneNumber || "");
        if (normalized.sex !== undefined) setSex(normalized.sex || "");
        if (normalized.dob) {
            const d = new Date(normalized.dob);
            if (!isNaN(d.getTime())) setDob(d);
        }
        if (normalized.dateOfBirth) {
            const d = new Date(normalized.dateOfBirth);
            if (!isNaN(d.getTime())) setDob(d);
        }
        if (normalized.service !== undefined) setService(normalized.service || "");
        if (normalized.email_opt !== undefined) setEmail_opt(!!normalized.email_opt);
        if (normalized.text_opt !== undefined) setText_opt(!!normalized.text_opt);
        if (normalized.visit_type !== undefined) {
            // Convert "In-Office" | "Virtual" to boolean
            setInOfficePatient(normalized.visit_type === "In-Office");
        }
        if (normalized.patient_type !== undefined) {
            // Convert "New" | "Returning" to boolean
            setNewPatient(normalized.patient_type === "New");
        }
        // Direct autofill for state and zipcode if present
        if (normalized.state !== undefined) {
            setMedicalForm((prev) => ({ ...prev, state: normalized.state || "" }));
        }
        if (normalized.zipcode !== undefined) {
            setMedicalForm((prev) => ({ ...prev, zipcode: normalized.zipcode || "" }));
        }
        if (normalized.schedule_date || normalized.schedule_time || normalized.appointmentDate || normalized.appointmentTime) {
            setDate_and_time((prev: any) => {
                const prevDate = prev && typeof prev === 'object' && 'date' in prev ? (prev as any).date : '';
                const prevTime = prev && typeof prev === 'object' && 'time' in prev ? (prev as any).time : '';
                return {
                    date: normalized.schedule_date || normalized.appointmentDate || prevDate || "",
                    time: normalized.schedule_time || normalized.appointmentTime || prevTime || "",
                };
            });
        }

        // Medical
        setMedicalForm((prev) => {
            const next = { ...prev };
            if (normalized.chief_complaint !== undefined) next.chief_complaint = normalized.chief_complaint || "";
            if (normalized.reason_for_visit !== undefined) next.chief_complaint = normalized.reason_for_visit || next.chief_complaint;
            if (normalized.reasonForVisit !== undefined) next.chief_complaint = normalized.reasonForVisit || next.chief_complaint;
            if (normalized.location !== undefined) next.location = normalized.location || "";
            if (normalized.symptom_location !== undefined) next.location = normalized.symptom_location || next.location;
            if (normalized.symptomLocation !== undefined) next.location = normalized.symptomLocation || next.location;
            if (normalized.severity !== undefined) next.severity = normalized.severity ? String(normalized.severity) : "";
            if (normalized.symptoms_description !== undefined) {
                next.symptoms_description = Array.isArray(normalized.symptoms_description)
                    ? normalized.symptoms_description
                    : [normalized.symptoms_description].filter(Boolean);
            }
            if (normalized.symptomsDescription !== undefined) {
                next.symptoms_description = Array.isArray(normalized.symptomsDescription)
                    ? normalized.symptomsDescription
                    : [normalized.symptomsDescription].filter(Boolean);
            }
            if (normalized.relieving_factors !== undefined) {
                const opts = normalized.relieving_factors?.options;
                const other = normalized.relieving_factors?.other;
                next.relieving_factors = Array.isArray(opts) ? opts.join(', ') : prev.relieving_factors;
                if (other !== undefined) next.relieving_factors = [next.relieving_factors, other].filter(Boolean).join(', ');
            }
            if (normalized.relievingFactors !== undefined) {
                next.relieving_factors = Array.isArray(normalized.relievingFactors)
                    ? normalized.relievingFactors.join(', ')
                    : (normalized.relievingFactors || prev.relieving_factors);
            }
            if (normalized.medical_conditions !== undefined) {
                next.medical_conditions = Array.isArray(normalized.medical_conditions)
                    ? normalized.medical_conditions
                    : [normalized.medical_conditions].filter(Boolean);
            }
            if (normalized.medicalConditions !== undefined) {
                next.medical_conditions = Array.isArray(normalized.medicalConditions)
                    ? normalized.medicalConditions
                    : [normalized.medicalConditions].filter(Boolean);
            }
            if (normalized.surgeries !== undefined) {
                const surgeryValue = normalized.surgeries || "";
                next.surgeries = surgeryValue;
                // Explicitly set radio even when user said "No"
                setSurgeryChoice(surgeryValue ? 'Yes' : 'No');
            }
            if (normalized.allergies !== undefined) {
                const allergyValue = Array.isArray(normalized.allergies)
                    ? normalized.allergies.filter(Boolean)
                    : (normalized.allergies ? [String(normalized.allergies)] : []);
                next.allergies = allergyValue;
                // Explicitly set radio even when user said "No"
                setAllergyChoice(allergyValue.length > 0 ? 'Yes' : 'No');
            }
            if (normalized.current_medications !== undefined) next.current_medications = normalized.current_medications || "";
            if (normalized.currentMedications !== undefined) {
                next.current_medications = Array.isArray(normalized.currentMedications)
                    ? normalized.currentMedications.join(', ')
                    : (normalized.currentMedications || prev.current_medications);
            }
            if (normalized.family_history !== undefined) next.family_history = normalized.family_history || prev.family_history;
            if (normalized.familyHistory !== undefined) next.family_history = normalized.familyHistory || prev.family_history;
            if (normalized.tobacco_use !== undefined) next.tobacco_use = !!normalized.tobacco_use;
            if (normalized.alcohol_use !== undefined) next.alcohol_use = !!normalized.alcohol_use;
            if (normalized.drug_use !== undefined) next.drug_use = !!normalized.drug_use;
                if (normalized.lifestyle !== undefined) {
                    next.tobacco_use = !!normalized.lifestyle.tobacco;
                    next.alcohol_use = !!normalized.lifestyle.alcohol;
                    next.drug_use = !!normalized.lifestyle.drugs;
                    // Autofill state and zipcode if present in lifestyle
                    if (normalized.lifestyle.state !== undefined) {
                        next.state = normalized.lifestyle.state || prev.state;
                    }
                    if (normalized.lifestyle.zipcode !== undefined) {
                        next.zipcode = normalized.lifestyle.zipcode || prev.zipcode;
                    }
                }
            if (normalized.occupation !== undefined) next.occupation = normalized.occupation || "";
            if (normalized.cancer_type !== undefined) next.cancer_type = normalized.cancer_type || "";
            if (normalized.cancerType !== undefined) next.cancer_type = normalized.cancerType || "";
            if (normalized.num_pregnancies !== undefined) next.num_pregnancies = String(normalized.num_pregnancies ?? "");
            if (normalized.numberOfPregnancies !== undefined) next.num_pregnancies = String(normalized.numberOfPregnancies ?? "");
            if (normalized.birth_control !== undefined) next.birth_control = normalized.birth_control || "";
            if (normalized.birthControl !== undefined) next.birth_control = normalized.birthControl || "";
            if (normalized.pap_smear !== undefined) next.pap_smear = normalized.pap_smear || "";
            if (normalized.lastPapSmear !== undefined) next.pap_smear = normalized.lastPapSmear || "";
            if (normalized.pap_smear_date !== undefined) next.pap_smear_date = normalized.pap_smear_date || "";
            if (normalized.mammogram !== undefined) next.mammogram = normalized.mammogram || "";
            if (normalized.lastMammogram !== undefined) next.mammogram = normalized.lastMammogram || "";
            if (normalized.mammogram_date !== undefined) next.mammogram_date = normalized.mammogram_date || "";
            if (normalized.prostate_exam !== undefined) next.prostate_exam = normalized.prostate_exam || "";
            if (normalized.lastProstateExam !== undefined) next.prostate_exam = normalized.lastProstateExam || "";
            if (normalized.prostate_exam_date !== undefined) next.prostate_exam_date = normalized.prostate_exam_date || "";
            return next;
        });
        if (normalized.relieving_factors !== undefined && Array.isArray(normalized.relieving_factors?.options)) {
            setReliefSelect(normalized.relieving_factors.options);
        }
        if (normalized.relievingFactors !== undefined && Array.isArray(normalized.relievingFactors)) {
            setReliefSelect(normalized.relievingFactors);
        }
        if (normalized.relieving_factors?.other !== undefined) {
            setReliefOther(normalized.relieving_factors.other || "");
        }
        if (normalized.surgeries_choice !== undefined) setSurgeryChoice(normalized.surgeries_choice || "");
        if (normalized.allergies_choice !== undefined) setAllergyChoice(normalized.allergies_choice || "");
        if (normalized.onset_date) {
            const d = new Date(normalized.onset_date);
            if (!isNaN(d.getTime())) setOnsetDate(d);
        }
        if (normalized.symptom_duration !== undefined) {
            // Store symptom duration - could be added to medicalForm if needed
            // For now, we'll just acknowledge it was provided
        }
        if (normalized.symptomDuration !== undefined) {
            // Store symptom duration - could be added to medicalForm if needed
        }
    };

    useImperativeHandle(ref, () => ({
        autofillFromNormalized,
    }));

    useEffect(() => {
        if (!service && services && services.length > 0) {
            setService(services[0]);
        }
    }, [services, service]);

    useEffect(() => {
        const fetchServices = async () => {
            let { data } = await supabase.from(tableName).select("title");
            if (data) {
                const serviceData = data.map((item: any) => item.title);
                setServices(serviceData);
            }
        };
        fetchServices();
    }, [tableName]);

    const handleMedicalChange = (key: string, value: any) => {
        setMedicalForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleFamilyHistoryChange = (key: string, checked: boolean) => {
        setMedicalForm((prev: any) => {
            if (key === 'unknown') {
                return {
                    ...prev,
                    family_history: {
                        hypertension: false,
                        diabetes: false,
                        cancer: false,
                        heart_disease: false,
                        unknown: checked,
                    },
                    cancer_type: '',
                };
            }
            const nextFamily = {
                ...prev.family_history,
                [key]: checked,
                unknown: false,
            };
            const nextCancerType = key === 'cancer' && !checked ? '' : prev.cancer_type;
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
    };

    const fillTestData = () => {
        const onsetSampleDate = new Date('2025-12-18');
        const sample = {
            first_name: 'Test',
            last_name: 'Patient',
            email_address: 'test@example.com',
            phone: '+1 (555) 123-4567',
            sex: genderOptions[0] || 'Male',
            service: services?.[0] || 'Test Service',
            medical: {
                onsetDate: onsetSampleDate,
                chief_complaint: 'Shortness of breath',
                location: 'Chest',
                severity: '6',
                symptoms_description: 'Patient reports difficulty breathing, worse with exertion and when lying flat',
                relieving_select: 'Other',
                relieving_other: 'Sitting upright provides mild relief',
                medical_conditions: 'Asthma',
                surgeries: 'Appendectomy (2015)',
                surgeries_choice: 'Yes',
                allergies: 'Penicillin',
                allergies_choice: 'Yes',
                current_medications: 'Albuterol inhaler',
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
        setSex(sample.sex);
        setService(sample.service);
        if (Array.isArray(sample.medical.relieving_select)) {
            setReliefSelect(sample.medical.relieving_select);
        } else if (typeof sample.medical.relieving_select === 'string' && sample.medical.relieving_select) {
            setReliefSelect([sample.medical.relieving_select]);
        } else {
            setReliefSelect([]);
        }
        setReliefOther(sample.medical.relieving_other);
        setSurgeryChoice(sample.medical.surgeries_choice);
        setAllergyChoice(sample.medical.allergies_choice);
        handleOnsetDateChange(sample.medical.onsetDate);
        setMedicalForm((prev) => ({
            ...prev,
            chief_complaint: sample.medical.chief_complaint,
            location: sample.medical.location,
            severity: sample.medical.severity,
            symptoms_description: typeof sample.medical.symptoms_description === 'string' ? [sample.medical.symptoms_description] : sample.medical.symptoms_description,
            relieving_factors:
                sample.medical.relieving_select === 'Other'
                    ? sample.medical.relieving_other
                    : sample.medical.relieving_select,
            medical_conditions: typeof sample.medical.medical_conditions === 'string' ? [sample.medical.medical_conditions] : sample.medical.medical_conditions,
            surgeries: sample.medical.surgeries,
            allergies: typeof sample.medical.allergies === 'string' ? [sample.medical.allergies] : sample.medical.allergies,
            current_medications: sample.medical.current_medications,
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
    };

    type ConsentPdfPayload = {
        telemedicine?: string;
        hipaa?: string;
        general?: string;
    };

    const submitAppointmentDetails = async (consentPdfs?: ConsentPdfPayload) => {
        // console.log('=== SUBMIT APPOINTMENT STARTED ===');
        // console.log('[STEP 1] Button clicked with consentPdfDataUrl:', consentPdfDataUrl ? 'Present' : 'None');
        
        // [BookNow] Button clicked
        let appointmentDetails: any = {
            location_id: location.id,
            first_name: firstName,
            last_name: lastName,
            email_address: email,
            sex: sex,
            phone: phone,
            service: service,
            in_office_patient: false,
            new_patient: false,
            dob: dob ? dob.toISOString().split('T')[0] : null,
            address: streetAddress && medicalForm.state && medicalForm.zipcode
                ? `${streetAddress}, ${medicalForm.state}, ${medicalForm.zipcode}`
                : streetAddress || null,
            email_opt,
            text_opt
        };
        // console.log('[STEP 1] Appointment details created:', appointmentDetails);

        // [BookNow] appointmentDetails
        // STEP 1: Check if patient exists first (using email AND phone)
        // console.log('[STEP 2] Checking if patient already exists...');
        // console.log('[STEP 2a] Looking for patient with email:', email, 'and phone:', phone);
        
        let patientId = null;
        let patientCount = 0;
        let isNewPatient = false;
        
        try {
            // First, check if patient exists with matching email AND phone
            const { data: existingPatients, error: checkError } = await supabase
                .from('allpatients')
                .select('id, firstname, lastname, email, phone, gender, dob, locationid, onsite, created_at')
                .eq('email', email)
                .eq('phone', phone) as any;
            
            // console.log('[STEP 2b] Existing patient check - Found:', existingPatients?.length || 0, 'patients');
            
            if (checkError) {
                // console.error('[STEP 2b ERROR] Error checking for existing patient:', checkError);
                throw checkError;
            }
            
            if (existingPatients && existingPatients.length > 0) {
                // Patient exists - use existing patient ID
                patientId = existingPatients[0].id; // Use first/oldest record
                patientCount = existingPatients.length;
                isNewPatient = false;
                // console.log('[STEP 2c] EXISTING PATIENT FOUND!');
                // console.log('[STEP 2c] Using existing patient ID:', patientId);
                // console.log('[STEP 2c] Total records for this patient:', patientCount);
                // console.log('[STEP 2c] Patient details:', JSON.stringify(existingPatients[0], null, 2));
            } else {
                // Patient does NOT exist - create new patient record
                // console.log('[STEP 2d] NEW PATIENT - No existing record found');
                // console.log('[STEP 2d] Creating new patient record in allpatients table...');
                
                // Prepare data for allpatients table - only insert for NEW patients
                const allPatientsData = {
                    firstname: firstName,
                    lastname: lastName,
                    email: email,
                    gender: sex,
                    dob: dob ? dob.toISOString().split('T')[0] : null,
                    phone: phone,
                    address: streetAddress && medicalForm.state && medicalForm.zipcode
                        ? `${streetAddress}, ${medicalForm.state}, ${medicalForm.zipcode}`
                        : streetAddress || null,
                    locationid: (location as any)?.id,
                    onsite: true,  // Set to true for new patients booking through CSA form
                    email_opt: email_opt || false,
                    text_opt: text_opt || false
                };
                
                // console.log('[STEP 2e] New patient data to insert (onsite=true):', JSON.stringify(allPatientsData, null, 2));
                
                const { data: insertData, error: insertError } = await supabase
                    .from('allpatients')
                    .insert([allPatientsData] as any)
                    .select('id') as any;
                
                if (insertError) {
                    // console.error('[STEP 2f ERROR] Failed to insert new patient:', insertError);
                    throw insertError;
                }
                
                if (insertData && insertData.length > 0) {
                    patientId = insertData[0].id;
                    patientCount = 1;
                    isNewPatient = true;
                    // console.log('[STEP 2f SUCCESS] New patient created with ID:', patientId);
                    // console.log('[STEP 2f SUCCESS] Patient inserted into allpatients table with onsite=true');
                } else {
                    // console.error('[STEP 2f ERROR] No patient ID returned from insert!');
                    throw new Error('Failed to get patient ID after insert');
                }
            }
            
            // console.log('[STEP 2 COMPLETE] Patient ID:', patientId, '| Is New Patient:', isNewPatient, '| Total Records:', patientCount);
            
        } catch (err) {
            // console.error('[STEP 2 EXCEPTION] Error in patient check/insert:', err);
            // console.error('[STEP 2 EXCEPTION] Stack:', (err as any)?.stack);
        }

      
        // Insert into Appoinments table as per new requirement
        // Format date_and_time as 'locationid|date - time'
        // console.log('[STEP 3] Formatting date and time...');
        // console.log('[STEP 3a] Location ID:', (location as any)?.id);
        // console.log('[STEP 3a] date_and_time raw:', date_and_time);
        // console.log('[STEP 3a] date_and_time type:', typeof date_and_time);
        
        let dateAndTime = null; // Default to null
        
        // Only format if date_and_time is actually provided
        if (date_and_time) {
            if (typeof date_and_time === 'object' && 'date' in date_and_time && 'time' in date_and_time) {
                // Check if both date and time have actual values
                if (date_and_time.date && date_and_time.time && (location as any)?.id) {
                    dateAndTime = `${(location as any).id}|${date_and_time.date} ${date_and_time.time}`;
                    // console.log('[STEP 3b] Formatted dateAndTime (object):', dateAndTime);
                } else {
                    // Generate unique timestamp to avoid constraint violations
                    const now = new Date();
                    const uniqueDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                    const uniqueTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${now.getMilliseconds()}`;
                    dateAndTime = `${(location as any).id}|${uniqueDate} ${uniqueTime}`;
                    // console.log('[STEP 3b] Generated unique dateAndTime:', dateAndTime);
                }
            } else if (typeof date_and_time === 'string' && date_and_time.trim() && (location as any)?.id) {
                dateAndTime = `${(location as any).id}|${date_and_time}`;
                // console.log('[STEP 3b] Formatted dateAndTime (string):', dateAndTime);
            } else {
                // Generate unique timestamp to avoid constraint violations
                const now = new Date();
                const uniqueDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                const uniqueTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${now.getMilliseconds()}`;
                dateAndTime = `${(location as any).id}|${uniqueDate} ${uniqueTime}`;
                // console.log('[STEP 3b] Generated unique dateAndTime:', dateAndTime);
            }
        } else {
            // Generate unique timestamp to avoid constraint violations when no date_and_time is provided
            const now = new Date();
            const uniqueDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            const uniqueTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${now.getMilliseconds()}`;
            dateAndTime = `${(location as any).id}|${uniqueDate} ${uniqueTime}`;
            // console.log('[STEP 3b] No date_and_time provided, generated unique timestamp:', dateAndTime);
        }
        
        // console.log('[STEP 3 COMPLETE] Final dateAndTime value:', dateAndTime);
        // [BookNow] dateAndTime
        // STEP 3: Insert into Appoinments table
        // console.log('[STEP 4] Preparing appointment data for Appoinments table...');
        
        // Determine if patient is new based on patient count
        // If patientCount === 1, it means this is first record in allpatients table = new patient
        // If patientCount > 1, patient ID exists multiple times = returning patient
        const isNewPatientForAppointment = patientCount === 1;
        // console.log('[STEP 4a] Patient count:', patientCount, '→ new_patient flag:', isNewPatientForAppointment);
        
        const appoinmentData = {
            service: service,
            location_id: (location as any)?.id,
            patient_id: patientId,
            new_patient: isNewPatientForAppointment
        };
        // console.log('[STEP 4b] Appointment data to insert:', JSON.stringify(appoinmentData, null, 2));
        
        // ALWAYS create a new appointment - no duplicate checking
        let appointmentId = null;
        try {
            // console.log('[STEP 4c] Creating new appointment (always insert new record)...');
            // console.log('[STEP 4c] Inserting into Appoinments table with:');
            // console.log('[STEP 4c]   - service:', service);
            // console.log('[STEP 4c]   - location_id:', (location as any)?.id);
            // console.log('[STEP 4c]   - patient_id:', patientId, '(existing patient ID or newly created)');
            // console.log('[STEP 4c]   - new_patient:', isNewPatientForAppointment, '(based on patientCount =', patientCount + ')');
            // console.log('[STEP 4c]   - date_and_time:', dateAndTime);
            
            // Insert appointment into Appoinments table - ALWAYS CREATE NEW
            const { data: appointmentInsertData, error: appointmentInsertError } = await supabase.from('Appoinments').insert([
                {
                    service: service,
                    date_and_time: dateAndTime,
                    patient_id: patientId,
                    location_id: (location as any)?.id,
                    new_patient: isNewPatientForAppointment  // true if patientCount=1, false otherwise
                }
            ] as any).select('id') as any;
            // [BookNow] Appoinments insert result
            console.log('[STEP 4d] Appointment insert result:', JSON.stringify(appointmentInsertData, null, 2));
            if (appointmentInsertError) {
                console.error('[STEP 4d ERROR] Appointment insert error:', appointmentInsertError);
                throw appointmentInsertError;
            }
            if (appointmentInsertData && appointmentInsertData.length > 0) {
                appointmentId = appointmentInsertData[0].id;
                console.log('[STEP 4d SUCCESS] New appointment created with ID:', appointmentId);
                console.log('[STEP 4d SUCCESS] Appointment record inserted into Appoinments table');
            } else {
                console.warn('[STEP 4d WARNING] No appointment ID returned!');
            }
        } catch (err) {
            console.error('[STEP 4 EXCEPTION] Error inserting into Appoinments:', err);
            console.error('[STEP 4 EXCEPTION] Error details:', JSON.stringify(err, null, 2));
            toast.error('Failed to create appointment. Please try again.');
        }
        console.log('[STEP 4 COMPLETE] Final appointmentId:', appointmentId, '| new_patient:', isNewPatientForAppointment);

        // CRITICAL CHECK: If appointment creation failed, stop here
        if (!appointmentId) {
            // console.error('[CRITICAL ERROR] Appointment creation failed - stopping submission process');
            // console.error('[CRITICAL ERROR] Cannot proceed without valid appointmentId');
            toast.error('Appointment creation failed. Please check the date/time and try again.');
            return; // Stop execution - do not proceed to intake_form or any other steps
        }

        // STEP 4: Insert into intake_form table
        // console.log('[STEP 5] Preparing medical information for intake_form table...');
        // console.log('[STEP 5a] Using appointmentId:', appointmentId);
        
        let intakeInserted = false;
        if (!appointmentId) {
            // console.error('[STEP 5 ERROR] Cannot insert intake_form - no appointmentId available!');
        } else {
            try {
                // Prepare relieving factors as JSON - ensure it's always an array or null
                let relievingFactorsJson = null;
                if (reliefSelect && reliefSelect.length > 0) {
                    relievingFactorsJson = reliefSelect;
                } else if (medicalForm.relieving_factors) {
                    // Fallback if reliefSelect is empty but relieving_factors has data
                    relievingFactorsJson = [medicalForm.relieving_factors];
                }
                
                // Prepare medical conditions - handle string or array, ensure data is saved
                let medicalConditionsJson = null;
                if (Array.isArray(medicalForm.medical_conditions) && medicalForm.medical_conditions.length > 0) {
                    medicalConditionsJson = medicalForm.medical_conditions;
                } else if (typeof medicalForm.medical_conditions === 'string' && (medicalForm.medical_conditions as string).trim()) {
                    medicalConditionsJson = [(medicalForm.medical_conditions as string).trim()];
                }
                
                // Prepare surgeries - handle string or array, ensure data is saved
                let surgeriesJson = null;
                if (Array.isArray(medicalForm.surgeries) && medicalForm.surgeries.length > 0) {
                    surgeriesJson = medicalForm.surgeries;
                } else if (typeof medicalForm.surgeries === 'string' && (medicalForm.surgeries as string).trim()) {
                    surgeriesJson = [(medicalForm.surgeries as string).trim()];
                }
                
                // Prepare allergies - handle string or array, ensure data is saved
                let allergiesJson = null;
                if (Array.isArray(medicalForm.allergies) && medicalForm.allergies.length > 0) {
                    allergiesJson = medicalForm.allergies;
                } else if (typeof medicalForm.allergies === 'string' && (medicalForm.allergies as string).trim()) {
                    allergiesJson = [(medicalForm.allergies as string).trim()];
                }
                
                // Prepare current medications - handle string or array, ensure data is saved
                let currentMedicationsJson = null;
                if (medicalForm.current_medications) {
                    if (Array.isArray(medicalForm.current_medications)) {
                        currentMedicationsJson = medicalForm.current_medications;
                    } else if (typeof medicalForm.current_medications === 'string' && medicalForm.current_medications.trim()) {
                        currentMedicationsJson = [medicalForm.current_medications.trim()];
                    }
                }
                
                // console.log('[STEP 5b-prep] Processed JSON fields:');
                // console.log('[STEP 5b-prep]   - relieving_factors:', relievingFactorsJson);
                // console.log('[STEP 5b-prep]   - medical_conditions:', medicalConditionsJson);
                // console.log('[STEP 5b-prep]   - surgeries:', surgeriesJson);
                // console.log('[STEP 5b-prep]   - allergies:', allergiesJson);
                // console.log('[STEP 5b-prep]   - current_medications:', currentMedicationsJson);
                
                // Prepare intake form data according to schema
                const intakeFormData = {
                    appointment_id: appointmentId,
                    chief_complaint: medicalForm.chief_complaint || null,
                    location: medicalForm.location || null,
                    severity: medicalForm.severity ? parseInt(medicalForm.severity) : null,
                    symptoms_description: Array.isArray(medicalForm.symptoms_description) 
                        ? medicalForm.symptoms_description.join(', ') 
                        : (medicalForm.symptoms_description || null),
                    
                    // JSON fields - now guaranteed to save if data exists
                    medical_conditions: medicalConditionsJson,
                    surgeries: surgeriesJson,
                    allergies: allergiesJson,
                    current_medications: currentMedicationsJson,
                    relieving_factors: relievingFactorsJson,
                    
                    // Family history booleans
                    fh_diabetes: medicalForm.family_history?.diabetes ?? false,
                    fh_hypertension: medicalForm.family_history?.hypertension ?? false,
                    fh_cancer: medicalForm.family_history?.cancer ?? false,
                    fh_heart_disease: medicalForm.family_history?.heart_disease ?? false,
                    
                    // Lifestyle (boolean fields)
                    tobacco_use: medicalForm.tobacco_use ?? false,
                    alcohol_use: medicalForm.alcohol_use ?? false,
                    drug_use: medicalForm.drug_use ?? false,
                    
                    occupation: medicalForm.occupation || null,
                    onset: onsetDate ? onsetDate.toISOString().split('T')[0] : null,
                    cancer_type: medicalForm.family_history?.cancer ? (medicalForm.cancer_type || null) : null,
                    
                    // Female specific fields
                    number_of_pregnancies: medicalForm.num_pregnancies ? parseInt(medicalForm.num_pregnancies) : null,
                    birth_control: medicalForm.birth_control || null,
                    
                    // Exam status enums and dates
                    last_pap_smear_status: medicalForm.pap_smear || null,
                    last_pap_smear_month_year: medicalForm.pap_smear === 'Month & Year' ? medicalForm.pap_smear_date : null,
                    
                    mammography_status: medicalForm.mammogram || null,
                    mammography_month_year: medicalForm.mammogram === 'Month & Year' ? medicalForm.mammogram_date : null,
                    
                    last_prostate_exam_status: medicalForm.prostate_exam || null,
                    last_prostate_exam_month_year: medicalForm.prostate_exam === 'Month & Year' ? medicalForm.prostate_exam_date : null,
                    
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                
                // console.log('[STEP 5b] Intake form data prepared:', JSON.stringify(intakeFormData, null, 2));
                // console.log('[STEP 5c] Inserting into intake_form table...');
                
                const intakeResult = await supabase.from('intake_form').insert([intakeFormData] as any);
                
                // console.log('[STEP 5d] Intake form insert result:', JSON.stringify(intakeResult, null, 2));
                
                if (intakeResult.error) {
                    // console.error('[STEP 5d ERROR] Failed to insert intake_form:', intakeResult.error);
                    // console.error('[STEP 5d ERROR] Error details:', intakeResult.error.message);
                } else {
                    intakeInserted = true;
                    // console.log('[STEP 5d SUCCESS] Medical information inserted into intake_form table');
                }
            } catch (err) {
                // console.error('[STEP 5 EXCEPTION] Error inserting into intake_form:', err);
                // console.error('[STEP 5 EXCEPTION] Stack:', (err as any)?.stack);
            }
        }
        // console.log('[STEP 5 COMPLETE] intake_form processing finished');

        // Upload consent PDF to private bucket and store path
        // console.log('[STEP 6] Checking consent PDF upload...');
        let consentUploadSucceeded = false;
        const uploadForm = async (label: 'telemedicine' | 'hipaa' | 'general', dataUrl?: string) => {
            console.log(`[CONSENT UPLOAD] Attempting upload for label: ${label}`);
            if (!dataUrl) {
                console.warn(`[CONSENT UPLOAD] No dataUrl provided for ${label}`);
                return { ok: false, reason: 'missing' } as const;
            }
            try {
                const base64 = dataUrl.split(',')[1];
                if (!base64) {
                    console.error(`[CONSENT UPLOAD] No base64 data found in dataUrl for ${label}`);
                    return { ok: false, reason: 'no_base64' } as const;
                }
                console.log(`[CONSENT UPLOAD] Sending POST to /api/upload-consent for ${label} with appointmentId:`, appointmentId);
                const res = await fetch('/api/upload-consent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ appointmentId, pdfBase64: base64, formType: label })
                });
                if (!res.ok) {
                    const errText = await res.text();
                    console.error(`[STEP 6 ERROR] Upload ${label} consent failed:`, res.status, errText);
                    return { ok: false, reason: 'upload' } as const;
                }
                console.log(`[CONSENT UPLOAD] Upload for ${label} succeeded.`);
                return { ok: true } as const;
            } catch (err) {
                console.error(`[STEP 6 EXCEPTION] Upload ${label} consent error:`, err);
                return { ok: false, reason: 'exception' } as const;
            }
        };

        if (appointmentId && intakeInserted && consentPdfs) {
            console.log('[CONSENT UPLOAD] Starting consent PDF uploads:', {
                appointmentId,
                intakeInserted,
                consentPdfsPresent: !!consentPdfs,
                telemedicine: !!consentPdfs.telemedicine,
                hipaa: !!consentPdfs.hipaa,
                general: !!consentPdfs.general
            });
            const tele = await uploadForm('telemedicine', consentPdfs.telemedicine);
            const hipaa = await uploadForm('hipaa', consentPdfs.hipaa);
            const general = await uploadForm('general', consentPdfs.general);

            console.log('[CONSENT UPLOAD] Results:', { tele, hipaa, general });
            consentUploadSucceeded = tele.ok && hipaa.ok && general.ok;

            if (!consentUploadSucceeded) {
                toast.error('Could not upload all consent forms');
                if (!tele.ok) console.error('[CONSENT UPLOAD] Telemedicine upload failed:', tele);
                if (!hipaa.ok) console.error('[CONSENT UPLOAD] HIPAA upload failed:', hipaa);
                if (!general.ok) console.error('[CONSENT UPLOAD] General upload failed:', general);
            }
        } else {
            console.warn('[CONSENT UPLOAD] Skipping consent PDF upload - missing appointmentId, intakeInserted, or consentPdfs:', {
                appointmentId,
                intakeInserted,
                consentPdfsPresent: !!consentPdfs
            });
        }
        if (!dob) {
            toast.warning('Please fill Date of Birth');
            return;
        }

        if (!onsetDate) {
            toast.warning('Please fill onset date');
            return;
        }

        const requiredFields = [
            'location_id',
            'first_name',
            'last_name',
            'email_address',
            'sex',
            'phone',
            'service',
        ];
        const validateData = validateFormData(appointmentDetails)
        if (!validateData) {
            return
        }
        for (const field of requiredFields) {
            if (field === "service") {
                if (!service || (services && services.length > 0 && !services.includes(service))) {
                    toast.warning(`Please select a valid service`);
                    return;
                }
            } else if (!appointmentDetails[field]) {
                toast.warning(`Please fill in the ${field}`);
                return;
            }
        }
        // Send confirmation email to user
        const lang = locale
        const emailType = EmailBodyTempEnum.CONFIRMATION_OF_FORM_SUBMISSION
        const emailData: any = {
            email,
            name: `${firstName} ${lastName}`,
            location: location,
            service: service,
        }
        
        // Send email directly instead of using submitAppointmentFlow to avoid duplicate appointment insertion
        try {
            await sendEmail({
                lang,
                emailType,
                data: emailData,
            });
        } catch (emailErr) {
            console.error('Error sending confirmation email:', emailErr);
        }

        // Only show success once consent file is stored
        if (consentUploadSucceeded) {
            toast.success("Appointment Submitted");
            if (onSuccess) {
                onSuccess();
            }
        }

        // Reset all form fields after successful submission
        // console.log('[STEP 7] Resetting all form fields...');
        
        setFirstName("");
        setLastName("");
        setEmail("");
        setSex("");
        setDob(null);
        setService("");
        setPhone("");
        setDate_and_time("");
        setEmail_opt(false);
        setText_opt(false);
        setOnsetDate(null);
        setReliefSelect([]);
        setReliefOther("");
        setSurgeryChoice("");
        setAllergyChoice("");
        setMedicalForm({
            chief_complaint: "",
            location: "",
            severity: "",
            symptoms_description: [],
            relieving_factors: "",
            medical_conditions: [],
            surgeries: "",
            allergies: [],
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
            state: "",
            zipcode: "",
            num_pregnancies: "",
            birth_control: "",
            pap_smear: "",
            pap_smear_date: "",
            mammogram: "",
            mammogram_date: "",
            prostate_exam: "",
            prostate_exam_date: "",
        });
        
        // console.log('[STEP 7 COMPLETE] All form fields reset to initial state');
        // console.log('=== SUBMIT APPOINTMENT COMPLETED ===');
        // Appointment Submitted
    };

    return {
        t,
        locale,
        services,
        service,
        setService,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        email,
        setEmail,
        streetAddress,
        setStreetAddress,
        sex,
        setSex,
        dob,
        setDob,
        phone,
        setPhone,
        date_and_time,
        setDate_and_time,
        email_opt,
        setEmail_opt,
        text_opt,
        setText_opt,
        onsetDate,
        setOnsetDate,
        reliefSelect,
        setReliefSelect,
        reliefOther,
        setReliefOther,
        surgeryChoice,
        setSurgeryChoice,
        allergyChoice,
        setAllergyChoice,
        inOfficePatient,
        setInOfficePatient,
        newPatient,
        setNewPatient,
        medicalForm,
        setMedicalForm,
        handleMedicalChange,
        handleFamilyHistoryChange,
        handleBooleanFieldChange,
        handleOnsetDateChange,
        fillTestData,
        submitAppointmentDetails,
        genderOptions,
        currentTranscript,
        onTranscript,
        autofillFromNormalized
    };
}
