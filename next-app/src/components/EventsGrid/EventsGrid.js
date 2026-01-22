"use client";

import React, { useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './EventsGrid.module.css';
import eventsData from './infinitum-2026.events.json';
import { useSound } from '@/context/SoundContext';

// Category configuration with colors
const CATEGORY_CONFIG = {
    'technical': {
        label: 'Technical',
        color: '#c72071',
        gradient: 'linear-gradient(135deg, rgba(199, 32, 113, 0.25) 0%, rgba(199, 32, 113, 0.08) 100%)'
    },
    'non technical': {
        label: 'Non Technical',
        color: '#00d4ff',
        gradient: 'linear-gradient(135deg, rgba(0, 212, 255, 0.25) 0%, rgba(0, 212, 255, 0.08) 100%)'
    },
    'quiz': {
        label: 'Quiz',
        color: '#ffd700',
        gradient: 'linear-gradient(135deg, rgba(255, 215, 0, 0.25) 0%, rgba(255, 215, 0, 0.08) 100%)'
    },
    'workshop': {
        label: 'Workshop',
        color: '#00ff88',
        gradient: 'linear-gradient(135deg, rgba(0, 255, 136, 0.25) 0%, rgba(0, 255, 136, 0.08) 100%)'
    },
    'paper presentation': {
        label: 'Paper Presentation',
        color: '#ff6b35',
        gradient: 'linear-gradient(135deg, rgba(255, 107, 53, 0.25) 0%, rgba(255, 107, 53, 0.08) 100%)'
    }
};

// Mock data for workshops and paper presentations
const MOCK_EVENTS = [
    {
        eventId: 'WS01',
        eventName: 'AI Infrastructure: From Big Picture to Everyday Reality',
        category: 'Workshop',
    },
    {
        eventId: 'WS02',
        eventName: 'Product Prototyping for Industry Applications',
        category: 'Workshop',
    },
    {
        eventId: 'WS03',
        eventName: 'Threat Detection Modelling',
        category: 'Workshop',
    },
    {
        eventId: 'PRP03',
        eventName: 'AI and Emerging Trends',
        category: 'Paper Presentation',
    }
];

// Define which cards should be large (span 2 columns or 2 rows)
// Format: { cols: number, rows: number }
const CARD_SIZES = {
    0: { cols: 2, rows: 1 },  // First event - wide
    1: { cols: 1, rows: 2 },  // Second event - tall
    2: { cols: 1, rows: 1 },  // Normal
    3: { cols: 1, rows: 1 },  // Normal
    4: { cols: 2, rows: 1 },  // Wide
    5: { cols: 1, rows: 1 },  // Normal
    6: { cols: 1, rows: 1 },  // Normal
    7: { cols: 1, rows: 2 },  // Tall
    8: { cols: 1, rows: 2 },  // Wide - Workshop 3
    9: { cols: 2, rows: 1 },  // Wide
};

export default function EventsGrid() {
    const router = useRouter();
    const { isMuted } = useSound();

    // Audio refs
    const clickSoundRef = useRef(null);
    const hoverSoundRef = useRef(null);

    // Initialize audio on mount
    useEffect(() => {
        clickSoundRef.current = new Audio('/sounds/click.mp3');
        hoverSoundRef.current = new Audio('/sounds/hover.mp3');
        clickSoundRef.current.volume = 0.5;
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

    const handleCardHover = () => {
        playSound(hoverSoundRef);
    };

    const handleCardClick = (eventId) => {
        playSound(clickSoundRef);
        if (eventId && !eventId.startsWith('MOCK')) {
            // Directly navigate to query param URL to avoid redirect
            router.push(`/events?id=${eventId}`);
        } else {
            router.push('/events');
        }
    };

    // Combine real events with mock data, excluding Thooral Hackathon
    // Swap neXus (EVNT02) with AI Infrastructure (WS01)
    const allEvents = useMemo(() => {
        const realEvents = eventsData.filter(
            event => event.eventName !== 'Thooral Hackathon'
        );
        const combined = [...realEvents, ...MOCK_EVENTS];

        // Find indices of neXus and AI Infrastructure
        const nexusIndex = combined.findIndex(e => e.eventId === 'EVNT02');
        const aiInfraIndex = combined.findIndex(e => e.eventId === 'WS01');

        // Swap them if both are found
        if (nexusIndex !== -1 && aiInfraIndex !== -1) {
            [combined[nexusIndex], combined[aiInfraIndex]] = [combined[aiInfraIndex], combined[nexusIndex]];
        }

        return combined;
    }, []);

    const getCategoryConfig = (category) => {
        const categoryKey = category.toLowerCase();
        return CATEGORY_CONFIG[categoryKey] || {
            label: category,
            color: '#c72071',
            gradient: 'linear-gradient(135deg, rgba(199, 32, 113, 0.25) 0%, rgba(199, 32, 113, 0.08) 100%)'
        };
    };

    const getCardSize = (index) => {
        return CARD_SIZES[index] || { cols: 1, rows: 1 };
    };

    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Events</h2>
                <p className={styles.subtitle}>Explore our lineup of exciting events</p>
            </div>

            <div className={styles.bentoGrid}>
                {allEvents.map((event, index) => {
                    const config = getCategoryConfig(event.category);
                    const size = getCardSize(index);

                    // Determine size class
                    let sizeClass = styles.eventCard;
                    if (size.cols === 2) sizeClass += ` ${styles.wide}`;
                    if (size.rows === 2) sizeClass += ` ${styles.tall}`;

                    return (
                        <div
                            key={event.eventId}
                            className={sizeClass}
                            style={{
                                '--category-color': config.color,
                                '--animation-delay': `${index * 0.05}s`,
                                background: config.gradient
                            }}
                            onMouseEnter={handleCardHover}
                            onClick={() => handleCardClick(event.eventId)}
                        >
                            <div
                                className={styles.cardAccent}
                                style={{ backgroundColor: config.color }}
                            />
                            <div className={styles.cardContent}>
                                <h3 className={styles.eventName}>{event.eventName}</h3>
                                <span
                                    className={styles.eventType}
                                    style={{ color: config.color }}
                                >
                                    {event.category}
                                </span>
                            </div>
                            <div
                                className={styles.cardGlow}
                                style={{ backgroundColor: config.color }}
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
