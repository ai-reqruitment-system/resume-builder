import React, { useEffect, useState } from "react";
import ContentItem from "@/components/ContentItem";
import EnhancedDescriptionEditor from "@/components/EnhancedDescriptionEditor";
import { Plus } from 'lucide-react';
import EnhancedTipTapEditor from "./enhancedtiptapeditor";
import MonthYearSelector from "@/components/MonthYearSelector";

const InternshipTabEnhanced = ({
    formData,
    updateFormData,
    activeIndex,
    setActiveIndex,
    step = 1
}) => {
    // Common internship description suggestions
    const internshipSuggestions = [
        "Assisted in the development of...",
        "Collaborated with cross-functional teams",
        "Conducted research on industry trends",
        "Created documentation for processes",
        "Designed and implemented solutions for...",
        "Developed skills in [specific technology]",
        "Gained hands-on experience with...",
        "Improved efficiency of existing processes",
        "Learned industry best practices",
        "Participated in client meetings",
        "Presented findings to senior management",
        "Provided support for key projects",
        "Received mentorship from experienced professionals",
        "Reduced processing time by optimizing...",
        "Worked directly with clients to address needs"
    ];

    useEffect(() => {
        if (!formData.internship_title?.length) {
            initializeEmptyInternship();
        }
    }, []);

    const initializeEmptyInternship = () => {
        updateFormData('internship_title', ['']);
        updateFormData('internship_summary', ['']);
        updateFormData('internship_start_month', ['']);
        updateFormData('internship_start_year', ['']);
        updateFormData('internship_end_month', ['']);
        updateFormData('internship_end_year', ['']);
    };

    const handleSuggestionClick = (suggestion, index) => {
        const currentContent = formData.internship_summary[index] || '';
        const bulletPoint = `<li>${suggestion}</li>`;

        let newContent;
        if (!currentContent) {
            newContent = `<ul>${bulletPoint}</ul>`;
        } else if (currentContent.includes('</ul>')) {
            // Check if the suggestion is already present
            if (currentContent.includes(bulletPoint)) {
                // Remove the suggestion
                newContent = currentContent.replace(bulletPoint, '').replace(/<ul>\s*<\/ul>/, '');
            } else {
                // Add the suggestion before the closing ul tag
                newContent = currentContent.replace('</ul>', `${bulletPoint}</ul>`);
            }
        } else {
            newContent = `<ul>${bulletPoint}</ul>`;
        }

        const newArray = [...formData.internship_summary];
        newArray[index] = newContent;
        updateFormData('internship_summary', newArray);
    };

    const handleSuggestionUnselect = (suggestion, index) => {
        const currentContent = formData.internship_summary[index] || '';
        const bulletPoint = `<li>${suggestion}</li>`;

        // If the suggestion is in a list item
        if (currentContent.includes(bulletPoint)) {
            // Remove the list item containing the suggestion
            let newContent = currentContent.replace(bulletPoint, '');

            // If this was the only list item, remove the entire ul element
            if (!newContent.includes('<li>')) {
                newContent = newContent.replace('<ul></ul>', '');
            }

            // Update the form data with the modified content
            const newArray = [...formData.internship_summary];
            newArray[index] = newContent;
            updateFormData('internship_summary', newArray);
        }
    };

    const isSuggestionSelected = (suggestion, index) => {
        const currentContent = formData.internship_summary[index] || '';
        return currentContent.includes(`<li>${suggestion}</li>`);
    };

    const removeItem = (index, type, e) => {
        e.stopPropagation();
        if (!formData.internship_title?.length || formData.internship_title.length <= 1) return;

        ['internship_title', 'internship_summary', 'internship_start_month', 'internship_start_year', 'internship_end_month', 'internship_end_year'].forEach(key => {
            const newArray = [...formData[key]];
            newArray.splice(index, 1);
            updateFormData(key, newArray);
        });

        setActiveIndex(Math.max(0, activeIndex - 1));
    };

    if (!formData.internship_title?.length) {
        return null;
    }

    const addInternship = () => {
        updateFormData('internship_title', [...(formData.internship_title || []), '']);
        updateFormData('internship_summary', [...(formData.internship_summary || []), '']);
        updateFormData('internship_start_month', [...(formData.internship_start_month || []), '']);
        updateFormData('internship_start_year', [...(formData.internship_start_year || []), '']);
        updateFormData('internship_end_month', [...(formData.internship_end_month || []), '']);
        updateFormData('internship_end_year', [...(formData.internship_end_year || []), '']);
        setActiveIndex(formData.internship_title?.length || 0);
    };

    return (
        <div className="space-y-2 xxs:space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2 xxs:gap-3 mb-2 xxs:mb-3 sm:mb-4">

                <button
                    onClick={addInternship}
                    className="w-full sm:w-auto px-3 xxs:px-4 py-1.5 xxs:py-2 bg-blue-50 text-blue-600 rounded-lg
                    hover:bg-blue-100 transition-all duration-300 flex items-center justify-center
                    gap-1 xxs:gap-2 text-xs xxs:text-sm font-medium shadow-sm hover:shadow transform hover:scale-[1.02]"
                >
                    <Plus className="w-3 h-3 xxs:w-4 xxs:h-4" />
                    Add Internship
                </button>
            </div>
            {formData.internship_title.map((_, index) => (
                <ContentItem
                    key={index}
                    title={formData.internship_title[index] || 'New Internship'}
                    isActive={activeIndex === index}
                    canDelete={formData.internship_title.length > 1}
                    onDelete={(e) => removeItem(index, 'internship', e)}
                    onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                >
                    <div className="p-5 bg-white space-y-5">
                        {/* Basic Information Section */}
                        <div className="grid grid-cols-1 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Internship Title</label>
                                <input
                                    value={formData.internship_title[index] || ''}
                                    onChange={(e) => {
                                        const newArray = [...formData.internship_title];
                                        newArray[index] = e.target.value;
                                        updateFormData('internship_title', newArray);
                                    }}
                                    placeholder="e.g., UI/UX Design Intern"
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg
                                    outline-none transition-colors hover:border-blue-400 focus:border-blue-500"
                                />
                            </div>

                            {/* Date Range Section */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <MonthYearSelector
                                        label="Start Date"
                                        value={`${formData.internship_start_month?.[index] || ''} ${formData.internship_start_year?.[index] || ''}`.trim()}
                                        onChange={(value) => {
                                            if (value) {
                                                const [month, year] = value.split(' ');
                                                const newMonthArray = [...(formData.internship_start_month || Array(formData.internship_title.length).fill(''))];
                                                const newYearArray = [...(formData.internship_start_year || Array(formData.internship_title.length).fill(''))];
                                                newMonthArray[index] = month;
                                                newYearArray[index] = year;
                                                updateFormData('internship_start_month', newMonthArray);
                                                updateFormData('internship_start_year', newYearArray);
                                            } else {
                                                const newMonthArray = [...(formData.internship_start_month || Array(formData.internship_title.length).fill(''))];
                                                const newYearArray = [...(formData.internship_start_year || Array(formData.internship_title.length).fill(''))];
                                                newMonthArray[index] = '';
                                                newYearArray[index] = '';
                                                updateFormData('internship_start_month', newMonthArray);
                                                updateFormData('internship_start_year', newYearArray);
                                            }
                                        }}
                                        placeholder="Select start month"
                                        required
                                    />
                                </div>
                                <div>
                                    <MonthYearSelector
                                        label="End Date"
                                        value={`${formData.internship_end_month?.[index] || ''} ${formData.internship_end_year?.[index] || ''}`.trim()}
                                        onChange={(value) => {
                                            if (value) {
                                                const [month, year] = value.split(' ');
                                                const newMonthArray = [...(formData.internship_end_month || Array(formData.internship_title.length).fill(''))];
                                                const newYearArray = [...(formData.internship_end_year || Array(formData.internship_title.length).fill(''))];
                                                newMonthArray[index] = month;
                                                newYearArray[index] = year;
                                                updateFormData('internship_end_month', newMonthArray);
                                                updateFormData('internship_end_year', newYearArray);
                                            } else {
                                                const newMonthArray = [...(formData.internship_end_month || Array(formData.internship_title.length).fill(''))];
                                                const newYearArray = [...(formData.internship_end_year || Array(formData.internship_title.length).fill(''))];
                                                newMonthArray[index] = '';
                                                newYearArray[index] = '';
                                                updateFormData('internship_end_month', newMonthArray);
                                                updateFormData('internship_end_year', newYearArray);
                                            }
                                        }}
                                        placeholder="Select end month or leave empty for current position"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description Editor Section */}
                        <EnhancedTipTapEditor
                            value={formData.internship_summary[index] || ''}
                            onChange={(e) => {
                                const newArray = [...formData.internship_summary];
                                newArray[index] = e.target.value;
                                updateFormData('internship_summary', newArray);
                            }}
                            title={formData.internship_title[index] || 'Internship Description'}
                            customPrompt={`Provide a comprehensive list of detailed professional descriptions and achievements for your role as ${formData.internship_title[index] || 'an intern'}:`}
                            suggestions={internshipSuggestions}
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

export default InternshipTabEnhanced;