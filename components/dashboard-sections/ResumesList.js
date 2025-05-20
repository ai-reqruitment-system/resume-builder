import { Clock, CheckCircle2, ExternalLink, Trash2, Plus, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { useToast } from '@/components/ui/ToastProvider';
import FeedbackBanner, { FeedbackTypes } from '@/components/ui/FeedbackBanner';
import { useRouter } from 'next/router';
import SweetAlert from '@/utils/sweetAlert';


export default function ResumesList({ profiles, isLoading, activeProfileId, handleActiveResume, handleDeleteResume, isDeleting, setShowBuilder }) {
    // Removed deleteConfirmId state as we'll use SweetAlert2 instead
    const [hoveredCard, setHoveredCard] = useState(null);
    const toast = useToast();
    const router = useRouter();
    console.log(Object(profiles), "from teh Resume List")
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto px-2 sm:px-0">
            {/* New Resume Card - Enhanced with better visuals */}
            <div
                onClick={() => {
                    // Reset form data to initial empty state when creating new resume
                    handleActiveResume({
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
                        internship_title: [],
                        internship_summary: [],
                        certificate_title: [],
                        certificate_description: [],
                        other_title: [],
                        other_description: [],
                    });
                    router.push('/resume-builder');
                    // Using SweetAlert2 instead of toast for consistency
                    SweetAlert.toast('Creating new resume', 'success');
                }}
                onMouseEnter={() => setHoveredCard('new')}
                onMouseLeave={() => setHoveredCard(null)}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-5 md:space-y-6 transition-all duration-300 hover:border-blue-400 hover:bg-gradient-to-br from-blue-50/30 to-blue-50/20 group cursor-pointer h-[350px] sm:h-[400px] md:h-[450px] relative overflow-hidden shadow-sm hover:shadow-md"
            >
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative shadow-md">
                    <Plus className="w-10 h-10 text-white" />
                    {hoveredCard === 'new' && (
                        <div className="absolute w-full h-full rounded-full animate-ping bg-blue-200 opacity-30"></div>
                    )}
                </div>
                <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">New Resume</h3>
                    <p className="text-gray-600 max-w-sm text-sm leading-relaxed">
                        Create a tailored resume for each job application. Double your chances of getting hired!
                    </p>
                </div>
                <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg group-hover:scale-105 transform">
                    Create New Resume
                </button>

                {/* Enhanced decorative elements */}
                <div className="absolute top-10 right-10 w-40 h-40 bg-blue-100 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-3xl"></div>
                <div className={`absolute inset-0 bg-gradient-to-br from-blue-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
            </div>

            {isLoading ? (
                <div className="col-span-full flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-300"></div>
                </div>
            ) : (
                profiles.map((profile) => (
                    <div
                        key={profile.id}
                        onClick={() => {
                            handleActiveResume(profile);
                            router.push('/resume-builder');
                            // Removed toast notification as it will be handled in the resume builder
                            SweetAlert.toast(`"${profile.first_name} ${profile.last_name}" resume activated`, 'success');
                        }}
                        onMouseEnter={() => setHoveredCard(profile.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        className={`bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-[350px] sm:h-[400px] md:h-[450px] relative group ${activeProfileId === profile.id ? 'ring-2 ring-blue-400 shadow-lg' : ''}`}
                    >
                        <div className="relative w-full h-36 sm:h-44 bg-gradient-to-r from-blue-500 to-blue-600 flex justify-center items-center overflow-hidden transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-700">
                            <h1 className='text-3xl font-bold text-white capitalize transition-all duration-300 transform group-hover:scale-105'>{profile.first_name}</h1>

                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                            {/* Active indicator */}
                            {activeProfileId === profile.id && (
                                <div className="absolute top-4 right-4 bg-white rounded-full p-1.5 shadow-md">
                                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                </div>
                            )}

                            {/* Hover effect */}
                            {hoveredCard === profile.id && (
                                <div className="absolute inset-0 bg-black opacity-10"></div>
                            )}
                        </div>
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    {activeProfileId === profile.id ? (
                                        <div className="flex items-center">
                                            <span className="text-xs font-medium text-blue-800 px-3 py-1 bg-blue-100 rounded-full border border-blue-200 shadow-sm">
                                                Active Resume
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-medium text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
                                            Resume
                                        </span>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800">{`${profile.first_name} ${profile.last_name}`}</h3>
                            <p className="mt-2 text-sm text-gray-600 font-medium">{profile.occupation || 'Untitled'}</p>

                            <div className="mt-4 flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>Updated {formatDate(profile.updated_at)}</span>
                            </div>

                            <div className="mt-8 flex items-center justify-between">
                                <button
                                    onClick={async () => {
                                        // First set the form data and handle active resume
                                        await handleActiveResume(profile);
                                        // Then navigate to resume builder
                                        router.push('/resume-builder');
                                    }}
                                    className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:translate-y-[-1px] group"
                                >
                                    Edit Resume
                                    <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                </button>

                                <button
                                    onClick={async (e) => {
                                        e.stopPropagation();



                                        handleDeleteResume(profile.id, e);
                                    }}
                                    disabled={isDeleting}
                                    className="inline-flex items-center p-2.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 relative z-10 shadow-sm"
                                    title="Delete Resume"
                                >
                                    {isDeleting ? (
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-700"></div>
                                    ) : (
                                        <Trash2 className="h-5 w-5 transition-colors" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}