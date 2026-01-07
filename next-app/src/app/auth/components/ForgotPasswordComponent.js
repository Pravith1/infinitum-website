'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import '../auth.css';

export default function ForgotPasswordComponent() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.forgotPassword({ email });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page">
                <div className="main-frame">
                    <div className="inner-frame"></div>
                    <div className="side-line-left"></div>
                    <div className="side-line-right"></div>

                    <div className="login-panel">
                        <h2 className="login-title">Check Email</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', textAlign: 'center', marginBottom: '10px' }}>
                            We've sent a reset link to <strong style={{ color: '#fff' }}>{email}</strong>
                        </p>

                        <div className="auth-btn-row" style={{ marginTop: '20px' }}>
                            <button
                                onClick={() => router.push('/auth?type=login')}
                                className="auth-btn"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="main-frame">
                <div className="inner-frame"></div>
                <div className="side-line-left"></div>
                <div className="side-line-right"></div>

                <div className="login-panel">
                    <h2 className="login-title">Forgot Password</h2>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                            />
                        </div>

                        <div className="auth-btn-row">
                            <button type="submit" disabled={loading} className="auth-btn">
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </div>
                    </form>

                    <div className="auth-links">
                        <p>
                            Remember your password?{' '}
                            <button
                                onClick={() => router.push('/auth?type=login')}
                                className="auth-link"
                            >
                                Back to Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
