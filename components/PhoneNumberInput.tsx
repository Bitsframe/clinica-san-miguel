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

    const handleChange = (phone: string) => {
        let digits = phone.replace(/\D/g, '');
        
        // Strip the country code if the library adds it
        if (digits.startsWith('1')) {
            digits = digits.slice(1);
        }

        const truncated = digits.slice(0, 10);

        const areaCode = truncated.length >= 3 ? truncated.substring(0, 3) : '';
        if (truncated.length >= 3 && !US_AREA_CODES.includes(areaCode)) {
            setError('Only US phone numbers are allowed.');
        } else {
            setError(null);
        }

        onChange(truncated);
    };

    return (
        <div className={`flex ${breakpoint ? 'sm:flex-row' : 'flex-col'} items-start w-full`}>
            {label && (
                <label className="text-[16px] text-customGray font-poppins font-bold mb-1 mr-2">
                    {label}:
                </label>
            )}
            
            <div style={{ position: 'relative', width: '100%' }}>
                {/* HARD-CODED PREFIX OVERLAY WITH FLAG */}
                <div
                    style={{
                        position: 'absolute',
                        left: 1,
                        top: 1,
                        bottom: 1,
                        width: '75px', // Widened to fit flag + text
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        background: '#f8f9fa',
                        color: '#444',
                        fontWeight: '600',
                        borderRadius: '10px 0 0 10px',
                        zIndex: 10,
                        borderRight: '1px solid #e0e0e0',
                        pointerEvents: 'none',
                        userSelect: 'none'
                    }}
                >
                    {/* US Flag Emoji or Image */}
                    <span style={{ fontSize: '18px' }}>🇺🇸</span>
                    <span style={{ fontSize: '15px' }}>+1</span>
                </div>

                <PhoneInput
                    country={'us'}
                    onlyCountries={['us']}
                    disableDropdown={true}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    prefix="" 
                    disableCountryCode={true} 
                    inputStyle={{
                        width: '100%',
                        height: '46px',
                        fontSize: '16px',
                        color: '#000000',
                        borderRadius: '10px',
                        backgroundColor: '#fff',
                        paddingLeft: '85px', // Increased padding to avoid overlapping the flag box
                        border: '1px solid #ccc'
                    }}
                    buttonStyle={{
                        display: 'none'
                    }}
                    containerStyle={{
                        width: '100%',
                    }}
                />
            </div>
            
            {error && (
                <span className="text-red-600 text-xs mt-1 ml-2">{error}</span>
            )}
        </div>
    );
};

export default PhoneNumberInput;