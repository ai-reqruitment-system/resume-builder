import React from 'react';

/**
 * SkeletonLoader - A component that displays skeleton loading animations for various UI elements
 * @param {string} type - The type of skeleton to display (card, text, avatar, etc.)
 * @param {number} count - Number of skeleton items to display
 * @param {string} className - Additional CSS classes
 */
const SkeletonLoader = ({ type = 'text', count = 1, className = '' }) => {
    // Base skeleton pulse animation class
    const baseClass = 'animate-pulse bg-gray-200 rounded';

    // Generate skeleton items based on type
    const renderSkeleton = () => {
        switch (type) {
            case 'text':
                return <div className={`${baseClass} h-4 w-full ${className}`}></div>;

            case 'title':
                return <div className={`${baseClass} h-6 w-3/4 ${className}`}></div>;

            case 'avatar':
                return <div className={`${baseClass} h-12 w-12 rounded-full ${className}`}></div>;

            case 'button':
                return <div className={`${baseClass} h-10 w-24 ${className}`}></div>;

            case 'card':
                return (
                    <div className={`${baseClass} p-4 rounded-lg ${className}`}>
                        <div className="${baseClass} h-6 w-3/4 mb-4"></div>
                        <div className="${baseClass} h-4 w-full mb-2"></div>
                        <div className="${baseClass} h-4 w-full mb-2"></div>
                        <div className="${baseClass} h-4 w-2/3"></div>
                    </div>
                );

            case 'form-field':
                return (
                    <div className={`space-y-2 ${className}`}>
                        <div className={`${baseClass} h-4 w-1/4 mb-1`}></div>
                        <div className={`${baseClass} h-10 w-full`}></div>
                    </div>
                );

            case 'list-item':
                return (
                    <div className={`flex items-center space-x-3 ${className}`}>
                        <div className={`${baseClass} h-10 w-10 rounded-full`}></div>
                        <div className="space-y-2 flex-1">
                            <div className={`${baseClass} h-4 w-1/2`}></div>
                            <div className={`${baseClass} h-3 w-3/4`}></div>
                        </div>
                    </div>
                );

            case 'section':
                return (
                    <div className={`space-y-4 ${className}`}>
                        <div className={`${baseClass} h-6 w-1/3 mb-4`}></div>
                        <div className={`${baseClass} h-4 w-full mb-2`}></div>
                        <div className={`${baseClass} h-4 w-full mb-2`}></div>
                        <div className={`${baseClass} h-4 w-3/4 mb-2`}></div>
                        <div className={`${baseClass} h-4 w-1/2`}></div>
                    </div>
                );

            default:
                return <div className={`${baseClass} h-4 w-full ${className}`}></div>;
        }
    };

    // Render multiple skeleton items if count > 1
    if (count > 1) {
        return (
            <div className="space-y-3">
                {Array(count).fill(0).map((_, index) => (
                    <div key={index}>{renderSkeleton()}</div>
                ))}
            </div>
        );
    }

    return renderSkeleton();
};

export default SkeletonLoader;