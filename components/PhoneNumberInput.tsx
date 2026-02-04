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
    <div className={`flex ${breakpoint ? 'sm:flex-row' : 'flex-col'} items-start w-full`}>
      {label && (
        <label className="text-[16px] text-customGray font-poppins font-bold mb-1 mr-2">
          {label}:
        </label>
      )}

      <div style={{ position: 'relative', width: '100%' }}>
        {/* Flag */}
        <div
          style={{
            position: 'absolute',
            left: 1,
            top: 1,
            bottom: 1,
            width: 45,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8f9fa',
            borderRadius: '10px 0 0 10px',
            borderRight: '1px solid #e0e0e0',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          <img src="https://flagcdn.com/w40/us.png" alt="US" style={{ width: 24 }} />
        </div>

        {/* Fixed (+1) */}
        <div
          style={{
            position: 'absolute',
            left: 55,
            top: 0,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            fontSize: 16,
            color: '#000',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
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
            height: 46,
            fontSize: 16,
            paddingLeft: 100,
            borderRadius: 10,
            border: '1px solid #ccc'
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

      {error && <span className="text-red-600 text-xs mt-1 ml-2">{error}</span>}
    </div>
  );
};

export default PhoneNumberInput;
