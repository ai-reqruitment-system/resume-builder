import React from 'react';
import { FileText, Circle } from 'lucide-react';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
            <div className="relative">
                <FileText className="w-16 h-16 text-teal-600 animate-bounce" />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                    <div className="flex space-x-2">
                        <Circle className="w-3 h-3 text-teal-600 animate-pulse" />
                        <Circle className="w-3 h-3 text-teal-600 animate-pulse delay-150" />
                        <Circle className="w-3 h-3 text-teal-600 animate-pulse delay-300" />
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center">
                <h2 className="text-xl font-semibold text-gray-800">Building Your Resume</h2>
                <p className="mt-2 text-gray-600">Please wait while we prepare your document</p>
            </div>

            {/* Progress Bar */}
            <div className="w-64 h-2 mt-8 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full animate-[progress_2s_ease-in-out_infinite]"
                    style={{
                        animation: 'progress 2s ease-in-out infinite',
                        width: '100%',
                        transformOrigin: 'left',
                        transform: 'translateX(-100%)'
                    }} />
            </div>
        </div>
    );
};

export default LoadingScreen;