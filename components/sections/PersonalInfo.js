import React, { useState, useEffect, useRef } from 'react';
import FormField from "@/components/FormField";
import Editor from "react-simple-wysiwyg";
import SmartInputField from "@/components/SmartInputField";
<<<<<<< HEAD
import WritingAssistantButton from "@/components/WritingAssistantButton";
=======
import SuggestionDropdown from "@/components/SuggestionDropdown";
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935

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
<<<<<<< HEAD
        <div className="w-full space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">Personal Information</h2>
                    <p className="text-gray-500 text-xs sm:text-sm">Let's start with your basic information</p>
                </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
                {/* Name and Contact Section */}
                <div className="p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100 space-y-4 sm:space-y-6 hover:shadow-md transition-all duration-300">
                    <h3 className="text-sm sm:text-md font-medium text-gray-700 border-b border-gray-100 pb-2 sm:pb-3">Contact Details</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
=======
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
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
                        <FormField
                            label="First Name"
                            value={formData.first_name}
                            onChange={(e) => updateFormData('first_name', e.target.value)}
                            placeholder="e.g., John"
                            required
<<<<<<< HEAD
                            className="bg-white w-full"
=======
                            className="bg-white shadow-sm"
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
                        />
                        <FormField
                            label="Last Name"
                            value={formData.last_name}
                            onChange={(e) => updateFormData('last_name', e.target.value)}
                            placeholder="e.g., Doe"
                            required
<<<<<<< HEAD
                            className="bg-white w-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
=======
                            className="bg-white shadow-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
                        <FormField
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateFormData('email', e.target.value)}
                            placeholder="e.g., john@example.com"
                            required
<<<<<<< HEAD
                            className="bg-white w-full"
=======
                            className="bg-white shadow-sm"
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
                        />
                        <FormField
                            label="Phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateFormData('phone', e.target.value)}
                            placeholder="e.g., +1 234 567 8900"
<<<<<<< HEAD
                            className="bg-white w-full"
=======
                            className="bg-white shadow-sm"
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
                        />
                    </div>
                </div>

                {/* Location Section */}
<<<<<<< HEAD
                <div className="p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                    <h3 className="text-sm sm:text-md font-medium text-gray-700 border-b border-gray-100 pb-2 sm:pb-3 mb-4 sm:mb-6">Location</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
=======
                <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
                        <FormField
                            label="City"
                            value={formData.city}
                            onChange={(e) => updateFormData('city', e.target.value)}
                            placeholder="e.g., New York"
<<<<<<< HEAD
                            className="bg-white w-full"
=======
                            className="bg-white shadow-sm"
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
                        />
                        <FormField
                            label="Country"
                            value={formData.country}
                            onChange={(e) => updateFormData('country', e.target.value)}
                            placeholder="e.g., United States"
<<<<<<< HEAD
                            className="bg-white w-full"
=======
                            className="bg-white shadow-sm"
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
                        />
                    </div>
                </div>

<<<<<<< HEAD
                {/* Professional Summary Section */}
                <div className="p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100 space-y-4 sm:space-y-6 hover:shadow-md transition-all duration-300">
                    <h3 className="text-sm sm:text-md font-medium text-gray-700 border-b border-gray-100 pb-2 sm:pb-3">Professional Summary</h3>

                    <div className="space-y-4 sm:space-y-6">
                        <input
                            label="Professional Summary Title"
                            value={formData.professional_summary}
                            onChange={(e) => updateFormData('professional_summary', e.target.value)}
                            currentDescription={formData.professional_description}
                            onDescriptionChange={(e) => updateFormData('professional_description', e.target.value)}
                            placeholder="e.g., Working as full time backend developer."
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 bg-white border border-gray-300 rounded-lg
                            outline-none transition-colors hover:border-teal-400 focus:border-teal-500 text-sm sm:text-base"
                            promptType="provide a professional summary based on this title:"
                        />

                        <div className="relative">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-0">Description</label>
                                <WritingAssistantButton
                                    onSuggestionClick={handleSuggestionClick}
                                    title={formData.professional_summary || 'professional summary'}
                                    customPrompt="provide a professional summary based on this title:"
                                    isSuggestionSelected={(suggestion) => {
                                        const currentContent = formData.professional_description || '';
                                        return currentContent.includes(suggestion);
                                    }}
                                    buttonClassName="mt-1 sm:mt-0"
                                />
                            </div>
                            <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
                                <Editor
                                    value={formData.professional_description}
                                    onChange={(e) => updateFormData('professional_description', e.target.value)}
                                    className="w-full min-h-[120px] sm:min-h-[160px] border border-gray-200 rounded-lg
                                        focus-within:ring-1 focus-within:ring-teal-500 focus-within:border-teal-500 text-sm sm:text-base"
                                />
                            </div>
                        </div>
=======
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
                        <SuggestionDropdown 
                            onSuggestionClick={handleSuggestionClick} 
                            title={formData.professional_summary || 'professional summary'} 
                            customPrompt="provide a professional summary based on this title:" 
                        />
                    </div>
                    <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
                        <Editor
                            value={formData.professional_description}
                            onChange={(e) => updateFormData('professional_description', e.target.value)}
                            className="w-full min-h-[160px] border border-gray-200 rounded-lg
                                focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500"
                        />
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfo;