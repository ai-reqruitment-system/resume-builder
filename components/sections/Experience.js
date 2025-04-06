import React, { useState, useEffect } from "react";
import FormField from "@/components/FormField";
import Editor from "react-simple-wysiwyg";
import { ChevronDown, Trash2, Plus } from 'lucide-react';
import SmartInputField from "@/components/SmartInputField";
import MonthYearSelector from "@/components/MonthYearSelector";
import WritingAssistantButton from "@/components/WritingAssistantButton";

const Experience = ({ formData, updateFormData }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const isSuggestionSelected = (suggestion, index) => {
        const editorContent = formData.job_description[index] || '';
        return editorContent.includes(`<li>${suggestion}</li>`);
    };

    const handleSuggestionClick = (suggestion, index) => {
        const currentContent = formData.job_description[index] || '';
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

        const newArray = [...formData.job_description];
        newArray[index] = newContent;
        updateFormData('job_description', newArray);
    };

    useEffect(() => {
        if (!formData.job_title?.length) {
            initializeEmptyExperience();
        }
    }, []);

    const initializeEmptyExperience = () => {
        updateFormData('job_title', ['']);
        updateFormData('employer', ['']);
        updateFormData('job_begin', ['']);
        updateFormData('job_end', ['']);
        updateFormData('job_description', ['']);
    };

    const addExperience = () => {
        updateFormData('job_title', [...(formData.job_title || []), '']);
        updateFormData('employer', [...(formData.employer || []), '']);
        updateFormData('job_begin', [...(formData.job_begin || []), '']);
        updateFormData('job_end', [...(formData.job_end || []), '']);
        updateFormData('job_description', [...(formData.job_description || []), '']);
        setActiveIndex(formData.job_title?.length || 0);
    };

    const removeExperience = (indexToRemove, e) => {
        e.stopPropagation();
        if (!formData.job_title?.length || formData.job_title.length <= 1) return;

        ['job_title', 'employer', 'job_begin', 'job_end', 'job_description'].forEach(key => {
            const newArray = [...formData[key]];
            newArray.splice(indexToRemove, 1);
            updateFormData(key, newArray);
        });

        setActiveIndex(Math.max(0, activeIndex - 1));
    };

    if (!formData.job_title?.length) {
        return null;
    }

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Work Experience</h2>
                    <p className="text-gray-500 text-sm">Add your professional work history</p>
                </div>
                <button
                    onClick={addExperience}
                    className="w-full sm:w-auto px-4 py-2 bg-teal-50 text-teal-600 rounded-lg
                    hover:bg-teal-100 transition-all duration-300 flex items-center justify-center
                    gap-2 text-sm font-medium shadow-sm hover:shadow transform hover:scale-[1.02]"
                >
                    <Plus className="w-4 h-4" />
                    Add Experience
                </button>
            </div>

            <div className="space-y-4">
                {formData.job_title.map((_, index) => (
                    <div key={index} className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">
                        <div
                            onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50
                                hover:bg-gray-100 transition-all duration-300 cursor-pointer
                                border-b border-gray-100"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                                <span className="font-medium text-gray-700">
                                    {formData.job_title[index] || 'New Position'}
                                </span>
                                {formData.employer[index] && (
                                    <span className="text-gray-500">
                                        at {formData.employer[index]}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                {formData.job_title.length > 1 && (
                                    <button
                                        onClick={(e) => removeExperience(index, e)}
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
                            ${activeIndex === index ? 'max-h-none opacity-100 visible' : 'max-h-0 opacity-0 invisible'}`}>
                            <div className="p-5 bg-white space-y-5">
                                <div className="grid grid-cols-1 gap-5">
                                    <FormField
                                        label="Employer"
                                        value={formData.employer[index] || ''}
                                        onChange={(e) => {
                                            const newArray = [...formData.employer];
                                            newArray[index] = e.target.value;
                                            updateFormData('employer', newArray);
                                        }}
                                        placeholder="e.g., Google"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <MonthYearSelector
                                        label="Start Date"
                                        value={formData.job_begin[index] || ''}
                                        onChange={(value) => {
                                            const newArray = [...formData.job_begin];
                                            newArray[index] = value;
                                            updateFormData('job_begin', newArray);
                                        }}
                                        placeholder="Select start date"
                                        required
                                    />
                                    <MonthYearSelector
                                        label="End Date"
                                        value={formData.job_end[index] || ''}
                                        onChange={(value) => {
                                            const newArray = [...formData.job_end];
                                            newArray[index] = value;
                                            updateFormData('job_end', newArray);
                                        }}
                                        placeholder="Select end date"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                        <input
                                            value={formData.job_title[index] || ''}
                                            onChange={(e) => {
                                                const newArray = [...formData.job_title];
                                                newArray[index] = e.target.value;
                                                updateFormData('job_title', newArray);
                                            }}
                                            placeholder="e.g., Software Engineer"
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg
                                            outline-none transition-colors hover:border-teal-400 focus:border-teal-500"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg relative">
                                    <div className="flex items-center justify-between mb-3 z-10 relative">
                                        <label className="text-sm font-medium text-gray-700">Description</label>
                                        <div className="relative z-30">
                                            <WritingAssistantButton
                                                onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, index)}
                                                title={`${formData.job_title[index] || 'job'} experience`}
                                                customPrompt="Provide a list of job responsibilities and achievements for a resume based on this role:"
                                                isSuggestionSelected={(suggestion) => isSuggestionSelected(suggestion, index)}
                                                buttonClassName="mt-2"
                                            />
                                        </div>
                                    </div>
                                    <Editor
                                        value={formData.job_description[index] || ''}
                                        onChange={(e) => {
                                            const newArray = [...formData.job_description];
                                            newArray[index] = e.target.value;
                                            updateFormData('job_description', newArray);
                                        }}
                                        className="w-full min-h-[150px] border border-gray-200 rounded-lg
                                            focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500
                                            transition-all duration-300 relative z-10"
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

export default Experience;