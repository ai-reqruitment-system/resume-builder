import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ResumeBuilderLayout from '@/components/ResumeBuilderLayout';
import Layout from '@/components/Layout';
import LoadingScreen from '@/components/LoadingScreen';
import { useLoading } from '@/context/LoadingContext';
import { useToast } from '@/components/ui/ToastProvider';

// Redux imports
import { useSelector, useDispatch } from 'react-redux';
import { setFormData, setProfileData, setUserData } from '@/store/slices/resumeSlice';
import { setCurrentSection, setCurrentSectionIndex } from '@/store/slices/uiSlice';
import { setSelectedTemplate } from '@/store/slices/templateSlice';


const ResumeBuilder = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { withLoading, setComponentLoading } = useLoading();
    const toast = useToast();
    const [initialLoading, setInitialLoading] = useState(true);

    // Get state from Redux store
    const { formData, profileData, userData } = useSelector(state => state.resume);
    const { selectedTemplate } = useSelector(state => state.template);

    useEffect(() => {
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
                toast.error('Failed to load resume builder. Please try again.');
                setInitialLoading(false);
            }
        };

        initializeBuilder();
    }, [router, dispatch, withLoading, setComponentLoading, toast]);

    const handleClose = () => {
        router.push('/dashboard');
    };

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

export default ResumeBuilder;