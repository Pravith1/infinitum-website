'use client';

import React, { useState, useEffect } from 'react';
import './GrievanceButton.css';

// Replace this with your actual Google Form URL
const GRIEVANCE_FORM_URL = 'https://forms.google.com/your-form-url';

export default function GrievanceButton() {
    const [showHint, setShowHint] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        
        // Check if user has seen the grievance hint before
        const hasSeenHint = localStorage.getItem('grievance_hint_seen');
        
        if (!hasSeenHint) {
            // Show hint after a short delay to not overwhelm on page load
            const showTimer = setTimeout(() => {
                setShowHint(true);
            }, 2000);
            
            // Auto-hide hint after 6 seconds (2s delay + 6s visible = 8s total)
            const hideTimer = setTimeout(() => {
                setShowHint(false);
                localStorage.setItem('grievance_hint_seen', 'true');
            }, 8000);
            
            return () => {
                clearTimeout(showTimer);
                clearTimeout(hideTimer);
            };
        }
    }, []);

    const handleClick = () => {
        // Dismiss hint when button is clicked
        if (showHint) {
            setShowHint(false);
            localStorage.setItem('grievance_hint_seen', 'true');
        }
        window.open(GRIEVANCE_FORM_URL, '_blank', 'noopener,noreferrer');
    };

    const dismissHint = () => {
        setShowHint(false);
        localStorage.setItem('grievance_hint_seen', 'true');
    };

    return (
        <>
            {/* The button */}
            <div className="grievance-container">
                <button
                    className={`grievance-button ${showHint ? 'pulsing' : ''}`}
                    onClick={handleClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    aria-label="Submit a grievance"
                >
                    <i className="ri-feedback-line"></i>
                </button>

                {/* Hover tooltip */}
                {isHovered && !showHint && (
                    <div className="grievance-tooltip">
                        <span>Report a Grievance</span>
                    </div>
                )}
            </div>

            {/* First-time user hint - rendered as fixed element outside container */}
            {isMounted && showHint && (
                <div className="grievance-hint" onClick={dismissHint}>
                    <span>Have a concern? Report it here</span>
                    <div className="grievance-hint-arrow"></div>
                </div>
            )}
        </>
    );
}
