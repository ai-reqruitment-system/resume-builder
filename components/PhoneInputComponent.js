import React, { useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInputComponent = ({
    value,
    onChange,
    disabled = false,
    error = null,
    containerClassName = '',
    inputClassName = '',
    placeholder = 'Enter phone number',
    preferredCountries = ['us', 'gb', 'ca', 'au'],
    enableSearch = true,
    searchPlaceholder = 'Search country...',
    validatePhone = null,
}) => {
    // Add custom CSS for phone input component
    useEffect(() => {
        // Add custom styles to make the phone input match our form design
        const style = document.createElement('style');
        style.innerHTML = `
      .react-tel-input .form-control {
        width: 100% !important;
        height: 48px !important;
        font-size: 16px !important;
      }
      .react-tel-input .flag-dropdown.disabled {
        background-color: #f9fafb !important;
      }
      .react-tel-input .selected-flag {
        border-radius: 0.5rem 0 0 0.5rem !important;
      }
      .react-tel-input .form-control:disabled {
        background-color: #f9fafb !important;
        cursor: not-allowed;
      }
      .react-tel-input .form-control.error {
        border-color: #ef4444 !important;
      }
    `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Handle phone change
    const handlePhoneChange = (value, country) => {
        if (onChange) {
            onChange(value, country);
        }
    };

    // Determine input class based on error state and disabled state
    const getInputClass = () => {
        let baseClass = `w-full px-4 py-3 rounded-lg border ${inputClassName}`;

        if (error) {
            return `${baseClass} border-red-500`;
        } else if (disabled) {
            return `${baseClass} border-gray-200 bg-gray-50`;
        } else {
            return `${baseClass} border-teal-300 focus:ring-2 focus:ring-teal-200 focus:border-teal-400`;
        }
    };

    return (
        <div className={`phone-input-container ${containerClassName}`}>
            <PhoneInput
                country={'us'}
                value={value}
                onChange={handlePhoneChange}
                disabled={disabled}
                inputClass={getInputClass()}
                containerClass="w-full"
                buttonClass={disabled ? 'opacity-50 cursor-not-allowed' : ''}
                dropdownClass="bg-white shadow-lg rounded-lg max-h-60 overflow-y-auto"
                searchClass="px-3 py-2 focus:outline-none"
                enableSearch={enableSearch}
                disableSearchIcon={false}
                searchPlaceholder={searchPlaceholder}
                preferredCountries={preferredCountries}
                placeholder={placeholder}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default PhoneInputComponent;