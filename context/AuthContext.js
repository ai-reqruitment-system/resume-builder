import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { setUser } from '@/store/slices/authSlice'
import { useDispatch } from 'react-redux'
import { setGlobalLoading } from '@/store/slices/uiSlice'

const AuthContext = createContext()

export const updateUserProfile = async (formData) => {
    console.log(formData, "from the update user profile api ");
    console.log("hello for testing purpose")
    let fetchOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('token'))
        },
        body: formData
    };
    // If not FormData, send as JSON
    if (!(formData instanceof FormData)) {
        fetchOptions.headers['Content-Type'] = 'application/json';
        fetchOptions.body = JSON.stringify(formData);
    }
    try {
        const response = await fetch(`https://admin.resuming.io/api/auth/complete-profile`, fetchOptions);
        const data = await response.json();
        console.log(data, "from the update user profile api ");

        // Check if the response contains an error message
        if (data.success === false) {
            // Return the error response to handle validation errors
            console.log("Error in updating the profile:", data.message);
            return data;
        } else if (data.token) {
            // Store updated user data in localStorage
            localStorage.setItem('userData', JSON.stringify(data.data));
            return data.data;
        } else {
            console.log("Error in updating the profile");
            return { success: false, message: "An unexpected error occurred" };
        }
    } catch (error) {
        console.error("API call error:", error);
        return { success: false, message: "An error occurred while updating your profile" };
    }
}

export const updateProfileImage = async (imageFile) => {
    if (!imageFile) {
        return { success: false, message: "No image file provided" };
    }

    const formData = new FormData();
    formData.append('profile_photo_url', imageFile);

    try {
        const response = await fetch('https://admin.resuming.io/api/profile/image/update', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token'))
            },
            body: formData
        });

        const data = await response.json();
        console.log(data, "from the update profile image api");

        if (data.success === false) {
            console.log("Error in updating the profile image:", data.message);
            return data;
        } else {
            // If the API returns updated user data, update localStorage
            if (data.data) {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                userData.profile_photo_url = data.data.profile_photo_url || userData.profile_photo_url;
                localStorage.setItem('userData', JSON.stringify(userData));
            }
            return data;
        }
    } catch (error) {
        console.error("API call error:", error);
        return { success: false, message: "An error occurred while updating your profile image" };
    }
}

export const fetchUserDetail = async () => {
    const res = await fetch('https://admin.resuming.io/api/get-customer-details', {
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('token'))
        },
    })
    const data = await res.json();
    if (res.ok) {
        // Store user data in localStorage for persistence
        localStorage.setItem('userData', JSON.stringify(data.data));
        return data.data // Return the user object
    } else {
        console.log("Error in fetching the user detail ")
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const dispatch = useDispatch()

    // Wrapper for updateUserProfile to update local state
    const handleUpdateUserProfile = async (formData) => {
        try {
            dispatch(setGlobalLoading({ isLoading: true, loadingMessage: 'Updating profile...' }))
            const result = await updateUserProfile(formData)

            // Check if the result is an error response
            if (result && result.success === false) {
                // Return the error response to be handled by the component
                console.log('Error response from API:', result)
                return result
            }

            // If it's a successful response with user data
            if (result) {
                setUser(result)
            }
            return result
        } catch (error) {
            console.error('Error updating profile:', error)
            return { success: false, message: 'An unexpected error occurred' }
        } finally {
            dispatch(setGlobalLoading({ isLoading: false }))
        }
    }

    // Wrapper for updateProfileImage to update local state
    const handleUpdateProfileImage = async (imageFile) => {
        try {
            dispatch(setGlobalLoading({ isLoading: true, loadingMessage: 'Updating profile image...' }))
            const result = await updateProfileImage(imageFile)

            // Check if the result is an error response
            if (result && result.success === false) {
                console.log('Error response from API:', result)
                return result
            }

            // If it's a successful response, update the user state with the new image URL
            if (result && result.data && result.data.profile_photo_url) {
                setUser(prev => ({
                    ...prev,
                    profile_photo_url: result.data.profile_photo_url
                }))
            }
            return result
        } catch (error) {
            console.error('Error updating profile image:', error)
            return { success: false, message: 'An unexpected error occurred' }
        } finally {
            dispatch(setGlobalLoading({ isLoading: false }))
        }
    }



    useEffect(() => {
        // Wait for router to be ready
        if (!router.isReady) return;

        // const token = router.query.token
        //eyJjdXN0b21lcl9pZCI6NywidHlwZSI6ImVkaXQiLCJ0ZW1wbGF0ZV9pZCI6bnVsbH0=

        const handleAuth = async () => {
            try {
                dispatch(setGlobalLoading({ isLoading: true, loadingMessage: 'Authenticating...' }))
                // If no token in URL, check localStorage
                const storedToken = localStorage.getItem('token')
                if (!storedToken) {
                    // No token anywhere - redirect to main site
                    router.push('/login')
                } else {
                    // Has stored token - stay on current page
                    const storedUser = JSON.parse(localStorage.getItem('userData') || '{}')

                    setUser(storedUser)

                    // Fetch the latest user data from API
                    try {
                        const userData = await fetchUserDetail()
                        if (userData) {
                            console.log('User data fetched successfully:', userData)
                            // Update the user state with the latest data from API
                            setUser(userData)
                        }
                    } catch (error) {
                        console.error('Error fetching user data:', error)
                    }
                }
            } catch (error) {
                console.error('Authentication error:', error)
            } finally {
                setLoading(false)
                dispatch(setGlobalLoading({ isLoading: false }))
            }
        }



        handleAuth()
    }, [router.isReady]) // Only run when router is ready



    return (
        <AuthContext.Provider value={{
            user,
            loading,
            updateUserProfile: handleUpdateUserProfile,
            updateProfileImage: handleUpdateProfileImage,
            fetchUserDetail
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)