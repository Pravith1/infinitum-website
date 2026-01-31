'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import '../auth.css';

export default function CallbackComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { googleLogin } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const email = searchParams.get('email');
                const googleId = searchParams.get('googleId');
                const existingUser = searchParams.get('existing_user') === 'true';
                const source = searchParams.get('source');

                if (!email || !googleId) {
                    setError('Invalid callback parameters');
                    setLoading(false);
                    return;
                }

                if (existingUser && source === 'email') {
                    setError('This email is already registered with email/password. Please login with your email and password instead.');
                    setLoading(false);
                    setTimeout(() => {
                        router.push('/auth?type=login');
                    }, 10000);
                    return;
                }

                if (existingUser) {
                    await googleLogin({ email, googleId, existing_user: true });
                    router.push('/portal/profile');
                } else {
                    localStorage.setItem('registration_email', email);
                    localStorage.setItem('registration_googleId', googleId);
                    router.push('/auth?type=complete-registration&source=google');
                }
            } catch (err) {
                console.error('Callback error:', err);
                setError(err.response?.data?.message || 'Authentication failed');
                setLoading(false);
            }
        };

        handleCallback();
    }, [searchParams, router]);

    if (error) {
        return (
            <div className="auth-page">
                <div className="main-frame">
                    {/* Inner Frame Border */}
                    <div className="inner-frame"></div>

                    {/* Side Vertical Lines */}
                    <div className="side-line-left"></div>
                    <div className="side-line-right"></div>

                    {/* Content Panel */}
                    <div className="login-panel">
                        <div className="auth-icon-error">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="login-title">Authentication Error</h2>
                        <p className="auth-error-text">{error}</p>
                        <button
                            onClick={() => router.push('/auth?type=login')}
                            className="auth-btn"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="main-frame">
                {/* Inner Frame Border */}
                <div className="inner-frame"></div>

                {/* Side Vertical Lines */}
                <div className="side-line-left"></div>
                <div className="side-line-right"></div>

                {/* Content Panel */}
                <div className="login-panel">
                    <div className="auth-icon-loading">
                        <div className="auth-spinner"></div>
                    </div>
                    <h2 className="login-title">Processing</h2>
                    <p className="auth-loading-text">Please wait while we complete your Google sign-in...</p>
                </div>
            </div>
        </div>
    );
}
