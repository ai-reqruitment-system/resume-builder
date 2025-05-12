import { useState, useEffect } from 'react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SweetAlert from '@/utils/sweetAlert';
import InputWithIcon from '@/components/InputWithIcon';


const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (error) {
            SweetAlert.error('Error', error);
            // Clear error after showing alert
            setError('');
        }
        if (success) {
            SweetAlert.success('Success', success);
            // Clear success after showing alert
            setSuccess('');
        }
    }, [error, success]);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to send OTP');

            setSuccess('OTP sent successfully!');
            sessionStorage.setItem('verifyEmail', email);
            router.push('/verify-otp');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-full max-w-md px-4 py-6 sm:px-6 lg:px-8">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-base text-gray-600">
                            Login with your email address to continue
                        </p>
                    </div>

                    {/* Alert Messages removed - now using SweetAlert2 */}

                    <form onSubmit={handleSendOTP} className="space-y-5">
                        <InputWithIcon
                            label="Email Address"
                            icon={Mail}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required={true}
                            error={email && !validateEmail(email) ? "Please enter a valid email address" : null}
                        />

                        <button
                            type="submit"
                            disabled={loading || !validateEmail(email)}
                            className="w-full py-2.5 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                    flex items-center justify-center space-x-2 shadow-sm hover:shadow transform hover:translate-y-[-1px]"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <span>Continue</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-gray-600">
                        By continuing, you agree to our{' '}
                        <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </Layout >
    );
};

export default LoginPage;