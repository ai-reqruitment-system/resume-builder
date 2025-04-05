import React, { useEffect } from 'react';
import { Briefcase, Check, Eye, Download, GraduationCap, Plus, Trophy, UserCircle2, X, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import PersonalInfo from '../components/sections/PersonalInfo';
import Experience from '../components/sections/Experience';
import Skills from "@/components/sections/Skills";
import Education from "@/components/sections/Education";
import Others from "@/components/sections/Others";
import { uuid } from "uuidv4";
import ResumeModal from "@/components/ResumeModal";
import DownloadSection from "@/components/DownloadSection";
import BuilderRightSidebar from "@/components/dashboard-sections/BuilderRightSidebar";
// Redux imports
import { useSelector, useDispatch } from 'react-redux';
import { setFormData, updateFormField, setProfileData, setUserData } from '@/store/slices/resumeSlice';
import { setCurrentSection, setCurrentSectionIndex, setIsModalOpen, setShowDownloadSection, setIsMobileMenuOpen, toggleMobileMenu, toggleRightSidebar, setIsRightSidebarOpen } from '@/store/slices/uiSlice';
import { setSelectedTemplate, setFontStyles, updateFontStyle } from '@/store/slices/templateSlice';
// UI components
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
export default function Builder() {
    // Use Redux state instead of local state
    const dispatch = useDispatch();
    const router = useRouter();

    // Get state from Redux store
    const { formData, profileData, userData, defaultData } = useSelector(state => state.resume);
    const { currentSection, currentSectionIndex, isModalOpen, showDownloadSection, isMobileMenuOpen, isRightSidebarOpen, isSidebarOpen } = useSelector(state => state.ui);
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
        <div className="min-h-screen bg-gray-50 min-w-full relative">
            {/* Top Navigation - Mobile Only */}
            <nav className="md:hidden bg-white shadow-sm sticky top-0 z-20 transition-all duration-300 py-2 px-2 sm:px-4">
                <div className="flex items-center justify-between">
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

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="mt-4 pb-2">
                        <div className="flex flex-col space-y-2">
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
                                            flex items-center justify-between gap-2
                                            
                                            ${currentSection === section.id
                                                ? 'bg-teal-100 text-gray-600 font-medium shadow-sm'
                                                : index <= currentSectionIndex
                                                    ? 'text-gray-700 hover:bg-teal-100'
                                                    : 'text-gray-500 hover:bg-teal-200'
                                            }
                                        `}
                                    >
                                        <Icon className={`w-5 h-5 transition-transform duration-300 ${currentSection === section.id ? 'scale-110' : ''}`} />
                                        <span className="text-sm whitespace-nowrap font-medium">{section.title}</span>
                                        {index < currentSectionIndex && (
                                            <Check className="w-3 h-3 text-green-500 transition-opacity duration-300" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-4">
                            <button
                                onClick={() => {
                                    dispatch(setIsModalOpen(true));
                                    dispatch(setIsMobileMenuOpen(false));
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-300 text-sm font-medium justify-center"
                            >
                                <Eye className="w-4 h-4" />
                                <span>Preview</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            <div className="flex h-[calc(100vh-56px)] md:h-screen relative">
                {/* Right Sidebar - Navigation */}
                {isRightSidebarOpen && <BuilderRightSidebar />}

                {/* Toggle Right Sidebar Button - Desktop Only */}
                <button
                    onClick={() => dispatch(toggleRightSidebar())}
                    className="hidden md:flex fixed right-4 top-4 z-30 items-center justify-center h-10 w-10 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all duration-300"
                >
                    {isRightSidebarOpen ? (
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                    ) : (
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                    )}
                </button>

                {/* Main Content */}
                <div className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${isRightSidebarOpen ? 'md:mr-16 lg:mr-64' : ''}`}>
                    <div className="p-4 sm:p-6 md:p-8">
                        {formData && renderSection()}
                    </div>
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