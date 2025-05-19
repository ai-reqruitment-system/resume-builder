import { useState, useEffect } from 'react';
import { UserCircle2, Mail, Phone, Loader2, ArrowLeft, MapPin, Briefcase, GraduationCap, AlertTriangle } from 'lucide-react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import Link from 'next/link';
import InputWithIcon from '@/components/InputWithIcon';
import PhoneInputComponent from '@/components/PhoneInputComponent';
import SweetAlert from '@/utils/sweetAlert';

const CompleteProfilePage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    // Updated formData structure
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        location: '',
        job_roles: [''],  // Array to store multiple job preferences
        selected_locations: [''], // Array to store multiple preferred locations
    });

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('verifyEmail');
        if (!storedEmail) {
            router.replace('/login');
        } else {
            setFormData(prev => ({ ...prev, email: storedEmail }));
        }
    }, [router]);

    useEffect(() => {
        if (error) {
            SweetAlert.error('Error', error);
            // Clear error after showing alert
            setError('');
        }
        if (success) {
            SweetAlert.success('Success', success);
            // Clear success after showing alert
            setSuccess('');
        }
    }, [error, success]);

    const validatePhone = (phone) => {
        return /^[1-9]\d{11}$/.test(phone);
    };

    const validateForm = () => {
        // Reset previous errors
        setFieldErrors({});
        setError(''); // Clear any previous general error message

        let isValid = true;
        const errors = {};

        if (!formData.first_name.trim()) {
            setError('First name is required');
            errors.first_name = 'First name is required';
            isValid = false;
        }

        if (!formData.last_name.trim()) {
            setError('Last name is required');
            errors.last_name = 'Last name is required';
            isValid = false;
        }

        if (formData.phone && !validatePhone(formData.phone)) {
            setError('Please enter a valid 12-digit phone number');
            errors.phone = 'Please enter a valid 12-digit phone number';
            isValid = false;
        }

        // Job roles are now optional, but if provided, they shouldn't be empty
        const validJobRoles = formData.job_roles.filter(role => role.trim() !== '');

        // Only validate job roles if the user has entered something
        if (formData.job_roles.length > 1 || (formData.job_roles.length === 1 && formData.job_roles[0].trim() !== '')) {
            // Check if any job role is empty (for backend validation format)
            formData.job_roles.forEach((role, index) => {
                if (!role.trim()) {
                    errors[`job_roles.${index}`] = `The job role field must not be empty`;
                    isValid = false;
                }
            });
        }

        // Preferred locations are now optional, but if provided, they shouldn't be empty
        const validLocations = formData.selected_locations.filter(location => location.trim() !== '');

        // Only validate locations if the user has entered something
        if (formData.selected_locations.length > 1 || (formData.selected_locations.length === 1 && formData.selected_locations[0].trim() !== '')) {
            // Check if any location is empty (for backend validation format)
            formData.selected_locations.forEach((location, index) => {
                if (!location.trim()) {
                    errors[`selected_locations.${index}`] = `The location field must not be empty`;
                    isValid = false;
                }
            });
        }

        setFieldErrors(errors);
        return isValid;
    };

    const handleCompleteProfile = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Filter out empty values from arrays before submission
        const cleanedFormData = {
            ...formData,
            job_roles: formData.job_roles.filter(role => role.trim() !== ''),
            selected_locations: formData.selected_locations.filter(location => location.trim() !== '')
        };

        setLoading(true);
        try {
            // Instead of directly calling the external API, make a request to our own API
            // which will then forward the request to the external API
            // This avoids CORS issues as the browser is only making a same-origin request
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/complete-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanedFormData),
            });

            const data = await response.json();
            if (!response.ok) {
                // Handle validation errors from the API
                if (data.errors) {
                    const apiErrors = {};
                    Object.entries(data.errors).forEach(([key, messages]) => {
                        // Store the error message
                        apiErrors[key] = Array.isArray(messages) ? messages[0] : messages;

                        // Set the main error message to display in the alert
                        setError(data.message || 'Validation failed. Please check the form fields.');
                    });
                    setFieldErrors(apiErrors);
                    // Don't throw error here so we can display field-specific errors
                    return;
                } else {
                    throw new Error(data.message || 'Failed to complete profile');
                }
            }
            console.log(data)

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userData', JSON.stringify(data.data));
                localStorage.removeItem('profileData');
                router.push('/dashboard');
            } else {
                // If we don't get a token back but the request was successful
                setSuccess('Profile completed successfully!');
                // Store basic user data
                localStorage.setItem('userData', JSON.stringify({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email
                }));
                localStorage.removeItem('profileData');
            }
            // //   Redirect after a short delay to show the success message
            // setTimeout(() => {
            //     router.push('/dashboard');
            // }, 1500);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Add Work Experience Field
    const addWorkExperience = () => {
        setFormData(prev => ({
            ...prev,
            workExperience: [...prev.workExperience, {
                jobTitle: '',
                employer: '',
                startDate: '',
                endDate: '',
                city: '',
                description: '',
            }],
        }));
    };

    // Remove Work Experience Field
    const removeWorkExperience = (index) => {
        setFormData(prev => ({
            ...prev,
            workExperience: prev.workExperience.filter((_, i) => i !== index),
        }));
    };

    // Add Skill Field
    const addSkill = () => {
        setFormData(prev => ({
            ...prev,
            skills: [...prev.skills, { skill: '', level: '' }],
        }));
    };

    // Remove Skill Field
    const removeSkill = (index) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index),
        }));
    };

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
                    {/* Back Button */}
                    <Link
                        href="/verify-otp"
                        className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 transform transition-transform group-hover:-translate-x-1" />
                        Back to Verification
                    </Link>

                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
                            Complete Your Profile
                        </h1>
                        <p className="text-lg text-gray-600">
                            Help us personalize your job search experience
                        </p>
                    </div>

                    {/* Alert Messages removed - now using SweetAlert2 */}

                    <form onSubmit={handleCompleteProfile} className="space-y-8">
                        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <UserCircle2 className="w-5 h-5 mr-2 text-blue-500" />
                                Personal Information
                            </h2>

                            {/* Email Address (Disabled) */}
                            <InputWithIcon
                                label="Email Address"
                                icon={Mail}
                                type="email"
                                value={formData.email}
                                disabled={true}
                                className="bg-gray-50"
                            />

                            {/* First Name */}
                            <InputWithIcon
                                label="First Name"
                                icon={UserCircle2}
                                type="text"
                                value={formData.first_name}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    first_name: e.target.value
                                }))}
                                placeholder="Enter your first name"
                                required={true}
                                error={fieldErrors.first_name}
                            />

                            {/* Last Name */}
                            <InputWithIcon
                                label="Last Name"
                                icon={UserCircle2}
                                type="text"
                                value={formData.last_name}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    last_name: e.target.value
                                }))}
                                placeholder="Enter your last name"
                                required={true}
                                error={fieldErrors.last_name}
                            />

                            {/* Phone Number (Optional) */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                                <div className="mt-1">
                                    <PhoneInputComponent
                                        value={formData.phone}
                                        onChange={(value) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                phone: value
                                            }));
                                        }}
                                        error={formData.phone && !validatePhone(formData.phone) ? "Please enter a valid 12-digit phone number" : fieldErrors.phone}
                                        placeholder="Enter your phone number"
                                        preferredCountries={['us', 'gb', 'ca', 'au']}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                                Location Details
                            </h2>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Location
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            location: e.target.value,
                                        }))}
                                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="e.g., Houston, TX"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                                Job Preferences
                            </h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Desired Roles (Optional, Max 5)
                                </label>
                                {formData.job_roles.map((role, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                        <div className="relative flex-1 rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Briefcase className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={role}
                                                onChange={(e) => {
                                                    const newRoles = [...formData.job_roles];
                                                    newRoles[index] = e.target.value;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        job_roles: newRoles
                                                    }));
                                                    // Clear all job_roles related field errors when user types
                                                    const updatedErrors = { ...fieldErrors };
                                                    // Remove general job_roles error
                                                    delete updatedErrors.job_roles;
                                                    // Remove all indexed job_roles errors
                                                    Object.keys(updatedErrors).forEach(key => {
                                                        if (key.startsWith('job_roles.')) {
                                                            delete updatedErrors[key];
                                                        }
                                                    });
                                                    setFieldErrors(updatedErrors);
                                                }}
                                                className={`pl-10 block w-full rounded-md ${fieldErrors.job_roles || fieldErrors['job_roles.0'] || fieldErrors[`job_roles.${index}`] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} shadow-sm sm:text-sm`}
                                                placeholder="e.g., Software Engineer"
                                            />
                                        </div>
                                        {formData.job_roles.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newRoles = formData.job_roles.filter((_, i) => i !== index);
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        job_roles: newRoles
                                                    }));
                                                }}
                                                className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {(fieldErrors.job_roles || Object.keys(fieldErrors).some(key => key.startsWith('job_roles.'))) && (
                                    <div className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        {fieldErrors.job_roles ||
                                            Object.entries(fieldErrors)
                                                .filter(([key]) => key.startsWith('job_roles.'))
                                                .map(([key, value]) => `${value}`)[0]}
                                    </div>
                                )}
                                {formData.job_roles.length < 5 && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            job_roles: [...prev.job_roles, '']
                                        }))}
                                        className="mt-2 text-sm text-blue-500 hover:text-blue-700"
                                    >
                                        + Add another role
                                    </button>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Preferred Locations (Optional, Max 5)
                                </label>
                                {formData.selected_locations.map((location, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                        <div className="relative flex-1 rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <MapPin className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={location}
                                                onChange={(e) => {
                                                    const newLocations = [...formData.selected_locations];
                                                    newLocations[index] = e.target.value;
                                                    setFormData(prev => ({ ...prev, selected_locations: newLocations }));
                                                    // Clear all selected_locations related field errors when user types
                                                    const updatedErrors = { ...fieldErrors };
                                                    // Remove general selected_locations error
                                                    delete updatedErrors.selected_locations;
                                                    // Remove all indexed selected_locations errors
                                                    Object.keys(updatedErrors).forEach(key => {
                                                        if (key.startsWith('selected_locations.')) {
                                                            delete updatedErrors[key];
                                                        }
                                                    });
                                                    setFieldErrors(updatedErrors);
                                                }}
                                                className={`pl-10 block w-full rounded-md ${fieldErrors.selected_locations || fieldErrors['selected_locations.0'] || fieldErrors[`selected_locations.${index}`] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} shadow-sm sm:text-sm`}
                                                placeholder="e.g., London or Remote"
                                            />
                                        </div>
                                        {formData.selected_locations.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newLocations = formData.selected_locations.filter((_, i) => i !== index);
                                                    setFormData(prev => ({ ...prev, selected_locations: newLocations }));
                                                }}
                                                className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {(fieldErrors.selected_locations || Object.keys(fieldErrors).some(key => key.startsWith('selected_locations.'))) && (
                                    <div className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        {fieldErrors.selected_locations ||
                                            Object.entries(fieldErrors)
                                                .filter(([key]) => key.startsWith('selected_locations.'))
                                                .map(([key, value]) => `${value}`)[0]}
                                    </div>
                                )}
                                {formData.selected_locations.length < 5 && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            selected_locations: [...prev.selected_locations, '']
                                        }))}
                                        className="mt-2 text-sm text-blue-500 hover:text-blue-700"
                                    >
                                        + Add another location
                                    </button>
                                )}
                            </div>
                        </div>


                        {/* Submit Button */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <button
                                type="submit"
                                disabled={loading || !formData.first_name || !formData.last_name || (formData.phone && !validatePhone(formData.phone))}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Complete Profile'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default CompleteProfilePage;