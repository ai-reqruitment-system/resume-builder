import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Loader2, ChevronDown, Search, Check } from 'lucide-react';
import { useSuggestionGenerator } from '@/hooks/useSuggestionGenerator';
import debounce from 'lodash/debounce';

export default function EnhancedSuggestionDropdown({
    onSuggestionClick,
    title = 'professional summary',
    customPrompt = null,
    isSuggestionSelected,
    buttonClassName = ""
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [previousTitle, setPreviousTitle] = useState(title);
    const [searchTerm, setSearchTerm] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const inputRef = useRef(null);

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
            // Focus the search input when dropdown opens
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 100);

            if (previousTitle !== title || suggestions.length === 0) {
                if (previousTitle !== title) {
                    setSuggestions([]);
                }
                setPreviousTitle(title);
                const promptType = customPrompt || `Provide a comprehensive list of at least 8-10 detailed professional summary phrases for a resume based on the role:`;
                generateSuggestions(title, promptType);
            }

            // Calculate dropdown position
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                const isNearRightEdge = window.innerWidth - rect.right < 320; // 320px is dropdown width

                setDropdownPosition({
                    top: rect.height + 8, // 8px gap
                    right: isNearRightEdge ? 0 : 'auto',
                    left: isNearRightEdge ? 'auto' : 0
                });
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

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }

        // Handle escape key to close dropdown
        function handleEscKey(event) {
            if (event.key === 'Escape') {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscKey);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscKey);
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, [typingTimeout]);

    // Handle search input changes
    const handleSearchChange = (e) => {
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
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                ref={buttonRef}
                onClick={handleDropdownToggle}
                className={`flex items-center gap-0.5 xxs:gap-1 xs:gap-1.5 sm:gap-2 px-1 xxs:px-2 xs:px-3 sm:px-4 py-0.5 xxs:py-1 xs:py-1.5 sm:py-2 text-[8px] xxs:text-xs xs:text-sm text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-all duration-300 ${buttonClassName}`}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-label="Open suggestions dropdown"
            >
                <Plus className="w-2 h-2 xxs:w-3 xxs:h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">Get help with writing</span>
                <ChevronDown className={`w-2 h-2 xxs:w-3 xxs:h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <div
                className={`absolute mt-2 w-48 xxs:w-56 xs:w-64 sm:w-72 md:w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-all duration-300 overflow-hidden ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                style={{
                    top: dropdownPosition.top,
                    right: dropdownPosition.right,
                    left: dropdownPosition.left,
                    maxHeight: isDropdownOpen ? '400px' : '0',
                    transformOrigin: 'top right'
                }}
                role="dialog"
                aria-label="Suggestions dropdown"
            >
                <div className="flex justify-between items-center p-2 xxs:p-3 border-b sticky top-0 bg-white z-10">
                    <span className="text-xs xxs:text-sm font-medium text-gray-700">Suggestions for {title}</span>
                    <button
                        onClick={() => setIsDropdownOpen(false)}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close suggestions"
                    >
                        <X className="w-3 h-3 xxs:w-4 xxs:h-4" />
                    </button>
                </div>

                <div className="p-3 border-b sticky top-12 bg-white z-10">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            placeholder="Search suggestions..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            aria-label="Search suggestions"
                        />
                    </div>
                </div>

                <div className="p-2 space-y-1 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-6">
                            <div className="relative">
                                <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
                                <div className="absolute inset-0 rounded-full animate-ping bg-teal-200 opacity-30"></div>
                            </div>
                            <span className="ml-3 text-sm font-medium text-gray-600">Generating suggestions...</span>
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
                                            // Don't close dropdown after selection to allow multiple selections
                                        }}
                                        className={`group w-full text-left px-3 py-2.5 text-sm rounded-md transition-all duration-200 flex items-start gap-2
                                            ${isSelected
                                                ? 'text-teal-700 bg-teal-50 font-medium'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                                        aria-pressed={isSelected}
                                    >
                                        <span className="flex-shrink-0 mt-0.5">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors
                                                ${isSelected
                                                    ? 'bg-teal-100'
                                                    : 'bg-gray-100 group-hover:bg-teal-50'}`}>
                                                {isSelected ? (
                                                    <Check className="w-3.5 h-3.5 text-teal-600" />
                                                ) : (
                                                    <Plus className="w-3.5 h-3.5 text-gray-500 group-hover:text-teal-500" />
                                                )}
                                            </div>
                                        </span>
                                        <p className="text-sm flex-1 leading-tight">{suggestion}</p>
                                    </button>
                                );
                            })
                    ) : (
                        <div className="text-center py-8 px-4">
                            <div className="mb-2 text-gray-400">
                                <Search className="w-6 h-6 mx-auto opacity-50" />
                            </div>
                            <p className="text-sm text-gray-500 font-medium">No suggestions found</p>
                            <p className="text-xs text-gray-400 mt-1">Try a different search term or role</p>
                        </div>
                    )}
                </div>

                {suggestions.length > 0 && (
                    <div className="p-2 border-t bg-gray-50 sticky bottom-0">
                        <button
                            onClick={() => setIsDropdownOpen(false)}
                            className="w-full py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>

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
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; transform: scale(1); }
                    to { opacity: 0; transform: scale(0.95); }
                }
            `}</style>
        </div>
    );
}