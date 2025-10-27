"use client";

import { styles } from "@/app/[locale]/styles";
import React, { useState } from "react";

export const EmergencyContact = () => {
  const [contacts, setContacts] = useState([
    { id: 1, label: "Contact Name", placeholder: "ex. umair", value: "" },
    { id: 2, label: "Relationship", placeholder: "ex. husband", value: "" },
    {
      id: 3,
      label: "Tel Number",
      placeholder: "ex. (+92) 331 2566730",
      value: "",
    },
    {
      id: 4,
      label: "Cell Number",
      placeholder: "ex. (+92) 331 2566730",
      value: "",
    },
    { id: 5, label: "2nd Contact Name", placeholder: "ex. umair", value: "" },
    { id: 6, label: "Relationship", placeholder: "ex. husband", value: "" },
    {
      id: 7,
      label: "Tel Number",
      placeholder: "ex. (+92) 331 2566730",
      value: "",
    },
    {
      id: 8,
      label: "Cell Number",
      placeholder: "ex. (+92) 331 2566730",
      value: "",
    },
  ]);

  const handleChange = (index: any, value: any) => {
    const newContacts = [...contacts];
    newContacts[index].value = value;
    setContacts(newContacts);
  };

  return (
    <section className="flex flex-col items-center justify-center w-[95%] md:w-[90%] lg:w-[80%] gap-3">
      <div className="flex justify-start w-full">
        <div
          className={`border-[2px] border-dotted border-customGray rounded-[6.82px]  p-2 pr-4 ${styles.sectionSubText}`}
        >
          EMERGENCY CONTACTS
        </div>
      </div>
      <article className="w-full border-[2px] flex flex-col gap-5 border-[#000000] rounded-[10px] p-5">
        <article className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {contacts.map(({ id, label, placeholder, value }, index) => (
            <Input
              key={id}
              label={label}
              placeholder={placeholder}
              value={value}
              onChange={(newValue: any) => handleChange(index, newValue)}
            />
          ))}
        </article>
      </article>
    </section>
  );
};

const Input = ({ label, placeholder, value, onChange }: any) => (
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
