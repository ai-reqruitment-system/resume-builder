import React, { useEffect } from 'react';
import { Briefcase, Check, Eye, Download, GraduationCap, Plus, Trophy, UserCircle2, X, Menu } from 'lucide-react';
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

import { uuid } from "uuidv4";
import ResumeModal from "@/components/ResumeModal";
import DownloadSection from "@/components/DownloadSection";
// Redux imports
import { useSelector, useDispatch } from 'react-redux';
import { setFormData, updateFormField, setProfileData, setUserData } from '@/store/slices/resumeSlice';
import { setCurrentSection, setCurrentSectionIndex, setIsModalOpen, setShowDownloadSection, setIsMobileMenuOpen, toggleMobileMenu } from '@/store/slices/uiSlice';
import { setSelectedTemplate, setFontStyles, updateFontStyle } from '@/store/slices/templateSlice';
// UI components
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import PersonalInfo from '@/components/sections/PersonalInfo';
import Experience from '@/components/sections/Experience';
export default function Builder() {
    // Use Redux state instead of local state
    const dispatch = useDispatch();
    const router = useRouter();

    // Get state from Redux store
    const { formData, profileData, userData, defaultData } = useSelector(state => state.resume);
    const { currentSection, currentSectionIndex, isModalOpen, showDownloadSection, isMobileMenuOpen } = useSelector(state => state.ui);
    const { selectedTemplate, fontStyles } = useSelector(state => state.template);
    const handleTemplateChange = (template) => {
        dispatch(setSelectedTemplate(template));
        dispatch(updateFormField({
            field: 'templateName',
            value: template
        }));

        router.push(
            {
                pathname: router.pathname,
                query: { ...router.query, templateId: template }
            },
            undefined,
            { shallow: true }
        );
    };
    useEffect(() => {
        // This will run when the component mounts and when the router query changes
        if (router.isReady && router.query.templateId) {
            const template = router.query.templateId;
            if (template !== selectedTemplate) {
                dispatch(setSelectedTemplate(template));
            }
        }
    }, [router.isReady, router.query, selectedTemplate, dispatch]); // Don't include formData here

    // defaultData is now coming from the Redux store
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        const userData = JSON.parse(localStorage.getItem('profileData') || '{}');
        const loginUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        dispatch(setUserData(loginUserData));
        dispatch(setProfileData(userData));
    }, [router, dispatch]);

    useEffect(() => {
        if (formData) {
            dispatch(updateFormField({
                field: 'templateName',
                value: selectedTemplate
            }));
        }
    }, [selectedTemplate, formData, dispatch]);

    // This useEffect is no longer needed as the mapping logic is now handled in the resumeSlice
    // The setProfileData action in the resumeSlice will automatically map the profile data to form data
    // This simplifies the component and centralizes the data transformation logic

    const sections = [
        { id: 'personal', title: 'Personal Info', icon: UserCircle2 },
        { id: 'experience', title: 'Experience', icon: Briefcase },
        { id: 'education', title: 'Education', icon: GraduationCap },
        { id: 'skills', title: 'Skills', icon: Trophy },
        { id: 'others', title: 'Others', icon: Plus }
    ];

    const renderSection = () => {
        switch (currentSection) {
            case 'personal':
                return <PersonalInfo formData={formData} updateFormData={updateFormDataHandler} />;
            case 'experience':
                return <Experience formData={formData} updateFormData={updateFormDataHandler} />;
            case 'education':
                return <Education formData={formData} updateFormData={updateFormDataHandler} />;
            case 'skills':
                return <Skills formData={formData} updateFormData={updateFormDataHandler} />;
            case 'others':
                return <Others formData={formData} updateFormData={updateFormDataHandler} />;
            default:
                return null;
        }
    };

    // Handler function that dispatches the updateFormField action
    const updateFormDataHandler = (field, value) => {
        dispatch(updateFormField({ field, value }));
    };

    return (
        <div className="min-h-screen bg-gray-50 min-w-full">
            {/* Navigation Tabs */}
            <nav className="bg-white shadow-sm sticky top-0 z-20 transition-all duration-300 py-2 px-2 sm:px-4 md:px-6">

                <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
                    {/* Mobile Menu Button */}
                    <div className="flex items-center justify-between md:hidden">
                        <h1 className="text-lg font-medium text-gray-800">Resume Builder</h1>
                        <button
                            onClick={() => dispatch(toggleMobileMenu())}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex overflow-x-auto hide-scrollbar md:mx-0 md:px-0 w-full flex-col md:flex-row transition-all duration-300 ease-in-out`}>
                        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 w-full space-x-2">
                            {sections.map((section, index) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => {
                                            dispatch(setCurrentSection(section.id));
                                            dispatch(setCurrentSectionIndex(index));
                                            dispatch(setIsMobileMenuOpen(false));
                                        }}
                                        className={`
                                                relative py-2.5 px-4 rounded-lg transition-all duration-300 transform
                                                flex items-center justify-between gap-2 md:min-w-0
                                                
                                                ${currentSection === section.id
                                                ? 'bg-teal-100 text-gray-600 font-medium scale-[1.02] shadow-sm'
                                                : index <= currentSectionIndex
                                                    ? 'text-gray-700 hover:bg-teal-100 hover:scale-[1.02]'
                                                    : 'text-gray-500 hover:bg-teal-200 hover:scale-[1.02]'
                                            }
                                            `}
                                    >

                                        <Icon className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${currentSection === section.id ? 'scale-110' : ''}`} />
                                        <span className="text-sm whitespace-nowrap font-medium">{section.title}</span>
                                        {index < currentSectionIndex && (
                                            <Check className="w-3 h-3 text-green-500 transition-opacity duration-300" />
                                        )}

                                    </button>
                                );
                            })}
                        </div>

                        {/* Mobile Action Buttons */}
                        <div className="flex flex-col space-y-2 mt-4 md:hidden px-2">
                            <button
                                onClick={() => {
                                    dispatch(setIsModalOpen(true));
                                    dispatch(setIsMobileMenuOpen(false));
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-300 text-sm font-medium justify-center"
                            >
                                <Eye className="w-4 h-4" />
                                <span>Preview</span>
                            </button>
                        </div>
                    </div>
                    {/* Action Buttons - Only visible on desktop */}
                    <div className="hidden md:flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0">
                        <button
                            onClick={() => dispatch(setIsModalOpen(true))}
                            className="flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-300 text-sm font-medium min-w-[100px] justify-center"
                        >
                            <Eye className="w-4 h-4" />
                            <span>Preview</span>
                        </button>
                    </div>
                </div>

            </nav>

            {/* Main Content */}
            <div className="w-full mx-auto mb-10">
                <div className="w-full">
                    {formData && renderSection()}
                </div>
            </div>

            {/* Download Section Modal */}
            {showDownloadSection && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="font-medium">Download Resume</h3>
                            <button
                                onClick={() => dispatch(setShowDownloadSection(false))}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <DownloadSection
                            formData={formData}
                            fontStyles={fontStyles}
                            templateName={selectedTemplate}
                        />
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            <ResumeModal
                isOpen={isModalOpen}
                onRequestClose={() => dispatch(setIsModalOpen(false))}
                formData={formData}
                fontStyles={fontStyles}
                defaultData={defaultData}
                onTemplateChange={handleTemplateChange}
                selectedTemplate={selectedTemplate}
                onDownload={() => {
                    // This prop is no longer needed as we've added a direct download button in the modal
                    // but we'll keep it for backward compatibility
                    dispatch(setIsModalOpen(false));
                    dispatch(setShowDownloadSection(true));
                }}
            />
        </div>

    );
}