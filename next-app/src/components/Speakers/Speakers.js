"use client";

import React from 'react';
import styles from './Speakers.module.css';

// Schema: { image: string, name: string, type: string }
const SPEAKERS_DATA = [
    // Example data (Uncomment to test)
    // {
    //     image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/800px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg",
    //     name: "Steve Jobs",
    //     type: "Chief Guest"
    // },

    // {
    //     image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Elon_Musk_%283017880307%29_%28cropped%29.jpg/640px-Elon_Musk_%283017880307%29_%28cropped%29.jpg",
    //     name: "Elon Musk",
    //     type: "Keynote Speaker"
    // }
];

export default function Speakers() {
    // Group data by type
    const groupedSpeakers = SPEAKERS_DATA.reduce((acc, speaker) => {
        const { type } = speaker;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(speaker);
        return acc;
    }, {});

    const hasSpeakers = Object.keys(groupedSpeakers).length > 0;

    return (
        <section className={styles.container}>
            <h2 className={styles.heading}>Mentors & Speakers</h2>

            {!hasSpeakers ? (
                <div className={styles.toBeAnnounced}>
                    To Be Announced
                </div>
            ) : (
                <div className={styles.speakersList}>
                    {Object.entries(groupedSpeakers).map(([type, speakers], index) => (
                        <div
                            key={type}
                            className={styles.group}
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            <h3 className={styles.groupTitle}>{type}</h3>
                            <div className={styles.row}>
                                {speakers.map((speaker, idx) => (
                                    <div key={idx} className={styles.card}>
                                        <div className={styles.imageContainer}>
                                            <img
                                                src={speaker.image}
                                                alt={speaker.name}
                                                className={styles.image}
                                            />
                                        </div>
                                        <div className={styles.info}>
                                            <h4 className={styles.name}>{speaker.name}</h4>
                                            <span className={styles.type}>{speaker.type}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
