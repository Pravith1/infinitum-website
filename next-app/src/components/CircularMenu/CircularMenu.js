"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Howl } from 'howler';
import styles from './CircularMenu.module.css';
import { useSound } from '@/context/SoundContext';

const MENU_ITEMS = [
    { label: 'Home', icon: 'ri-home-line', href: '/', match: ['/'] },
    { label: 'Profile', icon: 'ri-user-line', href: '/portal/profile', match: ['/portal/profile', '/portal'] },
    { label: 'Events', icon: 'ri-calendar-event-line', href: '/events?category=events', match: ['/events?category=events', '/events'] },
    { label: 'Schedule', icon: 'ri-calendar-line', href: '/schedule', match: ['/schedule'] },
    { label: 'Workshops', icon: 'ri-tools-line', href: '/events?category=workshops', match: ['/events?category=workshops'] },
    { label: 'Papers', icon: 'ri-article-line', href: '/events?category=papers', match: ['/events?category=papers'] },
];

// Sound effects
let rotateSound = null;
let openSound = null;

if (typeof window !== 'undefined') {
    rotateSound = new Howl({
        src: ['/sounds/deploy.mp3'],
        volume: 0.3,
    });
    openSound = new Howl({
        src: ['/sounds/expand.mp3'],
        volume: 0.25,
    });
}

export default function CircularMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(0); // Keyboard selection highlight
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [mouseAngle, setMouseAngle] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [rotationAngle, setRotationAngle] = useState(0); // Track actual rotation
    const [isDragging, setIsDragging] = useState(false); // Track drag state for icon transitions
    const [showHint, setShowHint] = useState(false); // First-time user hint
    const pathname = usePathname();
    const router = useRouter();
    const menuRef = useRef(null);
    const centerRef = useRef({ x: 0, y: 0 });
    const touchStartRef = useRef({ angle: 0, rotation: 0 }); // For touch rotation
    const isDraggingRef = useRef(false);
    const { isMuted } = useSound();

    // Helper function to play Howl sounds with mute check
    const playHowl = useCallback((sound) => {
        if (isMuted || !sound) return;
        sound.play();
    }, [isMuted]);

    // Set mounted state to avoid hydration mismatch
    useEffect(() => {
        setIsMounted(true);

        // Check if mobile
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Check if user has seen the menu hint before
        const hasSeenHint = localStorage.getItem('menu_hint_seen');
        if (!hasSeenHint) {
            // Show hint after a short delay
            const timer = setTimeout(() => {
                setShowHint(true);
            }, 2000);

            return () => {
                clearTimeout(timer);
                window.removeEventListener('resize', checkMobile);
            };
        }

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        
        // Build full path with search params
        let fullPath = pathname;
        if (typeof window !== 'undefined') {
            fullPath = window.location.pathname + window.location.search;
        }
        
        // Find matching menu item
        const index = MENU_ITEMS.findIndex(item => {
            if (!item.match) return item.href === fullPath;
            return item.match.some(matchPath => {
                // Exact match
                if (matchPath === fullPath) return true;
                // Path-only match (ignoring query params)
                if (matchPath === pathname) return true;
                // For /events, check if path starts with it and has category param
                if (matchPath.includes('/events') && fullPath.includes('/events')) {
                    const categoryMatch = matchPath.match(/category=(\w+)/);
                    if (categoryMatch) {
                        return fullPath.includes(`category=${categoryMatch[1]}`);
                    }
                    return true;
                }
                return false;
            });
        });
        
        if (index !== -1) {
            setActiveIndex(index);
            setSelectedIndex(index);
            
            // Rotate wheel to show active page at top (only on initial mount)
            const segmentAngle = 360 / MENU_ITEMS.length;
            const targetRotation = -index * segmentAngle;
            setRotationAngle(targetRotation);
        } else {
            // For login/register pages or any other page not in menu, remove selection
            setActiveIndex(-1);
            setSelectedIndex(-1);
        }
    }, [pathname, isMounted]);

    // Calculate center position when menu opens
    useEffect(() => {
        if (isOpen && typeof window !== 'undefined') {
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

            // Determine which segment the mouse is in
            const segmentAngle = 360 / MENU_ITEMS.length;
            // Account for current rotation
            const adjustedAngle = (angle - rotationAngle + segmentAngle / 2 + 360) % 360;
            const segmentIndex = Math.floor(adjustedAngle / segmentAngle);
            setHoveredIndex(segmentIndex % MENU_ITEMS.length);
        } else if (distance <= 50) {
            setHoveredIndex(null);
            setMouseAngle(null);
        }
    }, [isOpen, rotationAngle]);

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [isOpen, handleMouseMove]);

    // Keyboard shortcut: Q to toggle menu, Left/Right to select, Enter to navigate
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger if user is typing in an input/textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }

            if (e.key === 'q' || e.key === 'Q') {
                e.preventDefault();
                toggleMenu();
            }

            // Arrow keys and Enter only work when menu is open
            if (isOpen) {
                const segmentAngle = 360 / MENU_ITEMS.length;

                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    // Rotate counterclockwise (previous item) - still forward motion
                    const newIndex = (selectedIndex - 1 + MENU_ITEMS.length) % MENU_ITEMS.length;
                    const stepsForward = (newIndex - selectedIndex + MENU_ITEMS.length) % MENU_ITEMS.length;
                    setSelectedIndex(newIndex);
                    setRotationAngle(rotationAngle - stepsForward * segmentAngle);
                    playHowl(rotateSound);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    // Rotate clockwise (next item) - forward motion
                    const newIndex = (selectedIndex + 1) % MENU_ITEMS.length;
                    const stepsForward = (newIndex - selectedIndex + MENU_ITEMS.length) % MENU_ITEMS.length;
                    setSelectedIndex(newIndex);
                    setRotationAngle(rotationAngle - stepsForward * segmentAngle);
                    playHowl(rotateSound);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    // Navigate to selected page
                    handleItemClick({ preventDefault: () => { } }, selectedIndex);
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    setIsOpen(false);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, showHint, selectedIndex]);

    const toggleMenu = () => {
        if (!isOpen) {
            playHowl(openSound);
        }
        // Hide hint when user clicks the menu
        if (showHint) {
            setShowHint(false);
            localStorage.setItem('menu_hint_seen', 'true');
        }
        // Sync selected index with active index when opening
        if (!isOpen) {
            setSelectedIndex(activeIndex);
        }
        setIsOpen(!isOpen);
        setHoveredIndex(null);
        setMouseAngle(null);
    };

    const handleItemClick = (e, index) => {
        e.preventDefault(); // Prevent default Link navigation

        // If dragging on mobile, don't navigate
        if (isDraggingRef.current) {
            return;
        }

        const targetHref = MENU_ITEMS[index].href;

        // Calculate rotation using modulo to always go forward
        const segmentAngle = 360 / MENU_ITEMS.length;

        // Normalize current rotation to 0-359 range
        const normalizedCurrent = ((rotationAngle % 360) + 360) % 360;

        // Calculate current index based on normalized rotation
        const currentNormalizedIndex = Math.round(-normalizedCurrent / segmentAngle) % MENU_ITEMS.length;

        // Calculate steps to move forward (always clockwise)
        const stepsForward = (index - currentNormalizedIndex + MENU_ITEMS.length) % MENU_ITEMS.length;

        // If no movement needed, don't rotate
        if (stepsForward === 0) {
            router.push(targetHref);
            setIsOpen(false);
            return;
        }

        // Always rotate clockwise (negative = clockwise)
        const delta = -stepsForward * segmentAngle;
        const newRotation = rotationAngle + delta;

        // Play rotation sound
        playHowl(rotateSound);

        // Animate rotation
        setRotationAngle(newRotation);
        setActiveIndex(index);
        setSelectedIndex(index);

        // Wait for rotation animation, then navigate and close
        setTimeout(() => {
            router.push(targetHref);
            setIsOpen(false);
            setHoveredIndex(null);
        }, 500);
    };

    // Touch handlers for mobile rotation
    const getTouchAngle = (touch) => {
        const cx = centerRef.current.x;
        const cy = centerRef.current.y;
        const dx = touch.clientX - cx;
        const dy = touch.clientY - cy;
        return Math.atan2(dy, dx) * (180 / Math.PI);
    };

    const handleTouchStart = (e) => {
        if (!isMobile || !isOpen) return;

        const touch = e.touches[0];
        const cx = centerRef.current.x;
        const cy = centerRef.current.y;
        const dx = touch.clientX - cx;
        const dy = touch.clientY - cy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Only start dragging if touch is on the wheel (not center button)
        if (distance > 40 && distance < 180) {
            touchStartRef.current = {
                angle: getTouchAngle(touch),
                rotation: rotationAngle
            };
            isDraggingRef.current = false;
        }
    };

    const handleTouchMove = (e) => {
        if (!isMobile || !isOpen || touchStartRef.current.angle === undefined) return;

        const touch = e.touches[0];
        const currentAngle = getTouchAngle(touch);
        let deltaAngle = currentAngle - touchStartRef.current.angle;

        // Handle angle wrap-around
        if (deltaAngle > 180) deltaAngle -= 360;
        if (deltaAngle < -180) deltaAngle += 360;

        // Check if we've moved enough to consider it a drag
        if (Math.abs(deltaAngle) > 5) {
            isDraggingRef.current = true;
            setIsDragging(true); // Disable icon transitions
            
            // Play rotation sound while dragging
            if (rotateSound && !rotateSound.playing()) {
                rotateSound.play();
            }
        }

        const newRotation = touchStartRef.current.rotation + deltaAngle;
        setRotationAngle(newRotation);
    };

    const handleTouchEnd = () => {
        if (!isMobile || !isOpen) return;

        // Snap to nearest segment
        const segmentAngle = 360 / MENU_ITEMS.length;
        const nearestIndex = Math.round(-rotationAngle / segmentAngle) % MENU_ITEMS.length;
        const snappedIndex = (nearestIndex + MENU_ITEMS.length) % MENU_ITEMS.length;
        const snappedRotation = -snappedIndex * segmentAngle;

        // Calculate shortest path for snap
        let delta = snappedRotation - rotationAngle;
        while (delta > 180) delta -= 360;
        while (delta < -180) delta += 360;
        const finalRotation = rotationAngle + delta;

        if (isDraggingRef.current) {
            // Re-enable transitions before snapping
            setIsDragging(false);

            // Play sound when snapping
            if (Math.abs(delta) > 1) {
                playHowl(rotateSound);
            }
            setRotationAngle(finalRotation);
            setSelectedIndex(snappedIndex);
        }

        // Reset after a short delay
        setTimeout(() => {
            isDraggingRef.current = false;
        }, 100);

        touchStartRef.current = { angle: undefined, rotation: 0 };
    };

    // Calculate position for each segment's icon (no rotation offset - handled by CSS)
    const getIconPosition = (index) => {
        const total = MENU_ITEMS.length;
        const segmentAngle = 360 / total;
        const angle = index * segmentAngle; // 0 = top
        // Desktop: (65+195)/2=130, Mobile: (45+135)/2=90
        const radius = isMobile ? 90 : 130;

        const rad = (angle - 90) * (Math.PI / 180);
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;

        return { x, y, angle };
    };

    // Generate SVG path for a pie segment (no rotation offset - handled by CSS)
    const getSegmentPath = (index) => {
        const total = MENU_ITEMS.length;
        const segmentAngle = 360 / total;
        const startAngle = index * segmentAngle - segmentAngle / 2 - 90;
        const endAngle = startAngle + segmentAngle;

        // Desktop vs Mobile radii
        const innerRadius = isMobile ? 45 : 65;
        const outerRadius = isMobile ? 135 : 195;

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

            {/* Toggle Button with pulse animation for new users */}
            <button className={`${styles.toggleBtn} ${showHint ? styles.pulsing : ''}`} onClick={toggleMenu}>
                <i className={`ri-compass-3-line ${styles.menuIcon}`}></i>
                <i className={`ri-close-line ${styles.closeIcon}`}></i>
            </button>

            {/* First-time user hint tooltip - click to dismiss */}
            {showHint && (
                <div
                    className={styles.menuHint}
                    onClick={() => {
                        setShowHint(false);
                        localStorage.setItem('menu_hint_seen', 'true');
                    }}
                >
                    <span>Click to navigate</span>
                    <div className={styles.hintArrow}></div>
                </div>
            )}

            {/* Pie Menu - only render after mount to avoid hydration mismatch */}
            {isMounted && (
                <div
                    className={styles.pieMenu}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Rotating container for segments and icons */}
                    <div
                        className={`${styles.rotatingContainer} ${isDraggingRef.current ? styles.dragging : ''}`}
                        style={{ transform: `rotate(${rotationAngle}deg)` }}
                    >
                        <svg
                            viewBox={isMobile ? "-180 -180 360 360" : "-210 -210 420 420"}
                            className={styles.pieSvg}
                        >
                            {/* Segment backgrounds */}
                            {MENU_ITEMS.map((item, index) => {
                                const isHovered = hoveredIndex === index;
                                const isActive = activeIndex === index;
                                const isSelected = selectedIndex === index;

                                return (
                                    <g key={index}>
                                        {/* Segment path */}
                                        <path
                                            d={getSegmentPath(index)}
                                            className={`${styles.segment} ${isHovered ? styles.segmentHovered : ''} ${isActive ? styles.segmentActive : ''} ${isSelected ? styles.segmentSelected : ''}`}
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
                            const isSelected = selectedIndex === index;

                            return (
                                <a
                                    key={index}
                                    href={item.href}
                                    className={`${styles.segmentIcon} ${isHovered ? styles.iconHovered : ''} ${isActive ? styles.iconActive : ''} ${isSelected ? styles.iconSelected : ''} ${isDragging ? styles.iconDragging : ''}`}
                                    style={{
                                        '--x': `${pos.x}px`,
                                        '--y': `${pos.y}px`,
                                        // Counter-rotate icons so they stay upright
                                        '--counter-rotate': `${-rotationAngle}deg`,
                                    }}
                                    onClick={(e) => handleItemClick(e, index)}
                                >
                                    <i className={item.icon}></i>
                                    <span className={styles.iconLabel}>{item.label}</span>
                                </a>
                            );
                        })}
                    </div>

                    {/* Center circle with close button only */}
                    <button className={styles.centerCircle} onClick={() => setIsOpen(false)}>
                        <i className="ri-close-line" style={{ fontSize: 20, color: '#c72071' }}></i>
                    </button>
                </div>
            )}
        </nav>
    );
}