"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './CircularMenu.module.css';

const MENU_ITEMS = [
    { label: 'Home', icon: 'ri-home-line', href: '/' },
    { label: 'About', icon: 'ri-user-line', href: '/about' },
    { label: 'Schedule', icon: 'ri-calendar-line', href: '/schedule' },
    { label: 'Charity', icon: 'ri-heart-line', href: '/charity' },
    { label: 'Music', icon: 'ri-music-line', href: '/music' },
    { label: 'News', icon: 'ri-newspaper-line', href: '/news' },
];

export default function CircularMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0); // Start with Home
    const pathname = usePathname();

    // Audio refs
    const expandSoundRef = useRef(null);
    const clickSoundRef = useRef(null);

    // Initialize audio on mount
    useEffect(() => {
        expandSoundRef.current = new Audio('/sounds/expand.mp3');
        clickSoundRef.current = new Audio('/sounds/click.mp3');

        // Set volume
        expandSoundRef.current.volume = 0.5;
        clickSoundRef.current.volume = 0.5;
    }, []);

    // Play sound helper
    const playSound = useCallback((audioRef) => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {
                // Ignore autoplay errors
            });
        }
    }, []);

    useEffect(() => {
        const index = MENU_ITEMS.findIndex(item => item.href === pathname);
        if (index !== -1) {
            setActiveIndex(index);
        }
    }, [pathname]);

    const toggleMenu = () => {
        if (!isOpen) {
            playSound(expandSoundRef);
        } else {
            playSound(clickSoundRef);
        }
        setIsOpen(!isOpen);
        setHoveredLabel(null);
    };

    const handleItemClick = (index) => {
        playSound(clickSoundRef);
        setActiveIndex(index);
        setTimeout(() => {
            setIsOpen(false);
            setHoveredLabel(null);
        }, 600);
    };

    const getItemStyle = (index) => {
        const total = MENU_ITEMS.length;
        const step = 360 / total;
        // Angle calculation
        const angle = 90 + (index - activeIndex) * step;
        
        return {
            '--angle': `${angle}deg`,
            '--i': index,
        };
    };

    return (
        <nav className={`${styles.navContainer} ${isOpen ? styles.open : ''}`}>
            <div className={styles.menuBackdrop} onClick={() => setIsOpen(false)} />

            <button className={styles.toggleBtn} onClick={toggleMenu}>
                {isOpen && hoveredLabel ? (
                     <span className={styles.centerLabel}>{hoveredLabel}</span>
                ) : (
                    <>
                        <i className={`ri-menu-3-line ${styles.menuIcon}`}></i>
                        <i className={`ri-close-line ${styles.closeIcon}`}></i>
                    </>
                )}
            </button>
            <ul className={styles.submenu}>
                {MENU_ITEMS.map((item, index) => (
                    <li 
                        key={index} 
                        style={getItemStyle(index)}
                        className={index === activeIndex ? styles.active : ''}
                    >
                        <Link 
                            href={item.href} 
                            className={styles.link}
                            onClick={() => handleItemClick(index)}
                            onMouseEnter={() => setHoveredLabel(item.label)}
                            onMouseLeave={() => setHoveredLabel(null)}
                        >
                            <div className={styles.iconCircle}>
                                <i className={item.icon}></i>
                            </div>
                            <span className={styles.label}>{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

