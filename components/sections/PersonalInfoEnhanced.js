import React, { useState, useEffect } from 'react';
import FormField from "@/components/FormField";
import EnhancedDescriptionEditor from "@/components/EnhancedDescriptionEditor";
import EnhancedTipTapEditor from '../enhancedtiptapeditor';
import { useAuth } from '@/context/AuthContext';
import { useLoading } from '@/context/LoadingContext';
import SkeletonLoader from '@/components/SkeletonLoader';
import occupationTitles from '@/data/occupationTitles.json';

const PersonalInfoEnhanced = ({ formData, updateFormData }) => {
    const [filteredTitles, setFilteredTitles] = useState([]);
    const { user, loading: authLoading } = useAuth();
    const { isComponentLoading, setComponentLoading } = useLoading();
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);

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

    // Auto-fill form data with user data when component mounts or user data changes
    useEffect(() => {
        const fillUserData = async () => {
            try {
                setIsFormLoading(true);
                setComponentLoading('profile', true);
                console.log(user)
                if (user) {
                    // Only update fields that are empty or if user data exists
                    const updatedFormData = {
                        first_name: formData.first_name || user.first_name || '',
                        last_name: formData.last_name || user.last_name || '',
                        email: formData.email || user.email || '',
                        phone: formData.phone || user.phone || '',
                        location: formData.location || user.location || '',
                        city: formData.location || user.location || '',
                        country: formData.country || user.location?.country || ''
                    };

                    // Update each field individually to maintain other form data
                    Object.keys(updatedFormData).forEach(field => {
                        if (updatedFormData[field] && !formData[field]) {
                            updateFormData(field, updatedFormData[field]);
                        }
                    });
                }
            } catch (error) {
                console.error('Error filling user data:', error);
            } finally {
                // Short timeout to prevent flickering
                setTimeout(() => {
                    setIsFormLoading(false);
                    setComponentLoading('profile', false);
                }, 300);
            }
        };

        fillUserData();
    }, [user, setComponentLoading]);

    // Validate all required fields
    const validateFields = () => {
        const newErrors = {
            first_name: user.first_name || !formData.first_name,
            last_name: !formData.last_name,
            email: user.email || !formData.email,
            phone: !formData.phone,
            location: !formData.location,
            city: !formData.city,
            country: !formData.country
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    // Handle field change with validation
    const handleFieldChange = (field, value) => {
        // Set temporary loading state for the specific field
        setIsFormLoading(true);

        // Update the form data
        updateFormData(field, value);

        // Update validation errors
        setErrors(prev => ({
            ...prev,
            [field]: !value
        }));

        // Clear loading state after a short delay
        setTimeout(() => setIsFormLoading(false), 300);
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

    const handleSuggestionUnselect = (suggestion) => {
        const currentContent = formData.professional_description || '';

        // If the suggestion is in a list item
        if (currentContent.includes(`<li>${suggestion}</li>`)) {
            // Remove the list item containing the suggestion
            let newContent = currentContent.replace(`<li>${suggestion}</li>`, '');

            // If this was the only list item, remove the entire ul element
            if (!newContent.includes('<li>')) {
                newContent = newContent.replace('<ul></ul>', '');
            }

            // Update the form data with the modified content
            updateFormData('professional_description', newContent);
        }
    };

    const isSuggestionSelected = (suggestion) => {
        const currentContent = formData.professional_description || '';
        return currentContent.includes(suggestion);
    };

    // Combined view with both basic information and description editor
    return (
        <div className="w-full space-y-3 xxs:space-y-4 sm:space-y-5 relative">
            {/* Loading overlay for the entire form */}
            {(authLoading || isComponentLoading('profile')) && (
                <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                        <p className="text-sm text-gray-600">Loading your information...</p>
                    </div>
                </div>
            )}


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
                                defaultValue={user?.first_name}
                                className={`bg-white w-full`}
                            />
                        </div>
                        <div className="relative">
                            <FormField
                                label="Last Name"
                                value={formData.last_name}
                                onChange={(e) => handleFieldChange('last_name', e.target.value)}
                                placeholder="e.g., Doe"
                                required
                                className={`bg-white w-full`}
                            />
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
                                className={`bg-white w-full`}
                            />
                        </div>
                        <div className="relative">
                            <FormField
                                label="Phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleFieldChange('phone', e.target.value)}
                                placeholder="e.g., +1 234 567 8900"
                                required
                                className={`bg-white w-full`}
                            />
                        </div>
                    </div>
                </div>

                {/* Location Section */}
                <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                    <h3 className="text-sm sm:text-md font-medium text-gray-700 border-b border-gray-100 pb-2 sm:pb-3 mb-3">Location</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                        <div className="relative">
                            <FormField
                                label="City"
                                value={formData.city}
                                onChange={(e) => handleFieldChange('city', e.target.value)}
                                placeholder="e.g., New York"
                                required
                                className={`bg-white w-full`}
                            />
                        </div>
                        <div className="relative">
                            <FormField
                                label="Country"
                                value={formData.country}
                                onChange={(e) => handleFieldChange('country', e.target.value)}
                                placeholder="e.g., United States"
                                required
                                className={`bg-white w-full `}
                            />
                        </div>
                    </div>


                </div>

                {/* Professional Summary Title */}
                <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm border border-gray-100 space-y-3 hover:shadow-md transition-all duration-300">
                    <h3 className="text-sm sm:text-md font-medium text-gray-700 border-b border-gray-100 pb-2 sm:pb-3 mb-1">Occupation Title</h3>

                    <div>
                        <div className="relative">
                            <input
                                value={formData.professional_summary}
                                onFocus={() => setShowTitleSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowTitleSuggestions(false), 200)}
                                placeholder="e.g., Working as full time backend developer."
                                className="w-full px-3 sm:px-4 py-2.5 bg-white border border-gray-300 rounded-lgoutline-none transition-colors hover:border-blue-400 focus:border-blue-500 text-sm"
                                onChange={(e) => {
                                    updateFormData('professional_summary', e.target.value);
                                    if (e.target.value.length > 0) {
                                        const filtered = occupationTitles.titles.filter(title =>
                                            title.toLowerCase().includes(e.target.value.toLowerCase())
                                        );
                                        setFilteredTitles(filtered);
                                        setShowTitleSuggestions(true);
                                    } else {
                                        setFilteredTitles([]);
                                        setShowTitleSuggestions(false);
                                    }
                                }}
                            />
                            {showTitleSuggestions && filteredTitles.length > 0 && (
                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {filteredTitles.map((title, index) => (
                                        <div
                                            key={index}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                updateFormData('professional_summary', title);
                                                setFilteredTitles([]);
                                                setShowTitleSuggestions(false);
                                            }}
                                        >
                                            {title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Professional Summary Description with Enhanced UI */}
                <div className="rounded-xl space-y-3 transition-all duration-300">


                    <EnhancedTipTapEditor
                        value={formData.professional_description || ''}
                        onChange={(e) => updateFormData('professional_description', e.target.value)}
                        title={'Professional Summary'}
                        customPrompt="provide a professional summary based on this title:"
                        suggestions={professionalSuggestions}
                        onSuggestionClick={handleSuggestionClick}
                        onSuggestionUnselect={handleSuggestionUnselect}
                        isSuggestionSelected={isSuggestionSelected}
                        showWritingAssistant={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoEnhanced;