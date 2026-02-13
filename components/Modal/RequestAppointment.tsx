
"use client";
import React, { useEffect, useRef } from "react";
import { Label, Modal, Select } from "flowbite-react";
import { useLocale, useTranslations } from "next-intl";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import ScheduleDateTime from "./ScheduleDateTime";
import { usStates } from "@/utils/us-states";
import PhoneNumberInput from "../PhoneNumberInput";
import { styles } from "../../app/[locale]/styles";
import { Button } from "../../utils/Button";
import { useRequestAppointmentLogic, medicalFields, perPage } from "./logic";
import { useState } from "react";
import { extractStateZip } from "@/utils/addressExtractor";

const RadioButton = ({ value, name, label, checked, onChange, disabled }: any) => (
  <div className={`flex items-center justify-start gap-2 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} group`}>
    <input
      type="radio"
      value={value}
      name={name}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={`w-5 h-5 text-[#C1001F] border-gray-300 focus:ring-[#C1001F] ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    />
    <label className={`text-sm sm:text-base text-customGray font-poppins ${disabled ? 'cursor-not-allowed' : 'cursor-pointer group-hover:text-black'} transition-colors`}>{label}</label>
  </div>
);

const RadioButtons = ({
  name,
  options,
  label,
  selectedValue,
  onChange,
  disabledOptions = [],
}: {
  name: string;
  options: string[];
  label: string;
  selectedValue: string;
  onChange: (value: string) => void;
  disabledOptions?: string[];
}) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs sm:text-sm md:text-base text-customGray font-poppins font-bold">
      {label}:
    </label>
    <div className="flex flex-wrap gap-3 sm:gap-4">
      {options.map((value, index) => (
        <RadioButton
          key={index}
          value={value}
          name={name}
          label={value}
          checked={selectedValue === value}
          onChange={() => onChange(value)}
          disabled={disabledOptions.includes(value)}
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
  onChange,
  max = undefined
}: {
  label: string | React.ReactNode;
  placeholder: string;
  breakpoint: boolean;
  value: string;
  onChange: (value: string) => void;
  max?: number | undefined;
}) => (
  <div className={`flex flex-col items-start w-full ${breakpoint ? "md:w-1/2" : ""}`}>
    <label className="text-xs sm:text-sm md:text-base text-customGray font-poppins font-bold mb-1">
      {label}
    </label>
    <input
      maxLength={max || undefined}
      autoCorrect="on"
      spellCheck={true}
      placeholder={placeholder}
      className="w-full h-10 sm:h-11 border border-gray-300 text-sm sm:text-base text-black placeholder:text-gray-400 px-3 sm:px-4 bg-white outline-none rounded-lg focus:ring-1 focus:ring-[#C1001F] focus:border-[#C1001F] transition-all"
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
  maxDate,
}: {
  label: string;
  placeholder: string;
  breakpoint: boolean;
  value: Date | null;
  onChange: (value: Date | null) => void;
  maxDate?: Date | null;
}) => {
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());

  const currentYear = new Date().getFullYear();
  const startYear = 1900;
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleYearSelect = (year: number) => {
    const newDate = new Date(tempDate);
    newDate.setFullYear(year);
    setTempDate(newDate);
    setShowYearPicker(false);
    setShowMonthPicker(true);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(tempDate);
    newDate.setMonth(monthIndex);
    setTempDate(newDate);
    setShowMonthPicker(false);
  };

  return (
    <div className={`flex flex-col items-start w-full ${breakpoint ? "md:w-1/2" : ""}`}>
      <label className="text-sm sm:text-base text-customGray font-poppins font-bold mb-1">
        {label}:
      </label>
      <div className="relative w-full">
        <ReactDatePicker
          selected={value}
          onChange={(date: Date | null) => {
            onChange(date);
            if (date) setTempDate(date);
          }}
          placeholderText={placeholder}
          dateFormat="yyyy-MM-dd"
          maxDate={maxDate || undefined}
          onCalendarOpen={() => {
            setShowYearPicker(false);
            setShowMonthPicker(false);
          }}
          className="w-full h-11 border border-gray-300 text-sm sm:text-base text-black px-4 bg-white outline-none rounded-lg focus:ring-1 focus:ring-[#C1001F] focus:border-[#C1001F]"
          calendarClassName={showYearPicker || showMonthPicker ? "hide-calendar-body" : ""}
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div>
              {!showYearPicker && !showMonthPicker && (
                <div className="flex items-center justify-between px-2 py-2">
                  <button
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    type="button"
                    className="text-white hover:bg-white/10 rounded p-1 transition-colors"
                  >
                    <span className="text-xl font-bold">{"<"}</span>
                  </button>
                  <div className="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowMonthPicker(true)}
                      className="text-white font-semibold text-base hover:bg-white/10 px-3 py-1 rounded transition-colors"
                    >
                      {date.toLocaleString('en-US', { month: 'long' })}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowYearPicker(true)}
                      className="text-white font-semibold text-base hover:bg-white/10 px-3 py-1 rounded transition-colors"
                    >
                      {date.getFullYear()}
                    </button>
                  </div>
                  <button
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    type="button"
                    className="text-white hover:bg-white/10 rounded p-1 transition-colors"
                  >
                    <span className="text-xl font-bold">{">"}</span>
                  </button>
                </div>
              )}
              
              {showYearPicker && (
                <div className="bg-[#C1001F] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-semibold text-base">Select Year</span>
                    <button
                      type="button"
                      onClick={() => setShowYearPicker(false)}
                      className="text-white hover:bg-white/10 px-2 py-1 rounded text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {showMonthPicker && (
                <div className="bg-[#C1001F] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMonthPicker(false);
                        setShowYearPicker(true);
                      }}
                      className="text-white hover:bg-white/10 px-2 py-1 rounded text-sm"
                    >
                      ← {tempDate.getFullYear()}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMonthPicker(false)}
                      className="text-white hover:bg-white/10 px-2 py-1 rounded text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        >
          {showYearPicker && (
            <div className="bg-white p-4 grid grid-cols-3 gap-2 max-h-64 overflow-y-auto absolute top-0 left-0 right-0 z-10" style={{ marginTop: '0' }}>
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => handleYearSelect(year)}
                  className={`p-2 rounded text-sm font-medium transition-colors ${
                    year === tempDate.getFullYear()
                      ? 'bg-[#C1001F] text-white'
                      : 'hover:bg-[#ffe6eb] text-gray-700'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {showMonthPicker && (
            <div className="bg-white p-4 grid grid-cols-3 gap-2 absolute top-0 left-0 right-0 z-10 min-h-[280px]" style={{ marginTop: '0' }}>
              {months.map((month, index) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => handleMonthSelect(index)}
                  className={`p-3 rounded text-sm font-medium transition-colors ${
                    index === tempDate.getMonth()
                      ? 'bg-[#C1001F] text-white'
                      : 'hover:bg-[#ffe6eb] text-gray-700'
                  }`}
                >
                  {month.substring(0, 3)}
                </button>
              ))}
            </div>
          )}
        </ReactDatePicker>
      </div>
    </div>
  );
};

