import React, { useEffect, useState } from "react";
import ContentItem from "@/components/ContentItem";
import EnhancedDescriptionEditor from "@/components/EnhancedDescriptionEditor";
import { Plus } from 'lucide-react';
import EnhancedTipTapEditor from "./enhancedtiptapeditor";

const CertificateTabEnhanced = ({
    formData,
    updateFormData,
    activeIndex,
    setActiveIndex,
    step = 1
}) => {
    // Common certificate description suggestions
    const certificateSuggestions = [
        "Demonstrates proficiency in...",
        "Validates expertise in industry-standard practices",
        "Recognized credential in the field of...",
        "Acquired comprehensive knowledge of...",
        "Developed practical skills in...",
        "Mastered key concepts in...",
        "Gained hands-on experience with...",
        "Achieved competency in specialized techniques",
        "Qualified to perform professional tasks in...",
        "Recognized for technical excellence in...",
        "Certified by leading industry organization",
        "Completed rigorous training program",
        "Passed comprehensive examination covering...",
        "Authorized to implement best practices in...",
        "Verified skills in critical areas of..."
    ];

    useEffect(() => {
        if (!formData.certificate_title?.length) {
            initializeEmptyCertificate();
        }
    }, []);

    const initializeEmptyCertificate = () => {
        updateFormData('certificate_title', ['']);
        updateFormData('certificate_description', ['']);
    };

    const handleSuggestionClick = (suggestion, index) => {
        const currentContent = formData.certificate_description[index] || '';
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

        const newArray = [...formData.certificate_description];
        newArray[index] = newContent;
        updateFormData('certificate_description', newArray);
    };

    const isSuggestionSelected = (suggestion, index) => {
        const currentContent = formData.certificate_description[index] || '';
        return currentContent.includes(`<li>${suggestion}</li>`);
    };

    const removeItem = (index, type, e) => {
        e.stopPropagation();
        if (!formData.certificate_title?.length || formData.certificate_title.length <= 1) return;

        ['certificate_title', 'certificate_description'].forEach(key => {
            const newArray = [...formData[key]];
            newArray.splice(index, 1);
            updateFormData(key, newArray);
        });

        setActiveIndex(Math.max(0, activeIndex - 1));
    };

    if (!formData.certificate_title?.length) {
        return null;
    }

    const addCertificate = () => {
        updateFormData('certificate_title', [...(formData.certificate_title || []), '']);
        updateFormData('certificate_description', [...(formData.certificate_description || []), '']);
        setActiveIndex(formData.certificate_title?.length || 0);
    };

    // Combined view with both basic information and description editor
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3 mb-4">

                <button
                    onClick={addCertificate}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-50 text-blue-600 rounded-lg
                    hover:bg-blue-100 transition-all duration-300 flex items-center justify-center
                    gap-2 text-sm font-medium shadow-sm hover:shadow transform hover:scale-[1.02]"
                >
                    <Plus className="w-4 h-4" />
                    Add Certificate
                </button>
            </div>
            {formData.certificate_title.map((_, index) => (

                <ContentItem
                    key={index}
                    title={formData.certificate_title[index] || 'New Certificate'}
                    isActive={activeIndex === index}
                    canDelete={formData.certificate_title.length > 1}
                    onDelete={(e) => removeItem(index, 'certificate', e)}
                    onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                >

                    <div className="p-5 bg-white space-y-5">
                        <div className="grid grid-cols-1 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Title</label>
                                <input
                                    value={formData.certificate_title[index] || ''}
                                    onChange={(e) => {
                                        const newArray = [...formData.certificate_title];
                                        newArray[index] = e.target.value;
                                        updateFormData('certificate_title', newArray);
                                    }}
                                    placeholder="e.g., AWS Certified Solutions Architect"
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg
                                    outline-none transition-colors hover:border-blue-400 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        {/*  */}
                        {/* Description Editor Section */}
                        {/*   <EnhancedTipTapEditor
                            value={formData.certificate_description[index] || ''}
                            onChange={(e) => {
                                const newArray = [...formData.certificate_description];
                                newArray[index] = e.target.value;
                                updateFormData('certificate_description', newArray);
                            }}
                            title={formData.certificate_title[index] || 'Certificate Description'}
                            customPrompt={`Provide detailed descriptions of the ${formData.certificate_title[index] || 'certificate'} and its value:`}
                            suggestions={certificateSuggestions}
                            onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, index)}
                            isSuggestionSelected={(suggestion) => isSuggestionSelected(suggestion, index)}
                            showWritingAssistant={true}
                        /> */}
                    </div>
                </ContentItem>
            ))}
        </div>
    );
};

export default CertificateTabEnhanced;