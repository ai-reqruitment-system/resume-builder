import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import ProfileCompletionIndicator from './ProfileCompletionIndicator';

import {
    Menu,
    X,
    UserCircle2,
    CheckCircle2,
    ExternalLink
} from 'lucide-react';

const Navbar = () => {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    // isOpen state no longer needed as we removed the mobile menu
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [userName, setUserName] = useState('');
    const [activeProfileId, setActiveProfileId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);





    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            console.log("user data from the user ", userData)
            setIsAuthenticated(!!token);
            setUserName(userData.name || userData.first_name || 'User');
            setUserData(userData);

            // Get active profile ID from localStorage if present
            const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
            if (profileData.id) {
                setActiveProfileId(profileData.id);
            }
        };

        checkAuth();

        // Also check for profile ID in URL query params
        const { userProfileId } = router.query;
        if (userProfileId) {
            setActiveProfileId(parseInt(userProfileId));
        }

        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, [router.query, isAuthenticated]);





    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            setIsScrolled(currentScrollPos > 10);
            setVisible(
                (prevScrollPos > currentScrollPos) ||
                currentScrollPos < 10
            );
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

    // closeAllMenus function removed as we no longer have a mobile menu
    // Simplified auth content rendering
    const renderAuthContent = () => {
        if (!isAuthenticated) return null;

        return (
            <div className="relative">
                <div className="flex items-center space-x-2 p-2 rounded-full">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <UserCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{userName}</span>
                </div>
            </div>
        );
    };

    // Mobile auth content removed as we're showing the same content on all screen sizes

    return (
        <nav className={`
            fixed top-0 w-full z-50
            transition-all duration-300 ease-in-out
            ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-transparent'}
            ${visible ? 'transform-none' : '-translate-y-full'}
        `}>
            <div className="  mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <div className="flex items-center text-3xl font-bold">
                        <Link href="/dashboard" className="flex items-center space-x-2 group">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform group-hover:scale-105">
                                <Image src="/ResuLogo.png" width={150} height={100} />
                            </span>
                        </Link>
                    </div>

                    {/* Navigation for all screen sizes */}
                    <div className="flex items-center space-x-8">
                        {/* Render auth content based on authentication status */}
                        {renderAuthContent()}
                    </div>
                    
                    {/* Profile Completion Indicator */}
                    {isAuthenticated && userData && (
                        <div className="absolute top-16 right-4 w-72 z-40">
                            <ProfileCompletionIndicator userData={userData} />
                        </div>
                    )}
                </div>

                {/* No mobile menu needed anymore as we show username directly */}
            </div>
        </nav>
    );
};

export default Navbar;