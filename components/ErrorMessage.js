import React from 'react';
import { AlertCircle, X } from 'lucide-react';

/**
 * ErrorMessage - A component for displaying error messages with consistent styling
 * @param {string} message - The error message to display
 * @param {function} onDismiss - Optional callback function to dismiss the error
 * @param {string} type - The type of error (error, warning, info)
 */
const ErrorMessage = ({
    message,
    onDismiss,
    type = 'error',
    className = ''
}) => {
    // Define styles based on error type
    const styles = {
        error: {
            container: 'bg-red-50 border-red-200 text-red-700',
            icon: 'text-red-500',
            button: 'text-red-500 hover:bg-red-100'
        },
        warning: {
            container: 'bg-yellow-50 border-yellow-200 text-yellow-700',
            icon: 'text-yellow-500',
            button: 'text-yellow-500 hover:bg-yellow-100'
        },
        info: {
            container: 'bg-blue-50 border-blue-200 text-blue-700',
            icon: 'text-blue-500',
            button: 'text-blue-500 hover:bg-blue-100'
        }
    };

    const style = styles[type] || styles.error;

    return (
        <div className={`rounded-lg border p-3 flex items-start space-x-3 ${style.container} ${className}`}>
            <div className="flex-shrink-0">
                <AlertCircle className={`h-5 w-5 ${style.icon}`} />
            </div>
            <div className="flex-1 text-sm">
                {message}
            </div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className={`p-1 rounded-full ${style.button}`}
                    aria-label="Dismiss"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;