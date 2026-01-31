'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/authService';
import { clearAuthToken } from '@/services/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        try {
            const response = await authService.getProfile();
            setUser(response.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        setUser(response.user);
        return response;
    };

    const googleLogin = async (data) => {
        const response = await authService.loginGoogle(data);
        setUser(response.user);
        return response;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearAuthToken();
            setUser(null);
        }
    };

    const refreshUser = async () => {
        await checkAuth();
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        googleLogin,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
