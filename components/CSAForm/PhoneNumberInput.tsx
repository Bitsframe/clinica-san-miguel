import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneNumberInput = ({
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
}) => {
    return (
        <div className={`flex ${breakpoint ? 'sm:flex-row' : 'flex-col'} items-start w-full`}>
            {/* Label for the phone input */}
            <label className="text-[16px] text-customGray font-poppins font-bold mb-1">
                {label}:
            </label>

            {/* Phone Input */}
            <PhoneInput
                 country={'us'}  // Default country
                // onlyCountries prop removed to allow all countries
                value={value}   // Controlled value from props
                onChange={(phone) => onChange(phone)} // Update handler
                placeholder={placeholder} // Placeholder for the input
                enableSearch={true}  // Enable search in country dropdown
                searchPlaceholder="Search countries..." // Search placeholder
                
                inputStyle={{
                    width: '100%',
                    height: '46px',
                    fontSize: '16px',
                    color: '#000000',
                    borderRadius: '10px',
                    backgroundColor:'transparent'
                }}
                buttonStyle={{
                    borderRadius: '10px 0 0 10px',
                }}
                containerStyle={{
                    width: '100%',
                }}
            />
        </div>
    );
};

export default PhoneNumberInput;
