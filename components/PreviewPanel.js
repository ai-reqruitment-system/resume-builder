import { useState, useRef } from 'react';
import { Maximize2, Palette, Layout } from 'lucide-react';
import ResumeModal from './ResumeModal';
import DownloadSection from './DownloadSection';
import { templates } from '@/lib/constants/templates';
import SidebarControls from "@/components/SidebarControls";
import TemplateSelector from "@/components/TemplateSelector";
// Import Redux hooks
import { useSelector, useDispatch } from 'react-redux';
import { setIsModalOpen } from '@/store/slices/uiSlice';
import { setSelectedTemplate, updateFontStyle } from '@/store/slices/templateSlice';
import { setIsSidebarOpen } from '@/store/slices/uiSlice';

export default function PreviewPanel({ formData }) {
    const dispatch = useDispatch();
    // Get state from Redux store instead of local state
    const { selectedTemplate, fontStyles } = useSelector(state => state.template);
    const { isModalOpen, isSidebarOpen } = useSelector(state => state.ui);
    const [isHovered, setIsHovered] = useState(false);
    // Remove local sidebar state
    // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('styles'); // 'styles' or 'templates'
    const previewRef = useRef(null);

    // Default data for preview
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

    // We no longer need this local state as we're using Redux
    // const [fontStyles, setFontStyles] = useState({
    //     font_family: "sans-serif",
    //     font_color: "#000000",
    //     is_font_bold: false,
    //     is_font_italic: false
    // });

    const Template = templates[selectedTemplate];

    const updateFontStyles = (newStyles) => {
        dispatch(updateFontStyle(newStyles));
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 h-screen max-h-[calc(100vh-6rem)]">
            {/* Mobile Controls */}
            <div className="lg:hidden flex justify-between items-center p-4 bg-white shadow-sm rounded-lg">
                <button
                    onClick={() => dispatch(setIsSidebarOpen(!isSidebarOpen))}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <Palette className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setActiveTab(activeTab === 'styles' ? 'templates' : 'styles')}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <Layout className="w-5 h-5" />
                </button>
            </div>

            {/* Sidebar */}
            <div className={`
                ${isSidebarOpen ? 'block' : 'hidden'} 
                lg:block w-full lg:w-64 bg-white shadow rounded-lg
                fixed lg:relative inset-0 z-30 lg:z-auto
                ${isSidebarOpen ? 'bg-white' : ''}
            `}>
                <div className="h-full overflow-y-auto p-4">
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setActiveTab('styles')}
                            className={`flex-1 p-2 rounded-lg ${activeTab === 'styles' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                                }`}
                        >
                            Styles
                        </button>
                        <button
                            onClick={() => setActiveTab('templates')}
                            className={`flex-1 p-2 rounded-lg ${activeTab === 'templates' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                                }`}
                        >
                            Templates
                        </button>
                    </div>

                    {activeTab === 'styles' ? (
                        <SidebarControls
                            fontStyles={fontStyles}
                            updateFontStyles={updateFontStyles}
                        />
                    ) : (
                        <TemplateSelector
                            selectedTemplate={selectedTemplate}
                            setSelectedTemplate={(template) => dispatch(setSelectedTemplate(template))}
                        />
                    )}
                </div>
            </div>

            {/* Main Preview */}
            <div className="flex-1 bg-white shadow rounded-lg flex flex-col h-full relative">
                {/* Preview Container */}
                <div
                    className="relative flex-1 overflow-hidden"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    ref={previewRef}
                >
                    <div className="h-full overflow-y-auto p-4">
                        <div className="preview-content mx-auto" style={{
                            transform: 'scale(0.8)',
                            transformOrigin: 'top center',
                            maxWidth: '800px',
                            position: 'relative',
                            zIndex: 1 // Ensure content is above overlays
                        }}>
                            {templates[selectedTemplate] && React.createElement(templates[selectedTemplate], {
                                data: formData,
                                fontStyles: fontStyles,
                                isPreview: true,
                                defaultData: defaultData
                            })}
                        </div>
                    </div>

                    {/* Preview Actions */}
                    <div className={`
                        absolute inset-0 
                        flex items-center justify-center 
                        transition-opacity duration-200
                        bg-black/50
                        ${isHovered ? 'opacity-100' : 'opacity-0'}
                        ${isHovered ? '' : 'pointer-events-none'}
                    `}>
                        <button
                            onClick={() => dispatch(setIsModalOpen(true))}
                            className="bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
                        >
                            <Maximize2 className="w-5 h-5" />
                            <span>Full Preview</span>
                        </button>
                    </div>
                </div>

                {/* Download Section */}
                <div className="p-4 border-t">
                    <DownloadSection
                        formData={formData}
                        fontStyles={fontStyles}
                        templateName={selectedTemplate}
                    />
                </div>
            </div>

            {/* Modal */}
            <ResumeModal
                isOpen={isModalOpen}
                onRequestClose={() => dispatch(setIsModalOpen(false))}
                formData={formData}
                fontStyles={fontStyles}
                defaultData={defaultData}
            />

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-20"
                    onClick={() => dispatch(setIsSidebarOpen(false))}
                />
            )}
        </div>
    );
}