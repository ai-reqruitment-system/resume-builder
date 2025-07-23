import {
    LayoutDashboard,
    Briefcase,
    LineChart,
    GraduationCap,
    FileOutput,
    LogOut,
    Home,
    FileText,
    CheckSquare,
    MessageSquare,
    DollarSign,
    Settings
} from 'lucide-react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

export default function Sidebar({ activeTab, setActiveTab, setShowBuilder, handleLogout }) {
    const router = useRouter();
    const { isRightSidebarOpen } = useSelector(state => state.ui);

    const handleInterviewPrep = async () => {
        try {
            const token = localStorage.getItem('token'); // Adjust based on your token storage
            const proxyRes = await fetch('https://interview.resuming.io/api/auth/token', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            if (!proxyRes.ok) {
                router.push("/dasbhoard");
            }

            if (proxyRes.ok) {
                window.location.href = 'https://interview.resuming.io';
            }
        } catch (error) {
            console.error('Interview prep redirect failed:', error);
            router.push("/dashboard");
        }
    };

    const navigationItems = [
        { icon: LayoutDashboard, text: 'Dashboard' },
        { icon: Briefcase, text: 'Jobs',hidden:true },
        { icon: LineChart, text: 'Job Tracker', hidden: true },
        { icon: GraduationCap, text: 'Interview Prep' },
        { icon: FileOutput, text: 'Cover Letters', hidden: true },
        { icon: Settings, text: 'Profile Settings' }
    ].filter(item => !item.hidden);

    const sidebarItems = [
        { id: 'Dashboard', label: 'Dashboard', icon: Home },
        { id: 'Builder', label: 'Resume Builder', icon: FileText },
        { id: 'Jobs', label: 'Jobs', icon: Briefcase ,hidden:true},
        { id: 'Job Tracker', label: 'Job Tracker', icon: CheckSquare },
        { id: 'Interview Prep', label: 'Interview Prep', icon: MessageSquare },
        { id: 'Salary Analyzer', label: 'Salary Analyzer', icon: DollarSign },
    ];
    return (
        <aside className={`fixed bottom-0 left-0 right-0 md:relative ${isRightSidebarOpen ? 'md:w-14' : 'md:w-14 lg:w-56'} border-t md:border-t-0 md:border-r md:min-h-[calc(100vh-73px)] bg-white/95 backdrop-blur-sm md:bg-white z-10 md:p-2 ${isRightSidebarOpen ? 'lg:p-2' : 'lg:p-4'} overflow-y-auto max-h-[40vh] md:max-h-none  rounded-t-xl md:rounded-none md:rounded-r-xl transition-all duration-300`}>

            <nav className="flex justify-center md:justify-start md:flex-col overflow-x-auto md:overflow-x-visible md:space-y-4 px-2 py-2 md:p-0 bg-transparent scrollbar-none">
                {navigationItems.map((item, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => {
                            if (item.text === 'Interview Prep') {
                                handleInterviewPrep();
                            } else {
                                setActiveTab(item.text);
                                setShowBuilder(false);
                            }
                        }}
                        className={`flex-shrink-0 flex flex-col md:flex-row items-center md:justify-center lg:justify-start md:gap-3 px-2 sm:px-3 py-3 rounded-lg ${activeTab === item.text ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-md' : 'text-gray-600 hover:bg-gray-100'} mx-1 sm:mx-2 md:mx-0 mb-1 md:mb-0 transition-all duration-300 ease-in-out transform hover:scale-[1.02]`}
                    >
                        <item.icon size={20} className={`${activeTab === item.text ? 'text-white' : ''} sm:w-6 sm:h-6 md:w-5 md:h-5 lg:w-6 lg:h-6`} />
                        <span className={`text-xs mt-1 md:hidden ${isRightSidebarOpen ? 'lg:hidden' : 'lg:inline-block'} lg:text-sm lg:mt-0 font-medium`}>{item.text}</span>
                    </button>
                ))}
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-shrink-0 flex flex-col md:flex-row items-center md:justify-center lg:justify-start md:gap-3 px-2 sm:px-3 py-3 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-600 mx-1 sm:mx-2 md:mx-0 mt-auto md:mt-10 transition-all duration-300"
                >
                    <LogOut size={20} className="sm:w-6 sm:h-6 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                    <span className={`text-xs mt-1 md:hidden ${isRightSidebarOpen ? 'lg:hidden' : 'lg:inline-block'} lg:text-sm lg:mt-0 font-medium`}>Logout</span>
                </button>
            </nav>
        </aside>
    );
}