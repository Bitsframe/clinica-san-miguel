"use client";

import { styles } from "@/app/[locale]/styles";
import { supabase } from "@/supabaseClient";
import { Button } from "@/utils";
import { Modal } from "flowbite-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import moment from "moment";

import ReactDatePicker from "react-datepicker";
import ScheduleDateTime from "../Modal/ScheduleDateTime";
import { toast } from "react-toastify";
import VoiceIntake from "../VoiceIntake";
import LanguageChanger from "@/components/LanguageChanger";
import { validateFormData } from "@/utils/validationCheck";
import PhoneInput from "react-phone-input-2";
import PhoneNumberInput from "./PhoneNumberInput";
import { EmailBodyTempEnum } from "@/utils/emailService/templateDetails";
import { sendEmail } from "@/utils/emailService";
import { submitAppointmentFlow } from "@/lib/submitAppointment";

const RadioButton = ({ value, name, label, checked, onChange }: any) => (
    <div className="flex items-center justify-start gap-3">
        <input
            type="radio"
            value={value}
            name={name}
            checked={checked}
            onChange={onChange}
            className="w-[25px] h-[25px] bg-transparent border-[2px] border-[#000000] hover:bg-[#ccc]"
        />{" "}
        <label className="text-[16px] text-customGray font-poppins">{label}</label>
    </div>
);

const RadioButtons = ({
    name,
    options,
    label,
    selectedValue,
    onChange,
}: {
    name: string;
    options: string[];
    label: string;
    selectedValue: string;
    onChange: (value: string) => void;
}) => (
    <div className="flex flex-row items-center justify-start gap-4 h-full">
        <label className="text-[16px] text-customGray font-poppins font-bold mt-6">
            {label}:
        </label>
        <div className="flex flex-wrap gap-4 mt-6">
            {options.map((value, index) => (
                <RadioButton
                    key={index}
                    value={value}
                    name={name}
                    label={value}
                    checked={selectedValue === value}
                    onChange={() => onChange(value)}
                />
            ))}
        </div>
    </div>
);

