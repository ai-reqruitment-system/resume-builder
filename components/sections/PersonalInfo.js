import React, { useState, useEffect, useRef } from 'react';
import FormField from "@/components/FormField";
import Editor from "react-simple-wysiwyg";
import SmartInputField from "@/components/SmartInputField";
import EnhancedSuggestionDropdown from "@/components/EnhancedSuggestionDropdown";

const PersonalInfo = ({ formData, updateFormData }) => {
    const handleSuggestionClick = (suggestion) => {
        const currentContent = formData.professional_description || '';
        const bulletPoint = `<ul><li>${suggestion}</li></ul>`;

        if (!currentContent) {
            updateFormData('professional_description', bulletPoint);
        } else if (currentContent.includes('</ul>')) {
            const newContent = currentContent.replace('</ul>', `<li>${suggestion}</li></ul>`);
            updateFormData('professional_description', newContent);
        } else {
            updateFormData('professional_description', currentContent + bulletPoint);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">Personal Information</h2>
                    <p className="text-gray-500 text-sm">Let's start with your basic information</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Name and Contact Section */}
                <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-lg space-y-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            label="First Name"
                            value={formData.first_name}
                            onChange={(e) => updateFormData('first_name', e.target.value)}
                            placeholder="e.g., John"
                            required
                            className="bg-white shadow-sm"
                        />
                        <FormField
                            label="Last Name"
                            value={formData.last_name}
                            onChange={(e) => updateFormData('last_name', e.target.value)}
                            placeholder="e.g., Doe"
                            required
                            className="bg-white shadow-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateFormData('email', e.target.value)}
                            placeholder="e.g., john@example.com"
                            required
                            className="bg-white shadow-sm"
                        />
                        <FormField
                            label="Phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateFormData('phone', e.target.value)}
                            placeholder="e.g., +1 234 567 8900"
                            className="bg-white shadow-sm"
                        />
                    </div>
                </div>

                {/* Location Section */}
                <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            label="City"
                            value={formData.city}
                            onChange={(e) => updateFormData('city', e.target.value)}
                            placeholder="e.g., New York"
                            className="bg-white shadow-sm"
                        />
                        <FormField
                            label="Country"
                            value={formData.country}
                            onChange={(e) => updateFormData('country', e.target.value)}
                            placeholder="e.g., United States"
                            className="bg-white shadow-sm"
                        />
                    </div>
                </div>

                {/* Professional Summary Title */}
                <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <input
                        label="Professional Summary Title"
                        value={formData.professional_summary}
                        onChange={(e) => updateFormData('professional_summary', e.target.value)}
                        currentDescription={formData.professional_description}
                        onDescriptionChange={(e) => updateFormData('professional_description', e.target.value)}
                        placeholder="e.g., Working as full time backend developer."
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg
                        outline-none transition-colors hover:border-blue-400 focus:border-blue-500"
                        promptType="provide a professional summary based on this title:"
                    />
                </div>

                {/* Professional Summary Editor */}
                <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-gray-700">Professional Summary</label>
                        <EnhancedSuggestionDropdown
                            onSuggestionClick={handleSuggestionClick}
                            title={formData.professional_summary || 'professional summary'}
                            customPrompt="provide a professional summary based on this title:"
                            isSuggestionSelected={(suggestion) => {
                                const currentContent = formData.professional_description || '';
                                return currentContent.includes(suggestion);
                            }}
                            buttonClassName="mt-2"
                        />
                    </div>
                    <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
                        <Editor
                            value={formData.professional_description}
                            onChange={(e) => updateFormData('professional_description', e.target.value)}
                            className="w-full min-h-[160px] border border-gray-200 rounded-lg
                                focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfo;