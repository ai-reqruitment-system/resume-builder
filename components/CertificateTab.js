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
        <div className="space-y-4">
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
                                    outline-none transition-colors hover:border-teal-400 focus:border-teal-500"
                                />
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <SuggestionDropdown
                                    onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, index)}
                                    title={formData.certificate_title[index] || 'certificate'}
                                    customPrompt="provide detailed descriptions of this certification and its value:"
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
                                className="w-full min-h-[150px] border border-gray-200 rounded-lg
                                    focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500
                                    transition-all duration-300"
                            />
                        </div>
                    </div>
                </ContentItem>
            ))}
        </div>
    );
};

export default CertificateTab;