const Input = ({
    label,
    placeholder,
    breakpoint,
    value,
    type = 'text',
    onChange,
}: {
    label: string;
    placeholder: string;
    breakpoint: boolean;
    value: string;
    type?: string;
    onChange: (value: string) => void;
}) => (
    <div
        className={`flex flex-col items-start w-full
            } justify-center`}
    >
        <label className="text-[16px] text-customGray font-poppins font-bold">
            {label}:
        </label>
        <input
            type={type}
            placeholder={`${placeholder}`}
            className="w-full h-[46px] border-[1px] border-[#000000] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

const DatePicker = ({
    label,
    placeholder,
    breakpoint,
    value,
    onChange,
}: {
    label: string;
    placeholder: string;
    breakpoint: boolean;
    value: Date | null;
    onChange: (value: Date | null) => void;


}) => (
    <div
        className={`flex flex-col items-start w-full ${breakpoint ? "md:w-1/2" : ""
            } justify-center`}
    >
        <label className="text-[16px] text-customGray font-poppins font-bold">
            {label}:
        </label>

        {/* @ts-ignore */}
        <ReactDatePicker
            selected={value}
            onChange={(date) => onChange(date)}
            placeholderText={placeholder}
            dateFormat="yyyy-MM-dd HH:MM"
            calendarClassName="fixed-calendar-height"
            className="w-full h-[46px] border-[1px] border-[#000000] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
        />
    </div>
);

const Dropdown = ({
    label,
    options,
    breakpoint,
    value,
    onChange,
    startingSelectedOption
}: {
    label: string;
    options: string[] | null | undefined;
    breakpoint: boolean;
    value: string;
    startingSelectedOption?: boolean;
    onChange: (value: string) => void;


}


) => {

    const t = useTranslations("appoinment_form");
    return (
        <div
            className={`flex flex-col items-start w-full
                } justify-center`}
        >
            <label className="text-[16px] text-customGray font-poppins font-bold">
                {label}:
            </label>
            <select
                className="w-full h-[46px] border-[1px] border-[#000000] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {startingSelectedOption && <option value='' selected disabled>
                    {t("select_label")} {label}
                </option>}
                {options?.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
};

const Self_Appointment = ({ location }: any) => {
    const t = useTranslations("appoinment_form");
    const locale = useLocale();

    const tableName = locale === "es" ? "services_es" : "services";

    console.log(location, '===============')

    // const [openModal, setOpenModal] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [sex, setSex] = useState("");
    const [dob, setDob] = useState<Date | null>(null);
    const [services, setServices] = useState<string[] | null | undefined>([]);
    const [service, setService] = useState("");

    // Set default service if not set and services are loaded
    useEffect(() => {
        if (!service && services && services.length > 0) {
            setService(services[0]);
        }
    }, [services]);
    const [phone, setPhone] = useState("");
    const [newPatient, setNewPatient] = useState("");
    const [date_and_time, setDate_and_time] = useState("");
    const [email_opt, setEmail_opt] = useState(false)
    const [text_opt, setText_opt] = useState(false)

    // Medical intake state
    const [onsetDate, setOnsetDate] = useState<Date | null>(null);
    const [reliefSelect, setReliefSelect] = useState("");
    const [reliefOther, setReliefOther] = useState("");
    const [surgeryChoice, setSurgeryChoice] = useState("");
    const [allergyChoice, setAllergyChoice] = useState("");
    const [medicalForm, setMedicalForm] = useState({
        chief_complaint: "",
        location: "",
        severity: "",
        symptoms_description: "",
        relieving_factors: "",
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
    });

    const patientType = [t("form_f2a"), t("form_f2b")];
    const genderOptions = [t("form_f8a"), t("form_f8b"), t("form_f8c")];

    useEffect(() => {
        const fetchServices = async () => {
            let { data, error } = await supabase.from(tableName).select("title");

            if (data) {
                const serviceData = data.map((item) => item.title);
                setServices(serviceData);
            }
        };

        fetchServices();
    }, [tableName]);

    const handleMedicalChange = (key: string, value: string) => {
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
        if (!date) {
            return;
        }
    };

    const parseIntOrNull = (value: string) => {
        if (!value || value.trim() === '') return null;
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? null : parsed;
    };

    const stringToJsonArray = (value: string) => {
        if (!value || value.trim() === '') return null;
        return value.split(',').map((v) => v.trim()).filter(Boolean);
    };

    const booleanToString = (value: boolean) => (value ? 'yes' : 'no');

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

        setReliefSelect(sample.medical.relieving_select);
        setReliefOther(sample.medical.relieving_other);
        setSurgeryChoice(sample.medical.surgeries_choice);
        setAllergyChoice(sample.medical.allergies_choice);

        handleOnsetDateChange(sample.medical.onsetDate);

        setMedicalForm((prev) => ({
            ...prev,
            chief_complaint: sample.medical.chief_complaint,
            location: sample.medical.location,
            severity: sample.medical.severity,
            symptoms_description: sample.medical.symptoms_description,
            relieving_factors:
                sample.medical.relieving_select === 'Other'
                    ? sample.medical.relieving_other
                    : sample.medical.relieving_select,
            medical_conditions: sample.medical.medical_conditions,
            surgeries: sample.medical.surgeries,
            allergies: sample.medical.allergies,
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
                // If service is set and is in the list, don't require re-selection
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
            medicalForm,
            onsetDate,
            reliefSelect,
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
        setReliefSelect("");
        setReliefOther("");
        setSurgeryChoice("");
        setAllergyChoice("");
        setMedicalForm({
            chief_complaint: "",
            location: "",
            severity: "",
            symptoms_description: "",
            relieving_factors: "",
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
        });
        console.log(emailData, "Appointment Submitted");
    };

    return (<>
        <div className="relative w-screen min-h-screen">
            <div className="md:absolute px-5 md:px-0 pt-4 pb-5 md:py-0 w-full flex justify-end md:top-6 md:right-6">
                <LanguageChanger locale={locale} />
            </div>
            <div className="flex justify-center h-full items-center px-5 md:px-0">
                <div className="w-full max-w-[800px] rounded-[20px] mt-8 gap-y-5">
                    {/* Voice Intake Mic Button */}
                    <div className="mb-4">
                        <VoiceIntake setForm={setMedicalForm} />
                    </div>
                    <div className="flex flex-col w-full justify-center border-b-[1px] border-black px-4 pb-2 text-center mb-9">
                        <div className="flex w-full items-center justify-between gap-3">
                            <h1
                                className={`${styles.sectionHeadText} `}
                                style={{ textAlign: "left", color: "#C1001F" }}
                            >
                                {t("self_form_title")}
                            </h1>
                            <button
                                type="button"
                                onClick={fillTestData}
                                className="rounded-md border border-black px-3 py-2 text-sm font-semibold text-black hover:bg-black hover:text-white transition"
                            >
                                Fill test data
                            </button>
                        </div>
                        <p className="text-[#767676]">{location.title}</p>
                    </div>
                    <section className="grid md:grid-cols-2 grid-cols-1 place-content-baseline gap-8">
                        <Dropdown
                            label={t("form_f10")}
                            options={services}
                            breakpoint={true}
                            onChange={setService}
                            value={service}
                            startingSelectedOption={true}
                        />
                        <Input
                            label={t("form_f5")}
                            placeholder="Your current email address"
                            type='email'
                            breakpoint={false}
                            onChange={setEmail}
                            value={email}
                        />
                        <Input
                            label={t("form_f3")}
                            placeholder="Enter your first name"
                            breakpoint={true}
                            onChange={setFirstName}
                            value={firstName}
                        />
                        <Input
                            label={t("form_f4")}
                            placeholder="Enter your last name"
                            breakpoint={true}
                            onChange={setLastName}
                            value={lastName}
                        />
                        <PhoneNumberInput
                            label={t("form_f6")}
                            placeholder="ex. +1 (123) 456-7890"
                            breakpoint={false}
                            onChange={setPhone}
                            value={phone}
                        />
                        <RadioButtons
                            name="gender"
                            options={genderOptions}
                            label={t("form_f8")}
                            onChange={setSex}
                            selectedValue={sex}
                        />
                        <DatePicker
                            label="Date of Birth"
                            placeholder="your date of birth"
                            breakpoint={false}
                            value={dob}
                            onChange={setDob}
                        />
                        <ScheduleDateTime
                            data={location}
                            selectDateTimeSlotHandle={(date, time) => {
                                // Store as string for now, you can adjust as needed
                                setDate_and_time(time ? `${date} ${time}` : date ? date.toString() : '');
                            }}
                        />

                        {/* Medical intake */}
                        <div className="col-span-full space-y-4 pt-4">
                            <h2 className="text-lg font-semibold text-customGray">Medical Information</h2>
                            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                                <Input
                                    label="Reason for Visit"
                                    placeholder="Describe your main concern"
                                    breakpoint={true}
                                    onChange={(val) => handleMedicalChange('chief_complaint', val)}
                                    value={medicalForm.chief_complaint}
                                />
                                <div className="flex flex-col items-start w-full justify-center">
                                    <label className="text-[16px] text-customGray font-poppins font-bold">how long are you feeling this?</label>
                                    {/* @ts-ignore */}
                                    <ReactDatePicker
                                        selected={onsetDate}
                                        onChange={(date) => handleOnsetDateChange(date)}
                                        placeholderText="Select onset date"
                                        maxDate={new Date()}
                                        dateFormat="yyyy-MM-dd"
                                        className="w-full h-[46px] border-[1px] border-[#000000] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                    />
                                </div>
                                <Input
                                    label="Location of symptoms"
                                    placeholder="e.g., Chest, Knee"
                                    breakpoint={true}
                                    onChange={(val) => handleMedicalChange('location', val)}
                                    value={medicalForm.location}
                                />
                                <div className="flex flex-col items-start w-full justify-center">
                                    <label className="text-[16px] text-customGray font-poppins font-bold">Severity (1-10):</label>
                                    <select
                                        className="w-full h-[46px] border-[1px] border-[#000000] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                        value={medicalForm.severity}
                                        onChange={(e) => handleMedicalChange('severity', e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col items-start w-full justify-center md:col-span-2">
                                    <label className="text-[16px] text-customGray font-poppins font-bold">Symptom Details:</label>
                                    <textarea
                                        className="w-full min-h-[90px] border-[1px] border-[#000000] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 py-3 bg-transparent outline-none rounded-[10px]"
                                        placeholder="Describe your symptoms"
                                        value={medicalForm.symptoms_description}
                                        onChange={(e) => handleMedicalChange('symptoms_description', e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col items-start w-full justify-center">
                                    <label className="text-[16px] text-customGray font-poppins font-bold">Relieving Factors:</label>
                                    <select
                                        className="w-full h-[46px] border-[1px] border-[#000000] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                        value={reliefSelect}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setReliefSelect(val);
                                            setMedicalForm((prev) => ({ ...prev, relieving_factors: val === 'Other' ? reliefOther : val }));
                                        }}
                                    >
                                        <option value="">Select</option>
                                        {['Rest', 'Ice', 'Heat', 'Elevation', 'Medication', 'Stretching', 'Massage', 'Support or compression', 'Time', 'Other'].map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    {reliefSelect === 'Other' && (
                                        <input
                                            className="w-full h-[46px] mt-2 border-[1px] border-[#000000] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                            placeholder="Describe other relieving factor"
                                            value={reliefOther}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setReliefOther(val);
                                                setMedicalForm((prev) => ({ ...prev, relieving_factors: val }));
                                            }}
                                        />
                                    )}
                                </div>
                                <Input
                                    label="Medical Conditions"
                                    placeholder="e.g., Asthma, Diabetes"
                                    breakpoint={true}
                                    onChange={(val) => handleMedicalChange('medical_conditions', val)}
                                    value={medicalForm.medical_conditions}
                                />
                                <Input
                                    label="Current Medications"
                                    placeholder="e.g., Albuterol, Metformin"
                                    breakpoint={true}
                                    onChange={(val) => handleMedicalChange('current_medications', val)}
                                    value={medicalForm.current_medications}
                                />
                                <div className="flex flex-col items-start w-full justify-center">
                                    <label className="text-[16px] text-customGray font-poppins font-bold">Surgeries:</label>
                                    <select
                                        className="w-full h-[46px] border-[1px] border-[#000000] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                        value={surgeryChoice}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setSurgeryChoice(val);
                                            if (val !== 'Yes') {
                                                setMedicalForm((prev) => ({ ...prev, surgeries: '' }));
                                            }
                                        }}
                                    >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                    {surgeryChoice === 'Yes' && (
                                        <input
                                            className="w-full h-[46px] mt-2 border-[1px] border-[#000000] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                            placeholder="Type of surgery"
                                            value={medicalForm.surgeries}
                                            onChange={(e) => handleMedicalChange('surgeries', e.target.value)}
                                        />
                                    )}
                                </div>
                                <div className="flex flex-col items-start w-full justify-center">
                                    <label className="text-[16px] text-customGray font-poppins font-bold">Allergies:</label>
                                    <select
                                        className="w-full h-[46px] border-[1px] border-[#000000] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                        value={allergyChoice}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setAllergyChoice(val);
                                            if (val !== 'Yes') {
                                                setMedicalForm((prev) => ({ ...prev, allergies: '' }));
                                            }
                                        }}
                                    >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                    {allergyChoice === 'Yes' && (
                                        <input
                                            className="w-full h-[46px] mt-2 border-[1px] border-[#000000] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                            placeholder="List allergies"
                                            value={medicalForm.allergies}
                                            onChange={(e) => handleMedicalChange('allergies', e.target.value)}
                                        />
                                    )}
                                </div>
                                <Input
                                    label="Occupation"
                                    placeholder="e.g., Teacher"
                                    breakpoint={true}
                                    onChange={(val) => handleMedicalChange('occupation', val)}
                                    value={medicalForm.occupation}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                                <div className="flex flex-col gap-2">
                                    <p className="text-[16px] text-customGray font-poppins font-bold">Family History:</p>
                                    <div className="flex flex-wrap gap-3">
                                        {[
                                            { key: 'hypertension', label: 'Hypertension' },
                                            { key: 'diabetes', label: 'Diabetes' },
                                            { key: 'cancer', label: 'Cancer' },
                                            { key: 'heart_disease', label: 'Heart Disease' },
                                        ].map((item) => (
                                            <label key={item.key} className="flex items-center gap-2 text-sm text-customGray">
                                                <input
                                                    type="checkbox"
                                                    checked={(medicalForm as any).family_history?.[item.key]}
                                                    onChange={(e) => handleFamilyHistoryChange(item.key, e.target.checked)}
                                                />
                                                {item.label}
                                            </label>
                                        ))}
                                        <label className="flex items-center gap-2 text-sm text-customGray">
                                            <input
                                                type="checkbox"
                                                checked={(medicalForm as any).family_history?.unknown}
                                                onChange={(e) => handleFamilyHistoryChange('unknown', e.target.checked)}
                                            />
                                            Unknown
                                        </label>
                                    </div>
                                    {medicalForm.family_history?.cancer && (
                                        <div className="mt-2">
                                            <label className="text-[16px] text-customGray font-poppins font-bold">Cancer Type:</label>
                                            <select
                                                className="w-full h-[46px] border-[1px] border-[#000000] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                                value={medicalForm.cancer_type}
                                                onChange={(e) => handleMedicalChange('cancer_type', e.target.value)}
                                            >
                                                <option value="">Select cancer type</option>
                                                {['Carcinoma', 'Sarcoma', 'Leukemia', 'Lymphoma', 'Myeloma', 'Melanoma', 'CNS tumors'].map((c) => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <p className="text-[16px] text-customGray font-poppins font-bold">Lifestyle:</p>
                                    {[
                                        { key: 'tobacco_use', label: 'Tobacco use' },
                                        { key: 'alcohol_use', label: 'Alcohol use' },
                                        { key: 'drug_use', label: 'Drug use' },
                                    ].map((item) => (
                                        <label key={item.key} className="flex items-center gap-2 text-sm text-customGray">
                                            <input
                                                type="checkbox"
                                                checked={(medicalForm as any)[item.key]}
                                                onChange={(e) => handleBooleanFieldChange(item.key, e.target.checked)}
                                            />
                                            {item.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>


                        <div className="w-full md:flex justify-between items-center space-y-6 col-span-full mb-5">
                            <div className="space-y-2 md:w-2/3 ">
                                <div className="flex space-x-2 items-center">
                                    <input checked={email_opt} onChange={(e) => setEmail_opt(e.target.checked)} type="checkbox" /> <h1 className="text-xs">
                                        {t("email_consent")}
                                    </h1>
                                </div>
                                <div className="flex space-x-2 items-center">
                                    <input checked={text_opt} onChange={(e) => setText_opt(e.target.checked)} type="checkbox" /> <h1 className="text-xs">
                                        {t("sms_consent")}
                                    </h1>
                                </div>

                            </div>
                            <Button
                                text={t("button_label")}

                                size={{ width: "250px", height: "50px" }}
                                route={""}
                                bgColor={"#C1001F"}
                                textColor={"#ffffff"}
                                onClick={() => {
                                    submitAppointmentDetails();
                                }}
                            />
                        </div>

                    </section>



                </div>
            </div>

        </div></>
    );
};


export default Self_Appointment