import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from './Navbar';
import LoadingScreen from './LoadingScreen';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [pageTransition, setPageTransition] = useState(false);

    // List of public routes that don't require authentication
    const publicRoutes = [
        '/login',
        '/verify-otp',
        '/complete-profile',
        '/unauthorized'
    ];

    useEffect(() => {
        // Check if the current route is a public route
        const isPublicRoute = publicRoutes.some(route => router.pathname === route);

        // If it's not a public route, check for authentication
        if (!isPublicRoute && typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
            }
        }

        // Short delay to prevent flash of loading state

        setIsLoading(false);



    }, [router.pathname]);

    // Handle route change start
    useEffect(() => {
        const handleStart = () => {
            setPageTransition(true);
        };

        const handleComplete = () => {
            setTimeout(() => setPageTransition(false), 300);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    // Don't render anything while checking authentication
    if ((isLoading || authLoading) && router.pathname !== '/login') {
        return <LoadingScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>HireMeAI - Create Professional Resumes</title>
                <meta name="description" content="Create professional resumes with our easy-to-use builder" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />

            <AnimatePresence mode="wait">
                {pageTransition ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white z-40 flex items-center justify-center"
                    >
                        <LoadingScreen size="container" />
                    </motion.div>
                ) : (
                    <motion.main
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pt-16"
                    >
                        {children}
                    </motion.main>
                )}
            </AnimatePresence>
        </div>
    );
};

export default React.memo(Layout);
