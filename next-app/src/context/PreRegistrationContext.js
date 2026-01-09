'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService } from '@/services/authService';

const PreRegistrationContext = createContext(undefined);

// Steps in the pre-registration flow
export const PRE_REG_STEPS = {
    EMAIL: 'email',
    VERIFY: 'verify',
    SUCCESS: 'success',
};

export function PreRegistrationProvider({ children }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(PRE_REG_STEPS.EMAIL);
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);

    // Cooldown timer effect
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const openModal = useCallback(() => {
        setIsModalOpen(true);
        setCurrentStep(PRE_REG_STEPS.EMAIL);
        setEmail('');
        setVerificationCode('');
        setError('');
        setResendCooldown(0);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setCurrentStep(PRE_REG_STEPS.EMAIL);
        setEmail('');
        setVerificationCode('');
        setError('');
        setIsLoading(false);
        setResendCooldown(0);
    }, []);

    const sendVerificationCode = useCallback(async (emailInput) => {
        setIsLoading(true);
        setError('');
        try {
            await authService.sendPreRegistrationCode(emailInput);
            setEmail(emailInput);
            setCurrentStep(PRE_REG_STEPS.VERIFY);
            setResendCooldown(120); // Start cooldown after sending code
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send verification code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const verifyCode = useCallback(async (code) => {
        setIsLoading(true);
        setError('');
        try {
            await authService.verifyPreRegistration(email, code);
            setVerificationCode(code);
            setCurrentStep(PRE_REG_STEPS.SUCCESS);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [email]);

    const resendCode = useCallback(async () => {
        if (resendCooldown > 0 || !email || isLoading) return;

        setIsLoading(true);
        setError('');
        try {
            await authService.resendPreRegistrationCode(email);
            setResendCooldown(120); // Reset cooldown after resend
            setError(''); // Clear any previous errors
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [email, resendCooldown, isLoading]);

    const resetFlow = useCallback(() => {
        setCurrentStep(PRE_REG_STEPS.EMAIL);
        setEmail('');
        setVerificationCode('');
        setError('');
        setResendCooldown(0);
    }, []);

    const value = {
        isModalOpen,
        currentStep,
        email,
        verificationCode,
        isLoading,
        error,
        resendCooldown,
        openModal,
        closeModal,
        sendVerificationCode,
        verifyCode,
        resendCode,
        resetFlow,
        setError,
    };

    return (
        <PreRegistrationContext.Provider value={value}>
            {children}
        </PreRegistrationContext.Provider>
    );
}

export function usePreRegistration() {
    const context = useContext(PreRegistrationContext);
    if (context === undefined) {
        throw new Error('usePreRegistration must be used within a PreRegistrationProvider');
    }
    return context;
}
