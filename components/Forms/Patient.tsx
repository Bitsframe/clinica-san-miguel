import { styles } from "@/app/[locale]/styles";
import React from "react";

const RadioButtons = ({
  name,
  options,
  label,
}: {
  name: string;
  options: string[];
  label: string;
}) => (
  <div className="flex flex-col md:flex-row items-start justify-start gap-4">
    <label className="text-[16px] text-customGray font-poppins">{label}:</label>
    <div className="flex flex-wrap gap-4">
      {options.map((value, index) => (
        <RadioButton key={index} value={value} name={name} label={value} />
      ))}
    </div>
  </div>
);

const Input = ({
  label,
  placeholder,
  breakpoint,
}: {
  label: string;
  placeholder: string;
  breakpoint: boolean;
}) => (
  <div
    className={`flex flex-col items-start w-full ${
      breakpoint ? "md:w-1/2" : ""
    } justify-center`}
  >
    <label className="text-[16px] text-customGray font-poppins">{label}:</label>
    <input
      placeholder={`${placeholder}`}
      className="w-full h-[46px] border-[1px] border-[#000000] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
    />
  </div>
);

const RadioButton = ({ value, name, label }: any) => (
  <div className="flex items-center justify-start gap-3">
    <input
      type="radio"
      value={value}
      name={name}
      className="w-[25px] h-[25px] bg-transparent border-[2px] border-[#000000] hover:bg-[#ccc]"
    />{" "}
    <label className="text-[16px] text-customGray font-poppins">{label}</label>
  </div>
);

export const Patient = () => {
  const genderOptions = ["Male", "Female", "Other"];
  const raceOptions = ["White", "Hispanic", "African American", "Others"];
  const maritalStatusOptions = [
    "Single",
    "Married",
    "Widowed",
    "Divorced",
    "Separated",
  ];
  const allergicOptions = ["Yes", "No"];

  return (
    <section className="flex flex-col items-center justify-center w-[95%] md:w-[90%] lg:w-[80%] gap-3">
      <div className="flex justify-start w-full">
        <div
          className={`border-[2px] border-dotted border-customGray rounded-[6.82px]  p-2 pr-4 ${styles.sectionSubText}`}
        >
          Patient Information
        </div>
      </div>
      <article className="w-full border-[2px] flex flex-col gap-5 border-[#000000] rounded-[10px] p-5">
        <article className="flex flex-col md:flex-row justify-center w-full gap-5 items-center">
          <Input label="First Name" placeholder="ex. umair" breakpoint={true} />
          <Input
            label="Last Name"
            placeholder="ex. munawar"
            breakpoint={true}
          />
        </article>

        <Input
          label="Email Address"
          placeholder="ex. umair.munawar@gmail.com"
          breakpoint={false}
        />

        <article className="flex flex-col md:flex-row justify-center w-full gap-5 items-center">
          <Input
            label="Mobile Number"
            placeholder="ex. (+92) 331 2566730"
            breakpoint={true}
          />
          <Input
            label="Date of Birth"
            placeholder="ex. 23-oct-2000"
            breakpoint={true}
          />
        </article>

        <RadioButtons name="gender" options={genderOptions} label="Sex" />

        <Input
          label="Address"
          placeholder="ex. Model Colony, Malir, Karachi."
          breakpoint={false}
        />

        <article className="flex flex-col md:flex-row justify-center w-full gap-5 items-center">
          <Input label="City" placeholder="ex. Karachi" breakpoint={true} />
          <Input label="State" placeholder="ex. Sindh" breakpoint={true} />
        </article>

        <article className="flex flex-col md:flex-row justify-center w-full gap-5 items-center">
          <Input label="Zip Code" placeholder="ex. 75100" breakpoint={true} />
          <Input
            label="Home Phone Number"
            placeholder="ex. (021) 34403950"
            breakpoint={true}
          />
        </article>

        <RadioButtons
          name="promotion"
          options={allergicOptions}
          label="Do you authorize us to send promotions"
        />

        <div className="flex flex-col gap-1 items-start justify-center w-full">
          <RadioButtons name="race" options={raceOptions} label="Race" />
          <Input label="Indicate Others" placeholder="" breakpoint={false} />
        </div>

        <RadioButtons
          name="marital status"
          options={maritalStatusOptions}
          label="Martial Status"
        />

        <div className="flex flex-col gap-1 items-start justify-center w-full">
          <RadioButtons
            name="allergic"
            options={allergicOptions}
            label="Are you allergic to any medication"
          />
          <Input
            label="If yes, please specify"
            placeholder=""
            breakpoint={false}
          />
        </div>
      </article>
    </section>
  );
};
