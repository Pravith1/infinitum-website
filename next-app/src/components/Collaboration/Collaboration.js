"use client";

import React from 'react';
import Image from 'next/image';
import styles from './Collaboration.module.css';

export default function Collaboration() {
    return (
        <section className={styles.collaboration}>
            <h2 className={styles.title}>In Association With</h2>
            <div className={styles.logos}>
                <a
                    href="https://ghcc.psgtech.ac.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.logoLink}
                >
                    <Image
                        src="/images/github.png"
                        alt="GitHub Campus Club"
                        width={80}
                        height={80}
                        className={styles.logo}
                    />
                    <span className={styles.subtitle}>GHCC</span>
                </a>
                <a
                    href="https://theeye.psgtech.ac.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.logoLink}
                >
                    <Image
                        src="/images/eye.png"
                        alt="The Eye"
                        width={120}
                        height={120}
                        className={styles.logo}
                    />
                    <span className={styles.subtitle}>The Eye</span>
                </a>
            </div>
        </section>
    );
}
