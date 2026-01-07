'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import '../auth.css';

export default function SendEmailComponent() {
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
            await authService.sendVerificationEmail({ email });
            localStorage.setItem('registration_email', email);
            setSuccess(true);
            setTimeout(() => {
                router.push('/auth?type=login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send verification email');
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
                            We've sent a verification link to <strong style={{ color: '#fff' }}>{email}</strong>
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textAlign: 'center' }}>
                            Redirecting to login...
                        </p>
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
                    <h2 className="login-title">Verify Email</h2>

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
                                {loading ? 'Sending...' : 'Send Verification'}
                            </button>
                        </div>
                    </form>

                    <div className="auth-links">
                        <p>
                            <button
                                onClick={() => router.push('/auth?type=register')}
                                className="auth-link"
                            >
                                ← Back to registration
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