const Dropdown = ({
  label,
  options,
  breakpoint,
  value,
  onChange,
}: {
  label: string;
  options: string[] | null | undefined;
  breakpoint: boolean;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className={`flex flex-col items-start w-full ${breakpoint ? "md:w-1/2" : ""}`}>
    <label className="text-xs sm:text-sm md:text-base text-customGray font-poppins font-bold mb-1">
      {label}:
    </label>
    <select
      className="w-full h-10 sm:h-11 border border-gray-300 text-sm sm:text-base text-black px-3 sm:px-4 bg-white outline-none rounded-lg focus:ring-1 focus:ring-[#C1001F] focus:border-[#C1001F]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" disabled>Select {label}</option>
      {options?.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export const RequestAppointment = ({
  detailedData,
  locationID,
  openModal,
  handleClose,
}: {
  detailedData: any;
  locationID: number;
  openModal: boolean;
  handleClose: any;
}) => {
  const t = useTranslations("appoinment_form");
  const locale = useLocale();

  const visitType = [t("form_f1a"), t("form_f1b")];
  const genderOptions = [t("form_f8a"), t("form_f8b"), t("form_f8c")];

  const {
    firstName, lastName, email, dob, sex, state, zipcode, street_address,
    service, phone, inOfficePatient, date_and_time, email_opt, text_opt,
    page, isSubmitting, onsetDate, reliefOther, surgeryChoice, allergyChoice,
    medicalForm, scheduleDate, scheduleSlot, servicesState, totalPages,
    setFirstName, setLastName, setEmail, setDob, setSex, setState, setzipcode,
    setStreet_address, setService, setPhone, setInOfficePatient, setPage,
    setEmail_opt, setText_opt, setReliefOther, setSurgeryChoice, setAllergyChoice,
    setMedicalForm, handleMedicalChange, handleFamilyHistoryChange, handleBooleanFieldChange,
    handleOnsetDateChange, selectDateTimeSlotHandle, submitAppointmentDetails, resetForm
  } = useRequestAppointmentLogic({
    detailedData, locationID, locale, handleClose, visitType, patientType: [], genderOptions,
  });

  // Set default visit type to In-Office Visit
  React.useEffect(() => {
    if (!inOfficePatient && visitType.length > 0) {
      setInOfficePatient(visitType[0]);
    }
  }, [visitType, inOfficePatient, setInOfficePatient]);

  // SmartyStreets Integration State
  const [isSmartyIntegrated, setIsSmartyIntegrated] = useState<boolean | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const addressFetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Computed values for address suggestions
  const visibleAddressSuggestions = addressSuggestions.filter(Boolean);
  const showAddressSuggestions = visibleAddressSuggestions.length > 0;

  // Check SmartyStreets integration status on mount
  useEffect(() => {
    const checkSmartyIntegration = async () => {
      try {
        const response = await fetch("/api/address/status");
        console.log("[SmartyStreets] Status response:", response.ok, response.status);
        if (!response.ok) {
          setIsSmartyIntegrated(false);
          return;
        }
        const data = await response.json();
        console.log("[SmartyStreets] Status data:", data);
        setIsSmartyIntegrated(data.integrated);
      } catch (error) {
        console.error("Error checking SmartyStreets integration:", error);
        setIsSmartyIntegrated(false);
      }
    };
    checkSmartyIntegration();
  }, []);

  // Fetch address suggestions with debouncing
  useEffect(() => {
    // Clear previous timeout
    if (addressFetchTimeoutRef.current) {
      clearTimeout(addressFetchTimeoutRef.current);
    }

    const query = street_address.trim();
    console.log("[SmartyStreets] Address changed:", { query, length: query.length, isSmartyIntegrated });

    // Don't fetch if query is too short
    // Temporarily removed: || isSmartyIntegrated === false
    if (!query || query.length < 4) {
      setAddressSuggestions([]);
      console.log("[SmartyStreets] Skipping fetch:", { 
        noQuery: !query, 
        tooShort: query.length < 4
      });
      return;
    }

    console.log("[SmartyStreets] Setting timeout for address fetch...");

    // Debounce: Wait 300ms after user stops typing
    addressFetchTimeoutRef.current = setTimeout(async () => {
      console.log("[SmartyStreets] Fetching suggestions for:", query);
      try {
        const response = await fetch("/api/address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: query })
        });

        console.log("[SmartyStreets] API response:", response.ok, response.status);

        if (!response.ok) {
          setAddressSuggestions([]);
          return;
        }

        const data = await response.json();
        console.log("[SmartyStreets] Suggestions received:", data);
        setAddressSuggestions(Array.isArray(data?.suggestions) ? data.suggestions : []);
      } catch (error) {
        console.error("Error fetching address recommendations:", error);
        setAddressSuggestions([]);
      }
    }, 300);

    // Cleanup on unmount
    return () => {
      if (addressFetchTimeoutRef.current) {
        clearTimeout(addressFetchTimeoutRef.current);
      }
    };
  }, [street_address, isSmartyIntegrated]);

  // Handle address suggestion click
  const handleAddressSuggestionClick = (suggestion: string) => {
    // Store the full address in the street_address field (no extraction for UI)
    setStreet_address(suggestion);
    
    // Extract state and zipcode for backend submission (hidden from user)
    const extracted = extractStateZip(suggestion);
    if (extracted) {
      setState(extracted.state);
      setzipcode(extracted.zip);
    }

    setAddressSuggestions([]); // Clear suggestions

    // Clear timeout to prevent refetch
    if (addressFetchTimeoutRef.current) {
      clearTimeout(addressFetchTimeoutRef.current);
      addressFetchTimeoutRef.current = null;
    }
  };

  // --- ENHANCED VALIDATION LOGIC ---
  const validateCurrentPage = () => {
    const missingFields: string[] = [];

    if (!firstName.trim()) missingFields.push("First Name");
    if (!lastName.trim()) missingFields.push("Last Name");
    if (!email.trim()) missingFields.push("Email Address");
    if (!phone.trim()) missingFields.push("Mobile Number");
    if (!dob) missingFields.push("Date of Birth");
    if (!sex) missingFields.push("Gender");
    if (!street_address.trim()) missingFields.push("Street Address");
    if (!service) missingFields.push("Service Type");
    if (!scheduleDate) missingFields.push("Schedule Date");
    if (!scheduleSlot) missingFields.push("Schedule Time");

    if (missingFields.length > 0) {
      toast.warning(`Please fill in the following fields: ${missingFields.join(", ")}`);
      return false;
    }
    return true;
  };

  return (
    <Modal show={openModal} onClose={() => {
      resetForm();
      handleClose();
    }} popup size="2xl" className="bg-black/60 p-2 sm:p-4">
      <div className="bg-[#F8F5F0] rounded-xl overflow-hidden flex flex-col shadow-2xl max-h-[90vh] sm:max-h-[85vh]">
        <Modal.Header className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 bg-[#F8F5F0] z-10">
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#C1001F] font-poppins tracking-tight">
            {t("form_title")}
          </span>
        </Modal.Header>

        <Modal.Body className="overflow-y-auto scrollbar-hide flex-1">
          <div className="py-3 sm:py-4 md:py-6 px-2 sm:px-0 flex flex-col">
            {page === 1 && (
              <div className="flex flex-col gap-4 sm:gap-6">
                <RadioButtons name="visit type" options={visitType} label={t("form_f1")} onChange={setInOfficePatient} selectedValue={inOfficePatient} disabledOptions={[t("form_f1b")]} />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Input label={t("form_f3")} placeholder="John" breakpoint={false} onChange={setFirstName} value={firstName} />
                  <Input label={t("form_f4")} placeholder="Doe" breakpoint={false} onChange={setLastName} value={lastName} />
                </div>

                <Input label={t("form_f5")} placeholder="email@example.com" breakpoint={false} onChange={setEmail} value={email} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <PhoneNumberInput label={t("form_f6")} placeholder="(555) 000-0000" breakpoint={false} onChange={setPhone} value={phone} />
                  <DatePicker label={t("form_f7")} placeholder="YYYY-MM-DD" breakpoint={false} onChange={setDob} value={dob} maxDate={new Date()} />
                </div>

                <RadioButtons name="gender" options={genderOptions} label={t("form_f8")} onChange={setSex} selectedValue={sex} />

                <div className="relative">
                  {/* Dropdown Icon */}
                  {showAddressSuggestions && (
                    <div className="absolute right-4 top-[46px] pointer-events-none z-10">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Street Address Input with Status */}
                  <Input 
                    breakpoint={false} 
                    label={
                      <span className="flex flex-wrap items-center gap-2">
                        <span>Street Address</span>
                        {isSmartyIntegrated !== null && !isSmartyIntegrated && (
                          <span className="text-xs font-semibold text-red-600">
                            (Manual entry)
                          </span>
                        )}
                      </span>
                    } 
                    value={street_address} 
                    onChange={setStreet_address} 
                    placeholder='123 Clinic St' 
                  />

                  {/* Address Suggestions Dropdown */}
                  {showAddressSuggestions && (
                    <ul className="absolute left-0 right-0 top-full mt-1 w-full border border-gray-300 rounded-lg bg-white max-h-48 overflow-auto z-50 shadow-lg">
                      {visibleAddressSuggestions.map((suggestion, index) => (
                        <li
                          key={`${suggestion}-${index}`}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 cursor-pointer hover:bg-gray-100 transition-colors text-sm"
                          onClick={() => handleAddressSuggestionClick(suggestion)}
                        >
                          <span className="text-gray-800">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="w-full bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                   <ScheduleDateTime data={detailedData[0]} selectDateTimeSlotHandle={selectDateTimeSlotHandle} initialDate={scheduleDate} initialSlot={scheduleSlot} locationID={locationID} />
                </div>

                <Dropdown label={t("form_f10")} options={servicesState} breakpoint={false} onChange={setService} value={service} />

                <div className="space-y-2 sm:space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <label className="flex items-start gap-2 sm:gap-3 cursor-pointer group">
                    <input className="mt-0.5 sm:mt-1 rounded text-[#C1001F] focus:ring-[#C1001F] flex-shrink-0" checked={email_opt} onChange={(e) => setEmail_opt(e.target.checked)} type="checkbox" />
                    <span className="text-xs sm:text-sm text-gray-600 leading-tight">I agree to receive email updates from Clinica San Miguel.</span>
                  </label>
                  <label className="flex items-start gap-2 sm:gap-3 cursor-pointer group">
                    <input className="mt-0.5 sm:mt-1 rounded text-[#C1001F] focus:ring-[#C1001F] flex-shrink-0" checked={text_opt} onChange={(e) => setText_opt(e.target.checked)} type="checkbox" />
                    <span className="text-xs sm:text-sm text-gray-600 leading-tight">I agree to receive SMS notifications and reminders.</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer className="border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-row items-center justify-center bg-white sticky bottom-0">
          <div className="w-full sm:max-w-md">
            <Button
              text={t("button_label")}
              size={{ width: "100%", height: "44px" }}
              bgColor={"#C1001F"}
              textColor={"#ffffff"}
              disabled={isSubmitting}
              onClick={() => {
                if (validateCurrentPage()) {
                  submitAppointmentDetails();
                }
              }}
            />
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};