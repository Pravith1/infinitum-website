"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './CircularMenu.module.css';

const MENU_ITEMS = [
    { label: 'Home', icon: 'ri-home-line', href: '/' },
    { label: 'Events', icon: 'ri-calendar-event-line', href: '/events' },
    { label: 'Charity', icon: 'ri-heart-line', href: '/charity' },
    { label: 'Music', icon: 'ri-music-line', href: '/music' },
    { label: 'News', icon: 'ri-newspaper-line', href: '/news' },
];

const SLOT_ANGLES = [0, 22.5, 45, 67.5, 90];

export default function CircularMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0); // Start with Home
    const pathname = usePathname();

    // Update active index based on pathname
    useEffect(() => {
        const index = MENU_ITEMS.findIndex(item => item.href === pathname);
        if (index !== -1) {
            setActiveIndex(index);
        }
    }, [pathname]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleItemClick = (index) => {
        setActiveIndex(index);
    };

    const getItemStyle = (index) => {
        // Calculate offset from active index
        let offset = index - activeIndex;

        // Wrap around logic for 5 items
        // Range: -2 to 2
        if (offset > 2) offset -= 5;
        if (offset < -2) offset += 5;

        // Map offset to slot index (0 to 4)
        const slotIndex = offset + 2;
        const angle = SLOT_ANGLES[slotIndex] || 0;

        return {
            '--angle': `${angle}deg`
        };
    };

    return (
        <nav className={`${styles.navContainer} ${isOpen ? styles.open : ''}`}>
            <button className={styles.toggleBtn} onClick={toggleMenu}>
                <i className={`ri-menu-3-line ${styles.menuIcon}`}></i>
                <i className={`ri-close-line ${styles.closeIcon}`}></i>
            </button>
            <ul className={styles.submenu}>
                {MENU_ITEMS.map((item, index) => (
                    <li key={index} style={getItemStyle(index)}>
                        <Link
                            href={item.href}
                            className={styles.link}
                            onClick={() => handleItemClick(index)}
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
