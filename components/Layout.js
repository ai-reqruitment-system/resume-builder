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
    const [isMounted, setIsMounted] = useState(false);

    // List of public routes that don't require authentication
    const publicRoutes = [
        '/login',
        '/verify-otp',
        '/complete-profile',
        '/unauthorized'
    ];

    // Set mounted state when component mounts (client-side only)
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        // Only run if component is mounted (client-side)
        if (!isMounted) return;

        // Check if the current route is a public route
        const isPublicRoute = publicRoutes.some(route => router.pathname === route);

        // If it's not a public route, check for authentication
        if (!isPublicRoute) {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
            }
        }

        // Short delay to prevent flash of loading state
        setIsLoading(false);

    }, [router.pathname, isMounted]);

    // Handle route change start
    useEffect(() => {
        if (!isMounted) return;

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
    }, [router, isMounted]);

    // Don't render anything during SSR or while checking authentication
    if (!isMounted || ((isLoading || authLoading) && router.pathname !== '/login')) {
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
