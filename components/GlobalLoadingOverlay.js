import React from 'react';
import { useSelector } from 'react-redux';
import LoadingScreen from './LoadingScreen';

/**
 * GlobalLoadingOverlay - A component that displays a loading overlay when global loading state is active
 * This component should be placed in the _app.js file to be available throughout the application
 */
const GlobalLoadingOverlay = () => {
    const { isLoading, loadingMessage } = useSelector(state => state.ui);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full p-6">
                <LoadingScreen
                    message={loadingMessage}
                    size="small"
                    showLogo={true}
                />
            </div>
        </div>
    );
};

export default GlobalLoadingOverlay;