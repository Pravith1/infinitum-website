'use client';

import React, { useState, useEffect } from 'react';
import './AnnouncementToasts.css';

const ANNOUNCEMENTS = [
    {
        id: 'thooral-open',
        icon: 'ri-fire-fill',
        title: 'Thooral Hackathon',
        message: 'Join the official WhatsApp group for hackathon updates.',
        type: 'info',
    },
];

export default function AnnouncementToasts() {
    const [toasts, setToasts] = useState([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        
        // Show toasts with staggered delay
        const timers = ANNOUNCEMENTS.map((announcement, index) => {
            return setTimeout(() => {
                setToasts(prev => [...prev, announcement]);
            }, index * 500 + 500); // 500ms between each toast, starting at 500ms
        });

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, []);

    const dismissToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    if (!isMounted) return null;

    return (
        <div className="announcement-toasts-container">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    className={`announcement-toast announcement-toast-${toast.type}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <div className="toast-icon-wrapper">
                        <i className={toast.icon}></i>
                    </div>
                    <div className="toast-content">
                        <div className="toast-title">{toast.title}</div>
                        <div className="toast-message">{toast.message}</div>
                    </div>
                    <button 
                        className="toast-dismiss" 
                        onClick={() => dismissToast(toast.id)}
                        aria-label="Dismiss"
                    >
                        <i className="ri-close-line"></i>
                    </button>
                </div>
            ))}
        </div>
    );
}
