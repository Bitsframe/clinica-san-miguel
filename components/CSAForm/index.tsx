
"use client";
import "@/styles/custom-checkbox.css";

import { styles } from "@/app/[locale]/styles";
import { supabase } from "@/supabaseClient";
import { useEffect } from "react";
import { Button } from "@/utils";
import { Modal } from "flowbite-react";
import { useLocale, useTranslations } from "next-intl";
import { useCSAFormLogic } from "./logic";
import TranscriptDisplay from "../TranscriptDisplay";
import { useState, useRef } from "react";
import moment from "moment";

import ReactDatePicker from "react-datepicker";
import ScheduleDateTime from "../Modal/ScheduleDateTime";
import { toast } from "react-toastify";
import VoiceIntake from "../VoiceIntake";
import VoiceWave from "@/components/VoiceWave";
import { useVapiInstance } from "@/hooks/useVapiInstance";
import { useVapiSpeaking } from "@/hooks/useVapiSpeaking";
import { useVapiUserSpeaking } from "@/hooks/useVapiUserSpeaking";
import LanguageChanger from "@/components/LanguageChanger";
import { validateFormData } from "@/utils/validationCheck";
import PhoneInput from "react-phone-input-2";
import PhoneNumberInput from "./PhoneNumberInput";
import { EmailBodyTempEnum } from "@/utils/emailService/templateDetails";
import { sendEmail } from "@/utils/emailService";
import { submitAppointmentFlow } from "@/lib/submitAppointment";
import { generateConsentPDF } from "@/lib/generateConsentPDF";
import SignatureCanvas from "react-signature-canvas";

const RadioButton = ({ value, name, label, checked, onChange }: any) => (
    <div className="flex items-center justify-start gap-3">
        <input
            type="radio"
            value={value}
            name={name}
            checked={checked}
            onChange={onChange}
            className="custom-radio-orange"
            autoComplete="on"
            autoCorrect="on"
            spellCheck={true}
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
            {label}
        </label>
        <input
            type={type}
            placeholder={`${placeholder}`}
            className="w-full h-[46px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoComplete="on"
            autoCorrect="on"
            spellCheck={true}
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
            dateFormat="MM/dd/yyyy"
            maxDate={new Date()}
            isClearable={false}
            calendarClassName="fixed-calendar-height"
            className="w-full h-[46px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
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
                            className="w-full h-[46px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {startingSelectedOption && <option value='' disabled>
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

// Tag input for allergies and other fields
type AllergyTagInputProps = {
    allergies: string[];
    setAllergies: (allergies: string[]) => void;
    placeholder?: string;
};

function AllergyTagInput({ allergies, setAllergies, placeholder = "List allergies" }: AllergyTagInputProps) {
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    const addTag = (tag: string) => {
        const trimmed = tag.trim().replace(/,$/, "");
        if (trimmed && !allergies.includes(trimmed)) {
            setAllergies([...allergies, trimmed]);
        }
    };

    const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (["Enter", ",", " "].includes(e.key)) {
            e.preventDefault();
            if (input.trim() !== "") {
                addTag(input);
                setInput("");
            }
        } else if (e.key === "Backspace" && input === "" && allergies.length > 0) {
            setAllergies(allergies.slice(0, -1));
        }
    };

    const removeTag = (idx: number) => {
        setAllergies(allergies.filter((_, i: number) => i !== idx));
    };

    return (
        <div className="w-full min-h-[46px] border-[1px] border-[#E0E0E0] rounded-[10px] flex flex-wrap items-center px-2 py-1 bg-transparent mt-2">
            {allergies.map((tag, idx) => (
                <span key={tag + idx} className="flex items-center m-1 px-2 py-1 bg-[#C1001F] text-white rounded-full text-xs font-semibold">
                    {tag}
                    <button type="button" className="ml-1 text-white hover:text-black" onClick={() => removeTag(idx)} aria-label="Remove allergy tag">×</button>
                </span>
            ))}
            <input
                ref={inputRef}
                className="flex-1 min-w-[100px] h-[32px] border-none outline-none bg-transparent text-[16px] px-2"
                placeholder={allergies.length === 0 ? placeholder : "Add more..."}
                value={input}
                onChange={onInput}
                onKeyDown={onKeyDown}
                autoComplete="on"
                autoCorrect="on"
                spellCheck={true}
            />
        </div>
    );
}

import { forwardRef } from "react";

