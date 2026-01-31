'use client';
import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import { useRouter } from 'next/navigation';
import cx from 'classnames';
import { withStyles } from '@/tools/withStyles';
import { withSounds } from '@/tools/withSounds';
import { styles } from './Schedule.styles';
import { eventsData, workshopsData, papersData } from '@/data/eventsData';
import { useAuth } from '@/context/AuthContext';
import { eventService } from '@/services/eventservice';

const DAYS = [
    { id: 'day1', label: 'Day 1', date: 'Feb 13' },
    { id: 'day2', label: 'Day 2', date: 'Feb 14' }
];

const RAW_EVENTS = [
    // Day 1
    { title: 'Inauguration', start: '09:00', end: '10:00', category: 'general', day: 'day1', venue: 'D Block Conference Hall' },
    { title: 'Thooral Hackathon', start: '10:00', end: '16:30', category: 'flagship', day: 'day1', venue: '3AI and AIR Labs' },
    { title: 'Force Coders', start: '13:30', end: '16:00', category: 'technical', type: 'tech', day: 'day1', venue: 'Computer Center' },
    { title: 'Quest X', start: '10:00', end: '15:00', category: 'nontechnical', type: 'nontech', day: 'day1', venue: 'Classrooms' },
    { title: 'AI Infrastructure', start: '10:00', end: '16:00', category: 'workshop', day: 'day1', venue: 'SCPS Lab' },
    { title: 'Open Quiz', start: '10:00', end: '12:30', category: 'quiz', day: 'day1', venue: 'D Block Conference Hall' },
    { title: 'Award Ceremony - I', start: '16:30', end: '17:15', category: 'awards', day: 'day1', venue: 'F203' },

    // Day 2
    { title: 'Thooral Hackathon', start: '09:00', end: '15:00', category: 'flagship', day: 'day2', venue: 'GRD Lab and Programming-I Labs' },
    { title: 'Code Mania', start: '09:00', end: '15:00', category: 'technical', type: 'tech', day: 'day2', venue: 'Computer Center' },
    { title: 'Nexus', start: '09:00', end: '12:30', category: 'technical', type: 'tech', day: 'day2', venue: '3AI and Cloud Computing Labs' },
    { title: 'Git Wars', start: '09:00', end: '12:30', category: 'nontechnical', type: 'nontech', day: 'day2', venue: 'Classrooms' },
    { title: 'AI and Emerging Trends', start: '10:00', end: '12:30', category: 'presentation', day: 'day2', venue: 'Department Seminar Hall - CSE' },
    { title: 'Product Prototyping for Industry Applications', start: '09:00', end: '15:00', category: 'workshop', day: 'day2', venue: 'AIR Lab' },
    { title: 'Threat Detection Modelling', start: '09:00', end: '15:00', category: 'workshop', day: 'day2', venue: 'SCPS Lab' },
    { title: 'Award Ceremony - II', start: '16:00', end: '16:45', category: 'awards', day: 'day2', venue: 'F203' }
];

// Update CATEGORIES map to standard strings, we will handle formatting in render
const CATEGORIES = {
    general: 'General',
    flagship: 'Flagship',
    technical: 'Tech',
    nontechnical: 'Non-Tech',
    workshop: 'Workshops',
    talk: 'Talks',
    quiz: 'Quiz',
    presentation: 'Paper Presentation',
    awards: 'Awards'
};



// Define display order: general, talk, flagship, technical, nontechnical, quiz, presentation, workshop, awards
const CATEGORY_ORDER = ['general', 'talk', 'flagship', 'technical', 'nontechnical', 'quiz', 'presentation', 'workshop', 'awards'];

const START_HOUR = 9;
const END_HOUR = 18;
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;

const timeToPercent = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    const minutes = (h - START_HOUR) * 60 + m;
    return Math.max(0, Math.min(100, (minutes / TOTAL_MINUTES) * 100));
};

const packEvents = (events) => {
    const sorted = [...events].sort((a, b) => timeToPercent(a.start) - timeToPercent(b.start));
    const lanes = [];

    sorted.forEach(event => {
        let placed = false;
        for (let lane of lanes) {
            const lastEvent = lane[lane.length - 1];
            const lastEnd = timeToPercent(lastEvent.end);
            const currentStart = timeToPercent(event.start);
            if (currentStart >= lastEnd + 0.5) {
                lane.push(event);
                placed = true;
                break;
            }
        }
        if (!placed) lanes.push([event]);
    });

    return lanes;
};

const formatTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') return 'Invalid Time';
    const parts = timeStr.split(':');
    if (parts.length !== 2) return timeStr;
    const [h, m] = parts.map(Number);
    if (isNaN(h) || isNaN(m)) return timeStr;
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
};

