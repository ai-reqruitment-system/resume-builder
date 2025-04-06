import { useEffect } from 'react';
import { useRouter } from 'next/router';
import ResumeBuilderLayout from '@/components/ResumeBuilderLayout';
import Layout from '@/components/Layout';

// Redux imports
import { useSelector, useDispatch } from 'react-redux';
import { setFormData, setProfileData, setUserData } from '@/store/slices/resumeSlice';
import { setCurrentSection, setCurrentSectionIndex } from '@/store/slices/uiSlice';
import { setSelectedTemplate } from '@/store/slices/templateSlice';

const ResumeBuilder = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    // Get state from Redux store
    const { formData, profileData, userData } = useSelector(state => state.resume);
    const { selectedTemplate } = useSelector(state => state.template);

    useEffect(() => {
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
    }, [router, dispatch]);

    const handleClose = () => {
        router.push('/dashboard');
    };

    return (
        <Layout>
            <ResumeBuilderLayout onClose={handleClose} />
        </Layout>
    );
};

export default ResumeBuilder;