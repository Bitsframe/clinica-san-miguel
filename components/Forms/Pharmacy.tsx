"use client";

import { styles } from "@/app/[locale]/styles";
import React, { useState } from "react";

type PharmacyInfo = {
  name: string;
  phoneNumber: string;
  address: string;
  [key: string]: string;
};

const FormField = ({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className={`flex flex-col items-start w-full justify-center`}>
    <label className="text-[16px] text-customGray font-poppins">{label}:</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`${placeholder}`}
      className="w-full h-[46px] border-[1px] border-[#000000] text-[16px] text-[#000000] placeholder:text-customGray placeholder:text-opacity-50 px-5 bg-transparent outline-none rounded-[10px]"
    />
  </div>
);

export const Pharmacy = () => {
  const [pharmacyInfo, setPharmacyInfo] = useState<PharmacyInfo>({
    name: "",
    phoneNumber: "",
    address: "",
  });

  const handleInputChange = (field: keyof PharmacyInfo, value: string) => {
    setPharmacyInfo(
      (prevInfo) => ({ ...prevInfo, [field]: value } as PharmacyInfo)
    );
  };

  const fields = [
    { label: "Name", placeholder: "ex. umair", field: "name" },
    {
      label: "Phone Number",
      placeholder: "ex. (+92) 331 2566730",
      field: "phoneNumber",
    },
    {
      label: "Address",
      placeholder: "ex. Model Colony, Malir, Karachi.",
      field: "address",
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center w-full gap-3">
      <div className="flex justify-start w-full">
        <div
          className={`border-[2px] border-dotted border-customGray rounded-[6.82px]  p-2 pr-4 ${styles.sectionSubText}`}
        >
          PHARMACY
        </div>
      </div>
      <article className="w-full border-[2px] flex flex-col gap-5 border-[#000000] rounded-[10px] p-5">
        {fields.map(({ label, placeholder, field }) => (
          <FormField
            key={field}
            label={label}
            placeholder={placeholder}
            value={pharmacyInfo[field]}
            onChange={(value: string) => handleInputChange(field, value)}
          />
        ))}
      </article>
    </section>
  );
};
