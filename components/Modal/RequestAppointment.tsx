
"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { Label, Modal, Select } from "flowbite-react";
import { useLocale, useTranslations } from "next-intl";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import ScheduleDateTime from "./ScheduleDateTime";
import { usStates } from "@/utils/us-states";
import PhoneNumberInput from "../PhoneNumberInput";
import { useRequestAppointmentLogic, medicalFields, perPage } from "./logic";
import { useState } from "react";
import { extractStateZip } from "@/utils/addressExtractor";
import CustomDatePicker from "../CustomDatePicker";
import { CalendarDays, Loader2, MapPin } from "lucide-react";

const FormSection = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-gray-100 bg-[#FAFAFA] p-4 sm:p-5 space-y-4">
    {title && (
      <h3 className="text-sm font-semibold text-[#19192C] font-poppins border-b border-gray-100 pb-2">
        {title}
      </h3>
    )}
    {children}
  </div>
);

const RadioButton = ({ value, name, label, checked, onChange, disabled }: any) => (
  <label
    className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-medium font-poppins transition-colors ${
      checked
        ? "border-[#C1001F] bg-[#C1001F]/10 text-[#C1001F]"
        : "border-gray-200 bg-white text-[#3D3D3C] hover:border-gray-300"
    } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
  >
    <input
      type="radio"
      value={value}
      name={name}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="sr-only"
    />
    {label}
  </label>
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
  <div className="flex flex-col gap-2.5 w-full">
    {label ? (
      <label className="text-sm font-semibold text-[#19192C] font-poppins">{label}</label>
    ) : null}
    <div className="flex flex-wrap gap-2">
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
  max = undefined,
  inputClassName = "",
  ariaBusy = false,
}: {
  label: string | React.ReactNode;
  placeholder: string;
  breakpoint: boolean;
  value: string;
  onChange: (value: string) => void;
  max?: number | undefined;
  inputClassName?: string;
  ariaBusy?: boolean;
}) => (
  <div className={`flex flex-col items-start w-full ${breakpoint ? "md:w-1/2" : ""}`}>
    <label className="text-sm font-semibold text-[#19192C] font-poppins mb-1.5">
      {label}
    </label>
    <input
      maxLength={max || undefined}
      autoCorrect="on"
      spellCheck={true}
      placeholder={placeholder}
      className={`w-full h-11 border border-gray-200 text-sm text-[#19192C] placeholder:text-[#9CA3AF] px-4 bg-white outline-none rounded-xl focus:ring-2 focus:ring-[#C1001F]/20 focus:border-[#C1001F] transition-all shadow-sm ${inputClassName}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-busy={ariaBusy || undefined}
    />
  </div>
);

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
    <label className="text-sm font-semibold text-[#19192C] font-poppins mb-1.5">
      {label}
    </label>
    <select
      className="w-full h-11 border border-gray-200 text-sm text-[#19192C] px-4 bg-white outline-none rounded-xl focus:ring-2 focus:ring-[#C1001F]/20 focus:border-[#C1001F] shadow-sm"
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

  const visitType = useMemo(
    () => [t("form_f1a"), t("form_f1b")],
    [t]
  );
  const genderOptions = useMemo(
    () => [t("form_f8a"), t("form_f8b"), t("form_f8c")],
    [t]
  );
  const selectedLocation = detailedData?.[0];

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

  // Address autocomplete (Mapbox) integration state
  const [isAddressAutocompleteEnabled, setIsAddressAutocompleteEnabled] = useState<boolean | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [isAddressSuggestionsLoading, setIsAddressSuggestionsLoading] = useState(false);
  const isAddressSelectedRef = useRef(false); // Track if user selected from dropdown (ref = no re-render)
  const addressFetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addressContainerRef = useRef<HTMLDivElement>(null);

  // Computed values for address suggestions
  const visibleAddressSuggestions = addressSuggestions.filter(Boolean);
  const showAddressSuggestions = visibleAddressSuggestions.length > 0;

  // Check address autocomplete availability on mount
  useEffect(() => {
    const checkAddressAutocomplete = async () => {
      try {
        const response = await fetch("/api/address/status");
        if (!response.ok) {
          setIsAddressAutocompleteEnabled(false);
          return;
        }
        const data = await response.json();
        setIsAddressAutocompleteEnabled(data.integrated);
      } catch {
        setIsAddressAutocompleteEnabled(false);
      }
    };
    checkAddressAutocomplete();
  }, []);

  // Close address suggestions when clicking outside the address field
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        addressContainerRef.current &&
        !addressContainerRef.current.contains(event.target as Node)
      ) {
        setAddressSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch address suggestions with debouncing
  useEffect(() => {
    if (isAddressSelectedRef.current) {
      isAddressSelectedRef.current = false;
      return;
    }
    
    // Clear previous timeout
    if (addressFetchTimeoutRef.current) {
      clearTimeout(addressFetchTimeoutRef.current);
    }

    const query = street_address.trim();

    if (!query || query.length < 4 || !isAddressAutocompleteEnabled) {
      setAddressSuggestions([]);
      setIsAddressSuggestionsLoading(false);
      return;
    }

    setIsAddressSuggestionsLoading(true);

    // Debounce: Wait 300ms after user stops typing
    addressFetchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch("/api/address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: query })
        });

        const data = await response.json();
        const suggestions = Array.isArray(data?.suggestions) ? data.suggestions : [];
        setAddressSuggestions(suggestions);
      } catch {
        setAddressSuggestions([]);
      } finally {
        setIsAddressSuggestionsLoading(false);
      }
    }, 300);

    // Cleanup on unmount or re-run
    return () => {
      if (addressFetchTimeoutRef.current) {
        clearTimeout(addressFetchTimeoutRef.current);
      }
    };
  }, [street_address, isAddressAutocompleteEnabled]);

  // Handle address suggestion click
  const handleAddressSuggestionClick = (suggestion: string) => {
    // Set flag to prevent refetching (ref avoids triggering re-render → effect loop)
    isAddressSelectedRef.current = true;
    
    // Store the full address in the street_address field (no extraction for UI)
    setStreet_address(suggestion);
    
    // Extract state and zipcode for backend submission (hidden from user)
    const extracted = extractStateZip(suggestion);
    if (extracted) {
      setState(extracted.state);
      setzipcode(extracted.zip);
    }

    setAddressSuggestions([]); // Clear suggestions

    setIsAddressSuggestionsLoading(false);
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
    <Modal
      show={openModal}
      onClose={() => {
        resetForm();
        handleClose();
      }}
      popup
      size="2xl"
      className="bg-black/50 backdrop-blur-sm p-2 sm:p-4"
    >
      <div className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl max-h-[92vh] sm:max-h-[88vh] border border-gray-100">
        <Modal.Header className="border-b border-gray-100 px-5 sm:px-6 py-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C1001F]/10">
              <CalendarDays className="h-5 w-5 text-[#C1001F]" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-[#19192C] font-poppins">
              {t("form_title")}
            </span>
          </div>
        </Modal.Header>

        <Modal.Body className="overflow-y-auto flex-1 bg-white">
          <div className="py-4 sm:py-6 px-4 sm:px-6 flex flex-col">
            {page === 1 && (
              <div className="flex flex-col gap-5">
                {selectedLocation?.title && (
                  <div className="rounded-xl border border-[#C1001F]/20 bg-[#C1001F]/5 px-4 py-3.5 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                      <MapPin className="h-5 w-5 text-[#C1001F]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#C1001F] font-poppins">
                        {t("location_label")}
                      </p>
                      <p className="text-base font-semibold text-[#19192C] font-poppins leading-snug">
                        {selectedLocation.title}
                      </p>
                      {selectedLocation.address && (
                        <p className="text-sm text-[#3D3D3C] font-inter mt-0.5 leading-snug">
                          {selectedLocation.address}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <FormSection title={t("form_f1")}>
                  <RadioButtons
                    name="visit type"
                    options={visitType}
                    label=""
                    onChange={setInOfficePatient}
                    selectedValue={inOfficePatient}
                    disabledOptions={[t("form_f1b")]}
                  />
                </FormSection>

                <FormSection title={`${t("form_f3")} & ${t("form_f4")}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label={t("form_f3")} placeholder="John" breakpoint={false} onChange={setFirstName} value={firstName} />
                    <Input label={t("form_f4")} placeholder="Doe" breakpoint={false} onChange={setLastName} value={lastName} />
                  </div>

                  <Input label={t("form_f5")} placeholder="email@example.com" breakpoint={false} onChange={setEmail} value={email} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <PhoneNumberInput label={t("form_f6")} placeholder="(555) 000-0000" breakpoint={false} onChange={setPhone} value={phone} />
                    <CustomDatePicker
                      label={t("form_f7")}
                      placeholder="YYYY-MM-DD"
                      value={dob}
                      onChange={setDob}
                      maxDate={new Date()}
                    />
                  </div>

                  <RadioButtons name="gender" options={genderOptions} label={t("form_f8")} onChange={setSex} selectedValue={sex} />
                </FormSection>

                <FormSection>
                  <div className="relative" ref={addressContainerRef}>
                    {isAddressSuggestionsLoading && (
                      <div className="absolute right-3 top-[42px] pointer-events-none z-10 flex h-11 items-center">
                        <Loader2 className="h-4 w-4 animate-spin text-[#C1001F]" aria-hidden />
                      </div>
                    )}

                    <Input
                      breakpoint={false}
                      label={
                        <span className="flex flex-wrap items-center gap-2">
                          <span>{t("form_f9")}</span>
                          {isAddressAutocompleteEnabled !== null && !isAddressAutocompleteEnabled && (
                            <span className="text-xs font-medium text-[#6C7582]">(Manual entry)</span>
                          )}
                        </span>
                      }
                      value={street_address}
                      onChange={setStreet_address}
                      placeholder="123 Clinic St"
                      inputClassName={isAddressSuggestionsLoading ? "pr-10" : ""}
                      ariaBusy={isAddressSuggestionsLoading}
                    />

                    {showAddressSuggestions && (
                      <ul className="absolute left-0 right-0 top-full mt-1 w-full border border-gray-200 rounded-xl bg-white max-h-48 overflow-auto z-50 shadow-lg">
                        {visibleAddressSuggestions.map((suggestion, index) => (
                          <li
                            key={`${suggestion}-${index}`}
                            className="w-full px-4 py-3 cursor-pointer hover:bg-[#F8F5F0] transition-colors text-sm text-[#19192C]"
                            onClick={() => handleAddressSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </FormSection>

                <FormSection title={t("location_label")}>
                  <ScheduleDateTime
                    data={detailedData[0]}
                    selectDateTimeSlotHandle={selectDateTimeSlotHandle}
                    initialDate={scheduleDate}
                    initialSlot={scheduleSlot}
                    locationID={locationID}
                  />
                  <Dropdown label={t("form_f10")} options={servicesState} breakpoint={false} onChange={setService} value={service} />
                </FormSection>

                <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      className="mt-0.5 rounded border-gray-300 text-[#C1001F] focus:ring-[#C1001F]"
                      checked={email_opt}
                      onChange={(e) => setEmail_opt(e.target.checked)}
                      type="checkbox"
                    />
                    <span className="text-xs sm:text-sm text-[#3D3D3C] leading-relaxed">{t("email_consent")}</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      className="mt-0.5 rounded border-gray-300 text-[#C1001F] focus:ring-[#C1001F]"
                      checked={text_opt}
                      onChange={(e) => setText_opt(e.target.checked)}
                      type="checkbox"
                    />
                    <span className="text-xs sm:text-sm text-[#3D3D3C] leading-relaxed">{t("sms_consent")}</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer className="border-t border-gray-100 px-4 sm:px-6 py-4 bg-white sticky bottom-0">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              if (validateCurrentPage()) {
                submitAppointmentDetails();
              }
            }}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#C1001F] px-6 py-3.5 text-sm font-semibold font-poppins text-white shadow-sm hover:bg-[#a30019] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t("button_label")}
              </>
            ) : (
              t("button_label")
            )}
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};