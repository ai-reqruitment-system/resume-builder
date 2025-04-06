import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Loader2, ChevronDown, Search } from 'lucide-react';
import { useSuggestionGenerator } from '@/hooks/useSuggestionGenerator';
import debounce from 'lodash/debounce';

export default function SuggestionDropdown({ onSuggestionClick, title = 'professional summary', customPrompt = null, isSuggestionSelected }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [previousTitle, setPreviousTitle] = useState(title);
    const [searchTerm, setSearchTerm] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(null);
    const dropdownRef = useRef(null);
    const {
        suggestions,
        isLoading,
        generateSuggestions,
        setSuggestions
    } = useSuggestionGenerator();

    // Generate suggestions when dropdown is opened
    const handleDropdownToggle = () => {
        const newState = !isDropdownOpen;
        setIsDropdownOpen(newState);

        if (newState) {
            if (previousTitle !== title || suggestions.length === 0) {
                if (previousTitle !== title) {
                    setSuggestions([]);
                }
                setPreviousTitle(title);
                const promptType = customPrompt || `Provide a comprehensive list of at least 8-10 detailed professional summary phrases for a resume based on the role:`;
                generateSuggestions(title, promptType);
            }
        }
    };

    // Regenerate suggestions when title changes while dropdown is open
    useEffect(() => {
        if (isDropdownOpen && title) {
            setSuggestions([]);
            setPreviousTitle(title);
            const promptType = customPrompt || `Provide a comprehensive list of at least 8-10 detailed professional summary phrases for a resume based on the role:`;
            generateSuggestions(title, promptType);
        }
    }, [title]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
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

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleDropdownToggle}
                className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-300"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
            >
                <Plus className="w-4 h-4" />
                Get help with writing
                <ChevronDown className={`w-4 h-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fadeIn">
                    <div className="flex justify-between items-center p-2 border-b">
                        <span className="text-sm font-medium text-gray-700">Suggested phrases for {title}</span>
                        <button
                            onClick={() => setIsDropdownOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-2 border-b">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search suggestions..."
                                value={searchTerm}
                                onChange={(e) => {
                                    const newSearchTerm = e.target.value;
                                    setSearchTerm(newSearchTerm);

                                    // Direct call to generateSuggestions which now has debounce built-in
                                    if (newSearchTerm.trim()) {
                                        const promptType = customPrompt || `Provide a comprehensive list of at least 8-10 detailed professional summary phrases for a resume based on the role:`;
                                        generateSuggestions(newSearchTerm, promptType);
                                    } else if (title) {
                                        const promptType = customPrompt || `Provide a comprehensive list of at least 8-10 detailed professional summary phrases for a resume based on the role:`;
                                        generateSuggestions(title, promptType);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-4">
                                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                <span className="ml-2 text-sm text-gray-600">Generating suggestions...</span>
                            </div>
                        ) : suggestions.length > 0 ? (
                            suggestions
                                .filter(suggestion =>
                                    searchTerm === '' || suggestion.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((suggestion, index) => {
                                    const isSelected = isSuggestionSelected ? isSuggestionSelected(suggestion) : false;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                onSuggestionClick(suggestion);
                                            }}
                                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 flex items-center gap-2
                                                ${isSelected ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                                        >
                                            <Plus className={`w-3 h-3 ${isSelected ? 'text-blue-600' : 'text-blue-500'}`} />
                                            {suggestion}
                                        </button>
                                    );
                                })
                        ) : (
                            <div className="text-center py-3 text-sm text-gray-500">
                                No suggestions available
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}