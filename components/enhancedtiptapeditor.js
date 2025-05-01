import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Sparkles, X, ArrowRight, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import WritingAssistantButton from "@/components/WritingAssistantButton";
import { useSuggestionGenerator } from '@/hooks/useSuggestionGenerator';
import TipTapEditor from "@/components/TipTapEditor";
import debounce from 'lodash/debounce';
const EnhancedTipTapEditor = ({
    value,
    onChange,
    title,
    customPrompt,
    suggestions = [],
    onSuggestionClick,
    onSuggestionUnselect,
    isSuggestionSelected,
    showWritingAssistant = true
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
    const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [showAiSuggestions, setShowAiSuggestions] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);
    const [previousTitle, setPreviousTitle] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const editorRef = useRef(null);
    const suggestionsRef = useRef(null);
    const searchInputRef = useRef(null);
    const modalRef = useRef(null);

    // Use the suggestion generator hook
    const {
        suggestions: generatedSuggestions,
        isLoading,
        generateSuggestions
    } = useSuggestionGenerator();

    // Initialize with static suggestions and update with AI suggestions when available
    useEffect(() => {
        if (searchTerm) {
            setFilteredSuggestions(
                [...aiSuggestions, ...suggestions].filter(suggestion =>
                    suggestion.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredSuggestions([...aiSuggestions, ...suggestions]);
        }
    }, [searchTerm, suggestions, aiSuggestions]);

    // Store the title without auto-generating suggestions
    useEffect(() => {
        if (title && title !== previousTitle) {
            setPreviousTitle(title);
            // Removed automatic suggestion generation when title changes
            // Now suggestions will only be generated when user types or clicks the generate button
        }
    }, [title]);

    // Update AI suggestions when generated
    useEffect(() => {
        if (generatedSuggestions.length > 0) {
            setAiSuggestions(generatedSuggestions);
            setIsGeneratingSuggestions(false);
            setShowAiSuggestions(true);
            setTimeout(() => setAnimateIn(true), 100);
        }
    }, [generatedSuggestions]);

    const handleSuggestionClick = (suggestion) => {
        // Toggle behavior: if already selected, unselect it; otherwise, select it
        if (onSuggestionClick && isSuggestionSelected && isSuggestionSelected(suggestion)) {
            // If there's an unselect handler provided, call it
            if (onSuggestionUnselect) {
                onSuggestionUnselect(suggestion);
            }
        } else if (onSuggestionClick) {
            // Otherwise select the suggestion
            onSuggestionClick(suggestion);
        }
    };

    const handleGenerateSuggestions = () => {
        setIsGeneratingSuggestions(true);
        setShowAiSuggestions(true);
        setAnimateIn(false);
        const promptType = customPrompt || `Provide a comprehensive list of at least 8-10 detailed professional descriptions for this job title or search term:`;
        generateSuggestions(title, promptType);
    };

    // Create debounced search handler with 2 second delay
    const debouncedSearchHandler = useRef(
        debounce((searchValue) => {
            if (searchValue.trim().length > 2) {
                setIsGeneratingSuggestions(true);
                setShowAiSuggestions(true);
                const promptType = customPrompt || `Provide a comprehensive list of at least 8-10 detailed professional descriptions related to this search term:`;
                generateSuggestions(searchValue, promptType);
            }
        }, 2000) // 2000ms (2 seconds) delay before triggering the search
    ).current;

    const handleCloseSuggestions = () => {
        setAnimateIn(false);
        setTimeout(() => {
            setShowAiSuggestions(false);
        }, 300); // Match the transition duration
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // Close expanded view when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isExpanded && modalRef.current && !modalRef.current.contains(event.target)) {
                setIsExpanded(false);
            }
        };

        if (isExpanded) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isExpanded]);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isExpanded]);

    return (
        <div className="transition-all duration-300">
            <div className="flex flex-wrap items-center justify-between gap-1 xxs:gap-2 mb-2 xxs:mb-3 px-2">
                <div className='text-lg'>
                    {title}
                </div>
                <button
                    onClick={toggleExpand}
                    className="flex items-center gap-0.5 xxs:gap-1 px-2 xxs:px-3 py-1 xxs:py-1.5 text-[10px] xxs:text-xs font-medium text-gray-100 bg-blue-600 rounded-lg hover:bg-gray-200 hover:text-black transition-all duration-200 animate-pulse hover:animate-none transform hover:scale-105 hover:-translate-y-0.5"
                >
                    <Maximize2 className="h-3 w-3 xxs:h-3.5 xxs:w-3.5" />
                    <span>Expand Editor</span>
                </button>


            </div>

            <div className="flex flex-col md:flex-row gap-2 xxs:gap-3 sm:gap-4">
                {/* Left panel - Suggestions */}

                <div className="w-full md:w-1/2 bg-gray-50 rounded-xl border border-gray-200 p-1.5 xxs:p-2 sm:p-3 h-[280px] xxs:h-[300px] sm:h-[320px] md:h-[350px] lg:h-[380px] overflow-hidden flex flex-col">

                    <div className="flex items-center justify-between mb-1.5 xxs:mb-2">
                        <h3 className="text-[10px] xxs:text-xs sm:text-sm font-medium text-gray-700">Suggestions</h3>
                        <button
                            onClick={handleGenerateSuggestions}
                            disabled={isGeneratingSuggestions}
                            className="flex items-center gap-0.5 xxs:gap-1 px-1.5 xxs:px-2 py-0.5 xxs:py-1 text-[9px] xxs:text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGeneratingSuggestions ? (
                                <>
                                    <Loader2 className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 animate-spin" />
                                    <span className="truncate">Generating...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-2.5 w-2.5 xxs:h-3 xxs:w-3" />
                                    <span className="truncate">Generate AI Suggestions</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="relative mb-1.5 xxs:mb-2">
                        <div className="absolute inset-y-0 left-0 pl-2 xxs:pl-3 flex items-center pointer-events-none">
                            <Search className="h-3 w-3 xxs:h-3.5 xxs:w-3.5 text-gray-400" />
                        </div>
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="block w-full pl-7 xxs:pl-8 pr-2 xxs:pr-3 py-1 xxs:py-1.5 text-[10px] xxs:text-xs sm:text-sm border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            placeholder="Search suggestions..."
                            value={searchTerm}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setSearchTerm(newValue);
                                debouncedSearchHandler(newValue);
                            }}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 space-y-1.5" ref={suggestionsRef}>
                        {filteredSuggestions.length > 0 ? (
                            filteredSuggestions.map((suggestion, index) => {
                                const isSelected = isSuggestionSelected && isSuggestionSelected(suggestion);
                                const isAiSuggestion = aiSuggestions.includes(suggestion);
                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className={`group flex items-center gap-1 xxs:gap-2 px-2 xxs:px-3 py-1.5 xxs:py-2 rounded-lg text-[10px] xxs:text-xs sm:text-sm cursor-pointer transition-all duration-200 transform hover:translate-x-1 ${isSelected ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' : 'bg-white text-gray-700 hover:bg-gray-100 border-l-4 border-transparent'} ${isAiSuggestion ? 'animate-fadeIn' : ''}`}
                                    >
                                        <div className={`flex-shrink-0 w-4 h-4 xxs:w-5 xxs:h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'} transition-colors`}>
                                            {isSelected ? (
                                                <ArrowRight className="h-2.5 w-2.5 xxs:h-3 xxs:w-3" />
                                            ) : (
                                                <Plus className="h-2.5 w-2.5 xxs:h-3 xxs:w-3" />
                                            )}
                                        </div>
                                        <span className="flex-1 line-clamp-2">{suggestion}</span>
                                        {isAiSuggestion && (
                                            <span className="px-1 xxs:px-1.5 py-0.5 text-[8px] xxs:text-[10px] font-medium bg-blue-50 text-blue-600 rounded-full">AI</span>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-4 px-3">
                                {isGeneratingSuggestions ? (
                                    <div className="animate-pulse space-y-3">
                                        <div className="relative">
                                            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto" />
                                            <div className="absolute inset-0 rounded-full animate-ping bg-blue-200 opacity-30"></div>
                                        </div>
                                        <p className="text-sm text-gray-500">Generating AI suggestions...</p>
                                        <p className="text-xs text-gray-400">This may take a few seconds</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-gray-100 p-3 rounded-full mb-3">
                                            <Search className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2">
                                            {searchTerm ? 'No matching suggestions found' : 'No suggestions available'}
                                        </p>
                                        <button
                                            onClick={handleGenerateSuggestions}
                                            className="text-xs text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            Generate with AI
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right panel - Editor */}
                <div className="w-full md:w-1/2 mt-2 xxs:mt-3 md:mt-0" ref={editorRef}>
                    <div className="h-[280px] xxs:h-[300px] sm:h-[320px] md:h-[350px] lg:h-[380px]">
                        <TipTapEditor
                            value={value}
                            onChange={onChange}
                            className="h-full"
                            toolbarButtons={
                                showWritingAssistant && (
                                    <div className="flex items-center">
                                        <div className="w-px h-5 bg-gray-300 mx-1"></div>
                                        <WritingAssistantButton
                                            onSuggestionClick={onSuggestionClick}
                                            title={title || 'description'}
                                            customPrompt={customPrompt || "Provide detailed descriptions:"}
                                            isSuggestionSelected={isSuggestionSelected}
                                            buttonClassName="text-[8px] xxs:text-[10px] xs:text-xs"
                                        />
                                    </div>
                                )
                            }
                        />
                    </div>
                </div>
            </div>
            {/* Expanded Modal View */}
            {isExpanded && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 xxs:p-3 sm:p-4 transition-all duration-300">
                    <div
                        ref={modalRef}
                        className="bg-white rounded-lg xxs:rounded-xl shadow-xl xxs:shadow-2xl w-full max-w-6xl max-h-[95vh] xxs:max-h-[90vh] overflow-hidden transition-all duration-300 transform animate-fadeIn"
                    >
                        <div className="flex items-center justify-between p-2 xxs:p-3 sm:p-4 border-b border-gray-200">
                            <h3 className="text-sm xxs:text-base sm:text-lg font-medium text-gray-800">{title || 'Enhanced Editor'}</h3>
                            <button
                                onClick={toggleExpand}
                                className="p-1.5 xxs:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <Minimize2 className="h-4 w-4 xxs:h-5 xxs:w-5" />
                            </button>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-2 xxs:gap-3 sm:gap-4 p-2 xxs:p-3 sm:p-4 h-[calc(95vh-60px)] xxs:h-[calc(90vh-70px)] sm:h-[calc(90vh-80px)] overflow-hidden">
                            {/* Suggestions panel in modal */}
                            <div className="w-full lg:w-1/2 bg-gray-50 rounded-xl border border-gray-200 p-3 overflow-hidden flex flex-col h-[400px] lg:h-full">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-gray-700">Suggestions</h3>
                                    <button
                                        onClick={handleGenerateSuggestions}
                                        disabled={isGeneratingSuggestions}
                                        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isGeneratingSuggestions ? (
                                            <>
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="h-3 w-3" />
                                                Generate AI Suggestions
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="relative mb-3">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-3.5 w-3.5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                        placeholder="Search suggestions..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            setSearchTerm(newValue);
                                            debouncedSearchHandler(newValue);
                                        }}
                                    />
                                </div>

                                <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                                    {filteredSuggestions.length > 0 ? (
                                        filteredSuggestions.map((suggestion, index) => {
                                            const isSelected = isSuggestionSelected && isSuggestionSelected(suggestion);
                                            const isAiSuggestion = aiSuggestions.includes(suggestion);

                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                    className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-all duration-200 transform hover:translate-x-1 ${isSelected ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' : 'bg-white text-gray-700 hover:bg-gray-100 border-l-4 border-transparent'} ${isAiSuggestion ? 'animate-fadeIn' : ''}`}
                                                >
                                                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'} transition-colors`}>
                                                        {isSelected ? (
                                                            <ArrowRight className="h-3 w-3" />
                                                        ) : (
                                                            <Plus className="h-3 w-3" />
                                                        )}
                                                    </div>
                                                    <span className="flex-1 line-clamp-2">{suggestion}</span>
                                                    {isAiSuggestion && (
                                                        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-600 rounded-full">AI</span>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-center py-4 px-3">
                                            {isGeneratingSuggestions ? (
                                                <div className="animate-pulse space-y-3">
                                                    <div className="relative">
                                                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto" />
                                                        <div className="absolute inset-0 rounded-full animate-ping bg-blue-200 opacity-30"></div>
                                                    </div>
                                                    <p className="text-sm text-gray-500">Generating AI suggestions...</p>
                                                    <p className="text-xs text-gray-400">This may take a few seconds</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="bg-gray-100 p-3 rounded-full mb-3">
                                                        <Search className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <p className="text-sm text-gray-500 mb-2">
                                                        {searchTerm ? 'No matching suggestions found' : 'No suggestions available'}
                                                    </p>
                                                    <button
                                                        onClick={handleGenerateSuggestions}
                                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        Generate with AI
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Editor panel in modal */}
                            <div className="w-full lg:w-1/2 h-[400px] lg:h-full">
                                <div className="h-full">
                                    <TipTapEditor
                                        value={value}
                                        onChange={onChange}
                                        className="h-full min-h-[400px] lg:min-h-full max-h-[calc(100vh-150px)]"
                                        toolbarButtons={
                                            showWritingAssistant && (
                                                <div className="flex items-center">
                                                    <div className="w-px h-5 bg-gray-300 mx-1"></div>
                                                    <WritingAssistantButton
                                                        onSuggestionClick={onSuggestionClick}
                                                        title={title || 'description'}
                                                        customPrompt={customPrompt || "Provide detailed descriptions:"}
                                                        isSuggestionSelected={isSuggestionSelected}
                                                        buttonClassName="text-xs"
                                                    />
                                                </div>
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating AI Suggestions Panel */}
            {showAiSuggestions && (
                <div className={`fixed bottom-2 right-2 xxs:bottom-3 xxs:right-3 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 w-56 xxs:w-64 sm:w-72 md:w-80 bg-white rounded-lg xxs:rounded-xl shadow-lg xxs:shadow-xl border border-gray-200 overflow-hidden z-50 transition-all duration-300 transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="flex items-center justify-between p-3 bg-blue-50 border-b border-blue-100">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-100 p-1.5 rounded-full">
                                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-blue-700">AI Suggestions</span>
                        </div>
                        <button
                            onClick={handleCloseSuggestions}
                            className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="max-h-60 sm:max-h-72 overflow-y-auto p-2 space-y-2">
                        {isGeneratingSuggestions ? (
                            <div className="flex flex-col items-center justify-center py-8 animate-pulse space-y-3">
                                <div className="relative">
                                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                                    <div className="absolute inset-0 rounded-full animate-ping bg-blue-200 opacity-30"></div>
                                </div>
                                <p className="text-sm text-gray-500">Generating suggestions...</p>
                            </div>
                        ) : aiSuggestions.length > 0 ? (
                            aiSuggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="p-2.5 bg-white hover:bg-blue-50 rounded-lg cursor-pointer text-sm text-gray-700 transition-all duration-200 border border-gray-100 hover:border-blue-200 hover:shadow-sm"
                                >
                                    {suggestion}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-sm text-gray-500">No suggestions available</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedTipTapEditor;