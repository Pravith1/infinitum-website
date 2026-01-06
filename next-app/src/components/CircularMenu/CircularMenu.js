"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './CircularMenu.module.css';

const MENU_ITEMS = [
    { label: 'Home', icon: 'ri-home-line', href: '/' },
    { label: 'Events', icon: 'ri-calendar-event-line', href: '/events' },
    { label: 'Schedule', icon: 'ri-calendar-line', href: '/schedule' },
    { label: 'Charity', icon: 'ri-heart-line', href: '/charity' },
    { label: 'Music', icon: 'ri-music-line', href: '/music' },
    { label: 'News', icon: 'ri-newspaper-line', href: '/news' },
];

export default function CircularMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [mouseAngle, setMouseAngle] = useState(null);
    const pathname = usePathname();
    const router = useRouter();
    const menuRef = useRef(null);
    const centerRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const index = MENU_ITEMS.findIndex(item => item.href === pathname);
        if (index !== -1) {
            setActiveIndex(index);
        }
    }, [pathname]);

    // Calculate center position when menu opens
    useEffect(() => {
        if (isOpen) {
            centerRef.current = {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
            };
        }
    }, [isOpen]);

    // Mouse tracking for magnetic pull effect
    const handleMouseMove = useCallback((e) => {
        if (!isOpen) return;
        
        const cx = centerRef.current.x;
        const cy = centerRef.current.y;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only calculate angle if outside the center button area
        if (distance > 50 && distance < 250) {
            // Calculate angle from center (0 = top, clockwise)
            let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
            if (angle < 0) angle += 360;
            setMouseAngle(angle);
            
            // Determine which segment the mouse is in, accounting for rotation
            const segmentAngle = 360 / MENU_ITEMS.length;
            const rotationOffset = activeIndex * segmentAngle; // Reverse the visual offset
            const adjustedAngle = (angle + rotationOffset + segmentAngle / 2) % 360;
            const segmentIndex = Math.floor(adjustedAngle / segmentAngle);
            setHoveredIndex(segmentIndex);
        } else if (distance <= 50) {
            setHoveredIndex(null);
            setMouseAngle(null);
        }
    }, [isOpen, activeIndex]);

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [isOpen, handleMouseMove]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        setHoveredIndex(null);
        setMouseAngle(null);
    };

    const handleItemClick = (e, index) => {
        e.preventDefault(); // Prevent default Link navigation
        
        const targetHref = MENU_ITEMS[index].href;
        
        // Update active index for visual rotation
        setActiveIndex(index);
        
        // Wait for rotation animation, then navigate and close
        setTimeout(() => {
            router.push(targetHref);
            setIsOpen(false);
            setHoveredIndex(null);
        }, 400);
    };

    // Calculate position for each segment's icon WITH rotation offset
    const getIconPosition = (index) => {
        const total = MENU_ITEMS.length;
        const segmentAngle = 360 / total;
        // Apply rotation so active item is always at top (index 0 position)
        const rotationOffset = -activeIndex * segmentAngle;
        const angle = index * segmentAngle + rotationOffset; // 0 = top
        const radius = 100; // Distance from center to icon
        
        const rad = (angle - 90) * (Math.PI / 180);
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        
        return { x, y, angle };
    };

    // Generate SVG path for a pie segment WITH rotation offset
    const getSegmentPath = (index) => {
        const total = MENU_ITEMS.length;
        const segmentAngle = 360 / total;
        // Apply rotation so active item is always at top
        const rotationOffset = -activeIndex * segmentAngle;
        const startAngle = index * segmentAngle - segmentAngle / 2 - 90 + rotationOffset;
        const endAngle = startAngle + segmentAngle;
        
        const innerRadius = 45;
        const outerRadius = 150;
        
        const startRad = startAngle * (Math.PI / 180);
        const endRad = endAngle * (Math.PI / 180);
        
        const x1 = Math.cos(startRad) * innerRadius;
        const y1 = Math.sin(startRad) * innerRadius;
        const x2 = Math.cos(startRad) * outerRadius;
        const y2 = Math.sin(startRad) * outerRadius;
        const x3 = Math.cos(endRad) * outerRadius;
        const y3 = Math.sin(endRad) * outerRadius;
        const x4 = Math.cos(endRad) * innerRadius;
        const y4 = Math.sin(endRad) * innerRadius;
        
        const largeArc = segmentAngle > 180 ? 1 : 0;
        
        return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1} Z`;
    };

    return (
        <nav className={`${styles.navContainer} ${isOpen ? styles.open : ''}`} ref={menuRef}>
            <div className={styles.menuBackdrop} onClick={() => setIsOpen(false)} />

            {/* Toggle Button */}
            <button className={styles.toggleBtn} onClick={toggleMenu}>
                <i className={`ri-menu-3-line ${styles.menuIcon}`}></i>
                <i className={`ri-close-line ${styles.closeIcon}`}></i>
            </button>

            {/* Pie Menu */}
            <div className={styles.pieMenu}>
                <svg 
                    viewBox="-160 -160 320 320" 
                    className={styles.pieSvg}
                >
                    {/* Segment backgrounds */}
                    {MENU_ITEMS.map((item, index) => {
                        const isHovered = hoveredIndex === index;
                        const isActive = activeIndex === index;
                        
                        return (
                            <g key={index}>
                                {/* Segment path */}
                                <path
                                    d={getSegmentPath(index)}
                                    className={`${styles.segment} ${isHovered ? styles.segmentHovered : ''} ${isActive ? styles.segmentActive : ''}`}
                                    onClick={(e) => handleItemClick(e, index)}
                                />
                                
                                {/* Segment border */}
                                <path
                                    d={getSegmentPath(index)}
                                    className={styles.segmentBorder}
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* Icons positioned on segments */}
                {MENU_ITEMS.map((item, index) => {
                    const pos = getIconPosition(index);
                    const isHovered = hoveredIndex === index;
                    const isActive = activeIndex === index;
                    
                    return (
                        <a
                            key={index}
                            href={item.href}
                            className={`${styles.segmentIcon} ${isHovered ? styles.iconHovered : ''} ${isActive ? styles.iconActive : ''}`}
                            style={{
                                '--x': `${pos.x}px`,
                                '--y': `${pos.y}px`,
                            }}
                            onClick={(e) => handleItemClick(e, index)}
                        >
                            <i className={item.icon}></i>
                            <span className={styles.iconLabel}>{item.label}</span>
                        </a>
                    );
                })}

                {/* Center circle with close button */}
                <button className={styles.centerCircle} onClick={() => setIsOpen(false)}>
                    <i className="ri-close-line" style={{ fontSize: 28, color: '#c72071' }}></i>
                    {hoveredIndex !== null && (
                        <span className={styles.centerLabel}>{MENU_ITEMS[hoveredIndex].label}</span>
                    )}
                </button>
            </div>
        </nav>
    );
}