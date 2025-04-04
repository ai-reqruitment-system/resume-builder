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

export default function Sidebar({ activeTab, setActiveTab, setShowBuilder, handleLogout }) {
    const router = useRouter();

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
        <aside className="fixed bottom-0 left-0 right-0 md:relative md:w-16 lg:w-64 border-t md:border-t-0 md:border-r md:min-h-[calc(100vh-73px)] bg-background/95 backdrop-blur-sm bg-gray-50/90 md:bg-background z-10 md:p-2 lg:p-4 overflow-y-auto max-h-[40vh] md:max-h-none shadow-sm">
            <nav className="flex justify-center md:justify-start md:flex-col overflow-x-auto md:overflow-x-visible md:space-y-2 px-2 py-3 md:p-0 bg-transparent scrollbar-none">
                {navigationItems.map((item, index) => (
                    <a
                        key={index}
                        href="#"
                        onClick={() => {
                            setActiveTab(item.text);
                            setShowBuilder(false);
                        }}
                        className={`flex-shrink-0 flex flex-col md:flex-row items-center md:justify-center lg:justify-start md:gap-3 px-3 sm:px-4 py-2 rounded-lg ${activeTab === item.text ? 'bg-teal-100 text-gray-600' : 'text-gray-600 hover:bg-gray-100'} mx-1 sm:mx-2 md:mx-0`}
                    >
                        <item.icon size={20} />
                        <span className="text-xs mt-1 md:hidden lg:inline-block lg:text-base lg:mt-0">{item.text}</span>
                    </a>
                ))}
                <a
                    href="#"
                    onClick={handleLogout}
                    className="flex-shrink-0 flex flex-col md:flex-row items-center md:justify-center lg:justify-start md:gap-3 px-3 sm:px-4 py-2 rounded-lg text-gray-600 hover:bg-red-100 mx-1 sm:mx-2 md:mx-0 mt-auto md:mt-4"
                >
                    <LogOut size={20} />
                    <span className="text-xs mt-1 md:hidden lg:inline-block lg:text-base lg:mt-0">Logout</span>
                </a>


            </nav>
        </aside>
    );
}