'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ShutterContext = createContext(null);

export function ShutterProvider({ children }) {
    const [shutterState, setShutterState] = useState('idle'); // idle, closing, closed, opening
    const midpointCallbackRef = useRef(null);
    const completeCallbackRef = useRef(null);
    const audioRef = useRef(null);

    // Play shutter sound using deploy.mp3
    const playShutterSound = useCallback(() => {
        try {
            if (!audioRef.current) {
                audioRef.current = new Audio('/sounds/deploy.mp3');
            }
            audioRef.current.currentTime = 0;
            audioRef.current.volume = 0.5;
            audioRef.current.play().catch(() => { });
        } catch (e) {
            // Audio not supported, continue silently
        }
    }, []);

    const triggerShutter = useCallback((onMidpoint, onComplete) => {
        if (shutterState !== 'idle') return;

        midpointCallbackRef.current = onMidpoint;
        completeCallbackRef.current = onComplete;

        // Start closing
        setShutterState('closing');
        window.dispatchEvent(new CustomEvent('shutter-state-change', { detail: { shutterState: 'closing' } }));
        playShutterSound();

        // Closing animation duration
        setTimeout(() => {
            setShutterState('closed');
            window.dispatchEvent(new CustomEvent('shutter-state-change', { detail: { shutterState: 'closed' } }));

            // Call midpoint callback - this is when content should swap
            if (midpointCallbackRef.current) {
                midpointCallbackRef.current();
            }

            // Brief pause at closed, then open
            setTimeout(() => {
                setShutterState('opening');
                window.dispatchEvent(new CustomEvent('shutter-state-change', { detail: { shutterState: 'opening' } }));
                playShutterSound();

                // Opening animation duration
                setTimeout(() => {
                    setShutterState('idle');
                    window.dispatchEvent(new CustomEvent('shutter-state-change', { detail: { shutterState: 'idle' } }));
                    if (completeCallbackRef.current) {
                        completeCallbackRef.current();
                    }
                }, 400);
            }, 100);
        }, 400);
    }, [shutterState, playShutterSound]);

    return (
        <ShutterContext.Provider value={{ shutterState, triggerShutter }}>
            {children}
        </ShutterContext.Provider>
    );
}

export function useShutter() {
    const context = useContext(ShutterContext);
    if (!context) {
        return { shutterState: 'idle', triggerShutter: () => { } };
    }
    return context;
}
