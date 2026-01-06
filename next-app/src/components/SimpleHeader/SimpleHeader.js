"use client";

import React from 'react';
import Image from 'next/image';
import styles from './SimpleHeader.module.css';

export default function SimpleHeader() {
    return (
        <header className={styles.header}>
            {/* Left side - Infinitum Logo */}
            <div className={styles.leftSection}>
                <Image
                    src="/images/Infinitum.png"
                    alt="Infinitum Logo"
                    width={120}
                    height={40}
                    className={styles.logo}
                    priority
                />
            </div>

            {/* Right side - Organization logos and menu */}
            <div className={styles.rightSection}>
                <div className={styles.orgLogos}>
                    <Image
                        src="/images/PSGLogo.png"
                        alt="PSG Logo"
                        height={40}
                        width={40}
                        className={styles.orgLogo}
                    />
                    <Image
                        src="/images/CSEA.png"
                        alt="CSEA Logo"
                        width={40}
                        height={40}
                        className={styles.orgLogo}
                    />
                    <Image
                        src="/images/Year75w.png"
                        alt="Year 75 Logo"
                        width={40}
                        height={40}
                        className={styles.orgLogo}
                    />
                </div>
            </div>
        </header>
    );
}
