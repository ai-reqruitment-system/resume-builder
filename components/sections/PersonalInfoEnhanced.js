import React, { useState } from 'react';
import FormField from "@/components/FormField";
import EnhancedDescriptionEditor from "@/components/EnhancedDescriptionEditor";

const PersonalInfoEnhanced = ({ formData, updateFormData, step = 1 }) => {
    // Common professional summary suggestions
    const professionalSuggestions = [
        "Experienced professional with expertise in...",
        "Skilled at problem-solving and analytical thinking",
        "Strong communication and interpersonal skills",
        "Proven track record of delivering results",
        "Adept at managing multiple priorities",
        "Passionate about continuous learning",
        "Detail-oriented with excellent organizational skills",
        "Team player with leadership capabilities",
        "Innovative thinker with creative solutions",
        "Committed to excellence and high-quality work",
        "Adaptable to changing environments and requirements",
        "Proficient in industry-standard tools and technologies"
    ];

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

    const isSuggestionSelected = (suggestion) => {
        const currentContent = formData.professional_description || '';
        return currentContent.includes(suggestion);
    };

    // Step 1: Basic information form
    if (step === 1) {
        return (
            <div className="w-full space-y-3 xxs:space-y-4 sm:space-y-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 xxs:mb-3 sm:mb-4">
                    <div>
                        <h2 className="text-base xxs:text-lg sm:text-xl font-semibold text-gray-800 mb-0.5 xxs:mb-1">Personal Information</h2>
                        <p className="text-gray-500 text-[10px] xxs:text-xs sm:text-sm">Let's start with your basic information</p>
                    </div>
                </div>

                <div className="space-y-3 xxs:space-y-4 sm:space-y-5">
                    {/* Name and Contact Section */}
                    <div className="p-3 xxs:p-4 sm:p-5 bg-white rounded-xl shadow-sm border border-gray-100 space-y-3 xxs:space-y-4 hover:shadow-md transition-all duration-300">
                        <h3 className="text-xs xxs:text-sm sm:text-md font-medium text-gray-700 border-b border-gray-100 pb-1.5 xxs:pb-2 sm:pb-3 mb-1">Contact Details</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xxs:gap-4">
                            <FormField
                                label="First Name"
                                value={formData.first_name}
                                onChange={(e) => updateFormData('first_name', e.target.value)}
                                placeholder="e.g., John"
                                required
                                className="bg-white w-full"
                            />
                            <FormField
                                label="Last Name"
                                value={formData.last_name}
                                onChange={(e) => updateFormData('last_name', e.target.value)}
                                placeholder="e.g., Doe"
                                required
                                className="bg-white w-full"
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
                                className="bg-white w-full"
                            />
                            <FormField
                                label="Phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => updateFormData('phone', e.target.value)}
                                placeholder="e.g., +1 234 567 8900"
                                className="bg-white w-full"
                            />
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="p-4 sm:p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <h3 className="text-sm sm:text-md font-medium text-gray-700 border-b border-gray-100 pb-2 sm:pb-3 mb-3">Location</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                label="City"
                                value={formData.city}
                                onChange={(e) => updateFormData('city', e.target.value)}
                                placeholder="e.g., New York"
                                className="bg-white w-full"
                            />
                            <FormField
                                label="Country"
                                value={formData.country}
                                onChange={(e) => updateFormData('country', e.target.value)}
                                placeholder="e.g., United States"
                                className="bg-white w-full"
                            />
                        </div>
                    </div>

                    {/* Professional Summary Title */}
                    <div className="p-4 sm:p-5 bg-white rounded-xl shadow-sm border border-gray-100 space-y-3 hover:shadow-md transition-all duration-300">
                        <h3 className="text-sm sm:text-md font-medium text-gray-700 border-b border-gray-100 pb-2 sm:pb-3 mb-1">Professional Summary</h3>

                        <div>
                            <input
                                value={formData.professional_summary}
                                onChange={(e) => updateFormData('professional_summary', e.target.value)}
                                placeholder="e.g., Working as full time backend developer."
                                className="w-full px-3 sm:px-4 py-2.5 bg-white border border-gray-300 rounded-lg
                                outline-none transition-colors hover:border-teal-400 focus:border-teal-500 text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Step 2: Description editor with suggestions
    return (
        <div className="w-full space-y-4 sm:space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4">
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">Professional Summary</h2>
                    <p className="text-gray-500 text-xs sm:text-sm">Describe your professional background and skills</p>
                </div>
            </div>

            <div className="space-y-4 sm:space-y-5">
                {/* Professional Summary Description with Enhanced UI */}
                <div className="p-4 sm:p-5 bg-white rounded-xl shadow-sm border border-gray-100 space-y-3 hover:shadow-md transition-all duration-300">
                    <h3 className="text-sm sm:text-md font-medium text-gray-700 border-b border-gray-100 pb-2 sm:pb-3 mb-1">
                        {formData.professional_summary || 'Professional Summary'}
                    </h3>

                    <EnhancedDescriptionEditor
                        value={formData.professional_description || ''}
                        onChange={(e) => updateFormData('professional_description', e.target.value)}
                        title="Description"
                        customPrompt="provide a professional summary based on this title:"
                        suggestions={professionalSuggestions}
                        onSuggestionClick={handleSuggestionClick}
                        isSuggestionSelected={isSuggestionSelected}
                        showWritingAssistant={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoEnhanced;