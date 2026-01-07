'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import '../auth.css';

// College list for India
const colleges = [
    'PSG College of Technology',
    'PSG Institute of Technology and Applied Research',
    'Coimbatore Institute of Technology',
    'Government College of Technology, Coimbatore',
    'Sri Krishna College of Engineering and Technology',
    'Amrita Vishwa Vidyapeetham',
    'Kumaraguru College of Technology',
    'Karpagam College of Engineering',
    'Sri Ramakrishna Engineering College',
    'Dr. N.G.P. Institute of Technology',
    'Bannari Amman Institute of Technology',
    'Kongu Engineering College',
    'SNS College of Technology',
    'Hindusthan College of Engineering and Technology',
    'Anna University',
    'Indian Institute of Technology Madras',
    'National Institute of Technology, Tiruchirappalli',
    'Vellore Institute of Technology',
    'SRM Institute of Science and Technology',
    'Other'
];

export default function RegisterComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const source = searchParams.get('source');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        college: '',
        department: '',
        year: '',
        referral: '',
        accomodation: false,
        discoveryMethod: '',
        source: source || 'email',
        googleId: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedEmail = localStorage.getItem('registration_email');
        const storedGoogleId = localStorage.getItem('registration_googleId');

        if (!storedEmail) {
            router.push('/auth?type=register');
            return;
        }

        setFormData(prev => ({
            ...prev,
            email: storedEmail || '',
            googleId: storedGoogleId || '',
            source: source || 'email'
        }));
    }, [source, router]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.source === 'email' && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const registrationData = {
                email: formData.email,
                name: formData.name,
                phone: formData.phone,
                college: formData.college,
                department: formData.department,
                year: parseInt(formData.year),
                referral: formData.referral,
                accomodation: formData.accomodation,
                discoveryMethod: formData.discoveryMethod,
                source: formData.source
            };

            if (formData.source === 'email') {
                registrationData.password = formData.password;
            } else if (formData.source === 'google') {
                registrationData.googleId = formData.googleId;
            }

            await authService.register(registrationData);

            localStorage.removeItem('registration_email');
            localStorage.removeItem('registration_googleId');

            router.push('/portal/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card register-card">
                <div className="auth-header">
                    <h1>Complete Registration</h1>
                    <p>
                        {formData.source === 'google' ? 'Complete your Google registration' : 'Create your account'}
                    </p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form register-form">
                    {/* Account Information Section */}
                    <div className="form-section">
                        <h3 className="section-title">Account Information</h3>

                        <div className="form-row">
                            <div className="auth-field">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    readOnly
                                    className="readonly-input"
                                />
                            </div>
                        </div>

                        {formData.source === 'email' && (
                            <div className="form-row two-columns">
                                <div className="auth-field">
                                    <label htmlFor="password">Password *</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Min. 6 characters"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="auth-field">
                                    <label htmlFor="confirmPassword">Confirm Password *</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter password"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Personal Information Section */}
                    <div className="form-section">
                        <h3 className="section-title">Personal Information</h3>

                        <div className="form-row two-columns">
                            <div className="auth-field">
                                <label htmlFor="name">Full Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="phone">Phone Number *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="10-digit mobile number"
                                    required
                                    pattern="[0-9]{10}"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Academic Information Section */}
                    <div className="form-section">
                        <h3 className="section-title">Academic Information</h3>

                        <div className="form-row">
                            <div className="auth-field">
                                <label htmlFor="college">College *</label>
                                <select
                                    id="college"
                                    name="college"
                                    value={formData.college}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select your college</option>
                                    {colleges.map((college, index) => (
                                        <option key={index} value={college}>
                                            {college}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row two-columns">
                            <div className="auth-field">
                                <label htmlFor="department">Department *</label>
                                <input
                                    type="text"
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="e.g., Computer Science"
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="year">Year *</label>
                                <select
                                    id="year"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select year</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information Section */}
                    <div className="form-section">
                        <h3 className="section-title">Additional Information</h3>

                        <div className="form-row two-columns">
                            <div className="auth-field">
                                <label htmlFor="referral">Referral Code</label>
                                <input
                                    type="text"
                                    id="referral"
                                    name="referral"
                                    value={formData.referral}
                                    onChange={handleChange}
                                    placeholder="Optional"
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="discoveryMethod">How did you hear about us?</label>
                                <select
                                    id="discoveryMethod"
                                    name="discoveryMethod"
                                    value={formData.discoveryMethod}
                                    onChange={handleChange}
                                >
                                    <option value="">Select an option</option>
                                    <option value="social_media">Social Media</option>
                                    <option value="friends">Friends/Word of mouth</option>
                                    <option value="posters">Posters/Flyers</option>
                                    <option value="college_announcement">College Announcement</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="auth-checkbox-field">
                                <input
                                    type="checkbox"
                                    id="accomodation"
                                    name="accomodation"
                                    checked={formData.accomodation}
                                    onChange={(e) => setFormData(prev => ({ ...prev, accomodation: e.target.checked }))}
                                />
                                <label htmlFor="accomodation">I need accommodation during the event</label>
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="auth-btn">
                        {loading ? 'Registering...' : 'Complete Registration'}
                    </button>
                </form>

                <div className="auth-links">
                    <p>
                        Already have an account?{' '}
                        <button
                            onClick={() => router.push('/auth?type=login')}
                            className="auth-link"
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
