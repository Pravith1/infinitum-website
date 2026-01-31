"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './Speakers.module.css';
import { useSound } from '@/context/SoundContext';

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
    {
        image: "/images/speakers/subramanian.jpg",
        name: "K Subramanian",
        designation: "Former Global Head of Delivery and Governance , Tata Consultancy Services",
        type: "Speakers"
    },
    {
        image: "/images/speakers/savitha-ramesh.jpg",
        name: "Savitha Ramesh",
        designation: "Vice President-Head of Services Delivery, Psiog Digital",
        type: "Speakers"
    },
    {
        image: "/images/speakers/jansirani.jpg",
        name: "Jansi Rani S",
        designation: "Director - Technology, Verticurl",
        type: "Speakers"
    },
    {
        image: "/images/speakers/senthilkumar.jpg",
        name: "Senthilkumar S",
        designation: "Founder CEO - Open Netrikkan Pvt Ltd",
        type: "Speakers"
    },
    {
        image: "/images/speakers/supriya.jpg",
        name: "Supriya Rajamanickam",
        designation: "Senior Technical Leader, Cisco Systems",
        type: "Speakers"
    },
    {
        image: "/images/speakers/Balaraman.jpeg",
        name: "Balasankar Raman",
        designation: "Principal Engineer, Cisco Systems",
        type: "Speakers"
    },
    {
        image: "/images/speakers/shankar.jpg",
        name: "Shankar Gopalakrishnan",
        designation: "Principal Engineer, Cisco Systems",
        type: "Speakers"
    },
    {
        image: "/images/speakers/priyanka-raghavan.jpg",
        name: "Priyanka Raghavan",
        designation: "Co-Founder, Securacy.ai",
        type: "Speakers"
    },
    {
        image: "/images/speakers/karthick.jpg",
        name: "Karthik Ramachandran",
        designation: "Program Manager, Bosch Global Software Technologies",
        type: "Speakers"
    },
    {
        image: "/images/speakers/kapil.jpeg",
        name: "Kapil",
        designation: "Founder/CEO, dossier.nexus",
        type: "Speakers"
    },
    {
        image: "/images/speakers/soundarrajan.jpg",
        name: "Soundarrajan S N",
        designation: "Associate Director of Technology, Verticurl",
        type: "Speakers"
    },
    {
        image: "/images/speakers/ragunanth.jpg",
        name: "Ragunath P K",
        designation: "Associate Director of Technology / Solution Lead, Verticurl",
        type: "Speakers"
    },
    {
        image: "/images/speakers/raghuram.jpg",
        name: "Raghu ram",
        designation: "Staff Software Architect, GE Healthcare",
        type: "Speakers"
    },
    {
        image: "/images/speakers/mahesh.jpg",
        name: "Magesh S",
        designation: "Scrum Lead , Visteon India",
        type: "Speakers"
    },
    {
        image: "/images/speakers/radhakrishnan.jpg",
        name: "Radhakrishnan Ramasamy",
        designation: "Senior Engineering Manager, Walmart",
        type: "Speakers"
    },
    {
        image: "/images/speakers/sharan.jpg",
        name: "Sharan S S",
        designation: "Software Engineer, Texas Instruments",
        type: "Speakers"
    },
    {
        image: "/images/speakers/nithin.jpg",
        name: "Nithiin Kathiresan",
        designation: "Founding Engineer, AI PDF",
        type: "Speakers"
    }
];

export default function Speakers() {
    const { isMuted } = useSound();
    const [isMobile, setIsMobile] = useState(false);

    // Audio ref for hover sound
    const hoverSoundRef = useRef(null);

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Initialize audio on mount
    useEffect(() => {
        hoverSoundRef.current = new Audio('/sounds/hover.mp3');
        hoverSoundRef.current.volume = 0.3;
    }, []);

    // Play sound helper - respects mute state
    const playHoverSound = () => {
        if (isMuted) return;
        if (hoverSoundRef.current) {
            hoverSoundRef.current.currentTime = 0;
            hoverSoundRef.current.play().catch(() => { });
        }
    };

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
            <h2 className={styles.heading}>Speakers & Panelists</h2>

            {!hasSpeakers ? (
                <div className={styles.toBeAnnounced}>
                    To Be Announced
                </div>
            ) : isMobile ? (
                /* Mobile: Horizontal Swiper Carousel */
                <div className={styles.swiperContainer}>
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={16}
                        slidesPerView={1.15}
                        centeredSlides={true}
                        loop={true}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        pagination={{ clickable: true }}
                        className={styles.swiper}
                    >
                        {SPEAKERS_DATA.map((speaker, idx) => (
                            <SwiperSlide key={idx}>
                                <div className={styles.card}>
                                    <div className={styles.imageContainer}>
                                        <img
                                            src={speaker.image}
                                            alt={speaker.name}
                                            className={styles.image}
                                        />
                                    </div>
                                    <div className={styles.info}>
                                        <h4 className={styles.name}>{speaker.name}</h4>
                                        {speaker.designation && (
                                            <p className={styles.designation}>{speaker.designation}</p>
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : (
                /* Desktop: Original Grid Layout */
                <div className={styles.speakersList}>
                    {Object.entries(groupedSpeakers).map(([type, speakers], index) => (
                        <div
                            key={type}
                            className={styles.group}
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            {/* <h3 className={styles.groupTitle}>{type}</h3> */}
                            <div className={styles.row}>
                                {speakers.map((speaker, idx) => (
                                    <div key={idx} className={styles.card} onMouseEnter={playHoverSound}>
                                        <div className={styles.imageContainer}>
                                            <img
                                                src={speaker.image}
                                                alt={speaker.name}
                                                className={styles.image}
                                            />
                                        </div>
                                        <div className={styles.info}>
                                            <h4 className={styles.name}>{speaker.name}</h4>
                                            {speaker.designation && (
                                                <p className={styles.designation}>{speaker.designation}</p>
                                            )}
                                            {/* <span className={styles.type}>{speaker.type}</span> */}
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
