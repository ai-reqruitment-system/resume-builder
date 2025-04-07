import React, { useState, useEffect, useRef } from 'react';
import Editor from "react-simple-wysiwyg";
import { Search, Plus, Sparkles, X, ArrowRight, Loader2 } from 'lucide-react';
import WritingAssistantButton from "@/components/WritingAssistantButton";
import { useSuggestionGenerator } from '@/hooks/useSuggestionGenerator';

const EnhancedDescriptionEditor = ({
    value,
    onChange,
    title,
    customPrompt,
    suggestions = [],
    onSuggestionClick,
    isSuggestionSelected,
    showWritingAssistant = true
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
    const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [showAiSuggestions, setShowAiSuggestions] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);
    const editorRef = useRef(null);
    const suggestionsRef = useRef(null);

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
        if (onSuggestionClick) {
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

    const handleCloseSuggestions = () => {
        setAnimateIn(false);
        setTimeout(() => {
            setShowAiSuggestions(false);
        }, 300); // Match the transition duration
    };

    return (
        <div className="p-2 sm:p-3 md:p-2 border-gray-200 rounded-xltransition-all duration-300">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <label className="text-sm sm:text-base font-medium text-gray-800">{title || 'Description'}</label>
                {showWritingAssistant && (
                    <WritingAssistantButton
                        onSuggestionClick={onSuggestionClick}
                        title={title || 'description'}
                        customPrompt={customPrompt || "Provide detailed descriptions:"}
                        isSuggestionSelected={isSuggestionSelected}
                    />
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-2 sm:gap-3 mt-2">
                {/* Left panel - Suggestions */}
                <div className="w-full md:w-2/5 bg-gray-50 rounded-xl border border-gray-200 p-1.5 sm:p-2 md:p-3 h-[250px] sm:h-[280px] md:h-[300px] overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-700">Suggestions</h3>
                        <button
                            onClick={handleGenerateSuggestions}
                            disabled={isGeneratingSuggestions}
                            className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

                    <div className="relative mb-1 sm:mb-1.5">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                            <Search className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-7 pr-2 py-1 text-[11px] sm:text-xs md:text-sm border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            placeholder="Search suggestions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 space-y-1" ref={suggestionsRef}>
                        {filteredSuggestions.length > 0 ? (
                            filteredSuggestions.map((suggestion, index) => {
                                const isSelected = isSuggestionSelected && isSuggestionSelected(suggestion);
                                const isAiSuggestion = aiSuggestions.includes(suggestion);

                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className={`group flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs sm:text-sm font-medium cursor-pointer transition-all duration-200 transform hover:translate-x-1 ${isSelected ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' : 'bg-white text-gray-700 hover:bg-gray-100 border-l-4 border-transparent'} ${isAiSuggestion ? 'animate-fadeIn' : ''}`}
                                    >
                                        <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'} transition-colors`}>
                                            {isSelected ? (
                                                <ArrowRight className="h-2.5 w-2.5" />
                                            ) : (
                                                <Plus className="h-2.5 w-2.5" />
                                            )}
                                        </div>
                                        <span className="flex-1 line-clamp-2 text-xs">{suggestion}</span>
                                        {isAiSuggestion && (
                                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-600 rounded-full">AI</span>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-4 px-3">
                                {isGeneratingSuggestions ? (
                                    <div className="animate-pulse space-y-2">
                                        <Loader2 className="h-6 w-6 text-blue-500 animate-spin mx-auto" />
                                        <p className="text-sm text-gray-500">Generating AI suggestions...</p>
                                        <p className="text-xs text-gray-400">This may take a few seconds</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-gray-100 p-2 rounded-full mb-2">
                                            <Search className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            {searchTerm ? 'No matching suggestions found' : 'No suggestions available'}
                                        </p>
                                        <button
                                            onClick={handleGenerateSuggestions}
                                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
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
                <div className="w-full md:w-3/5 mt-3 md:mt-0" ref={editorRef}>
                    <Editor
                        value={value}
                        onChange={onChange}
                        className="w-full min-h-[250px] sm:min-h-[280px] md:min-h-[300px] border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                    />
                </div>
            </div>

            {/* Floating AI Suggestions Panel */}
            {showAiSuggestions && (
                <div className={`fixed bottom-2 right-2 xs:bottom-3 xs:right-3 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 w-56 xs:w-60 sm:w-64 md:w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 transition-all duration-300 transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="flex items-center justify-between p-1.5 sm:p-2 bg-blue-50 border-b border-blue-100">
                        <div className="flex items-center gap-1.5">
                            <div className="bg-blue-100 p-1 rounded-full">
                                <Sparkles className="h-3 w-3 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-blue-700">AI Suggestions</span>
                        </div>
                        <button
                            onClick={handleCloseSuggestions}
                            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    <div className="max-h-48 sm:max-h-60 overflow-y-auto p-1.5 sm:p-2 space-y-1">
                        {isGeneratingSuggestions ? (
                            <div className="flex flex-col items-center justify-center py-6 animate-pulse space-y-2">
                                <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                                <p className="text-sm text-gray-500">Generating suggestions...</p>
                            </div>
                        ) : aiSuggestions.length > 0 ? (
                            aiSuggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="p-1.5 bg-white hover:bg-blue-50 rounded-lg cursor-pointer text-xs sm:text-sm text-gray-700 transition-all duration-200 border border-gray-100 hover:border-blue-200"
                                >
                                    {suggestion}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-sm text-gray-500">No suggestions available</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedDescriptionEditor;