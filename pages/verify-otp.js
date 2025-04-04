import { useState, useEffect } from 'react';
import { Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import Link from 'next/link';

const VerifyOtpPage = () => {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [timer, setTimer] = useState(60);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('verifyEmail');
        if (!storedEmail) {
            router.replace('/login');
        } else {
            setEmail(storedEmail);
        }
    }, [router]);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

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

    const handleResendOTP = async () => {
        if (timer > 0) return;

        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to resend OTP');

            setSuccess('OTP resent successfully!');
            setTimer(60);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to verify OTP');

            if (data.is_registered && data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                localStorage.removeItem('profileData');
                router.push('/dashboard');
            } else {
                sessionStorage.setItem('registerEmail', email);
                router.push('/complete-profile');
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
                        href="/login"
                        className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 transform transition-transform group-hover:-translate-x-1" />
                        Back to Login
                    </Link>

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            Verify OTP
                        </h1>
                        <p className="text-lg text-gray-600">
                            Enter the OTP sent to <span className="font-medium">{email}</span>
                        </p>
                    </div>

                    {/* Alert Messages */}
                    <div className={`transition-all duration-300 ease-in-out mb-6 ${
                        showAlert ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                    }`}>
                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle className="flex items-center">
                                    <span className="mr-2">⚠️</span> Error
                                </AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {success && (
                            <Alert className="bg-green-50 text-green-700 border-green-200">
                                <AlertTitle className="flex items-center">
                                    <span className="mr-2">✅</span> Success
                                </AlertTitle>
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <div>
                            <div className="w-full">
                                <label className="block text-gray-600 mb-2 text-md">
                                    Enter verification code
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 6) setOtp(value);
                                    }}
                                    className="w-full px-4 py-3.5 text-center text-2xl tracking-[1em] border rounded-lg
                                    outline-none transition-colors hover:border-blue-400 focus:border-blue-500
                                    text-gray-900"
                                    placeholder="······"
                                    maxLength="6"
                                    required
                                />
                            </div>

                            <div className="mt-4 text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={timer > 0 || loading}
                                    className="text-blue-500 hover:text-blue-600 text-sm disabled:text-gray-400"
                                >
                                    {timer > 0 ? (
                                        <span>Resend OTP in {timer}s</span>
                                    ) : 'Resend OTP'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="w-full py-3.5 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                            flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Verify OTP</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Didn't receive the code?{' '}
                        <button
                            onClick={() => router.push('/login')}
                            className="text-blue-500 hover:underline"
                        >
                            Change email address
                        </button>
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default VerifyOtpPage;