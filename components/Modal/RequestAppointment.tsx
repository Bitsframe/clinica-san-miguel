"use client";

import { styles } from "@/app/[locale]/styles";
import { supabase } from "@/supabaseClient";
import { Button } from "@/utils";
import { Label, Modal, Select } from "flowbite-react";
import { useLocale, useTranslations } from "next-intl";
import { TuiDatePicker } from "nextjs-tui-date-picker";
import { useEffect, useState } from "react";
import moment from "moment";

import ReactDatePicker from "react-datepicker";
import { toast } from "react-toastify";
import ScheduleDateTime from "./ScheduleDateTime";
import { validateFormData } from "@/utils/validationCheck";
import { usStates } from "@/utils/us-states";
import PhoneNumberInput from "../CSAForm/PhoneNumberInput";
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
      dateFormat="yyyy-MM-dd"
      popperPlacement="bottom-start"
      calendarClassName="fixed-calendar-height"
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

  const tableName = locale === "es" ? "services_es" : "services";

  // const [openModal, setOpenModal] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [sex, setSex] = useState("");
  const [services, setServices] = useState<string[] | null | undefined>([]);
  const [state, setState] = useState('')
  const [zipcode, setzipcode] = useState('')
  const [street_address, setStreet_address] = useState('')
  const [service, setService] = useState("");

  // Set default service if not set and services are loaded
  useEffect(() => {
    if (!service && services && services.length > 0) {
      setService(services[0]);
    }
  }, [services]);
  const [phone, setPhone] = useState("");
  const [inOfficePatient, setInOfficePatient] = useState("");
  const [newPatient, setNewPatient] = useState("");
  const [date_and_time, setDate_and_time] = useState("");
  const [email_opt, setEmail_opt] = useState(false)
  const [text_opt, setText_opt] = useState(false)
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onsetDate, setOnsetDate] = useState<Date | null>(null);
  const [reliefOther, setReliefOther] = useState("");
  const [reliefSelect, setReliefSelect] = useState("");
  const [surgeryChoice, setSurgeryChoice] = useState("");
  const [allergyChoice, setAllergyChoice] = useState("");

  const [medicalForm, setMedicalForm] = useState({
    chief_complaint: "",
    onset: "",
    duration: "",
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

  const handleMedicalChange = (key: string, value: string) => {
    setMedicalForm((prev) => ({ ...prev, [key]: value }));
  };

  const medicalFields = [
    { key: 'chief_complaint', label: 'Reason for Visit' },
    { key: 'onset', label: 'how long are you feeling this?' },
    { key: 'duration', label: 'Duration' },
    { key: 'location', label: 'Location' },
    { key: 'severity', label: 'Severity' },
    { key: 'symptoms_description', label: 'Symptom Details' },
    { key: 'relieving_factors', label: 'Relieving Factors' },
    { key: 'medical_conditions', label: 'Medical Conditions' },
    { key: 'surgeries', label: 'Surgeries' },
    { key: 'allergies', label: 'Allergies' },
    { key: 'current_medications', label: 'Current Medications' },
    // family history is a checkbox group rendered separately
    // tobacco/alcohol/drug use are rendered as checkbox flags on the first medical page
    { key: 'occupation', label: 'Occupation' },
  ];

  const handleFamilyHistoryChange = (key: string, checked: boolean) => {
    setMedicalForm((prev: any) => {
      // If "unknown" is selected, clear all other flags
      if (key === 'unknown' && checked) {
        return {
          ...prev,
          cancer_type: '',
          family_history: {
            hypertension: false,
            diabetes: false,
            cancer: false,
            heart_disease: false,
            unknown: true,
          },
        };
      }

      // If selecting any specific history, unset unknown
      const nextFamily = {
        ...prev.family_history,
        [key]: checked,
        unknown: key === 'unknown' ? checked : false,
      };

      // Clear cancer type when cancer unchecked or unknown toggled off all
      const nextCancerType =
        key === 'cancer' && !checked ? '' : prev.cancer_type;

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
      setMedicalForm((prev) => ({ ...prev, onset: "", duration: "" }));
      return;
    }

    const selected = moment(date).startOf('day');
    const today = moment().startOf('day');
    const diffDays = today.diff(selected, 'days');

    const formatDuration = (days: number) => {
      if (days === 0) return 'Today';
      const years = Math.floor(days / 365);
      const remainingDays = days % 365;
      const months = Math.floor(remainingDays / 30);
      const finalDays = remainingDays % 30;

      const parts: string[] = [];
      if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
      if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
      if (finalDays > 0) parts.push(`${finalDays} day${finalDays > 1 ? 's' : ''}`);

      return `${parts.join(', ')} ago`;
    };

    const durationLabel = formatDuration(diffDays);

    setMedicalForm((prev) => ({
      ...prev,
      onset: selected.format('YYYY-MM-DD'),
      duration: durationLabel,
    }));
  };

  const perPage = 8; // fields per medical page - adjust as needed
  const medicalPages = Math.max(1, Math.ceil(medicalFields.length / perPage));
  const totalPages = 1 + medicalPages; // 1 for appointment page

  const visitType = [t("form_f1a"), t("form_f1b")];
  const patientType = [t("form_f2a"), t("form_f2b")];
  const genderOptions = [t("form_f8a"), t("form_f8b"), t("form_f8c")];

  console.log(detailedData)

  // Test helper to quickly populate fields for QA/debugging
  const fillTestData = () => {
    const onsetSampleDate = new Date('2025-12-18');
    const sample = {
      first_name: 'Test',
      last_name: 'Patient',
      email_address: 'test@example.com',
      phone: '+1 (555) 123-4567',
      dob: new Date('1990-05-10'),
      sex: genderOptions[0] || 'Male',
      state: 'Texas',
      zipcode: '75001',
      street_address: '123 Demo Street',
      service: services?.[0] || 'Test Service',
      visit_type: visitType[0] || '',
      patient_type: patientType[0] || '',
      date_and_time: `${detailedData?.[0]?.id || locationID}|20-12-2025 - 10:00 AM`,
      email_opt_in: true,
      text_opt_in: true,
      medical: {
        chief_complaint: 'Shortness of breath',
        onsetDate: onsetSampleDate,
        location: 'Chest',
        severity: '6',
        symptoms_description:
          'Patient reports difficulty breathing, worse with exertion and when lying flat',
        relieving_select: 'Other',
        relieving_other: 'Sitting upright provides mild relief',
        medical_conditions: ['Asthma'],
        surgeries: 'Appendectomy (2015)',
        surgeries_choice: 'Yes',
        allergies: 'Penicillin',
        allergies_choice: 'Yes',
        current_medications: ['Albuterol inhaler'],
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
    setDob(sample.dob);
    setSex(sample.sex);
    setState(sample.state);
    setzipcode(sample.zipcode);
    setStreet_address(sample.street_address);
    setService(sample.service as string);
    setInOfficePatient(sample.visit_type);
    setNewPatient(sample.patient_type);
    setDate_and_time(sample.date_and_time);
    setEmail_opt(sample.email_opt_in);
    setText_opt(sample.text_opt_in);
    setReliefSelect(sample.medical.relieving_select);
    setReliefOther(sample.medical.relieving_other);
    setSurgeryChoice(sample.medical.surgeries_choice);
    setAllergyChoice(sample.medical.allergies_choice);

    // Set onset/duration via existing handler for consistent formatting
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
      medical_conditions: sample.medical.medical_conditions.join(', '),
      surgeries: sample.medical.surgeries,
      allergies: sample.medical.allergies,
      current_medications: sample.medical.current_medications.join(', '),
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

    setPage(1);
  };



  useEffect(() => {
    const fetchServices = async () => {
      let { data, error } = await supabase.from(tableName).select("title");

      if (data) {
        const serviceData = data.map((item: any) => item.title);
        setServices(serviceData);
      }
    };

    fetchServices();
  }, [tableName]);

  const submitAppointmentDetails = async () => {
    if (isSubmitting) return;

    let appointmentDetails: any = {
      location_id: locationID,
      first_name: firstName,
      last_name: lastName,
      email_address: email,
      in_office_patient: false,
      new_patient: newPatient === "new" || false,
      dob: dob,
      sex: sex,
      phone: phone,
      service: service,
      date_and_time,
      email_opt,
      text_opt
    };

    const requiredFields = [
      "location_id",
      "first_name",
      "last_name",
      "email_address",
      "phone",
      "dob",
      'state',
      'zipcode',
      'street_address',
      "sex",
      "date_and_time",
      "service",
    ];

    const validateData = validateFormData({ ...appointmentDetails, email: email, state, zipcode, street_address }, true)

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
      } else if (!{ ...appointmentDetails, email: email, state, zipcode, street_address }[field]) {
        toast.warning(`Please fill in the ${field}`);
        return;
      }
    }




    const postData = {
      ...appointmentDetails,
      address: `${street_address}, ${state}, ${zipcode}`,
      date_and_time,
    }

    setIsSubmitting(true);

    const lang = locale
    const emailType = EmailBodyTempEnum.APPOINTMENT_CONFIRMATION
    const { email_address, first_name, last_name, service: svc, date_and_time: dt } = appointmentDetails
    const emailData: any = {
      email: email_address,
      name: `${first_name} ${last_name}`,
      location: detailedData[0],
      service: svc,
      date: dt ? dt?.split?.('|')?.[1]?.split?.(' - ')?.[0] : '-',
      time: dt ? dt?.split?.(' - ')?.[1] : '-'

    }
    emailData.medical_info = medicalForm;

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
        duplicateCheck: { location_id: locationID, date_and_time },
        invokeEdge: true,
        email: {
          sendEmail,
          emailType,
          lang,
          emailData,
        },
      },
    });

    if (!result.success) {
      if ((result.error as any)?.message === 'slot_unavailable') {
        toast.error(`Sorry, Appointment time slot is not available, Please select any other time slot`);
      } else if (result.error) {
        toast.error(`Error submitting appointment: ${result.error.message || result.error}`);
      }
      setIsSubmitting(false);
      return;
    }

    toast.success("Appointment Submitted");
    setFirstName("");
    setLastName("");
    setEmail("");
    setDob(null);
    setSex("");
    setService("");
    setPhone("");
    setInOfficePatient("");
    setNewPatient("");
    setDate_and_time("");
    setEmail_opt(false)
    setText_opt(false)
    setReliefOther("");
    setReliefSelect("");
    setSurgeryChoice("");
    setAllergyChoice("");
    setMedicalForm({
      chief_complaint: "",
      onset: "",
      duration: "",
      location: "",
      severity: "",
      symptoms_description: "",
      relieving_factors: "",
      medical_conditions: "",
      surgeries: "",
      allergies: "",
      current_medications: "",
      cancer_type: "",
      family_history: { hypertension: false, diabetes: false, cancer: false, heart_disease: false, unknown: false },
      tobacco_use: false,
      alcohol_use: false,
      drug_use: false,
      occupation: "",
    });
    setPage(1);
    handleClose();
    console.log(emailData, "Appointment Submitted");
    setIsSubmitting(false);
  };


  // Preserve selected date and slot between pages
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [scheduleSlot, setScheduleSlot] = useState<string>("");
  const selectDateTimeSlotHandle = (date: Date | '', time?: string | '') => {
    if (date && time) {
      setScheduleDate(date as Date);
      setScheduleSlot(time as string);
      const formated_date = moment(date).format('DD-MM-YYYY')
      const createSlotForDB = `${detailedData?.[0]?.id}|${formated_date} - ${time}`
      setDate_and_time(createSlotForDB)
    } else {
      setScheduleDate(date ? (date as Date) : null);
      setScheduleSlot("");
      setDate_and_time("");
    }
  }
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
                  options={services}
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
                              <input type="radio" name="fh-unknown" checked={(medicalForm as any).family_history?.unknown || false} onChange={(e) => handleFamilyHistoryChange('unknown', e.target.checked)} />
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

                    elems.push(...pageFields.map((f) => (
                      f.key === 'onset' ? (
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
                      ) : f.key === 'duration' ? (
                        <Input
                          key={f.key}
                          label={f.label}
                          placeholder={""}
                          breakpoint={false}
                          value={(medicalForm as any)[f.key]}
                          onChange={() => { }}
                        />
                      ) : f.key === 'relieving_factors' ? (
                        <div key={f.key} className="flex flex-col items-start w-full justify-center gap-2">
                          <label className="text-[16px] text-customGray font-poppins font-bold">
                            {f.label}:
                          </label>
                          <select
                            className="w-full h-[46px] border-[1px] border-[#d1d5db] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                            value={reliefSelect}
                            onChange={(e) => {
                              const val = e.target.value;
                              setReliefSelect(val);
                              if (val === 'Other') {
                                setReliefOther('');
                                setMedicalForm((prev) => ({ ...prev, relieving_factors: '' }));
                              } else {
                                setReliefOther('');
                                setMedicalForm((prev) => ({ ...prev, relieving_factors: val }));
                              }
                            }}
                          >
                            <option value="">Select relieving factor</option>
                            {[
                              'Rest',
                              'Change in position',
                              'Medications',
                              'Heat or cold application',
                              'Movement or activity',
                              'Support or compression',
                              'Time',
                              'Other'
                            ].map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          {reliefSelect === 'Other' && (
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
                                setMedicalForm((prev) => ({ ...prev, relieving_factors: val }));
                              }}
                            />
                          )}
                        </div>
                      ) : f.key === 'surgeries' ? (
                        <div key={f.key} className="flex flex-col items-start w-full justify-center gap-2">
                          <label className="text-[16px] text-customGray font-poppins font-bold">
                            {f.label}:
                          </label>
                          <select
                            className="w-full h-[46px] border-[1px] border-[#d1d5db] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                            value={surgeryChoice}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSurgeryChoice(val);
                              if (val === 'Yes') {
                                setMedicalForm((prev) => ({ ...prev, surgeries: prev.surgeries || '' }));
                              } else {
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
                      ) : f.key === 'allergies' ? (
                        <div key={f.key} className="flex flex-col items-start w-full justify-center gap-2">
                          <label className="text-[16px] text-customGray font-poppins font-bold">
                            {f.label}:
                          </label>
                          <select
                            className="w-full h-[46px] border-[1px] border-[#d1d5db] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
                            value={allergyChoice}
                            onChange={(e) => {
                              const val = e.target.value;
                              setAllergyChoice(val);
                              if (val === 'Yes') {
                                setMedicalForm((prev) => ({ ...prev, allergies: prev.allergies || '' }));
                              } else {
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
                      ) : f.key === 'occupation' ? (
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
                      ) : f.key === 'severity' ? (
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
                      ) : (
                        <Input
                          key={f.key}
                          label={f.label}
                          placeholder={""}
                          breakpoint={false}
                          value={(medicalForm as any)[f.key]}
                          onChange={(v: string) => handleMedicalChange(f.key, v)}
                        />
                      )
                    )));

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
