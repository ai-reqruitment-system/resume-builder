import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import Image from 'next/image';

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
<<<<<<< HEAD
    // isOpen state no longer needed as we removed the mobile menu
=======
    const [isOpen, setIsOpen] = useState(false);
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [userName, setUserName] = useState('');
    const [activeProfileId, setActiveProfileId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);





    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            setIsAuthenticated(!!token);
            setUserName(userData.name || 'User');

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
<<<<<<< HEAD
                currentScrollPos < 10
=======
                currentScrollPos < 10 ||
                isOpen
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
            );
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
<<<<<<< HEAD
    }, [prevScrollPos]);

    // closeAllMenus function removed as we no longer have a mobile menu
=======
    }, [prevScrollPos, isOpen]);

    const closeAllMenus = () => {
        setIsOpen(false);
    };
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
    // Simplified auth content rendering
    const renderAuthContent = () => {
        if (!isAuthenticated) return null;

        return (
            <div className="relative">
                <div className="flex items-center space-x-2 p-2 rounded-full">
<<<<<<< HEAD
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
=======
                    <div className="h-8 w-8 rounded-full bg-[#0cc39b] flex items-center justify-center">
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
                        <UserCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{userName}</span>
                </div>
            </div>
        );
    };

<<<<<<< HEAD
    // Mobile auth content removed as we're showing the same content on all screen sizes
=======
    // Simplified mobile auth content
    const renderMobileAuthContent = () => {
        if (!isAuthenticated) return null;

        return (
            <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3">
                    <div className="h-10 w-10 rounded-full text-[#0f9b7c] flex items-center justify-center">
                        <UserCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">{userName}</div>
                    </div>
                </div>
            </div>
        );
    };
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935

    return (
        <nav className={`
            fixed top-0 w-full z-50
            transition-all duration-300 ease-in-out
            ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-transparent'}
            ${visible ? 'transform-none' : '-translate-y-full'}
<<<<<<< HEAD
=======
            ${isOpen ? 'bg-white shadow-md' : ''}
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
        `}>
            <div className="  mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <div className="flex items-center text-3xl font-bold">
                        <Link href="/dashboard" className="flex items-center space-x-2 group">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform group-hover:scale-105">
<<<<<<< HEAD
                                <Image src="/ResuLogo.png" width={150} height={100} />
=======
                                <Image src="/logoHireme1.png" width={150} height={100} />
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
                            </span>
                        </Link>
                    </div>

<<<<<<< HEAD
                    {/* Navigation for all screen sizes */}
                    <div className="flex items-center space-x-8">
                        {/* Render auth content based on authentication status */}
                        {renderAuthContent()}
                    </div>
                </div>

                {/* No mobile menu needed anymore as we show username directly */}
=======
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">


                        {/* Render auth content based on authentication status */}
                        {renderAuthContent()}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 rounded-lg transition-colors duration-200
                                ${isScrolled || isOpen ? 'text-gray-600' : 'text-gray-700'}
                                hover:bg-gray-100 hover:text-gray-900`}
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <X className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`
                    md:hidden transition-all duration-300 ease-in-out
                    ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
                    overflow-hidden
                `}>
                    <div className="px-2 pt-2 pb-3 space-y-1">


                        {/* Render mobile auth content based on authentication status */}
                        {renderMobileAuthContent()}


                    </div>
                </div>
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
            </div>
        </nav>
    );
};

export default Navbar;