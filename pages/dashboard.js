import { useState, useRef, useEffect } from 'react';
import Builder from '@/components/dashboard-sections/Builder';
import Layout from '@/components/Layout';
import Sidebar from '@/components/dashboard-sections/Sidebar';
import ResumesList from '@/components/dashboard-sections/ResumesList';
import Jobs from '@/components/dashboard-sections/Jobs';
import JobTracker from '@/components/dashboard-sections/JobTracker';
import InterviewPrep from '@/components/dashboard-sections/InterviewPrep';
import SalaryAnalyzer from '@/components/dashboard-sections/SalaryAnalyzer';
import Profile from '@/pages/profile';
import { useRouter } from 'next/router';
import { formatDate } from '@/lib/utils';
import { CheckCircle2, Clock, ExternalLink, FileText, Sparkles, Bell } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import FeedbackBanner, { FeedbackTypes } from '@/components/ui/FeedbackBanner';

export default function Home() {
    const router = useRouter()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showBuilder, setShowBuilder] = useState(false);
    const dropdownRef = useRef(null);
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeProfileId, setActiveProfileId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState(FeedbackTypes.INFO);
    const [showFeedback, setShowFeedback] = useState(false);
    const toast = useToast();

    const fetchProfiles = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) return router.push('/login');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get-resume`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            });

            if (!response.ok) throw new Error('Failed to fetch profiles');

            const data = await response.json();
            console.log(data, "form all")
            if (data && Array.isArray(data.data)) {
                setProfiles(data.data);
                // Set active profile from localStorage if exists
                const storedProfile = JSON.parse(localStorage.getItem('profileData') || '{}');
                if (storedProfile.id) {
                    setActiveProfileId(storedProfile.id);
                }
            }
        } catch (error) {
            console.error('Error fetching profiles:', error);
            setProfiles([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleActiveResume = (profile) => {
        localStorage.setItem('profileData', JSON.stringify(profile));
        if (profile.id) {
            setActiveProfileId(profile.id);
            setActiveTab('Builder');
            // No toast here as it's handled in the ResumesList component
        } else {
            // New resume
            setActiveProfileId(null);
            // Toast is handled in ResumesList component
        }
    };

    const handleDeleteResume = async (resumeId, e) => {
        e.stopPropagation(); // Prevent triggering the card click event

        setIsDeleting(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) return router.push('/login');

            const formData = new FormData();
            formData.append('resume_id', resumeId);

            const response = await fetch('https://admin.hiremeai.in/api/delete-resume', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                body: formData
            });

            if (!response.ok) throw new Error('Failed to delete resume');

            // Refresh the profiles list after successful deletion
            await fetchProfiles();

            // If the deleted resume was active, clear the active profile
            if (activeProfileId === resumeId) {
                localStorage.removeItem('profileData');
                setActiveProfileId(null);
            }

            // Show success message
            toast.success('Resume deleted successfully');

        } catch (error) {
            console.error('Error deleting resume:', error);
            toast.error('Failed to delete resume. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    // Using formatDate from utils.js instead of defining it inline

    const [activeTab, setActiveTab] = useState('Dashboard');

    const handleLogout = () => {
        // Show feedback before logout
        setFeedbackMessage('Logging you out...');
        setFeedbackType(FeedbackTypes.INFO);
        setShowFeedback(true);

        // Short delay for feedback visibility
        setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            localStorage.removeItem('profileData');
            router.push('/login');
        }, 1000);
    };

    // Sidebar is now handled by the Sidebar component


    if (showBuilder) {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                    <div className="flex flex-col md:flex-row">
                        {/* The Sidebar component will be conditionally rendered based on the Redux state */}
                        {/* The right sidebar in Builder will control this visibility */}
                        <Builder onClose={() => setShowBuilder(false)} />
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <div className="flex flex-col md:flex-row">
                    <Sidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setShowBuilder={setShowBuilder}
                        handleLogout={handleLogout}
                    />

                    {/* Main Content - Enhanced with better spacing and visual elements */}
                    <main className="p-4 sm:p-5 md:p-8 pb-24 md:pb-8 flex justify-center md:justify-start flex-1 overflow-x-hidden transition-all duration-300 ease-in-out">
                        {(() => {
                            switch (activeTab) {
                                case 'Dashboard':
                                    return (
                                        <div className="w-full max-w-7xl mx-auto">
                                            <div className="mb-8">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                                                    <div>
                                                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Resumes</h2>
                                                        <p className="text-gray-600">Create, manage and track your professional resumes</p>
                                                    </div>
                                                    <div className="mt-4 sm:mt-0 flex space-x-2">
                                                        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                                                            <Bell size={20} className="text-gray-600" />
                                                        </button>
                                                        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                                                            <Sparkles size={20} className="text-gray-600" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="border-b border-gray-200">
                                                    <div className="flex gap-6">
                                                        <button className="px-4 py-3 text-teal-600 border-b-2 border-teal-600 font-medium flex items-center">
                                                            <FileText className="w-4 h-4 mr-2" />
                                                            Resumes
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {showFeedback && (
                                                <div className="mb-6">
                                                    <FeedbackBanner
                                                        message={feedbackMessage}
                                                        type={feedbackType}
                                                        onClose={() => setShowFeedback(false)}
                                                        autoClose={true}
                                                        duration={5000}
                                                    />
                                                </div>
                                            )}

                                            <ResumesList
                                                activeProfileId={activeProfileId}
                                                handleActiveResume={handleActiveResume}
                                                handleDeleteResume={handleDeleteResume}
                                                setShowBuilder={setShowBuilder}
                                                profiles={profiles}
                                                isLoading={isLoading}
                                                isDeleting={isDeleting}
                                            />
                                        </div>
                                    );
                                case 'Jobs':
                                    return <Jobs />;
                                case 'Job Tracker':
                                    return <JobTracker />;
                                case 'Interview Prep':
                                    return <InterviewPrep />;
                                case 'Salary Analyzer':
                                    return <SalaryAnalyzer />;
                                case 'Profile Settings':
                                    return <Profile />;
                                case 'Builder':
                                    return <Builder onClose={() => setActiveTab('Dashboard')} />;
                                default:
                                    return null;
                            }
                        })()}
                    </main>
                </div>
            </div >
        </Layout >
    );
}


