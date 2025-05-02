import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UserCircle2, AlertCircle, CheckCircle } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useDispatch } from 'react-redux';
import { setActiveTab } from '@/store/slices/uiSlice';

const ProfileCompletionIndicator = ({ userData, onTabChange }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const isMobile = useMediaQuery('(max-width: 640px)');
    const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');

    // Check localStorage on component mount to see if user has dismissed the indicator before
    useEffect(() => {
        const isDismissed = localStorage.getItem('profileIndicatorDismissed');
        if (isDismissed === 'true') {
            setIsVisible(false);
        }
    }, []);

    // Define required fields for a complete profile
    const requiredFields = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'location',
        'bio',
        'profile_photo_url'
    ];

    // Calculate completion percentage and missing fields
    const calculateCompletion = () => {
        if (!userData) return { percentage: 0, missingFields: requiredFields };

        let completedFields = 0;
        const missing = [];

        requiredFields.forEach(field => {
            if (userData[field] && userData[field] !== '') {
                completedFields++;
            } else {
                missing.push(field);
            }
        });

        return {
            percentage: Math.round((completedFields / requiredFields.length) * 100),
            missingFields: missing
        };
    };

    const { percentage: completionPercentage, missingFields } = calculateCompletion();

    // Determine color based on completion percentage
    const getColorClass = () => {
        if (completionPercentage < 30) return 'from-red-500 to-red-400';
        if (completionPercentage < 70) return 'from-yellow-500 to-yellow-400';
        return 'from-green-500 to-green-400';
    };

    // Format field name for display
    const formatFieldName = (field) => {
        return field
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Add attention-grabbing animation
    useEffect(() => {
        if (completionPercentage < 100) {
            const interval = setInterval(() => {
                setIsAnimating(prev => !prev);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [completionPercentage]);

    // Skip rendering if profile is complete or user dismissed
    if (completionPercentage === 100 || !isVisible) return null;

    return (
        <div
            className={`relative bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 transition-all duration-500 w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto ${isAnimating ? 'transform scale-[1.02] shadow-lg' : ''}`}
        >
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 sm:p-3 md:p-4 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <UserCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold">Profile Completion</h3>
                    </div>
                    <span className="text-base sm:text-lg md:text-xl font-bold">
                        {completionPercentage}%
                    </span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 sm:h-2 bg-gray-200">
                <div
                    className={`h-full bg-gradient-to-r ${getColorClass()} transition-all duration-1000 ease-out`}
                    style={{ width: `${completionPercentage}%` }}
                ></div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm md:text-base text-gray-700">
                        Complete your profile to unlock all features and improve your resume-building experience!
                    </p>
                </div>

                {/* Missing fields section removed as requested */}

                {/* Action buttons */}
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                    {/* <button
                        onClick={() => {
                            dispatch(setActiveTab('Profile Settings'));
                            if (onTabChange) {
                                alert("tab changed")
                                // If onTabChange prop is provided, use it to change tab within dashboard
                                onTabChange('Profile Settings');

                            } else {
                                // Fallback to direct navigation if not in dashboard context
                                router.push('/dashboard');
                                // Use Redux to set the active tab using the proper action
                                dispatch(setActiveTab('Profile Settings'));
                            }
                        }}
                        className="w-full sm:flex-1 py-1.5 sm:py-2 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md text-xs sm:text-sm font-medium hover:shadow-md transition-all duration-300 hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-1.5 sm:gap-2"
                    >
                        <UserCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Complete Profile
                    </button> */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsVisible(false);
                            // Save dismissed state to localStorage
                            localStorage.setItem('profileIndicatorDismissed', 'true');
                        }}
                        className="w-full sm:w-auto py-1.5 sm:py-2 px-3 border border-gray-300 text-gray-600 text-xs sm:text-sm rounded-md hover:bg-gray-50 transition-colors duration-300"
                    >
                        Dismiss
                    </button>
                </div>
            </div>

            {/* Attention indicator */}
            <div className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold animate-pulse shadow-md">
                !
            </div>
        </div>
    );
};

export default ProfileCompletionIndicator;