import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Plus, Sparkles, X, ArrowRight, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { useSuggestionGenerator } from '@/hooks/useSuggestionGenerator';
import debounce from 'lodash/debounce';

const SkillsSelector = ({
    value = [],
    onChange,
    title = 'Skills',
    customPrompt,
    showWritingAssistant = true
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [showAiSuggestions, setShowAiSuggestions] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [proficiencyLevels, setProficiencyLevels] = useState({});

    const suggestionsRef = useRef(null);
    const searchInputRef = useRef(null);
    const modalRef = useRef(null);
    const isInitialMount = useRef(true);
    const prevValueRef = useRef([]);

    // Use the suggestion generator hook
    const {
        suggestions: generatedSuggestions,
        isLoading,
        generateSuggestions
    } = useSuggestionGenerator();

    // Initialize with static suggestions for skills
    const staticSuggestions = [
        'JavaScript', 'React.js', 'Node.js', 'Python',
        'Java', 'SQL', 'AWS', 'Docker', 'Git',
        'TypeScript', 'HTML5', 'CSS3', 'MongoDB'
    ];

    // Extract items from value prop
    const extractValuesFromProp = useCallback((valueProp) => {
        const items = [];
        const levels = {};

        if (Array.isArray(valueProp)) {
            valueProp.forEach(item => {
                if (typeof item === 'object' && item.name) {
                    items.push(item.name);
                    levels[item.name] = item.proficiency || 'Intermediate';
                } else if (typeof item === 'string') {
                    items.push(item);
                    levels[item] = 'Intermediate';
                }
            });
        }

        return { items, levels };
    }, []);

    // Compare two arrays for equality with more robust checking - memoized to prevent recreation on every render
    const areArraysEqual = useCallback((a, b) => {
        if (!a || !b) return false;
        if (a.length !== b.length) return false;

        // Create a map of values for more efficient comparison
        const mapA = a.reduce((acc, val) => {
            const key = typeof val === 'object' && val.name ? val.name : val;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        const mapB = b.reduce((acc, val) => {
            const key = typeof val === 'object' && val.name ? val.name : val;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        // Compare the maps
        const keysA = Object.keys(mapA);
        if (keysA.length !== Object.keys(mapB).length) return false;

        return keysA.every(key => mapA[key] === mapB[key]);
    }, []);

    // Memoize the value comparison function to prevent infinite loops
    const updateFromValueProp = useCallback(() => {
        // Skip when component first mounts to avoid duplicate initialization
        if (isInitialMount.current) {
            const { items, levels } = extractValuesFromProp(value);
            setSelectedItems(items);
            setProficiencyLevels(levels);
            prevValueRef.current = JSON.parse(JSON.stringify(value)); // Deep copy to avoid reference issues
            isInitialMount.current = false;
            return;
        }

        // Use JSON stringify for deep comparison to prevent unnecessary updates
        const prevValueJSON = JSON.stringify(prevValueRef.current);
        const currentValueJSON = JSON.stringify(value);

        if (prevValueJSON !== currentValueJSON) {
            // Only update if the values are actually different
            const { items, levels } = extractValuesFromProp(value);
            setSelectedItems(items);
            setProficiencyLevels(levels);
            prevValueRef.current = JSON.parse(JSON.stringify(value)); // Deep copy to avoid reference issues
        }
    }, [value, extractValuesFromProp]);

    // Initialize from value prop
    useEffect(() => {
        updateFromValueProp();
    }, [updateFromValueProp]); // Only depend on the memoized function

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

    // Function to format data for the onChange callback
    const formatDataForCallback = useCallback((items, levels) => {
        return items.map(item => ({
            name: item,
            proficiency: levels[item] || 'Intermediate'
        }));
    }, []);

    const handleSuggestionClick = useCallback((suggestion) => {
        if (!selectedItems.includes(suggestion)) {
            const newItems = [...selectedItems, suggestion];
            const newProficiency = {
                ...proficiencyLevels,
                [suggestion]: 'Intermediate'
            };

            setSelectedItems(newItems);
            setProficiencyLevels(newProficiency);

            // Format data for backend
            const formattedData = formatDataForCallback(newItems, newProficiency);
            onChange(formattedData);
        }
    }, [selectedItems, proficiencyLevels, onChange, formatDataForCallback]);

    const handleRemoveItem = useCallback((itemToRemove) => {
        const newItems = selectedItems.filter(item => item !== itemToRemove);
        const newProficiency = { ...proficiencyLevels };
        delete newProficiency[itemToRemove];

        setSelectedItems(newItems);
        setProficiencyLevels(newProficiency);

        // Format data for backend
        const formattedData = formatDataForCallback(newItems, newProficiency);
        onChange(formattedData);
    }, [selectedItems, proficiencyLevels, onChange, formatDataForCallback]);

    const handleProficiencyChange = useCallback((item, level) => {
        const newProficiency = { ...proficiencyLevels, [item]: level };
        setProficiencyLevels(newProficiency);

        // Format data for backend
        const formattedData = formatDataForCallback(selectedItems, newProficiency);
        onChange(formattedData);
    }, [selectedItems, proficiencyLevels, onChange, formatDataForCallback]);

    const handleGenerateSuggestions = useCallback(() => {
        setIsGeneratingSuggestions(true);
        setShowAiSuggestions(true);
        setAnimateIn(false);
        const promptType = customPrompt ||
            `Generate a list of technical skills and tools as single words (no descriptions or explanations). Focus on ${title}. Example format: JavaScript, React, Node.js`;
        generateSuggestions(title, promptType);
    }, [customPrompt, generateSuggestions, title]);

    // Create debounced search handler
    const debouncedSearchHandler = useRef(
        debounce((searchValue) => {
            if (searchValue.trim().length > 2) {
                setIsGeneratingSuggestions(true);
                setShowAiSuggestions(true);
                const promptType = customPrompt ||
                    `Generate a list of technical skills and tools that match "${searchValue}". Return only names as single words or short phrases, no descriptions. Example format: JavaScript, React, Node.js`;
                generateSuggestions(searchValue, promptType);
            }
        }, 1000)
    ).current;

    const toggleExpand = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

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
                            placeholder={`Search skills...`}
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
                        Selected Skills
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
        </div>
    );
};

export default SkillsSelector;