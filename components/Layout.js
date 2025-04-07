import Head from 'next/head'
import Navbar from './Navbar'
import Footer from "@/components/Footer";
import { useRouter } from 'next/router';
import { useEffect, useState, memo } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from './LoadingScreen';

const Layout = ({ children }) => {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

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
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, [router.pathname]);

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
            <main className="pt-16">{children}</main>

        </div>
    );
};

// Memoize the Layout component to prevent unnecessary re-renders
export default memo(Layout);