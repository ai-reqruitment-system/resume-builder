import React, { useEffect } from "react";
import ContentItem from "@/components/ContentItem";
import Editor from "react-simple-wysiwyg";
import SmartInputField from "@/components/SmartInputField";
import SuggestionDropdown from "@/components/SuggestionDropdown";

const CertificateTab = ({
                            formData,
                            updateFormData,
                            activeIndex,
                            setActiveIndex
                        }) => {
    useEffect(() => {
        if (!formData.certificate_title?.length) {
            initializeEmptyCertificate();
        }
    }, []);

    const initializeEmptyCertificate = () => {
        updateFormData('certificate_title', ['']);
        updateFormData('certificate_description', ['']);
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

    const handleSuggestionClick = (suggestion, index) => {
        const currentContent = formData.certificate_description[index] || '';
        const bulletPoint = `<ul><li>${suggestion}</li></ul>`;

        let newContent;
        if (!currentContent) {
            newContent = bulletPoint;
        } else if (currentContent.includes('</ul>')) {
            newContent = currentContent.replace('</ul>', `<li>${suggestion}</li></ul>`);
        } else {
            newContent = currentContent + bulletPoint;
        }

        const newArray = [...formData.certificate_description];
        newArray[index] = newContent;
        updateFormData('certificate_description', newArray);
    };

    if (!formData.certificate_title?.length) {
        return null;
    }

    return (
        <div className="space-y-3">
            {formData.certificate_title.map((_, index) => (
                <ContentItem
                    key={index}
                    title={formData.certificate_title[index] || 'New Certificate'}
                    isActive={activeIndex === index}
                    canDelete={formData.certificate_title.length > 1}
                    onDelete={(e) => removeItem(index, 'certificate', e)}
                    onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                >
                    <div className="p-3 bg-white space-y-3">
                        <div className="grid grid-cols-1 gap-3">
                            <SmartInputField
                                label="Certificate Title"
                                value={formData.certificate_title[index] || ''}
                                onChange={(e) => {
                                    const newArray = [...formData.certificate_title];
                                    newArray[index] = e.target.value;
                                    updateFormData('certificate_title', newArray);
                                }}
                                currentDescription={formData.certificate_description}
                                onDescriptionChange={(e) => updateFormData('certificate_description', e.target.value)}
                                placeholder="e.g., AWS Certified Solutions Architect"
                                className="bg-white"
                                promptType="provide a certificate details based on this title:"
                                index={index}
                            />
                        </div>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm text-gray-600">Description</label>
                                <SuggestionDropdown
                                    onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, index)}
                                    title={formData.certificate_title[index] || 'certificate'}
                                    customPrompt="provide detailed descriptions and achievements related to this certificate:"
                                    isSuggestionSelected={(suggestion) => {
                                        const content = formData.certificate_description[index] || '';
                                        return content.includes(suggestion);
                                    }}
                                />
                            </div>
                            <Editor
                                value={formData.certificate_description[index] || ''}
                                onChange={(e) => {
                                    const newArray = [...formData.certificate_description];
                                    newArray[index] = e.target.value;
                                    updateFormData('certificate_description', newArray);
                                }}
                                className="w-full min-h-[120px] border border-gray-200 rounded-lg
                                    focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500"
                            />
                        </div>
                    </div>
                </ContentItem>
            ))}
        </div>
    );
};

export default CertificateTab;