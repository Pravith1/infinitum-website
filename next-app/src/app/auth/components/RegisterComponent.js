'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import '../auth.css';
import colleges from '@/app/CollegeList';

// PSG Colleges that require specific email domains
const PSG_COLLEGES = {
    'PSG College of Technology (Autonomous), Peelamedu, Coimbatore District 641004': '@psgtech.ac.in',
    'PSG Institute of Advanced Studies, Peelamedu, Coimbatore District 641004': '@psgias.ac.in',
    'PSG Institute of Technology and Applied Research, Avinashi Road, Neelambur, Coimbatore 641062': '@psgitech.ac.in'
};

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
    const [showEmailOverlay, setShowEmailOverlay] = useState(false);

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

    // Check if the selected college is a PSG college and validate email domain
    const validatePSGEmail = () => {
        const selectedCollege = formData.college;
        const email = formData.email.toLowerCase();

        if (PSG_COLLEGES[selectedCollege]) {
            const requiredDomain = PSG_COLLEGES[selectedCollege];
            return email.endsWith(requiredDomain);
        }
        return true; // Not a PSG college, no domain restriction
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        // Reset overlay when college changes
        if (e.target.name === 'college') {
            setShowEmailOverlay(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Check PSG college email validation
        if (!validatePSGEmail()) {
            setShowEmailOverlay(true);
            return;
        }

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

                        {/* <div className="form-row">
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
                        </div> */}
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

            {/* PSG College Email Validation Overlay */}
            {showEmailOverlay && (
                <div className="psg-email-overlay">
                    <div className="psg-email-overlay-content">
                        <div className="psg-email-overlay-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <h2>College Email Required</h2>
                        <p>
                            To register as a student of <strong>{formData.college}</strong>,
                            please use your official college email address ending with
                            <span className="psg-email-domain">{PSG_COLLEGES[formData.college]}</span>
                        </p>
                        <button
                            className="auth-btn psg-overlay-btn"
                            onClick={() => {
                                localStorage.removeItem('registration_email');
                                localStorage.removeItem('registration_googleId');
                                router.push('/auth?type=register');
                            }}
                        >
                            Register with College Email
                        </button>
                        <button
                            className="auth-link psg-overlay-close"
                            onClick={() => setShowEmailOverlay(false)}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
