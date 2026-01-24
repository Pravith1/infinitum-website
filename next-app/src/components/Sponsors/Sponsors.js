"use client";

import React from 'react';
import styles from './Sponsors.module.css';

// Mock data schema as requested: [{logo: image_url, type: string}]
// Leaving empty initially to show "To be announced" or can be populated.
const SPONSORS_DATA = [
    {logo: "/images/sponsors/psiog_logo.jpg", type: "Title Sponsor", link: "https://psiog.com/"},
    {text: "BE CSE 2002 Batch Alumnus", type: "Event Sponsor"},
    {logo: "/images/sponsors/dossier.nexus.png", type: "Tech Partner", link: "https://www.dossier.nexus/"},
    {logo: "/images/sponsors/revline.png", type: "Other Sponsor", link: "https://rev-line-gamma.vercel.app/"}
];

export default function Sponsors() {
    // Group data by type
    const groupedSponsors = SPONSORS_DATA.reduce((acc, sponsor) => {
        const { type } = sponsor;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(sponsor);
        return acc;
    }, {});

    const hasSponsors = Object.keys(groupedSponsors).length > 0;

    return (
        <section className={styles.container}>
            <h2 className={styles.heading}>Sponsors</h2>

            {!hasSponsors ? (
                <div className={styles.toBeAnnounced}>
                    To Be Announced
                </div>
            ) : (
                <div className={styles.sponsorsList}>
                    {Object.entries(groupedSponsors).map(([type, sponsors], index) => (
                        <div
                            key={type}
                            className={styles.group}
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            <h3 className={styles.groupTitle}>{type}</h3>
                            <div className={styles.row}>
                                {sponsors.map((sponsor, idx) => (
                                    <div key={idx} className={styles.sponsorCard}>
                                        {sponsor.link ? (
                                            <a href={sponsor.link} target="_blank" rel="noopener noreferrer">
                                                {sponsor.logo ? (
                                                    <img src={sponsor.logo} alt={`${type} - Sponsor`} className={styles.sponsorlogo} />
                                                ) : (
                                                    <span className={styles.sponsorText}>{sponsor.text}</span>
                                                )}
                                            </a>
                                        ) : (
                                            sponsor.logo ? (
                                                <img src={sponsor.logo} alt={`${type} - Sponsor`} className={styles.logo} />
                                            ) : (
                                                <span className={styles.sponsorText}>{sponsor.text}</span>
                                            )
                                        )}
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
