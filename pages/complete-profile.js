import { useState, useEffect } from 'react';
import { UserCircle2, Mail, Phone, Loader2, ArrowLeft } from 'lucide-react';
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
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
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
        if (!formData.name.trim()) {
            setError('Name is required');
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/complete-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to complete profile');

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                localStorage.removeItem('profileData');
                router.push('/dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-full max-w-md px-4 py-8 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <Link
                        href="/verify-otp"
                        className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 transform transition-transform group-hover:-translate-x-1" />
                        Back to Verification
                    </Link>

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            Complete Profile
                        </h1>
                        <p className="text-lg text-gray-600">
                            Please provide your details to continue
                        </p>
                    </div>

                    {/* Alert Messages */}
                    <AlertMessage error={error} success={success} showAlert={showAlert} />

                    <form onSubmit={handleCompleteProfile} className="space-y-6">
                        {/* Email Address (Disabled) */}
                        <InputWithIcon
                            label="Email Address"
                            icon={Mail}
                            type="email"
                            value={formData.email}
                            disabled={true}
                        />

                        {/* Full Name */}
                        <InputWithIcon
                            label="Full Name"
                            icon={UserCircle2}
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                name: e.target.value
                            }))}
                            placeholder="Enter your full name"
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !formData.name || (formData.phone && !validatePhone(formData.phone))}
                            className="w-full py-3.5 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                            flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span>Complete Registration</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default CompleteProfilePage;