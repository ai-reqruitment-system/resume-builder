import React from 'react';
import BuilderPage from '@/pages/builder.js';

export default function Builder({ onClose }) {
    return (
        <div className="w-full mx-auto">
            <BuilderPage onClose={onClose} />
        </div>
    );
}