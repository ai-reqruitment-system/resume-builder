import React, { useState, useEffect } from "react";
import FormField from "@/components/FormField";
import Editor from "react-simple-wysiwyg";
import { ChevronDown, Trash2, Plus } from 'lucide-react';
import SmartInputField from "@/components/SmartInputField";
import EnhancedSuggestionDropdown from "@/components/EnhancedSuggestionDropdown";

const Education = ({ formData, updateFormData }) => {
    const [activeIndex, setActiveIndex] = useState(0);

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

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Education</h2>
                    <p className="text-gray-500 text-xs">Add your educational background</p>
                </div>
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

            <div className="space-y-3">
                {formData.college.map((_, index) => (
                    <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
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

                        <div className={`transition-all duration-200 ease-in-out
                            ${activeIndex === index ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
                            overflow-hidden`}>
                            <div className="p-3 bg-white space-y-3">
                                <div className="grid grid-cols-1 gap-3">
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                                <div className="grid grid-cols-1 gap-3">
                                    <input
                                        label="Degree"
                                        value={formData.degree[index] || ''}
                                        onChange={(e) => {
                                            const newArray = [...formData.degree];
                                            newArray[index] = e.target.value;
                                            updateFormData('degree', newArray);
                                        }}
                                        currentDescription={formData.college_description}
                                        onDescriptionChange={(e) => updateFormData('college_description', e.target.value)}
                                        placeholder="e.g., Bachelor of Science"
                                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg
                        outline-none transition-colors hover:border-blue-400 focus:border-blue-500"
                                        promptType="provide a degree or academic details based on this degree:"
                                        index={index}
                                    />
                                </div>

                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm text-gray-600">Description</label>
                                        <EnhancedSuggestionDropdown
                                            onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, index)}
                                            title={`${formData.degree[index] || 'education'} description`}
                                            customPrompt="Provide a list of educational achievements and experiences for a resume:"
                                            isSuggestionSelected={(suggestion) => {
                                                const currentContent = formData.college_description[index] || '';
                                                return currentContent.includes(suggestion);
                                            }}
                                            buttonClassName="mt-2"
                                        />
                                    </div>
                                    <Editor
                                        value={formData.college_description[index] || ''}
                                        onChange={(e) => {
                                            const newArray = [...formData.college_description];
                                            newArray[index] = e.target.value;
                                            updateFormData('college_description', newArray);
                                        }}
                                        className="w-full min-h-[120px] border border-gray-200 rounded-lg
                                            focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500
                                            transition-all duration-300"
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

export default Education;