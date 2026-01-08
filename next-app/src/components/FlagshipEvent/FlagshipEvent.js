"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './FlagshipEvent.module.css';
import { eventService } from '@/services/eventservice';
import { useSound } from '@/context/SoundContext';
import { useAuth } from '@/context/AuthContext';

// Static event data
const EVENT_DATA = {
    title: 'Thooral Hackathon',
    shortDescription: 'The ultimate hackathon challenge awaits. Test your skills and compete with the best minds in an intense 24-hour coding marathon.',
    fullDescription: 'Prepare yourself for the most anticipated event of Infinitum! Thooral Hackathon brings together the brightest minds to compete in an intense coding marathon. Showcase your problem-solving skills, algorithmic thinking, and creativity as you tackle challenging problems designed to push your limits. Whether you\'re a seasoned coder or an enthusiastic beginner, this event offers something for everyone. Join us for an unforgettable experience filled with learning, competition, and amazing prizes!',
    posterSrc: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=400&fit=crop',
};

export default function FlagshipEvent() {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [flagship, setFlagship] = useState({});
    const [thooral, setThooral] = useState({});
    const [isRegistered, setIsRegistered] = useState(false);
    const [notification, setNotification] = useState({
        isOpen: false,
        type: '', // 'confirm', 'success', 'error'
        title: '',
        message: '',
        onConfirm: null
    });
    const cardRef = useRef(null);
    const { isMuted } = useSound();
    const { isAuthenticated } = useAuth();

    // Audio refs
    const clickSoundRef = useRef(null);
    const expandSoundRef = useRef(null);
    const hoverSoundRef = useRef(null);

    // Fetch flagship event data
    useEffect(() => {
        const fetchFlagshipEvent = async () => {
            try {
                // Step 1: Fetch all events
                const data = await eventService.getAllEvents({ limit: 50 });

                // Handle different response formats
                let events = [];
                if (Array.isArray(data)) {
                    events = data;
                } else if (data.events && Array.isArray(data.events)) {
                    events = data.events;
                } else if (data.data && Array.isArray(data.data)) {
                    events = data.data;
                }

                // Step 2: Find Thooral Hackathon
                const thooral_hackathon = events.find(event =>
                    event.eventName === "Thooral Hackathon"
                );

                if (thooral_hackathon) {
                    // Set basic flagship data
                    setFlagship({
                        eventId: thooral_hackathon.eventId,
                        eventName: thooral_hackathon.eventName,
                        category: thooral_hackathon.category,
                        oneLineDescription: thooral_hackathon.oneLineDescription,
                        clubName: thooral_hackathon.clubName,
                    });

                    // Step 3: Fetch detailed event data
                    const detailData = await eventService.getEventById(thooral_hackathon.eventId);

                    let eventDetails = null;
                    if (detailData.event && Array.isArray(detailData.event)) {
                        eventDetails = detailData.event[0];
                    } else if (detailData.event) {
                        eventDetails = detailData.event;
                    } else if (detailData.data && Array.isArray(detailData.data)) {
                        eventDetails = detailData.data[0];
                    } else if (detailData.data) {
                        eventDetails = detailData.data;
                    } else if (Array.isArray(detailData)) {
                        eventDetails = detailData[0];
                    } else {
                        eventDetails = detailData;
                    }

                    setThooral(eventDetails);

                    // Check if user is already registered
                    if (isAuthenticated && thooral_hackathon.eventId) {
                        try {
                            const userEvents = await eventService.getUserEvents();
                            const list = Array.isArray(userEvents) ? userEvents : (userEvents.events || userEvents.data || []);
                            const registeredIds = list.map(e => e.eventId);
                            setIsRegistered(registeredIds.includes(thooral_hackathon.eventId));
                        } catch (err) {
                            console.error('Error checking registration status:', err);
                        }
                    }
                }
            } catch (err) {
                console.error('Error fetching flagship event:', err);
            }
        };

        fetchFlagshipEvent();
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

        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

        if (!isAuthenticated && !token) {
            setNotification({
                isOpen: true,
                type: 'error',
                title: 'Login Required',
                message: 'Please login to register for this event.',
                onConfirm: () => closeNotification()
            });
            return;
        }

        setNotification({
            isOpen: true,
            type: 'confirm',
            title: 'Confirm Registration',
            message: `Are you sure you want to register for ${thooral?.eventName || 'Thooral Hackathon'}?`,
            onConfirm: () => performRegistration()
        });
    };

    const performRegistration = async () => {
        closeNotification();

        try {
            const res = await eventService.registerEvent(flagship.eventId);

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
                    type: 'error',
                    title: 'Login Required',
                    message: 'Please login to register for this event.',
                    onConfirm: () => closeNotification()
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

    const { title, shortDescription, fullDescription, posterSrc } = EVENT_DATA;

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
                                    alt={title}
                                    width={200}
                                    height={200}
                                    className={styles.poster}
                                    priority
                                    unoptimized
                                />
                            </div>
                        </div>

                        {/* Info */}
                        <div className={styles.info}>
                            <h2 className={styles.title} data-text={title}>{flagship.eventName}</h2>
                            <p className={styles.description}>{flagship.oneLineDescription}</p>
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
                                    alt={thooral?.eventName || title}
                                    width={320}
                                    height={320}
                                    className={styles.modalPoster}
                                    unoptimized
                                />
                            </div>

                            {/* Right Side - Content */}
                            <div className={styles.modalInfo}>
                                {/* Category */}
                                <div className={styles.category}>{thooral?.category || 'FLAGSHIP EVENT'}</div>

                                {/* Title */}
                                <h1 className={styles.modalTitle}>{thooral?.eventName || title}</h1>

                                {/* One-liner */}
                                {thooral?.oneLineDescription && (
                                    <p className={styles.oneLiner}>{thooral.oneLineDescription}</p>
                                )}

                                {/* Description */}
                                <p className={styles.modalDesc}>{thooral?.description || fullDescription}</p>

                                {/* Info Grid - 2x2 */}
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <div className={styles.infoLabel}>Date</div>
                                        <div className={styles.infoValue}>
                                            {thooral?.date
                                                ? new Date(thooral.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                                                : 'TBA'}
                                        </div>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <div className={styles.infoLabel}>Timing</div>
                                        <div className={styles.infoValue}>{thooral?.timing || 'TBA'}</div>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <div className={styles.infoLabel}>Venue</div>
                                        <div className={styles.infoValue}>{thooral?.hall || 'TBA'}</div>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <div className={styles.infoLabel}>Team Size</div>
                                        <div className={styles.infoValue}>{thooral?.teamSize || 1} Members</div>
                                    </div>
                                </div>

                                {/* Rounds Section */}
                                {thooral?.rounds && thooral.rounds.length > 0 && (
                                    <div className={styles.roundsSection}>
                                        <h3 className={styles.roundsTitle}>ROUNDS</h3>
                                        <div className={styles.roundsList}>
                                            {thooral.rounds.map((round, index) => (
                                                <div key={round._id || index} className={styles.roundItem}>
                                                    <div className={styles.roundNumber}>{index + 1}</div>
                                                    <div className={styles.roundContent}>
                                                        <div className={styles.roundTitle}>
                                                            Round {index + 1} – {round.title}
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

                                {/* Contacts */}
                                {thooral?.contacts && thooral.contacts.length > 0 && (
                                    <div className={styles.contactsSection}>
                                        <h3 className={styles.sectionTitle}>Event Coordinators</h3>
                                        <div className={styles.contactsList}>
                                            {thooral.contacts.map((contact, index) => (
                                                <div key={contact._id || index} className={styles.contactItem}>
                                                    <span className={styles.contactName}>{contact.name}</span>
                                                    <a href={`tel:${contact.mobile}`} className={styles.contactPhone}>
                                                        {contact.mobile}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Club Name */}
                                {thooral?.clubName && (
                                    <p className={styles.clubName}>Organized by {thooral.clubName}</p>
                                )}

                                {/* Register Button */}
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
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
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
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
