import React, { useState, useEffect } from 'react';
import FormField from "@/components/FormField";
import EnhancedDescriptionEditor from "@/components/EnhancedDescriptionEditor";
import EnhancedTipTapEditor from '../enhancedtiptapeditor';
import { useAuth } from '@/context/AuthContext';

const PersonalInfoEnhanced = ({ formData, updateFormData }) => {
    const { user } = useAuth()
    console.log("user from the personl info", user)
    // State for tracking validation errors
    const [errors, setErrors] = useState({
        first_name: false,
        last_name: false,
        email: false,
        phone: false,
        city: false,
        country: false
    });

    // Validate fields when form data changes
    useEffect(() => {
        validateFields();
    }, [formData]);

    // Validate all required fields
    const validateFields = () => {
        const newErrors = {
            first_name: !formData.first_name,
            last_name: !formData.last_name,
            email: user.email || !formData.email,
            phone: !formData.phone,
            city: !formData.city,
            country: !formData.country
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    // Handle field change with validation
    const handleFieldChange = (field, value) => {
        updateFormData(field, value);
        setErrors(prev => ({
            ...prev,
            [field]: !value
        }));
    };

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
                        <div className="relative">
                            <FormField
                                label="First Name"
                                value={formData.first_name}
                                onChange={(e) => handleFieldChange('first_name', e.target.value)}
                                placeholder="e.g., John"
                                required
                                defaultValue={user?.name}
                                className={`bg-white w-full ${errors.first_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            />
                            {errors.first_name && (
                                <p className="text-red-500 text-xs mt-1">First name is required</p>
                            )}
                        </div>
                        <div className="relative">
                            <FormField
                                label="Last Name"
                                value={formData.last_name}
                                onChange={(e) => handleFieldChange('last_name', e.target.value)}
                                placeholder="e.g., Doe"
                                required
                                className={`bg-white w-full ${errors.last_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            />
                            {errors.last_name && (
                                <p className="text-red-500 text-xs mt-1">Last name is required</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                            <FormField
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleFieldChange('email', e.target.value)}
                                placeholder="e.g., john@example.com"
                                required
                                className={`bg-white w-full ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">Email is required</p>
                            )}
                        </div>
                        <div className="relative">
                            <FormField
                                label="Phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleFieldChange('phone', e.target.value)}
                                placeholder="e.g., +1 234 567 8900"
                                required
                                className={`bg-white w-full ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-xs mt-1">Phone number is required</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Location Section */}
                <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                    <h3 className="text-sm sm:text-md font-medium text-gray-700 border-b border-gray-100 pb-2 sm:pb-3 mb-3">Location</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                            <FormField
                                label="City"
                                value={formData.city}
                                onChange={(e) => handleFieldChange('city', e.target.value)}
                                placeholder="e.g., New York"
                                required
                                className={`bg-white w-full ${errors.city ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            />
                            {errors.city && (
                                <p className="text-red-500 text-xs mt-1">City is required</p>
                            )}
                        </div>
                        <div className="relative">
                            <FormField
                                label="Country"
                                value={formData.country}
                                onChange={(e) => handleFieldChange('country', e.target.value)}
                                placeholder="e.g., United States"
                                required
                                className={`bg-white w-full ${errors.country ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            />
                            {errors.country && (
                                <p className="text-red-500 text-xs mt-1">Country is required</p>
                            )}
                        </div>
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