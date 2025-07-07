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
// Import Redux hooks and actions
import { useSelector, useDispatch } from 'react-redux';
import { fetchResumes, setUserData } from '@/store/slices/resumeSlice';


export default function Home() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showBuilder, setShowBuilder] = useState(false);
    const dropdownRef = useRef(null);

    // Get user data and resume list from Redux
    const userData = useSelector(state => state.resume.userData);
    const resumeList = useSelector(state => state.resume.resumeList);
    const isLoadingList = useSelector(state => state.resume.isLoadingList);

    useEffect(() => {
        // Fetch resumes using Redux action
        dispatch(fetchResumes()).catch(error => {
            console.error('Error fetching resumes:', error);
            // If token is missing or invalid, redirect to login
            if (error.message === 'Authentication token is missing') {
                router.push('/login');
            }
        });

        // Get user data from localStorage and store in Redux
        const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (Object.keys(storedUserData).length > 0) {
            // Store in Redux for other components to use
            dispatch(setUserData(storedUserData));
        }
    }, [dispatch, router]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        router.push("/logout_api");
    };

    // We no longer need this block as we're using the new resume-builder page
    // The showBuilder state is kept for backward compatibility
    if (showBuilder) {
        router.push('/resume-builder');
        return null;
    }

    const [activeTab, setActiveTab] = useState('Dashboard');

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

                                            <ResumesList />
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
