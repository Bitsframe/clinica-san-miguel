
"use client";
import "@/styles/custom-checkbox.css";

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
            {label}:
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
            dateFormat="yyyy-MM-dd HH:MM"
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
    const [inOfficePatient, setInOfficePatient] = useState(true); // default to in-office
    const logic = useCSAFormLogic({ location, ref, inOfficePatient });
    // Add local state for visit type and new/returning patient
    // const [inOfficePatient, setInOfficePatient] = useState(true); // moved above
    const [newPatient, setNewPatient] = useState(true); // default to new
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

        Self_Appointment.displayName = "Self_Appointment";
    // Debug: log transcript and user speaking state
    return (<>
        <div className="relative w-screen min-h-screen flex justify-start items-start" style={{ backgroundColor: '#EAEAEA', paddingLeft: '40px' }}>
            <div className="md:absolute px-5 md:px-0 pt-4 pb-5 md:py-0 w-full flex justify-end md:top-6 md:right-6">
                <LanguageChanger locale={locale} />
            </div>
            <div className="flex flex-row justify-start h-full items-start px-5 md:px-0 gap-8">
                {/**
                 * Sidebar transcript area commented out as requested
                 * <div className="hidden md:flex flex-col w-[350px] min-h-[500px] max-h-[700px] bg-white rounded-lg mt-8 mr-2 p-4">
                 *     <div className="w-full bg-blue-600 text-white rounded-lg p-3 text-lg shadow mb-2">
                 *         <TranscriptDisplay currentTranscript={currentTranscript} />
                 *     </div>
                 * </div>
                 */}
                {/* Main form content */}
                <div
                    className="w-full max-w-full xl:max-w-[1200px] lg:max-w-[1000px] md:max-w-[800px] sm:max-w-full rounded-[20px] mt-8 gap-y-5 p-8"
                    style={{ backgroundColor: '#c92222ff' }}>
                    <div className="flex flex-col w-full justify-center border-b-[1px] border-black px-4 pb-2 text-center mb-9" style={{ backgroundColor: '#E0E0E0', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                        <div className="flex w-full items-center justify-between gap-3">
                            <h1
                                className={`${styles.sectionHeadText} `}
                                style={{ textAlign: "left", color: "#C1001F" }}
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
                    {/* VoiceWave waveform above VoiceIntake mic button */}
                    {(() => {
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

<section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-8 w-full">

                    <section className="grid md:grid-cols-2 grid-cols-1 place-content-baseline gap-8" style={{ backgroundColor: '#fefefeff', borderRadius: '10px', padding: '24px' }}>
                        {/* Visit Type */}
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                            <label className="text-[16px] text-customGray font-poppins font-bold">Visit Type:</label>
                            <div className="flex flex-row gap-4">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="visitType" value="in_office" checked={inOfficePatient === true} onChange={() => setInOfficePatient(true)} className="custom-radio-orange" /> In-Office Visit
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="visitType" value="virtual" checked={inOfficePatient === false} onChange={() => setInOfficePatient(false)} className="custom-radio-orange" /> Virtual Visit
                                </label>
                            </div>
                        </div>
                        {/* New or Returning Patient */}
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                            <label className="text-[16px] text-customGray font-poppins font-bold">Are you a new or returning patient? :</label>
                            <div className="flex flex-row gap-4">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="newReturning" value="new" checked={newPatient === true} onChange={() => setNewPatient(true)} className="custom-radio-orange" /> new
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="newReturning" value="returning" checked={newPatient === false} onChange={() => setNewPatient(false)} className="custom-radio-orange" /> returning
                                </label>
                            </div>
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
                            <label className="text-[16px] text-customGray font-poppins font-bold mb-2">Email Address:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full h-[46px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                autoComplete="on"
                                autoCorrect="on"
                                spellCheck={true}
                            />
                            {/* Email validation error */}
                            {email && !/^([a-zA-Z0-9_\-.+]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,})$/.test(email) && (
                                <span className="text-red-600 text-xs mt-1">Please enter a valid email address.</span>
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
                            <label className="text-[16px] text-customGray font-poppins font-bold mb-2">Date of Birth:</label>
                            <input
                                type="date"
                                value={dob ? dob.toISOString().split('T')[0] : ''}
                                onChange={e => setDob(e.target.value ? new Date(e.target.value) : null)}
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full h-[46px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                            />
                        </div>
                        {/* Schedule Date and Time Picker */}
                        {/* TypeScript: define type for date_and_time */}
                        {/* Place this type at the top of the file or in the component scope */}
                        {/* type ScheduleDateTime = { date: string; time: string; } */}
                        <div className="flex flex-col md:flex-row items-start w-full justify-center gap-4">
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
                                    <option value="10:00 AM">10:00 AM</option>
                                    <option value="11:00 AM">11:00 AM</option>
                                    <option value="12:00 PM">12:00 PM</option>
                                    <option value="1:00 PM">1:00 PM</option>
                                    <option value="2:00 PM">2:00 PM</option>
                                    <option value="3:00 PM">3:00 PM</option>
                                    <option value="4:00 PM">4:00 PM</option>
                                    <option value="5:00 PM">5:00 PM</option>
                                    <option value="6:00 PM">6:00 PM</option>
                                    <option value="7:00 PM">7:00 PM</option>
                                    <option value="8:00 PM">8:00 PM</option>
                                </select>
                            </div>
                        </div>

                        {/* Medical intake */}
                        <div className="col-span-full space-y-4 pt-4">
                            {/* Voice Intake Mic Button below waveform */}
                            <div className="mb-4">
                                {/* <VoiceIntake setForm={setMedicalForm} onTranscript={onTranscript} vapi={vapi} onUserSpeaking={handleUserSpeaking} /> */}
                                {/* Button now commented out and only visible in right-side box */}
                            </div>
                            <h2 className="text-lg font-semibold text-customGray">Medical Information</h2>
                            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                                {/* Move Reason for Visit, Location, Severity before Number of Pregnancies/Birth Control */}
                                <Input
                                    label="Reason for Visit"
                                    placeholder="Describe your main concern"
                                    breakpoint={true}
                                    onChange={(val) => handleMedicalChange('chief_complaint', val)}
                                    value={medicalForm.chief_complaint}
                                />
                                <div className="flex flex-col items-start w-full justify-center">
                                    <label className="text-[16px] text-customGray font-poppins font-bold">how long are you feeling this?</label>
                                    <input
                                        type="date"
                                        value={onsetDate ? onsetDate.toISOString().split('T')[0] : ''}
                                        onChange={e => handleOnsetDateChange(e.target.value ? new Date(e.target.value) : null)}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full h-[46px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
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
                                        className="w-full h-[46px] border-[1px] border-[#E0E0E0] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                        value={medicalForm.severity}
                                        onChange={e => handleMedicalChange('severity', e.target.value)}
                                    >
                                        <option value="">Select</option>
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
                                {/* Female: Last Mammogram (40+) */}
                                {(sex === 'Female' && dob && (() => {
                                    const age = moment().diff(moment(dob), 'years');
                                    return age >= 40;
                                })()) && (
                                    <div className="flex flex-col items-start w-full justify-center">
                                        <label className="text-[16px] text-customGray font-poppins font-bold mb-2">Last Mammogram:</label>
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
                                                            updated = reliefSelect.filter((item: string) => item !== opt);
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
                                                {opt}
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
                                            Yes
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
                                            No
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
                                    <label className="text-[16px] text-customGray font-poppins font-bold mb-2">Allergies:</label>
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
                                            Yes
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
                                            No
                                        </label>
                                    </div>
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
                                                className="custom-checkbox-orange"
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
                            <Button
                                text={t("button_label")}
                                size={{ width: "250px", height: "50px" }}
                                route={""}
                                bgColor={"#FF7A00"}
                                textColor={"#ffffff"}
                                onClick={() => {
                                    submitAppointmentDetails();
                                }}
                            />
                        </div>

                    </section>


                <section
                    className="rounded-lg flex flex-col gap-8 pt-6"
                    style={{
                        width: '100%',
                        maxWidth: '420px',
                        minHeight: '300px',
                        backgroundColor: '#2f3e46',
                        boxSizing: 'border-box',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                        paddingBottom: '16px',
                        overflow: 'hidden',
                    }}
                >
                    <div className="w-full h-32 rounded-md flex items-center justify-center text-black text-lg mt-8" style={{ backgroundColor: '#EAEAEA' }}>
                            <div className="w-full rounded-md flex flex-col items-start justify-start p-4" style={{ backgroundColor: '#F8F9FA', boxSizing: 'border-box' }}>
                                <div className="flex items-center mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 24 24" fill="#49505A" className="mr-2"><path d="M12 17a4 4 0 0 0 4-4v-5a4 4 0 0 0-8 0v5a4 4 0 0 0 4 4zm5-4v-1h2v1a7 7 0 0 1-14 0v-1h2v1a5 5 0 0 0 10 0zm-5 6h2v2h-2v-2z"/></svg>
                                    <span className="text-2xl font-semibold text-[#49505A]">Voice Intake</span>
                                </div>
                                <hr className="w-full border-t border-[#E5E7EB] mb-4" />
                                   <p className="text-center w-full text-lg text-[#49505A] mb-4">Click the button below and speak to fill the form automatically</p>
                                   {/* Start Voice Intake Button */}
                                <button
                                    type="button"
                                    className="flex items-center gap-3 px-8 py-3 rounded-full text-white font-semibold text-lg mx-auto mb-2 shadow-md"
                                    style={{
                                        background: 'linear-gradient(90deg, #ff7a00 0%, #ff3c00 100%)',
                                        boxShadow: '0 2px 8px 0 rgba(255,122,0,0.10)',
                                        border: 'none',
                                        outline: 'none',
                                        transition: 'background 0.2s',
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 17a4 4 0 0 0 4-4v-5a4 4 0 0 0-8 0v5a4 4 0 0 0 4 4zm5-4v-1h2v1a7 7 0 0 1-14 0v-1h2v1a5 5 0 0 0 10 0zm-5 6h2v2h-2v-2z" fill="#fff"/></svg>
                                    Start Voice Intake
                                </button>
                            </div>
                    </div>
                    <div className="w-full h-32 bg-[#37434a] rounded-md flex items-center justify-center text-white text-lg mt-2" style={{ outline: '2px solid yellow', outlineOffset: '-2px', boxSizing: 'border-box' }}>
                        Second Box (yellow outline)
                    </div>
                </section>

</section>


                </div>
            </div>

        </div></>
    );
},);


export default Self_Appointment