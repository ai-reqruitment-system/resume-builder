import { useState, useEffect } from 'react';
import { UserCircle2, Mail, Phone, Loader2, ArrowLeft, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import Link from 'next/link';
import InputWithIcon from '@/components/InputWithIcon';
import AlertMessage from '@/components/ui/AlertMessage';

const CompleteProfilePage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showAlert, setShowAlert] = useState(false);

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
        if (error || success) {
            setShowAlert(true);
            const timer = setTimeout(() => {
                setShowAlert(false);
                setError('');
                setSuccess('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    const validatePhone = (phone) => {
        return /^[1-9]\d{9}$/.test(phone);
    };

    const validateForm = () => {
        if (!formData.first_name.trim()) {
            setError('First name is required');
            return false;
        }
        if (!formData.last_name.trim()) {
            setError('Last name is required');
            return false;
        }
        if (formData.phone && !validatePhone(formData.phone)) {
            setError('Please enter a valid phone number');
            return false;
        }
        return true;
    };

    const handleCompleteProfile = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Instead of directly calling the external API, make a request to our own API
            // which will then forward the request to the external API
            // This avoids CORS issues as the browser is only making a same-origin request
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/complete-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to complete profile');
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

                    {/* Alert Messages */}
                    <AlertMessage error={error} success={success} showAlert={showAlert} />

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
                            />

                            {/* Phone Number (Optional) */}
                            <InputWithIcon
                                label="Phone Number (Optional)"
                                icon={Phone}
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 10) {
                                        setFormData(prev => ({
                                            ...prev,
                                            phone: value
                                        }));
                                    }
                                }}
                                placeholder="Enter your phone number"
                                maxLength="10"
                                error={formData.phone && !validatePhone(formData.phone) ? "Please enter a valid 10-digit phone number" : null}
                            />
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
                                    Desired Roles (Max 5)
                                </label>
                                {formData.job_roles
                                    .map((role, index) => (
                                        <div key={index} className="flex items-center gap-2 mb-2">
                                            <div className="relative flex-1 rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Briefcase className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={role}
                                                    onChange={(e) => {
                                                        const newRoles = [...formData.job_roles
                                                        ];
                                                        newRoles[index] = e.target.value;
                                                        setFormData(prev => ({
                                                            ...prev, job_roles
                                                                : newRoles
                                                        }));
                                                    }}
                                                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    placeholder="e.g., Software Engineer"
                                                />
                                            </div>
                                            {formData.job_roles
                                                .length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newRoles = formData.job_roles
                                                                .filter((_, i) => i !== index);
                                                            setFormData(prev => ({
                                                                ...prev, job_roles
                                                                    : newRoles
                                                            }));
                                                        }}
                                                        className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                        </div>
                                    ))}
                                {formData.job_roles
                                    .length < 5 && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                job_roles
                                                    : [...prev.job_roles
                                                        , '']
                                            }))}
                                            className="mt-2 text-sm text-blue-500 hover:text-blue-700"
                                        >
                                            + Add another role
                                        </button>
                                    )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Preferred Locations (Max 5)
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
                                                }}
                                                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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