const Self_Appointment = forwardRef(({ location }: any, ref) => {
    const logic = useCSAFormLogic({ location, ref });
    const { inOfficePatient, setInOfficePatient, newPatient, setNewPatient } = logic;
    // Signature canvas ref and state
    const sigCanvasRef = useRef<SignatureCanvas>(null);
    const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw');
    const [typedSignature, setTypedSignature] = useState('');
    const [selectedFont, setSelectedFont] = useState<'font1' | 'font2'>('font1');
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);
    const [savedSignatureDataUrl, setSavedSignatureDataUrl] = useState<string | null>(null);
    const [savedSignatureMode, setSavedSignatureMode] = useState<'draw' | 'type' | null>(null);
    // Track if PDF preview has been clicked
    const [pdfPreviewed, setPdfPreviewed] = useState(false);
    // Store last generated consent PDF data URL for upload
    const [consentPdfDataUrl, setConsentPdfDataUrl] = useState<string | null>(null);
    // Track booked time slots for selected date
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    // Consent checkboxes state
    const [consentTelemedicine, setConsentTelemedicine] = useState(false);
    const [consentHIPAA, setConsentHIPAA] = useState(false);
    const [consentGeneral, setConsentGeneral] = useState(false);
    // Vapi instance and speaking state for waveform
        const vapi = useVapiInstance();
    const isSpeaking = useVapiSpeaking(vapi);
    // Use custom hook for user speaking state
    const isUserSpeaking = useVapiUserSpeaking(vapi);
    // Handler to be called from VoiceIntake when user is speaking (no-op, kept for prop compatibility)
    const handleUserSpeaking = () => {};
    // Expose autofill to window for VoiceIntake (after logic is defined)
    if (typeof window !== 'undefined') {
        (window as any).__autofillCSA = logic.autofillFromNormalized;
    }

    // Reset signature-related UI state after submit
    const resetSignatureState = () => {
        sigCanvasRef.current?.clear();
        setSignatureMode('draw');
        setTypedSignature('');
        setSelectedFont('font1');
        setIsSignatureModalOpen(false);
        setHasSignature(false);
        setSavedSignatureDataUrl(null);
        setSavedSignatureMode(null);
        setPdfPreviewed(false);
        setConsentPdfDataUrl(null);
        setConsentTelemedicine(false);
        setConsentHIPAA(false);
        setConsentGeneral(false);
    };

    // Build a signature data URL from the current input; prefers saved copy if available
    const buildSignatureDataUrl = () => {
        if (savedSignatureDataUrl && savedSignatureMode === signatureMode) return savedSignatureDataUrl;

        if (signatureMode === 'draw') {
            return sigCanvasRef.current?.toDataURL() || null;
        }

        if (signatureMode === 'type' && typedSignature) {
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 100;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'black';
                ctx.font = selectedFont === 'font1'
                    ? '48px "Brush Script MT", cursive'
                    : 'italic 48px "Dancing Script", cursive';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(typedSignature, canvas.width / 2, canvas.height / 2);
                return canvas.toDataURL();
            }
        }

        return null;
    };
    // Destructure all state and handlers from logic
        type ScheduleDateTime = { date: string; time: string };
        const {
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
            onTranscript
        } = logic as any; // If logic is not typed, use 'as any' to avoid TS errors

    // Fetch booked slots when date changes
    useEffect(() => {
        const fetchBookedSlots = async () => {
            const selectedDate = typeof date_and_time === 'object' && date_and_time?.date ? (date_and_time as any).date : '';
            if (!selectedDate || !location?.id) {
                setBookedSlots([]);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('Appoinments')
                    .select('date_and_time')
                    .like('date_and_time', `${location.id}|${selectedDate}%`) as any;

                if (error) {
                    console.error('Error fetching booked slots:', error);
                    return;
                }

                const slots = data?.map((apt: any) => {
                    const parts = apt.date_and_time.split('|')[1];
                    const timePart = parts?.split(' ').slice(1).join(' ');
                    return timePart;
                }).filter(Boolean) || [];

                setBookedSlots(slots);
            } catch (err) {
                console.error('Error fetching booked slots:', err);
            }
        };

        fetchBookedSlots();
    }, [date_and_time, location?.id]);

        Self_Appointment.displayName = "Self_Appointment";
    // Debug: log transcript and user speaking state
    return (<>
        <div className="relative w-screen min-h-screen flex justify-start items-start" style={{ backgroundColor: '#EAEAEA', paddingLeft: '40px' }}>
            <div className="md:absolute px-5 md:px-0 pt-4 pb-5 md:py-0 w-full flex justify-end md:top-6 md:right-6">
                <LanguageChanger locale={locale} />
            </div>
            <div className="flex flex-row justify-start h-full items-start px-5 md:px-0 gap-8">
                {/* Sidebar transcript area */}
                {/*
                <div className="hidden md:flex flex-col w-[350px] min-h-[500px] max-h-[700px] bg-white rounded-lg mt-8 mr-2 p-4">
                    <div className="w-full bg-blue-600 text-white rounded-lg p-3 text-lg shadow mb-2">
                        <TranscriptDisplay currentTranscript={currentTranscript} />
                    </div>
                </div>
                */}
                </div>
                
                {/* Main form content */}
                <div
  className="w-full xl:max-w-[1400px] lg:max-w-[1200px] md:max-w-[1000px] mx-auto rounded-[20px] mt-4 p-4"
                    style={{ backgroundColor:  '#f1efefff'  }}>
                    <div className="flex flex-col w-full justify-center border-b-[1px] border-black px-4 pb-2 text-center mb-4" style={{ backgroundColor: '#EAEAEA', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                        <div className="flex w-full items-center justify-center gap-3">
                            <h1
                                className={`${styles.sectionHeadText} `}
                                style={{ textAlign: "center", color: "#DC143C" }}
                            >
                                {t("self_form_title")}
                            </h1>
                            {/* <button
                                type="button"
                                onClick={fillTestData}
                                className="rounded-md border border-black px-3 py-2 text-sm font-semibold text-black hover:bg-black hover:text-white transition"
                            >
                                Fill test data
                            </button> */}
                        </div>
                        <p className="text-[#767676]">{location.title}</p>
                    </div>

<section className="flex justify-center items-center w-full px-4 mb-8"> 

<section className="grid md:grid-cols-2 grid-cols-1 gap-8 mx-auto"
     style={{
       backgroundColor: '#fefefeff',
       borderRadius: '10px',
       padding: '24px',
             maxWidth: '1200px'   // ← controls form width
     }}
>

                        {/* Patient Information Section */}
                            <div className="col-span-full">
                            <h2 className="text-[26px] font-bold text-gray-900 border-b-2 border-[#E0E0E0] pb-2 mb-6">{t('patient_information_title')}</h2>
                        </div>

                        <Dropdown
                            label={t("form_f10")}
                            options={services}
                            breakpoint={true}
                            onChange={setService}
                            value={service}
                            startingSelectedOption={true}
                        />
                                            {/* Removed misplaced input and invalid onChange/value lines */}
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
                        {/* Email Address Field */}
                        <div className="flex flex-col items-start w-full justify-center">
                            <label className="text-[16px] text-customGray font-poppins font-bold mb-2">{t('email_label')}</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder={t('email_placeholder')}
                                className="w-full h-[46px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                autoComplete="on"
                                autoCorrect="on"
                                spellCheck={true}
                            />
                            {/* Email validation error */}
                            {email && !/^([a-zA-Z0-9_\-.+]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,})$/.test(email) && (
                                <span className="text-red-600 text-xs mt-1">{t('email_error')}</span>
                            )}
                        </div>
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
                        <div className="flex flex-col items-start w-full justify-center">
                            <label className="text-[16px] text-customGray font-poppins font-bold mb-2">{t('form_f7')}</label>
                            <input
                                type="date"
                                value={dob ? dob.toISOString().split('T')[0] : ''}
                                onChange={e => setDob(e.target.value ? new Date(e.target.value) : null)}
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full h-[46px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                            />
                        </div>
                        <div className="flex flex-col items-start w-full justify-center">
                            <label className="text-[16px] text-customGray font-poppins font-bold mb-2">{t('age_label')}</label>
                            <input
                                type="text"
                                value={dob ? moment().diff(moment(dob), 'years') : ''}
                                readOnly
                                placeholder={t('age_placeholder')}
                                className="w-full h-[46px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-gray-100 outline-none rounded-[10px] cursor-not-allowed"
                            />
                        </div>
                        {/* Schedule Date and Time Picker */}
                        {/* TypeScript: define type for date_and_time */}
                        {/* Place this type at the top of the file or in the component scope */}
                        {/* type ScheduleDateTime = { date: string; time: string; } */}
                        {/* <div className="flex flex-col md:flex-row items-start w-full justify-center gap-4">
                            <div className="flex flex-col w-full md:w-1/2">
                                <label className="text-[16px] text-customGray font-poppins font-bold mb-2">Select Schedule Date:</label>
                                <input
                                    type="date"
                                    value={(date_and_time as ScheduleDateTime)?.date || ''}
                                    onChange={e => {
                                        const date = e.target.value;
                                        setDate_and_time((prev: ScheduleDateTime) => {
                                            if (prev && typeof prev === 'object' && 'date' in prev && 'time' in prev) {
                                                return { ...prev, date };
                                            }
                                            return { date, time: '' };
                                        });
                                    }}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full h-[46px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                />
                            </div>
                            <div className="flex flex-col w-full md:w-1/2">
                                <label className="text-[16px] text-customGray font-poppins font-bold mb-2">Select Schedule Time:</label>
                                <select
                                    className="w-full h-[46px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                    value={(date_and_time as ScheduleDateTime)?.time || ''}
                                    onChange={e => {
                                        const time = e.target.value;
                                        setDate_and_time((prev: ScheduleDateTime) => {
                                            if (prev && typeof prev === 'object' && 'date' in prev && 'time' in prev) {
                                                return { ...prev, time };
                                            }
                                            return { date: '', time };
                                        });
                                    }}
                                >
                                    <option value="">Select Slot</option>
                                    {['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM']
                                        .filter(slot => !bookedSlots.includes(slot))
                                        .map(slot => (
                                            <option key={slot} value={slot}>{slot}</option>
                                        ))}
                                </select>
                            </div>
                        </div> */}

                        {/* Medical intake */}
                        <div className="col-span-full space-y-4 pt-4">
                            {/* Voice Intake Mic Button below waveform */}
                            <div className="mb-4">
                                {/* <VoiceIntake setForm={setMedicalForm} onTranscript={onTranscript} vapi={vapi} onUserSpeaking={handleUserSpeaking} /> */}
                                {/* Button now commented out and only visible in right-side box */}
                            </div>
                         </div>
                                                          <div className="col-span-full mt-0">
                            <h2 className="text-[26px] font-bold text-gray-900 border-b-2 border-[#E0E0E0] pb-2 mb-6">{t('medical_info_title')}</h2>
                         </div>
                         <div className="col-span-full space-y-4 pt-0">
                            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                                {/* Move Reason for Visit, Location, Severity before Number of Pregnancies/Birth Control */}
                                <Input
                                    label={t('reason_visit_label')}
                                    placeholder={t('reason_visit_placeholder')}
                                    breakpoint={true}
                                    onChange={(val) => handleMedicalChange('chief_complaint', val)}
                                    value={medicalForm.chief_complaint}
                                />
                                <div className="flex flex-col items-start w-full justify-center">
                                    <label className="text-[16px] text-customGray font-poppins font-bold">{t('duration_label')}</label>
                                    <input
                                        type="date"
                                        value={onsetDate ? onsetDate.toISOString().split('T')[0] : ''}
                                        onChange={e => handleOnsetDateChange(e.target.value ? new Date(e.target.value) : null)}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full h-[46px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                    />
                                </div>
                                <Input
                                    label={t('symptom_location_label')}
                                    placeholder={t('symptom_location_placeholder')}
                                    breakpoint={true}
                                    onChange={(val) => handleMedicalChange('location', val)}
                                    value={medicalForm.location}
                                />
                                <div className="flex flex-col items-start w-full justify-center">
                                    <label className="text-[16px] text-customGray font-poppins font-bold">{t('severity_label')}</label>
                                    <select
                                        className="w-full h-[46px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                        value={medicalForm.severity}
                                        onChange={e => handleMedicalChange('severity', e.target.value)}
                                    >
                                        <option value="" disabled>Select</option>
                                        {[...Array(10)].map((_, i) => (
                                            <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Preventive & Reproductive History fields (conditional, no new section) */}
                                {/* Female: Number of Pregnancies, Birth Control (15-55) */}
                                {(sex === 'Female' && dob && (() => {
                                    const age = moment().diff(moment(dob), 'years');
                                    return age >= 15 && age <= 55;
                                })()) && (
                                    <>
                                        <Input
                                            label="Number of Pregnancies"
                                            placeholder="0"
                                            breakpoint={true}
                                            type="number"
                                            onChange={(val) => handleMedicalChange('num_pregnancies', val.replace(/[^0-9]/g, ''))}
                                            value={medicalForm.num_pregnancies || ''}
                                        />
                                        <div className="flex flex-col items-start w-full justify-center">
                                            <label className="text-[16px] text-customGray font-poppins font-bold mb-2">Birth Control:</label>
                                            <div className="flex flex-row gap-6 mb-2">
                                                <label className="flex items-center gap-2">
                                                    <input type="radio" name="birthControl" value="Yes" checked={medicalForm.birth_control === 'Yes'} onChange={() => handleMedicalChange('birth_control', 'Yes')} /> Yes
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input type="radio" name="birthControl" value="No" checked={medicalForm.birth_control === 'No'} onChange={() => handleMedicalChange('birth_control', 'No')} /> No
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input type="radio" name="birthControl" value="Not applicable" checked={medicalForm.birth_control === 'Not applicable'} onChange={() => handleMedicalChange('birth_control', 'Not applicable')} /> Not applicable
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {/* Female: Last Pap Smear (21+) */}
                                {(sex === 'Female' && dob && (() => {
                                    const age = moment().diff(moment(dob), 'years');
                                    return age >= 21;
                                })()) && (
                                    <div className="flex flex-col items-start w-full justify-center">
                                        <label className="text-[16px] text-customGray font-poppins font-bold mb-2">Last Pap Smear:</label>
                                        <div className="flex flex-row gap-6 mb-2">
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="papSmear" value="Never" checked={medicalForm.pap_smear === 'Never'} onChange={() => handleMedicalChange('pap_smear', 'Never')} /> Never
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="papSmear" value="Don’t remember" checked={medicalForm.pap_smear === 'Don’t remember'} onChange={() => handleMedicalChange('pap_smear', 'Don’t remember')} /> Don’t remember
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="papSmear" value="Month & Year" checked={medicalForm.pap_smear === 'Month & Year'} onChange={() => handleMedicalChange('pap_smear', 'Month & Year')} /> Month & Year
                                            </label>
                                        </div>
                                        {medicalForm.pap_smear === 'Month & Year' && (
                                            <input type="month" className="w-full h-[46px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] px-5 bg-transparent outline-none rounded-[10px]" value={medicalForm.pap_smear_date || ''} onChange={e => handleMedicalChange('pap_smear_date', e.target.value)} />
                                        )}
                                    </div>
                                )}
                                {/* Female: Mammography (Age ≥ 40) */}
                                {(sex === 'Female' && dob && (() => {
                                    const age = moment().diff(moment(dob), 'years');
                                    return age >= 40;
                                })()) && (
                                    <div className="flex flex-col items-start w-full justify-center">
                                        <label className="text-[16px] text-customGray font-poppins font-bold mb-2">Mammography:</label>
                                        <div className="flex flex-row gap-6 mb-2">
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="mammogram" value="Never" checked={medicalForm.mammogram === 'Never'} onChange={() => handleMedicalChange('mammogram', 'Never')} /> Never
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="mammogram" value="Don’t remember" checked={medicalForm.mammogram === 'Don’t remember'} onChange={() => handleMedicalChange('mammogram', 'Don’t remember')} /> Don’t remember
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="mammogram" value="Month & Year" checked={medicalForm.mammogram === 'Month & Year'} onChange={() => handleMedicalChange('mammogram', 'Month & Year')} /> Month & Year
                                            </label>
                                        </div>
                                        {medicalForm.mammogram === 'Month & Year' && (
                                            <input type="month" className="w-full h-[46px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] px-5 bg-transparent outline-none rounded-[10px]" value={medicalForm.mammogram_date || ''} onChange={e => handleMedicalChange('mammogram_date', e.target.value)} />
                                        )}
                                    </div>
                                )}
                                {/* Male: Last Prostate Exam (50+) */}
                                {(sex === 'Male' && dob && (() => {
                                    const age = moment().diff(moment(dob), 'years');
                                    return age >= 50;
                                })()) && (
                                    <div className="flex flex-col items-start w-full justify-center">
                                        <label className="text-[16px] text-customGray font-poppins font-bold mb-2">Last Prostate Exam:</label>
                                        <div className="flex flex-row gap-6 mb-2">
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="prostateExam" value="Never" checked={medicalForm.prostate_exam === 'Never'} onChange={() => handleMedicalChange('prostate_exam', 'Never')} /> Never
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="prostateExam" value="Don’t remember" checked={medicalForm.prostate_exam === 'Don’t remember'} onChange={() => handleMedicalChange('prostate_exam', 'Don’t remember')} /> Don’t remember
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="prostateExam" value="Month & Year" checked={medicalForm.prostate_exam === 'Month & Year'} onChange={() => handleMedicalChange('prostate_exam', 'Month & Year')} /> Month & Year
                                            </label>
                                        </div>
                                        {medicalForm.prostate_exam === 'Month & Year' && (
                                            <input type="month" className="w-full h-[46px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] px-5 bg-transparent outline-none rounded-[10px]" value={medicalForm.prostate_exam_date || ''} onChange={e => handleMedicalChange('prostate_exam_date', e.target.value)} />
                                        )}
                                    </div>
                                )}
         
                                <div className="flex flex-col items-start w-full justify-center md:col-span-2">
                                    <label className="text-[16px] text-customGray font-poppins font-bold">{t('symptom_details_label')}</label>
                                    <AllergyTagInput
                                        allergies={medicalForm.symptoms_description}
                                        setAllergies={(symptoms_description: string[]) => setMedicalForm((prev: typeof medicalForm) => ({ ...prev, symptoms_description }))}
                                        placeholder="e.g., cough, fever, headache"
                                    />
                                </div>
                                <div className="flex flex-col items-start w-full justify-center">
                                    <label className="text-[16px] text-customGray font-poppins font-bold">{t('relieving_factors_label')}</label>
                                    <div className="flex flex-wrap gap-3 mt-2">
                                        {[
                                            { key: 'Rest', label: t('relieving_factors_rest') },
                                            { key: 'Ice', label: t('relieving_factors_ice') },
                                            { key: 'Heat', label: t('relieving_factors_heat') },
                                            { key: 'Elevation', label: t('relieving_factors_elevation') },
                                            { key: 'Medication', label: t('relieving_factors_medication') },
                                            { key: 'Stretching', label: t('relieving_factors_stretching') },
                                            { key: 'Massage', label: t('relieving_factors_massage') },
                                            { key: 'Support or compression', label: t('relieving_factors_support') },
                                            { key: 'Time', label: t('relieving_factors_time') },
                                            { key: 'Other', label: t('relieving_factors_other') },
                                        ].map((opt) => (
                                            <label key={opt.key} className="flex items-center gap-2 text-sm text-customGray">
                                                <input
                                                    type="checkbox"
                                                    checked={reliefSelect.includes(opt.key)}
                                                    onChange={(e) => {
                                                        let updated: string[];
                                                        if (e.target.checked) {
                                                            updated = [...reliefSelect, opt.key];
                                                        } else {
                                                            updated = reliefSelect.filter((item: string) => item !== opt.key);
                                                        }
                                                        setReliefSelect(Array.isArray(updated) ? updated : []);
                                                        if (!updated.includes('Other')) {
                                                            setReliefOther("");
                                                        }
                                                        setMedicalForm((prev: typeof medicalForm) => ({
                                                            ...prev,
                                                            relieving_factors: updated
                                                                .map((item: string) => (item === 'Other' && reliefOther ? reliefOther : item))
                                                                .filter(Boolean)
                                                                .join(', '),
                                                        }));
                                                    }}
                                                    className="custom-checkbox-orange"
                                                />
                                                {opt.label}
                                            </label>
                                        ))}
                                    </div>
                                    {reliefSelect.includes('Other') && (
                                        <input
                                            className="w-full h-[46px] mt-2 border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                            placeholder="Describe other relieving factor"
                                            value={reliefOther}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setReliefOther(val);
                                                // Update medicalForm.relieving_factors with new Other value
                                                setMedicalForm((prev: typeof medicalForm) => ({
                                                    ...prev,
                                                    relieving_factors: reliefSelect
                                                        .map((item: string) => (item === 'Other' ? val : item))
                                                        .filter(Boolean)
                                                        .join(', '),
                                                }));
                                            }}
                                            autoComplete="on"
                                            autoCorrect="on"
                                            spellCheck={true}
                                        />
                                    )}
                                </div>
                                <div className="flex flex-col items-start w-full justify-center">
                                    <label className="text-[16px] text-customGray font-poppins font-bold">{t('medical_conditions_label')}</label>
                                    <AllergyTagInput
                                        allergies={medicalForm.medical_conditions}
                                        setAllergies={(medical_conditions: string[]) => setMedicalForm((prev: typeof medicalForm) => ({ ...prev, medical_conditions }))}
                                        placeholder={t('medical_conditions_placeholder')}
                                    />
                                </div>
                                <Input
                                    label={t('current_medications_label')}
                                    placeholder={t('current_medications_placeholder')}
                                    breakpoint={true}
                                    onChange={(val) => handleMedicalChange('current_medications', val)}
                                    value={medicalForm.current_medications}
                                />
                            </div>

                            {/* Medical History Section */}
                             <div className="col-span-full pt-10">
                                <h2 className="text-[26px] font-bold text-gray-900 border-b-2 border-[#E0E0E0] pb-2 mb-8">{t('medical_history_title')}</h2>
                            </div>

                            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                                <div className="flex flex-col items-start w-full justify-center">
                                    <label className="text-[16px] text-customGray font-poppins font-bold">{t('surgeries_label')}</label>
                                    <div className="flex flex-row gap-6 mb-2">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="surgeryChoice"
                                                value="Yes"
                                                checked={surgeryChoice === 'Yes'}
                                                onChange={() => setSurgeryChoice('Yes')}
                                                className="custom-radio-orange"
                                            />
                                            {t('surgeries_yes')}
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="surgeryChoice"
                                                value="No"
                                                checked={surgeryChoice === 'No'}
                                                onChange={() => {
                                                    setSurgeryChoice('No');
                                                    setMedicalForm((prev: typeof medicalForm) => ({ ...prev, surgeries: '' }));
                                                }}
                                                className="custom-radio-orange"
                                            />
                                            {t('surgeries_no')}
                                        </label>
                                    </div>
                                    {surgeryChoice === 'Yes' && (
                                        <AllergyTagInput
                                            allergies={Array.isArray(medicalForm.surgeries) ? medicalForm.surgeries : (medicalForm.surgeries ? [medicalForm.surgeries] : [])}
                                            setAllergies={(surgeries) => handleMedicalChange('surgeries', surgeries)}
                                            placeholder="Type of surgery"
                                        />
                                    )}
                                </div>
                                <div className="flex flex-col items-start w-full justify-center">
                                    <label className="text-[16px] text-customGray font-poppins font-bold mb-2">{t('allergies_label')}</label>
                                    <div className="flex flex-row gap-6 mb-2">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="allergyChoice"
                                                value="Yes"
                                                checked={allergyChoice === 'Yes'}
                                                onChange={() => setAllergyChoice('Yes')}
                                                className="custom-radio-orange"
                                            />
                                            {t('allergies_yes')}
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="allergyChoice"
                                                value="No"
                                                checked={allergyChoice === 'No'}
                                                onChange={() => {
                                                    setAllergyChoice('No');
                                                    setMedicalForm((prev: typeof medicalForm) => ({ ...prev, allergies: [] }));
                                                }}
                                                className="custom-radio-orange"
                                            />
                                            {t('allergies_no')}
                                        </label>
                                    </div>
                                    {allergyChoice === 'Yes' && (
                                        <AllergyTagInput
                                            allergies={medicalForm.allergies}
                                            setAllergies={(allergies: string[]) => setMedicalForm((prev: typeof medicalForm) => ({ ...prev, allergies }))}
                                        />
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-[16px] text-customGray font-poppins font-bold">{t('family_history_label')}</p>
                                    <div className="flex flex-wrap gap-3">
                                        {[
                                            { key: 'hypertension', label: t('family_history_hypertension') },
                                            { key: 'diabetes', label: t('family_history_diabetes') },
                                            { key: 'cancer', label: t('family_history_cancer') },
                                            { key: 'heart_disease', label: t('family_history_heart_disease') },
                                        ].map((item) => (
                                            <label key={item.key} className="flex items-center gap-2 text-sm text-customGray">
                                                <input
                                                    type="checkbox"
                                                    checked={(medicalForm as any).family_history?.[item.key]}
                                                    onChange={(e) => handleFamilyHistoryChange(item.key, e.target.checked)}
                                                    className="custom-checkbox-orange"
                                                />
                                                {item.label}
                                            </label>
                                        ))}
                                        <label className="flex items-center gap-2 text-sm text-customGray">
                                            <input
                                                type="checkbox"
                                                checked={(medicalForm as any).family_history?.unknown}
                                                onChange={(e) => handleFamilyHistoryChange('unknown', e.target.checked)}
                                                className="custom-checkbox-orange"
                                            />
                                            {t('family_history_unknown')}
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
                            </div>
                        </div>

                        {/* Social History Section */}
                         <div className="col-span-full mt-8">
                            <h2 className="text-[26px] font-bold text-gray-900 border-b-2 border-[#E0E0E0] pb-2 mb-6">{t('social_history_title')}</h2>
                        </div>

                        <div className="col-span-full">
                            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                                <Input
                                    label={t('occupation_label')}
                                    placeholder={t('occupation_placeholder')}
                                    breakpoint={true}
                                    onChange={(val) => handleMedicalChange('occupation', val)}
                                    value={medicalForm.occupation}
                                />
                                <div className="flex flex-col gap-2">
                                    <p className="text-[16px] text-customGray font-poppins font-bold">{t('lifestyle_label')}</p>
                                    <div className="flex flex-row gap-6">
                                        {[
                                            { key: 'tobacco_use', label: t('lifestyle_tobacco') },
                                            { key: 'alcohol_use', label: t('lifestyle_alcohol') },
                                            { key: 'drug_use', label: t('lifestyle_drug') },
                                        ].map((item) => (
                                            <label key={item.key} className="flex items-center gap-2 text-sm text-customGray">
                                                <input
                                                    type="checkbox"
                                                    checked={(medicalForm as any)[item.key]}
                                                    onChange={(e) => handleBooleanFieldChange(item.key, e.target.checked)}
                                                    className="custom-checkbox-orange"
                                                />
                                                {item.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:flex justify-between items-center space-y-6 col-span-full mb-5">
                            <div className="space-y-2 md:w-2/3 ">
                                <div className="flex space-x-2 items-center">
                                    <input checked={email_opt} onChange={(e) => setEmail_opt(e.target.checked)} type="checkbox" className="custom-checkbox-orange" autoComplete="on" autoCorrect="on" spellCheck={true} /> <h1 className="text-xs">
                                        {t("email_consent")}
                                    </h1>
                                </div>
                                <div className="flex space-x-2 items-center">
                                    <input checked={text_opt} onChange={(e) => setText_opt(e.target.checked)} type="checkbox" className="custom-checkbox-orange" autoComplete="on" autoCorrect="on" spellCheck={true} /> <h1 className="text-xs">
                                        {t("sms_consent")}
                                    </h1>
                                </div>

                            </div>
                        </div>

                        {/* Digital Signature Section */}
                                 <div className="w-full col-span-full mt-8">
                            <h2 className="text-[26px] font-bold text-gray-900 border-b-2 border-[#E0E0E0] pb-2 mb-6">{t('digital_signature_title')}</h2>
                            <p className="text-gray-600 mb-4">
                                {t('digital_signature_description')}
                            </p>
                            <button
                                onClick={() => setIsSignatureModalOpen(true)}
                                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                                type="button"
                            >
                                {t('digital_signature_button')}
                            </button>
                            {hasSignature && (
                                <div className="flex items-center gap-2 mt-3 text-green-600">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">{t('digital_signature_saved')}</span>
                                </div>
                            )}
                        </div>

                        {/* Digital Sign Following Documents Section */}
                        <div className="w-full col-span-full mt-8">
                            <h2 className="text-[26px] font-bold text-gray-900 border-b-2 border-[#E0E0E0] pb-2 mb-6">{t('digital_sign_docs')}</h2>
                            <div className="space-y-4">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={consentTelemedicine}
                                        onChange={(e) => setConsentTelemedicine(e.target.checked)}
                                        className="custom-checkbox-orange mt-1"
                                    />
                                    <span className="text-[16px] text-customGray font-poppins">
                                        {t('consent_telemedicine')}
                                    </span>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={consentHIPAA}
                                        onChange={(e) => setConsentHIPAA(e.target.checked)}
                                        className="custom-checkbox-orange mt-1"
                                    />
                                    <span className="text-[16px] text-customGray font-poppins">
                                        {t('consent_hipaa')}
                                    </span>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={consentGeneral}
                                        onChange={(e) => setConsentGeneral(e.target.checked)}
                                        className="custom-checkbox-orange mt-1"
                                    />
                                    <span className="text-[16px] text-customGray font-poppins">
                                        {t('consent_general')}
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="w-full md:flex justify-end items-center gap-3 col-span-full mb-5">
                            {/* <div className="w-full mb-3">
                                <p className="text-red-600 font-semibold text-sm">⚠️ Please review the telemedicine consent form before submitting</p>
                            </div> */}
                            <div className="flex gap-3 flex-col md:flex-row w-full md:w-auto justify-end">
                                 <Button
                                    text="Preview PDFs"
                                    size={{ width: "250px", height: "50px" }}
                                    route={""}
                                    bgColor={"#6B7280"}
                                    textColor={"#ffffff"}
                                    onClick={() => {
                                        setPdfPreviewed(true);
                                        const signatureData = buildSignatureDataUrl();
                                        
                                        try {
                                                // Generate combined PDF with all three forms (telemedicine page 1, HIPAA page 2, General/Surgery page 3)
                                            const combinedPdfUrl = generateConsentPDF({
                                                firstName,
                                                lastName,
                                                dob,
                                                signature: signatureData
                                            }, {
                                                formType: 'combined',
                                                preview: false,
                                                onReady: (dataUrl) => setConsentPdfDataUrl(dataUrl)
                                            });

                                            console.log('Combined PDF URL:', combinedPdfUrl);

                                            // Open the combined PDF in a new tab
                                            const pdfWindow = window.open(combinedPdfUrl, '_blank');

                                            if (!pdfWindow) {
                                                alert('Please allow popups for this site to preview the PDF');
                                            }
                                        } catch (error) {
                                            console.error('Error generating PDF:', error);
                                            alert('Error generating PDF. Please try again.');
                                        }
                                    }}
                                /> 
                                <Button
                                    text={t("button_label")}
                                    size={{ width: "250px", height: "50px" }}
                                    route={""}
                                    bgColor={"#C81E3A"}
                                    textColor={"#ffffff"}
                                    onClick={async () => {
                                        // Require preview before submit
                                        if (!pdfPreviewed) {
                                            toast.warning('Please preview your signed docs before submitting');
                                            return;
                                        }

                                        // Validate all consents are checked
                                        if (!consentTelemedicine || !consentHIPAA || !consentGeneral) {
                                            toast.warning('Please agree to all consent documents before submitting');
                                            return;
                                        }

                                        const signatureData = buildSignatureDataUrl();

                                        // Helper to get data URL for a given form type
                                        const generateDataUrl = (formType: 'telemedicine' | 'hipaa' | 'general') =>
                                            new Promise<string>((resolve) => {
                                                generateConsentPDF({
                                                    firstName,
                                                    lastName,
                                                    dob,
                                                    signature: signatureData
                                                }, {
                                                    formType,
                                                    preview: false,
                                                    onReady: (dataUrl) => resolve(dataUrl)
                                                });
                                            });

                                        try {
                                            const [telemedicineDataUrl, hipaaDataUrl, generalDataUrl] = await Promise.all([
                                                generateDataUrl('telemedicine'),
                                                generateDataUrl('hipaa'),
                                                generateDataUrl('general'),
                                            ]);

                                            // Keep telemedicine in state for any downstream needs
                                            setConsentPdfDataUrl(telemedicineDataUrl);

                                            await submitAppointmentDetails({
                                                telemedicine: telemedicineDataUrl,
                                                hipaa: hipaaDataUrl,
                                                general: generalDataUrl,
                                            });

                                            resetSignatureState();
                                        } catch (error) {
                                            console.error('Error generating PDFs for submission:', error);
                                            toast.error('Could not generate consent PDFs for submission');
                                        }
                                    }}
                                />
                            </div>
                        </div> 

                    </section>

                <section
                    className="w-full flex justify-center px-4 md:px-0"
                    style={{ position: 'sticky', top: 0, alignSelf: 'flex-start', zIndex: 10 }}
                >



<section
  className="
    w-full
    max-w-[420px]
    bg-[#FFFFFF]
    rounded-lg
    flex
    flex-col
    gap-6
    px-4
    py-6
    h-fit
    box-border
  "
>

  <div className="w-full rounded-md bg-[#EAEAEA]">
    <div className="w-full rounded-md flex flex-col items-center justify-center p-4 bg-[#F8F9FA]">
      <div className="flex items-center mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="50"
          viewBox="0 0 24 24"
          fill="#49505A"
          className="mr-2"
        >
          <path d="M12 17a4 4 0 0 0 4-4v-5a4 4 0 0 0-8 0v5a4 4 0 0 0 4 4zm5-4v-1h2v1a7 7 0 0 1-14 0v-1h2v1a5 5 0 0 0 10 0zm-5 6h2v2h-2v-2z" />
        </svg>
        <span className="text-2xl font-semibold text-[#49505A]">
          {t('voice_intake_title')}
        </span>
      </div>

      <hr className="w-full border-t border-[#E5E7EB] mb-4" />

      <p className="text-center text-lg text-[#49505A] mb-4">
        {t('voice_intake_description')}
      </p>

      <div className="flex flex-col items-center w-full gap-2">
        <VoiceIntake
          setForm={setMedicalForm}
          onTranscript={onTranscript}
          vapi={vapi}
          onUserSpeaking={handleUserSpeaking}
        />

        <VoiceWave isActive={isSpeaking || isUserSpeaking} color="#000" />

        <p className="text-sm text-gray-500">
          {isUserSpeaking
            ? "User speaking…"
            : isSpeaking
            ? "Assistant speaking…"
            : t('voice_intake_ready')}
        </p>
      </div>
    </div>
  </div>

  <div className="w-full rounded-md bg-[#EAEAEA] p-4">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path
            d="M8 20c0-6.627 6.268-12 14-12s14 5.373 14 12-6.268 12-14 12c-1.13 0-2.23-.09-3.29-.26-.41-.07-.82.04-1.13.29l-4.13 3.32c-.66.53-1.61.01-1.54-.81l.32-3.7c.03-.34-.11-.67-.37-.89C9.13 26.13 8 23.18 8 20z"
            fill="#374151"
          />
          <circle cx="20" cy="20" r="2" fill="#fff" />
          <circle cx="26" cy="20" r="2" fill="#fff" />
          <circle cx="14" cy="20" r="2" fill="#fff" />
        </svg>

        <span className="text-xl font-semibold text-[#374151]">
          {t('conversation_transcript')}
        </span>
      </div>

      <button className="flex items-center gap-1 border border-[#CBD5E1] rounded-lg px-3 py-1 text-[#374151] text-sm font-medium hover:bg-[#F1F5F9] transition">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18" stroke="#374151" strokeWidth="2" />
          <path
            d="M8 6v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"
            stroke="#374151"
            strokeWidth="2"
          />
          <rect
            x="5"
            y="6"
            width="14"
            height="14"
            rx="2"
            stroke="#374151"
            strokeWidth="2"
          />
        </svg>
        {t('transcript_clear')}
      </button>
    </div>

    <div className="bg-white rounded-lg p-3 shadow max-h-[300px] overflow-y-auto">
      <TranscriptDisplay currentTranscript={currentTranscript} />
    </div>
  </div>

  <div className="w-full rounded-md bg-[#EAEAEA] p-4 mt-6">
    <div className="bg-[#F8F9FA] rounded-lg p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#CBD5E1" />
          <path d="M12 16v-4" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="8" r="1" fill="#374151" />
        </svg>
        <span className="text-lg font-semibold text-[#374151]">
          {t('how_voice_intake_works')}
        </span>
      </div>
      <ul className="list-disc pl-5 text-gray-700 space-y-1">
        <li>{t('voice_intake_step1')}</li>
        <li>{t('voice_intake_step2')}</li>
        <li>{t('voice_intake_step3')}</li>
        <li>{t('voice_intake_step4')}</li>
        <li>{t('voice_intake_step5')}</li>
      </ul>
    </div>
  </div>

</section>




  
</section>


             </section> 
        </div>
    </div>

    {/* Signature Modal */}
    <Modal 
        show={isSignatureModalOpen} 
        onClose={() => setIsSignatureModalOpen(false)} 
        size="xl"
        position="center"
        theme={{
            content: {
                base: "relative h-full w-full p-4 md:h-auto",
                inner: "relative rounded-lg bg-white shadow flex flex-col max-h-[90vh]"
            },
            root: {
                base: "fixed top-0 right-0 left-0 z-50 h-modal h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
                show: {
                    on: "flex bg-blue-300 bg-opacity-30 backdrop-blur-sm",
                    off: "hidden"
                }
            }
        }}
    >
        <Modal.Header>Add Your Signature</Modal.Header>
        <Modal.Body>
            <div className="space-y-6">
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => {
                            setSignatureMode('draw');
                            setSavedSignatureDataUrl(null);
                            setSavedSignatureMode(null);
                            setHasSignature(false);
                            setConsentPdfDataUrl(null);
                            setPdfPreviewed(false);
                        }}
                        className={`px-6 py-2 rounded-t-lg font-semibold transition-colors ${
                            signatureMode === 'draw'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        type="button"
                    >
                        Draw
                    </button>
                    <button
                        onClick={() => {
                            setSignatureMode('type');
                            setSavedSignatureDataUrl(null);
                            setSavedSignatureMode(null);
                            setHasSignature(false);
                            setConsentPdfDataUrl(null);
                            setPdfPreviewed(false);
                        }}
                        className={`px-6 py-2 rounded-t-lg font-semibold transition-colors ${
                            signatureMode === 'type'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        type="button"
                    >
                        Type
                    </button>
                </div>

                {signatureMode === 'draw' && (
                    <>
                        <p className="text-gray-600 mb-4">Draw your signature below</p>
                        <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                            <SignatureCanvas
                                ref={sigCanvasRef}
                                canvasProps={{
                                    className: "w-full h-44",
                                    style: { touchAction: 'none' }
                                }}
                                backgroundColor="white"
                            />
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => sigCanvasRef.current?.clear()}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                type="button"
                            >
                                Clear
                            </button>
                        </div>
                    </>
                )}

                {signatureMode === 'type' && (
                    <>
                        <p className="text-gray-600 mb-4">Type your signature and select a font</p>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={typedSignature}
                                onChange={(e) => setTypedSignature(e.target.value)}
                                placeholder="Enter your signature"
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-red-600"
                            />
                            
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Select Font:</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setSelectedFont('font1')}
                                        className={`p-4 border-2 rounded-lg transition-all ${
                                            selectedFont === 'font1'
                                                ? 'border-red-600 bg-red-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                        type="button"
                                    >
                                        <span style={{ fontFamily: 'Brush Script MT, cursive', fontSize: '24px' }}>
                                            {typedSignature || 'Sample'}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedFont('font2')}
                                        className={`p-4 border-2 rounded-lg transition-all ${
                                            selectedFont === 'font2'
                                                ? 'border-red-600 bg-red-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                        type="button"
                                    >
                                        <span style={{ fontFamily: 'Dancing Script, cursive', fontSize: '24px', fontStyle: 'italic' }}>
                                            {typedSignature || 'Sample'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {typedSignature && (
                                <div className="border-2 border-gray-300 rounded-lg p-6 bg-white">
                                    <p className="text-xs text-gray-500 mb-2">Preview:</p>
                                    <div className="text-center">
                                        <span style={{
                                            fontFamily: selectedFont === 'font1' ? 'Brush Script MT, cursive' : 'Dancing Script, cursive',
                                            fontSize: '32px',
                                            fontStyle: selectedFont === 'font2' ? 'italic' : 'normal'
                                        }}>
                                            {typedSignature}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Modal.Body>
        <Modal.Footer>
            <div className="flex gap-3 w-full justify-end">
                <button
                    onClick={() => setIsSignatureModalOpen(false)}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    type="button"
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        const hasDrawnSignature = signatureMode === 'draw' && !sigCanvasRef.current?.isEmpty();
                        const hasTypedSignature = signatureMode === 'type' && typedSignature.trim() !== '';
                        
                        if (hasDrawnSignature || hasTypedSignature) {
                            const signatureDataUrl = buildSignatureDataUrl();

                            if (signatureDataUrl) {
                                setSavedSignatureDataUrl(signatureDataUrl);
                                setSavedSignatureMode(signatureMode);
                                setHasSignature(true);
                                setConsentPdfDataUrl(null); // force regeneration so latest signature is used
                                setPdfPreviewed(false);
                                setIsSignatureModalOpen(false);
                            } else {
                                toast.error('Could not capture signature. Please try again.');
                            }
                        } else {
                            toast.error('Please add a signature before saving');
                        }
                    }}
                    className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                    type="button"
                >
                    Save Signature
                </button>
            </div>
        </Modal.Footer>
    </Modal>
</>);
},);


export default Self_Appointment