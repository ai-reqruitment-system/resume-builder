import React, { useState, useEffect } from "react";
import FormField from "@/components/FormField";
import { ChevronDown, Trash2, Plus } from 'lucide-react';
import EnhancedDescriptionEditor from "@/components/EnhancedDescriptionEditor";

const EducationEnhanced = ({ formData, updateFormData }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Common education description suggestions
    const educationSuggestions = [
        "Graduated with honors",
        "Maintained a GPA of X.X/4.0",
        "Recipient of academic scholarship",
        "Member of honor society",
        "Completed thesis/capstone project on...",
        "Participated in study abroad program",
        "Selected for competitive research program",
        "Served as teaching assistant",
        "Led student organization/club",
        "Organized campus events and activities",
        "Volunteered for community service",
        "Completed relevant coursework in...",
        "Participated in internship program",
        "Received academic achievement award",
        "Published research paper"
    ];

    const handleSuggestionClick = (suggestion, index) => {
        const currentContent = formData.college_description[index] || '';
        const bulletPoint = `<ul><li>${suggestion}</li></ul>`;

        let newContent;
        if (!currentContent) {
            newContent = bulletPoint;
        } else if (currentContent.includes('</ul>')) {
            newContent = currentContent.replace('</ul>', `<li>${suggestion}</li></ul>`);
        } else {
            newContent = currentContent + bulletPoint;
        }

        const newArray = [...formData.college_description];
        newArray[index] = newContent;
        updateFormData('college_description', newArray);
    };

    const isSuggestionSelected = (suggestion, index) => {
        const currentContent = formData.college_description[index] || '';
        return currentContent.includes(suggestion);
    };

    useEffect(() => {
        if (!formData.college?.length) {
            initializeEmptyEducation();
        }
    }, []);

    const initializeEmptyEducation = () => {
        updateFormData('college', ['']);
        updateFormData('degree', ['']);
        updateFormData('college_begin', ['']);
        updateFormData('college_end', ['']);
        updateFormData('college_description', ['']);
    };

    const addEducation = () => {
        updateFormData('college', [...(formData.college || []), '']);
        updateFormData('degree', [...(formData.degree || []), '']);
        updateFormData('college_begin', [...(formData.college_begin || []), '']);
        updateFormData('college_end', [...(formData.college_end || []), '']);
        updateFormData('college_description', [...(formData.college_description || []), '']);
        setActiveIndex(formData.college?.length || 0);
    };

    const removeEducation = (indexToRemove, e) => {
        e.stopPropagation();
        if (!formData.college?.length || formData.college.length <= 1) return;

        ['college', 'degree', 'college_begin', 'college_end', 'college_description'].forEach(key => {
            const newArray = [...formData[key]];
            newArray.splice(indexToRemove, 1);
            updateFormData(key, newArray);
        });

        setActiveIndex(Math.max(0, activeIndex - 1));
    };

    if (!formData.college?.length) {
        return null;
    }

    // Combined view with both basic information and description editor
    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3 mb-4">

                <button
                    onClick={addEducation}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-50 text-blue-600 rounded-lg
                    hover:bg-blue-100 transition-all duration-300 flex items-center justify-center
                    gap-2 text-sm font-medium shadow-sm hover:shadow transform hover:scale-[1.02]"
                >
                    <Plus className="w-4 h-4" />
                    Add Education
                </button>
            </div>

            <div className="space-y-4">
                {formData.college.map((_, index) => (
                    <div key={index} className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">
                        <div
                            onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50
                                    hover:bg-gray-100 transition-all duration-300 cursor-pointer
                                    border-b border-gray-100"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                                <span className="font-medium text-gray-700">
                                    {formData.degree[index] || 'New Degree'}
                                </span>
                                {formData.college[index] && (
                                    <span className="text-gray-500">
                                        at {formData.college[index]}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                {formData.college.length > 1 && (
                                    <button
                                        onClick={(e) => removeEducation(index, e)}
                                        className="p-1.5 text-gray-400 hover:text-red-500
                                                hover:bg-red-50 rounded-full transition-all duration-300
                                                transform hover:scale-110"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                                <ChevronDown
                                    className={`w-4 h-4 text-gray-500 transition-transform duration-200
                                            ${activeIndex === index ? 'rotate-180' : ''}`}
                                />
                            </div>
                        </div>

                        <div className={`transition-all duration-300 ease-in-out
                                ${activeIndex === index ? 'max-h-[2000px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'}
                                overflow-hidden`}>
                            <div className="p-5 bg-white space-y-5">
                                <div className="grid grid-cols-1 gap-5">
                                    <FormField
                                        label="College/University"
                                        value={formData.college[index] || ''}
                                        onChange={(e) => {
                                            const newArray = [...formData.college];
                                            newArray[index] = e.target.value;
                                            updateFormData('college', newArray);
                                        }}
                                        placeholder="e.g., Harvard University"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <FormField
                                        label="Start Year"
                                        value={formData.college_begin[index] || ''}
                                        onChange={(e) => {
                                            const newArray = [...formData.college_begin];
                                            newArray[index] = e.target.value;
                                            updateFormData('college_begin', newArray);
                                        }}
                                        placeholder="e.g., 2018"
                                        required
                                    />
                                    <FormField
                                        label="End Year"
                                        value={formData.college_end[index] || ''}
                                        onChange={(e) => {
                                            const newArray = [...formData.college_end];
                                            newArray[index] = e.target.value;
                                            updateFormData('college_end', newArray);
                                        }}
                                        placeholder="e.g., 2022"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                                        <input
                                            value={formData.degree[index] || ''}
                                            onChange={(e) => {
                                                const newArray = [...formData.degree];
                                                newArray[index] = e.target.value;
                                                updateFormData('degree', newArray);
                                            }}
                                            placeholder="e.g., Bachelor of Science"
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg
                                                outline-none transition-colors hover:border-blue-400 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Description Editor Section */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <EnhancedDescriptionEditor
                                        value={formData.college_description[index] || ''}
                                        onChange={(e) => {
                                            const newArray = [...formData.college_description];
                                            newArray[index] = e.target.value;
                                            updateFormData('college_description', newArray);
                                        }}
                                        title={`${formData.degree[index] || 'Education'} Description`}
                                        customPrompt="Provide details about your educational experience, achievements, and relevant coursework:"
                                        suggestions={educationSuggestions}
                                        onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, index)}
                                        isSuggestionSelected={(suggestion) => isSuggestionSelected(suggestion, index)}
                                        showWritingAssistant={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EducationEnhanced;