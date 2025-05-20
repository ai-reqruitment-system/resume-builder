import React from 'react';
import { FileText, Circle, Loader2 } from 'lucide-react';
import Image from 'next/image';

const LoadingScreen = ({ message = 'Loading...', size = 'full', showLogo = true }) => {
    // Different size options for the loading screen
    const sizeClasses = {
        full: 'h-screen',
        container: 'h-full min-h-[400px]',
        small: 'h-40',
    };

    return (
        <div className={`flex flex-col justify-center items-center ${sizeClasses[size] || sizeClasses.full} bg-gray-50 w-full`}>
            {showLogo && (
                <div className="mb-6">
                    <Image
                        src="/logoHireme1.png"
                        alt="Logo"
                        width={100}
                        height={100}
                        className="animate-pulse"
                    />
                </div>
            )}

            <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
                <span className="text-gray-700 font-medium">{message}</span>
            </div>
        </div>
    );
};


export default LoadingScreen;