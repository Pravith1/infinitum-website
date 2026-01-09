'use client';
import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import { useRouter } from 'next/navigation';
import cx from 'classnames';
import { withStyles } from '@/tools/withStyles';
import { withSounds } from '@/tools/withSounds';
import { styles } from './Schedule.styles';
import { eventsData } from '@/data/eventsData';
import { useAuth } from '@/context/AuthContext';
import { eventService } from '@/services/eventservice';

const DAYS = [
    { id: 'day1', label: 'Day 1', date: 'Feb 13' },
    { id: 'day2', label: 'Day 2', date: 'Feb 14' }
];

const RAW_EVENTS = [
    // Day 1
    { title: 'Inauguration', start: '09:10', end: '09:45', category: 'general', day: 'day1', venue: 'D Block' },
    { title: 'Speaker Talk', start: '10:00', end: '11:00', category: 'talk', day: 'day1', venue: 'Seminar Hall A' },
    { title: 'Thooral – Hackathon', start: '10:00', end: '16:30', category: 'flagship', day: 'day1', venue: 'CC Lab' },
    { title: 'Force Coders', start: '10:00', end: '16:00', category: 'competition', day: 'day1', venue: 'GRD and Programming Labs' },
    { title: 'Quest X', start: '10:00', end: '15:00', category: 'competition', day: 'day1', venue: 'Q Block Classrooms' },
    { title: 'Workshop 1', start: '10:30', end: '16:00', category: 'workshop', day: 'day1', venue: 'SCPS Lab' },
    { title: 'Open Quiz', start: '13:45', end: '16:00', category: 'quiz', day: 'day1', venue: 'D Block' },
    { title: 'Award Ceremony I', start: '16:30', end: '17:15', category: 'awards', day: 'day1', venue: 'F203' },

    // Day 2
    { title: 'Code Mania', start: '09:00', end: '15:00', category: 'competition', day: 'day2', venue: '3AI and AIR Labs' },
    { title: 'Paper Presentation on AI and Emerging Trends', start: '10:00', end: '14:00', category: 'presentation', day: 'day2', venue: 'Classroom' },
    { title: 'Thooral – Hackathon', start: '09:00', end: '15:00', category: 'flagship', day: 'day2', venue: 'CC Lab' },
    { title: 'Nexus', start: '09:00', end: '15:00', category: 'competition', day: 'day2', venue: '3AI and CSP Labs' },
    { title: 'Git Wars', start: '09:00', end: '14:00', category: 'competition', day: 'day2', venue: 'G Block Classrooms' },
    { title: 'Workshop 2', start: '09:00', end: '15:00', category: 'workshop', day: 'day2', venue: 'AIR Lab' },
    { title: 'Workshop 3', start: '09:00', end: '15:00', category: 'workshop', day: 'day2', venue: 'SCPS Lab' },
    { title: 'Award Ceremony II', start: '15:30', end: '16:00', category: 'awards', day: 'day2', venue: 'F203' }
];

const CATEGORIES = {
    general: 'General',
    flagship: 'Flagship',
    competition: 'Events',
    workshop: 'Workshops',
    talk: 'Talks',
    quiz: 'Quiz',
    presentation: 'Presentation',
    awards: 'Awards'
};

// Define display order: general, talk, flagship, events, quiz, presentation, workshop, awards
const CATEGORY_ORDER = ['general', 'talk', 'flagship', 'competition', 'quiz', 'presentation', 'workshop', 'awards'];

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
    const rootRef = useRef(null);
    const playHover = () => sounds.hover && sounds.hover.play();
    const playClick = () => sounds.click && sounds.click.play();

    // Fetch user's registered events
    useEffect(() => {
        const fetchRegisteredEvents = async () => {
            if (!isAuthenticated) {
                setRegisteredEventTitles(new Set());
                return;
            }

            try {
                const registeredTitles = new Set();

                // Fetch registered events
                try {
                    const userEvents = await eventService.getUserEvents();
                    const eventsList = Array.isArray(userEvents) ? userEvents : (userEvents.events || userEvents.data || []);
                    eventsList.forEach(event => {
                        if (event.eventName) {
                            registeredTitles.add(event.eventName.toLowerCase().trim());
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
                    });
                } catch (err) {
                    console.error('Error fetching user workshops:', err);
                }

                setRegisteredEventTitles(registeredTitles);
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

    // Helper to find event ID
    const getEventId = (title) => {
        // Normalize title for matching (remove special chars, lower case)
        const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');

        const event = eventsData.find(e => {
            const normalizedEventName = e.eventName.toLowerCase().replace(/[^a-z0-9]/g, '');
            return normalizedEventName.includes(normalizedTitle) || normalizedTitle.includes(normalizedEventName);
        });

        return event ? event.eventId : null;
    };

    // Helper to check if event is registered
    const isEventRegistered = (title) => {
        const normalizedTitle = title.toLowerCase().trim();
        // Check exact match or partial match
        for (let registeredTitle of registeredEventTitles) {
            if (registeredTitle.includes(normalizedTitle) || normalizedTitle.includes(registeredTitle)) {
                return true;
            }
        }
        return false;
    };

    const handleEventClick = (title) => {
        const eventId = getEventId(title);
        if (eventId) {
            router.push(`/events/${eventId}`);
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
                                <div className={classes.categoryLabel}>{CATEGORIES[catKey]}</div>
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
