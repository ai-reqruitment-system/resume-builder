import { useEffect } from "react";
import { useRouter } from "next/router"


export default function Logout_api() {
    const router = useRouter();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('profileData');
        window.location.href = "https://interview.resuming.io/";
    };
    useEffect(() => {
        handleLogout();

    }, [])
}