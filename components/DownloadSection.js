import { useState } from 'react';
import { Download, X, AlertCircle } from 'lucide-react';

const DownloadSection = ({ formData, fontStyles, templateName }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const validateFormData = () => {
        if (!formData) return "Please fill in the resume details";
        if (!formData.first_name) return "First name is required";
        if (!formData.last_name) return "Last name is required";
        if (!formData.email) return "Email is required";
        if (!formData.phone) return "Phone number is required";
        return null;
    };

    const downloadPDF = async () => {
        try {
            const validationError = validateFormData();
            if (validationError) {
                setError(validationError);
                return;
            }

            setIsLoading(true);
            setError(null);

            const sendingDAtaTOBackend = {
                ...formData,
                ...fontStyles,
                templateName: templateName,
            };
            console.log(sendingDAtaTOBackend, "fromt eh download section")


            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/generate-resume`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    ...formData,
                    ...fontStyles,
                    templateName: templateName,
                })
            });


            // Check if response is JSON (error) or blob (PDF)
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();

                if (!response.ok) {
                    if (errorData.errors) {
                        // Laravel validation errors
                        const firstError = Object.values(errorData.errors)[0][0];
                        throw new Error(firstError);
                    }

                    // Other API errors
                    switch (errorData.message?.toLowerCase()) {
                        case 'the first name field is required.':
                            throw new Error('Please enter your first name');
                        case 'unauthenticated.':
                            throw new Error('Your session has expired. Please log in again');
                        default:
                            throw new Error(errorData.message || 'PDF generation failed');
                    }
                }
            }

            const blob = await response.blob();
            const filename = `${formData.first_name}_${formData.last_name}_Resume.pdf`;

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, filename);
            } else {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Download failed:', error);
            setError(error.message || 'Something went wrong. Please try again later');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 border-t space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-100 rounded-lg relative overflow-hidden">
                    <div className="p-4 flex items-start">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3 flex-1 pr-8">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="absolute top-4 right-4 text-red-400 hover:text-red-500 transition-colors"
                        >
                            <span className="sr-only">Dismiss</span>
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="h-1 w-full bg-red-100">
                        <div className="h-full w-full bg-red-400 animate-progress origin-left"></div>
                    </div>
                </div>
            )}

            <button
                onClick={downloadPDF}
                disabled={isLoading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg 
                   flex items-center justify-center space-x-2 transition-all duration-200
                   ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
                   disabled:opacity-50 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
                <Download className={`w-5 h-5 ${isLoading ? 'animate-bounce' : ''}`} />
                <span>{isLoading ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>
        </div>
    );
};

export default DownloadSection;