"use client";

import { styles } from "@/app/[locale]/styles";
import { supabase } from "@/supabaseClient";
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

const RadioButton = ({ value, name, label, checked, onChange }: any) => (
    <div className="flex items-center justify-start gap-3">
        <input
            type="radio"
            value={value}
            name={name}
            checked={checked}
            onChange={onChange}
            className="w-[25px] h-[25px] bg-transparent border-[2px] border-[#000000] hover:bg-[#ccc]"
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
            {label}:
        </label>
        <input
            type={type}
            placeholder={`${placeholder}`}
            className="w-full h-[46px] border-[1px] border-[#000000] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
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
        <div className="w-full min-h-[46px] border-[1px] border-[#000000] rounded-[10px] flex flex-wrap items-center px-2 py-1 bg-transparent mt-2">
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
    // Destructure all state and handlers from logic
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
    } = logic;

        Self_Appointment.displayName = "Self_Appointment";
    // Debug: log transcript and user speaking state
    console.log('TRANSCRIPT:', currentTranscript);
    console.log('isUserSpeaking:', isUserSpeaking);
    return (<>
                {/* Transcript sidebar: always show current transcript (not a list) */}
                <div className="fixed bottom-0 left-0 w-full z-50 bg-red-600 border-t border-red-700 shadow-lg p-4 text-white text-lg min-h-[60px] flex items-center">
                    <TranscriptDisplay currentTranscript={currentTranscript} />
                </div>
        <div className="relative w-screen min-h-screen">
            <div className="md:absolute px-5 md:px-0 pt-4 pb-5 md:py-0 w-full flex justify-end md:top-6 md:right-6">
                <LanguageChanger locale={locale} />
            </div>
            <div className="flex justify-center h-full items-center px-5 md:px-0">
                <div className="w-full max-w-[800px] rounded-[20px] mt-8 gap-y-5">
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
                                        {/* VoiceWave waveform above VoiceIntake mic button */}
                                        {(() => {
                                            // Debug log for rendering block
                                            console.log('RENDER WAVES: isSpeaking:', isSpeaking, 'isUserSpeaking:', isUserSpeaking);
                                            // Show blue if assistant is speaking, red if user is speaking, none if both are silent
                                            if (isSpeaking) {
                                                return (
                                                    <div className="flex flex-col items-center mb-6 gap-2">
                                                        <VoiceWave isActive={true} color="#00f5ff" />
                                                        <p className="text-sm text-gray-500 mt-1">Assistant speaking…</p>
                                                    </div>
                                                );
                                            } else if (isUserSpeaking) {
                                                return (
                                                    <div className="flex flex-col items-center mb-6 gap-2">
                                                        <VoiceWave isActive={true} color="#ff0033" />
                                                        <p className="text-sm text-gray-500 mt-1">User speaking…</p>
                                                    </div>
                                                );
                                            } else {
                                                // Both are silent, show nothing
                                                return null;
                                            }
                                        })()}
                    <section className="grid md:grid-cols-2 grid-cols-1 place-content-baseline gap-8">
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
                            {/* Voice Intake Mic Button below waveform */}
                            <div className="mb-4">
                                <VoiceIntake setForm={setMedicalForm} onTranscript={onTranscript} vapi={vapi} onUserSpeaking={handleUserSpeaking} />
                            </div>
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
                                    <AllergyTagInput
                                        allergies={medicalForm.symptoms_description}
                                        setAllergies={(symptoms_description: string[]) => setMedicalForm((prev: typeof medicalForm) => ({ ...prev, symptoms_description }))}
                                        placeholder="e.g., cough, fever, headache"
                                    />
                                </div>
                                <div className="flex flex-col items-start w-full justify-center">
                                    <label className="text-[16px] text-customGray font-poppins font-bold">Relieving Factors:</label>
                                    <div className="flex flex-wrap gap-3 mt-2">
                                        {['Rest', 'Ice', 'Heat', 'Elevation', 'Medication', 'Stretching', 'Massage', 'Support or compression', 'Time', 'Other'].map((opt) => (
                                            <label key={opt} className="flex items-center gap-2 text-sm text-customGray">
                                                <input
                                                    type="checkbox"
                                                    checked={reliefSelect.includes(opt)}
                                                    onChange={(e) => {
                                                        let updated: string[];
                                                        if (e.target.checked) {
                                                            updated = [...reliefSelect, opt];
                                                        } else {
                                                            updated = reliefSelect.filter((item) => item !== opt);
                                                        }
                                                        // Only call setReliefSelect with string[]
                                                        setReliefSelect(Array.isArray(updated) ? updated : []);
                                                        // If "Other" is unchecked, clear reliefOther
                                                        if (!updated.includes('Other')) {
                                                            setReliefOther("");
                                                        }
                                                        // Update medicalForm.relieving_factors as a comma-separated string (including Other text if present)
                                                        setMedicalForm((prev: typeof medicalForm) => ({
                                                            ...prev,
                                                            relieving_factors: updated
                                                                .map((item: string) => (item === 'Other' && reliefOther ? reliefOther : item))
                                                                .filter(Boolean)
                                                                .join(', '),
                                                        }));
                                                    }}
                                                />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                    {reliefSelect.includes('Other') && (
                                        <input
                                            className="w-full h-[46px] mt-2 border-[1px] border-[#000000] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
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
                                    <label className="text-[16px] text-customGray font-poppins font-bold">Medical Conditions:</label>
                                    <AllergyTagInput
                                        allergies={medicalForm.medical_conditions}
                                        setAllergies={(medical_conditions: string[]) => setMedicalForm((prev: typeof medicalForm) => ({ ...prev, medical_conditions }))}
                                        placeholder="e.g., asthma, diabetes, hypertension"
                                    />
                                </div>
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
                                                setMedicalForm((prev: typeof medicalForm) => ({ ...prev, surgeries: '' }));
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
                                            autoComplete="on"
                                            autoCorrect="on"
                                            spellCheck={true}
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
                                                setMedicalForm((prev: typeof medicalForm) => ({ ...prev, allergies: [] }));
                                            }
                                        }}
                                    >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                    {allergyChoice === 'Yes' && (
                                        <AllergyTagInput
                                            allergies={medicalForm.allergies}
                                            setAllergies={(allergies: string[]) => setMedicalForm((prev: typeof medicalForm) => ({ ...prev, allergies }))}
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
                                    <input checked={email_opt} onChange={(e) => setEmail_opt(e.target.checked)} type="checkbox" autoComplete="on" autoCorrect="on" spellCheck={true} /> <h1 className="text-xs">
                                        {t("email_consent")}
                                    </h1>
                                </div>
                                <div className="flex space-x-2 items-center">
                                    <input checked={text_opt} onChange={(e) => setText_opt(e.target.checked)} type="checkbox" autoComplete="on" autoCorrect="on" spellCheck={true} /> <h1 className="text-xs">
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
},);


export default Self_Appointment