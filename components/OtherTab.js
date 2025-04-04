import React, { useEffect } from "react";
import ContentItem from "@/components/ContentItem";
import Editor from "react-simple-wysiwyg";
import SmartInputField from "@/components/SmartInputField";
import SuggestionDropdown from "@/components/SuggestionDropdown";

const OtherTab = ({
    formData,
    updateFormData,
    activeIndex,
    setActiveIndex
}) => {
    useEffect(() => {
        if (!formData.other_title?.length) {
            initializeEmptyOther();
        }
    }, []);

    const initializeEmptyOther = () => {
        updateFormData('other_title', ['']);
        updateFormData('other_description', ['']);
    };

    const removeItem = (index, type, e) => {
        e.stopPropagation();
        if (!formData.other_title?.length || formData.other_title.length <= 1) return;

        ['other_title', 'other_description'].forEach(key => {
            const newArray = [...formData[key]];
            newArray.splice(index, 1);
            updateFormData(key, newArray);
        });

        setActiveIndex(Math.max(0, activeIndex - 1));
    };

    const handleSuggestionClick = (suggestion, index) => {
        const currentContent = formData.other_description[index] || '';
        const bulletPoint = `<ul><li>${suggestion}</li></ul>`;

        let newContent;
        if (!currentContent) {
            newContent = bulletPoint;
        } else if (currentContent.includes('</ul>')) {
            newContent = currentContent.replace('</ul>', `<li>${suggestion}</li></ul>`);
        } else {
            newContent = currentContent + bulletPoint;
        }

        const newArray = [...formData.other_description];
        newArray[index] = newContent;
        updateFormData('other_description', newArray);
    };

    if (!formData.other_title?.length) {
        return null;
    }

    return (
        <div className="space-y-3">
            {formData.other_title.map((_, index) => (
                <ContentItem
                    key={index}
                    title={formData.other_title[index] || 'New Other Achievement'}
                    isActive={activeIndex === index}
                    canDelete={formData.other_title.length > 1}
                    onDelete={(e) => removeItem(index, 'other', e)}
                    onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                >
                    <div className="p-3 bg-white space-y-3">
                        <div className="grid grid-cols-1 gap-3">
                            <SmartInputField
                                label="Other Achievement Title"
                                value={formData.other_title[index] || ''}
                                onChange={(e) => {
                                    const newArray = [...formData.other_title];
                                    newArray[index] = e.target.value;
                                    updateFormData('other_title', newArray);
                                }}
                                currentDescription={formData.other_description}
                                onDescriptionChange={(e) => updateFormData('other_description', e.target.value)}
                                placeholder="e.g., Leadership Award"
                                className="bg-white"
                                promptType="provide details for this achievement:"
                                index={index}
                            />
                        </div>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm text-gray-600">Description</label>
                                <SuggestionDropdown
                                    onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, index)}
                                    title={formData.other_title[index] || 'achievement'}
                                    customPrompt="provide detailed descriptions and impact of this achievement:"
                                    isSuggestionSelected={(suggestion) => {
                                        const content = formData.other_description[index] || '';
                                        return content.includes(suggestion);
                                    }}
                                />
                            </div>
                            <Editor
                                value={formData.other_description[index] || ''}
                                onChange={(e) => {
                                    const newArray = [...formData.other_description];
                                    newArray[index] = e.target.value;
                                    updateFormData('other_description', newArray);
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

export default OtherTab;