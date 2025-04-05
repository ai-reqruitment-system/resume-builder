import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const ToastTypes = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning',
};

const Toast = ({
    message,
    type = ToastTypes.INFO,
    duration = 5000,
    onClose,
    position = 'bottom-right',
    showProgress = true,
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(100);

    // Configure toast based on type
    const toastConfig = {
        [ToastTypes.SUCCESS]: {
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-400',
            textColor: 'text-green-800',
            iconColor: 'text-green-500',
        },
        [ToastTypes.ERROR]: {
            icon: AlertCircle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-400',
            textColor: 'text-red-800',
            iconColor: 'text-red-500',
        },
        [ToastTypes.INFO]: {
            icon: Info,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-400',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-500',
        },
        [ToastTypes.WARNING]: {
            icon: AlertTriangle,
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-400',
            textColor: 'text-yellow-800',
            iconColor: 'text-yellow-500',
        },
    };

    const config = toastConfig[type];
    const Icon = config.icon;

    // Position classes
    const positionClasses = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
        'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    };

    // Handle auto-dismiss
    useEffect(() => {
        if (duration === 0) return; // Don't auto-dismiss if duration is 0

        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        // Progress bar animation
        if (showProgress) {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    const newProgress = prev - (100 / (duration / 100));
                    return newProgress < 0 ? 0 : newProgress;
                });
            }, 100);

            return () => {
                clearTimeout(timer);
                clearInterval(interval);
            };
        }

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onClose) onClose();
        }, 300); // Wait for exit animation
    };

    if (!isVisible) return null;

    return (
        <div
            className={`fixed ${positionClasses[position]} z-50 max-w-sm w-full transform transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
            role="alert"
            aria-live="assertive"
        >
            <div className={`${config.bgColor} border-l-4 ${config.borderColor} rounded-lg shadow-md overflow-hidden`}>
                <div className="p-4 relative">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <Icon className={`h-5 w-5 ${config.iconColor}`} />
                        </div>
                        <div className="ml-3 flex-1 pt-0.5">
                            <p className={`text-sm font-medium ${config.textColor}`}>{message}</p>
                        </div>
                        <button
                            type="button"
                            className={`ml-4 inline-flex text-gray-400 focus:outline-none focus:text-gray-500 hover:text-gray-500 transition-colors`}
                            onClick={handleClose}
                            aria-label="Close"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Progress bar */}
                {showProgress && duration > 0 && (
                    <div className="h-1 w-full bg-gray-200">
                        <div
                            className={`h-full transition-all duration-100 ease-linear ${type === ToastTypes.SUCCESS ? 'bg-green-500' : type === ToastTypes.ERROR ? 'bg-red-500' : type === ToastTypes.WARNING ? 'bg-yellow-500' : 'bg-blue-500'}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Toast;