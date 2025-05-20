import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

const NavigationButtons = ({
                               currentSectionIndex,
                               sections,
                               handleNavigation,
                               downloadPDF
                           }) => {
    const isLastSection = currentSectionIndex === sections.length - 1;
    const isFirstSection = currentSectionIndex === 0;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
            <div className="bg-white rounded-full shadow-lg p-2 flex items-center gap-2">
                {/* Previous Button */}
                <button
                    onClick={() => handleNavigation('prev')}
                    disabled={isFirstSection}
                    className={`
                        relative group p-3 rounded-full
                        transition-all duration-200 ease-in-out
                        ${isFirstSection
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-teal-600'
                    }
                    `}
                >
                    <ChevronLeft className="w-6 h-6" />
                    {/* Tooltip */}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 text-white text-sm
                        rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Previous Section
                    </span>
                </button>

                {/* Next/Download Button */}
                {isLastSection ? (
                    <button
                        onClick={downloadPDF}
                        className="relative group p-3 rounded-full bg-green-500 text-white
                            hover:bg-green-600 transition-all duration-200 ease-in-out"
                    >
                        <Download className="w-6 h-6" />
                        {/* Tooltip */}
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 text-white text-sm
                            rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Download Resume
                        </span>
                    </button>
                ) : (
                    <button
                        onClick={() => handleNavigation('next')}
                        className="relative group p-3 rounded-full bg-teal-500 text-white
                            hover:bg-teal-600 transition-all duration-200 ease-in-out"
                    >
                        <ChevronRight className="w-6 h-6" />
                        {/* Tooltip */}
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 text-white text-sm
                            rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Next Section
                        </span>
                    </button>
                )}
            </div>

            {/* Progress Indicator */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-500 whitespace-nowrap">
                {currentSectionIndex + 1} / {sections.length}
            </div>
        </div>
    );
};

export default NavigationButtons;