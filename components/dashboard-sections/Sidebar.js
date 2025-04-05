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

    const navigationItems = [
        { icon: LayoutDashboard, text: 'Dashboard' },
        { icon: Briefcase, text: 'Jobs' },
        { icon: LineChart, text: 'Job Tracker', hidden: true },
        { icon: GraduationCap, text: 'Interview Prep' },
        { icon: FileOutput, text: 'Cover Letters', hidden: true },
        { icon: Settings, text: 'Profile Settings' }
    ].filter(item => !item.hidden);

    const sidebarItems = [
        { id: 'Dashboard', label: 'Dashboard', icon: Home },
        { id: 'Builder', label: 'Resume Builder', icon: FileText },
        { id: 'Jobs', label: 'Jobs', icon: Briefcase },
        { id: 'Job Tracker', label: 'Job Tracker', icon: CheckSquare },
        { id: 'Interview Prep', label: 'Interview Prep', icon: MessageSquare },
        { id: 'Salary Analyzer', label: 'Salary Analyzer', icon: DollarSign },
    ];
    return (
        <aside className={`fixed bottom-0 left-0 right-0 md:relative ${isRightSidebarOpen ? 'md:w-16' : 'md:w-16 lg:w-64'} border-t md:border-t-0 md:border-r md:min-h-[calc(100vh-73px)] bg-white/95 backdrop-blur-sm md:bg-white z-10 md:p-3 ${isRightSidebarOpen ? 'lg:p-3' : 'lg:p-5'} overflow-y-auto max-h-[40vh] md:max-h-none shadow-md rounded-t-xl md:rounded-none md:rounded-r-xl transition-all duration-300`}>

            <nav className="flex justify-center md:justify-start md:flex-col overflow-x-auto md:overflow-x-visible md:space-y-3 px-2 py-3 md:p-0 bg-transparent scrollbar-none">
                {navigationItems.map((item, index) => (
                    <a
                        key={index}
                        href="#"
                        onClick={() => {
                            setActiveTab(item.text);
                            setShowBuilder(false);
                        }}
                        className={`flex-shrink-0 flex flex-col md:flex-row items-center md:justify-center lg:justify-start md:gap-3 px-3 sm:px-4 py-3 rounded-xl ${activeTab === item.text ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium shadow-md' : 'text-gray-600 hover:bg-gray-100'} mx-1 sm:mx-2 md:mx-0 transition-all duration-300 ease-in-out transform hover:scale-[1.02]`}
                    >
                        <item.icon size={24} className={`${activeTab === item.text ? 'text-white' : ''} sm:w-8 sm:h-8 md:w-7 md:h-7 lg:w-8 lg:h-8`} />
                        <span className={`text-xs mt-1 md:hidden ${isRightSidebarOpen ? 'lg:hidden' : 'lg:inline-block'} lg:text-sm lg:mt-0 font-medium`}>{item.text}</span>
                    </a>
                ))}
                <a
                    href="#"
                    onClick={handleLogout}
                    className="flex-shrink-0 flex flex-col md:flex-row items-center md:justify-center lg:justify-start md:gap-3 px-3 sm:px-4 py-3 rounded-xl text-gray-600 hover:bg-red-100 hover:text-red-600 mx-1 sm:mx-2 md:mx-0 mt-auto md:mt-8 transition-all duration-300"
                >
                    <LogOut size={24} className="sm:w-8 sm:h-8 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                    <span className={`text-xs mt-1 md:hidden ${isRightSidebarOpen ? 'lg:hidden' : 'lg:inline-block'} lg:text-sm lg:mt-0 font-medium`}>Logout</span>
                </a>
            </nav>
        </aside>
    );
}