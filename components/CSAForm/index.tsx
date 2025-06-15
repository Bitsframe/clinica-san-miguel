"use client";

import { styles } from "@/app/[locale]/styles";
import { supabase } from "@/supabaseClient";
import { Button } from "@/utils";
import { Modal } from "flowbite-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import moment from "moment";

import ReactDatePicker from "react-datepicker";
import { toast } from "react-toastify";
import LanguageChanger from "@/components/LanguageChanger";
import { validateFormData } from "@/utils/validationCheck";
import PhoneInput from "react-phone-input-2";
import PhoneNumberInput from "./PhoneNumberInput";
import { EmailBodyTempEnum } from "@/utils/emailService/templateDetails";
import { sendEmail } from "@/utils/emailService";

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
    const [services, setServices] = useState<string[] | null | undefined>([]);
    const [service, setService] = useState("");
    const [phone, setPhone] = useState("");
    const [newPatient, setNewPatient] = useState("");
    const [date_and_time, setDate_and_time] = useState("");
    const [email_opt, setEmail_opt] = useState(false)
    const [text_opt, setText_opt] = useState(false)

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
    }, []);

    const submitAppointmentDetails = async () => {
        let appointmentDetails: any = {
            locationid: location.id,
            firstname: firstName,
            lastname: lastName,
            email: email,
            gender: sex,
            phone: phone,
            treatmenttype: service,
            email_opt,
            text_opt
        };

        const requiredFields = [
            'firstname',
            'lastname',
            'email',
            'gender',
            'phone',
            'treatmenttype',
        ];


        const validateData = validateFormData(appointmentDetails)

        if (!validateData) {
            return
        }

        for (const field of requiredFields) {
            if (!appointmentDetails[field]) {
                toast.warning(`Please fill in the ${field}`);
                return;
            }
        }




        const postData = {
            ...appointmentDetails,
            onsite: true
        }
        const { data, error } = await supabase
            .from("allpatients")
            .insert([postData])
            .select();

        if (error) {
            if (error?.message === 'duplicate key value violates unique constraint "Appoinments_date_and_time_key"') {
                toast.error(`Sorry, Appointment time slot is not available, Please select any other time slot`);

            }
            else { toast.error(`Error submitting appointment: ${error?.message}`); }
        } else {

            const lang = locale
            const emailType = EmailBodyTempEnum.CONFIRMATION_OF_FORM_SUBMISSION

            const { email, firstname, lastname, treatmenttype } = appointmentDetails
            const data: any = {
                email,
                name: `${firstname} ${lastname}`,
                location: location,
                service: treatmenttype,

            }
            await sendEmail({ lang, emailType, data })
            toast.success("Appointment Submitted");
            setFirstName("");
            setLastName("");
            setEmail("");
            setSex("");
            setService("");
            setPhone("");
            setNewPatient("");
            setDate_and_time("");
            setEmail_opt(false)
            setText_opt(false)
            console.log(data, "Appointment Submitted");
        }
    };

    return (<>


        <div className=" relative  w-screen md:h-screen">

            <div className="md:absolute px-5 md:px-0 pt-4 pb-5 md:py-0 w-full flex justify-end md:top-6 md:right-6">
                <LanguageChanger locale={locale} />
            </div>


            <div className="flex justify-center h-full items-center px-5 md:px-0">
                <div className="w-full max-w-[800px] rounded-[20px] mt-8 gap-y-5">

                    <div className="flex flex-col w-full justify-center border-b-[1px] border-black px-4 pb-2 text-center mb-9">
                        <h1
                            className={`${styles.sectionHeadText} `}
                            style={{ textAlign: "left", color: "#C1001F" }}
                        >
                            {t("self_form_title")}
                        </h1>
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


                        <div className="w-full md:flex justify-between items-center space-y-6 col-span-full mb-5">
                            <div className="space-y-2 md:w-2/3 ">
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