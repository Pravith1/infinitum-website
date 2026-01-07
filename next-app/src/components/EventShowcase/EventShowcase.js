'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { eventService } from '@/services/eventservice';
import { CometCard } from '@/components/ui/comet-card';
import styles from './EventShowcase.module.css';

export default function EventShowcase({ sounds }) {
    const [category, setCategory] = useState('events');
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeEventIndex, setActiveEventIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch events
    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                let items = [];
                if (category === 'events') {
                    const data = await eventService.getAllEvents();
                    if (data.success && data.events) {
                        // Filter out 'thooral' as requested
                        items = data.events.filter(e => !e.eventName.toLowerCase().includes('thooral'));
                    }
                } else if (category === 'workshops') {
                    const data = await eventService.getAllWorkshops();
                    if (data.success && data.workshops) {
                        items = data.workshops.map(w => ({
                            ...w,
                            eventName: w.workshopName,
                            oneLineDescription: w.description ? (w.description.length > 60 ? w.description.substring(0, 60) + '...' : w.description) : 'Technical Workshop',
                            timing: w.time,
                            // Workshop specific
                            isWorkshop: true
                        }));
                    }
                } else if (category === 'papers') {
                    const data = await eventService.getAllPapers();
                    if (data.success && data.papers) {
                        items = data.papers.map(p => ({
                            ...p,
                            eventName: p.eventName || "Paper Presentation",
                            oneLineDescription: p.theme || 'Paper Presentation',
                            timing: p.time,
                            isPaper: true
                        }));
                    }
                }
                setEvents(items);
                setActiveEventIndex(0);
            } catch (error) {
                console.error(`Failed to fetch ${category}`, error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, [category]);

    // Fetch full details for the active item
    useEffect(() => {
        const current = events[activeEventIndex];
        if (!current || current.isFullDetailsLoaded) return;

        let isMounted = true;
        const fetchDetails = async () => {
            try {
                let fullData = null;
                if (category === 'events' && current.eventId) {
                    const res = await eventService.getEventById(current.eventId);
                    if (res && res.success) fullData = res.event;
                } else if (category === 'workshops' && current.workshopId) {
                    const res = await eventService.getWorkshopById(current.workshopId);
                    if (res && res.success) {
                        const w = res.workshop;
                        fullData = {
                            ...w,
                            eventName: w.workshopName,
                            oneLineDescription: w.description ? (w.description.length > 60 ? w.description.substring(0, 60) + '...' : w.description) : 'Technical Workshop',
                            timing: w.time,
                            isWorkshop: true
                        };
                    }
                } else if (category === 'papers' && current.paperId) {
                    const res = await eventService.getPaperById(current.paperId);
                    if (res && res.success) {
                        const p = res.paper;
                        fullData = {
                            ...p,
                            eventName: p.eventName || "Paper Presentation",
                            oneLineDescription: p.theme || 'Paper Presentation',
                            timing: p.time,
                            isPaper: true
                        };
                    }
                }

                if (isMounted && fullData) {
                    setEvents(prev => {
                        const newEvents = [...prev];
                        if (newEvents[activeEventIndex]) {
                             newEvents[activeEventIndex] = { ...newEvents[activeEventIndex], ...fullData, isFullDetailsLoaded: true };
                        }
                        return newEvents;
                    });
                }
            } catch (err) {
                console.error("Error fetching full details:", err);
            }
        };

        const timer = setTimeout(fetchDetails, 100); 
        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [activeEventIndex, category, events]);

    // Lock body scroll when overlay is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isModalOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isModalOpen) {
                if (sounds?.click) sounds.click.play();
                setIsModalOpen(false);
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isModalOpen, sounds]);

    const openModal = () => {
        const audio = new Audio('/sounds/expand.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.error("Audio play failed", e));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (sounds?.click) sounds.click.play();
        setIsModalOpen(false);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    const currentEvent = events[activeEventIndex];

    const handleEventChange = (direction) => {
        if (events.length === 0) return;
        const newIndex = direction === 'next'
            ? (activeEventIndex + 1) % events.length
            : (activeEventIndex - 1 + events.length) % events.length;

        // Play click sound immediately
        if (sounds && sounds.click) {
            sounds.click.play();
        }

        setIsTransitioning(true);

        // Play hover sound during transition
        setTimeout(() => {
            if (sounds && sounds.hover) {
                sounds.hover.play();
            }
        }, 100);

        // Play logo sound as new content appears
        setTimeout(() => {
            setActiveEventIndex(newIndex);
            setIsTransitioning(false);
            if (sounds && sounds.logo) {
                sounds.logo.play();
            }
        }, 300);
    };


    const handleRegister = async () => {
        // Play click sound
        if (sounds && sounds.click) {
            sounds.click.play();
        }

        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        if (!token) {
             alert("Please login to register.");
             return;
        }

        if (!confirm(`Are you sure you want to register for ${currentEvent.eventName}?`)) return;

        try {
            let res;
            if (category === 'events') {
                res = await eventService.registerEvent(currentEvent.eventId);
            } else if (category === 'workshops') {
                res = await eventService.registerWorkshop(currentEvent.workshopId);
            } else if (category === 'papers') {
                res = await eventService.registerPaper(currentEvent.paperId);
            }

            if (res && res.success) {
                alert(res.message || "Registered successfully!");
            } else {
                 alert(res?.message || "Registration failed.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            const msg = error.response?.data?.message || "An error occurred during registration.";
            alert(msg);
        }
    };

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isDropdownOpen && !e.target.closest('.category-dropdown')) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    const dropdownContainerStyle = {
        position: 'absolute',
        top: '100px', // Adjusted to not overlap with potentially hidden header or padding
        left: '40px',
        zIndex: 60,
        pointerEvents: 'auto',
        fontFamily: 'inherit'
    };

    const dropdownToggleStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        background: 'rgba(26, 2, 11, 0.6)', // Theme background main
        border: '1px solid rgba(224, 78, 148, 0.3)', // Theme secondary light
        boxShadow: '0 0 15px rgba(199, 32, 113, 0.2)', // Theme secondary main
        color: '#e04e94', // Theme secondary light
        minWidth: '220px',
        cursor: 'pointer',
        fontSize: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
        userSelect: 'none'
    };

    const dropdownMenuStyle = {
        position: 'absolute',
        top: 'calc(100% + 5px)',
        left: '0',
        width: '100%',
        background: 'rgba(26, 2, 11, 0.95)', // Theme background main
        border: '1px solid rgba(224, 78, 148, 0.2)', // Theme secondary light
        color: '#fff',
        zIndex: 61,
        display: isDropdownOpen ? 'block' : 'none',
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    };

    const dropdownItemStyle = (itemCategory) => ({
        padding: '12px 24px',
        cursor: 'pointer',
        color: category === itemCategory ? '#e04e94' : 'rgba(255, 255, 255, 0.7)',
        background: category === itemCategory ? 'rgba(199, 32, 113, 0.15)' : 'transparent',
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        transition: 'all 0.2s ease',
        borderLeft: category === itemCategory ? '3px solid #e04e94' : '3px solid transparent'
    });

    const categoryLabels = {
        'events': 'Events',
        'workshops': 'Workshops',
        'papers': 'Paper Presentation'
    };

    const currentCategoryLabel = categoryLabels[category];

    const renderDropdown = () => (
        <div style={dropdownContainerStyle} className="category-dropdown">
            <div 
                style={dropdownToggleStyle} 
                onClick={() => {
                    if (sounds?.click) sounds.click.play();
                    setIsDropdownOpen(!isDropdownOpen);
                }}
            >
                <span>{currentCategoryLabel}</span>
                <span style={{ 
                    fontSize: '0.8rem', 
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                }}>▼</span>
            </div>
            <div style={dropdownMenuStyle}>
                {Object.keys(categoryLabels).map((cat) => (
                    <div
                        key={cat}
                        style={dropdownItemStyle(cat)}
                        onClick={() => {
                            if (sounds?.click) sounds.click.play();
                            setCategory(cat);
                            setIsDropdownOpen(false);
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(199, 32, 113, 0.1)';
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = category === cat ? 'rgba(199, 32, 113, 0.15)' : 'transparent';
                            e.currentTarget.style.color = category === cat ? '#e04e94' : 'rgba(255, 255, 255, 0.7)';
                        }}
                    >
                        {categoryLabels[cat]}
                    </div>
                ))}
            </div>
        </div>
    );

    if (!currentEvent && !isLoading && events.length === 0) {
        return (
            <div className={styles.showcase} style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
               {renderDropdown()}
               <div style={{color: 'rgba(255,255,255,0.7)', marginTop: '0', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.1em'}}>No {categoryLabels[category]} available</div>
            </div>
        );
   }

    if (!currentEvent) return null;

    return (
        <div className={styles.showcase}>
            {renderDropdown()}

            {/* Register Button - Top Right */}
            <button className={styles.registerButton} onClick={handleRegister}>
                <span>Register Now</span>
            </button>

            {/* Event Name with Bracket Frame - Moved outside main layout for alignment */}
            <div className={styles.headerContainer}>
                <div className={styles.eventHeader}>
                    <div className={styles.bracket}>
                        <span className={styles.bracketCorner}></span>
                        <span className={styles.bracketCorner}></span>
                    </div>
                    <h1 className={`${styles.eventName} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
                        {currentEvent.eventName}
                    </h1>
                    <div className={styles.bracket}>
                        <span className={styles.bracketCorner}></span>
                        <span className={styles.bracketCorner}></span>
                    </div>
                </div>

                {/* Tagline */}
                <p className={`${styles.tagline} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
                    {currentEvent.oneLineDescription}
                </p>
            </div>

            {/* Main Content Area */}
            <div className={styles.mainContent}>
                {/* Left Stats Panel */}
                <div className={styles.statsPanel}>
                    <div className={styles.statItem}>
                        <div className={styles.statLabel}>Team Size</div>
                        <div className={styles.statValue}>
                            {currentEvent.teamSize === 1 ? 'Individual' : `${currentEvent.teamSize} Members`}
                        </div>
                    </div>

                    <div className={styles.statItem}>
                        <div className={styles.statLabel}>Venue</div>
                        <div className={styles.statValue}>{currentEvent.hall}</div>
                    </div>

                    <div className={styles.statItem}>
                        <div className={styles.statLabel}>Timing</div>
                        <div className={styles.statValue}>{currentEvent.timing}</div>
                    </div>
                </div>

                {/* Center Event Display - Now contains primarily the image */}
                <div className={styles.eventDisplay}>
                    {/* Event Image on Platform */}
                    <div className={styles.eventImageContainer}>
                        {/* Mobile Swipe Indicator (Dots) */}
                        <div className={styles.mobileSwipeIndicator}>
                            {events.map((_, index) => (
                                <span
                                    key={index}
                                    className={`${styles.swipeDot} ${index === activeEventIndex ? styles.activeDot : ''}`}
                                ></span>
                            ))}
                        </div>

                        {/* Navigation Arrows - Using absolute positioning relative to this container which hugs the image */}
                        {events.length > 1 && (
                            <>
                                <button
                                    className={`${styles.navArrow} ${styles.navLeft}`}
                                    onClick={() => handleEventChange('prev')}
                                    aria-label="Previous event"
                                >
                                    ◀
                                </button>
                                <button
                                    className={`${styles.navArrow} ${styles.navRight}`}
                                    onClick={() => handleEventChange('next')}
                                    aria-label="Next event"
                                >
                                    ▶
                                </button>
                            </>
                        )}

                        <CometCard className={styles.eventImageCard}>
                            <div className={`${styles.eventImage} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`} onClick={openModal} style={{ cursor: 'pointer' }}>
                                {currentEvent.image && (
                                    <Image
                                        src={currentEvent.image}
                                        alt={currentEvent.eventName}
                                        width={400}
                                        height={400}
                                        priority
                                        className={styles.eventImg}
                                    />
                                )}
                            </div>
                        </CometCard>

                        {/* Glowing Platform */}
                        <div className={styles.platform}>
                            <div className={styles.platformGlow}></div>
                            <div className={styles.platformRing}></div>
                            <div className={styles.platformRing2}></div>
                        </div>
                    </div>

                    {/* Event Counter - Below Image */}
                    {events.length > 1 && (
                        <div className={styles.eventCounterContainer}>
                            <span className={styles.eventCounter}>
                                Event {activeEventIndex + 1} of {events.length}
                            </span>
                        </div>
                    )}
                </div>

                {/* Right Stats Panel with Rounds and Contacts */}
                <div className={styles.statsPanel}>
                    {/* Rounds Details */}
                    {currentEvent.rounds && currentEvent.rounds.length > 0 && (
                        <div className={styles.roundsContainer}>
                            <div className={styles.roundsHeader}>
                                <div className={styles.statLabel}>Rounds</div>
                                <div className={styles.roundCount}>{currentEvent.rounds.length} Rounds</div>
                            </div>
                            {currentEvent.rounds.map((round, index) => (
                                <div key={round._id?.$oid || index} className={styles.roundItem}>
                                    <div className={styles.roundBadge}>R{index + 1}</div>
                                    <div className={styles.roundDetails}>
                                        <div className={styles.roundItemTitle}>{round.title}</div>
                                        {round.tagline && (
                                            <div className={styles.roundItemTagline}>{round.tagline}</div>
                                        )}
                                        <div className={styles.roundItemDesc}>{round.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <button className={styles.ctaButton} onClick={openModal}>
                        <span>Learn More</span>
                        <i className="ri-arrow-right-line"></i>
                    </button>
                </div>
            </div>

            {/* Event Description Removed as per user request */}
            {/* <div className={`${styles.eventDescription} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
                <p>{currentEvent.description}</p>
            </div> */}

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className={styles.overlay} onClick={handleBackdropClick}>
                    <div className={styles.modal}>
                        <button className={styles.closeBtn} onClick={closeModal}>
                            ✕
                        </button>

                        <div className={styles.modalContent}>
                            <div className={styles.modalPosterWrapper}>
                                <div className={styles.modalGlowRing}></div>
                                <Image
                                    src={currentEvent.image}
                                    alt={currentEvent.eventName}
                                    width={350}
                                    height={350}
                                    className={styles.modalPoster}
                                    unoptimized
                                />
                            </div>
                            <div className={styles.modalInfo}>
                                <span className={styles.modalLabel}>{currentEvent.category || 'EVENT'}</span>
                                <h2 className={styles.modalTitle}>{currentEvent.eventName}</h2>
                                {currentEvent.oneLineDescription && (
                                    <p className={styles.modalOneLiner}>{currentEvent.oneLineDescription}</p>
                                )}
                                <p className={styles.modalDesc}>{currentEvent.description}</p>

                                {/* Event Info Grid */}
                                <div className={styles.modalInfoGrid}>
                                    {currentEvent.date && (
                                        <div className={styles.modalInfoItem}>
                                            <span className={styles.modalInfoLabel}>Date</span>
                                            <span className={styles.modalInfoValue}>
                                                {new Date(currentEvent.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    )}
                                    {currentEvent.timing && (
                                        <div className={styles.modalInfoItem}>
                                            <span className={styles.modalInfoLabel}>Timing</span>
                                            <span className={styles.modalInfoValue}>{currentEvent.timing}</span>
                                        </div>
                                    )}
                                    {currentEvent.hall && (
                                        <div className={styles.modalInfoItem}>
                                            <span className={styles.modalInfoLabel}>Venue</span>
                                            <span className={styles.modalInfoValue}>{currentEvent.hall}</span>
                                        </div>
                                    )}
                                    {currentEvent.teamSize && (
                                        <div className={styles.modalInfoItem}>
                                            <span className={styles.modalInfoLabel}>Team Size</span>
                                            <span className={styles.modalInfoValue}>{currentEvent.teamSize} Members</span>
                                        </div>
                                    )}
                                </div>

                                {/* Rounds */}
                                {currentEvent.rounds && currentEvent.rounds.length > 0 && (
                                    <div className={styles.modalRounds}>
                                        <h4 className={styles.modalSectionTitle}>Rounds</h4>
                                        {currentEvent.rounds.map((round, index) => (
                                            <div key={round._id?.$oid || index} className={styles.modalRoundItem}>
                                                <span className={styles.roundNumber}>{index + 1}</span>
                                                <div>
                                                    <strong>{round.title}</strong>
                                                    {round.description && <p>{round.description}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Contacts */}
                                {currentEvent.contacts && currentEvent.contacts.length > 0 && (
                                    <div className={styles.modalContacts}>
                                        <h4 className={styles.modalSectionTitle}>Coordinators</h4>
                                        {currentEvent.contacts.map((contact, index) => (
                                            <div key={contact._id?.$oid || index} className={styles.modalContactItem}>
                                                <span>{contact.name}</span>
                                                <a href={`tel:${contact.mobile}`}>{contact.mobile}</a>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    className={styles.registerBtn}
                                    onClick={handleRegister}
                                >
                                    <span>Register Now</span>
                                    {/* <i className="ri-arrow-right-up-line"></i> */}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
