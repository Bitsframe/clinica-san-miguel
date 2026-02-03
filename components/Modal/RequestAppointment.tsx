
"use client";
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

const RadioButton = ({ value, name, label, checked, onChange }: any) => (
  <div className="flex items-center justify-start gap-2 cursor-pointer group">
    <input
      type="radio"
      value={value}
      name={name}
      checked={checked}
      onChange={onChange}
      className="w-5 h-5 text-[#C1001F] border-gray-300 focus:ring-[#C1001F] cursor-pointer"
    />
    <label className="text-sm sm:text-base text-customGray font-poppins cursor-pointer group-hover:text-black transition-colors">{label}</label>
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
  <div className="flex flex-col gap-2 w-full">
    <label className="text-sm sm:text-base text-customGray font-poppins font-bold">
      {label}:
    </label>
    <div className="flex flex-wrap gap-4">
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
  onChange,
  max = undefined
}: {
  label: string;
  placeholder: string;
  breakpoint: boolean;
  value: string;
  onChange: (value: string) => void;
  max?: number | undefined;
}) => (
  <div className={`flex flex-col items-start w-full ${breakpoint ? "md:w-1/2" : ""}`}>
    <label className="text-sm sm:text-base text-customGray font-poppins font-bold mb-1">
      {label}:
    </label>
    <input
      maxLength={max || undefined}
      autoCorrect="on"
      spellCheck={true}
      placeholder={placeholder}
      className="w-full h-11 border border-gray-300 text-sm sm:text-base text-black placeholder:text-gray-400 px-4 bg-white outline-none rounded-lg focus:ring-1 focus:ring-[#C1001F] focus:border-[#C1001F] transition-all"
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
}) => (
  <div className={`flex flex-col items-start w-full ${breakpoint ? "md:w-1/2" : ""}`}>
    <label className="text-sm sm:text-base text-customGray font-poppins font-bold mb-1">
      {label}:
    </label>
    <ReactDatePicker
      selected={value}
      onChange={(date: Date | null) => onChange(date)}
      placeholderText={placeholder}
      dateFormat="yyyy-MM-dd"
      maxDate={maxDate || undefined}
      className="w-full h-11 border border-gray-300 text-sm sm:text-base text-black px-4 bg-white outline-none rounded-lg focus:ring-1 focus:ring-[#C1001F] focus:border-[#C1001F]"
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
    <label className="text-sm sm:text-base text-customGray font-poppins font-bold mb-1">
      {label}:
    </label>
    <select
      className="w-full h-11 border border-gray-300 text-sm sm:text-base text-black px-4 bg-white outline-none rounded-lg focus:ring-1 focus:ring-[#C1001F] focus:border-[#C1001F]"
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
    handleOnsetDateChange, selectDateTimeSlotHandle, submitAppointmentDetails
  } = useRequestAppointmentLogic({
    detailedData, locationID, locale, handleClose, visitType, patientType: [], genderOptions,
  });

  // --- ENHANCED VALIDATION LOGIC ---
  const validateCurrentPage = () => {
    const missingFields: string[] = [];

    if (page === 1) {
      if (!firstName.trim()) missingFields.push("First Name");
      if (!lastName.trim()) missingFields.push("Last Name");
      if (!email.trim()) missingFields.push("Email Address");
      if (!phone.trim()) missingFields.push("Mobile Number");
      if (!dob) missingFields.push("Date of Birth");
      if (!sex) missingFields.push("Gender");
      if (!state) missingFields.push("State");
      if (!zipcode.trim()) missingFields.push("Zipcode");
      if (!street_address.trim()) missingFields.push("Street Address");
      if (!service) missingFields.push("Service Type");
      if (!scheduleDate) missingFields.push("Schedule Date");
      if (!scheduleSlot) missingFields.push("Schedule Time");
    } else {
      // Logic for subsequent medical info pages
      if (!(medicalForm as any).reason_for_visit?.trim()) missingFields.push("Reason for Visit");
      if (!(medicalForm as any).symptom_details?.trim()) missingFields.push("Symptom Details");
    }

    if (missingFields.length > 0) {
      toast.warning(`Please fill in the following fields: ${missingFields.join(", ")}`);
      return false;
    }
    return true;
  };

  return (
    <Modal show={openModal} onClose={handleClose} popup size="2xl" className="bg-black/60">
      <div className="bg-[#F8F5F0] rounded-xl overflow-hidden flex flex-col shadow-2xl">
        <Modal.Header className="border-b border-gray-200 px-6 py-4">
          <span className="text-xl sm:text-2xl font-bold text-[#C1001F] font-poppins tracking-tight">
            {t("form_title")}
          </span>
        </Modal.Header>

        <Modal.Body className="overflow-y-auto scrollbar-hide">
          <div className="py-4 sm:py-6 min-h-[480px] sm:min-h-[550px] flex flex-col">
            {page === 1 && (
              <div className="flex flex-col gap-6">
                <RadioButtons name="visit type" options={visitType} label={t("form_f1")} onChange={setInOfficePatient} selectedValue={inOfficePatient} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label={t("form_f3")} placeholder="John" breakpoint={false} onChange={setFirstName} value={firstName} />
                  <Input label={t("form_f4")} placeholder="Doe" breakpoint={false} onChange={setLastName} value={lastName} />
                </div>

                <Input label={t("form_f5")} placeholder="email@example.com" breakpoint={false} onChange={setEmail} value={email} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PhoneNumberInput label={t("form_f6")} placeholder="+1 (555) 000-0000" breakpoint={false} onChange={setPhone} value={phone} />
                  <DatePicker label={t("form_f7")} placeholder="YYYY-MM-DD" breakpoint={false} onChange={setDob} value={dob} maxDate={new Date()} />
                </div>

                <RadioButtons name="gender" options={genderOptions} label={t("form_f8")} onChange={setSex} selectedValue={sex} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <Label className="font-bold mb-1 text-sm sm:text-base">State</Label>
                    <Select className="bg-white" onChange={(e) => setState(e.target.value)} value={state} required>
                      <option disabled value=''>Select State</option>
                      {usStates?.map(({ value, name }, index) => (<option key={index} value={name}>{`${name} - ${value}`}</option>))}
                    </Select>
                  </div>
                  <Input breakpoint={false} max={5} label='Zipcode' value={zipcode} onChange={setzipcode} placeholder='77015' />
                  <div className="sm:col-span-2">
                    <Input breakpoint={false} label='Street Address' value={street_address} onChange={setStreet_address} placeholder='123 Clinic St' />
                  </div>
                </div>

                <div className="w-full bg-white p-4 rounded-lg border border-gray-200">
                   <ScheduleDateTime data={detailedData[0]} selectDateTimeSlotHandle={selectDateTimeSlotHandle} initialDate={scheduleDate} initialSlot={scheduleSlot} locationID={locationID} />
                </div>

                <Dropdown label={t("form_f10")} options={servicesState} breakpoint={false} onChange={setService} value={service} />

                <div className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input className="mt-1 rounded text-[#C1001F] focus:ring-[#C1001F]" checked={email_opt} onChange={(e) => setEmail_opt(e.target.checked)} type="checkbox" />
                    <span className="text-xs text-gray-600 leading-tight">I agree to receive email updates from Clinica San Miguel.</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input className="mt-1 rounded text-[#C1001F] focus:ring-[#C1001F]" checked={text_opt} onChange={(e) => setText_opt(e.target.checked)} type="checkbox" />
                    <span className="text-xs text-gray-600 leading-tight">I agree to receive SMS notifications and reminders.</span>
                  </label>
                </div>
              </div>
            )}

            {page >= 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                {(() => {
                  const pageIndex = page - 2;
                  const start = pageIndex * perPage;
                  const pageFields = medicalFields.slice(start, start + perPage);
                  const elems: any[] = [];

                  if (pageIndex === 0) {
                    elems.push(
                      <div key="family_history" className="col-span-1 md:col-span-2 flex flex-col gap-3">
                        <label className="text-sm font-bold">Family History</label>
                        <div className="flex flex-wrap gap-2">
                          {['hypertension', 'diabetes', 'cancer', 'heart_disease', 'unknown'].map((item) => (
                            <label key={item} className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                              <input type="checkbox" className="rounded text-[#C1001F]" checked={(medicalForm as any).family_history?.[item] || false} onChange={(e) => handleFamilyHistoryChange(item, e.target.checked)} />
                              <span className="text-sm capitalize">{item.replace('_', ' ')}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  pageFields.forEach((f) => {
                    let elem = null;
                      if (f.key === 'onset') {
                        elem = <div key={f.key} className="w-full"><DatePicker label={f.label} placeholder="Onset date" breakpoint={false} value={onsetDate} onChange={handleOnsetDateChange} maxDate={new Date()} /></div>;
                      } else if (f.key === 'severity') {
                        elem = <Dropdown key={f.key} label={f.label} options={["1","2","3","4","5","6","7","8","9","10"]} breakpoint={false} value={medicalForm.severity} onChange={v => handleMedicalChange(f.key, v)} />;
                      } else if (f.key === 'relieving_factors') {
                      elem = (
                         <div key={f.key} className="col-span-1 md:col-span-2 flex flex-col gap-3">
                            <label className="font-bold">{f.label}:</label>
                            <div className="flex flex-wrap gap-2">
                              {['Rest', 'Ice', 'Heat', 'Medication', 'Stretching', 'Other'].map((opt) => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                                  <input type="checkbox" className="rounded text-[#C1001F]" checked={Array.isArray(medicalForm.relieving_factors) ? medicalForm.relieving_factors.includes(opt) : false} 
                                    onChange={e => {
                                      let newArr = Array.isArray(medicalForm.relieving_factors) ? [...medicalForm.relieving_factors] : [];
                                      e.target.checked ? newArr.push(opt) : newArr = newArr.filter(item => item !== opt);
                                      setMedicalForm(prev => ({ ...prev, relieving_factors: newArr }));
                                    }} 
                                  />
                                  <span className="text-sm">{opt}</span>
                                </label>
                              ))}
                            </div>
                         </div>
                      );
                    } else if (f.key === 'surgeries' || f.key === 'allergies') {
                      const isSurgery = f.key === 'surgeries';
                      const choice = isSurgery ? surgeryChoice : allergyChoice;
                      const setChoice = isSurgery ? setSurgeryChoice : setAllergyChoice;
                      elem = (
                        <div key={f.key} className="w-full flex flex-col gap-3">
                           <label className="font-bold">{f.label}:</label>
                           <div className="flex gap-6">
                              {['Yes', 'No'].map(o => (
                                <label key={o} className="flex items-center gap-2 cursor-pointer">
                                  <input type="radio" checked={choice === o} onChange={() => setChoice(o as any)} className="w-5 h-5 text-[#C1001F]" /> 
                                  <span className="text-sm">{o}</span>
                                </label>
                              ))}
                           </div>
                           {choice === 'Yes' && <Input label={`Details`} breakpoint={false} placeholder="Describe..." value={(medicalForm as any)[f.key]} onChange={(v) => handleMedicalChange(f.key, v)} />}
                        </div>
                      );
                    } else {
                      elem = <Input key={f.key} label={f.label} placeholder="Enter details..." breakpoint={false} value={(medicalForm as any)[f.key]} onChange={(v: string) => handleMedicalChange(f.key, v)} />;
                    }
                    if (elem) elems.push(elem);
                  });
                  return elems;
                })()}
              </div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer className="border-t border-gray-200 px-6 py-4 flex flex-row items-center gap-4 bg-white">
          <div className="w-1/3">
            {page > 1 && <Button text={"Back"} size={{ width: "100%", height: "48px" }} bgColor={"#E5E7EB"} textColor={"#000000"} onClick={() => setPage(page - 1)} />}
          </div>

          <div className="flex-1">
            {page < totalPages ? (
              <Button
                text={"Next"}
                size={{ width: "100%", height: "48px" }}
                bgColor={"#C1001F"}
                textColor={"#ffffff"}
                onClick={() => {
                  if (validateCurrentPage()) {
                    setPage(page + 1);
                  }
                }}
              />
            ) : (
              <Button
                text={t("button_label")}
                size={{ width: "100%", height: "48px" }}
                bgColor={"#C1001F"}
                textColor={"#ffffff"}
                disabled={isSubmitting}
                onClick={() => {
                   if (validateCurrentPage()) {
                     submitAppointmentDetails();
                   }
                }}
              />
            )}
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};