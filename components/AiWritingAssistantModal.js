import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, Search, Check, Sparkles, MessageSquare, Copy, ArrowRight, Lightbulb, Star, Bookmark, Zap, Briefcase } from 'lucide-react';
import { useSuggestionGenerator } from '@/hooks/useSuggestionGenerator';
import debounce from 'lodash/debounce';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiWritingAssistantModal({
    isOpen,
    onClose,
    onSuggestionClick,
    title = 'professional summary',
    customPrompt = null,
    isSuggestionSelected
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const modalRef = useRef(null);
    const inputRef = useRef(null);

    const {
        suggestions,
        isLoading,
        generateSuggestions,
        setSuggestions
    } = useSuggestionGenerator();

    // Only focus the input when modal is opened, but don't auto-generate suggestions
    useEffect(() => {
        if (isOpen) {
            // Focus the search input when modal opens
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 100);

            // Clear previous suggestions
            setSuggestions([]);
            // No longer auto-generating suggestions when modal opens
            // User must type in search field or click generate button to get suggestions
        }
    }, [isOpen, setSuggestions]); // Only depend on isOpen and setSuggestions

    // Handle click outside to close modal
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }

        // Handle escape key to close modal
        function handleEscKey(event) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscKey);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscKey);
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, [isOpen, onClose, typingTimeout]);

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

    const toggleFavorite = (suggestion) => {
        setFavorites(prev => {
            if (prev.includes(suggestion)) {
                return prev.filter(item => item !== suggestion);
            } else {
                return [...prev, suggestion];
            }
        });
    };

    // Filter suggestions based on active category and search term
    const filteredSuggestions = suggestions.filter(suggestion => {
        // First filter by search term
        const matchesSearch = searchTerm === '' || suggestion.toLowerCase().includes(searchTerm.toLowerCase());

        // Then filter by category
        if (!matchesSearch) return false;

        if (activeCategory === 'all') return true;
        if (activeCategory === 'favorites') return favorites.includes(suggestion);

        // For demo purposes, categorize based on length and content
        if (activeCategory === 'concise') return suggestion.length < 80;
        if (activeCategory === 'professional') return suggestion.includes('professional') || suggestion.includes('experienced');
        if (activeCategory === 'creative') return suggestion.includes('creative') || suggestion.includes('innovative');
        if (activeCategory === 'impactful') return suggestion.includes('results') || suggestion.includes('achieved');

        return true;
    });

    // Categorize suggestions with more meaningful categories
    const categories = [
        { id: 'all', name: 'All Suggestions', icon: Sparkles, color: 'blue' },
        { id: 'professional', name: 'Professional', icon: Briefcase, color: 'blue' },
        { id: 'concise', name: 'Concise', icon: Zap, color: 'amber' },
        { id: 'creative', name: 'Creative', icon: Lightbulb, color: 'purple' },
        { id: 'impactful', name: 'Impactful', icon: Star, color: 'orange' },
        { id: 'favorites', name: 'Favorites', icon: Bookmark, color: 'rose' },
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto"
                >
                    <motion.div
                        ref={modalRef}
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
                        style={{ maxHeight: '90vh', width: 'calc(100% - 16px)' }}
                    >
                        {/* Header */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="flex justify-between items-center p-3 sm:p-5 border-b sticky top-0 bg-white z-10 rounded-t-xl bg-gradient-to-r from-blue-700 to-blue-800 text-white"
                        >
                            <div className="flex items-center space-x-3">
                                <motion.div
                                    initial={{ rotate: -10, scale: 0.8 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: 0.2
                                    }}
                                    className="bg-blue-500 p-2 rounded-lg shadow-inner"
                                >
                                    <Sparkles className="h-5 w-5 text-blue-900" />
                                </motion.div>
                                <div>
                                    <h3 className="text-lg font-bold">AI Writing Assistant</h3>
                                    <p className="text-sm text-blue-100">Smart suggestions for {title}</p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                onClick={onClose}
                                className="text-blue-100 hover:text-white p-2 rounded-full hover:bg-blue-600/30 transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </motion.div>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="p-5 border-b sticky top-[72px] bg-white z-10"
                        >
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            duration: 2
                                        }}
                                    >
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </motion.div>
                                </div>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                    placeholder="Search for suggestions or describe what you need..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    aria-label="Search suggestions"
                                />
                            </div>
                        </motion.div>

                        {/* Category Tabs */}
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="px-5 pt-4 pb-2 border-b overflow-x-auto hide-scrollbar"
                        >
                            <div className="flex space-x-2">
                                {categories.map((category, index) => {
                                    const Icon = category.icon;
                                    const isActive = activeCategory === category.id;
                                    const colorClasses = isActive
                                        ? `bg-${category.color}-100 text-${category.color}-800 border-${category.color}-200`
                                        : 'text-gray-600 hover:bg-gray-100 border-transparent';

                                    return (
                                        <motion.button
                                            key={category.id}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + (index * 0.05) }}
                                            whileHover={{ y: -2 }}
                                            whileTap={{ y: 0 }}
                                            onClick={() => setActiveCategory(category.id)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-all border ${isActive ?
                                                category.id === 'all' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                    category.id === 'professional' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                        category.id === 'concise' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                                            category.id === 'creative' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                                                                category.id === 'impactful' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                                                    'bg-rose-100 text-rose-800 border-rose-200'
                                                : 'text-gray-600 hover:bg-gray-100 border-transparent'} ${isActive ? 'shadow-sm' : ''}`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ?
                                                category.id === 'all' ? 'text-blue-500' :
                                                    category.id === 'professional' ? 'text-blue-500' :
                                                        category.id === 'concise' ? 'text-amber-500' :
                                                            category.id === 'creative' ? 'text-purple-500' :
                                                                category.id === 'impactful' ? 'text-orange-500' :
                                                                    'text-rose-500'
                                                : ''}`} />
                                            <span>{category.name}</span>
                                            {category.id === 'favorites' && favorites.length > 0 && (
                                                <span className="bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1">
                                                    {favorites.length}
                                                </span>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Suggestions Content */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="p-5 space-y-3 max-h-[calc(90vh-250px)] overflow-y-auto"
                        >
                            {isLoading ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-center items-center py-10"
                                >
                                    <div className="relative">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 1.5,
                                                ease: "linear"
                                            }}
                                        >
                                            <Loader2 className="w-8 h-8 text-blue-500" />
                                        </motion.div>
                                        <div className="absolute inset-0 rounded-full animate-ping bg-blue-200 opacity-30"></div>
                                    </div>
                                    <motion.span
                                        animate={{
                                            opacity: [0.7, 1, 0.7]
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 2
                                        }}
                                        className="ml-4 text-base font-medium text-gray-600"
                                    >
                                        Generating intelligent suggestions...
                                    </motion.span>
                                </motion.div>
                            ) : filteredSuggestions.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3">
                                    {filteredSuggestions.map((suggestion, index) => {
                                        const isSelected = isSuggestionSelected ? isSuggestionSelected(suggestion) : false;
                                        const isFavorite = favorites.includes(suggestion);

                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 + (index * 0.05) }}
                                                whileHover={{ scale: 1.01 }}
                                                className={`group p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${isSelected ? 'bg-blue-50 border-blue-200' : 'border-gray-200 hover:border-blue-200'}`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <p className="text-gray-800 flex-1">{suggestion}</p>
                                                    <div className="flex space-x-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => toggleFavorite(suggestion)}
                                                            className={`p-2 rounded-full transition-all ${isFavorite
                                                                ? 'bg-rose-100 text-rose-500'
                                                                : 'bg-gray-100 text-gray-400 hover:bg-rose-50 hover:text-rose-400'}`}
                                                            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                                                        >
                                                            <Bookmark className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => onSuggestionClick(suggestion)}
                                                            className={`p-2 rounded-full transition-all ${isSelected
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600'}`}
                                                            aria-label={isSelected ? "Suggestion selected" : "Use this suggestion"}
                                                        >
                                                            {isSelected ? (
                                                                <Check className="w-4 h-4" />
                                                            ) : (
                                                                <ArrowRight className="w-4 h-4" />
                                                            )}
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-10"
                                >
                                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-700 mb-2">No suggestions found</h3>
                                    <p className="text-gray-500 max-w-md mx-auto">
                                        Try adjusting your search or describe what kind of content you're looking for.
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Footer */}
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="p-4 border-t bg-gray-50 rounded-b-xl"
                        >
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-500">
                                    Powered by AI to help you create professional content
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Close
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}