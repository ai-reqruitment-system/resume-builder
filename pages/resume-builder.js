import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ResumeBuilderLayout from '@/components/ResumeBuilderLayout';
import Layout from '@/components/Layout';
import LoadingScreen from '@/components/LoadingScreen';
import { useLoading } from '@/context/LoadingContext';
import SweetAlert from '@/utils/sweetAlert';

// Redux imports
import { useSelector, useDispatch } from 'react-redux';
import { setFormData, setProfileData, setUserData } from '@/store/slices/resumeSlice';
import { setCurrentSection, setCurrentSectionIndex } from '@/store/slices/uiSlice';
import { setSelectedTemplate } from '@/store/slices/templateSlice';


const ResumeBuilder = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { withLoading, setComponentLoading } = useLoading();
    const [initialLoading, setInitialLoading] = useState(true);
    // Add state to track if component is mounted (client-side)
    const [isMounted, setIsMounted] = useState(false);

    // Get state from Redux store
    const { formData, profileData, userData } = useSelector(state => state.resume);
    const { selectedTemplate } = useSelector(state => state.template);

    // Set mounted state when component mounts (client-side only)
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        // Only run if component is mounted (client-side)
        if (!isMounted) return;

        const initializeBuilder = async () => {
            try {
                // Check for authentication
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                // Load user data and profile data
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');

                dispatch(setUserData(userData));
                dispatch(setProfileData(profileData));

                // Set initial section
                dispatch(setCurrentSection('header'));
                dispatch(setCurrentSectionIndex(0));

                // Set template from query params if available
                if (router.isReady && router.query.templateId) {
                    const template = router.query.templateId;
                    dispatch(setSelectedTemplate(template));
                }

                setInitialLoading(false);
            } catch (error) {
                console.error('Error initializing resume builder:', error);
                SweetAlert.error('Error', 'Failed to load resume builder. Please try again.');
                setInitialLoading(false);
            }
        };

        initializeBuilder();
    }, [router, dispatch, withLoading, setComponentLoading, isMounted]);

    const handleClose = () => {
        router.push('/dashboard');
    };

    // Don't render anything during SSR
    if (!isMounted) {
        return null;
    }

    return (
        <Layout>
            {initialLoading ? (
                <LoadingScreen message="Setting up your resume builder..." />
            ) : (
                <ResumeBuilderLayout onClose={handleClose} />
            )}
        </Layout>
    );
};

// Use dynamic import with SSR disabled
import dynamic from 'next/dynamic';

const ResumeBuilderWithNoSSR = dynamic(() => Promise.resolve(ResumeBuilder), {
    ssr: false
});

export default ResumeBuilderWithNoSSR;