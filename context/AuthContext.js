import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Wait for router to be ready
        if (!router.isReady) return;

        // const token = router.query.token
        //eyJjdXN0b21lcl9pZCI6NywidHlwZSI6ImVkaXQiLCJ0ZW1wbGF0ZV9pZCI6bnVsbH0=

        const handleAuth = async () => {
            // If no token in URL, check localStorage
            const storedToken = localStorage.getItem('token')
            if (!storedToken) {
                // No token anywhere - redirect to main site
                router.push('/login')
            } else {
                // Has stored token - stay on current page
                const storedUser = JSON.parse(localStorage.getItem('userData'))
                setUser(storedUser)
            }
            setLoading(false)
            return;

            // We have a token in URL - fetch user details
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get-customer-details`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                })

                const data = await response.json()

                if (data.data) {
                    setUser(data.data)
                    localStorage.setItem('token', data.data.token)
                    localStorage.setItem('userData', JSON.stringify(data.data))
                    localStorage.removeItem('profileData')
                    router.push('/builder?templateId=modern') // Redirect to home after successful auth
                }
            } catch (error) {
                console.error('Auth error:', error)
                router.push('/unauthorized')
            } finally {
                setLoading(false)
            }
        }

        handleAuth()
    }, [router.isReady]) // Only run when router is ready

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)