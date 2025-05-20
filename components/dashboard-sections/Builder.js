import React from 'react';
import BuilderPage from '@/pages/builder.js';

export default function Builder({ onClose }) {
    console.log('Builder component rendered');
    return (
        <div className="w-full mx-auto">
            <BuilderPage onClose={onClose} />
        </div>
    );
}