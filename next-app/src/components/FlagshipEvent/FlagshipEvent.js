"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FlagshipEvent.module.css';

// Static event data
const EVENT_DATA = {
    title: 'Thooral Hackathon',
    shortDescription: 'The ultimate hackathon challenge awaits. Test your skills and compete with the best minds in an intense 24-hour coding marathon.',
    fullDescription: 'Prepare yourself for the most anticipated event of Infinitum! Thooral Hackathon brings together the brightest minds to compete in an intense coding marathon. Showcase your problem-solving skills, algorithmic thinking, and creativity as you tackle challenging problems designed to push your limits. Whether you\'re a seasoned coder or an enthusiastic beginner, this event offers something for everyone. Join us for an unforgettable experience filled with learning, competition, and amazing prizes!',
    posterSrc: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=400&fit=crop',
    registerLink: '/events'
};

export default function FlagshipEvent() {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);

    // Audio refs
    const clickSoundRef = useRef(null);
    const expandSoundRef = useRef(null);
    const hoverSoundRef = useRef(null);

    // Initialize audio on mount
    useEffect(() => {
        clickSoundRef.current = new Audio('/sounds/click.mp3');
        expandSoundRef.current = new Audio('/sounds/expand.mp3');
        hoverSoundRef.current = new Audio('/sounds/hover.mp3');
        clickSoundRef.current.volume = 0.5;
        expandSoundRef.current.volume = 0.5;
        hoverSoundRef.current.volume = 0.3;
    }, []);

    // Play sound helper
    const playSound = (audioRef) => {
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

    // Calculate 3D transform
    const tiltX = (mousePosition.y - 0.5) * 10;
    const tiltY = (mousePosition.x - 0.5) * -10;
    const glareX = mousePosition.x * 100;
    const glareY = mousePosition.y * 100;

    const { title, shortDescription, fullDescription, posterSrc, registerLink } = EVENT_DATA;

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

                {/* Corner accents */}
                <div className={styles.cornerTL}></div>
                <div className={styles.cornerTR}></div>
                <div className={styles.cornerBL}></div>
                <div className={styles.cornerBR}></div>

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
                            <h2 className={styles.title} data-text={title}>{title}</h2>
                            <p className={styles.description}>{shortDescription}</p>
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
                            <div className={styles.modalPosterWrapper}>
                                <div className={styles.modalGlowRing}></div>
                                <Image
                                    src={posterSrc}
                                    alt={title}
                                    width={350}
                                    height={350}
                                    className={styles.modalPoster}
                                    unoptimized
                                />
                            </div>
                            <div className={styles.modalInfo}>
                                <span className={styles.modalLabel}>FLAGSHIP EVENT</span>
                                <h2 className={styles.modalTitle}>{title}</h2>
                                <p className={styles.modalDesc}>{fullDescription}</p>
                                <Link
                                    href={registerLink}
                                    className={styles.registerBtn}
                                    onClick={() => playSound(clickSoundRef)}
                                >
                                    <span>View Event</span>
                                    <i className="ri-arrow-right-up-line"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
