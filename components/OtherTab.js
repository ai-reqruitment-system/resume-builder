import React, { useEffect } from "react";
import ContentItem from "@/components/ContentItem";
import Editor from "react-simple-wysiwyg";
import SmartInputField from "@/components/SmartInputField";
<<<<<<< HEAD
import WritingAssistantButton from "@/components/WritingAssistantButton";
=======
import SuggestionDropdown from "@/components/SuggestionDropdown";
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935

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
<<<<<<< HEAD
        <div className="space-y-4">
=======
        <div className="space-y-3">
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
            {formData.other_title.map((_, index) => (
                <ContentItem
                    key={index}
                    title={formData.other_title[index] || 'New Other Achievement'}
                    isActive={activeIndex === index}
                    canDelete={formData.other_title.length > 1}
                    onDelete={(e) => removeItem(index, 'other', e)}
                    onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                >
<<<<<<< HEAD
                    <div className="p-5 bg-white space-y-5">
                        <div className="grid grid-cols-1 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Achievement Title</label>
                                <input
                                    value={formData.other_title[index] || ''}
                                    onChange={(e) => {
                                        const newArray = [...formData.other_title];
                                        newArray[index] = e.target.value;
                                        updateFormData('other_title', newArray);
                                    }}
                                    placeholder="e.g., Leadership Award"
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg
                                    outline-none transition-colors hover:border-teal-400 focus:border-teal-500"
                                />
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <WritingAssistantButton
=======
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
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
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
<<<<<<< HEAD
                                className="w-full min-h-[150px] border border-gray-200 rounded-lg
                                    focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500
                                    transition-all duration-300"
=======
                                className="w-full min-h-[120px] border border-gray-200 rounded-lg
                                    focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500"
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
                            />
                        </div>
                    </div>
                </ContentItem>
            ))}
        </div>
    );
};

export default OtherTab;