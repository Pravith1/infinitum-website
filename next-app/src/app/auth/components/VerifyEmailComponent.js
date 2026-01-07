'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import '../auth.css';

export default function VerifyEmailComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setError('Invalid verification link');
                setLoading(false);
                return;
            }

            try {
                const response = await authService.verifyEmail(token);

                if (response.email) {
                    localStorage.setItem('registration_email', response.email);
                }

                setSuccess(true);
                setLoading(false);

                setTimeout(() => {
                    router.push('/auth?type=complete-registration&source=email');
                }, 2000);
            } catch (err) {
                console.error('Verification error:', err);
                setError(err.response?.data?.message || 'Email verification failed');
                setLoading(false);
            }
        };

        verifyEmail();
    }, [searchParams, router]);

    if (loading) {
        return (
            <div className="auth-page">
                <div className="main-frame">
                    <div className="inner-frame"></div>
                    <div className="side-line-left"></div>
                    <div className="side-line-right"></div>

                    <div className="login-panel">
                        <h2 className="login-title">Verifying</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', textAlign: 'center' }}>
                            Please wait...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="auth-page">
                <div className="main-frame">
                    <div className="inner-frame"></div>
                    <div className="side-line-left"></div>
                    <div className="side-line-right"></div>

                    <div className="login-panel">
                        <h2 className="login-title">Failed</h2>
                        <p style={{ color: '#fca5a5', fontSize: '12px', textAlign: 'center', marginBottom: '20px' }}>
                            {error}
                        </p>

                        <div className="auth-btn-row">
                            <button
                                onClick={() => router.push('/auth?type=send-email')}
                                className="auth-btn"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="auth-page">
                <div className="main-frame">
                    <div className="inner-frame"></div>
                    <div className="side-line-left"></div>
                    <div className="side-line-right"></div>

                    <div className="login-panel">
                        <h2 className="login-title">Verified!</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', textAlign: 'center' }}>
                            Redirecting...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
