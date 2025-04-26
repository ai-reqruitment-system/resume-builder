// pages/builder.js or pages/builder.jsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
// Icons
import {
    Briefcase, Check, Eye, Download, GraduationCap,
    Plus, Trophy, UserCircle2, X, Menu
} from 'lucide-react';
// Layouts and Components
import Layout from '@/components/Layout';
import ResumeModal from '@/components/ResumeModal';
import DownloadSection from '@/components/DownloadSection';
import PersonalInfo from '@/components/sections/PersonalInfo';
import Experience from '@/components/sections/Experience';
import Education from '@/components/sections/Education';
import Skills from '@/components/sections/Skills';
import Others from '@/components/sections/Others';
// Redux actions
import {
    setFormData, updateFormField, setProfileData, setUserData
} from '@/store/slices/resumeSlice';
import {
    setCurrentSection, setCurrentSectionIndex,
    setIsModalOpen, setShowDownloadSection,
    setIsMobileMenuOpen, toggleMobileMenu
} from '@/store/slices/uiSlice';
import { setSelectedTemplate } from '@/store/slices/templateSlice';

export default function Builder() {
    const dispatch = useDispatch();
    const router = useRouter();
    // Redux States
    const { formData, profileData, userData, defaultData } = useSelector(state => state.resume);
    const { currentSection, currentSectionIndex, isModalOpen, showDownloadSection, isMobileMenuOpen } = useSelector(state => state.ui);
    const { selectedTemplate, fontStyles } = useSelector(state => state.template);

    const sections = [
        { id: 'personal', title: 'Personal Info', icon: UserCircle2 },
        { id: 'experience', title: 'Experience', icon: Briefcase },
        { id: 'education', title: 'Education', icon: GraduationCap },
        { id: 'skills', title: 'Skills', icon: Trophy },
        { id: 'others', title: 'Others', icon: Plus }
    ];

    // Update form field handler
    const updateFormDataHandler = (field, value) => {
        dispatch(updateFormField({ field, value }));
    };

    // Render the correct section
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

    // Handle template change
    const handleTemplateChange = (template) => {
        dispatch(setSelectedTemplate(template));
        dispatch(updateFormField({ field: 'templateName', value: template }));
        router.push(
            {
                pathname: router.pathname,
                query: { ...router.query, templateId: template }
            },
            undefined,
            { shallow: true }
        );
    };

    // Load templateId from URL
    useEffect(() => {
        if (router.isReady && router.query.templateId) {
            const template = router.query.templateId;
            if (template !== selectedTemplate) {
                dispatch(setSelectedTemplate(template));
            }
        }
    }, [router.isReady, router.query.templateId, selectedTemplate, dispatch]);

    // Load user and profile data
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
            dispatch(setUserData(userData));
            dispatch(setProfileData(profileData));
        }
    }, [router, dispatch]);

    // Update templateName in formData
    useEffect(() => {
        if (formData) {
            dispatch(updateFormField({ field: 'templateName', value: selectedTemplate }));
        }
    }, [selectedTemplate, formData, dispatch]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Tabs */}
            <nav className="bg-white shadow-sm sticky top-0 z-20 py-2 px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    {/* Mobile Navbar */}
                    <div className="flex items-center justify-between md:hidden">
                        <h1 className="text-lg font-medium text-gray-800">Resume Builder</h1>
                        <button
                            onClick={() => dispatch(toggleMobileMenu())}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                    {/* Sections List */}
                    <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-wrap md:flex-nowrap gap-2`}>
                        {sections.map((section, index) => {
                            const Icon = section.icon;
                            const isActive = currentSection === section.id;
                            const isCompleted = index < currentSectionIndex;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => {
                                        dispatch(setCurrentSection(section.id));
                                        dispatch(setCurrentSectionIndex(index));
                                        dispatch(setIsMobileMenuOpen(false));
                                    }}
                                    className={`flex items-center gap-2 py-2.5 px-4 rounded-lg transition-all
                    ${isActive
                                            ? 'bg-teal-100 text-gray-800 font-semibold'
                                            : isCompleted
                                                ? 'text-gray-700 hover:bg-teal-100'
                                                : 'text-gray-500 hover:bg-teal-200'}
                  `}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm">{section.title}</span>
                                    {isCompleted && <Check className="w-3 h-3 text-green-500" />}
                                </button>
                            );
                        })}
                        {/* Mobile Preview Button */}
                        <div className="flex flex-col md:hidden w-full">
                            <button
                                onClick={() => {
                                    dispatch(setIsModalOpen(true));
                                    dispatch(setIsMobileMenuOpen(false));
                                }}
                                className="mt-2 flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 font-medium"
                            >
                                <Eye className="w-4 h-4" />
                                Preview
                            </button>
                        </div>
                    </div>
                    {/* Desktop Preview Button */}
                    <div className="hidden md:flex gap-2">
                        <button
                            onClick={() => dispatch(setIsModalOpen(true))}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 font-medium"
                        >
                            <Eye className="w-4 h-4" />
                            Preview
                        </button>
                    </div>
                </div>
            </nav>
            {/* Main Content */}
            <div className="w-full mx-auto p-4">
                {formData && renderSection()}
            </div>
            {/* Download Section Modal */}
            {showDownloadSection && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-medium">Download Resume</h3>
                            <button
                                onClick={() => dispatch(setShowDownloadSection(false))}
                                className="text-gray-400 hover:text-gray-600"
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
            {/* Resume Preview Modal */}
            <ResumeModal
                isOpen={isModalOpen}
                onRequestClose={() => dispatch(setIsModalOpen(false))}
                formData={formData}
                fontStyles={fontStyles}
                defaultData={defaultData}
                selectedTemplate={selectedTemplate}
                onTemplateChange={handleTemplateChange}
                onDownload={() => {
                    dispatch(setIsModalOpen(false));
                    dispatch(setShowDownloadSection(true));
                }}
            />
        </div>
    );
}