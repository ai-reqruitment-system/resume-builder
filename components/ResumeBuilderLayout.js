import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Check, ChevronRight, ArrowLeft, ArrowRight, Home, FileText, Settings, Eye, Sparkles, Menu, X } from 'lucide-react';
import Link from 'next/link';

// Import section components
import PersonalInfo from './sections/PersonalInfo';
import Experience from './sections/Experience';
import Education from './sections/Education';
import Skills from './sections/Skills';
import Others from './sections/Others';

// Redux imports
import { useSelector, useDispatch } from 'react-redux';
import { updateFormField } from '@/store/slices/resumeSlice';
import { setCurrentSection, setCurrentSectionIndex, setIsModalOpen } from '@/store/slices/uiSlice';
import ResumeModal from './ResumeModal';
import AiWritingAssistantModal from './AiWritingAssistantModal';

const ResumeBuilderLayout = ({ onClose }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    // Local state for AI writing assistant modal and mobile menu
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState('professional summary');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Get state from Redux store
    const { formData, defaultData } = useSelector(state => state.resume);
    const { currentSection, currentSectionIndex, isModalOpen } = useSelector(state => state.ui);
    const { selectedTemplate, fontStyles } = useSelector(state => state.template);

    // Define the sections for the sidebar
    const sections = [
        { id: 'header', title: 'Header', completed: false },
        { id: 'experience', title: 'Experience', completed: false },
        { id: 'education', title: 'Education', completed: false },
        { id: 'skills', title: 'Skills', completed: false },
        { id: 'summary', title: 'Summary', completed: false },
        { id: 'additional', title: 'Additional Details', completed: false },
        { id: 'finalize', title: 'Finalize', completed: false },
    ];

    // Update form data handler
    const updateFormDataHandler = (field, value) => {
        dispatch(updateFormField({ field, value }));
    };

    // Render the current section content
    const renderSection = () => {
        switch (currentSection) {
            case 'header':
                return <PersonalInfo formData={formData} updateFormData={updateFormDataHandler} />;
            case 'experience':
                return <Experience formData={formData} updateFormData={updateFormDataHandler} />;
            case 'education':
                return <Education formData={formData} updateFormData={updateFormDataHandler} />;
            case 'skills':
                return <Skills formData={formData} updateFormData={updateFormDataHandler} />;
            case 'additional':
            case 'summary':
            case 'finalize':
                return <Others formData={formData} updateFormData={updateFormDataHandler} />;
            default:
                return <PersonalInfo formData={formData} updateFormData={updateFormDataHandler} />;
        }
    };

    // Handle navigation between sections
    const handleNext = () => {
        const nextIndex = currentSectionIndex + 1;
        if (nextIndex < sections.length) {
            dispatch(setCurrentSection(sections[nextIndex].id));
            dispatch(setCurrentSectionIndex(nextIndex));
        }
    };

    const handlePrevious = () => {
        const prevIndex = currentSectionIndex - 1;
        if (prevIndex >= 0) {
            dispatch(setCurrentSection(sections[prevIndex].id));
            dispatch(setCurrentSectionIndex(prevIndex));
        }
    };

    // Get the current progress percentage
    const progressPercentage = ((currentSectionIndex + 1) / sections.length) * 100;

    return (
        <div className="flex flex-col md:flex-row h-screen bg-white relative">
            {/* Mobile Header */}
            <div className="md:hidden bg-gradient-to-r from-teal-700 to-teal-800 p-3 flex items-center justify-between text-white shadow-md">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-lg bg-teal-600/40 hover:bg-teal-600/60 transition-colors"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <span className="font-semibold">Resume Builder</span>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => dispatch(setIsModalOpen(true))}
                        className="p-2 rounded-lg bg-teal-600/40 hover:bg-teal-600/60 transition-colors"
                    >
                        <Eye className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Left Sidebar */}
            <div className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative top-0 left-0 h-full z-50 w-[280px] md:w-64 bg-gradient-to-b from-teal-800 to-teal-900 text-white flex flex-col shadow-xl transition-transform duration-300 ease-in-out`}>
                {/* Mobile Close Button */}
                <div className="md:hidden flex justify-between items-center p-4 bg-teal-950/50 border-b border-teal-700/30">
                    <span className="font-semibold">Resume Builder</span>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-1.5 rounded-lg bg-teal-600/40 hover:bg-teal-600/60 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {/* Progress Indicator - Moved to top */}
                <div className="p-4 bg-teal-950/50 border-b border-teal-700/30">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-teal-100">Resume Progress</span>
                        <span className="text-xs font-bold text-teal-200">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-teal-700/30 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-teal-400 to-teal-300 h-2 rounded-full transition-all duration-500 shadow-inner"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Dashboard Navigation */}
                <div className="p-4 border-b border-teal-700/30">
                    <Link href="/dashboard" className="flex items-center space-x-2 group transition-all duration-300 hover:scale-105 bg-teal-800/50 p-3 rounded-lg hover:bg-teal-700/50">
                        <div className="h-9 w-9 bg-teal-500 rounded-lg flex items-center justify-center shadow-md group-hover:bg-teal-400 transition-colors">
                            <Home className="h-5 w-5 text-teal-900" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Dashboard</span>
                            <span className="text-xs text-teal-200">Return to main menu</span>
                        </div>
                    </Link>
                </div>

                {/* Progress Steps */}
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="mb-4">
                        <h3 className="text-teal-200 text-xs font-semibold uppercase tracking-wider mb-2">Resume Sections</h3>
                    </div>
                    <div className="space-y-1.5">
                        {sections.map((section, index) => {
                            const isActive = currentSection === section.id;
                            const isPast = index < currentSectionIndex;

                            return (
                                <div key={section.id} className="relative">
                                    <button
                                        onClick={() => {
                                            dispatch(setCurrentSection(section.id));
                                            dispatch(setCurrentSectionIndex(index));
                                        }}
                                        className={`flex items-center w-full py-3 px-4 rounded-lg transition-all duration-300 
                                            ${isActive
                                                ? 'bg-teal-600/40 shadow-inner border-l-4 border-teal-300'
                                                : isPast
                                                    ? 'hover:bg-teal-700/40 border-l-4 border-teal-500/50'
                                                    : 'hover:bg-teal-700/30 border-l-4 border-transparent'} 
                                            transform hover:translate-x-1`}
                                    >
                                        <div
                                            className={`h-7 w-7 rounded-full flex items-center justify-center mr-3 shadow-md 
                                                ${isActive
                                                    ? 'bg-teal-400 text-teal-900'
                                                    : isPast
                                                        ? 'bg-teal-500 text-white'
                                                        : 'bg-teal-800 text-teal-300 border border-teal-600'}`}
                                        >
                                            {isPast ? (
                                                <Check className="h-3.5 w-3.5" />
                                            ) : (
                                                <span className="text-xs font-medium">{index + 1}</span>
                                            )}
                                        </div>
                                        <span className={`text-sm ${isActive ? 'font-medium text-white' : isPast ? 'text-teal-100' : 'text-teal-300'}`}>
                                            {section.title}
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Resume Settings */}
                <div className="p-4 border-t border-teal-700/30 bg-teal-900/70">
                    <button className="flex items-center justify-center space-x-2 w-full text-sm text-teal-100 hover:text-white transition-colors py-2.5 px-4 rounded-lg bg-teal-800/50 hover:bg-teal-700/70 shadow-inner">
                        <Settings className="h-4 w-4" />
                        <span>Resume Settings</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-auto w-full">
                {/* Header - Hidden on mobile */}
                <div className="hidden md:block bg-gradient-to-r from-teal-700 to-teal-800 p-4 lg:p-6 text-white shadow-md">
                    <div className="flex items-center text-sm text-teal-100 mb-2">
                        <Link href="/dashboard" className="hover:text-white transition-colors duration-200 flex items-center"><Home className="h-3 w-3 mr-1" /> Dashboard</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span>Resume Builder</span>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-1">
                                {currentSection === 'experience' && 'Add details about your work experience'}
                                {currentSection === 'education' && 'Add your education background'}
                                {currentSection === 'skills' && 'What skills do you have?'}
                                {currentSection === 'header' && 'Let\'s start with your personal details'}
                                {currentSection === 'summary' && 'Summarize your professional background'}
                                {currentSection === 'additional' && 'Any additional information to include?'}
                                {currentSection === 'finalize' && 'Review and finalize your resume'}
                            </h1>
                            <p className="text-teal-100">
                                {currentSection === 'experience' && 'Great progress! Next up → Education'}
                                {currentSection === 'education' && 'Keep going! Next up → Skills'}
                                {currentSection === 'skills' && 'Almost there! Next up → Summary'}
                                {currentSection === 'header' && 'Next up → Experience'}
                                {currentSection === 'summary' && 'Getting closer! Next up → Additional Details'}
                                {currentSection === 'additional' && 'Final step! Next up → Finalize'}
                                {currentSection === 'finalize' && 'You\'re all set to download your resume!'}
                            </p>
                        </div>

                        {/* AI Helper Icon */}
                        <div className="flex items-center space-x-2 lg:space-x-3 flex-wrap">
                            <button
                                onClick={() => {
                                    setIsAiModalOpen(true);
                                    // Set the current field based on the active section
                                    if (currentSection === 'experience') setCurrentField('work experience');
                                    else if (currentSection === 'education') setCurrentField('education');
                                    else if (currentSection === 'skills') setCurrentField('skills');
                                    else if (currentSection === 'summary') setCurrentField('professional summary');
                                    else if (currentSection === 'additional') setCurrentField('additional information');
                                    else setCurrentField('resume content');
                                }}
                                className="bg-white/10 backdrop-blur-sm p-2 lg:p-3 rounded-xl shadow-lg border border-teal-400/20 hover:bg-white/20 transition-colors cursor-pointer group flex-1 lg:flex-none"
                            >
                                <div className="flex items-center space-x-2">
                                    <div className="bg-teal-500 p-2 rounded-lg shadow-inner group-hover:bg-teal-400 transition-colors">
                                        <Sparkles className="h-5 w-5 text-teal-900" />
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium">AI Writing Assistant</p>
                                        <p className="text-teal-100 text-xs">Get help with phrasing and content suggestions</p>
                                    </div>
                                </div>
                            </button>

                            {/* Preview Button */}
                            <button
                                onClick={() => dispatch(setIsModalOpen(true))}
                                className="bg-white/10 backdrop-blur-sm p-2 lg:p-3 rounded-xl shadow-lg border border-teal-400/20 hover:bg-white/20 transition-colors cursor-pointer group flex-1 lg:flex-none"
                            >
                                <div className="flex items-center space-x-2">
                                    <div className="bg-teal-500 p-2 rounded-lg shadow-inner group-hover:bg-teal-400 transition-colors">
                                        <Eye className="h-5 w-5 text-teal-900" />
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium">Preview Resume</p>
                                        <p className="text-teal-100 text-xs">See how your resume looks</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 p-3 sm:p-4 overflow-auto bg-gray-50/50">
                    <div className="w-full bg-white p-5 rounded-xl shadow-sm">
                        {renderSection()}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="p-3 sm:p-4 border-t border-gray-200 bg-white shadow-md z-10">
                    <div className="w-full flex justify-between">
                        <button
                            onClick={handlePrevious}
                            disabled={currentSectionIndex === 0}
                            className={`px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-all duration-300 text-sm sm:text-base ${currentSectionIndex === 0 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-md transform hover:-translate-y-0.5'}`}
                        >
                            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>Back</span>
                        </button>

                        <button
                            onClick={handleNext}
                            className="px-3 sm:px-6 py-2.5 sm:py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-all duration-300 flex items-center space-x-1 sm:space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
                        >
                            <span>{currentSectionIndex === sections.length - 1 ? 'Finish' : 'Continue'}</span>
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Resume Modal */}
            <ResumeModal
                isOpen={isModalOpen}
                onRequestClose={() => dispatch(setIsModalOpen(false))}
                formData={formData}
                fontStyles={fontStyles}
                selectedTemplate={selectedTemplate}
                defaultData={defaultData}
            />

            {/* AI Writing Assistant Modal */}
            <AiWritingAssistantModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                title={currentField}
                onSuggestionClick={(suggestion) => {
                    // Handle the suggestion click based on the current section
                    switch (currentSection) {
                        case 'header':
                            // For personal info, update the professional_description field
                            if (formData.professional_description) {
                                const currentContent = formData.professional_description;
                                // Add the suggestion as a bullet point if it doesn't already exist
                                if (!currentContent.includes(suggestion)) {
                                    let newContent;
                                    if (currentContent.includes('<ul>')) {
                                        // Add to existing list
                                        newContent = currentContent.replace('</ul>', `<li>${suggestion}</li></ul>`);
                                    } else {
                                        // Create new list
                                        newContent = `${currentContent}<ul><li>${suggestion}</li></ul>`;
                                    }
                                    updateFormDataHandler('professional_description', newContent);
                                }
                            } else {
                                // Create new content with the suggestion
                                updateFormDataHandler('professional_description', `<ul><li>${suggestion}</li></ul>`);
                            }
                            break;
                        case 'experience':
                            // For experience, we would need to know which job to update
                            // This is simplified - in a real implementation, you'd need to track the active job index
                            if (formData.job_description && formData.job_description.length > 0) {
                                const index = 0; // Update the first job for simplicity
                                const descriptions = [...formData.job_description];
                                const currentContent = descriptions[index] || '';

                                if (!currentContent.includes(suggestion)) {
                                    let newContent;
                                    if (currentContent.includes('<ul>')) {
                                        newContent = currentContent.replace('</ul>', `<li>${suggestion}</li></ul>`);
                                    } else {
                                        newContent = `${currentContent}<ul><li>${suggestion}</li></ul>`;
                                    }
                                    descriptions[index] = newContent;
                                    updateFormDataHandler('job_description', descriptions);
                                }
                            }
                            break;
                        case 'education':
                            // Similar approach for education
                            if (formData.college_description && formData.college_description.length > 0) {
                                const index = 0; // Update the first education entry for simplicity
                                const descriptions = [...formData.college_description];
                                const currentContent = descriptions[index] || '';

                                if (!currentContent.includes(suggestion)) {
                                    let newContent;
                                    if (currentContent.includes('<ul>')) {
                                        newContent = currentContent.replace('</ul>', `<li>${suggestion}</li></ul>`);
                                    } else {
                                        newContent = `${currentContent}<ul><li>${suggestion}</li></ul>`;
                                    }
                                    descriptions[index] = newContent;
                                    updateFormDataHandler('college_description', descriptions);
                                }
                            }
                            break;
                        case 'skills':
                            // For skills, add as a new skill if it doesn't exist
                            if (formData.skill) {
                                const skills = [...formData.skill];
                                if (!skills.includes(suggestion)) {
                                    skills.push(suggestion);
                                    updateFormDataHandler('skill', skills);
                                }
                            } else {
                                updateFormDataHandler('skill', [suggestion]);
                            }
                            break;
                        case 'summary':
                            // Update summary field
                            if (formData.summary) {
                                if (!formData.summary.includes(suggestion)) {
                                    updateFormDataHandler('summary', formData.summary + '\n' + suggestion);
                                }
                            } else {
                                updateFormDataHandler('summary', suggestion);
                            }
                            break;
                        default:
                            // For other sections, just log the suggestion
                            console.log('Selected suggestion for', currentSection, ':', suggestion);
                            break;
                    }
                }}
                isSuggestionSelected={(suggestion) => {
                    // Check if the suggestion is already selected based on the current section
                    switch (currentSection) {
                        case 'header':
                            return formData.professional_description && formData.professional_description.includes(suggestion);
                        case 'experience':
                            return formData.job_description &&
                                formData.job_description.length > 0 &&
                                formData.job_description[0] &&
                                formData.job_description[0].includes(suggestion);
                        case 'education':
                            return formData.college_description &&
                                formData.college_description.length > 0 &&
                                formData.college_description[0] &&
                                formData.college_description[0].includes(suggestion);
                        case 'skills':
                            return formData.skill && formData.skill.includes(suggestion);
                        case 'summary':
                            return formData.summary && formData.summary.includes(suggestion);
                        default:
                            return false;
                    }
                }}
            />
        </div>
    );
};

export default ResumeBuilderLayout;