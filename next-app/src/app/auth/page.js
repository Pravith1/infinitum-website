'use client';

import { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Main } from '@/components/Main';
import { Secuence } from '@/components/Secuence';
import { useShutter } from '@/context/ShutterContext';
import LoginComponent from './components/LoginComponent';
import RegisterModeComponent from './components/RegisterModeComponent';
import SendEmailComponent from './components/SendEmailComponent';
import RegisterComponent from './components/RegisterComponent';
import CallbackComponent from './components/CallbackComponent';
import VerifyEmailComponent from './components/VerifyEmailComponent';
import ForgotPasswordComponent from './components/ForgotPasswordComponent';
import './auth.css';

function AuthContent() {
    const searchParams = useSearchParams();
    const { triggerShutter, shutterState } = useShutter();
    const type = searchParams.get('type') || 'login';

    const [currentType, setCurrentType] = useState(type);
    const [isFlickering, setIsFlickering] = useState(false);
    const isFirstRender = useRef(true);
    const previousType = useRef(type);

    useEffect(() => {
        // Skip shutter on first render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            previousType.current = type;
            return;
        }

        // Only trigger shutter if type actually changed
        if (type !== previousType.current) {
            previousType.current = type;

            triggerShutter(
                // onMidpoint - swap content when shutter is closed
                () => {
                    setCurrentType(type);
                    setIsFlickering(true);
                },
                // onComplete - remove flickering class
                () => {
                    setTimeout(() => setIsFlickering(false), 600);
                }
            );
        }
    }, [type, triggerShutter]);

    const renderComponent = () => {
        switch (currentType) {
            case 'login':
                return <LoginComponent />;
            case 'register':
                return <RegisterModeComponent />;
            case 'send-email':
                return <SendEmailComponent />;
            case 'complete-registration':
                return <RegisterComponent />;
            case 'callback':
                return <CallbackComponent />;
            case 'verify-email':
                return <VerifyEmailComponent />;
            case 'forgot-password':
                return <ForgotPasswordComponent />;
            default:
                return <LoginComponent />;
        }
    };

    return (
        <div className={`auth-content-wrapper ${isFlickering ? 'content-flickering' : ''}`}>
            {renderComponent()}
        </div>
    );
}

export default function AuthPage() {
    return (
        <Main noFrame>
            <Secuence stagger>
                <Suspense fallback={<div>Loading...</div>}>
                    <AuthContent />
                </Suspense>
            </Secuence>
        </Main>
    );
}