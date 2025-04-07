import { useEffect, useState } from 'react';
import Layout from "@/components/Layout";
import { UserCircle2, Mail, Phone, Loader2, LogOut, Home, Settings, ChevronRight, FileText, User, Bell, HelpCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import LoadingScreen from '@/components/LoadingScreen';

const ProfilePage = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: null
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setIsClient(true);
        const token = localStorage.getItem('token');
        // if (!token) {
        //     router.push('/login');
        //     return;
        // }

        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        setProfileData({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
        });
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

    const validateForm = () => {
        const newErrors = {};
        if (!profileData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!profileData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(profileData.email)) {
            newErrors.email = 'Invalid email address';
        }
        // Phone validation only if a phone number is provided
        if (profileData.phone.trim() && !/^[1-9]\d{9}$/.test(profileData.phone.replace(/\s+/g, ''))) {
            newErrors.phone = 'Invalid phone number (should be 10 digits)';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            const data = await response.json();
            localStorage.setItem('userData', JSON.stringify(data.data));
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isClient) return null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        router.push('/login');
    };

    return (

        <div className="  flex flex-col md:flex-row w-full ">
            {/* Sidebar Navigation */}



            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8">

                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                    {/* Header with breadcrumb */}
                    <div className="bg-blue-600 px-6 py-5 text-white rounded-t-2xl">
                        <div className="flex items-center text-sm text-blue-100 mb-2">
                            <Link href="/dashboard" className="hover:text-white transition-colors duration-200">Dashboard</Link>
                            <ChevronRight className="w-4 h-4 mx-2" />
                            <span>Profile</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold mb-1">Profile Settings</h1>
                                <p className="text-blue-100">Update your personal information</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] ${isEditing
                                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                                    : 'bg-blue-400 text-white hover:bg-blue-300'
                                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''} shadow-sm`}
                                disabled={loading}
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>
                    </div>

                    {/* Alert Messages */}
                    <div className={`transition-all duration-300 ease-in-out px-6 py-4 ${showAlert ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                        }`}>
                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle className="flex items-center">
                                    <span className="mr-2">⚠️</span> Error
                                </AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {success && (
                            <Alert className="bg-blue-50 text-blue-700 border-blue-200">
                                <AlertTitle className="flex items-center">
                                    <span className="mr-2">✅</span> Success
                                </AlertTitle>
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Full Name */}
                        <div className="w-full">
                            <label className="block text-gray-600 mb-2 text-sm">
                                Full Name
                            </label>
                            <div className={`relative rounded-lg border ${errors.name ? 'border-red-300' : 'border-gray-300'
                                } ${!isEditing ? 'bg-gray-50' : 'hover:border-blue-400 focus-within:border-blue-500'} 
                            transition-colors`}>
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                    <UserCircle2 className={`w-5 h-5 ${isEditing ? 'text-blue-500' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => {
                                        setProfileData({ ...profileData, name: e.target.value });
                                        if (errors.name) setErrors({ ...errors, name: '' });
                                    }}
                                    disabled={!isEditing || loading}
                                    className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-transparent outline-none disabled:text-gray-500 transition-all duration-200 placeholder:text-gray-400"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="w-full">
                            <label className="block text-gray-600 mb-2 text-sm">
                                Email Address
                            </label>
                            <div className={`relative rounded-lg border ${errors.email ? 'border-red-300' : 'border-gray-300'
                                } ${!isEditing ? 'bg-gray-50' : 'hover:border-blue-400 focus-within:border-blue-500'} 
                            transition-colors`}>
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                    <Mail className={`w-5 h-5 ${isEditing ? 'text-blue-500' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => {
                                        setProfileData({ ...profileData, email: e.target.value });
                                        if (errors.email) setErrors({ ...errors, email: '' });
                                    }}
                                    disabled={!isEditing || loading}
                                    className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-transparent outline-none disabled:text-gray-500 transition-all duration-200 placeholder:text-gray-400"
                                    placeholder="Enter your email address"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Phone (Optional) */}
                        <div className="w-full">
                            <label className="block text-gray-600 mb-2 text-sm">
                                Phone Number (Optional)
                            </label>
                            <div className={`relative rounded-lg border ${errors.phone ? 'border-red-300' : 'border-gray-300'
                                } ${!isEditing ? 'bg-gray-50' : 'hover:border-blue-400 focus-within:border-blue-500'} 
                            transition-colors`}>
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                    <Phone className={`w-5 h-5 ${isEditing ? 'text-blue-500' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 10) {
                                            setProfileData({ ...profileData, phone: value });
                                            if (errors.phone) setErrors({ ...errors, phone: '' });
                                        }
                                    }}
                                    disabled={!isEditing || loading}
                                    className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-transparent outline-none disabled:text-gray-500 transition-all duration-200 placeholder:text-gray-400"
                                    placeholder="Enter your phone number (optional)"
                                    maxLength="10"
                                />
                            </div>
                            {errors.phone && (
                                <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
                            )}
                        </div>

                        {/* Save Button */}
                        {isEditing && (
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                                    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                                    flex items-center justify-center min-w-[140px] transform hover:scale-[1.02]
                                    shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>

    );
};

export default ProfilePage;