import React, { useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!loading && user) {
            const template = router.query.templateId || 'modern';
            router.replace({
                pathname: '/dashboard',
               query: { templateId: template }
            });
        }
    }, [loading, user, router]);
    if (loading) return <LoadingScreen />;
    return <div></div>;
}