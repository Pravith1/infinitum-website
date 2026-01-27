"use client";

import React from 'react';
import styles from './Sponsors.module.css';

// Mock data schema as requested: [{logo: image_url, type: string}]
// Leaving empty initially to show "To be announced" or can be populated.
const SPONSORS_DATA = [
    { logo: "/images/sponsors/psiog_logo.png", type: "Title Sponsor", link: "https://psiog.com/" },
    { text: "BE CSE 2002 Batch Alumnus", type: "Event Sponsor" },
    { logo: "/images/sponsors/dossier.nexus.png", type: "Tech Partner", link: "https://www.dossier.nexus/" },
    { logo: "/images/sponsors/revline.png", type: "Other Sponsor", link: "https://rev-line-gamma.vercel.app/" }
];

export default function Sponsors() {
    const hasSponsors = SPONSORS_DATA.length > 0;


    return (
        <section className={styles.container}>
            <h2 className={styles.heading}>Sponsors</h2>

            {!hasSponsors ? (
                <div className={styles.toBeAnnounced}>
                    To Be Announced
                </div>
            ) : (
                /* Unified Layout - Horizontal on Desktop, Vertical on Mobile */
                <div className={styles.sponsorsWrapper}>
                    <div className={styles.sponsorsScroll}>
                        {SPONSORS_DATA.map((sponsor, idx) => (
                            <div key={idx} className={styles.sponsorItem}>
                                <div className={styles.sponsorCard}>
                                    {sponsor.link ? (
                                        <a href={sponsor.link} target="_blank" rel="noopener noreferrer">
                                            {sponsor.logo ? (
                                                <img src={sponsor.logo} alt={`${sponsor.type}`} className={styles.sponsorlogo} />
                                            ) : (
                                                <span className={styles.sponsorText}>{sponsor.text}</span>
                                            )}
                                        </a>
                                    ) : (
                                        sponsor.logo ? (
                                            <img src={sponsor.logo} alt={`${sponsor.type}`} className={styles.sponsorlogo} />
                                        ) : (
                                            <span className={styles.sponsorText}>{sponsor.text}</span>
                                        )
                                    )}
                                </div>
                                <p className={styles.sponsorType}>{sponsor.type}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
