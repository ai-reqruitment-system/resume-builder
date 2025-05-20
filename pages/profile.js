import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import PhoneInputComponent from '../components/PhoneInputComponent';
import { useEffect as useLayoutEffect } from 'react';
import { validateProfile } from '../utils/validation';
import Swal from 'sweetalert2';


export default function Profile() {
    const router = useRouter();

    const { user, loading, updateUserProfile, updateProfileImage, fetchUserDetail } = useAuth();
    const [userData, setUserData] = useState(null);

    // Custom styles for phone input are now handled by the PhoneInputComponent

    // console.log(user, "from profile")
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        profile_photo_url: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const fileInputRef = useRef(null);
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
                profile_photo_url: user.profile_photo_url || '',
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
                        profile_photo_url: userFound.profile_photo_url || '',
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

    const handlePhoneChange = (value, country) => {
        setFormData(prev => ({
            ...prev,
            phone: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            setUploadError('Please select a valid image file (JPEG, PNG, GIF)');
            return;
        }

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image size should be less than 5MB');
            return;
        }

        setUploadError('');
        setImageFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadstart = () => setUploadProgress(0);
        reader.onprogress = (e) => {
            if (e.lengthComputable) {
                setUploadProgress(Math.round((e.loaded / e.total) * 100));
            }
        };
        reader.onload = (e) => {
            setImagePreview(e.target.result);
            setUploadProgress(100);
        };
        reader.readAsDataURL(file);

        // Upload image immediately regardless of edit mode
        handleImageUpload(file);
    };

    // Separate function to handle image upload
    const handleImageUpload = async (file) => {
        if (!file) return;

        try {
            setSaveLoading(true);
            const result = await updateProfileImage(file);

            if (result && result.success === false) {
                setUploadError(result.message || 'Failed to upload image');
                Swal.fire({
                    icon: 'error',
                    title: 'Image Upload Failed',
                    text: result.message || 'Failed to upload image',
                    customClass: {
                        popup: 'swal-popup-error',
                        title: 'swal-title',
                        htmlContainer: 'swal-text',
                        confirmButton: 'swal-button'
                    }
                });
                return;
            }

            // Update the form data with the new image URL if available
            if (result && result.data && result.data.profile_photo_url) {
                setFormData(prev => ({
                    ...prev,
                    profile_photo_url: result.data.profile_photo_url
                }));

                // Reset image file state since it's been uploaded
                setImageFile(null);

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Profile image updated successfully!',
                    customClass: {
                        popup: 'swal-popup-success',
                        title: 'swal-title',
                        htmlContainer: 'swal-text'
                    }
                });
            }
        } catch (error) {
            console.error('Error uploading profile image:', error);
            setUploadError('An unexpected error occurred while uploading the image');
        } finally {
            setSaveLoading(false);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveLoading(true);
        // Clear previous errors
        setFieldErrors({});
        setGeneralError('');

        // Validate required fields
        const validationResult = validateProfile(formData);
        if (!validationResult.success) {
            setFieldErrors(validationResult.errors);
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill in all required fields correctly',
                customClass: {
                    popup: 'swal-popup-error',
                    title: 'swal-title',
                    htmlContainer: 'swal-text',
                    confirmButton: 'swal-button'
                }
            });
            setSaveLoading(false);
            return;
        }

        try {
            // Construct FormData for profile data (excluding image)
            const form = new FormData();
            form.append('first_name', formData.first_name);
            form.append('last_name', formData.last_name);
            form.append('email', formData.email);
            // Phone number is already formatted with country code by react-phone-input-2
            form.append('phone', formData.phone);
            form.append('location', formData.location);
            form.append('bio', formData.bio);

            // We no longer include the profile image in the main profile update
            // The image is handled separately by handleImageUpload

            // Debug: Log FormData contents
            for (let pair of form.entries()) {
                console.log(pair[0] + ':', pair[1]);
            }

            const result = await updateUserProfile(form);
            console.log('Profile update result:', result);

            // Check if there's an error response from the API
            if (result && result.success === false) {
                // Handle validation errors
                if (result.errors) {
                    setFieldErrors(result.errors);
                    Swal.fire({
                        icon: 'error',
                        title: 'Update Failed',
                        text: result.message || 'Please check the form for errors',
                        customClass: {
                            popup: 'swal-popup-error',
                            title: 'swal-title',
                            htmlContainer: 'swal-text',
                            confirmButton: 'swal-button'
                        }
                    });
                } else {
                    setGeneralError(result.message || 'An error occurred while updating your profile');
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: result.message || 'An error occurred while updating your profile',
                        customClass: {
                            popup: 'swal-popup-error',
                            title: 'swal-title',
                            htmlContainer: 'swal-text',
                            confirmButton: 'swal-button'
                        }
                    });
                }
                return; // Don't proceed if there are errors
            }

            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Profile updated successfully!',
                customClass: {
                    popup: 'swal-popup-success',
                    title: 'swal-title',
                    htmlContainer: 'swal-text'
                }
            });

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
                    profile_photo_url: updatedUser.profile_photo_url || ''
                });
                // Reset image states if no separate image upload was done
                if (!imageFile) {
                    setImagePreview('');
                    setUploadProgress(0);
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setGeneralError('An unexpected error occurred. Please try again.');
        } finally {
            setSaveLoading(false);
        }
    };



    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="w-full sm:w-[600px] lg:w-[800px] xl:w-[900px]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        {/* Profile Header */}
                        <div className="p-6 sm:p-8 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                    <div className="relative">
                                        {(imagePreview || formData.profile_photo_url) ? (
                                            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden ring-4 ring-white shadow-xl relative">
                                                <img
                                                    src={imagePreview || formData.profile_photo_url}
                                                    alt="Profile"
                                                    className="h-full w-full object-cover"
                                                />
                                                <div
                                                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                                                    onClick={() => fileInputRef.current.click()}
                                                >
                                                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold ring-4 ring-white shadow-xl relative">
                                                {formData.first_name ? formData.first_name[0].toUpperCase() : 'U'}
                                                <div
                                                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-full cursor-pointer"
                                                    onClick={() => fileInputRef.current.click()}
                                                >
                                                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                        {!isEditing && (
                                            <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-full ring-4 ring-white flex items-center justify-center shadow-lg">
                                                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Hidden file input */}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
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
                                                className={`w-full px-4 py-3 rounded-lg border ${fieldErrors.first_name ? 'border-red-500' : isEditing ? 'border-teal-300 focus:ring-2 focus:ring-teal-200 focus:border-teal-400' : 'border-gray-200 bg-gray-50'} transition-all duration-200`}
                                            />
                                            {fieldErrors.first_name && (
                                                <p className="mt-1 text-sm text-red-600">{fieldErrors.first_name[0]}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3 rounded-lg border ${fieldErrors.last_name ? 'border-red-500' : isEditing ? 'border-teal-300 focus:ring-2 focus:ring-teal-200 focus:border-teal-400' : 'border-gray-200 bg-gray-50'} transition-all duration-200`}
                                            />
                                            {fieldErrors.last_name && (
                                                <p className="mt-1 text-sm text-red-600">{fieldErrors.last_name[0]}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3 rounded-lg border ${fieldErrors.location ? 'border-red-500' : isEditing ? 'border-teal-300 focus:ring-2 focus:ring-teal-200 focus:border-teal-400' : 'border-gray-200 bg-gray-50'} transition-all duration-200`}
                                            />
                                            {fieldErrors.location && (
                                                <p className="mt-1 text-sm text-red-600">{fieldErrors.location[0]}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                                            <PhoneInputComponent
                                                value={formData.phone}
                                                onChange={handlePhoneChange}
                                                disabled={!isEditing}
                                                error={fieldErrors.phone ? fieldErrors.phone[0] : null}
                                                inputClassName={`transition-all duration-200 ${fieldErrors.phone ? 'border-red-500' : ''}`}
                                                preferredCountries={['us', 'gb', 'ca', 'au']}
                                                enableSearch={true}
                                                searchPlaceholder="Search country..."
                                                autoFormat={true}
                                            />
                                            {fieldErrors.phone && (
                                                <p className="mt-1 text-sm text-red-600">{fieldErrors.phone[0]}</p>
                                            )}
                                        </div>
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
                                        className={`w-full px-4 py-3 rounded-lg border ${fieldErrors.bio ? 'border-red-500' : isEditing ? 'border-teal-300 focus:ring-2 focus:ring-teal-200 focus:border-teal-400' : 'border-gray-200 bg-gray-50'} transition-all duration-200`}
                                    />
                                    {fieldErrors.bio && (
                                        <p className="mt-1 text-sm text-red-600">{fieldErrors.bio[0]}</p>
                                    )}
                                </div>

                                {/* Image Upload Progress and Error */}
                                <div className="col-span-2">
                                    {uploadProgress > 0 && uploadProgress < 100 && (
                                        <div className="mt-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-teal-600 h-2.5 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress} % ` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
                                        </div>
                                    )}

                                    {uploadError && (
                                        <div className="mt-2 text-sm text-red-600">
                                            {uploadError}
                                        </div>
                                    )}

                                    {imagePreview && (
                                        <div className="mt-2 flex items-center space-x-2">
                                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-sm text-gray-600">New profile photo selected</span>
                                            <button
                                                type="button"
                                                className="text-red-500 hover:text-red-700 text-sm"
                                                onClick={() => {
                                                    setImageFile(null);
                                                    setImagePreview('');
                                                    setUploadProgress(0);
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* General Error Message */}
                                {generalError && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-red-800">{generalError}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Save Button */}
                                {isEditing && (
                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={saveLoading}
                                            className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-teal-600 disabled:hover:shadow-none"
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
                            </div> {/* This closes the div started at line 450 or similar */}
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}