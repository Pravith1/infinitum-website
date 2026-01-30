import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const NODE_ENV = process.env.NEXT_PUBLIC_NODE_ENV || 'production';
const isDevelopment = NODE_ENV === 'development';

// Token storage for development mode
let authToken = null;

// Function to set the auth token (used after login in development mode)
export const setAuthToken = (token) => {
    authToken = token;
    if (token) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', token);
        }
    } else {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
        }
    }
};

// Function to get the auth token
export const getAuthToken = () => {
    if (authToken) return authToken;
    if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            authToken = storedToken;
            return storedToken;
        }
    }
    return null;
};

// Function to clear the auth token (used on logout)
export const clearAuthToken = () => {
    authToken = null;
    if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
    }
};

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: !isDevelopment,
    timeout: 12000,
});

// Request interceptor to add auth tokens
api.interceptors.request.use(
    (config) => {
        if (isDevelopment) {
            const token = getAuthToken();
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling tokens and errors
api.interceptors.response.use(
    (response) => {
        if (isDevelopment) {
            const token = response.data?.accessToken;
            if (token) {
                setAuthToken(token);
            }
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401 && isDevelopment) {
            clearAuthToken();
        }
        return Promise.reject(error);
    }
);

export default api;
