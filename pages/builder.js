<<<<<<< HEAD
import React, { useEffect } from 'react';
=======
import React, { useEffect, useState } from 'react';
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
import { Briefcase, Check, Eye, Download, GraduationCap, Plus, Trophy, UserCircle2, X, Menu } from 'lucide-react';
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
<<<<<<< HEAD
// Redux imports
import { useSelector, useDispatch } from 'react-redux';
import { setFormData, updateFormField, setProfileData, setUserData } from '@/store/slices/resumeSlice';
import { setCurrentSection, setCurrentSectionIndex, setIsModalOpen, setShowDownloadSection, setIsMobileMenuOpen, toggleMobileMenu } from '@/store/slices/uiSlice';
import { setSelectedTemplate, setFontStyles, updateFontStyle } from '@/store/slices/templateSlice';
// UI components
=======
// First, add this import at the top with other imports
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
export default function Builder() {
<<<<<<< HEAD
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
=======
    const [currentSection, setCurrentSection] = useState('personal');
    const [profileData, setProfileData] = useState({});
    const [userData, setUserData] = useState({});
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDownloadSection, setShowDownloadSection] = useState(false);
    const [formData, setFormData] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [fontStyles, setFontStyles] = useState({
        font_family: "sans-serif",
        font_color: "#000000",
        is_font_bold: false,
        is_font_italic: false
    });
    const [selectedTemplate, setSelectedTemplate] = useState(formData?.templateName || 'modern');
    const router = useRouter();
    const handleTemplateChange = (template) => {
        setSelectedTemplate(template);
        setFormData(prev => ({
            ...prev,
            templateName: template
        }));
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
    };
    useEffect(() => {
        // This will run when the component mounts and when the router query changes
        if (router.isReady && router.query.templateId) {
            const template = router.query.templateId;
            if (template !== selectedTemplate) {
<<<<<<< HEAD
                dispatch(setSelectedTemplate(template));
            }
        }
    }, [router.isReady, router.query, selectedTemplate, dispatch]); // Don't include formData here

    // defaultData is now coming from the Redux store
=======
                setSelectedTemplate(template);
            }
        }
    }, [router.isReady, router.query, selectedTemplate]); // Don't include formData here

    const defaultData = {
        first_name: "John",
        last_name: "Doe",
        occupation: "Software Engineer",
        email: "john.doe@example.com",
        phone: "+1 234 567 890",
        city: "New York",
        country: "USA",
        professional_description: "<p>Experienced software engineer with a passion for building scalable and efficient web applications. Proficient in JavaScript, React, and Node.js.</p>",
        job_title: ["Senior Software Engineer", "Software Engineer"],
        employer: ["Tech Corp", "Innovate Inc"],
        job_begin: ["2018", "2015"],
        job_end: ["Present", "2018"],
        job_description: [
            "<p>Led a team of developers to build a scalable e-commerce platform.</p>",
            "<p>Developed and maintained web applications using React and Node.js.</p>"
        ],
        college: ["University of Tech", "State College"],
        degree: ["Bachelor of Science in Computer Science", "Associate Degree in IT"],
        college_begin: ["2011", "2009"],
        college_end: ["2015", "2011"],
        college_description: [
            "<p>Graduated with honors, focusing on software development and algorithms.</p>",
            "<p>Completed foundational courses in programming and systems design.</p>"
        ],
        internship_title: ["Software Development Intern"],
        internship_summary: [
            "<p>Assisted in the development of a mobile application using Flutter.</p>"
        ],
        certificate_title: ["Certified JavaScript Developer"],
        certificate_description: [
            "<p>Completed advanced JavaScript courses and passed the certification exam.</p>"
        ],
        other_title: ["Volunteer Work"],
        other_description: [
            "<p>Volunteered as a mentor for coding bootcamps, helping students learn programming basics.</p>"
        ],
        skill: ["JavaScript", "React", "Node.js", "Python", "SQL"],
        language: ["English", "Spanish"]
    };
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        const userData = JSON.parse(localStorage.getItem('profileData') || '{}');
        const loginUserData = JSON.parse(localStorage.getItem('userData') || '{}');
