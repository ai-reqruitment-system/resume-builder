// pages/builder.js or pages/builder.jsx
import React, { useEffect, useState } from 'react';
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

// Client-side only component
function Builder() {
    const dispatch = useDispatch();
    const router = useRouter();
    // Redux States
    const { formData, profileData, userData, defaultData } = useSelector(state => state.resume);
    const { currentSection, currentSectionIndex, isModalOpen, showDownloadSection, isMobileMenuOpen } = useSelector(state => state.ui);
    const { selectedTemplate, fontStyles } = useSelector(state => state.template);

    // Add state to track if component is mounted (client-side)
    const [isMounted, setIsMounted] = useState(false);

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

    // Set mounted state when component mounts (client-side only)
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Load templateId from URL
    useEffect(() => {
        if (router.isReady && router.query.templateId) {
            const template = router.query.templateId;
            if (template !== selectedTemplate) {
                dispatch(setSelectedTemplate(template));
            }
        }
    }, [router.isReady, router.query.templateId, selectedTemplate, dispatch]);

    // Load user and profile data - only run on client side
    useEffect(() => {
        // Only run if component is mounted (client-side)
        if (isMounted) {
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
    }, [isMounted, router, dispatch]);

    // Update templateName in formData
    useEffect(() => {
        if (formData) {
            dispatch(updateFormField({ field: 'templateName', value: selectedTemplate }));
        }
    }, [selectedTemplate, formData, dispatch]);

    // Don't render anything during SSR
    if (!isMounted) {
        return null;
    }

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
                                    {isCompleted ? (
                                        <Check className="w-5 h-5 text-teal-600" />
                                    ) : (
                                        <Icon className="w-5 h-5" />
                                    )}
                                    <span>{section.title}</span>
                                </button>
                            );
                        })}
                    </div>
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => dispatch(setIsModalOpen(true))}
                            className="flex items-center gap-1.5 py-2 px-4 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                        >
                            <Eye className="w-4 h-4" />
                            <span>Preview</span>
                        </button>
                        <button
                            onClick={() => dispatch(setShowDownloadSection(true))}
                            className="flex items-center gap-1.5 py-2 px-4 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-all"
                        >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            {renderSection()}
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                                <h2 className="text-lg font-medium text-gray-800 mb-4">Template</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {['modern', 'professional', 'creative', 'minimalist'].map((template) => (
                                        <button
                                            key={template}
                                            onClick={() => handleTemplateChange(template)}
                                            className={`p-2 rounded-lg border-2 transition-all ${selectedTemplate === template ? 'border-teal-500' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div className="aspect-[3/4] bg-gray-100 rounded flex items-center justify-center">
                                                <span className="capitalize text-xs font-medium text-gray-600">{template}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {isModalOpen && (
                <ResumeModal
                    onClose={() => dispatch(setIsModalOpen(false))}
                    formData={formData}
                    template={selectedTemplate}
                />
            )}

            {/* Download Section */}
            {showDownloadSection && (
                <DownloadSection
                    onClose={() => dispatch(setShowDownloadSection(false))}
                    formData={formData}
                    template={selectedTemplate}
                />
            )}
        </div>
    );
}

// Use dynamic import with SSR disabled
import dynamic from 'next/dynamic';

const BuilderWithNoSSR = dynamic(() => Promise.resolve(Builder), {
    ssr: false
});

export default BuilderWithNoSSR;