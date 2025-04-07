import { useState } from 'react';
import Layout from "@/components/Layout";
import { ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import PersonalInfoEnhanced from "@/components/sections/PersonalInfoEnhanced";
import EducationEnhanced from "@/components/sections/EducationEnhanced";
import ExperienceEnhanced from "@/components/sections/ExperienceEnhanced";
import SkillsEnhanced from "@/components/sections/SkillsEnhanced";
import InternshipTabEnhanced from "@/components/InternshipTabEnhanced";
import OtherTabEnhanced from "@/components/OtherTabEnhanced";

const EnhancedUIDemo = () => {
    const [formData, setFormData] = useState({
        // Personal Info
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        city: '',
        country: '',
        professional_summary: '',
        professional_description: '',

        // Education
        college: [''],
        degree: [''],
        college_begin: [''],
        college_end: [''],
        college_description: [''],

        // Experience
        job_title: [''],
        employer: [''],
        job_begin: [''],
        job_end: [''],
        job_description: [''],

        // Skills
        skill: [],
        language: [],
        skill_description: '',

        // Internship
        internship_title: [''],
        internship_summary: [''],

        // Other
        other_title: [''],
        other_description: ['']
    });

    const [activeSection, setActiveSection] = useState('personal');
    const [step, setStep] = useState(1);
    const [activeIndex, setActiveIndex] = useState(0);

    const updateFormData = (key, value) => {
        setFormData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleNext = () => {
        if (step === 1) {
            setStep(2);
        } else {
            // Move to next section
            const sections = ['personal', 'education', 'experience', 'skills', 'internship', 'other'];
            const currentIndex = sections.indexOf(activeSection);
            if (currentIndex < sections.length - 1) {
                setActiveSection(sections[currentIndex + 1]);
                setStep(1);
            }
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        } else {
            // Move to previous section
            const sections = ['personal', 'education', 'experience', 'skills', 'internship', 'other'];
            const currentIndex = sections.indexOf(activeSection);
            if (currentIndex > 0) {
                setActiveSection(sections[currentIndex - 1]);
                setStep(2);
            }
        }
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'personal':
                return <PersonalInfoEnhanced formData={formData} updateFormData={updateFormData} step={step} />;
            case 'education':
                return <EducationEnhanced formData={formData} updateFormData={updateFormData} step={step} />;
            case 'experience':
                return <ExperienceEnhanced formData={formData} updateFormData={updateFormData} step={step} />;
            case 'skills':
                return <SkillsEnhanced formData={formData} updateFormData={updateFormData} step={step} />;
            case 'internship':
                return <InternshipTabEnhanced
                    formData={formData}
                    updateFormData={updateFormData}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    step={step}
                />;
            case 'other':
                return <OtherTabEnhanced
                    formData={formData}
                    updateFormData={updateFormData}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    step={step}
                />;
            default:
                return null;
        }
    };

    return (
        <Layout>
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header with breadcrumb */}
                <div className="bg-teal-600 px-6 py-5 text-white rounded-t-2xl mb-6">
                    <div className="flex items-center text-sm text-teal-100 mb-2">
                        <span>Dashboard</span>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span>Enhanced UI Demo</span>
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Enhanced UI Demo</h1>
                        <p className="text-teal-100">Two-step form with enhanced description editor</p>
                    </div>
                </div>

                {/* Section Tabs */}
                <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
                    {[
                        { id: 'personal', label: 'Personal Info' },
                        { id: 'education', label: 'Education' },
                        { id: 'experience', label: 'Experience' },
                        { id: 'skills', label: 'Skills' },
                        { id: 'internship', label: 'Internship' },
                        { id: 'other', label: 'Other' }
                    ].map((section) => (
                        <button
                            key={section.id}
                            onClick={() => {
                                setActiveSection(section.id);
                                setStep(1);
                            }}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeSection === section.id
                                ? 'bg-teal-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {section.label}
                        </button>
                    ))}
                </div>

                {/* Step Indicator */}
                <div className="flex items-center mb-6">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                        1
                    </div>
                    <div className="h-1 w-12 bg-gray-200 mx-2"></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                        2
                    </div>
                    <div className="ml-4 text-sm text-gray-600">
                        {step === 1 ? 'Basic Information' : 'Enhanced Description Editor'}
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    {renderSection()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    <button
                        onClick={handleNext}
                        className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600
                        transition-all duration-300 flex items-center gap-2"
                    >
                        {step === 1 ? 'Next: Description Editor' : 'Next Section'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default EnhancedUIDemo;