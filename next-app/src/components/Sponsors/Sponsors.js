"use client";

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './Sponsors.module.css';

// Mock data schema as requested: [{logo: image_url, type: string}]
// Leaving empty initially to show "To be announced" or can be populated.
const SPONSORS_DATA = [
    { logo: "/images/sponsors/psiog_logo.jpg", type: "Title Sponsor", link: "https://psiog.com/" },
    { text: "BE CSE 2002 Batch Alumnus", type: "Event Sponsor" },
    { logo: "/images/sponsors/dossier.nexus.png", type: "Tech Partner", link: "https://www.dossier.nexus/" },
    { logo: "/images/sponsors/revline.png", type: "Other Sponsor", link: "https://rev-line-gamma.vercel.app/" }
];

export default function Sponsors() {
    const hasSponsors = SPONSORS_DATA.length > 0;
    const [isMobile, setIsMobile] = useState(false);

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <section className={styles.container}>
            <h2 className={styles.heading}>Sponsors</h2>

            {!hasSponsors ? (
                <div className={styles.toBeAnnounced}>
                    To Be Announced
                </div>
            ) : isMobile ? (
                /* Mobile: Swiper Carousel */
                <div className={styles.swiperContainer}>
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={20}
                        slidesPerView={1.2}
                        centeredSlides={true}
                        loop={true}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        pagination={{ clickable: true }}
                        className={styles.swiper}
                    >
                        {SPONSORS_DATA.map((sponsor, idx) => (
                            <SwiperSlide key={idx}>
                                <div className={styles.sponsorItem}>
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
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : (
                /* Desktop: Horizontal Layout */
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
