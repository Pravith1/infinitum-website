
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { eventService } from '@/services/eventservice';
import { useAuth } from '@/context/AuthContext';
import { useSound } from '@/context/SoundContext';
import { usePreRegistration } from '@/context/PreRegistrationContext';
import { isPreRegistrationEnabled, preRegistrationConfig } from '@/settings/featureFlags';
import { eventsData, workshopsData, papersData } from '@/data/eventsData';
import { CometCard } from '@/components/ui/comet-card';
import styles from './EventShowcase.module.css';

export default function EventShowcase({ sounds, initialEventId }) {
    const searchParams = useSearchParams();
    const { isAuthenticated, user } = useAuth();
    const { isMuted } = useSound();
    const { openModal: openPreRegModal } = usePreRegistration();
    const router = useRouter();
    const [category, setCategory] = useState(searchParams.get('category') || 'events');

    // Determine effective event ID from props or URL
    const urlEventId = searchParams.get('id');
    const effectiveEventId = initialEventId || urlEventId;

    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Update category when URL parameter changes
    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat && ['events', 'workshops', 'papers'].includes(cat)) {
            setCategory(cat);
        }
    }, [searchParams]);

    const [activeEventIndex, setActiveEventIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [hasInitialSet, setHasInitialSet] = useState(false); // Track if initial event is set
    const [isMobile, setIsMobile] = useState(false); // Track mobile view
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    // Detect mobile screen
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Touch handlers for swipe
    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleEventChange('next');
        }
        if (isRightSwipe) {
            handleEventChange('prev');
        }
    };

    // Handle effectiveEventId to set correct category
    useEffect(() => {
        if (effectiveEventId && !hasInitialSet) {
            console.log("Deep linking to event:", effectiveEventId);
            // Check all data sources for the effectiveEventId
            let targetEvent = eventsData.find(e => e.eventId === effectiveEventId);
            let targetCat = 'events';

            if (!targetEvent) {
                targetEvent = workshopsData.find(w => w.workshopId === effectiveEventId);
                if (targetEvent) targetCat = 'workshops';
            }
            if (!targetEvent) {
                targetEvent = papersData.find(p => p.paperId === effectiveEventId);
                if (targetEvent) targetCat = 'papers';
            }

            if (targetEvent) {
                console.log("Found event category for effectiveEventId:", targetCat);
                if (category !== targetCat) {
                    setCategory(targetCat);
                }
            } else {
                console.warn("Event ID not found in local data:", effectiveEventId);
            }
        }
    }, [effectiveEventId, hasInitialSet, category]); // Added category to dependencies to prevent infinite loop if category is already correct

    // Debug mount/unmount
    useEffect(() => {
        console.log('🏗️ EventShowcase MOUNTED');
        return () => console.log('🗑️ EventShowcase UNMOUNTED');
    }, []);

    // Load events based on category
    useEffect(() => {
        console.log('🔄 Category changed to:', category);
        const loadEvents = async () => {
            setIsLoading(true);
            console.log('📥 Loading events for category:', category);
            try {
                let items = [];
                if (category === 'events') {
                    items = eventsData
                        .filter(e => !e.eventName.toLowerCase().includes('thooral'))
                        .map(e => ({ ...e, isFullDetailsLoaded: true }));
                } else if (category === 'workshops') {
                    items = workshopsData.map(w => ({
                        ...w,
                        eventName: w.workshopName,
                        oneLineDescription: w.tagline || w.description || 'Technical Workshop',
                        timing: w.dateAndTime || w.time,
                        isWorkshop: true,
                        isFullDetailsLoaded: true,
                        // Ensure required fields like date are present
                        date: w.date?.$date || w.date,
                        rounds: w.agenda ? w.agenda.map((a, i) => ({
                            title: a.time,
                            description: a.description,
                            _id: a._id
                        })) : []
                    }));
                } else if (category === 'papers') {
                    items = papersData.map(p => ({
                        ...p,
                        eventName: p.eventName || "Paper Presentation",
                        oneLineDescription: p.tagline || p.theme || 'Paper Presentation',
                        timing: p.dateAndTime || p.time,
                        isPaper: true,
                        isFullDetailsLoaded: true,
                        // Ensure required fields
                        date: p.date?.$date || p.date,
                        rounds: p.rules ? p.rules.split('\n').map((rule, i) => ({
                            title: `Rule ${i + 1} `,
                            description: rule,
                            _id: `rule - ${i} `
                        })) : []
                    }));
                }

                // Check Registrations
                if (isAuthenticated) {
                    try {
                        let registeredIds = [];
                        if (category === 'events') {
                            const res = await eventService.getUserEvents();
                            console.log(res);
                            const list = Array.isArray(res) ? res : (res.events || res.data || []);
                            registeredIds = list.map(e => e.eventId);
                        } else if (category === 'workshops') {
                            const res = await eventService.getUserWorkshops();
                            const list = Array.isArray(res) ? res : (res.workshops || res.data || []);
                            registeredIds = list.map(w => w.workshopId);
                        } else if (category === 'papers') {
                            const res = await eventService.getUserPapers();
                            const list = Array.isArray(res) ? res : (res.papers || res.data || []);
                            registeredIds = list.map(p => p.paperId);
                        }

                        items = items.map(item => ({
                            ...item,
                            isRegistered: registeredIds.includes(item.eventId || item.workshopId || item.paperId)
                        }));
                    } catch (e) {
                        console.error("Failed to sync registrations", e);
                    }
                }

                console.log('✅ Setting events:', items.length);
                setEvents(items);

                // Deep Linking Logic
                if (effectiveEventId && !hasInitialSet) {
                    const idx = items.findIndex(e =>
                        (e.eventId === effectiveEventId) ||
                        (e.workshopId === effectiveEventId) ||
                        (e.paperId === effectiveEventId)
                    );

                    if (idx !== -1) {
                        console.log("🎯 Found effective event at index:", idx);
                        setActiveEventIndex(idx);
                        setHasInitialSet(true);
                    } else {
                        // Crucial: check if we are in the *wrong* category for this ID.
                        // If we are, do nothing and wait for the category switch effect.
                        // If we are in the *correct* category but item is missing, then fallback.

                        // Determine expected category for current ID
                        let expectedCategory = 'events';
                        if (workshopsData.some(w => w.workshopId === effectiveEventId)) expectedCategory = 'workshops';
                        else if (papersData.some(p => p.paperId === effectiveEventId)) expectedCategory = 'papers';

                        if (category !== expectedCategory) {
                            console.log(`⏳ Waiting for category switch to ${expectedCategory}...`);
                        } else {
                            // Correct category but ID not found? Maybe invalid ID.
                            console.warn("⚠️ Effective event ID not found in its expected category:", category);
                            // Fallback to 0 if we really can't find it.
                            if (items.length > 0) setActiveEventIndex(0);
                        }
                    }
                } else if (!hasInitialSet) {
                    // No deep link, normal load
                    setActiveEventIndex(0);
                }

            } catch (error) {
                console.error(`Failed to load ${category}`, error);
            } finally {
                setIsLoading(false);
            }
        };
        loadEvents();
    }, [category, effectiveEventId, hasInitialSet, isAuthenticated]); // Added dependencies

    // Fetch full details - No longer needed as all data is hardcoded
    useEffect(() => {
        // Kept empty effect or removed to prevent errors if logic depended on it,
        // but since we mark isFullDetailsLoaded: true, the previous logic (if any remained) would exit early.
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
        if (!isMuted) {
            const audio = new Audio('/sounds/expand.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.error("Audio play failed", e));
        }
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

    const DEFAULT_EVENT_IMAGE = '/images/events/paper_presentation.png';
    const currentEvent = events[activeEventIndex] ? {
        ...events[activeEventIndex],
        image: events[activeEventIndex].image || DEFAULT_EVENT_IMAGE
    } : null;

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


    const [notification, setNotification] = useState({
        isOpen: false,
        type: '', // 'confirm', 'success', 'error', 'login'
        title: '',
        message: '',
        onConfirm: null,
        showLoginButton: false
    });

    const closeNotification = () => {
        if (sounds?.click) sounds.click.play();
        setNotification(prev => ({ ...prev, isOpen: false }));
    };

    const handleRegisterClick = () => {
        if (sounds?.click) sounds.click.play();

        // If pre-registration mode is enabled, open the pre-registration modal
        if (isPreRegistrationEnabled) {
            openPreRegModal();
            return;
        }

        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

        if (!isAuthenticated && !token) {
            setNotification({
                isOpen: true,
                type: 'login',
                title: 'Login Required',
                message: 'Please login to register for this event.',
                onConfirm: () => closeNotification(),
                showLoginButton: true
            });
            return;
        }

        setNotification({
            isOpen: true,
            type: 'confirm',
            title: 'Confirm Registration',
            message: `Are you sure you want to register for ${currentEvent.eventName} ? `,
            onConfirm: () => performRegistration()
        });
    };

    const performRegistration = async () => {
        closeNotification();

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
                setNotification({
                    isOpen: true,
                    type: 'success',
                    title: 'Registration Successful',
                    message: res.message || "Registered successfully!",
                    onConfirm: () => closeNotification()
                });

                // Update local status
                setEvents(prev => {
                    const newEvents = [...prev];
                    if (newEvents[activeEventIndex]) {
                        newEvents[activeEventIndex] = {
                            ...newEvents[activeEventIndex],
                            isRegistered: true
                        };
                    }
                    return newEvents;
                });
            } else {
                setNotification({
                    isOpen: true,
                    type: 'error',
                    title: 'Registration Failed',
                    message: res?.message || "Registration failed.",
                    onConfirm: () => closeNotification()
                });
            }
        } catch (error) {
            console.error("Registration error:", error);
            const msg = error.response?.data?.message || "An error occurred during registration.";

            if (error.response?.status === 401) {
                setNotification({
                    isOpen: true,
                    type: 'login',
                    title: 'Login Required',
                    message: 'Please login to register for this event.',
                    onConfirm: () => closeNotification(),
                    showLoginButton: true
                });
            } else if ((error.response?.status === 400 && msg.toLowerCase().includes("general fee"))) {
                setNotification({
                    isOpen: true,
                    type: 'error',
                    title: 'General Fee Required',
                    message: 'General fee payment is not done. Please complete the general fee payment to register for events.',
                    onConfirm: () => closeNotification() // Optionally redirect to payment page
                });
            } else {
                setNotification({
                    isOpen: true,
                    type: 'error',
                    title: 'Error',
                    message: msg,
                    onConfirm: () => closeNotification()
                });
            }
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    const categoryLabels = {
        'events': 'Events',
        'workshops': 'Workshops',
        'papers': 'Paper Presentation'
    };

    const currentCategoryLabel = categoryLabels[category];

    const renderDropdown = () => (
        <div className={styles.categoryDropdown} ref={dropdownRef}>
            <div
                className={`${styles.dropdownToggle} ${isDropdownOpen ? styles.active : ''} `}
                onClick={() => {
                    if (sounds?.click) sounds.click.play();
                    setIsDropdownOpen(!isDropdownOpen);
                }}
            >
                <span>{currentCategoryLabel}</span>
                <span className={styles.dropdownArrow}>▼</span>
            </div>
            <div className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.show : ''} `}>
                {Object.keys(categoryLabels).map((cat) => (
                    <div
                        key={cat}
                        className={`${styles.dropdownItem} ${category === cat ? styles.selected : ''} `}
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('🖱️ Dropdown item clicked:', cat);
                            if (sounds?.click) sounds.click.play();

                            // Always navigate to the clean category URL
                            // This ensures we leave specific event pages (like /events/ID) 
                            // and go to the list view of the new category
                            router.push(`/events?category=${cat}`);

                            setIsDropdownOpen(false);
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
                <div style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>No {categoryLabels[category]} available</div>
            </div>
        );
    }

    if (!currentEvent) return null;

    return (
        <div className={styles.showcase}>
            <div className={styles.controlsContainer}>
                {!isMobile && renderDropdown()}

                {/* Register Button - Hidden when pre-registration is enabled */}
                {!isPreRegistrationEnabled && (
                    <button
                        className={styles.registerButton}
                        onClick={!currentEvent.isRegistered ? handleRegisterClick : undefined}
                        style={{
                            background: currentEvent.isRegistered ? 'transparent' : undefined,
                            cursor: currentEvent.isRegistered ? 'default' : 'pointer',
                            borderColor: currentEvent.isRegistered ? '#B0B0B0' : undefined,
                            color: currentEvent.isRegistered ? '#B0B0B0' : undefined,
                            boxShadow: currentEvent.isRegistered ? 'none' : undefined,
                        }}
                    >
                        <span>
                            {currentEvent.isRegistered
                                ? 'Registered'
                                : (category === 'papers' ? 'Submit' : 'Register Now')
                            }
                        </span>
                    </button>
                )}
            </div>

            {/* Event Name with Bracket Frame - Uses corner elements for all 4 corners */}
            <div className={styles.headerContainer}>
                <div className={styles.eventHeader}>
                    {/* Corner brackets */}
                    <span className={`${styles.corner} ${styles.cornerTopLeft}`}></span>
                    <span className={`${styles.corner} ${styles.cornerTopRight}`}></span>
                    <span className={`${styles.corner} ${styles.cornerBottomLeft}`}></span>
                    <span className={`${styles.corner} ${styles.cornerBottomRight}`}></span>

                    <h1 className={`${styles.eventName} ${isTransitioning ? styles.fadeOut : ''} `}>
                        {currentEvent.eventName}
                    </h1>
                </div>

                {/* Tagline */}
                <p className={`${styles.tagline} ${isTransitioning ? styles.fadeOut : ''} `}>
                    {currentEvent.oneLineDescription}
                </p>
            </div>

            {/* Main Content Area */}
            <div className={styles.mainContent}>
                {/* Left Stats Panel */}
                <div className={styles.statsPanel}>
                    {category === 'workshops' && currentEvent.speakers && currentEvent.speakers.length > 0 && (
                        <div className={styles.contactsContainer}>
                            <div className={styles.statLabel}>Speakers</div>
                            {currentEvent.speakers.map((speaker, index) => (
                                <div key={index} className={styles.speakerItem}>
                                    <div className={styles.speakerName}>{speaker.name}</div>
                                    {speaker.designation && (
                                        <div className={styles.speakerDesignation}>{speaker.designation}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {category !== 'workshops' && currentEvent.teamSize && (
                        <div className={styles.statItem}>
                            <div className={styles.statLabel}>Team Size</div>
                            <div className={styles.statValue}>
                                {currentEvent.teamSize === 1 ? 'Individual' : `${currentEvent.teamSize} Members`}
                            </div>
                        </div>
                    )}

                    <div className={styles.statItem}>
                        <div className={styles.statLabel}>DATE AND TIME</div>
                        <div className={styles.statValue}>
                            {(currentEvent.dateAndTime || currentEvent.timing) &&
                                (currentEvent.dateAndTime || currentEvent.timing).split(', ').map((part, idx) => (
                                    <div key={idx}>{part}</div>
                                ))
                            }
                        </div>
                    </div>

                    <div className={styles.statItem}>
                        <div className={styles.statLabel}>Venue</div>
                        <div className={styles.statValue}>{currentEvent.hall}</div>
                    </div>
                </div>

                {/* Center Event Display - Now contains primarily the image */}
                <div className={styles.eventDisplay}>
                    {/* Event Image on Platform */}
                    <div
                        className={styles.eventImageContainer}
                        onTouchStart={isMobile ? onTouchStart : undefined}
                        onTouchMove={isMobile ? onTouchMove : undefined}
                        onTouchEnd={isMobile ? onTouchEnd : undefined}
                    >
                        {/* Mobile Swipe Indicator (Dots) */}
                        <div className={styles.mobileSwipeIndicator}>
                            {events.map((_, index) => (
                                <span
                                    key={index}
                                    className={`${styles.swipeDot} ${index === activeEventIndex ? styles.activeDot : ''} `}
                                ></span>
                            ))}
                        </div>

                        {/* Navigation Arrows - Using absolute positioning relative to this container which hugs the image */}
                        {events.length > 1 && (
                            <>
                                <button
                                    className={`${styles.navArrow} ${styles.navLeft} `}
                                    onClick={() => handleEventChange('prev')}
                                    aria-label="Previous event"
                                >
                                    ◀
                                </button>
                                <button
                                    className={`${styles.navArrow} ${styles.navRight} `}
                                    onClick={() => handleEventChange('next')}
                                    aria-label="Next event"
                                >
                                    ▶
                                </button>
                            </>
                        )}

                        <CometCard className={styles.eventImageCard}>
                            <div className={`${styles.eventImage} ${isTransitioning ? styles.fadeOut : ''} `} onClick={openModal} style={{ cursor: 'pointer' }}>
                                {currentEvent.image && (
                                    <Image
                                        key={currentEvent.eventId || currentEvent.workshopId || currentEvent.paperId}
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
                                {category === 'workshops' ? 'Workshop' : category === 'papers' ? 'Paper' : 'Event'} {activeEventIndex + 1} of {events.length}
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
                                <div className={styles.statLabel}>
                                    {category === 'workshops' ? 'Agenda' : category === 'papers' ? 'Rules' : 'Rounds'}
                                </div>
                                <div className={styles.roundCount}>{currentEvent.rounds.length} {
                                    category === 'workshops' ? 'Items' : category === 'papers' ? 'Rules' : 'Rounds'
                                }</div>
                            </div>
                            {currentEvent.rounds.map((round, index) => (
                                <div key={round._id?.$oid || index} className={`${styles.roundItem} ${category === 'workshops' ? styles.workshopRoundItem : ''}`}>
                                    <div className={styles.roundBadge}>
                                        {category === 'workshops' ? '▸' : `R${index + 1}`}
                                    </div>
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
            {/* <div className={`${ styles.eventDescription } ${ isTransitioning ? styles.fadeOut : styles.fadeIn } `}>
                <p>{currentEvent.description}</p>
            </div> */}

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className={styles.overlay} onClick={handleBackdropClick}>
                    <div className={styles.modal}>
                        <button className={styles.closeBtn} onClick={closeModal}>
                            {isMobile ? '✕' : '◄ Back'}
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
                                    loading="eager"
                                    priority
                                    placeholder="blur"
                                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjM1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWEwMjBiIi8+PC9zdmc+"
                                />
                            </div>
                            <div className={styles.modalInfo}>
                                <span className={styles.modalLabel}>
                                    {category === 'workshops' ? 'WORKSHOP' : category === 'papers' ? 'PAPER PRESENTATION' : (currentEvent.category || 'EVENT')}
                                </span>
                                <h2 className={styles.modalTitle}>{currentEvent.eventName}</h2>
                                {currentEvent.oneLineDescription && (
                                    <p className={styles.modalOneLiner}>{currentEvent.oneLineDescription}</p>
                                )}
                                <p className={styles.modalDesc}>{currentEvent.description}</p>

                                {/* Event Info Grid */}
                                <div className={styles.modalInfoGrid}>
                                    {category === 'workshops' && currentEvent.speakers && currentEvent.speakers.length > 0 && (
                                        <div className={styles.modalInfoItem}>
                                            <span className={styles.modalInfoLabel}>Speakers</span>
                                            <span className={styles.modalInfoValue}>{currentEvent.speakers.length} Speaker{currentEvent.speakers.length > 1 ? 's' : ''}</span>
                                        </div>
                                    )}
                                    {(currentEvent.dateAndTime || currentEvent.timing) && (
                                        <div className={styles.modalInfoItem}>
                                            <span className={styles.modalInfoLabel}>DATE AND TIME</span>
                                            <span className={styles.modalInfoValue}>
                                                {(currentEvent.dateAndTime || currentEvent.timing).split(', ').map((part, idx) => (
                                                    <div key={idx}>{part}</div>
                                                ))}
                                            </span>
                                        </div>
                                    )}
                                    {currentEvent.hall && (
                                        <div className={styles.modalInfoItem}>
                                            <span className={styles.modalInfoLabel}>Venue</span>
                                            <span className={styles.modalInfoValue}>{currentEvent.hall}</span>
                                        </div>
                                    )}
                                    {category !== 'workshops' && currentEvent.teamSize && (
                                        <div className={styles.modalInfoItem}>
                                            <span className={styles.modalInfoLabel}>Team Size</span>
                                            <span className={styles.modalInfoValue}>{currentEvent.teamSize} Members</span>
                                        </div>
                                    )}
                                </div>

                                {/* Rounds */}
                                {currentEvent.rounds && currentEvent.rounds.length > 0 && (
                                    <div className={styles.modalRounds}>
                                        <h4 className={styles.modalSectionTitle}>
                                            {category === 'workshops' ? 'Agenda' : category === 'papers' ? 'Rules' : 'Rounds'}
                                        </h4>
                                        {currentEvent.rounds.map((round, index) => (
                                            <div key={round._id?.$oid || index} className={styles.modalRoundItem}>
                                                <span className={styles.roundNumber}>
                                                    {category === 'workshops' ? '▸' : index + 1}
                                                </span>
                                                <div>
                                                    <strong>{round.title}</strong>
                                                    {round.description && <p>{round.description}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Speakers Section in Modal */}
                                {category === 'workshops' && currentEvent.speakers && currentEvent.speakers.length > 0 && (
                                    <div className={styles.modalContacts}>
                                        <h4 className={styles.modalSectionTitle}>Speakers</h4>
                                        {currentEvent.speakers.map((speaker, index) => (
                                            <div key={index} className={styles.modalContactItem} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                                                <span style={{ fontSize: '1.1em', fontWeight: '600' }}>{speaker.name}</span>
                                                {speaker.designation && <span style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '2px' }}>{speaker.designation}</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Contacts (Coordinators) */}
                                {currentEvent.contacts && currentEvent.contacts.length > 0 && (
                                    <div className={styles.modalContacts}>
                                        <h4 className={styles.modalSectionTitle}>Coordinators</h4>
                                        {currentEvent.contacts.map((contact, index) => (
                                            <div key={contact._id?.$oid || index} className={styles.modalContactItem}>
                                                <span>{contact.name}</span>
                                                <a href={`tel:${contact.mobile} `}>{contact.mobile}</a>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Register Button in modal - Hidden when pre-registration is enabled */}
                                {!isPreRegistrationEnabled && (
                                    <button
                                        className={styles.registerBtn}
                                        onClick={!currentEvent.isRegistered ? handleRegisterClick : undefined}
                                        style={{
                                            opacity: currentEvent.isRegistered ? 1 : 1,
                                            cursor: currentEvent.isRegistered ? 'default' : 'pointer',
                                            background: currentEvent.isRegistered ? 'transparent' : undefined,
                                            borderColor: currentEvent.isRegistered ? '#9E9E9E' : undefined,
                                            color: currentEvent.isRegistered ? '#B0B0B0' : undefined,
                                            boxShadow: currentEvent.isRegistered ? '0 0 15px rgba(176, 176, 176, 0.3)' : undefined,
                                            boxShadow: currentEvent.isRegistered ? 'none' : undefined,
                                        }}
                                    >
                                        <span>
                                            {currentEvent.isRegistered
                                                ? 'Registered'
                                                : (category === 'papers' ? 'Submit' : 'Register Now')
                                            }
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Modal */}
            {notification.isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10001,
                        backdropFilter: 'blur(4px)',
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget && notification.type !== 'confirm') closeNotification();
                    }}
                >
                    <div
                        style={{
                            background: 'linear-gradient(135deg, rgba(26, 2, 11, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%)',
                            border: `2px solid ${notification.type === 'success' ? '#00E676' : notification.type === 'error' ? '#c72071' : '#c72071'}`,
                            borderRadius: '12px',
                            padding: '32px',
                            maxWidth: '400px',
                            width: '90%',
                            textAlign: 'center',
                            boxShadow: `0 0 40px ${notification.type === 'success' ? 'rgba(0, 230, 118, 0.3)' : 'rgba(199, 32, 113, 0.3)'}`,
                        }}
                    >
                        {/* Icon */}
                        <div
                            style={{
                                width: '60px',
                                height: '60px',
                                margin: '0 auto 20px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: notification.type === 'success'
                                    ? 'rgba(0, 230, 118, 0.2)'
                                    : notification.type === 'error'
                                        ? 'rgba(199, 32, 113, 0.2)'
                                        : 'rgba(250, 225, 39, 0.2)',
                                border: `2px solid ${notification.type === 'success' ? '#00E676' : notification.type === 'error' ? '#c72071' : '#fae127'}`,
                            }}
                        >
                            <i
                                className={
                                    notification.type === 'success'
                                        ? 'ri-check-line'
                                        : notification.type === 'error'
                                            ? 'ri-error-warning-line'
                                            : 'ri-question-line'
                                }
                                style={{
                                    fontSize: '28px',
                                    color: notification.type === 'success' ? '#00E676' : notification.type === 'error' ? '#c72071' : '#fae127',
                                }}
                            />
                        </div>

                        {/* Title */}
                        <h3
                            style={{
                                fontFamily: 'Orbitron, sans-serif',
                                fontSize: '1.3rem',
                                color: '#fff',
                                marginBottom: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}
                        >
                            {notification.title}
                        </h3>

                        {/* Message */}
                        <p
                            style={{
                                fontFamily: 'Electrolize, sans-serif',
                                fontSize: '1rem',
                                color: 'rgba(255, 255, 255, 0.8)',
                                marginBottom: '24px',
                                lineHeight: 1.6,
                            }}
                        >
                            {notification.message}
                        </p>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {notification.type === 'confirm' && (
                                <button
                                    onClick={closeNotification}
                                    style={{
                                        padding: '12px 24px',
                                        background: 'transparent',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        borderRadius: '6px',
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        fontFamily: 'Orbitron, sans-serif',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                            {notification.showLoginButton && (
                                <button
                                    onClick={() => {
                                        closeNotification();
                                        // Navigate to login with current page as callback URL
                                        const currentUrl = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/events';
                                        router.push(`/auth?type=login&callbackUrl=${encodeURIComponent(currentUrl)}`);
                                    }}
                                    style={{
                                        padding: '12px 24px',
                                        background: 'linear-gradient(135deg, #c72071, #8b164f)',
                                        border: 'none',
                                        borderRadius: '6px',
                                        color: '#fff',
                                        fontFamily: 'Orbitron, sans-serif',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        boxShadow: '0 4px 20px rgba(199, 32, 113, 0.4)',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Login
                                </button>
                            )}
                            {!notification.showLoginButton && (
                                <button
                                    onClick={notification.onConfirm}
                                    style={{
                                        padding: '12px 24px',
                                        background: notification.type === 'success'
                                            ? 'linear-gradient(135deg, #00E676, #00C853)'
                                            : 'linear-gradient(135deg, #c72071, #8b164f)',
                                        border: 'none',
                                        borderRadius: '6px',
                                        color: '#fff',
                                        fontFamily: 'Orbitron, sans-serif',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        boxShadow: notification.type === 'success'
                                            ? '0 4px 20px rgba(0, 230, 118, 0.4)'
                                            : '0 4px 20px rgba(199, 32, 113, 0.4)',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {notification.type === 'confirm' ? 'Confirm' : 'OK'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Preload images for smoother transitions - All Categories */}
            <div style={{ display: 'none' }} aria-hidden="true">
                {/* Preload current category events */}
                {events.map((event, index) => {
                    const img = event.image || DEFAULT_EVENT_IMAGE;
                    if (!img || index === activeEventIndex) return null;
                    return (
                        <Image
                            key={`preload-current-${event.eventId || event.workshopId || event.paperId || index}`}
                            src={img}
                            alt=""
                            width={400}
                            height={400}
                            loading="eager"
                            unoptimized={false}
                        />
                    );
                })}
                {/* Preload Workshops */}
                {workshopsData.map((w, index) => {
                    // Avoid duplicating if already in 'events' (which it won't be, but good to be safe if Logic changes)
                    // Only preload if not currently viewing workshops (otherwise above loop handles it)
                    if (category === 'workshops') return null;
                    const img = w.image || DEFAULT_EVENT_IMAGE;
                    return (
                        <Image
                            key={`preload-workshop-${w.workshopId || index}`}
                            src={img}
                            alt=""
                            width={400}
                            height={400}
                            loading="lazy" // Use lazy for non-critical, or eager if user wants INSTANT switch
                            unoptimized={false}
                        />
                    )
                })}
                {/* Preload Papers */}
                {papersData.map((p, index) => {
                    if (category === 'papers') return null;
                    const img = p.image || DEFAULT_EVENT_IMAGE;
                    return (
                        <Image
                            key={`preload-paper-${p.paperId || index}`}
                            src={img}
                            alt=""
                            width={400}
                            height={400}
                            loading="lazy"
                            unoptimized={false}
                        />
                    )
                })}
            </div>
        </div>
    );
}
