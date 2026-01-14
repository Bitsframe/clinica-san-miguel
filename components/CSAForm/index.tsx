"use client";
import "@/styles/custom-checkbox.css";

import { styles } from "@/app/[locale]/styles";
import { supabase } from "@/supabaseClient";
import { useEffect, useState, useRef, RefObject, forwardRef } from "react";
import { Button } from "@/utils";
import { Modal } from "flowbite-react";
import { useLocale, useTranslations } from "next-intl";
import { useCSAFormLogic } from "./logic";
import TranscriptDisplay from "../TranscriptDisplay";
import moment from "moment";

import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import { usStates } from "@/utils/us-states";

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
    className = ""
}: {
    label: string;
    placeholder: string;
    breakpoint: boolean;
    value: string;
    type?: string;
    onChange: (value: string) => void;
    className?: string;
}) => (
    <div
        className={`flex flex-col items-start w-full justify-center`}
    >
        <label className="text-[16px] text-customGray font-poppins font-bold">
            {label}
        </label>
        <input
            type={type}
            placeholder={`${placeholder}`}
            className={`w-full h-[52px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px] ${className}`}
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

        <ReactDatePicker
            selected={value}
            onChange={(date: Date | null) => onChange(date)}
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
        <div className="w-full min-h-[46px] border-[1px] border-[#E0E0E0] rounded-[10px] flex flex-wrap items-center px-2 py-1 bg-transparent mt-2" style={{ minWidth: '340px', maxWidth: '100%' }}>
            {allergies.map((tag, idx) => (
                <span key={tag + idx} className="flex items-center m-1 px-2 py-1 bg-[#C1001F] text-white rounded-full text-xs font-semibold">
                    {tag}
                    <button type="button" className="ml-1 text-white hover:text-black" onClick={() => removeTag(idx)} aria-label="Remove allergy tag">×</button>
                </span>
            ))}
            <input
                ref={inputRef}
                className="flex-1 min-w-[240px] h-[46px] border-none outline-none bg-transparent text-[16px] px-2 w-full"
                style={{ minWidth: '240px' }}
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

const CustomDateInput = React.forwardRef(({ value, onClick, onChange, placeholder }: any, ref: any) => (
    <input
        ref={ref}
        value={value}
        onClick={onClick}
        placeholder={placeholder}
        className="w-full h-[46px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] px-5 pr-12 bg-transparent outline-none rounded-[10px]"
    />
));
CustomDateInput.displayName = "CustomDateInput";

const Self_Appointment = forwardRef(({ location }: any, ref) => {
    const logic = useCSAFormLogic({ 
        location, 
        ref,
        onSuccess: () => setShowSuccessModal(true)
    });
    const { inOfficePatient, setInOfficePatient, newPatient, setNewPatient } = logic;
    // Signature canvas ref and state
    const sigCanvasRef = useRef<SignatureCanvas>(null);
    const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw');
    const [typedSignature, setTypedSignature] = useState('');
    const [selectedFont, setSelectedFont] = useState<'font1' | 'font2'>('font1');
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);
    const [pdfPreviewed, setPdfPreviewed] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [savedSignatureDataUrl, setSavedSignatureDataUrl] = useState<string | null>(null);
    const [savedSignatureMode, setSavedSignatureMode] = useState<'draw' | 'type' | null>(null);

    // Mobile stepper state
    const [currentStep, setCurrentStep] = useState(1);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const updateIsDesktop = () => setIsDesktop(typeof window !== 'undefined' && window.innerWidth >= 768);
        updateIsDesktop();
        window.addEventListener('resize', updateIsDesktop);
        return () => window.removeEventListener('resize', updateIsDesktop);
    }, []);

    // Section anchors for mobile pagination
    const patientSectionRef = useRef<HTMLDivElement | null>(null);
    const medicalSectionRef = useRef<HTMLDivElement | null>(null);
    const socialHistorySectionRef = useRef<HTMLDivElement | null>(null);

    const totalSteps = 4;
    const stepLabels = ['Patient Info', 'Medical Intake', 'History', 'Signature'];
    const progressPercent = Math.min(100, (currentStep / totalSteps) * 100);

    const handleNextStep = (step: number, _targetRef?: RefObject<HTMLDivElement> | null) => {
        setCurrentStep(step);
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    // Store last generated consent PDF data URL for upload
    const [consentPdfDataUrl, setConsentPdfDataUrl] = useState<string | null>(null);
    // Prevent double submission
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        const [isTranscriptOpen, setIsTranscriptOpen] = useState(true);
        const [isInstructionsOpen, setIsInstructionsOpen] = useState(true);
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
        <div className="relative w-full min-h-screen bg-[#EAEAEA]">
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
                <LanguageChanger locale={locale} />
            </div>
            
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Title Card */}
                <div className="w-full rounded-t-[20px] bg-[#EAEAEA] py-6 text-center mb-6"
                    style={{ backgroundColor:  '#f1efefff'  }}>
                {/* Title Card */}
                <div className="w-full rounded-t-[20px] bg-[#EAEAEA] py-6 text-center mb-6"
                    style={{ backgroundColor:  '#f1efefff'  }}>
                    <div className="flex w-full items-center justify-center gap-3">
                        <h1
                            className={`${styles.sectionHeadText} `}
                            style={{ textAlign: "center", color: "#DC143C" }}
                        >
                            {t("self_form_title")}
                        </h1>
                    </div>
                    <p className="text-[#767676] mt-1">{location.title}</p>
                </div>

                {/* Main Content: Form + Voice Intake */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    
                    {/* Left: Form Section (order-2 on mobile, order-1 on desktop) */}
                    <div className="w-full lg:flex-1 order-2 lg:order-1 bg-white rounded-[10px] p-4 md:p-6 shadow-sm">

<section className="grid md:grid-cols-2 grid-cols-1 gap-6"
         style={{
             backgroundColor: '#fefefeff',
             borderRadius: '10px',
             padding: '16px'
         }}
>

                                                {/* Mobile top back button */}
                                                {!isDesktop && currentStep > 1 && (
                                                    <div className="col-span-full md:hidden mb-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                                                            className="w-full px-6 py-3 bg-gray-500 text-white rounded-full text-base font-semibold"
                                                        >
                                                            Back
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Mobile progress bar */}
                                                {!isDesktop && (
                                                    <div className="col-span-full md:hidden mb-4">
                                                        <div className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-2">
                                                            <span>Step {currentStep} of {totalSteps}</span>
                                                            <span>{stepLabels[currentStep - 1] || ''}</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-[#C1001F] transition-all duration-300"
                                                                style={{ width: `${progressPercent}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                        {/* Patient Information Section */}
                        {(currentStep === 1 || isDesktop) && (
                            <>
                                <div className="col-span-full" ref={patientSectionRef}>
                                    <h2 className="text-[26px] font-bold text-gray-900 border-b-2 border-[#E0E0E0] pb-2 mb-6 text-center md:text-left">{t('patient_information_title')}</h2>
                                </div>

                                <Dropdown
                                    label={<span>{t("form_f10")} <span style={{color: '#C81E3A'}}>*</span></span>}
                                    options={services}
                                    breakpoint={true}
                                    onChange={setService}
                                    value={service}
                                    startingSelectedOption={true}
                                />
                                {/* Removed misplaced input and invalid onChange/value lines */}
                                <Input
                                    label={<span>{t("form_f3")} <span style={{color: '#C81E3A'}}>*</span></span>}
                                    placeholder="Enter your first name"
                                    breakpoint={true}
                                    onChange={setFirstName}
                                    value={firstName}
                                />
                                <Input
                                    label={<span>{t("form_f4")} <span style={{color: '#C81E3A'}}>*</span></span>}
                                    placeholder="Enter your last name"
                                    breakpoint={true}
                                    onChange={setLastName}
                                    value={lastName}
                                />
                                {/* Email Address Field */}
                                <div className="flex flex-col items-start w-full justify-center">
                                    <label className="text-[16px] text-customGray font-poppins font-bold mb-2">{t('email_label')} <span style={{color: '#C81E3A'}}>*</span></label>
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
                                    {/* Voice input instructions */}
                                    {isUserSpeaking && (
                                        <div className="mt-2 text-sm text-blue-700 bg-blue-50 rounded p-2 w-full">
                                            <div className="mb-1 font-semibold">Email Instructions</div>
                                            <div><b>Step 1: Username</b></div>
                                            <div>"Please enter the part of your email address that comes before the '@' symbol (e.g., if your email is john.doe@gmail.com, type john.doe)."</div>
                                            <div className="mt-2"><b>Step 2: Domain</b></div>
                                            <div>"Now, enter the email domain that comes after the '@' symbol (e.g., gmail.com or outlook.com)."</div>
                                        </div>
                                    )}
                                </div>
                                {/* State and Zipcode - use grid for equal width */}
                                <div className="w-full">
                                    <label className="text-[16px] text-customGray font-poppins font-bold mb-2 text-left block">State: <span style={{color: '#C81E3A'}}>*</span></label>
                                    <select
                                        className="w-full h-[52px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] px-5 bg-transparent outline-none rounded-[10px]"
                                        value={medicalForm.state || ""}
                                        onChange={e => handleMedicalChange('state', e.target.value)}
                                    >
                                        <option value="">State</option>
                                        {usStates.map((state, idx) => (
                                            <option key={state.value + '-' + idx} value={state.name}>{`${state.name} - ${state.value}`}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full">
                                    <label className="text-[16px] text-customGray font-poppins font-bold mb-2 text-left block">Zipcode: <span style={{color: '#C81E3A'}}>*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Enter zipcode"
                                        className="w-full h-[52px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                        value={medicalForm.zipcode || ""}
                                        onChange={e => handleMedicalChange('zipcode', e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
                                    />
                                </div>
                                {/* Address Field - Full Width Row */}
                                <div className="md:col-span-2">
                                    <Input
                                        label={<span>{t("form_f9")} <span style={{color: '#C81E3A'}}>*</span></span>}
                                        placeholder="Enter your street address"
                                        breakpoint={true}
                                        onChange={setStreetAddress}
                                        value={streetAddress}
                                        className="h-[52px]"
                                    />
                                </div>
                                <PhoneNumberInput
                                    label={<span>{t("form_f6")} <span style={{color: '#C81E3A'}}>*</span></span>}
                                    placeholder="ex. +1 (123) 456-7890"
                                    breakpoint={false}
                                    onChange={setPhone}
                                    value={phone}
                                />
                                <RadioButtons
                                    name="gender"
                                    options={genderOptions}
                                    label={<span>{t("form_f8")} <span style={{color: '#C81E3A'}}>*</span></span>}
                                    onChange={setSex}
                                    selectedValue={sex}
                                />
                                                                {/* Date of Birth and Age - direct children of main grid */}
                                                                                                                                <div className="w-full flex flex-col items-start">
                                                                                                                                    <label className="text-[16px] text-customGray font-poppins font-bold mb-2 text-left block">
                                                                                                                                        {t('form_f7')} <span style={{color: '#C81E3A'}}>*</span>
                                                                                                                                    </label>
                                                                                                                                    <div className="relative w-full">
                                                                                                                                        <ReactDatePicker
                                                                                                                                            selected={dob}
                                                                                                                                            onChange={(date: Date | null) => setDob(date)}
                                                                                                                                            dateFormat="MM/dd/yyyy"
                                                                                                                                            maxDate={new Date()}
                                                                                                                                            placeholderText="mm/dd/yyyy"
                                                                                                                                            showYearDropdown
                                                                                                                                            scrollableYearDropdown
                                                                                                                                            yearDropdownItemNumber={100}
                                                                                                                                            customInput={<CustomDateInput />}
                                                                                                                                            wrapperClassName="w-full"
                                                                                                                                        />
                                                                                                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                                                                                                            <svg
                                                                                                                                                width="20"
                                                                                                                                                height="20"
                                                                                                                                                viewBox="0 0 24 24"
                                                                                                                                                fill="none"
                                                                                                                                                stroke="#C1001F"
                                                                                                                                                strokeWidth="2"
                                                                                                                                                strokeLinecap="round"
                                                                                                                                                strokeLinejoin="round"
                                                                                                                                            >
                                                                                                                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                                                                                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                                                                                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                                                                                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                                                                                                                            </svg>
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                <div className="w-full">
                                                                    <label className="text-[16px] text-customGray font-poppins font-bold mb-2 text-left block">
                                                                        {t('age_label')}
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={dob ? moment().diff(moment(dob), 'years') : ''}
                                                                        readOnly
                                                                        placeholder={t('age_placeholder')}
                                                                        className="w-full h-[52px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-gray-50 outline-none rounded-[10px] cursor-not-allowed"
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

                                {/* Mobile pagination: patient section next */}
                                <div className="col-span-full md:hidden">
                                    <button
                                        type="button"
                                        onClick={() => handleNextStep(2, medicalSectionRef)}
                                        className="w-full px-6 py-4 bg-[#C1001F] text-white rounded-full text-base font-semibold shadow-md"
                                    >
                                        Next: Medical Information
                                    </button>
                                </div>
                            </>
                        )}

                        {(currentStep === 2 || isDesktop) && (
                            <>
                        {/* Medical intake */}
                        <div className="col-span-full space-y-4 pt-4">
                            {/* Voice Intake Mic Button below waveform */}
                            <div className="mb-4">
                                {/* <VoiceIntake setForm={setMedicalForm} onTranscript={onTranscript} vapi={vapi} onUserSpeaking={handleUserSpeaking} /> */}
                                {/* Button now commented out and only visible in right-side box */}
                            </div>
                         </div>
                                                          <div className="col-span-full mt-0" ref={medicalSectionRef}>
                            <h2 className="text-[26px] font-bold text-gray-900 border-b-2 border-[#E0E0E0] pb-2 mb-6 text-center md:text-left">{t('medical_info_title')}</h2>
                         </div>
                         <div className="col-span-full space-y-4 pt-0">
                            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                                {/* Move Reason for Visit, Location, Severity before Number of Pregnancies/Birth Control */}
                                <Input
                                    label={<span>{t('reason_visit_label')} <span style={{color: '#C81E3A'}}>*</span></span>}
                                    placeholder={t('reason_visit_placeholder')}
                                    breakpoint={true}
                                    onChange={(val) => handleMedicalChange('chief_complaint', val)}
                                    value={medicalForm.chief_complaint}
                                />
                                <div className="flex flex-col items-start w-full gap-1">
                                    {/* Label */}
                                    <label className="text-[16px] text-customGray font-poppins font-bold">
                                        {t('duration_label')} <span style={{color: '#C81E3A'}}>*</span>
                                    </label>

                                    <div className="relative w-full">
                                        <ReactDatePicker
                                            selected={onsetDate}
                                            onChange={(date: Date | null) => handleOnsetDateChange(date)}
                                            dateFormat="MM/dd/yyyy"
                                            maxDate={new Date()}
                                            placeholderText="mm/dd/yyyy"
                                            showYearDropdown
                                            scrollableYearDropdown
                                            yearDropdownItemNumber={100}
                                            wrapperClassName="w-full"
                                            customInput={<CustomDateInput />}
                                        />
                                        {/* Icon positioned absolutely inside the input area */}
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg 
                                                width="20" 
                                                height="20" 
                                                viewBox="0 0 24 24" 
                                                fill="none" 
                                                stroke="#C1001F" 
                                                strokeWidth="2" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round"
                                            >
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                            </svg>
                                        </div>
                                    </div>
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
                                            <input type="month" className="w-full h-[46px] border-[1px] border-[#000000] text-[16px] text-[#000000] px-5 bg-transparent outline-none rounded-[10px]" value={medicalForm.pap_smear_date || ''} onChange={e => handleMedicalChange('pap_smear_date', e.target.value)} />
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
                                            <input type="month" className="w-full h-[46px] border-[1px] border-[#000000] text-[16px] text-[#000000] px-5 bg-transparent outline-none rounded-[10px]" value={medicalForm.mammogram_date || ''} onChange={e => handleMedicalChange('mammogram_date', e.target.value)} />
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
                                            <input type="month" className="w-full h-[46px] border-[1px] border-[#000000] text-[16px] text-[#000000] px-5 bg-transparent outline-none rounded-[10px]" value={medicalForm.prostate_exam_date || ''} onChange={e => handleMedicalChange('prostate_exam_date', e.target.value)} />
                                        )}
                                    </div>
                                )}
         
                                <div className="flex flex-col items-start w-full justify-center md:col-span-2">
                                    <label className="text-[16px] text-customGray font-poppins font-bold">{t('symptom_details_label')} <span style={{color: '#C81E3A'}}>*</span></label>
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

                        </div>

                        {/* Mobile pagination: medical section next */}
                        <div className="col-span-full md:hidden flex items-center mt-4">
                            <button
                                type="button"
                                onClick={() => handleNextStep(3, socialHistorySectionRef)}
                                className="w-full px-6 py-4 bg-[#C1001F] text-white rounded-full text-base font-semibold"
                            >
                                Next: History
                            </button>
                        </div>
                            </>
                        )}

                        {/* Social History Section + Medical History on step 3 */}
                        {(currentStep === 3 || isDesktop) && (
                            <>
                         {/* Medical History Section (moved to step 3 for mobile) */}
                         <div className="col-span-full pt-10">
                                <h2 className="text-[26px] font-bold text-gray-900 border-b-2 border-[#E0E0E0] pb-2 mb-8 text-center md:text-left">{t('medical_history_title')}</h2>
                            </div>

                            {/* Grid Container: Increased horizontal gap (gap-x-24) and tighter vertical spacing on web */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-x-96 items-start w-full">
                                {/* Column 1: Surgeries (move left) */}
                                <div className="flex flex-col items-start w-full">
                                    <label className="text-[16px] text-customGray font-poppins font-bold min-h-[24px]">{t('surgeries_label')} <span style={{color: '#C81E3A'}}>*</span></label>
                                    <div className="flex flex-row gap-6 my-3 h-[30px] items-center">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="surgeryChoice"
                                                value="Yes"
                                                checked={surgeryChoice === 'Yes'}
                                                onChange={() => setSurgeryChoice('Yes')}
                                                className="custom-radio-orange"
                                            />
                                            <span className="text-customGray text-[16px]">{t('surgeries_yes')}</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
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
                                            <span className="text-customGray text-[16px]">{t('surgeries_no')}</span>
                                        </label>
                                    </div>
                                 <div className="w-full md:max-w-[400px] min-h-[50px]">
                                        {surgeryChoice === 'Yes' ? (
                                            <AllergyTagInput
                                                allergies={Array.isArray(medicalForm.surgeries) ? medicalForm.surgeries : (medicalForm.surgeries ? [medicalForm.surgeries] : [])}
                                                setAllergies={(surgeries) => handleMedicalChange('surgeries', surgeries)}
                                                placeholder="Type of surgery"
                                            />
                                        ) : (
                                            <div className={`${isDesktop ? 'hidden md:block h-[50px]' : 'h-2'}`}></div>
                                        )}
                                    </div>
                                </div>

                                {/* Column 2: Allergies (move right, add left margin) */}
                      <div className="flex flex-col items-start w-full">
                                    <label className="text-[16px] text-customGray font-poppins font-bold min-h-[24px]">{t('allergies_label')} <span style={{color: '#C81E3A'}}>*</span></label>
                                    <div className="flex flex-row gap-6 my-3 h-[30px] items-center">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="allergyChoice"
                                                value="Yes"
                                                checked={allergyChoice === 'Yes'}
                                                onChange={() => setAllergyChoice('Yes')}
                                                className="custom-radio-orange"
                                            />
                                            <span className="text-customGray text-[16px]">{t('allergies_yes')}</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
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
                                            <span className="text-customGray text-[16px]">{t('allergies_no')}</span>
                                        </label>
                                    </div>
                             <div className="w-full md:max-w-[400px] min-h-[50px]">
                                        {allergyChoice === 'Yes' ? (
                                      
                                                <AllergyTagInput
                                                    allergies={medicalForm.allergies}
                                                    setAllergies={(allergies) => setMedicalForm((prev: typeof medicalForm) => ({ ...prev, allergies }))}
                                                    placeholder="List allergies"
                                                />
                                     
                                        ) : (
                                            <div className={`${isDesktop ? 'hidden md:block h-[50px]' : 'h-2'}`}></div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 col-span-full md:mt-4 items-start">
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
                                            <label className="text-[16px] text-customGray font-poppins font-bold block text-left">Cancer Type:</label>
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

                         <div className="col-span-full mt-8" ref={socialHistorySectionRef}>
                            <h2 className="text-[26px] font-bold text-gray-900 border-b-2 border-[#E0E0E0] pb-2 mb-6 text-center md:text-left">{t('social_history_title')}</h2>
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
                                    <p className="text-[16px] text-customGray font-poppins font-bold text-center md:text-left">{t('lifestyle_label')}</p>
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

                      



                        <div className="w-full md:flex justify-start items-start space-y-6 col-span-full mb-5">
    {/* Removed justify-center and items-center from the main container */}
    <div className="space-y-4 md:w-2/3"> 
        {/* Changed justify-center to justify-start and items-center to items-start */}
        <div className="flex space-x-2 items-start justify-start">
            <input 
                checked={email_opt} 
                onChange={(e) => setEmail_opt(e.target.checked)} 
                type="checkbox" 
                className="custom-checkbox-orange mt-1" // Added mt-1 to align checkbox with first line of text
            /> 
            <h1 className="text-xs text-left"> {/* Added text-left */}
                {t("email_consent")}
            </h1>
        </div>


        

        <div className="flex space-x-2 items-start justify-start">
            <input 
                checked={text_opt} 
                onChange={(e) => setText_opt(e.target.checked)} 
                type="checkbox" 
                className="custom-checkbox-orange mt-1" 
            /> 
            <h1 className="text-xs text-left">
                {t("sms_consent")}
            </h1>
        </div>
    </div>
</div>

                        {/* Mobile pagination: history to signature */}
                        <div className="col-span-full md:hidden flex items-center mt-4">
                            <button
                                type="button"
                                onClick={() => handleNextStep(4, null)}
                                className="w-full px-6 py-4 bg-[#C1001F] text-white rounded-full text-base font-semibold"
                            >
                                Next: Signature & Consent
                            </button>
                        </div>

                        </>
                        )}

                        {(currentStep === 4 || isDesktop) && (
                            <>

                        {/* Digital Signature Section */}
                                 <div className="w-full col-span-full mt-8">
                            <h2 className="text-[26px] font-bold text-gray-900 border-b-2 border-[#E0E0E0] pb-2 mb-6 text-center md:text-left">{t('digital_signature_title')} <span style={{color: '#C81E3A'}}>*</span></h2>
                            <p className="text-gray-600 mb-4 text-center md:text-left">
                                {t('digital_signature_description')}
                            </p>
                            <div className="flex justify-center md:justify-start">
                                <button
                                    onClick={() => setIsSignatureModalOpen(true)}
                                    className="px-6 py-3 bg-[#C1001F] text-white rounded-lg font-semibold hover:bg-[#a30019] transition-colors"
                                    type="button"
                                >
                                    {t('digital_signature_button')}
                                </button>
                            </div>
                            {hasSignature && (
                                <div className="flex items-center gap-2 mt-3 text-green-600 justify-center md:justify-start">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">{t('digital_signature_saved')}</span>
                                </div>
                            )}
                        </div>

                        {/* Digital Sign Following Documents Section */}
                        <div className="w-full col-span-full mt-8">
                            <h2 className="text-[26px] font-bold text-gray-900 border-b-2 border-[#E0E0E0] pb-2 mb-6 text-center md:text-left">{t('digital_sign_docs')}</h2>
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
                            <div className="w-full flex flex-col gap-3 justify-end">
                               
                               <div className="w-full mt-4 flex justify-center md:justify-end">
                                    <Button
                                        text={t("button_label")}
                                       className="!w-full md:!w-fit md:!max-w-[200px] md:!px-6"
                                   size={{ width: "auto", height: "56px" }}
                                        route={""}
                                        bgColor={"#C81E3A"}
                                        textColor={"#ffffff"}
                                        disabled={isSubmitting}
                                        onClick={async () => {

                                            if (isSubmitting) return;
                                            // Required fields check
                                            const toastOptions = { style: { background: '#C1001F', color: '#fff' } };
                                            // Required fields (asterisk):
                                            if (!firstName || !firstName.trim()) {
                                                toast.warning('First name is required.', toastOptions);
                                                return;
                                            }
                                            if (!lastName || !lastName.trim()) {
                                                toast.warning('Last name is required.', toastOptions);
                                                return;
                                            }
                                            if (!dob) {
                                                toast.warning('Date of Birth is required.', toastOptions);
                                                return;
                                            }
                                            if (!medicalForm.state || !medicalForm.state.trim()) {
                                                toast.warning('State is required.', toastOptions);
                                                return;
                                            }
                                            if (!streetAddress || !streetAddress.trim()) {
                                                toast.warning('Address is required.', toastOptions);
                                                return;
                                            }
                                            if (!email || !email.trim()) {
                                                toast.warning('Email address is required.', toastOptions);
                                                return;
                                            }
                                            if (!medicalForm.zipcode || !medicalForm.zipcode.trim()) {
                                                toast.warning('Zipcode is required.', toastOptions);
                                                return;
                                            }
                                            if (!phone || phone.replace(/\D/g, '').length !== 10) {
                                                toast.warning('Mobile number is required and must be 10 digits.', toastOptions);
                                                return;
                                            }
                                            if (!sex || !sex.trim()) {
                                                toast.warning('Gender is required.', toastOptions);
                                                return;
                                            }
                                            if (!service || !service.trim()) {
                                                toast.warning('Service is required.', toastOptions);
                                                return;
                                            }
                                            if (!medicalForm.chief_complaint || !medicalForm.chief_complaint.trim()) {
                                                toast.warning('Reason of visit is required.', toastOptions);
                                                return;
                                            }
                                            if (!onsetDate) {
                                                toast.warning('Onset date is required.', toastOptions);
                                                return;
                                            }
                                            if (!medicalForm.symptoms_description || !Array.isArray(medicalForm.symptoms_description) || medicalForm.symptoms_description.length === 0) {
                                                toast.warning('Symptom details are required.', toastOptions);
                                                return;
                                            }
                                            if (!surgeryChoice || !surgeryChoice.trim()) {
                                                toast.warning('Surgeries selection is required.', toastOptions);
                                                return;
                                            }
                                            if (surgeryChoice === 'Yes' && (!medicalForm.surgeries || (Array.isArray(medicalForm.surgeries) ? medicalForm.surgeries.length === 0 : !medicalForm.surgeries.trim()))) {
                                                toast.warning('Please specify surgery details.', toastOptions);
                                                return;
                                            }
                                            if (typeof allergyChoice !== 'undefined' && allergyChoice === 'Yes') {
                                                if (!medicalForm.allergies || !Array.isArray(medicalForm.allergies) || medicalForm.allergies.length === 0) {
                                                    toast.warning('Allergies are required.', toastOptions);
                                                    return;
                                                }
                                            }
                                            if (!hasSignature) {
                                                toast.warning('Digital signature is required.', toastOptions);
                                                return;
                                            }

                                            setIsSubmitting(true);
                                            try {
                                                if (!onsetDate) {
                                                    toast.warning('Please fill onset date');
                                                    return;
                                                }

                                                // Validate all consents are checked
                                                if (!consentTelemedicine || !consentHIPAA || !consentGeneral) {
                                                    toast.warning('Please agree to all consent documents before submitting');
                                                    return;
                                                }

                                                // Email validation
                                                const emailPattern = /^([a-zA-Z0-9_\-.+]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,})$/;
                                                if (!emailPattern.test(email)) {
                                                    toast.warning('Please enter a valid email address.');
                                                    return;
                                                }

                                                // Phone number validation: US number, 10 digits
                                                const phoneDigits = (phone || '').replace(/\D/g, '');
                                                if (phoneDigits.length !== 10) {
                                                    toast.warning('Please enter a valid 10-digit US phone number.');
                                                    return;
                                                }

                                                const signatureData = buildSignatureDataUrl();

                                                // Helper to get data URL for a given form type
                                                const generateDataUrl = (formType: 'telemedicine' | 'hipaa' | 'general') =>
                                                    new Promise<string>((resolve) => {
                                                        generateConsentPDF({
                                                            firstName,
                                                            lastName,
                                                            patient_name: `${firstName} ${lastName}`.trim(),
                                                            dob,
                                                            signature: signatureData
                                                        }, {
                                                            formType,
                                                            preview: false,
                                                            onReady: (dataUrl) => resolve(dataUrl)
                                                        });
                                                    });

                                                const [telemedicineDataUrl, hipaaDataUrl, generalDataUrl] = await Promise.all([
                                                    generateDataUrl('telemedicine'),
                                                    generateDataUrl('hipaa'),
                                                    generateDataUrl('general'),
                                                ]);

                                                // Keep telemedicine in state for any downstream needs
                                                setConsentPdfDataUrl(telemedicineDataUrl);

                                                // Always prepend +1 to phone number for DB
                                                const phoneForDb = '+1' + phone;
                                                await submitAppointmentDetails({
                                                    telemedicine: telemedicineDataUrl,
                                                    hipaa: hipaaDataUrl,
                                                    general: generalDataUrl,
                                                    phone: phoneForDb,
                                                });

                                                // Success toast removed as requested
                                                resetSignatureState();
                                                setStreetAddress('');
                                            } catch (error) {
                                                console.error('Error generating/uploading PDFs for submission:', error);
                                                toast.error('Could not generate or upload consent PDFs for submission');
                                            } finally {
                                                setIsSubmitting(false);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div> 

                        {/* Removed Back to Social History button on phone */}

                        </>
                        )}

                    </section>

                    </div>
                    {/* End of Form Section */}

                    {/* Right: Voice Intake (order-1 on mobile, order-2 on desktop, sticky on lg+) */}
                    <div className="w-full lg:w-[420px] order-1 lg:order-2 lg:sticky lg:top-6">
                        <section className="bg-white rounded-lg flex flex-col gap-6 px-4 py-6 shadow-md">
                          <div className="w-full rounded-md bg-[#F8F9FA] p-4 flex flex-col items-center border border-gray-100">
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
                            <p className="text-center text-sm text-[#49505A] mb-4">
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
                              <p className="text-xs text-gray-500 mt-2">
                                {isUserSpeaking
                                  ? "User speaking…"
                                  : isSpeaking
                                  ? "Assistant speaking…"
                                  : t('voice_intake_ready')}
                              </p>
                            </div>
                          </div>

                                                    {/* Transcript Area */}
                                                    <div className="w-full rounded-md bg-[#F1F5F9] p-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <button
                                                                type="button"
                                                                className="flex items-center gap-2 text-left text-[#374151]"
                                                                onClick={() => setIsTranscriptOpen((prev) => !prev)}
                                                                aria-expanded={isTranscriptOpen}
                                                            >
                                                                <span className="text-md font-bold">{t('conversation_transcript')}</span>
                                                                <svg
                                                                    className={`w-4 h-4 transition-transform duration-200 ${isTranscriptOpen ? 'rotate-180' : ''}`}
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </button>
                                                            {isTranscriptOpen && (
                                                                <button type="button" className="text-xs font-medium text-red-600 hover:underline">
                                                                    {t('transcript_clear')}
                                                                </button>
                                                            )}
                                                        </div>
                                                        {isTranscriptOpen && (
                                                            <div className="bg-white rounded-lg p-3 shadow-inner max-h-[200px] overflow-y-auto text-sm">
                                                                <TranscriptDisplay currentTranscript={currentTranscript} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* How Voice Intake Works */}
                                                    <div className="w-full rounded-md bg-[#F8F9FA] p-4 border border-gray-100 text-left">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <button
                                                                type="button"
                                                                className="flex items-center gap-2 text-left text-[#374151]"
                                                                onClick={() => setIsInstructionsOpen((prev) => !prev)}
                                                                aria-expanded={isInstructionsOpen}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                        <circle cx="12" cy="12" r="10" fill="#CBD5E1" />
                                                                        <path d="M12 16v-4" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
                                                                        <circle cx="12" cy="8" r="1" fill="#374151" />
                                                                    </svg>
                                                                    <span className="text-lg font-semibold text-[#374151]">
                                                                        {t('how_voice_intake_works')}
                                                                    </span>
                                                                </div>
                                                                <svg
                                                                    className={`w-4 h-4 transition-transform duration-200 ${isInstructionsOpen ? 'rotate-180' : ''}`}
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        {isInstructionsOpen && (
                                                            <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
                                                                <li>{t('voice_intake_step1')}</li>
                                                                <li>{t('voice_intake_step2')}</li>
                                                                <li>{t('voice_intake_step3')}</li>
                                                                <li>{t('voice_intake_step4')}</li>
                                                                <li>{t('voice_intake_step5')}</li>
                                                            </ul>
                                                        )}
                                                    </div>
                        </section>
                    </div>
                    {/* End of Voice Section */}

                </div>
                {/* End of Main Content Flex Container */}

            </div>
            {/* End of max-w-7xl container */}
        </div>
        {/* End of main wrapper */}
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

    {/* Success Modal */}
    <Modal show={showSuccessModal} onClose={() => setShowSuccessModal(false)} size="md">
        <Modal.Body>
            <div className="text-center py-8" style={{ background: 'linear-gradient(90deg, rgb(220, 20, 60) 0%, rgb(185, 28, 28) 100%)' }}>
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-white mb-6">
                    <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-white">Thanks for Booking!</h3>
                <p className="text-white mb-6">Your appointment has been successfully submitted.</p>
                <div className="flex justify-center">
                    <Button
                        text="Close"
                        size={{ width: "150px", height: "45px" }}
                        route={""}
                        bgColor={"#ffffff"}
                        textColor={"#DC143C"}
                        onClick={() => setShowSuccessModal(false)}
                    />
                </div>
            </div>
        </Modal.Body>
    </Modal>
</>);
},);


export default Self_Appointment





import React from "react";





