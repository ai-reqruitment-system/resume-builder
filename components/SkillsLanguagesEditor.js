import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Sparkles, X, ArrowRight, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import TipTapEditor from '@/components/TipTapEditor';
import { useSuggestionGenerator } from '@/hooks/useSuggestionGenerator';
import debounce from 'lodash/debounce';

const SkillsLanguagesEditor = ({
    value = [],
    onChange,
    title,
    customPrompt,
    type = 'skills', // 'skills' or 'languages'
    showWritingAssistant = true
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [showAiSuggestions, setShowAiSuggestions] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedItems, setSelectedItems] = useState(value || []);
    const [proficiencyLevels, setProficiencyLevels] = useState({});

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

    // Initialize with static suggestions based on type
    const staticSuggestions = type === 'skills' ? [
        'JavaScript', 'React.js', 'Node.js', 'Python',
        'Java', 'SQL', 'AWS', 'Docker', 'Git',
        'TypeScript', 'HTML5', 'CSS3', 'MongoDB'
    ] : [
        'English', 'Spanish', 'French', 'German',
        'Chinese', 'Japanese', 'Korean', 'Russian',
        'Arabic', 'Portuguese', 'Italian', 'Hindi'
    ];

    // Update filtered suggestions when search term changes
    useEffect(() => {
        if (searchTerm) {
            setFilteredSuggestions(
                [...aiSuggestions, ...staticSuggestions].filter(suggestion =>
                    suggestion.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredSuggestions([...aiSuggestions, ...staticSuggestions]);
        }
    }, [searchTerm, staticSuggestions, aiSuggestions]);

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
        if (!selectedItems.includes(suggestion)) {
            const newItems = [...selectedItems, suggestion];
            setSelectedItems(newItems);
            const newProficiency = { ...proficiencyLevels, [suggestion]: 'Intermediate' };
            setProficiencyLevels(newProficiency);

            // Format data for backend
            const formattedData = newItems.map(item => ({
                name: item,
                proficiency: newProficiency[item] || 'Intermediate'
            }));

            onChange(formattedData);
        }
    };

    const handleRemoveItem = (itemToRemove) => {
        const newItems = selectedItems.filter(item => item !== itemToRemove);
        setSelectedItems(newItems);
        const newProficiency = { ...proficiencyLevels };
        delete newProficiency[itemToRemove];
        setProficiencyLevels(newProficiency);

        // Format data for backend
        const formattedData = newItems.map(item => ({
            name: item,
            proficiency: newProficiency[item] || 'Intermediate'
        }));

        onChange(formattedData);
    };

    const handleProficiencyChange = (item, level) => {
        const newProficiency = { ...proficiencyLevels, [item]: level };
        setProficiencyLevels(newProficiency);

        // Format data for backend
        const formattedData = selectedItems.map(item => ({
            name: item,
            proficiency: newProficiency[item] || 'Intermediate'
        }));

        onChange(formattedData);
    };

    const handleGenerateSuggestions = () => {
        setIsGeneratingSuggestions(true);
        setShowAiSuggestions(true);
        setAnimateIn(false);
        const promptType = customPrompt ||
            `Generate a list of ${type === 'skills' ? 'technical skills and tools' : 'languages'} as single words or short phrases (no descriptions or explanations). Focus on ${title || type}. Example format: JavaScript, React, Node.js`;
        generateSuggestions(title || type, promptType);
    };

    // Create debounced search handler
    const debouncedSearchHandler = useRef(
        debounce((searchValue) => {
            if (searchValue.trim().length > 2) {
                setIsGeneratingSuggestions(true);
                setShowAiSuggestions(true);
                const promptType = customPrompt ||
                    `Generate a list of ${type === 'skills' ? 'technical skills and tools' : 'languages'} that match "${searchValue}". Return only names as single words or short phrases, no descriptions. Example format: JavaScript, React, Node.js`;
                generateSuggestions(searchValue, promptType);
            }
        }, 1000)
    ).current;

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

    return (
        <div className="transition-all duration-300">
            <div className="flex flex-wrap items-center justify-between gap-1 xxs:gap-2 mb-2 xxs:mb-3">

                <span className='text-[14px] xxs:text-base sm:text-lg md:text-xl font-semibold'>{title}</span>
                <button
                    onClick={toggleExpand}
                    className="flex items-center gap-0.5 xxs:gap-1 px-1.5 xxs:px-2 sm:px-3 py-0.5 xxs:py-1 sm:py-1.5 text-[8px] xxs:text-[10px] sm:text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200"
                >
                    <Maximize2 className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 sm:h-3.5 sm:w-3.5" />
                    <span>Expand Editor</span>
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-1.5 xxs:gap-2 sm:gap-3 md:gap-4">
                {/* Left panel - Suggestions */}
                <div className="w-full md:w-1/2 bg-gray-50 rounded-xl border border-gray-200 p-1 xxs:p-1.5 sm:p-2 md:p-3 h-[260px] xxs:h-[280px] sm:h-[300px] md:h-[320px] lg:h-[350px] overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-1 xxs:mb-1.5 sm:mb-2">
                        <h3 className="text-[8px] xxs:text-[10px] sm:text-xs font-medium text-gray-700">Suggestions</h3>
                        <button
                            onClick={handleGenerateSuggestions}
                            disabled={isGeneratingSuggestions}
                            className="flex items-center gap-0.5 xxs:gap-1 px-1 xxs:px-1.5 sm:px-2 py-0.5 text-[8px] xxs:text-[9px] sm:text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGeneratingSuggestions ? (
                                <>
                                    <Loader2 className="h-2 w-2 xxs:h-2.5 xxs:w-2.5 sm:h-3 sm:w-3 animate-spin" />
                                    <span className="truncate">Generating...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-2 w-2 xxs:h-2.5 xxs:w-2.5 sm:h-3 sm:w-3" />
                                    <span className="truncate">Generate AI Suggestions</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="relative mb-1 xxs:mb-1.5 sm:mb-2">
                        <div className="absolute inset-y-0 left-0 pl-1.5 xxs:pl-2 sm:pl-3 flex items-center pointer-events-none">
                            <Search className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 sm:h-3.5 sm:w-3.5 text-gray-400" />
                        </div>
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="block w-full pl-6 xxs:pl-7 sm:pl-8 pr-2 xxs:pr-2.5 sm:pr-3 py-0.5 xxs:py-1 sm:py-1.5 text-[8px] xxs:text-[10px] sm:text-xs border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            placeholder={`Search ${type}...`}
                            value={searchTerm}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setSearchTerm(newValue);
                                debouncedSearchHandler(newValue);
                            }}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 space-y-1 xxs:space-y-1.5" ref={suggestionsRef}>
                        {filteredSuggestions.map((suggestion, index) => {
                            const isSelected = selectedItems.includes(suggestion);
                            const isAiSuggestion = aiSuggestions.includes(suggestion);

                            return (
                                <div
                                    key={index}
                                    onClick={() => !isSelected && handleSuggestionClick(suggestion)}
                                    className={`group flex items-center gap-0.5 xxs:gap-1 sm:gap-2 px-1.5 xxs:px-2 sm:px-3 py-1 xxs:py-1.5 sm:py-2 rounded-lg text-[8px] xxs:text-[10px] sm:text-xs cursor-pointer transition-all duration-200 transform hover:translate-x-1 ${isSelected
                                            ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border-l-4 border-transparent'
                                        } ${isAiSuggestion ? 'animate-fadeIn' : ''}`}
                                >
                                    <div
                                        className={`flex-shrink-0 w-3 h-3 xxs:w-4 xxs:h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                                            } transition-colors`}
                                    >
                                        {isSelected ? (
                                            <ArrowRight className="h-2 w-2 xxs:h-2.5 xxs:w-2.5 sm:h-3 sm:w-3" />
                                        ) : (
                                            <Plus className="h-2 w-2 xxs:h-2.5 xxs:w-2.5 sm:h-3 sm:w-3" />
                                        )}
                                    </div>
                                    <span className="flex-1 line-clamp-2">{suggestion}</span>
                                    {isAiSuggestion && (
                                        <span className="px-1 xxs:px-1.5 py-0.5 text-[6px] xxs:text-[8px] sm:text-[10px] font-medium bg-blue-50 text-blue-600 rounded-full">AI</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right panel - Selected Items */}
                <div className="w-full md:w-1/2 bg-white rounded-xl border border-gray-200 p-1 xxs:p-1.5 sm:p-2 md:p-3 h-[260px] xxs:h-[280px] sm:h-[300px] md:h-[320px] lg:h-[350px] overflow-hidden flex flex-col">
                    <h3 className="text-[8px] xxs:text-[10px] sm:text-xs font-medium text-gray-700 mb-1 xxs:mb-1.5 sm:mb-2">
                        Selected {type.charAt(0).toUpperCase() + type.slice(1)}
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-1 xxs:space-y-1.5 sm:space-y-2">
                        {selectedItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between gap-1 xxs:gap-1.5 sm:gap-2 p-1 xxs:p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                                <span className="text-[8px] xxs:text-[10px] sm:text-xs text-gray-700">{item}</span>
                                <button
                                    onClick={() => handleRemoveItem(item)}
                                    className="p-0.5 xxs:p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 sm:h-4 sm:w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SkillsLanguagesEditor;