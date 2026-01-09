'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePreRegistration, PRE_REG_STEPS } from '@/context/PreRegistrationContext';
import { useSound } from '@/context/SoundContext';
import { preRegistrationConfig } from '@/settings/featureFlags';
import styles from './PreRegistrationModal.module.css';

export default function PreRegistrationModal() {
    const {
        isModalOpen,
        currentStep,
        email,
        isLoading,
        error,
        resendCooldown,
        closeModal,
        sendVerificationCode,
        verifyCode,
        resendCode,
        resetFlow,
        setError,
    } = usePreRegistration();

    const { isMuted } = useSound();
    const [emailInput, setEmailInput] = useState('');
    const [codeInput, setCodeInput] = useState('');
    const modalRef = useRef(null);

    // Audio refs
    const clickSoundRef = useRef(null);
    const expandSoundRef = useRef(null);

    // Initialize audio
    useEffect(() => {
        clickSoundRef.current = new Audio('/sounds/click.mp3');
        expandSoundRef.current = new Audio('/sounds/expand.mp3');
        clickSoundRef.current.volume = 0.5;
        expandSoundRef.current.volume = 0.5;
    }, []);

    const playSound = (audioRef) => {
        if (isMuted) return;
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => { });
        }
    };

    // Play expand sound when modal opens
    useEffect(() => {
        if (isModalOpen) {
            playSound(expandSoundRef);
        }
    }, [isModalOpen]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isModalOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isModalOpen) {
                playSound(clickSoundRef);
                closeModal();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isModalOpen, closeModal]);

    // Reset inputs when step changes
    useEffect(() => {
        if (currentStep === PRE_REG_STEPS.EMAIL) {
            setEmailInput('');
            setCodeInput('');
        } else if (currentStep === PRE_REG_STEPS.VERIFY) {
            setCodeInput('');
        }
    }, [currentStep]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            playSound(clickSoundRef);
            closeModal();
        }
    };

    const handleCloseClick = () => {
        playSound(clickSoundRef);
        closeModal();
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        playSound(clickSoundRef);

        if (!emailInput || !emailInput.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }

        await sendVerificationCode(emailInput);
    };

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        playSound(clickSoundRef);

        if (!codeInput || codeInput.length < 4) {
            setError('Please enter a valid verification code.');
            return;
        }

        await verifyCode(codeInput);
    };

    const handleBackToEmail = () => {
        playSound(clickSoundRef);
        resetFlow();
    };

    if (!isModalOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleBackdropClick}>
            <div className={styles.modal} ref={modalRef}>
                {/* Close Button */}
                <button className={styles.closeBtn} onClick={handleCloseClick}>
                    <i className="ri-close-line"></i>
                </button>

                {/* Decorative Elements */}
                <div className={styles.cornerTL}></div>
                <div className={styles.cornerTR}></div>
                <div className={styles.cornerBL}></div>
                <div className={styles.cornerBR}></div>

                <div className={styles.content}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.iconWrapper}>
                            {currentStep === PRE_REG_STEPS.SUCCESS ? (
                                <i className="ri-check-line"></i>
                            ) : currentStep === PRE_REG_STEPS.VERIFY ? (
                                <i className="ri-shield-keyhole-line"></i>
                            ) : (
                                <i className="ri-mail-send-line"></i>
                            )}
                        </div>
                        <h2 className={styles.title}>
                            {currentStep === PRE_REG_STEPS.SUCCESS
                                ? 'Pre-Registration Complete!'
                                : currentStep === PRE_REG_STEPS.VERIFY
                                    ? 'Verify Your Email'
                                    : 'Pre-Register'}
                        </h2>
                        <p className={styles.subtitle}>
                            {currentStep === PRE_REG_STEPS.SUCCESS
                                ? preRegistrationConfig.successMessage
                                : currentStep === PRE_REG_STEPS.VERIFY
                                    ? `Enter the verification code sent to ${email}`
                                    : preRegistrationConfig.message}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className={styles.error}>
                            <i className="ri-error-warning-line"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Email Step */}
                    {currentStep === PRE_REG_STEPS.EMAIL && (
                        <form onSubmit={handleEmailSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <i className="ri-mail-line"></i>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    disabled={isLoading}
                                    autoFocus
                                    autoComplete="email"
                                />
                            </div>
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className={styles.loader}></span>
                                ) : (
                                    <>
                                        <span>Send Code</span>
                                        <i className="ri-arrow-right-line"></i>
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Verification Step */}
                    {currentStep === PRE_REG_STEPS.VERIFY && (
                        <form onSubmit={handleCodeSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <i className="ri-key-2-line"></i>
                                <input
                                    type="text"
                                    placeholder="Enter verification code"
                                    value={codeInput}
                                    onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    disabled={isLoading}
                                    autoFocus
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                />
                            </div>
                            <div className={styles.buttonRow}>
                                <button
                                    type="button"
                                    className={styles.backBtn}
                                    onClick={handleBackToEmail}
                                    disabled={isLoading}
                                >
                                    <i className="ri-arrow-left-line"></i>
                                    <span>Back</span>
                                </button>
                                <button
                                    type="submit"
                                    className={styles.submitBtn}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className={styles.loader}></span>
                                    ) : (
                                        <>
                                            <span>Verify</span>
                                            <i className="ri-check-line"></i>
                                        </>
                                    )}
                                </button>
                            </div>
                            <button
                                type="button"
                                className={styles.resendLink}
                                onClick={resendCode}
                                disabled={isLoading || resendCooldown > 0}
                            >
                                {resendCooldown > 0
                                    ? `Resend code in ${resendCooldown}s`
                                    : "Didn't receive the code? Resend"
                                }
                            </button>
                        </form>
                    )}

                    {/* Success Step */}
                    {currentStep === PRE_REG_STEPS.SUCCESS && (
                        <div className={styles.successContent}>
                            <div className={styles.successIcon}>
                                <i className="ri-checkbox-circle-fill"></i>
                            </div>
                            <p className={styles.successEmail}>{email}</p>
                            <button
                                className={styles.submitBtn}
                                onClick={handleCloseClick}
                            >
                                <span>Done</span>
                                <i className="ri-check-double-line"></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
