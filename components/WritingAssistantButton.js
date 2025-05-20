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
                className={`flex items-center gap-0.5 xxs:gap-0.5 xs:gap-1 sm:gap-2 px-1 xxs:px-1.5 xs:px-2 sm:px-3 md:px-4 py-0.5 xxs:py-1 xs:py-1.5 sm:py-2 text-[8px] xxs:text-[10px] xs:text-xs sm:text-sm text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-all duration-300 whitespace-nowrap ${buttonClassName}`}
                aria-haspopup="dialog"
            >
                <Plus className="w-2 h-2 xxs:w-2.5 xxs:h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">Get help</span>
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