import React, { useState, useEffect } from 'react';
import Editor from "react-simple-wysiwyg";
import { Search, Plus } from 'lucide-react';
import WritingAssistantButton from "@/components/WritingAssistantButton";

const DescriptionEditor = ({
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

    useEffect(() => {
        if (searchTerm) {
            setFilteredSuggestions(
                suggestions.filter(suggestion =>
                    suggestion.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredSuggestions(suggestions);
        }
    }, [searchTerm, suggestions]);

    const handleSuggestionClick = (suggestion) => {
        if (onSuggestionClick) {
            onSuggestionClick(suggestion);
        }
    };

    return (
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
            <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">{title || 'Description'}</label>
                {showWritingAssistant && (
                    <WritingAssistantButton
                        onSuggestionClick={onSuggestionClick}
                        title={title || 'description'}
                        customPrompt={customPrompt || "Provide detailed descriptions:"}
                        isSuggestionSelected={isSuggestionSelected}
                    />
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-3">
                {/* Left panel - Suggestions */}
                <div className="w-full md:w-2/5 bg-white rounded-lg border border-gray-200 p-3 h-[300px] overflow-y-auto">
                    <div className="relative mb-3">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm
                                placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                            placeholder="Search skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        {filteredSuggestions.length > 0 ? (
                            filteredSuggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium 
                                        cursor-pointer transition-all duration-200 ${isSuggestionSelected && isSuggestionSelected(suggestion)
                                            ? 'bg-teal-100 text-teal-700'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    {suggestion}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500 text-sm">
                                {searchTerm ? 'No matching suggestions found' : 'No suggestions available'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right panel - Editor */}
                <div className="w-full md:w-3/5">
                    <Editor
                        value={value}
                        onChange={onChange}
                        className="w-full min-h-[300px] border border-gray-200 rounded-lg
                            focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500
                            transition-all duration-300 bg-white"
                    />
                </div>
            </div>
        </div>
    );
};

export default DescriptionEditor;