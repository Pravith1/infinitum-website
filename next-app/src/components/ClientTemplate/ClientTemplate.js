'use client'
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { withStyles } from '@/tools/withStyles';
import { Layout } from '@/components/Layout';
import { App } from '@/components/App';
import { Popup } from '@/components/Popup';
import { styles } from './ClientTemplate.styles';

// Dynamically import Background with SSR disabled to prevent hydration mismatches
const Background = dynamic(
    () => import('@/components/Background').then(mod => mod.Background),
    { ssr: false }
);

const Template = (props) => {
    const { classes, theme, children } = props;
    const pathname = usePathname();

    // Check if user has already seen the popup (using localStorage)
    const [hasSeenPopup, setHasSeenPopup] = useState(true); // Default to true to prevent flash
    const [show, setShow] = useState(false);
    const [enterShow, setEnterShow] = useState(false);
    const [enterAnimationShow, setEnterAnimationShow] = useState(true);

    const enterElementRef = useRef(null);

    useEffect(() => {
        // Check localStorage for previous visit
        const seen = localStorage.getItem('infinitum_popup_seen');

        if (seen) {
            // User has seen popup before, skip it and show site immediately
            setHasSeenPopup(true);
            setShow(true);

            // Unlock audio on first user interaction (required by browser autoplay policy)
            const unlockAudio = () => {
                // Import Howler dynamically and unlock audio
                import('howler').then(({ Howler }) => {
                    // Create a silent sound and play it to unlock audio context
                    if (Howler.ctx && Howler.ctx.state === 'suspended') {
                        Howler.ctx.resume();
                    }
                }).catch(() => {
                    // Howler not available, ignore
                });
                // Remove listeners after first interaction
                document.removeEventListener('click', unlockAudio);
                document.removeEventListener('touchstart', unlockAudio);
                document.removeEventListener('keydown', unlockAudio);
            };

            document.addEventListener('click', unlockAudio, { once: true });
            document.addEventListener('touchstart', unlockAudio, { once: true });
            document.addEventListener('keydown', unlockAudio, { once: true });

            return () => {
                document.removeEventListener('click', unlockAudio);
                document.removeEventListener('touchstart', unlockAudio);
                document.removeEventListener('keydown', unlockAudio);
            };
        } else {
            // First visit, show the popup
            setHasSeenPopup(false);
            const timeout = setTimeout(
                () => setEnterShow(true),
                theme.animation.time || 250
            );
            return () => clearTimeout(timeout);
        }
    }, [theme]);

    const onEnter = () => {
        // Mark popup as seen in localStorage
        localStorage.setItem('infinitum_popup_seen', 'true');

        // Fade out popup
        setEnterAnimationShow(false);

        // After popup fades, trigger main site animations
        setTimeout(
            () => setShow(true),
            (theme.animation.time || 250) + (theme.animation.stagger || 50)
        );
    };

    const isURLContent = ['/news', '/music', '/charity', '/events'].find(path => {
        return pathname.startsWith(path);
    });

    const layoutProps = {};
    const backgroundProps = {};

    return (
        <Layout {...layoutProps}>
            <Background
                {...backgroundProps}
                animation={{ show, ...(backgroundProps.animation || {}) }}
            >
                {isURLContent ? <App>{children}</App> : children}

                {!show && !hasSeenPopup && (
                    <div className={classes.enterOverlay}>
                        {enterShow && (
                            <Popup
                                className={classes.enterElement}
                                ref={enterElementRef}
                                audio={{ silent: true }}
                                animation={{ independent: true, show: enterAnimationShow }}
                                message='Infinitum.com uses sounds.'
                                option='Enter'
                                onOption={onEnter}
                            />
                        )}
                    </div>
                )}
            </Background>
        </Layout>
    );
};

export default withStyles(styles)(Template);
