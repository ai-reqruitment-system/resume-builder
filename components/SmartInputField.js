import React, { useState, useEffect } from 'react';
import { useSuggestionGenerator } from '@/hooks/useSuggestionGenerator';
import { Plus, Loader2 } from 'lucide-react';

const SmartInputField = ({
                             value = '',
                             onChange,
                             label,
                             placeholder = "",
                             className = "",
                             currentDescription = [],
                             onDescriptionChange,
                             promptType,
                             index = null, // null indicates single field, number indicates array field
                         }) => {
    const [typingTimeout, setTypingTimeout] = useState(null);
    const {
        suggestions,
        isLoading,
        generateSuggestions
    } = useSuggestionGenerator();

    const handleInputChange = (e) => {
        onChange(e);

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        const newTimeout = setTimeout(() => {
            const inputValue = e.target.value.trim();
            if (inputValue) {
                const prompt = promptType + inputValue;
                generateSuggestions(prompt);
            }
        }, 1000);

        setTypingTimeout(newTimeout);
    };

    const handleSuggestionSelect = (suggestion) => {
        // Handle both array and single field cases
        const currentContent = index !== null
            ? (currentDescription[index] || '')
            : (currentDescription || '');

        let newValue;

        if (currentContent.includes(`<li>${suggestion}</li>`)) {
            // Remove the suggestion if it already exists
            let updatedContent = currentContent
                .replace(`<li>${suggestion}</li>`, '')
                .trim()
                .replace(/<ul>\s*<\/ul>/, '')
                .replace(/^\s+|\s+$/g, '');

            if (index !== null) {
                // Array field case
                newValue = [...currentDescription.slice(0, index), updatedContent, ...currentDescription.slice(index + 1)];
            } else {
                // Single field case
                newValue = updatedContent;
            }
        } else {
            // Add the suggestion as a list item
            const listItem = `<li>${suggestion}</li>`;
            let newContent;

            if (!currentContent || currentContent.trim() === '') {
                newContent = `<ul>${listItem}</ul>`;
            } else if (currentContent.includes('</ul>')) {
                // Append new item before closing ul tag
                newContent = currentContent.replace('</ul>', `${listItem}</ul>`);
            } else {
                // Create new ul with the item
                newContent = `<ul>${listItem}</ul>`;
            }

            if (index !== null) {
                // Array field case
                newValue = [...currentDescription.slice(0, index), newContent, ...currentDescription.slice(index + 1)];
            } else {
                // Single field case - preserve existing items
                newValue = newContent;
            }
        }

        onDescriptionChange({ target: { value: newValue } });
    };

    useEffect(() => {
        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, [typingTimeout]);

    const isSelected = (suggestion) => {
        const currentContent = index !== null
            ? currentDescription[index]
            : currentDescription;
        return currentContent?.includes(`<li>${suggestion}</li>`);
    };

    return (
        <div className={`${className} relative`}>
            <label className="absolute -top-2.5 left-2 bg-white px-1 text-sm text-gray-600">
                {label}
            </label>
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg
                        outline-none transition-colors hover:border-blue-400 focus:border-blue-500"
            />

            {isLoading && value.trim() && (
                <div className="flex items-center gap-2 p-2 text-sm text-gray-600">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600"/>
                    <span>Generating suggestions...</span>
                </div>
            )}

            {!isLoading && suggestions.length > 0 && (
                <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 bg-white shadow-lg rounded-lg mt-1 border border-gray-200">
                    {suggestions.map((suggestion, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSuggestionSelect(suggestion)}
                            className="w-full text-left hover:bg-gray-50 flex items-start gap-2 p-2 transition-colors"
                        >
                            <div className="flex-shrink-0 mt-0.5">
                                <div className={`w-4 h-4 rounded-full ${
                                    isSelected(suggestion) ? 'bg-blue-100' : 'bg-blue-50'
                                } flex items-center justify-center`}>
                                    <Plus className="w-3 h-3 text-blue-600"/>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 leading-5">{suggestion}</p>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SmartInputField;