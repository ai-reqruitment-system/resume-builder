import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { setUser } from '@/store/slices/authSlice'
import { useDispatch } from 'react-redux'
import { setGlobalLoading } from '@/store/slices/uiSlice'

const AuthContext = createContext()

export const updateUserProfile = async (formData) => {
    console.log(formData, "from the update user profile api ")
    const response = await fetch(`https://admin.resuming.io/api/profile/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + (localStorage.getItem('token'))
        },
        body: JSON.stringify(formData),
    });
    const data = await response.json();
    console.log(data, "from the update user profile api ")
    if (data.token) {
        // Store updated user data in localStorage
        localStorage.setItem('userData', JSON.stringify(data.data));
        return data.data;
    } else {
        console.log("Error in updating the profile")
        return null;
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
            const updatedUser = await updateUserProfile(formData)
            if (updatedUser) {
                setUser(updatedUser)
            }
            return updatedUser
        } catch (error) {
            console.error('Error updating profile:', error)
            return null
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
        <AuthContext.Provider value={{ user, loading, updateUserProfile: handleUpdateUserProfile, fetchUserDetail }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)