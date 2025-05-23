import React from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import with SSR disabled to prevent localStorage errors
const BuilderPage = dynamic(
    () => import('@/pages/builder.js'),
    { ssr: false }
);

export default function Builder({ onClose }) {
    console.log('Builder component rendered');
    console.log('onClose prop:', onClose);
    return (
        <div className="w-full mx-auto">
            <BuilderPage onClose={onClose} />
        </div>
    );
}