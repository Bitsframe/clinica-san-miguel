import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { US_AREA_CODES } from './usAreaCodes';

interface PhoneNumberInputProps {
    label?: string;
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    breakpoint?: boolean;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ label, value = '', onChange, placeholder, breakpoint }) => {
    const [error, setError] = useState<string | null>(null);

    // Helper to extract area code from a +1XXXXXXXXXX string
    const getAreaCode = (phone: string) => {
        // Remove non-digits, ensure starts with 1, then get next 3 digits
        const digits = phone.replace(/\D/g, '');
        if (digits.length >= 4 && digits.startsWith('1')) {
            return digits.substring(1, 4);
        }
        return '';
    };

    const handleChange = (phone: string) => {
        // Always ensure +1 is present, regardless of user input
        let digits = phone.replace(/\D/g, '');
        if (!digits.startsWith('1')) {
            digits = '1' + digits;
        }
        const formatted = `+${digits}`;
        const areaCode = getAreaCode(formatted);
        if (formatted.length > 2 && areaCode && !US_AREA_CODES.includes(areaCode)) {
            setError('Only US phone numbers are allowed.');
        } else {
            setError(null);
        }
        onChange(formatted);
    };

    return (
        <div className={`flex ${breakpoint ? 'sm:flex-row' : 'flex-col'} items-start w-full`}>
            {/* Label for the phone input */}
            {label && (
                <label className="text-[16px] text-customGray font-poppins font-bold mb-1 mr-2">
                    {label}:
                </label>
            )}

            {/* Phone Input - US only, always +1, validate area code */}
            <PhoneInput
                country={'us'}
                onlyCountries={['us']}
                disableDropdown={true}
                value={value && value.startsWith('+1') ? value : `+1${value.replace(/[^0-9]/g, '')}`}
                onChange={handleChange}
                placeholder={placeholder}
                inputStyle={{
                    width: '100%',
                    height: '46px',
                    fontSize: '16px',
                    color: '#000000',
                    borderRadius: '10px',
                    backgroundColor: 'transparent'
                }}
                buttonStyle={{
                    borderRadius: '10px 0 0 10px',
                    backgroundColor: 'transparent',
                    borderRight: 'none'
                }}
                containerStyle={{
                    width: '100%',
                }}
            />
            {error && (
                <span className="text-red-600 text-xs mt-1 ml-2">{error}</span>
            )}
        </div>
    );
};

export default PhoneNumberInput;