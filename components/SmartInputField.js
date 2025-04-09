import React, { useState, useEffect, useRef } from 'react';
import { useSuggestionGenerator } from '@/hooks/useSuggestionGenerator';
import { Plus, Loader2, Check, Search, X } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

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
    helperText,
    error,
}) => {
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);
    const toast = useToast();

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
            if (inputValue && inputValue.length > 2) {
                setShowSuggestions(true);
                const prompt = promptType + inputValue;
                generateSuggestions(prompt);
            }
        }, 800); // Reduced from 1000ms to 800ms for better responsiveness

        setTypingTimeout(newTimeout);
    };

    const handleSuggestionSelect = (suggestion) => {
        // Handle both array and single field cases
        const currentContent = index !== null
            ? (currentDescription[index] || '')
            : (currentDescription || '');

        let newValue;
        const isAlreadySelected = currentContent.includes(`<li>${suggestion}</li>`);

        if (isAlreadySelected) {
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

            toast.info('Item removed from description');
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

            toast.success('Item added to description');
        }

        onDescriptionChange({ target: { value: newValue } });
    };

    // Handle click outside to close suggestions
    useEffect(() => {
        function handleClickOutside(event) {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
                inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, [typingTimeout]);

    const isSelected = (suggestion) => {
        const currentContent = index !== null
            ? (currentDescription[index] || '')
            : (currentDescription || '');

        return currentContent?.includes(`<li>${suggestion}</li>`);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredSuggestions = suggestions.filter(suggestion =>
        searchTerm === '' || suggestion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full relative">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                    {helperText && (
                        <span className="ml-1 text-xs text-gray-500">{helperText}</span>
                    )}
                </label>
            )}

            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 border ${error ? 'border-red-300 focus:ring-red-200' : isFocused ? 'border-teal-400 focus:ring-teal-200' : 'border-gray-300'} rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ease-in-out ${className}`}
                />

                {value && value.length > 0 && (
                    <button
                        type="button"
                        onClick={() => {
                            onChange({ target: { value: '' } });
                            if (inputRef.current) inputRef.current.focus();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                        aria-label="Clear input"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {error && (
                <p className="mt-1.5 text-sm text-red-500">{error}</p>
            )}

            {isLoading && (
                <div className="mt-2 flex items-center text-sm text-gray-500">
                    <div className="relative">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin text-teal-500" />
                        <div className="absolute inset-0 rounded-full animate-ping bg-teal-200 opacity-30"></div>
                    </div>
                    <span>Generating smart suggestions...</span>
                </div>
            )}

            {!isLoading && suggestions.length > 0 && (
                <div className="relative">
                    <button
                        onClick={() => setShowSuggestions(!showSuggestions)}
                        className="mt-2 text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1.5 transition-colors"
                    >
                        <span className="font-medium">View suggestions</span>
                        <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-0.5 rounded-full">
                            {suggestions.length}
                        </span>
                    </button>

                    {showSuggestions && (
                        <div
                            ref={suggestionsRef}
                            className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10 absolute w-full max-h-80 transition-all duration-300 animate-fadeIn"
                        >
                            <div className="p-2 border-b sticky top-0 bg-white">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-transparent transition-all"
                                        placeholder="Search suggestions..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            </div>

                            <div className="overflow-y-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                                {filteredSuggestions.length > 0 ? (
                                    <div className="p-2 space-y-1">
                                        {filteredSuggestions.map((suggestion, idx) => {
                                            const selected = isSelected(suggestion);
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSuggestionSelect(suggestion)}
                                                    className={`group w-full text-left px-3 py-2.5 text-sm rounded-md transition-all duration-200 flex items-start gap-2
                                                        ${selected
                                                            ? 'text-teal-700 bg-teal-50 font-medium'
                                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                                                    aria-pressed={selected}
                                                >
                                                    <span className="flex-shrink-0 mt-0.5">
                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors
                                                            ${selected
                                                                ? 'bg-teal-100'
                                                                : 'bg-gray-100 group-hover:bg-teal-50'}`}>
                                                            {selected ? (
                                                                <Check className="w-3.5 h-3.5 text-teal-600" />
                                                            ) : (
                                                                <Plus className="w-3.5 h-3.5 text-gray-500 group-hover:text-teal-500" />
                                                            )}
                                                        </div>
                                                    </span>
                                                    <p className="text-sm flex-1 leading-tight">{suggestion}</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 px-4">
                                        <div className="mb-2 text-gray-400">
                                            <Search className="w-6 h-6 mx-auto opacity-50" />
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium">No suggestions found</p>
                                        <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-2 border-t bg-gray-50 sticky bottom-0">
                                <button
                                    onClick={() => setShowSuggestions(false)}
                                    className="w-full py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
                /* Custom scrollbar styles */
                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 3px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default SmartInputField;