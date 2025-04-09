import React from 'react';
import { FileText, Circle } from 'lucide-react';
import Image from 'next/image';

const LoadingScreen = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            {/* Use the provided image */}
            <Image
                src="/Resubol.png" // Path to your image in the public folder
                alt="Loading"
                width={150} // Adjust width as needed
                height={150} // Adjust height as needed
                className="animate-spin" // Tailwind's built-in spin animation
            />
        </div>
    );
};

export default LoadingScreen;