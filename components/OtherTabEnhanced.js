import React, { useEffect, useState } from "react";
import ContentItem from "@/components/ContentItem";
import EnhancedDescriptionEditor from "@/components/EnhancedDescriptionEditor";
import { Plus } from 'lucide-react';
import EnhancedTipTapEditor from "./enhancedtiptapeditor";

const OtherTabEnhanced = ({
    formData,
    updateFormData,
    activeIndex,
    setActiveIndex
}) => {
    // Common achievement description suggestions
    const achievementSuggestions = [
        "Received award for outstanding performance",
        "Recognized as top performer in the organization",
        "Published research paper in industry journal",
        "Completed specialized certification in...",
        "Led volunteer initiative that impacted...",
        "Organized community event with X participants",
        "Delivered keynote presentation at industry conference",
        "Developed innovative solution that improved...",
        "Mentored junior professionals in the field",
        "Served on advisory board for...",
        "Contributed to industry standards development",
        "Secured grant funding for special project",
        "Implemented cost-saving measures resulting in...",
        "Recognized with leadership excellence award",
        "Spearheaded initiative that resulted in..."
    ];

    useEffect(() => {
        if (!formData.other_title?.length) {
            initializeEmptyOther();
        }
    }, []);

    const initializeEmptyOther = () => {
        updateFormData('other_title', ['']);
        updateFormData('other_description', ['']);
    };

    const handleSuggestionClick = (suggestion, index) => {
        const currentContent = formData.other_description[index] || '';
        const bulletPoint = `<ul><li>${suggestion}</li></ul>`;

        let newContent;
        if (!currentContent) {
            newContent = bulletPoint;
        } else if (currentContent.includes('</ul>')) {
            // Check if suggestion already exists
            if (isSuggestionSelected(suggestion, index)) {
                // Remove the suggestion
                newContent = currentContent.replace(`<li>${suggestion}</li>`, '');
                // Clean up empty ul tags
                newContent = newContent.replace(/<ul>\s*<\/ul>/, '');
            } else {
                // Add new suggestion
                newContent = currentContent.replace('</ul>', `<li>${suggestion}</li></ul>`);
            }
        } else {
            newContent = currentContent + bulletPoint;
        }

        const newArray = [...formData.other_description];
        newArray[index] = newContent;
        updateFormData('other_description', newArray);
    };

    const handleSuggestionUnselect = (suggestion, index) => {
        const currentContent = formData.other_description[index] || '';

        // If the suggestion is in a list item
        if (currentContent.includes(`<li>${suggestion}</li>`)) {
            // Remove the list item containing the suggestion
            let newContent = currentContent.replace(`<li>${suggestion}</li>`, '');

            // If this was the only list item, remove the entire ul element
            if (!newContent.includes('<li>')) {
                newContent = newContent.replace('<ul></ul>', '');
            }

            // Update the form data with the modified content
            const newArray = [...formData.other_description];
            newArray[index] = newContent;
            updateFormData('other_description', newArray);
        }
    };

    const isSuggestionSelected = (suggestion, index) => {
        const content = formData.other_description[index] || '';
        return content.includes(suggestion);
    };

    const removeItem = (index, type, e) => {
        e.stopPropagation();
        if (!formData.other_title?.length || formData.other_title.length <= 1) return;

        ['other_title', 'other_description'].forEach(key => {
            const newArray = [...formData[key]];
            newArray.splice(index, 1);
            updateFormData(key, newArray);
        });

        setActiveIndex(Math.max(0, activeIndex - 1));
    };

    if (!formData.other_title?.length) {
        return null;
    }

    const addOther = () => {
        updateFormData('other_title', [...(formData.other_title || []), '']);
        updateFormData('other_description', [...(formData.other_description || []), '']);
        setActiveIndex(formData.other_title?.length || 0);
    };

    // Combined view with both basic information and description editor
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3 mb-4">

                <button
                    onClick={addOther}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-50 text-blue-600 rounded-lg
                    hover:bg-blue-100 transition-all duration-300 flex items-center justify-center
                    gap-2 text-sm font-medium shadow-sm hover:shadow transform hover:scale-[1.02]"
                >
                    <Plus className="w-4 h-4" />
                    Add Achievement
                </button>
            </div>
            {formData.other_title.map((_, index) => (
                <ContentItem
                    key={index}
                    title={formData.other_title[index] || 'New Other Achievement'}
                    isActive={activeIndex === index}
                    canDelete={formData.other_title.length > 1}
                    onDelete={(e) => removeItem(index, 'other', e)}
                    onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                >
                    <div className="p-5 bg-white space-y-5">
                        <div className="grid grid-cols-1 gap-5 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Achievement Title</label>
                                <input
                                    value={formData.other_title[index] || ''}
                                    onChange={(e) => {
                                        const newArray = [...formData.other_title];
                                        newArray[index] = e.target.value;
                                        updateFormData('other_title', newArray);
                                    }}
                                    placeholder="e.g., Leadership Award"
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg
                                    outline-none transition-colors hover:border-blue-400 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <EnhancedTipTapEditor
                            value={formData.other_description[index] || ''}
                            onChange={(e) => {
                                const newArray = [...formData.other_description];
                                newArray[index] = e.target.value;
                                updateFormData('other_description', newArray);
                            }}
                            title={`${formData.other_title[index] || 'Achievement'} Description`}
                            customPrompt="Provide detailed descriptions and impact of this achievement:"
                            suggestions={achievementSuggestions}
                            onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, index)}
                            onSuggestionUnselect={(suggestion) => handleSuggestionUnselect(suggestion, index)}
                            isSuggestionSelected={(suggestion) => isSuggestionSelected(suggestion, index)}
                            showWritingAssistant={true}
                        />
                    </div>
                </ContentItem>
            ))}
        </div>
    );
};

export default OtherTabEnhanced;