"use client";
import { Label, Modal, Select } from "flowbite-react";
import { useLocale, useTranslations } from "next-intl";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import ScheduleDateTime from "./ScheduleDateTime";
import { usStates } from "@/utils/us-states";
import PhoneNumberInput from "../CSAForm/PhoneNumberInput";
import { supabase } from "../../supabaseClient";
import { styles } from "../../app/[locale]/styles";
import { Button } from "../../utils/Button";
import { useRequestAppointmentLogic, medicalFields, perPage } from "./logic";

const RadioButton = ({ value, name, label, checked, onChange }: any) => (
  <div className="flex items-center justify-start gap-3">
    <input
      type="radio"
      value={value}
      name={name}
      checked={checked}
      onChange={onChange}
      className="w-[25px] h-[25px] bg-transparent border-[2px] border-[#d1d5db] hover:bg-[#ccc]"
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
  <div className="flex flex-col md:flex-row items-start justify-start gap-4">
    <label className="text-[16px] text-customGray font-poppins font-bold">
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
  <div
    className={`flex flex-col items-start w-full ${breakpoint ? "md:w-1/2" : ""
      } justify-center`}
  >
    <label className="text-[16px] text-customGray font-poppins font-bold">
      {label}:
    </label>
    <input
      maxLength={max || undefined}
      autoCorrect="on"
      autoComplete="on"
      spellCheck={true}
      autoCapitalize="sentences"
      placeholder={`${placeholder}`}
      className="w-full h-[46px] border-[1px] border-[#d1d5db] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
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
      dateFormat="yyyy-MM-dd"
      popperPlacement="bottom-start"
      maxDate={maxDate}
      className="w-full h-[46px] border-[1px] border-[#d1d5db] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
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
  <div
    className={`flex flex-col items-start w-full ${breakpoint ? "md:w-1/2" : ""
      } justify-center`}
  >
    <label className="text-[16px] text-customGray font-poppins font-bold">
      {label}:
    </label>
    <select
      className="w-full h-[46px] border-[1px] border-[#d1d5db] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
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
  const patientType = [t("form_f2a"), t("form_f2b")];
  const genderOptions = [t("form_f8a"), t("form_f8b"), t("form_f8c")];

  const {
    // State
    firstName,
    lastName,
    email,
    dob,
    sex,
    state,
    zipcode,
    street_address,
    service,
    phone,
    inOfficePatient,
    newPatient,
    date_and_time,
    email_opt,
    text_opt,
    page,
    isSubmitting,
    onsetDate,
    reliefOther,
    reliefSelect,
    surgeryChoice,
    allergyChoice,
    medicalForm,
    scheduleDate,
    scheduleSlot,
    servicesState,
    totalPages,
    // Setters
    setFirstName,
    setLastName,
    setEmail,
    setDob,
    setSex,
    setState,
    setzipcode,
    setStreet_address,
    setService,
    setPhone,
    setInOfficePatient,
    setNewPatient,
    setPage,
    setEmail_opt,
    setText_opt,
    setReliefOther,
    setReliefSelect,
    setSurgeryChoice,
    setAllergyChoice,
    setMedicalForm,
    // Handlers
    handleMedicalChange,
    handleFamilyHistoryChange,
    handleBooleanFieldChange,
    handleOnsetDateChange,
    selectDateTimeSlotHandle,
    submitAppointmentDetails,
    fillTestData,
  } = useRequestAppointmentLogic({
    detailedData,
    locationID,
    locale,
    handleClose,
    visitType,
    patientType,
    genderOptions,
  });
  return (
    <>
      {/* <Button onClick={() => setOpenModal(true)}>Toggle modal</Button> */}
      <Modal
        show={openModal}
        onClose={handleClose}
        position={"center"}
        // size={"lg"}
        color="#F8F5F0"
        className="bg-[#000000] bg-opacity-50 flex justify-center items-center h-screen w-full"
        style={{
          display: "flex",
          justifyContent: "center",
          // alignItems: "center",
          paddingTop: "30px",
          paddingBottom: "30px",
        }}
      >
        <div className="w-full max-w-[650px] rounded-[20px] bg-[#F8F5F0]">
          <Modal.Header>
            <div className="flex w-full items-center justify-between gap-3">
              <h1
                className={`${styles.sectionHeadText} border-b-[1px] border-black px-4 pb-3`}
                style={{ textAlign: "left", color: "#C1001F" }}
              >
                {t("form_title")}
              </h1>
              <button
                type="button"
                onClick={fillTestData}
                className="rounded-md border border-black px-3 py-2 text-sm font-semibold text-black hover:bg-black hover:text-white transition"
              >
                Fill test data
              </button>
            </div>
          </Modal.Header>
          <Modal.Body className="max-h-[660px]">
            {page === 1 && (
              <section className="flex flex-col px-5 justify-start items-start gap-4 p-4">
              <RadioButtons
                name="visit type"
                options={visitType}
                label={t("form_f1")}
                onChange={setInOfficePatient}
                selectedValue={inOfficePatient}
              />
              <RadioButtons
                name="patient type"
                options={patientType}
                label={t("form_f2")}
                onChange={setNewPatient}
                selectedValue={newPatient}
              />
              <article className="flex flex-col md:flex-row justify-center w-full gap-5 items-center">
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
              </article>
              <Input
                label={t("form_f5")}
                placeholder="Your current email address"
                breakpoint={false}
                onChange={setEmail}
                value={email}
              />
              <article className="flex flex-col md:flex-row justify-center w-full gap-5 items-center">

                <div className="flex-1">
                  <PhoneNumberInput
                    label={t("form_f6")}
                    placeholder="ex. +1 (123) 456-7890"
                    breakpoint={false}
                    onChange={setPhone}
                    value={phone}
                  />
                </div>
                <div className="flex-1 ">
                  {/* @ts-ignore */}
                  <DatePicker
                    label={t("form_f7")}
                    placeholder="your date of birth"
                    breakpoint={false}
                    onChange={setDob}
                    value={dob}
                    maxDate={new Date()}
                  />
                </div>
              </article>
              <RadioButtons
                name="gender"
                options={genderOptions}
                label={t("form_f8")}
                onChange={setSex}
                selectedValue={sex}
              />
              <div className='w-full grid grid-cols-2 gap-4'>
                <div className=''>
                  <Label htmlFor='locations' className='font-bold'>
                    State
                  </Label>
                  <Select style={{ backgroundColor: '#f8f5f0', paddingTop: '9px', paddingBottom: '9px' }} className='flex-1 ' sizing='md' onChange={(e: any) => setState(e.target.value)} id="state" required>
                    <option selected disabled value=''>State</option>
                    {usStates?.map(({ value, name }, index: any) => <option key={index} value={name}>{`${name} - ${value}`}</option>)}
                  </Select>
                </div>
                <div className=''>
                  <Input breakpoint={false} max={5} label='Zipcode' value={zipcode} onChange={(e: string) => setzipcode(e)} placeholder='Enter zipcode' />
                </div>
                <div className='col-span-2'>
                  <Input breakpoint={false} label='Street Address' value={street_address} onChange={(e: string) => setStreet_address(e)} placeholder='Enter zipcode' />
                </div>
              </div>
              {/* <Input
                label={t("form_f9")}
                placeholder="enter your address with zip code."
                breakpoint={false}
                onChange={setAddress}
                value={address}
              /> */}


              <ScheduleDateTime
                data={detailedData[0]}
                selectDateTimeSlotHandle={selectDateTimeSlotHandle}
                initialDate={scheduleDate}
                initialSlot={scheduleSlot}
              />
              <div className="flex flex-col md:flex-row justify-start w-full gap-5 items-center">
                <Dropdown
                  label={t("form_f10")}
                  options={servicesState}
                  breakpoint={true}
                  onChange={setService}
                  value={service}
                />
              </div>



              <div className="space-y-2">
                <div className="flex space-x-2 items-center">
                  <input checked={email_opt} onChange={(e) => setEmail_opt(e.target.checked)} type="checkbox" /> <h1 className="text-xs">
                    I agree to receive <strong>email</strong> updates from Clinica San Miguel, including appointment confirmations, health tips, promotional offers, and other important information.
                  </h1>
                </div>
                <div className="flex space-x-2 items-center">
                  <input checked={text_opt} onChange={(e) => setText_opt(e.target.checked)} type="checkbox" /> <h1 className="text-xs">
                    I agree to receive <strong>SMS</strong> notifications from Clinica San Miguel, including appointment reminders, health updates, and other related messages.
                  </h1>
                </div>

              </div>
              </section>
            )}

            {page >= 2 && (
              <section className="flex flex-col px-5 justify-start items-start gap-4 p-4">
                {/* Vapi Voice Intake mic button for medical info autofill */}
                <div className="mb-4 w-full">
                  {/* <VoiceIntake setForm={setMedicalForm} setOnsetDate={setOnsetDate} /> */}
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(() => {
                    const pageIndex = page - 2; // 0-based
                    const start = pageIndex * perPage;
                    const pageFields = medicalFields.slice(start, start + perPage);
                    const elems: any[] = [];
                    if (pageIndex === 0) {
                      elems.push(
                        <div key="family_history" className="col-span-2">
                          <label className="text-[16px] text-customGray font-poppins font-bold">Family History</label>
                          <div className="flex flex-wrap gap-4 mt-2">
                            <label className="flex items-center gap-2">
                              <input type="checkbox" checked={(medicalForm as any).family_history?.hypertension || false} onChange={(e) => handleFamilyHistoryChange('hypertension', e.target.checked)} />
                              <span className="text-[14px]">Hypertension</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" checked={(medicalForm as any).family_history?.diabetes || false} onChange={(e) => handleFamilyHistoryChange('diabetes', e.target.checked)} />
                              <span className="text-[14px]">Diabetes</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" checked={(medicalForm as any).family_history?.cancer || false} onChange={(e) => handleFamilyHistoryChange('cancer', e.target.checked)} />
                              <span className="text-[14px]">Cancer</span>
                            </label>
                            {(medicalForm as any).family_history?.cancer && (
                              <div className="w-full flex flex-col gap-2 pl-0 md:pl-4">
                                <label className="text-[14px] text-customGray font-poppins font-semibold">Cancer Type</label>
                                <select
                                  className="w-full h-[46px] border-[1px] border-[#d1d5db] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                  value={(medicalForm as any).cancer_type}
                                  onChange={(e) => handleMedicalChange('cancer_type', e.target.value)}
                                >
                                  <option value="">Select type</option>
                                  {[
                                    'Carcinoma',
                                    'Sarcoma',
                                    'Leukemia',
                                    'Lymphoma',
                                    'Myeloma',
                                    'Melanoma',
                                    'Brain and Central Nervous System (CNS) tumors',
                                  ].map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                            <label className="flex items-center gap-2">
                              <input type="checkbox" checked={(medicalForm as any).family_history?.heart_disease || false} onChange={(e) => handleFamilyHistoryChange('heart_disease', e.target.checked)} />
                              <span className="text-[14px]">Heart Disease</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" checked={(medicalForm as any).family_history?.unknown || false} onChange={(e) => handleFamilyHistoryChange('unknown', e.target.checked)} />
                              <span className="text-[14px]">Unknown</span>
                            </label>
                          </div>
                        </div>
                      );
                      // add substance use checkboxes on first medical page
                      elems.push(
                        <div key="substance_use" className="col-span-2">
                          <label className="text-[16px] text-customGray font-poppins font-bold">Substance Used History</label>
                          <div className="flex flex-wrap gap-4 mt-2">
                            <label className="flex items-center gap-2">
                              <input type="checkbox" checked={(medicalForm as any).tobacco_use || false} onChange={(e) => handleBooleanFieldChange('tobacco_use', e.target.checked)} />
                              <span className="text-[14px]">Tobacco Use</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" checked={(medicalForm as any).alcohol_use || false} onChange={(e) => handleBooleanFieldChange('alcohol_use', e.target.checked)} />
                              <span className="text-[14px]">Alcohol Use</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" checked={(medicalForm as any).drug_use || false} onChange={(e) => handleBooleanFieldChange('drug_use', e.target.checked)} />
                              <span className="text-[14px]">Drug Use</span>
                            </label>
                          </div>
                        </div>
                      );
                    }

                    pageFields.forEach((f) => {
                      // Preventive & Reproductive History (age/sex based)
                      const getAge = () => {
                        if (!dob) return null;
                        const today = new Date();
                        let age = today.getFullYear() - dob.getFullYear();
                        const m = today.getMonth() - dob.getMonth();
                        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
                        return age;
                      };
                      const age = getAge();
                      const isFemale = sex?.toLowerCase() === 'female';
                      const isMale = sex?.toLowerCase() === 'male';

                      // Number of Pregnancies: Female, 15-55
                      if (f.key === 'num_pregnancies' && (!isFemale || !age || age < 15 || age > 55)) return;
                      // Birth Control: Female, 15-55
                      if (f.key === 'birth_control' && (!isFemale || !age || age < 15 || age > 55)) return;
                      // Last Pap Smear: Female, >=21
                      if (f.key === 'pap_smear' && (!isFemale || !age || age < 21)) return;
                      // Last Mammogram: Female, >=40
                      if (f.key === 'mammogram' && (!isFemale || !age || age < 40)) return;
                      // Last Prostate Exam: Male, >=50
                      if (f.key === 'prostate_exam' && (!isMale || !age || age < 50)) return;

                      let elem = null;
                      if (f.key === 'onset') {
                        elem = (
                          <div key={f.key} className="flex flex-col items-start w-full justify-center">
                            <label className="text-[16px] text-customGray font-poppins font-bold">
                              {f.label}:
                            </label>
                            {/* @ts-ignore */}
                            <ReactDatePicker
                              selected={onsetDate}
                              onChange={(date) => handleOnsetDateChange(date)}
                              placeholderText={"Select onset date"}
                              dateFormat="yyyy-MM-dd"
                              maxDate={new Date()}
                              className="w-full h-[46px] border-[1px] border-[#d1d5db] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                            />
                          </div>
                        );
                      } else if (f.key === 'duration') {
                        elem = (
                          <Input
                            key={f.key}
                            label={f.label}
                            placeholder={""}
                            breakpoint={false}
                            value={(medicalForm as any)[f.key]}
                            onChange={() => { }}
                          />
                        );
                      } else if (f.key === 'relieving_factors') {
                        elem = (
                          <div key={f.key} className="flex flex-col items-start w-full justify-center gap-2">
                            <label className="text-[16px] text-customGray font-poppins font-bold">
                              {f.label}:
                            </label>
                            <div className="flex flex-wrap gap-4">
                              {[
                                'Rest',
                                'Ice',
                                'Heat',
                                'Elevation',
                                'Medication',
                                'Stretching',
                                'Massage',
                                'Support or compression',
                                'Time',
                                'Other'
                              ].map((opt) => (
                                <label key={opt} className="flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    checked={Array.isArray(medicalForm.relieving_factors) ? medicalForm.relieving_factors.includes(opt) : false}
                                    onChange={e => {
                                      let newArr = Array.isArray(medicalForm.relieving_factors) ? [...medicalForm.relieving_factors] : [];
                                      if (e.target.checked) {
                                        newArr.push(opt);
                                      } else {
                                        newArr = newArr.filter(item => item !== opt);
                                      }
                                      setMedicalForm(prev => ({ ...prev, relieving_factors: newArr }));
                                    }}
                                  />
                                  {opt}
                                </label>
                              ))}
                            </div>
                            {Array.isArray(medicalForm.relieving_factors) && medicalForm.relieving_factors.includes('Other') && (
                              <input
                                autoCorrect="on"
                                spellCheck={true}
                                autoCapitalize="sentences"
                                className="w-full h-[46px] border-[1px] border-[#d1d5db] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                placeholder="Describe other relieving factor"
                                value={reliefOther}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setReliefOther(val);
                                  setMedicalForm((prev) => ({ ...prev, relieving_factors_other: val }));
                                }}
                              />
                            )}
                          </div>
                        );
                      } else if (f.key === 'surgeries') {
                        elem = (
                          <div key={f.key} className="flex flex-col items-start w-full justify-center gap-2">
                            <label className="text-[16px] text-customGray font-poppins font-bold">
                              {f.label}:
                            </label>
                            <div className="flex flex-row gap-6 mb-2 mt-1">
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="surgeries"
                                  value="Yes"
                                  checked={surgeryChoice === 'Yes'}
                                  onChange={() => {
                                    setSurgeryChoice('Yes');
                                    setMedicalForm((prev) => ({ ...prev, surgeries: prev.surgeries || '' }));
                                  }}
                                />
                                Yes
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="surgeries"
                                  value="No"
                                  checked={surgeryChoice === 'No'}
                                  onChange={() => {
                                    setSurgeryChoice('No');
                                    setMedicalForm((prev) => ({ ...prev, surgeries: '' }));
                                  }}
                                />
                                No
                              </label>
                            </div>
                            {surgeryChoice === 'Yes' && (
                              <input
                                autoCorrect="on"
                                spellCheck={true}
                                autoCapitalize="sentences"
                                className="w-full h-[46px] border-[1px] border-[#d1d5db] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                placeholder="Type of surgery"
                                value={(medicalForm as any).surgeries}
                                onChange={(e) => handleMedicalChange('surgeries', e.target.value)}
                              />
                            )}
                          </div>
                        );
                      } else if (f.key === 'allergies') {
                        elem = (
                          <div key={f.key} className="flex flex-col items-start w-full justify-center gap-2">
                            <label className="text-[16px] text-customGray font-poppins font-bold">
                              {f.label}:
                            </label>
                            <div className="flex flex-row gap-6 mb-2 mt-1">
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="allergies"
                                  value="Yes"
                                  checked={allergyChoice === 'Yes'}
                                  onChange={() => {
                                    setAllergyChoice('Yes');
                                    setMedicalForm((prev) => ({ ...prev, allergies: prev.allergies || '' }));
                                  }}
                                />
                                Yes
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="allergies"
                                  value="No"
                                  checked={allergyChoice === 'No'}
                                  onChange={() => {
                                    setAllergyChoice('No');
                                    setMedicalForm((prev) => ({ ...prev, allergies: '' }));
                                  }}
                                />
                                No
                              </label>
                            </div>
                            {allergyChoice === 'Yes' && (
                              <input
                                autoCorrect="on"
                                spellCheck={true}
                                autoCapitalize="sentences"
                                className="w-full h-[46px] border-[1px] border-[#d1d5db] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                                placeholder="List allergies"
                                value={(medicalForm as any).allergies}
                                onChange={(e) => handleMedicalChange('allergies', e.target.value)}
                              />
                            )}
                          </div>
                        );
                      } else if (f.key === 'occupation') {
                        elem = (
                          <div key={f.key} className="flex flex-col items-start w-full justify-center">
                            <label className="text-[16px] text-customGray font-poppins font-bold">
                              {f.label}:
                            </label>
                            <select
                              className="w-full h-[46px] border-[1px] border-[#d1d5db] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                              value={(medicalForm as any)[f.key]}
                              onChange={(e) => handleMedicalChange(f.key, e.target.value)}
                            >
                              <option value="">Select occupation</option>
                              {[
                                'Businessman / Businesswoman',
                                'Employee / Office worker',
                                'Student',
                                'Teacher',
                                'Doctor',
                                'Nurse',
                                'Engineer',
                                'Laborer / Worker',
                                'Farmer',
                                'Shopkeeper',
                                'Driver',
                                'Technician',
                                'Accountant',
                                'Salesperson',
                                'Self-employed',
                                'Homemaker / Housewife',
                                'Unemployed',
                                'Retired',
                                'Government employee',
                                'Private employee',
                                'Other'
                              ].map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                        );
                      } else if (f.key === 'severity') {
                        elem = (
                          <div key={f.key} className="flex flex-col items-start w-full justify-center">
                            <label className="text-[16px] text-customGray font-poppins font-bold">
                              {f.label}:
                            </label>
                            <select
                              className="w-full h-[46px] border-[1px] border-[#d1d5db] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                              value={(medicalForm as any)[f.key]}
                              onChange={(e) => handleMedicalChange(f.key, e.target.value)}
                            >
                              <option value="">Select severity (1-10)</option>
                              {[...Array(10)].map((_, idx) => (
                                <option key={idx+1} value={(idx+1).toString()}>{idx+1}</option>
                              ))}
                            </select>
                          </div>
                        );
                      } else {
                        elem = (
                          <Input
                            key={f.key}
                            label={f.label}
                            placeholder={""}
                            breakpoint={false}
                            value={(medicalForm as any)[f.key]}
                            onChange={(v: string) => handleMedicalChange(f.key, v)}
                          />
                        );
                      }
                      if (elem) elems.push(elem);
                    });

                    return elems;
                  })()}
                </div>
              </section>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="w-full flex justify-between items-center m-3">
              <div>
                {page > 1 ? (
                  <Button
                    text={"Back"}
                    size={{ width: "120px", height: "44px" }}
                    route={""}
                    bgColor={"#E5E7EB"}
                    textColor={"#000000"}
                    onClick={() => setPage(page - 1)}
                  />
                ) : (
                  <div />
                )}
              </div>

              <div>
                {page < totalPages ? (
                  <Button
                    text={"Next"}
                    size={{ width: "120px", height: "44px" }}
                    route={""}
                    bgColor={"#C1001F"}
                    textColor={"#ffffff"}
                    onClick={() => {
                      // Validate all required fields on first page
                      if (page === 1) {
                        if (!firstName || !lastName || !email || !dob || !sex || !state || !zipcode || !street_address || !phone || !service || !date_and_time) {
                          toast.warning("Please fill in all required fields, including schedule date and time.");
                          return;
                        }
                      }
                      setPage(page + 1);
                    }}
                  />
                ) : (
                  <Button
                    text={t("button_label")}
                    size={{ width: "250px", height: "50px" }}
                    route={""}
                    bgColor={"#C1001F"}
                    textColor={"#ffffff"}
                    disabled={isSubmitting}
                    onClick={() => {
                      if (isSubmitting) return;
                      submitAppointmentDetails();
                    }}
                  />
                )}
              </div>
            </div>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};
