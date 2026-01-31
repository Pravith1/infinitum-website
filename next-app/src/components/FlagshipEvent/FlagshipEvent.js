"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './FlagshipEvent.module.css';
import { eventService } from '@/services/eventservice';
import { useSound } from '@/context/SoundContext';
import { useAuth } from '@/context/AuthContext';
import { usePreRegistration } from '@/context/PreRegistrationContext';
import { isPreRegistrationEnabled, preRegistrationConfig } from '@/settings/featureFlags';

// Hardcoded event data for Thooral Hackathon
const EVENT_DATA = {
    eventId: "EVNT07",
    eventName: "Thooral Hackathon",
    category: "Technical",
    oneLineDescription: "From idea to impact—design, document, build, and present innovative solutions.",
    description: "Thooral Hackathon is a 2-day technical event designed to simulate a real-world software engineering lifecycle. Participants ideate solutions, create structured documentation, develop working prototypes, and present their solutions across domains such as Full Stack Development, Machine Learning, and Blockchain. The event emphasizes innovation, teamwork, and industry-relevant development practices.\n\nImportant Notes:\n• Every participant must register individually—teams can be formed in-person on Day 1\n• Problem statements will be given on Day 1—no themes, just direct problem statements\n• There are no preliminary rounds\n• Lunch will not be provided\n• Flexible participation: Students can work on other events during the hackathon and are expected to attend only Day 1 Informal Review and Day 2 Final Judging",
    posterSrc: 'images/Thooral.png',
    rounds: [
        {
            title: "Day 1",
            description: "Problem statements are given and students work on their solutions. The day concludes with a feedback review session where teams receive guidance and insights on their progress.",
            _id: "695a3d878baa56af3270688c"
        },
        {
            title: "Day 2",
            description: "Teams complete their projects and present their final solutions to the judges.",
            _id: "695a3d878baa56af3270688d"
        }
    ],
    contacts: [
        { name: "Ishwarya S", mobile: "9342868277" },
        { name: "Akash S", mobile: "9943803882" },
        { name: "Sreeraghavan", mobile: "6385786223" },
        { name: "Lohith S", mobile: "9488125100" }
    ],
    teamSize: "2 to 4",
    closed: false,
    date: {
        "Day 1": "FEB 13",
        "Day 2": "FEB 14"
    },
    timing: {
        "Day 1": "10:00 AM - 4:30 PM",
        "Day 2": "9:00 AM - 3:00 PM"
    },
    hall: {
        "Day 1": { date: "FEB 13", lab: "3AI and AIR Labs" },
        "Day 2": { date: "FEB 14", lab: "GRD Lab and Programming Lab- I" }
    },
    clubName: "CSEA"
};

