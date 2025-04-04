import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const AlertMessage = ({ error, success, showAlert }) => {
    return (
        <div className={`transition-all duration-300 ease-in-out mb-6 ${showAlert ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            {error && (
                <Alert variant="destructive">
                    <AlertTitle className="flex items-center">
                        <span className="mr-2">⚠️</span> Error
                    </AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {success && (
                <Alert className="bg-green-50 text-green-700 border-green-200">
                    <AlertTitle className="flex items-center">
                        <span className="mr-2">✅</span> Success
                    </AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default AlertMessage;