import { useState, useEffect } from 'react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import InputWithIcon from '@/components/InputWithIcon';
import AlertMessage from '@/components/ui/AlertMessage';

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showAlert, setShowAlert] = useState(false);

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
                <div className="w-full max-w-md px-4 py-8 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            Welcome Back
                        </h1>
                        <p className="text-lg text-gray-600">
                            Login with your email address to continue
                        </p>
                    </div>

                    {/* Alert Messages */}
                    <AlertMessage error={error} success={success} showAlert={showAlert} />

                    <form onSubmit={handleSendOTP} className="space-y-6">
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
                            className="w-full py-3.5 px-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600
                                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                    flex items-center justify-center space-x-2 shadow-sm hover:shadow transform hover:translate-y-[-1px]"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Continue</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        By continuing, you agree to our{' '}
                        <a href="#" className="text-teal-500 hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-teal-500 hover:underline">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </Layout >
    );
};

export default LoginPage;