const formatTimeShort = (timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') return 'N/A';
    const parts = timeStr.split(':');
    if (parts.length !== 2) return timeStr;
    const [h, m] = parts.map(Number);
    if (isNaN(h) || isNaN(m)) return timeStr;
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, '0')}`;
};

const Schedule = ({ classes, sounds }) => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [activeDay, setActiveDay] = useState('day1');
    const [registeredEventTitles, setRegisteredEventTitles] = useState(new Set());
    const [isAuthenticatedLocal, setIsAuthenticatedLocal] = useState(false); // Fix potential hydration mismatch if needed, but sticking to existing pattern for now
    const [registeredEventIds, setRegisteredEventIds] = useState(new Set());

    const rootRef = useRef(null);
    const playHover = () => sounds.hover && sounds.hover.play();
    const playClick = () => sounds.click && sounds.click.play();;

    // ... (useEffect for fetch is above) ...

    // Helper to check if event is registered
    const isEventRegisteredDeprecated = (title) => {
        if (!title) return false;

        // 1. Check by ID if available (Strong Match)
        const id = getEventId(title);
        if (id && registeredEventIds.has(id)) {
            return true;
        }

        // 2. Fallback to Name Check (Soft Match)
        // Normalize the schedule title: remove non-alphanumeric, lowercase
        const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normalizedScheduleTitle = normalize(title);

        for (let registeredTitle of registeredEventTitles) {
            // registeredTitle is already lowercase and trimmed from the fetch
            const normalizedRegistered = normalize(registeredTitle);

            // Check for inclusion in either direction
            if (normalizedRegistered.includes(normalizedScheduleTitle) || normalizedScheduleTitle.includes(normalizedRegistered)) {
                return true;
            }
        }
        return false;
    };

    // Fetch user's registered events
    useEffect(() => {
        const fetchRegisteredEvents = async () => {
            if (!isAuthenticated) {
                setRegisteredEventTitles(new Set());
                setRegisteredEventIds(new Set()); // Reset IDs
                return;
            }

            try {
                const registeredTitles = new Set();
                const registeredIds = new Set();

                // Fetch registered events
                try {
                    const userEvents = await eventService.getUserEvents();
                    const eventsList = Array.isArray(userEvents) ? userEvents : (userEvents.events || userEvents.data || []);
                    eventsList.forEach(event => {
                        if (event.eventName) {
                            registeredTitles.add(event.eventName.toLowerCase().trim());
                        }
                        if (event.eventId) {
                            registeredIds.add(event.eventId);
                        }
                    });
                } catch (err) {
                    console.error('Error fetching user events:', err);
                }

                // Fetch registered workshops
                try {
                    const userWorkshops = await eventService.getUserWorkshops();
                    const workshopsList = Array.isArray(userWorkshops) ? userWorkshops : (userWorkshops.workshops || userWorkshops.data || []);
                    workshopsList.forEach(workshop => {
                        if (workshop.workshopName) {
                            registeredTitles.add(workshop.workshopName.toLowerCase().trim());
                        }
                        if (workshop.workshopId) {
                            registeredIds.add(workshop.workshopId);
                        }
                    });
                } catch (err) {
                    console.error('Error fetching user workshops:', err);
                }

                // Fetch registered papers
                try {
                    const userPapers = await eventService.getUserPapers();
                    const papersList = Array.isArray(userPapers) ? userPapers : (userPapers.papers || userPapers.data || []);
                    papersList.forEach(paper => {
                        if (paper.eventName) {
                            registeredTitles.add(paper.eventName.toLowerCase().trim());
                        }
                        // Paper API might return paperId or eventId, check both or standardized field
                        if (paper.paperId) registeredIds.add(paper.paperId);
                        else if (paper.eventId) registeredIds.add(paper.eventId);
                    });
                } catch (err) {
                    console.error('Error fetching user papers:', err);
                }

                setRegisteredEventTitles(registeredTitles);
                setRegisteredEventIds(registeredIds);
            } catch (error) {
                console.error('Error fetching registered events:', error);
            }
        };

        fetchRegisteredEvents();
    }, [isAuthenticated]);

    useEffect(() => {
        if (!rootRef.current) return;
        const headerElems = rootRef.current.querySelectorAll(`.${classes.header} > *, .${classes.dayTabs}`);
        anime.set(headerElems, { opacity: 0, translateY: -20 });
        anime({
            targets: headerElems,
            opacity: 1,
            translateY: 0,
            delay: anime.stagger(100),
            easing: 'easeOutCubic'
        });
    }, []);

    useEffect(() => {
        if (!rootRef.current) return;

        // Desktop Animations
        const timelineElems = rootRef.current.querySelectorAll(`.${classes.categoryRow}`);
        anime.set(timelineElems, { opacity: 0, translateY: 20 });
        anime({
            targets: timelineElems,
            opacity: 1,
            translateY: 0,
            delay: anime.stagger(50),
            easing: 'easeOutCubic'
        });

        // Mobile Animations
        const mobileCards = rootRef.current.querySelectorAll(`.${classes.mobileEventCard}`);
        const mobileGroups = rootRef.current.querySelectorAll(`.${classes.mobileCategoryGroup}`);

        anime.set(mobileGroups, { opacity: 0, translateX: -20 });
        anime.set(mobileCards, { opacity: 0, translateY: 20 });

        anime({
            targets: mobileGroups,
            opacity: 1,
            translateX: 0,
            delay: anime.stagger(100),
            easing: 'easeOutQuad'
        });

        anime({
            targets: mobileCards,
            opacity: 1,
            translateY: 0,
            delay: anime.stagger(50, { start: 200 }), // Start after groups
            easing: 'spring(1, 80, 10, 0)'
        });
    }, [activeDay]);

    const timeMarkers = [];
    for (let h = START_HOUR; h <= END_HOUR; h++) {
        timeMarkers.push(h);
    }

    // Helper to find event ID and type (event, workshop, or paper)
    const getEventInfo = (title) => {
        // Normalize title for matching (remove special chars, lower case)
        const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');

        // Check in regular events
        const event = eventsData.find(e => {
            const normalizedEventName = e.eventName.toLowerCase().replace(/[^a-z0-9]/g, '');
            return normalizedEventName.includes(normalizedTitle) || normalizedTitle.includes(normalizedEventName);
        });
        if (event) return { id: event.eventId, type: 'event' };

        // Check in workshops
        const workshop = workshopsData.find(w => {
            const normalizedWorkshopName = w.workshopName.toLowerCase().replace(/[^a-z0-9]/g, '');
            return normalizedWorkshopName.includes(normalizedTitle) || normalizedTitle.includes(normalizedWorkshopName);
        });
        if (workshop) return { id: workshop.workshopId, type: 'workshop' };

        // Check in papers
        const paper = papersData.find(p => {
            const normalizedPaperName = p.eventName.toLowerCase().replace(/[^a-z0-9]/g, '');
            return normalizedPaperName.includes(normalizedTitle) || normalizedTitle.includes(normalizedPaperName);
        });
        if (paper) return { id: paper.paperId, type: 'paper' };

        return null;
    };

    // Helper to find event ID (for backward compatibility)
    const getEventId = (title) => {
        const info = getEventInfo(title);
        return info ? info.id : null;
    };

    // Helper to check if event is registered
    // Helper to check if event is registered
    const isEventRegistered = (title) => {
        if (!title) return false;

        // 1. Check by ID if available (Strong Match)
        const id = getEventId(title);
        if (id && registeredEventIds.has(id)) {
            return true;
        }

        // 2. Fallback to Name Check (Soft Match)
        // Normalize the schedule title: remove non-alphanumeric, lowercase
        const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normalizedScheduleTitle = normalize(title);

        for (let registeredTitle of registeredEventTitles) {
            // registeredTitle is already lowercase and trimmed from the fetch
            const normalizedRegistered = normalize(registeredTitle);

            // Check for inclusion in either direction
            if (normalizedRegistered.includes(normalizedScheduleTitle) || normalizedScheduleTitle.includes(normalizedRegistered)) {
                return true;
            }
        }
        return false;
    };

    const handleEventClick = (title) => {
        const eventInfo = getEventInfo(title);
        if (eventInfo) {
            // Navigate to appropriate route based on type
            // Directly navigate to query param URL to avoid redirect chain
            router.push(`/events?id=${eventInfo.id}`);
            if (sounds?.click) sounds.click.play();
        }
    };

    return (
        <div className={classes.root} ref={rootRef}>
            <header className={classes.header}>
                <h1 className={classes.title}>Event Schedule</h1>
                <p className={classes.subtitle}>Infinitum 2026</p>
            </header>

            {/* Day Tabs */}
            <div className={classes.dayTabs}>
                {DAYS.map(day => (
                    <button
                        key={day.id}
                        className={cx(classes.dayTab, activeDay === day.id && classes.dayTabActive)}
                        onClick={() => { setActiveDay(day.id); playClick(); }}
                        onMouseEnter={playHover}
                    >
                        {day.label} - {day.date}
                    </button>
                ))}
            </div>

            {/* Desktop Timeline */}
            <div className={cx(classes.timelineWrapper, classes.desktopView)}>
                <div className={classes.timeline}>
                    {/* Time Axis */}
                    <div className={classes.timeAxis}>
                        {timeMarkers.map(hour => (
                            <div key={hour} className={classes.timeSlot}>
                                {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
                            </div>
                        ))}
                    </div>

                    {/* Faint Vertical Grid Lines */}
                    <div className={classes.gridLines}>
                        {timeMarkers.map(hour => (
                            <div key={hour} className={classes.gridLine} />
                        ))}
                    </div>

                    {/* Event Rows by Category */}
                    {CATEGORY_ORDER.map(catKey => {
                        const catEvents = RAW_EVENTS.filter(e => e.day === activeDay && e.category === catKey);
                        if (catEvents.length === 0) return null;

                        const lanes = packEvents(catEvents);

                        return (
                            <div key={catKey} className={classes.categoryRow} style={{ minHeight: lanes.length * 58 + 10 }}>
                                <div className={classes.categoryLabel}>
                                    {CATEGORIES[catKey]}
                                </div>
                                <div className={classes.eventsTrack}>
                                    {lanes.map((lane, laneIndex) => (
                                        <div key={laneIndex} className={classes.eventLane}>
                                            {lane.map((event, idx) => {
                                                const left = timeToPercent(event.start);
                                                const width = timeToPercent(event.end) - left;

                                                const isRegistered = isEventRegistered(event.title);
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={cx(
                                                            classes.event,
                                                            classes[event.category],
                                                            isRegistered && classes.registeredEvent
                                                        )}
                                                        style={{ left: `${left}%`, width: `${width}%`, cursor: getEventId(event.title) ? 'pointer' : 'default' }}
                                                        onMouseEnter={playHover}
                                                        onClick={() => handleEventClick(event.title)}
                                                    >
                                                        <div className={classes.eventTitle}>
                                                            {event.title}
                                                            {isRegistered && <span className={classes.registeredBadge}><span>✓</span><span>REGISTERED</span></span>}
                                                        </div>
                                                        <div className={classes.eventTime}>{formatTime(event.start)} - {formatTime(event.end)}</div>

                                                        {/* Custom Tooltip */}
                                                        <div className={classes.eventTooltip}>
                                                            {event.type && <div className={classes.tooltipCategory}>{event.type === 'tech' ? 'Technical' : 'Non-Technical'}</div>}
                                                            <div className={classes.tooltipTitle}>
                                                                {event.title}
                                                                {isRegistered && ' ✓'}
                                                            </div>
                                                            <div className={classes.tooltipTime}>
                                                                {formatTime(event.start)} - {formatTime(event.end)}
                                                            </div>
                                                            {event.venue && <div className={classes.tooltipVenue}>Venue: {event.venue}</div>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile List View */}
            <div className={classes.mobileView}>
                {CATEGORY_ORDER.map(catKey => {
                    const catEvents = RAW_EVENTS
                        .filter(e => e.day === activeDay && e.category === catKey)
                        .sort((a, b) => timeToPercent(a.start) - timeToPercent(b.start));

                    if (catEvents.length === 0) return null;

                    return (
                        <div key={catKey} className={classes.mobileCategoryGroup}>
                            <div className={classes.mobileTimelineLine} />
                            <div className={classes.mobileCategoryTitle}>{CATEGORIES[catKey]}</div>
                            {catEvents.map((event, idx) => {
                                const isRegistered = isEventRegistered(event.title);
                                return (
                                    <div key={idx} className={classes.mobileEventWrapper}>
                                        <div className={classes.mobileTimelineDot} />
                                        <div
                                            className={cx(
                                                classes.mobileEventCard,
                                                classes[event.category],
                                                isRegistered && classes.registeredEvent
                                            )}
                                            onClick={() => {
                                                playClick();
                                                handleEventClick(event.title);
                                            }}
                                            style={{ cursor: getEventId(event.title) ? 'pointer' : 'default' }}
                                        >
                                            <div className={classes.mobileEventHeader}>
                                                <div className={classes.mobileEventTitle}>
                                                    {event.title}
                                                    {isRegistered && <span className={classes.registeredBadge}><span>✓</span><span>REGISTERED</span></span>}
                                                </div>
                                                {/* {event.type && <div className={classes.mobileEventCategory}>{event.type === 'tech' ? 'Technical' : 'Non-Technical'}</div>} */}
                                            </div>
                                            <div className={classes.mobileEventTime}>
                                                {formatTime(event.start)} - {formatTime(event.end)}
                                            </div>
                                            {event.venue && <div className={classes.mobileEventVenue}>Venue: {event.venue}</div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default withStyles(styles)(withSounds()(Schedule));
