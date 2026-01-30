"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './FAQ.module.css';
import { useSound } from '@/context/SoundContext';

// ============================================================
// FAQ DATA - Easy to add/remove FAQs here
// ============================================================
// Schema: { question: string, answer: string | JSX }
// Simply add or remove objects from this array to manage FAQs
// For answers with links, use JSX: answer: <>Text <a href="url">link</a></>
// ============================================================
const FAQ_DATA = [
    {
        question: "What is Infinitum?",
        answer: "Infinitum 2026 is the flagship technical fest of the Computer Science and Engineering Association (CSEA), PSG College of Technology. Designed to ignite innovation and creativity, Infinitum brings together students from diverse backgrounds to compete, collaborate, and learn."
    },
    {
        question: "Will accommodation be provided?",
        answer: <>Yes, accommodation will be provided! You can register for accommodation through your profile page. <a href="/portal/profile?tab=accommodation" style={{ color: '#00d4ff', textDecoration: 'underline' }}>Click here to register</a>.</>
    },
    {
        question: "When and where is Infinitum being held?",
        answer: "Infinitum 2026 will be held on February 13 & 14, 2026 at PSG College of Technology. Each event takes place in different locations within the college campus – you can find the specific venue details on each event's detail page."
    },
    {
        question: "How can I register for events?",
        answer: "You can register for events through our official website. Click on the 'Register' button in the navigation menu or visit the specific event page to complete your registration."
    },
    {
        question: "Is there a registration fee?",
        answer: <>Yes. For events (including technical events, flagship event, and paper presentations), non-PSG students pay a general registration fee of ₹150. Students from PSG College of Technology and PSG iTech are exempt from this fee. For workshops, the fee is ₹350 for all participants – no exemptions apply. <strong>Please note that registrations are non-refundable.</strong> <a href="/fee-payment" style={{ color: '#00d4ff', textDecoration: 'underline' }}>Click here to pay now</a>.</>
    },
    {
        question: "Can I participate in multiple events?",
        answer: "Yes! You can participate in multiple events as long as the timings don't conflict. We encourage participants to explore various events and make the most of Infinitum."
    },
    {
        question: "Are there any prizes for winners?",
        answer: "Absolutely! We have an exciting prize pool of ₹1,00,000 distributed across various events. Top performers will receive cash prizes and certificates."
    },
    {
        question: "How can I contact the organizers?",
        answer: "Each event page lists the organizer's name and phone number for direct queries. For general inquiries, tech support, or accommodation assistance, check the footer section of our website for the relevant contact details."
    }
];

export default function FAQ() {
    const { isMuted } = useSound();
    const [openIndex, setOpenIndex] = useState(null);
    const contentRefs = useRef({});

    // Audio ref for click sound
    const clickSoundRef = useRef(null);

    // Initialize audio on mount
    useEffect(() => {
        clickSoundRef.current = new Audio('/sounds/hover.mp3');
        clickSoundRef.current.volume = 0.3;
    }, []);

    // Play sound helper
    const playClickSound = () => {
        if (isMuted) return;
        if (clickSoundRef.current) {
            clickSoundRef.current.currentTime = 0;
            clickSoundRef.current.play().catch(() => { });
        }
    };

    const toggleFAQ = (index) => {
        playClickSound();
        setOpenIndex(openIndex === index ? null : index);
    };

    const hasFAQs = FAQ_DATA.length > 0;

    return (
        <section className={styles.container}>
            <h2 className={styles.heading}>FAQ</h2>

            {!hasFAQs ? (
                <div className={styles.noFAQs}>
                    Coming Soon
                </div>
            ) : (
                <div className={styles.faqList}>
                    {FAQ_DATA.map((faq, index) => (
                        <div
                            key={index}
                            className={`${styles.faqItem} ${openIndex === index ? styles.active : ''}`}
                        >
                            <button
                                className={styles.question}
                                onClick={() => toggleFAQ(index)}
                                aria-expanded={openIndex === index}
                                aria-controls={`faq-answer-${index}`}
                            >
                                <span className={styles.questionText}>{faq.question}</span>
                                <span className={styles.icon}>
                                    <span className={styles.iconLine}></span>
                                    <span className={`${styles.iconLine} ${styles.iconLineVertical}`}></span>
                                </span>
                            </button>
                            <div
                                id={`faq-answer-${index}`}
                                className={styles.answerWrapper}
                                ref={el => contentRefs.current[index] = el}
                            >
                                <div className={styles.answer}>
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
