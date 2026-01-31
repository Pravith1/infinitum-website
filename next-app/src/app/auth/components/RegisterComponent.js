'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import '../auth.css';
import colleges from '@/app/CollegeList';

// PSG Colleges that require specific email domains
const PSG_COLLEGES = {
    'PSG College of Technology (Autonomous), Peelamedu, Coimbatore District 641004': '@psgtech.ac.in',
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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showInstructionsOverlay, setShowInstructionsOverlay] = useState(false);
    const [instructionsAgreed, setInstructionsAgreed] = useState(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem('registration_email');
        const storedGoogleId = localStorage.getItem('registration_googleId');
        const storedReferralCode = localStorage.getItem('club_referral_code');

        if (!storedEmail) {
            router.push('/auth?type=register');
            return;
        }

        setFormData(prev => ({
            ...prev,
            email: storedEmail || '',
            googleId: storedGoogleId || '',
            source: source || 'email',
            // Pre-fill referral field if exists in localStorage
            referral: storedReferralCode || prev.referral
        }));
    }, [source, router]);

    // Check if email is from a PSG college
    const isPSGEmail = () => {
        const emailLower = formData.email.toLowerCase();
        return Object.values(PSG_COLLEGES).some(domain => emailLower.endsWith(domain));
    };

    // Auto-select college based on email domain
    useEffect(() => {
        if (!formData.email) return;

        const emailLower = formData.email.toLowerCase();

        // Find matching college based on email domain
        for (const [collegeName, emailDomain] of Object.entries(PSG_COLLEGES)) {
            if (emailLower.endsWith(emailDomain)) {
                setFormData(prev => ({
                    ...prev,
                    college: collegeName
                }));
                break;
            }
        }
    }, [formData.email]);

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

        // Open instructions overlay instead of submitting directly
        setShowInstructionsOverlay(true);
    };

    const finalizeRegistration = async () => {
        setLoading(true);

        try {
            // Check localStorage for referral code (invisible referral tracking)
            const storedReferralCode = localStorage.getItem('club_referral_code');

            const registrationData = {
                email: formData.email,
                name: formData.name,
                phone: formData.phone,
                college: formData.college,
                department: formData.department,
                year: parseInt(formData.year),
                // Use stored referral code if form field is empty
                referral: formData.referral || storedReferralCode || '',
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

            // Clean up localStorage after successful registration
            localStorage.removeItem('registration_email');
            localStorage.removeItem('registration_googleId');
            localStorage.removeItem('club_referral_code');

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
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Min. 6 characters"
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                    <line x1="1" y1="1" x2="23" y2="23" />
                                                </svg>
                                            ) : (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="auth-field">
                                    <label htmlFor="confirmPassword">Confirm Password *</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Re-enter password"
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                    <line x1="1" y1="1" x2="23" y2="23" />
                                                </svg>
                                            ) : (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
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
                                    disabled={isPSGEmail()}
                                    className={isPSGEmail() ? 'readonly-input' : ''}
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
                                    list="department-options"
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="Select or type your department"
                                    required
                                    autoComplete="off"
                                />
                                <datalist id="department-options">
                                    <option value="Automobile Engineering" />
                                    <option value="Biomedical Engineering" />
                                    <option value="Civil Engineering" />
                                    <option value="Computer Science and Engineering" />
                                    <option value="Computer Science and Engineering (AI and ML)" />
                                    <option value="Electrical and Electronics Engineering" />
                                    <option value="Electronics and Communication Engineering" />
                                    <option value="Instrumentation and Control Engineering" />
                                    <option value="Mechanical Engineering" />
                                    <option value="Metallurgical Engineering" />
                                    <option value="Production Engineering" />
                                    <option value="Robotics and Automation" />
                                    <option value="Bio Technology" />
                                    <option value="Fashion Technology" />
                                    <option value="Information Technology" />
                                    <option value="Textile Technology" />
                                </datalist>
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
                                    readOnly={!!localStorage.getItem('club_referral_code')}
                                    className={localStorage.getItem('club_referral_code') ? 'readonly-input' : ''}
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

            {/* Instructions Overlay */}
            {showInstructionsOverlay && (
                <div className="psg-email-overlay">
                    <div className="psg-email-overlay-content" style={{ maxWidth: '500px' }}>
                        <div className="psg-email-overlay-icon" style={{ color: '#fae127', borderColor: '#fae127' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                        </div>
                        <h2>Important Instructions</h2>
                        <div style={{ textAlign: 'left', margin: '20px 0', fontSize: '0.9rem', color: '#ccc', lineHeight: '1.6' }}>
                            <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                                <li style={{ marginBottom: '10px' }}>Bring a <strong>Bonafide Certificate</strong> from your respective college.</li>
                                <li style={{ marginBottom: '10px' }}>Upload your <strong>College ID card</strong> on the portal and carry the same ID during the event.</li>
                                <li style={{ marginBottom: '10px' }}>A participant can attend only <strong>one workshop</strong> – Fee: ₹350.</li>
                                <li style={{ marginBottom: '10px' }}>By paying <strong>₹150</strong>, a participant can attend any number of events / paper presentations.</li>
                                <li style={{ marginBottom: '10px' }}><strong>Accommodation</strong> will be provided on an FCFS basis for the first 100 students only.</li>
                            </ul>
                        </div>

                        <div className="auth-checkbox-field" style={{ justifyContent: 'center', marginBottom: '20px' }}>
                            <input
                                type="checkbox"
                                id="agreeInstructions"
                                checked={instructionsAgreed}
                                onChange={(e) => setInstructionsAgreed(e.target.checked)}
                                style={{ width: 'auto', marginRight: '10px' }}
                            />
                            <label htmlFor="agreeInstructions" style={{ fontSize: '0.9rem' }}>I have read and understood the instructions</label>
                        </div>

                        <button
                            className="auth-btn psg-overlay-btn"
                            onClick={() => {
                                if (instructionsAgreed) {
                                    finalizeRegistration();
                                } else {
                                    alert('Please agree to the instructions to proceed.');
                                }
                            }}
                            disabled={!instructionsAgreed || loading}
                            style={{ opacity: instructionsAgreed ? 1 : 0.5, cursor: instructionsAgreed ? 'pointer' : 'not-allowed' }}
                        >
                            {loading ? 'Processing...' : 'Confirm & Register'}
                        </button>
                        <button
                            className="auth-link psg-overlay-close"
                            onClick={() => setShowInstructionsOverlay(false)}
                            disabled={loading}
                        >
                            Review Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
