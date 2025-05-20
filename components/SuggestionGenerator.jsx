import React from 'react';
import { useSuggestionGenerator } from '@/hooks/useSuggestionGenerator';
import { Sparkles, Plus } from 'lucide-react';

const SuggestionGenerator = ({
                                 onSelect,
                                 customPrompt,
                                 placeholder = "Search for suggestions...",
                                 className = "",
                             }) => {
    const {
        suggestions,
        isLoading,
        generateSuggestions
    } = useSuggestionGenerator();

    return (
        <div className={`w-full ${className}`}>
            {/* Generate Button */}
            <button
                onClick={() => generateSuggestions(customPrompt)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-teal-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
                <Sparkles className="w-4 h-4" />
                {isLoading ? 'Generating suggestions...' : 'Generate suggestions'}
            </button>

            {/* Suggestions Panel */}
            {suggestions.length > 0 && (
                <div className="mt-3 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Suggested Descriptions:</span>
                        <span className="text-xs text-gray-500">Click to add to summary</span>
                    </div>

                    {/* Suggestions List */}
                    <div className="divide-y divide-gray-100 max-h-[240px] overflow-y-auto scrollbar-custom">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => onSelect(suggestion)}
                                className="w-full px-4 py-3 flex items-start gap-3 hover:bg-teal-50/50 transition-colors group text-left"
                            >
                                <div className="flex-shrink-0 mt-0.5">
                                    <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                                        <Plus className="w-3.5 h-3.5 text-teal-600" />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 group-hover:text-gray-900 flex-1 transition-colors">
                                    {suggestion}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <style jsx>{`
                .scrollbar-custom::-webkit-scrollbar {
                    width: 8px;
                }
                .scrollbar-custom::-webkit-scrollbar-track {
                    background: #f8fafc;
                }
                .scrollbar-custom::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 4px;
                }
                .scrollbar-custom::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
};

export default SuggestionGenerator;