export default function FlagshipEvent() {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
    const [isRegistered, setIsRegistered] = useState(false);
    const [notification, setNotification] = useState({
        isOpen: false,
        type: '', // 'confirm', 'success', 'error', 'login'
        title: '',
        message: '',
        onConfirm: null,
        showLoginButton: false
    });
    const cardRef = useRef(null);
    const { isMuted } = useSound();
    const { isAuthenticated } = useAuth();
    const { openModal: openPreRegModal } = usePreRegistration();
    const router = useRouter();

    // Audio refs
    const clickSoundRef = useRef(null);
    const expandSoundRef = useRef(null);
    const hoverSoundRef = useRef(null);

    // Use hardcoded event data and check registration status
    useEffect(() => {
        const checkRegistration = async () => {
            // Check if user is already registered
            if (isAuthenticated && EVENT_DATA.eventId) {
                try {
                    const userEvents = await eventService.getUserEvents();
                    const list = Array.isArray(userEvents) ? userEvents : (userEvents.events || userEvents.data || []);
                    const registeredIds = list.map(e => e.eventId);
                    setIsRegistered(registeredIds.includes(EVENT_DATA.eventId));
                } catch (err) {
                    console.error('Error checking registration status:', err);
                }
            }
        };

        checkRegistration();
    }, [isAuthenticated]);

    // Initialize audio on mount
    useEffect(() => {
        clickSoundRef.current = new Audio('/sounds/click.mp3');
        expandSoundRef.current = new Audio('/sounds/expand.mp3');
        hoverSoundRef.current = new Audio('/sounds/hover.mp3');
        clickSoundRef.current.volume = 0.5;
        expandSoundRef.current.volume = 0.5;
        hoverSoundRef.current.volume = 0.3;
    }, []);

    // Play sound helper - respects mute state
    const playSound = (audioRef) => {
        if (isMuted) return; // Don't play if muted
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => { });
        }
    };

    // Intersection observer for entrance animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Mouse tracking for 3D tilt effect
    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
        setMousePosition({ x: 0.5, y: 0.5 });
    };

    // Lock body scroll when overlay is open
    useEffect(() => {
        if (isOverlayOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOverlayOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOverlayOpen) {
                playSound(clickSoundRef);
                setIsOverlayOpen(false);
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOverlayOpen]);

    const openOverlay = () => {
        playSound(expandSoundRef);
        setIsOverlayOpen(true);
    };

    const closeOverlay = () => {
        playSound(clickSoundRef);
        setIsOverlayOpen(false);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeOverlay();
        }
    };

    const handleCardHover = () => {
        playSound(hoverSoundRef);
    };

    // Notification handlers
    const closeNotification = () => {
        playSound(clickSoundRef);
        setNotification(prev => ({ ...prev, isOpen: false }));
    };

    const handleRegisterClick = () => {
        playSound(clickSoundRef);

        // If pre-registration mode is enabled, open the pre-registration modal
        if (isPreRegistrationEnabled) {
            openPreRegModal();
            return;
        }

        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

        if (!isAuthenticated && !token) {
            setNotification({
                isOpen: true,
                type: 'login',
                title: 'Login Required',
                message: 'Please login to register for this event.',
                onConfirm: () => closeNotification(),
                showLoginButton: true
            });
            return;
        }

        setNotification({
            isOpen: true,
            type: 'confirm',
            title: 'Confirm Registration',
            message: `Are you sure you want to register for ${EVENT_DATA.eventName}?`,
            onConfirm: () => performRegistration()
        });
    };

    const performRegistration = async () => {
        closeNotification();

        try {
            const res = await eventService.registerEvent(EVENT_DATA.eventId);

            if (res && res.success) {
                setNotification({
                    isOpen: true,
                    type: 'success',
                    title: 'Registration Successful',
                    message: res.message || "You have been registered successfully!",
                    onConfirm: () => closeNotification()
                });
                setIsRegistered(true);
            } else {
                setNotification({
                    isOpen: true,
                    type: 'error',
                    title: 'Registration Failed',
                    message: res?.message || "Registration failed. Please try again.",
                    onConfirm: () => closeNotification()
                });
            }
        } catch (error) {
            console.error("Registration error:", error);
            const msg = error.response?.data?.message || "An error occurred during registration.";

            if (error.response?.status === 401) {
                setNotification({
                    isOpen: true,
                    type: 'login',
                    title: 'Login Required',
                    message: 'Please login to register for this event.',
                    onConfirm: () => closeNotification(),
                    showLoginButton: true
                });
            } else if (error.response?.status === 400 && msg.toLowerCase().includes("general fee")) {
                setNotification({
                    isOpen: true,
                    type: 'error',
                    title: 'General Fee Required',
                    message: 'General fee payment is not done. Please complete the general fee payment to register for events.',
                    onConfirm: () => closeNotification()
                });
            } else {
                setNotification({
                    isOpen: true,
                    type: 'error',
                    title: 'Error',
                    message: msg,
                    onConfirm: () => closeNotification()
                });
            }
        }
    };

    // Calculate 3D transform
    const tiltX = (mousePosition.y - 0.5) * 10;
    const tiltY = (mousePosition.x - 0.5) * -10;
    const glareX = mousePosition.x * 100;
    const glareY = mousePosition.y * 100;

    const { eventName, oneLineDescription, description, posterSrc, rounds, contacts, teamSize, date, timing, hall, clubName, eventRules } = EVENT_DATA;

    return (
        <>
            {/* Card */}
            <div
                ref={cardRef}
                className={`${styles.cardWrapper} ${isVisible ? styles.visible : ''}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleCardHover}
                onClick={openOverlay}
                style={{
                    '--tilt-x': `${tiltX}deg`,
                    '--tilt-y': `${tiltY}deg`,
                    '--glare-x': `${glareX}%`,
                    '--glare-y': `${glareY}%`,
                }}
            >
                {/* Floating particles */}
                <div className={styles.particles}>
                    <span></span><span></span><span></span>
                    <span></span><span></span><span></span>
                </div>


                {/* Holographic overlay */}
                <div className={styles.holographic}></div>

                <div className={styles.card}>
                    {/* Label */}
                    <div className={styles.labelWrapper}>
                        <span className={styles.labelAccent}>▸</span>
                        <span className={styles.label}>FLAGSHIP EVENT</span>
                        <span className={styles.labelAccent}>◂</span>
                    </div>

                    <div className={styles.cardContent}>
                        {/* Poster with glow ring */}
                        <div className={styles.posterContainer}>
                            <div className={styles.glowRing}></div>
                            <div className={styles.posterFrame}>
                                <Image
                                    src={posterSrc}
                                    alt={eventName}
                                    width={200}
                                    height={200}
                                    priority
                                    unoptimized
                                />
                            </div>
                        </div>

                        {/* Info */}
                        <div className={styles.info}>
                            <h2 className={styles.title} data-text={eventName}>{eventName}</h2>
                            <p className={styles.description}>{oneLineDescription}</p>
                            <button className={styles.ctaButton}>
                                <span>Learn More</span>
                                <i className="ri-arrow-right-line"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {isOverlayOpen && (
                <div className={styles.overlay} onClick={handleBackdropClick}>
                    <div className={styles.modal}>
                        <button className={styles.closeBtn} onClick={closeOverlay}>
                            <i className="ri-close-line"></i>
                        </button>

                        <div className={styles.modalContent}>
                            {/* Left Side - Poster */}
                            <div className={styles.modalPosterWrapper}>
                                <Image
                                    src={posterSrc}
                                    alt={eventName}
                                    width={320}
                                    height={320}
                                    className={styles.modalPoster}
                                    unoptimized
                                />
                            </div>

                            {/* Right Side - Content */}
                            <div className={styles.modalInfo}>
                                {/* Category */}
                                <div className={styles.category}>FLAGSHIP EVENT</div>

                                {/* Title */}
                                <h1 className={styles.modalTitle}>{eventName}</h1>

                                {/* One-liner */}
                                <p className={styles.oneLiner}>{oneLineDescription}</p>

                                {/* Description */}
                                <p className={styles.modalDesc}>{description}</p>

                                {/* Info Grid - Multi-day Schedule */}
                                <div className={styles.scheduleSection}>
                                    <h3 className={styles.sectionTitle}>Schedule</h3>
                                    <div className={styles.scheduleGrid}>
                                        {Object.keys(date).map((day) => (
                                            <div key={day} className={styles.scheduleDay}>
                                                <div className={styles.dayHeader}>{day}</div>
                                                <div className={styles.dayDetails}>
                                                    <div className={styles.scheduleItem}>
                                                        <i className="ri-calendar-line"></i>
                                                        <span>{date[day]}</span>
                                                    </div>
                                                    <div className={styles.scheduleItem}>
                                                        <i className="ri-time-line"></i>
                                                        <span>{timing[day]}</span>
                                                    </div>
                                                    <div className={styles.scheduleItem}>
                                                        <i className="ri-map-pin-line"></i>
                                                        <span>{hall[day]?.lab}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Team Size */}
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <div className={styles.infoLabel}>Team Size</div>
                                        <div className={styles.infoValue}>{teamSize} Members</div>
                                    </div>
                                </div>

                                {/* Rounds Section */}
                                {rounds && rounds.length > 0 && (
                                    <div className={styles.roundsSection}>
                                        <h3 className={styles.roundsTitle}>EVENT STRUCTURE</h3>
                                        <div className={styles.roundsList}>
                                            {rounds.map((round, index) => (
                                                <div key={round._id || index} className={styles.roundItem}>
                                                    <div className={styles.roundNumber}>{index + 1}</div>
                                                    <div className={styles.roundContent}>
                                                        <div className={styles.roundTitle}>
                                                            {round.title}
                                                        </div>
                                                        {round.description && (
                                                            <p className={styles.roundDescription}>{round.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Info Note */}
                                <div className={styles.infoNote}>
                                    <i className="ri-information-line"></i>
                                    <span>Participants can also participate in other events during their free time while in the hackathon.</span>
                                </div>

                                {/* Contacts */}
                                {contacts && contacts.length > 0 && (
                                    <div className={styles.contactsSection}>
                                        <h3 className={styles.sectionTitle}>Event Coordinators</h3>
                                        <div className={styles.contactsList}>
                                            {contacts.map((contact, index) => (
                                                <div key={index} className={styles.contactItem}>
                                                    <span className={styles.contactName}>{contact.name}</span>
                                                    <a href={`tel:${contact.mobile}`} className={styles.contactPhone}>
                                                        {contact.mobile}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Register Button - Hidden when pre-registration is enabled */}
                                {!isPreRegistrationEnabled && (
                                    <button
                                        className={styles.registerBtn}
                                        onClick={isRegistered ? undefined : handleRegisterClick}
                                        style={{
                                            cursor: isRegistered ? 'default' : 'pointer',
                                            background: isRegistered ? 'transparent' : undefined,
                                            borderColor: isRegistered ? '#00E676' : undefined,
                                            color: isRegistered ? '#00E676' : undefined,
                                            boxShadow: isRegistered ? 'none' : undefined,
                                        }}
                                    >
                                        {isRegistered ? 'Registered' : 'Register Now'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Modal */}
            {notification.isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10001,
                        backdropFilter: 'blur(4px)',
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeNotification();
                    }}
                >
                    <div
                        style={{
                            background: 'linear-gradient(135deg, rgba(26, 2, 11, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%)',
                            border: `2px solid ${notification.type === 'success' ? '#00E676' : notification.type === 'error' ? '#c72071' : '#c72071'}`,
                            borderRadius: '12px',
                            padding: '32px',
                            maxWidth: '400px',
                            width: '90%',
                            textAlign: 'center',
                            boxShadow: `0 0 40px ${notification.type === 'success' ? 'rgba(0, 230, 118, 0.3)' : 'rgba(199, 32, 113, 0.3)'}`,
                        }}
                    >
                        {/* Icon */}
                        <div
                            style={{
                                width: '60px',
                                height: '60px',
                                margin: '0 auto 20px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: notification.type === 'success'
                                    ? 'rgba(0, 230, 118, 0.2)'
                                    : notification.type === 'error'
                                        ? 'rgba(199, 32, 113, 0.2)'
                                        : 'rgba(250, 225, 39, 0.2)',
                                border: `2px solid ${notification.type === 'success' ? '#00E676' : notification.type === 'error' ? '#c72071' : '#fae127'}`,
                            }}
                        >
                            <i
                                className={
                                    notification.type === 'success'
                                        ? 'ri-check-line'
                                        : notification.type === 'error'
                                            ? 'ri-error-warning-line'
                                            : 'ri-question-line'
                                }
                                style={{
                                    fontSize: '28px',
                                    color: notification.type === 'success' ? '#00E676' : notification.type === 'error' ? '#c72071' : '#fae127',
                                }}
                            />
                        </div>

                        {/* Title */}
                        <h3
                            style={{
                                fontFamily: 'Orbitron, sans-serif',
                                fontSize: '1.3rem',
                                color: '#fff',
                                marginBottom: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}
                        >
                            {notification.title}
                        </h3>

                        {/* Message */}
                        <p
                            style={{
                                fontFamily: 'Electrolize, sans-serif',
                                fontSize: '1rem',
                                color: 'rgba(255, 255, 255, 0.8)',
                                marginBottom: '24px',
                                lineHeight: 1.6,
                            }}
                        >
                            {notification.message}
                        </p>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {notification.type === 'confirm' && (
                                <button
                                    onClick={closeNotification}
                                    style={{
                                        padding: '12px 24px',
                                        background: 'transparent',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        borderRadius: '6px',
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        fontFamily: 'Orbitron, sans-serif',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                            {notification.showLoginButton && (
                                <button
                                    onClick={() => {
                                        closeNotification();
                                        // Navigate to login with current page as callback URL
                                        const currentUrl = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
                                        router.push(`/auth?type=login&callbackUrl=${encodeURIComponent(currentUrl)}`);
                                    }}
                                    style={{
                                        padding: '12px 24px',
                                        background: 'linear-gradient(135deg, #c72071, #8b164f)',
                                        border: 'none',
                                        borderRadius: '6px',
                                        color: '#fff',
                                        fontFamily: 'Orbitron, sans-serif',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        boxShadow: '0 4px 20px rgba(199, 32, 113, 0.4)',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Login
                                </button>
                            )}
                            {!notification.showLoginButton && (
                                <button
                                    onClick={notification.onConfirm}
                                    style={{
                                        padding: '12px 24px',
                                        background: notification.type === 'success'
                                            ? 'linear-gradient(135deg, #00E676, #00C853)'
                                            : 'linear-gradient(135deg, #c72071, #8b164f)',
                                        border: 'none',
                                        borderRadius: '6px',
                                        color: '#fff',
                                        fontFamily: 'Orbitron, sans-serif',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        boxShadow: notification.type === 'success'
                                            ? '0 4px 20px rgba(0, 230, 118, 0.4)'
                                            : '0 4px 20px rgba(199, 32, 113, 0.4)',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {notification.type === 'confirm' ? 'Confirm' : 'OK'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
