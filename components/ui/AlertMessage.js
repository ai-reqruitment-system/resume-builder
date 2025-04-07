import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const AlertMessage = ({ error, success, showAlert }) => {
    return (
        <div className={`transition-all duration-300 ease-in-out mb-4 ${showAlert ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            {error && (
                <Alert variant="destructive" className="border border-red-200">
                    <AlertTitle className="flex items-center text-sm font-medium">
                        <span className="mr-1.5">⚠️</span> Error
                    </AlertTitle>
                    <AlertDescription className="text-xs mt-1">{error}</AlertDescription>
                </Alert>
            )}
            {success && (
                <Alert className="bg-green-50 text-green-700 border border-green-200">
                    <AlertTitle className="flex items-center text-sm font-medium">
                        <span className="mr-1.5">✅</span> Success
                    </AlertTitle>
                    <AlertDescription className="text-xs mt-1">{success}</AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default AlertMessage;