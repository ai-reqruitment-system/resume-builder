// components/preview/PreviewContainer.js
import React from 'react';
import { Download, Share2 } from 'lucide-react';

const PreviewContainer = ({ children, onDownload, isFullScreen = false }) => {
    return (
        <div className="relative">
            {/* Paper effect wrapper */}
            <div className={`
                bg-white rounded-lg shadow-xl overflow-hidden
                ${isFullScreen ? 'scale-100' : 'scale-90'}
                transform transition-transform duration-300
                hover:scale-95 cursor-pointer
            `}>
                {/* Top actions bar */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white">
                        <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                        onClick={onDownload}
                        className="p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white"
                    >
                        <Download className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                {/* Content with page effects */}
                <div className="relative">
                    {/* Page shadow effect */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-black/5 to-transparent" />
                        <div className="absolute bottom-0 left-0 h-8 w-full bg-gradient-to-t from-black/5 to-transparent" />
                    </div>

                    {/* Actual content */}
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </div>

            {/* Paper stack effect */}
            <div className="absolute -bottom-2 -right-2 left-8 top-8 bg-gray-100 rounded-lg -z-10" />
            <div className="absolute -bottom-4 -right-4 left-16 top-16 bg-gray-50 rounded-lg -z-20" />
        </div>
    );
};

export default PreviewContainer;