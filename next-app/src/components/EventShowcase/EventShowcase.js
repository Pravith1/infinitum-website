import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { eventService } from '@/services/eventservice';
import { useAuth } from '@/context/AuthContext';
import { eventsData, workshopsData, papersData } from '@/data/eventsData';
import { CometCard } from '@/components/ui/comet-card';
import styles from './EventShowcase.module.css';

export default function EventShowcase({ sounds }) {
    const searchParams = useSearchParams();
    const { isAuthenticated, user } = useAuth();
    const [category, setCategory] = useState(searchParams.get('category') || 'events');
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
                    console.log('📋 Using eventsData, count:', eventsData.length);
                    // Use hardcoded eventsData
                    items = eventsData
                        .filter(e => !e.eventName.toLowerCase().includes('thooral'))
                        .map(e => ({ ...e, isFullDetailsLoaded: true }));
                } else if (category === 'workshops') {
                    console.log('📋 Using workshopsData, count:', workshopsData.length);
                    // Use hardcoded workshopsData
                    items = workshopsData.map(w => ({
                        ...w,
                        eventName: w.workshopName,
                        oneLineDescription: w.tagline || w.description || 'Technical Workshop',
                        timing: w.time,
                        isWorkshop: true,
                        isFullDetailsLoaded: true,
                        teamSize: w.teamSize || 1, // Default to 1 (Individual) if not specified
                        // Fix date format (MongoDB extended JSON)
                        date: w.date?.$date || w.date,
                        // Map agenda to rounds for display
                        rounds: w.agenda ? w.agenda.map((a, i) => ({
                            title: a.time,
                            description: a.description,
                            _id: a._id
                        })) : []
                    }));
                } else if (category === 'papers') {
                    console.log('📋 Using papersData, count:', papersData.length);
                    // Use hardcoded papersData
                    items = papersData.map(p => ({
                        ...p,
                        eventName: p.eventName || "Paper Presentation",
                        oneLineDescription: p.tagline || p.theme || 'Paper Presentation',
                        timing: p.time,
                        isPaper: true,
                        isFullDetailsLoaded: true,
                        // Fix date format (MongoDB extended JSON)
                        date: p.date?.$date || p.date,
                        // Map rules to rounds for display
                        rounds: p.rules ? p.rules.split('\n').map((rule, i) => ({
                            title: `Rule ${i + 1}`,
                            description: rule,
                            _id: `rule-${i}`
                        })) : []
                    }));
                }
                console.log('✅ Setting events:', items.length, 'First item:', items[0]?.eventName);
                setEvents(items);
                setActiveEventIndex(0);
            } catch (error) {
                console.error(`Failed to load ${category}`, error);
            } finally {
                setIsLoading(false);
            }
        };
        loadEvents();
    }, [category]);

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
        type: '', // 'confirm', 'success', 'error'
        title: '', 
        message: '', 
        onConfirm: null 
    });

    const closeNotification = () => {
        if (sounds?.click) sounds.click.play();
        setNotification(prev => ({ ...prev, isOpen: false }));
    };

    const handleRegisterClick = () => {
         if (sounds?.click) sounds.click.play();

        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

        if (!isAuthenticated && !token) {
             setNotification({
                 isOpen: true,
                 type: 'error',
                 title: 'Login Required',
                 message: 'Please login to register for this event.',
                 onConfirm: () => closeNotification()
             });
             return;
        }

        setNotification({
            isOpen: true,
            type: 'confirm',
            title: 'Confirm Registration',
            message: `Are you sure you want to register for ${currentEvent.eventName}?`,
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
                    type: 'error',
                    title: 'Login Required',
                    message: 'Please login to register for this event.',
                    onConfirm: () => closeNotification()
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
                className={`${styles.dropdownToggle} ${isDropdownOpen ? styles.active : ''}`}
                onClick={() => {
                    if (sounds?.click) sounds.click.play();
                    setIsDropdownOpen(!isDropdownOpen);
                }}
            >
                <span>{currentCategoryLabel}</span>
                <span className={styles.dropdownArrow}>▼</span>
            </div>
            <div className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.show : ''}`}>
                {Object.keys(categoryLabels).map((cat) => (
                    <div
                        key={cat}
                        className={`${styles.dropdownItem} ${category === cat ? styles.selected : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('🖱️ Dropdown item clicked:', cat);
                            if (sounds?.click) sounds.click.play();
                            setCategory(cat);
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
                {renderDropdown()}

                {/* Register Button */}
                <button 
                    className={styles.registerButton} 
                    onClick={!currentEvent.isRegistered ? handleRegisterClick : undefined}
                    style={{
                        opacity: currentEvent.isRegistered ? 0.7 : 1,
                        cursor: currentEvent.isRegistered ? 'default' : 'pointer',
                        borderColor: currentEvent.isRegistered ? '#00ff00' : undefined,
                        color: currentEvent.isRegistered ? '#00ff00' : undefined,
                    }}
                >
                    <span>{currentEvent.isRegistered ? 'Registered' : 'Register Now'}</span>
                </button>
            </div>

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
                    {currentEvent.teamSize && (
                        <div className={styles.statItem}>
                            <div className={styles.statLabel}>Team Size</div>
                            <div className={styles.statValue}>
                                {currentEvent.teamSize === 1 ? 'Individual' : `${currentEvent.teamSize} Members`}
                            </div>
                        </div>
                    )}

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
                                <div className={styles.statLabel}>
                                    {category === 'workshops' ? 'Agenda' : category === 'papers' ? 'Rules' : 'Rounds'}
                                </div>
                                <div className={styles.roundCount}>{currentEvent.rounds.length} {
                                    category === 'workshops' ? 'Items' : category === 'papers' ? 'Rules' : 'Rounds'
                                }</div>
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
                                        <h4 className={styles.modalSectionTitle}>
                                            {category === 'workshops' ? 'Agenda' : category === 'papers' ? 'Rules' : 'Rounds'}
                                        </h4>
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
                                    onClick={!currentEvent.isRegistered ? handleRegisterClick : undefined}
                                     style={{
                                        opacity: currentEvent.isRegistered ? 0.7 : 1,
                                        cursor: currentEvent.isRegistered ? 'default' : 'pointer',
                                         background: currentEvent.isRegistered ? 'rgba(0, 255, 0, 0.2)' : undefined,
                                        borderColor: currentEvent.isRegistered ? '#00ff00' : undefined,
                                    }}
                                >
                                    <span>{currentEvent.isRegistered ? 'Registered' : 'Register Now'}</span>
                                    {/* <i className="ri-arrow-right-up-line"></i> */}
                                </button>
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
                        background: 'rgba(0, 0, 0, 0.7)',
                        zIndex: 1000,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backdropFilter: 'blur(5px)'
                    }}
                    onClick={(e) => {
                         if (e.target === e.currentTarget && notification.type !== 'confirm') closeNotification();
                    }}
                >
                    <div style={{
                        width: '90%',
                        maxWidth: '450px',
                        background: 'rgba(26, 2, 11, 0.95)',
                        border: '1px solid #e04e94',
                        boxShadow: '0 0 30px rgba(199, 32, 113, 0.3)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        animation: 'fadeIn 0.3s ease-out'
                    }}>
                        <div style={{
                            padding: '20px 25px',
                            borderBottom: '1px solid rgba(224, 78, 148, 0.2)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                             <h3 style={{ 
                                 color: notification.type === 'error' ? '#ff3366' : 
                                        notification.type === 'success' ? '#00ff00' : '#e04e94',
                                 margin: 0,
                                 fontSize: '1.2rem',
                                 textTransform: 'uppercase',
                                 letterSpacing: '0.05em'
                             }}>
                                 {notification.title}
                             </h3>
                             <button 
                                 onClick={closeNotification}
                                 style={{
                                     background: 'none',
                                     border: 'none',
                                     color: 'rgba(255,255,255,0.6)',
                                     fontSize: '1.5rem',
                                     cursor: 'pointer'
                                 }}
                             >
                                 ✕
                             </button>
                        </div>
                        <div style={{ padding: '25px', color: '#ddd', fontSize: '1rem', lineHeight: '1.5' }}>
                            {notification.message}
                        </div>
                        <div style={{
                             padding: '20px 25px',
                             background: 'rgba(0,0,0,0.2)',
                             display: 'flex',
                             justifyContent: 'flex-end',
                             gap: '15px'
                        }}>
                            {notification.type === 'confirm' ? (
                                <>
                                    <button 
                                        onClick={closeNotification}
                                        style={{
                                            padding: '8px 20px',
                                            background: 'transparent',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            color: '#ccc',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={notification.onConfirm}
                                        style={{
                                            padding: '8px 24px',
                                            background: 'rgba(199, 32, 113, 0.2)',
                                            border: '1px solid #e04e94',
                                            color: '#fff',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase',
                                            fontSize: '0.85rem',
                                            boxShadow: '0 0 10px rgba(199, 32, 113, 0.2)'
                                        }}
                                    >
                                        Confirm
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={closeNotification}
                                     style={{
                                        padding: '8px 24px',
                                        background: 'rgba(199, 32, 113, 0.2)',
                                        border: '1px solid #e04e94',
                                        color: '#fff',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    Close
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
