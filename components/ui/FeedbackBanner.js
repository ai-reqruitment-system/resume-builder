import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const FeedbackTypes = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning',
};

const FeedbackBanner = ({
    message,
    type = FeedbackTypes.INFO,
    onClose,
    autoClose = true,
    duration = 5000,
    className = '',
}) => {
    const [isVisible, setIsVisible] = useState(true);

    // Configure banner based on type
    const bannerConfig = {
        [FeedbackTypes.SUCCESS]: {
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-500',
            textColor: 'text-green-800',
            iconColor: 'text-green-500',
        },
        [FeedbackTypes.ERROR]: {
            icon: AlertCircle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-500',
            textColor: 'text-red-800',
            iconColor: 'text-red-500',
        },
        [FeedbackTypes.INFO]: {
            icon: Info,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-500',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-500',
        },
        [FeedbackTypes.WARNING]: {
            icon: AlertTriangle,
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-500',
            textColor: 'text-yellow-800',
            iconColor: 'text-yellow-500',
        },
    };

    const config = bannerConfig[type];
    const Icon = config.icon;

    // Auto-close functionality
    useEffect(() => {
        if (autoClose && duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [autoClose, duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onClose) onClose();
        }, 300); // Wait for exit animation
    };

    if (!isVisible) return null;

    return (
        <div
            className={`w-full rounded-lg overflow-hidden transition-all duration-300 ${config.bgColor} border ${config.borderColor} ${className} ${isVisible ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0'}`}
            role="alert"
            aria-live="assertive"
        >
            <div className="p-3 sm:p-4 flex items-start">
                <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 ${config.iconColor}`} />
                </div>
                <div className="ml-3 flex-1">
                    <p className={`text-sm font-medium ${config.textColor}`}>{message}</p>
                </div>
                <button
                    type="button"
                    className={`ml-auto -mx-1.5 -my-1.5 ${config.bgColor} ${config.textColor} rounded-lg focus:ring-2 focus:ring-opacity-50 focus:ring-${type === FeedbackTypes.SUCCESS ? 'green' : type === FeedbackTypes.ERROR ? 'red' : type === FeedbackTypes.WARNING ? 'yellow' : 'blue'}-400 p-1.5 inline-flex h-8 w-8 hover:bg-opacity-75 transition-colors`}
                    onClick={handleClose}
                    aria-label="Close"
                >
                    <span className="sr-only">Close</span>
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default FeedbackBanner;