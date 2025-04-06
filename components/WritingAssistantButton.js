import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AiWritingAssistantModal from './AiWritingAssistantModal';

export default function WritingAssistantButton({
    onSuggestionClick,
    title = 'professional summary',
    customPrompt = null,
    isSuggestionSelected,
    buttonClassName = ""
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <button
                onClick={handleOpenModal}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-all duration-300 ${buttonClassName}`}
                aria-haspopup="dialog"
            >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">Get help with writing</span>
            </button>

            <AiWritingAssistantModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuggestionClick={onSuggestionClick}
                title={title}
                customPrompt={customPrompt}
                isSuggestionSelected={isSuggestionSelected}
            />
        </>
    );
}