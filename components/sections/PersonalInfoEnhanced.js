import React, { useState } from 'react';
import FormField from "@/components/FormField";
import EnhancedDescriptionEditor from "@/components/EnhancedDescriptionEditor";
import EnhancedTipTapEditor from '../enhancedtiptapeditor';

const PersonalInfoEnhanced = ({ formData, updateFormData }) => {
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

    // Combined view with both basic information and description editor
    return (
        <div className="w-full space-y-3 xxs:space-y-4 sm:space-y-5">


            <div className="space-y-3 xxs:space-y-4 sm:space-y-5">
                {/* Name and Contact Section tera*/}
                <div className="p-2 bg-white rounded-lg xxs:rounded-xl  space-y-2 xxs:space-y-3 sm:space-y-4 hover:shadow-md transition-all duration-300">
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
                <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
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
                <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm border border-gray-100 space-y-3 hover:shadow-md transition-all duration-300">
                    <h3 className="text-sm sm:text-md font-medium text-gray-700 border-b border-gray-100 pb-2 sm:pb-3 mb-1">Occupation Title</h3>

                    <div>
                        <input
                            value={formData.professional_summary}
                            onChange={(e) => updateFormData('professional_summary', e.target.value)}
                            placeholder="e.g., Working as full time backend developer."
                            className="w-full px-3 sm:px-4 py-2.5 bg-white border border-gray-300 rounded-lg
                            outline-none transition-colors hover:border-blue-400 focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>

                {/* Professional Summary Description with Enhanced UI */}
                <div className="rounded-xl space-y-3 transition-all duration-300">


                    <EnhancedTipTapEditor
                        value={formData.professional_description || ''}
                        onChange={(e) => updateFormData('professional_description', e.target.value)}
                        title={formData.professional_summary || 'Professional Summary'}
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