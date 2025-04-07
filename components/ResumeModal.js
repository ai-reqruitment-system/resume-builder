import React, { useEffect, useState } from 'react';
import { X, Palette, Eye, Download, Layout, Save } from 'lucide-react';
import { templates } from "@/lib/constants/templates";
import TemplateSelector from "@/components/TemplateSelector";
import SidebarControls from "@/components/SidebarControls";
import DownloadSection from "@/components/DownloadSection";
import { useRouter } from "next/router";
// Import Redux hooks
import { useSelector, useDispatch } from 'react-redux';
import { setIsModalOpen } from '@/store/slices/uiSlice';
import { updateResumeList, markResumeListAsUpdated } from '@/store/slices/resumeSlice';

const ResumeModal = ({
    isOpen,
    onRequestClose,
    formData,
    fontStyles: initialFontStyles,
    onTemplateChange,
    selectedTemplate: parentSelectedTemplate,
    defaultData,
    onDownload
}) => {
    const dispatch = useDispatch();
    const [fontStyles, setFontStyles] = useState(initialFontStyles);
    const [mobileView, setMobileView] = useState('preview');
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const router = useRouter();

    // Validate form data - extracted common validation logic
    const validateFormData = (setErrorFn) => {
        if (!formData) {
            setErrorFn("Please fill in the resume details");
            return false;
        }
        if (!formData.first_name) {
            setErrorFn("First name is required");
            return false;
        }
        if (!formData.last_name) {
            setErrorFn("Last name is required");
            return false;
        }
        if (!formData.email) {
            setErrorFn("Email is required");
            return false;
        }
        if (!formData.phone) {
            setErrorFn("Phone number is required");
            return false;
        }
        return true;
    };

    // Use Redux to close the modal
    const handleCloseModal = () => {
        dispatch(setIsModalOpen(false));
        if (onRequestClose) {
            onRequestClose();
        }
    };

    // Save resume function without retry capability
    const handleSaveResume = async () => {
        try {
            setIsSaving(true);
            setSaveError(null);
            setSaveSuccess(false);

            // Validate form data
            if (!validateFormData(setSaveError)) return;

            const resume_id = JSON.parse(localStorage.getItem("profileData"))?.id || "";
            console.log(localStorage.getItem("profileData"), "from the Resume Modal compnent ")

            // Prepare payload with all required fields from the API
            const payload = {
                ...formData,
                ...fontStyles,
                templateName: parentSelectedTemplate,
                template_id: "modern", // Default template ID
                is_font_bold: fontStyles.is_font_bold || "1",
                is_font_italic: fontStyles.is_font_italic || "1",
                font_color: fontStyles.font_color || "red",
                font_family: fontStyles.font_family || "Arial",
                unique_id: formData.unique_id || "1",
                resume_id: resume_id
            };

            // Create FormData object
            const formDataObj = new FormData();

            // Add resume_id if it exists
            if (formData.unique_id) {
                formDataObj.append('resume_id', resume_id);
            }

            // Add all required fields to FormData according to API requirements
            const requiredFields = {
                'template_id': payload.template_id,
                'first_name': payload.first_name,
                'last_name': payload.last_name,
                'email': payload.email,
                'phone': payload.phone,
                'occupation': payload.occupation || "Working Professional",
                'city': payload.city || "Ahmedabad",
                'country': payload.country || "India",
                'pincode': payload.pincode || "380015",
                'dob': payload.dob || "1998-04-25",
                'professional_description': payload.professional_description || "Working as a Software engineer",
                'templateName': payload.templateName || "premium",
                'unique_id': payload.unique_id || "1",
                'resume_id': payload.resume_id || "224",
                'is_font_bold': payload.is_font_bold || "1",
                'is_font_italic': payload.is_font_italic || "1",
                'font_color': payload.font_color || "red",
                'font_family': payload.font_family || "Arial"
            };

            // Append all required fields
            Object.entries(requiredFields).forEach(([key, value]) => {
                formDataObj.append(key, value);
            });

            // Handle array fields
            const arrayFields = ['job_title', 'employer', 'job_begin', 'job_end', 'job_description',
                'college', 'degree', 'college_begin', 'college_end', 'college_description',
                'language', 'skill'];

            arrayFields.forEach(field => {
                if (payload[field] && Array.isArray(payload[field])) {
                    if (payload[field].length === 0) {
                        formDataObj.append(`${field}[]`, "");
                    } else {
                        payload[field].forEach(item => {
                            formDataObj.append(`${field}[]`, item ?? "");
                        });
                    }
                } else if (field === 'skill' && (!payload[field] || !Array.isArray(payload[field]))) {
                    formDataObj.append('skill[]', "");
                }
            });

            // Get the token and validate it
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token is missing. Please log in again.');
            }

            // Send request to save resume
            const response = await fetch('https://admin.hiremeai.in/api/update-resume', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                body: formDataObj,
                signal: AbortSignal.timeout(30000) // 30 seconds timeout
            });

            // Check if the response is OK first
            if (!response.ok) {
                if (response.status === 500) {
                    throw new Error('The server encountered an internal error. Please try again later.');
                }
                throw new Error(`Server responded with status: ${response.status}. Please try again later.`);
            }

            // Parse the response
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned an invalid response format. Please try again later.');
            }

            const data = await response.json();

            // Update the Redux store with the saved resume data
            // This will ensure the dashboard is updated without requiring a refresh
            if (data && data.data) {
                // Update the Redux store with the updated resume
                dispatch(updateResumeList(data.data));
                dispatch(markResumeListAsUpdated());
            }

            // Show success message
            setSaveSuccess(true);
            setIsSaving(false);
            setTimeout(() => setSaveSuccess(false), 3000);

        } catch (error) {
            console.error('Save failed:', error);
            setSaveError(error.message || 'Something went wrong. Please try again later');
        } finally {
            setIsSaving(false);
        }
    };

    // Direct download function
    const handleDirectDownload = async () => {
        try {
            setIsDownloading(true);
            setDownloadError(null);

            // Validate form data
            if (!validateFormData(setDownloadError)) return;

            // Prepare payload
            const payload = {
                ...formData,
                ...fontStyles,
                templateName: parentSelectedTemplate,
            };

            // Send request to generate PDF
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/generate-resume`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(payload)
            });

            // Check if response is JSON (error) or blob (PDF)
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();

                if (!response.ok) {
                    if (errorData.errors) {
                        const firstError = Object.values(errorData.errors)[0][0];
                        throw new Error(firstError);
                    }
                    throw new Error(errorData.message || 'PDF generation failed');
                }
            }

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}. Please try again later.`);
            }

            // Get the blob data
            const blob = await response.blob();
            if (!blob || blob.size === 0) {
                throw new Error('Received empty PDF data from server');
            }

            // Create a meaningful filename
            const filename = `${formData.first_name}_${formData.last_name}_Resume.pdf`;

            // Handle download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
            }, 100);

        } catch (error) {
            console.error('Download failed:', error);
            setDownloadError(error.message || 'Something went wrong. Please try again later');
        } finally {
            setIsDownloading(false);
        }
    };

    if (!isOpen) return null;

    // Use the parent's selectedTemplate prop directly
    const TemplateComponent = templates?.[parentSelectedTemplate] || templates?.modern;
    if (!TemplateComponent) return null;

    const handleTemplateChange = (template) => {
        if (onTemplateChange) {
            onTemplateChange(template);
        }
    };

    const PreviewContent = () => {
        return (
            <div className="h-full flex flex-col bg-gray-50">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-white border-b">
                    <div className="mb-2 sm:mb-0 w-full sm:w-auto">
                        {saveSuccess && (
                            <span className="text-green-500 text-sm">Resume saved successfully!</span>
                        )}
                        {saveError && (
                            <span className="text-red-500 text-sm">{saveError}</span>
                        )}
                        {downloadError && (
                            <span className="text-red-500 text-sm">{downloadError}</span>
                        )}
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto justify-end">
                        <button
                            onClick={handleSaveResume}
                            disabled={isSaving}
                            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors text-xs sm:text-sm ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            <Save className={`w-3 h-3 sm:w-4 sm:h-4 ${isSaving ? 'animate-bounce' : ''}`} />
                            <span>{isSaving ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button
                            onClick={handleDirectDownload}
                            disabled={isDownloading}
                            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors text-xs sm:text-sm ${isDownloading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            <Download className={`w-3 h-3 sm:w-4 sm:h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
                            <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
                        </button>
                        <button
                            onClick={handleCloseModal}
                            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>

                {/* Preview area */}
                <div className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 lg:p-8 flex justify-center items-start">
                    <div className="bg-white shadow-xl rounded-lg w-full max-w-4xl mx-auto">
                        {/* Preview container */}
                        <div className="relative">
                            <div className="transform scale-[0.65] sm:scale-[0.7] md:scale-75 origin-top w-full">
                                <div className="p-4 sm:p-6 md:p-8">
                                    <div className="relative z-10"> {/* Add z-index to ensure content is selectable */}
                                        <TemplateComponent
                                            data={formData}
                                            fontStyles={fontStyles}
                                            isModalView={true}
                                            defaultData={defaultData}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-b from-transparent to-white h-16 sm:h-20 md:h-24 absolute bottom-0 left-0 right-0 pointer-events-none" />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-hidden">
            <div className="h-screen max-w-screen-2xl mx-auto">
                <div className="h-full flex flex-col lg:flex-row">
                    {/* Sidebar */}
                    <div className="hidden lg:flex w-64 xl:w-80 flex-shrink-0 flex-col bg-white border-r">
                        <div className="p-3 xl:p-4 border-b">
                            <div className="flex gap-1 xl:gap-2 p-1 bg-gray-100 rounded-lg">
                                {['styles', 'templates'].map((view) => (
                                    <button
                                        key={view}
                                        onClick={() => setMobileView(view)}
                                        className={`
                                            flex-1 py-1.5 xl:py-2 px-2 xl:px-4 rounded-md font-medium 
                                            transition-all capitalize text-sm xl:text-base
                                            ${mobileView === view
                                                ? 'bg-white text-blue-600 shadow'
                                                : 'text-gray-600 hover:bg-white/50'
                                            }`}
                                    >
                                        {view}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 xl:p-4">
                            {mobileView === 'styles' ? (
                                <SidebarControls
                                    fontStyles={fontStyles}
                                    updateFontStyles={(newStyles) =>
                                        setFontStyles((prev) => ({ ...prev, ...newStyles }))
                                    }
                                />
                            ) : (
                                <TemplateSelector
                                    selectedTemplate={parentSelectedTemplate}
                                    setSelectedTemplate={handleTemplateChange}
                                />
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 bg-white">
                        <PreviewContent />
                    </div>
                </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden">
                {mobileView !== 'preview' && (
                    <div className="fixed inset-0 bg-white z-10">
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                                <h2 className="text-base sm:text-lg font-semibold capitalize">
                                    {mobileView === 'styles'
                                        ? 'Customize Style'
                                        : mobileView === 'templates'
                                            ? 'Choose Template'
                                            : 'Download Resume'}
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                                {mobileView === 'styles' && (
                                    <SidebarControls
                                        fontStyles={fontStyles}
                                        updateFontStyles={(newStyles) =>
                                            setFontStyles((prev) => ({ ...prev, ...newStyles }))
                                        }
                                    />
                                )}
                                {mobileView === 'templates' && (
                                    <TemplateSelector
                                        selectedTemplate={parentSelectedTemplate}
                                        setSelectedTemplate={(template) => {
                                            handleTemplateChange(template);
                                            setMobileView('preview');
                                        }}
                                    />
                                )}
                                {mobileView === 'download' && (
                                    <DownloadSection
                                        formData={formData}
                                        fontStyles={fontStyles}
                                        templateName={parentSelectedTemplate}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Navigation */}
                <nav className="fixed bottom-0 inset-x-0 bg-white border-t pb-safe-area z-10">
                    <div className="w-full max-w-md mx-auto px-2 sm:px-4 py-1 sm:py-2">
                        <div className="grid grid-cols-4 gap-0.5 sm:gap-1 bg-gray-100 p-0.5 sm:p-1 rounded-xl">
                            {[
                                { id: 'preview', icon: Eye, label: 'Preview' },
                                { id: 'styles', icon: Palette, label: 'Style' },
                                { id: 'templates', icon: Layout, label: 'Template' },
                                { id: 'download', icon: Download, label: 'Save' },
                            ].map(({ id, icon: Icon, label }) => (
                                <button
                                    key={id}
                                    onClick={() => setMobileView(id)}
                                    className={`
                                        flex flex-col items-center py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-lg
                                        transition-all
                                        ${mobileView === id
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:bg-white/50'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1 ${mobileView === id ? 'scale-110' : ''}`} />
                                    <span className="text-[10px] sm:text-xs font-medium">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default ResumeModal;