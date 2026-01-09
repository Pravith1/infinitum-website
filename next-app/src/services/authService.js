import api from './api';

// API Functions
export const authService = {
    // Send email verification
    sendVerificationEmail: async (data) => {
        const response = await api.post('/api/auth/user/verify-email', data);
        return response.data;
    },

    // Verify email with token
    verifyEmail: async (token) => {
        const response = await api.get(`/api/auth/user/verify-email/${token}`);
        return response.data;
    },

    // Register user
    register: async (data) => {
        const response = await api.post('/api/auth/user/register', data);
        return response.data;
    },

    // Login user
    login: async (data) => {
        const response = await api.post('/api/auth/user/login', data);
        return response.data;
    },

    // Logout user
    logout: async () => {
        const response = await api.post('/api/auth/user/logout');
        return response.data;
    },

    // Get user profile
    getProfile: async () => {
        const response = await api.get('/api/auth/user/profile');
        return response.data;
    },

    // Update user profile
    updateProfile: async (data) => {
        const response = await api.put('/api/auth/user/profile', data);
        return response.data;
    },

    // Forgot password
    forgotPassword: async (data) => {
        const response = await api.post('/api/auth/user/forgot-password', data);
        return response.data;
    },

    // Reset password
    resetPassword: async (data) => {
        const response = await api.post('/api/auth/user/reset-password', data);
        return response.data;
    },

    // Google login
    loginGoogle: async (data) => {
        const response = await api.post('/api/auth/user/login-google', data);
        return response.data;
    },

    // Pre-registration - Send verification code to email
    sendPreRegistrationCode: async (email) => {
        const response = await api.post('/inf/api/events/preregister', { email });
        return response.data;
    },

    // Pre-registration - Verify the code and complete pre-registration
    verifyPreRegistration: async (email, verificationCode) => {
        const response = await api.post('/inf/api/events/preregister/verify', { email, verificationCode });
        return response.data;
    },

    // Pre-registration - Check status
    checkPreRegistration: async (email) => {
        const response = await api.get(`/inf/api/events/preregister/check?email=${encodeURIComponent(email)}`);
        return response.data;
    },

    // Pre-registration - Resend verification code
    resendPreRegistrationCode: async (email) => {
        const response = await api.post('/inf/api/events/preregister/resend', { email });
        return response.data;
    },
};
