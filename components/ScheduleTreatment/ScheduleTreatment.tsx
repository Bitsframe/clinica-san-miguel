"use client";

import React, { useState } from "react";
import { Button } from "@/utils";

import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// icons
import { FaRegCalendarAlt } from "react-icons/fa";
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Adjusted type here
}

interface DateTimeProps
  extends Omit<ReactDatePickerProps, "onChange" | "value"> {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col justify-start items-start gap-2">
      <h3 className="text-[20px] text-[#ffffff]">{label}</h3>
      <div className="w-[183px] h-[37px] px-1 rounded-[10px] bg-[#ffffff] flex justify-between items-center">
        <input
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="bg-transparent text-[#000000] outline-none text-[16px]"
        />
      </div>
    </div>
  );
};

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropDownFlag = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (selectedValue: any) => {
    const syntheticEvent = {
      target: {
        value: selectedValue,
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col justify-start items-start gap-2">
      <h3 className="text-[20px] text-[#ffffff]">{label}</h3>
      <div
        className="relative w-[183px] h-[37px] px-1 rounded-[10px] bg-[#ffffff] cursor-pointer"
        onClick={toggleDropDownFlag}
      >
        <div className="flex justify-between h-[37px] items-center">
          <div className="text-[16px] text-customGray">{value}</div>
          <div className="ml-2">
            {isOpen ? (
              <span className="text-[18px] text-[#C1001F]">
                <TiArrowSortedUp />
              </span>
            ) : (
              <span className="text-[18px] text-[#C1001F]">
                <TiArrowSortedDown />
              </span>
            )}
          </div>
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 w-[183px] bg-[#ffffff] rounded-[10px] mt-1 border border-[#000000]">
            {options.map((option, index) => (
              <div
                key={index}
                className="cursor-pointer p-2 hover:bg-gray-200"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const DateTime: React.FC<DateTimeProps> = ({
  label,
  value,
  onChange,
  ...props
}) => {
  return (
    <div className="flex flex-col justify-start items-start gap-2">
      <h3 className="text-[20px] text-[#ffffff]">{label}</h3>
      <div className="w-[183px] h-[37px] px-1 rounded-[10px] bg-[#ffffff] flex justify-between items-center">
        <div className="relative flex justify-between w-[183px] h-[37px] items-center">
          {/* @ts-ignore */}
          <DatePicker
            selected={value}
            onChange={(date) => onChange(date as Date)}
            dateFormat="yyyy-MM-dd'T'HH:mm"
            showTimeInput
            timeInputLabel="Time:"
            className="bg-transparent text-[#000000] outline-none text-[16px] w-[75%] cursor-pointer"
            placeholderText="select date"
            {...props}
          />
          <div className="absolute right-2 flex justify-end h-[37px] items-center w-[25%] text-[20px] text-[#C1001F] pointer-events-none">
            <FaRegCalendarAlt />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ScheduleTreatment: React.FC = () => {
  const [patientName, setPatientName] = useState("");
  const [selectedOption, setSelectedOption] = useState("select treatment");
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(
    new Date()
  );

  const handlePatientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientName(e.target.value);
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  const handleDateTimeChange = (date: Date | null) => {
    setSelectedDateTime(date);
  };

  return (
    <article className="w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] xl:w-[60%] flex flex-wrap items-center gap-4 justify-evenly rounded-[10px] p-5 bg-[#19192C]">
      <div className="w-[185px] h-[75px]">
        <InputField
          label="Patient Name:"
          placeholder="Enter your name"
          value={patientName}
          onChange={handlePatientNameChange}
        />
      </div>

      <div className="w-[185px] h-[75px]">
        <Dropdown
          label="Treatment:"
          options={["Option 1", "Option 2", "Option 3"]}
          value={selectedOption}
          onChange={handleDropdownChange}
        />
      </div>

      <div className="w-[185px] h-[75px]">
        <DateTime
          label="Date:"
          value={selectedDateTime}
          onChange={handleDateTimeChange}
        />
      </div>

      <div className="w-[185px] h-[75px] flex justify-center items-end">
        <Button
          text={"Book Now"}
          size={{
            width: "161px",
            height: "62px",
          }}
          route={""}
          bgColor={"#C1001F"}
          textColor={"#ffffff"}
          onClick={() => {}}
        />
      </div>
    </article>
  );
};
