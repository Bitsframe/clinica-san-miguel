import { useEffect, useState, useImperativeHandle, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { supabase } from "@/supabaseClient";
import { toast } from "react-toastify";
import { validateFormData } from "@/utils/validationCheck";
import { EmailBodyTempEnum } from "@/utils/emailService/templateDetails";
import { sendEmail } from "@/utils/emailService";
import { submitAppointmentFlow } from "@/lib/submitAppointment";

export function useCSAFormLogic({ location, ref }: any) {
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
    const [sex, setSex] = useState("");
    const [dob, setDob] = useState<Date | null>(null);
    const [services, setServices] = useState<string[] | null | undefined>([]);
    const [service, setService] = useState("");
    const [phone, setPhone] = useState("");
    const [date_and_time, setDate_and_time] = useState("");
    const [email_opt, setEmail_opt] = useState(false);
    const [text_opt, setText_opt] = useState(false);
    const [onsetDate, setOnsetDate] = useState<Date | null>(null);
    const [reliefSelect, setReliefSelect] = useState<string[]>([]);
    const [reliefOther, setReliefOther] = useState("");
    const [surgeryChoice, setSurgeryChoice] = useState("");
    const [allergyChoice, setAllergyChoice] = useState("");
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
    });

    const genderOptions = [t("form_f8a"), t("form_f8b"), t("form_f8c")];

    // Autofill function for normalized API data
    const autofillFromNormalized = (normalized: any) => {
        setMedicalForm((prev) => ({
            ...prev,
            chief_complaint: normalized.chief_complaint || "",
            location: normalized.location || "",
            severity: normalized.severity ? String(normalized.severity) : "",
            symptoms_description: Array.isArray(normalized.symptoms_description) ? normalized.symptoms_description : [],
            relieving_factors: normalized.relieving_factors?.options?.join(', ') || "",
            medical_conditions: Array.isArray(normalized.medical_conditions) ? normalized.medical_conditions : [],
            surgeries: normalized.surgeries || "",
            allergies: Array.isArray(normalized.allergies) ? normalized.allergies : [],
            current_medications: normalized.current_medications || "",
            family_history: normalized.family_history || prev.family_history,
            tobacco_use: !!normalized.tobacco_use,
            alcohol_use: !!normalized.alcohol_use,
            drug_use: !!normalized.drug_use,
            occupation: normalized.occupation || "",
            cancer_type: normalized.cancer_type || "",
        }));
        setReliefSelect(Array.isArray(normalized.relieving_factors?.options) ? normalized.relieving_factors.options : []);
        setReliefOther(normalized.relieving_factors?.other || "");
        setSurgeryChoice(normalized.surgeries_choice || "");
        setAllergyChoice(normalized.allergies_choice || "");
        if (normalized.onset_date) {
            const d = new Date(normalized.onset_date);
            if (!isNaN(d.getTime())) setOnsetDate(d);
        }
    };

    useImperativeHandle(ref, () => ({
        autofillFromNormalized,
    }));

    useEffect(() => {
        if (!service && services && services.length > 0) {
            setService(services[0]);
        }
    }, [services]);

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

    const submitAppointmentDetails = async () => {
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
            dob: null,
            address: null,
            email_opt,
            text_opt
        };
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
        const postData = {
            ...appointmentDetails,
        }
        const lang = locale
        const emailType = EmailBodyTempEnum.CONFIRMATION_OF_FORM_SUBMISSION
        const emailData: any = {
            email,
            name: `${firstName} ${lastName}`,
            location: location,
            service: service,
        }
        const result = await submitAppointmentFlow({
            supabase,
            postData,
            medicalForm: {
                ...medicalForm,
                symptoms_description: Array.isArray(medicalForm.symptoms_description)
                    ? medicalForm.symptoms_description.join(', ')
                    : medicalForm.symptoms_description || '',
                medical_conditions: Array.isArray(medicalForm.medical_conditions)
                    ? medicalForm.medical_conditions.join(', ')
                    : medicalForm.medical_conditions || '',
                allergies: Array.isArray(medicalForm.allergies)
                    ? medicalForm.allergies.join(', ')
                    : medicalForm.allergies || '',
            },
            onsetDate,
            reliefSelect: reliefSelect.join(', '),
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
            toast.error(`Error submitting appointment: ${result.error?.message || result.error || 'Unknown error'}`);
            return;
        }
        toast.success("Appointment Submitted");
        setFirstName("");
        setLastName("");
        setEmail("");
        setSex("");
        setService("");
        setPhone("");
        setDate_and_time("");
        setEmail_opt(false)
        setText_opt(false)
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
        });
        console.log(emailData, "Appointment Submitted");
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
