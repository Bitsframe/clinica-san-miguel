import React, { useState, useRef } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { US_AREA_CODES } from './usAreaCodes';

interface PhoneNumberInputProps {
  label?: React.ReactNode;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  breakpoint?: boolean;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  label,
  value = '',
  onChange,
  placeholder,
  breakpoint
}) => {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (phone: string) => {
    const digits = phone.replace(/\D/g, '').slice(0, 10);

    const areaCode = digits.substring(0, 3);
    if (digits.length >= 3 && !US_AREA_CODES.includes(areaCode)) {
      setError('Only US phone numbers are allowed.');
    } else {
      setError(null);
    }

    onChange(digits);
  };

  const keepCursorAfterPrefix = () => {
    if (!inputRef.current) return;
    if (inputRef.current.selectionStart! < 5) {
      inputRef.current.setSelectionRange(5, 5);
    }
  };

  return (
    <div className={`flex flex-col items-start w-full ${breakpoint ? "md:w-1/2" : ""}`}>
      {label && (
        <label className="text-sm font-semibold text-[#19192C] font-poppins mb-1.5">
          {label}
        </label>
      )}

      <div className="relative w-full">
        <div
          className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center bg-[#FAFAFA] border-r border-gray-200 rounded-l-xl z-10 pointer-events-none"
        >
          <img src="https://flagcdn.com/w40/us.png" alt="US" className="w-5 h-auto" />
        </div>

        <div className="absolute left-12 top-0 bottom-0 flex items-center text-sm text-[#19192C] z-10 pointer-events-none">
          (+1)
        </div>

        <PhoneInput
          country="us"
          onlyCountries={['us']}
          disableDropdown
          disableCountryCode
          prefix=""
          value={value}
          onChange={handleChange}
          onClick={keepCursorAfterPrefix}
          onFocus={keepCursorAfterPrefix}
          placeholder={placeholder || '(555) 000-0000'}
          masks={{ us: '(...) ...-....' }}
          inputStyle={{
            width: '100%',
            height: 44,
            fontSize: 14,
            paddingLeft: 88,
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          }}
          buttonStyle={{ display: 'none' }}
          containerStyle={{ width: '100%' }}
          inputProps={{
            ref: (el: HTMLInputElement | null) => {
              inputRef.current = el;
            }
          }}
        />
      </div>

      {error && (
        <div className="flex items-center gap-1 mt-1 ml-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="#FFA500" 
            className="w-4 h-4 flex-shrink-0"
          >
            <path 
              fillRule="evenodd" 
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" 
              clipRule="evenodd" 
            />
          </svg>
          <span className="text-red-600 text-xs">{error}</span>
        </div>
      )}
    </div>
  );
};

export default PhoneNumberInput;
