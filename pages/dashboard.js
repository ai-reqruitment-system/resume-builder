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
import { CheckCircle2, Clock, ExternalLink } from 'lucide-react';
export default function Home() {
    const router = useRouter()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showBuilder, setShowBuilder] = useState(false);
    const dropdownRef = useRef(null);
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeProfileId, setActiveProfileId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

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
        setActiveProfileId(profile.id);
        setActiveTab('Builder');
    };

    const handleDeleteResume = async (resumeId, e) => {
        e.stopPropagation(); // Prevent triggering the card click event

        if (window.confirm('Are you sure you want to delete this resume?')) {
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
            } catch (error) {
                console.error('Error deleting resume:', error);
                alert('Failed to delete resume. Please try again.');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    // Using formatDate from utils.js instead of defining it inline

    const [activeTab, setActiveTab] = useState('Dashboard');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('profileData');
        router.push('/login');
    };

    // Sidebar is now handled by the Sidebar component


    // We no longer need this block as we're using the new resume-builder page
    // The showBuilder state is kept for backward compatibility
    if (showBuilder) {
        router.push('/resume-builder');
        return null;
    }

    return (
        <Layout>
            <div className="min-h-screen bg-background">
                <div className="flex flex-col md:flex-row">
                    <Sidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setShowBuilder={setShowBuilder}
                        handleLogout={handleLogout}
                    />

                    {/* Main Content - adjust padding for mobile */}
                    <main className="p-3 sm:p-4 md:p-6 pb-24 md:pb-6 flex justify-center md:justify-start flex-1 overflow-x-hidden">
                        {(() => {
                            switch (activeTab) {
                                case 'Dashboard':
                                    return (
                                        <div>
                                            <div className="mb-6">
                                                <h2 className="text-2xl font-semibold mb-4">Resumes</h2>
                                                <div className="border-b">
                                                    <div className="flex gap-6">
                                                        <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600">Resumes</button>
                                                    </div>
                                                </div>
                                            </div>

                                            <ResumesList
                                                activeProfileId={activeProfileId}
                                                handleActiveResume={handleActiveResume}
                                                handleDeleteResume={handleDeleteResume}
                                                setShowBuilder={setShowBuilder}
                                                profiles={profiles}
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


