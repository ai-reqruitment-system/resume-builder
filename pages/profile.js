import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const router = useRouter();

    const { user, loading, updateUserProfile, fetchUserDetail } = useAuth();
    const [userData, setUserData] = useState(null);

    // console.log(user, "from profile")
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    useEffect(() => {
        // First set form data from user context if available
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                bio: user.bio || '',
            });
        }

        // Fetch user details from API
        const getUserDetails = async () => {
            setIsLoading(true);
            try {
                const userFound = await fetchUserDetail();
                if (userFound) {
                    // Update userData state
                    setUserData(userFound);

                    // Update form data with fetched user details
                    setFormData({
                        first_name: userFound.first_name || '',
                        last_name: userFound.last_name || '',
                        email: userFound.email || '',
                        phone: userFound.phone || '',
                        location: userFound.location || '',
                        bio: userFound.bio || '',
                    });
                    console.log("User details fetched successfully:", userFound);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        getUserDetails();
    }, [user]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveLoading(true);
        try {
            await updateUserProfile(formData);
            setIsEditing(false);

            // Refresh user data after successful update
            const updatedUser = await fetchUserDetail();
            if (updatedUser) {
                setUserData(updatedUser);
                setFormData({
                    first_name: updatedUser.first_name || '',
                    last_name: updatedUser.last_name || '',
                    email: updatedUser.email || '',
                    phone: updatedUser.phone || '',
                    location: updatedUser.location || '',
                    bio: updatedUser.bio || '',
                });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setSaveLoading(false);
        }
    };



    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="w-full sm:w-[600px] lg:w-[800px] xl:w-[900px]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        {/* Profile Header */}
                        <div className="p-6 sm:p-8 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                    <div className="relative">
                                        <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold ring-4 ring-white shadow-xl">
                                            {formData.first_name ? formData.first_name[0].toUpperCase() : 'U'}
                                        </div>
                                        {!isEditing && (
                                            <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-full ring-4 ring-white flex items-center justify-center shadow-lg">
                                                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                            {formData.first_name || formData.last_name ?
                                                `${formData.first_name || ''} ${formData.last_name || ''}` :
                                                'Your Name'}
                                        </h1>
                                        <p className="text-lg text-gray-600 mt-2">{formData.bio || 'Your Profession'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 text-gray-700 font-medium flex items-center justify-center gap-2 hover:shadow-md"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
                            <div className="grid grid-cols-1 gap-6 sm:gap-8">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3 rounded-lg border ${isEditing ? 'border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400' : 'border-gray-200 bg-gray-50'} transition-all duration-200`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3 rounded-lg border ${isEditing ? 'border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400' : 'border-gray-200 bg-gray-50'} transition-all duration-200`}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3 rounded-lg border ${isEditing ? 'border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400' : 'border-gray-200 bg-gray-50'} transition-all duration-200`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3 rounded-lg border ${isEditing ? 'border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400' : 'border-gray-200 bg-gray-50'} transition-all duration-200`}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
                                        <input
                                            type="text"
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 rounded-lg border ${isEditing ? 'border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400' : 'border-gray-200 bg-gray-50'} transition-all duration-200`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            {isEditing && (
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={saveLoading}
                                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:hover:shadow-none"
                                    >
                                        {saveLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}