<<<<<<< HEAD
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
=======
        setUserData(loginUserData);
        setProfileData(userData);
    }, [router]);

    useEffect(() => {
        if (formData) {
            setFormData(prev => ({
                ...prev,
                templateName: selectedTemplate
            }));
        }
    }, [selectedTemplate]);

    useEffect(() => {
        if (profileData) {
            const jsonData = {
                template_id: 1,
                unique_id: uuid(),
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                occupation: '',
                city: '',
                country: '',
                pincode: '',
                dob: '',
                professional_description: '',
                professional_summary: '',
                job_title: [],
                employer: [],
                job_begin: [],
                job_end: [],
                job_description: [],
                college: [],
                degree: [],
                college_begin: [],
                college_end: [],
                college_description: [],
                language: [],
                skill: [],
                templateName: 'modern',
                internship_title: [],
                internship_summary: [],
                certificate_title: [],
                certificate_description: [],
                other_title: [],
                other_description: [],
            };

            const mappedData = {
                ...jsonData,
                first_name: profileData.first_name || '',
                last_name: profileData.last_name || '',
                email: profileData.email || '',
                phone: profileData.phone || '',
                occupation: profileData.occupation || '',
                city: profileData.city || '',
                country: profileData.country || '',
                pincode: profileData.pincode || '',
                dob: profileData.dob || '',
                professional_description: profileData.professional_description || '',
            };

            if (profileData.job && profileData.job.length > 0) {
                mappedData.job_title = profileData.job.map(job => job.job_title);
                mappedData.employer = profileData.job.map(job => job.employer);
                mappedData.job_begin = profileData.job.map(job => job.begin);
                mappedData.job_end = profileData.job.map(job => job.end);
                mappedData.job_description = profileData.job.map(job => job.description);
            }

            if (profileData.education && profileData.education.length > 0) {
                mappedData.college = profileData.education.map(edu => edu.college);
                mappedData.degree = profileData.education.map(edu => edu.degree);
                mappedData.college_begin = profileData.education.map(edu => edu.begin);
                mappedData.college_end = profileData.education.map(edu => edu.end);
                mappedData.college_description = profileData.education.map(edu => edu.description || null);
            }

            if (profileData.languages && profileData.languages.length > 0) {
                mappedData.language = [...new Set(profileData.languages.map(lang => lang.language))];
            }
            if (profileData.skills && profileData.skills.length > 0) {
                mappedData.skill = profileData.skills.map(skill => skill.skill);
            }
            setFormData(mappedData);
        }
    }, [profileData]);
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935

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
<<<<<<< HEAD
                return <PersonalInfo formData={formData} updateFormData={updateFormDataHandler} />;
            case 'experience':
                return <Experience formData={formData} updateFormData={updateFormDataHandler} />;
            case 'education':
                return <Education formData={formData} updateFormData={updateFormDataHandler} />;
            case 'skills':
                return <Skills formData={formData} updateFormData={updateFormDataHandler} />;
            case 'others':
                return <Others formData={formData} updateFormData={updateFormDataHandler} />;
=======
                return <PersonalInfo formData={formData} updateFormData={updateFormData} />;
            case 'experience':
                return <Experience formData={formData} updateFormData={updateFormData} />;
            case 'education':
                return <Education formData={formData} updateFormData={updateFormData} />;
            case 'skills':
                return <Skills formData={formData} updateFormData={updateFormData} />;
            case 'others':
                return <Others formData={formData} updateFormData={updateFormData} />;
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
            default:
                return null;
        }
    };
<<<<<<< HEAD

    // Handler function that dispatches the updateFormField action
    const updateFormDataHandler = (field, value) => {
        dispatch(updateFormField({ field, value }));
=======
    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
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
<<<<<<< HEAD
                            onClick={() => dispatch(toggleMobileMenu())}
=======
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
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
<<<<<<< HEAD
                                            dispatch(setCurrentSection(section.id));
                                            dispatch(setCurrentSectionIndex(index));
                                            dispatch(setIsMobileMenuOpen(false));
=======
                                            setCurrentSection(section.id);
                                            setCurrentSectionIndex(index);
                                            setIsMobileMenuOpen(false);
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
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
<<<<<<< HEAD
                                    dispatch(setIsModalOpen(true));
                                    dispatch(setIsMobileMenuOpen(false));
=======
                                    setIsModalOpen(true);
                                    setIsMobileMenuOpen(false);
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
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
<<<<<<< HEAD
                            onClick={() => dispatch(setIsModalOpen(true))}
=======
                            onClick={() => setIsModalOpen(true)}
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
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
<<<<<<< HEAD
                                onClick={() => dispatch(setShowDownloadSection(false))}
=======
                                onClick={() => setShowDownloadSection(false)}
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
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
<<<<<<< HEAD
                onRequestClose={() => dispatch(setIsModalOpen(false))}
=======
                onRequestClose={() => setIsModalOpen(false)}
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
                formData={formData}
                fontStyles={fontStyles}
                defaultData={defaultData}
                onTemplateChange={handleTemplateChange}
                selectedTemplate={selectedTemplate}
                onDownload={() => {
                    // This prop is no longer needed as we've added a direct download button in the modal
                    // but we'll keep it for backward compatibility
<<<<<<< HEAD
                    dispatch(setIsModalOpen(false));
                    dispatch(setShowDownloadSection(true));
=======
                    setIsModalOpen(false);
                    setShowDownloadSection(true);
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
                }}
            />
        </div>

    );
}