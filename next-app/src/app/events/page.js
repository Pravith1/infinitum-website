'use client';
import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@/tools/withStyles';
import { Main } from '@/components/Main';
import { Text } from '@/components/Text';
import { Secuence } from '@/components/Secuence';

import EventNavHeader from './components/EventNavHeader';
import EventImage from './components/EventImage';
import EventDetails from './components/EventDetails';

const styles = theme => ({
    root: {
        // Make container wider
        maxWidth: 1400,
        width: '100%',
        margin: '0 auto',
    },
    navHeaderWrapper: {
        marginTop: -10,
        marginBottom: 5,
    },
    layoutContainer: {
        display: 'flex',
        gap: 30,
        alignItems: 'flex-start',
        '@media (max-width: 900px)': {
            flexDirection: 'column',
        },
    },
    // Left side - Image (no background, shifted left)
    leftPanel: {
        flex: '0 0 280px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: -30,
        position: 'relative',
        overflow: 'hidden',
        '@media (max-width: 900px)': {
            flex: '0 0 auto',
            width: '100%',
            marginLeft: 0,
            alignItems: 'center',
        },
    },
    // Image slide transition container
    imageSlider: {
        position: 'relative',
        width: '100%',
        transition: 'transform 0.4s ease-out',
    },
    // Slide animation classes
    slideEnter: {
        animation: '$slideInRight 0.4s ease-out',
    },
    slideExit: {
        animation: '$slideOutLeft 0.4s ease-out',
    },
    // Right side - Details (with background, NO scroll - parent scrolls)
    rightPanel: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        border: `1px solid ${theme.color.primary.dark}`,
        // No maxHeight or overflow - let page scroll naturally
        '@media (max-width: 900px)': {
            width: '100%',
        },
    },
    loading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        width: '100%',
    },
    loadingSpinner: {
        width: 40,
        height: 40,
        border: `2px solid ${theme.color.primary.dark}`,
        borderTopColor: theme.color.primary.main,
        borderRadius: '50%',
        animation: '$spin 1s linear infinite',
    },
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
    '@keyframes slideInRight': {
        '0%': {
            opacity: 0,
            transform: 'translateX(100px)',
        },
        '100%': {
            opacity: 1,
            transform: 'translateX(0)',
        },
    },
    '@keyframes slideOutLeft': {
        '0%': {
            opacity: 1,
            transform: 'translateX(0)',
        },
        '100%': {
            opacity: 0,
            transform: 'translateX(-100px)',
        },
    },
    loadingText: {
        marginTop: 15,
        color: theme.color.text.secondary,
    },
    error: {
        textAlign: 'center',
        padding: 40,
        color: theme.color.text.secondary,
        width: '100%',
    },
    errorTitle: {
        color: theme.color.primary.main,
        marginBottom: 10,
    },
    retryButton: {
        marginTop: 20,
        padding: '10px 30px',
        backgroundColor: theme.color.primary.dark,
        border: `1px solid ${theme.color.primary.main}`,
        color: theme.color.primary.main,
        cursor: 'pointer',
        fontFamily: theme.typography.primary,
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: theme.color.primary.main,
            color: theme.color.background.dark,
        },
    },
});

// Get API URL from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class Events extends React.Component {
    static propTypes = {
        classes: PropTypes.object,
    };

    state = {
        events: [],
        selectedIndex: 0,
        currentEventDetails: null,
        loading: true,
        detailsLoading: false,
        error: null,
        slideDirection: 'none', // 'left', 'right', 'none'
    };

    componentDidMount() {
        this.fetchEvents();
    }

    fetchEvents = async () => {
        this.setState({ loading: true, error: null });

        try {
            const response = await fetch(`${API_URL}/api/events?limit=50`);
            const data = await response.json();

            let events = [];
            if (Array.isArray(data)) {
                events = data;
            } else if (data.data && Array.isArray(data.data)) {
                events = data.data;
            } else if (data.events && Array.isArray(data.events)) {
                events = data.events;
            }

            this.setState({ events, loading: false });

            // Fetch details for first event
            if (events.length > 0) {
                this.fetchEventDetails(events[0].eventId);
            }
        } catch (err) {
            console.error('Error fetching events:', err);
            this.setState({
                error: 'Failed to load events. Please try again.',
                loading: false
            });
        }
    };

    fetchEventDetails = async (eventId) => {
        this.setState({ detailsLoading: true });

        try {
            const response = await fetch(`${API_URL}/api/events/${eventId}`);
            const data = await response.json();

            let eventDetails = null;
            if (data.event && Array.isArray(data.event)) {
                eventDetails = data.event[0];
            } else if (data.event) {
                eventDetails = data.event;
            } else if (data.data && Array.isArray(data.data)) {
                eventDetails = data.data[0];
            } else if (data.data) {
                eventDetails = data.data;
            } else if (Array.isArray(data)) {
                eventDetails = data[0];
            } else {
                eventDetails = data;
            }

            this.setState({
                currentEventDetails: eventDetails,
                detailsLoading: false
            });
        } catch (err) {
            console.error('Error fetching event details:', err);
            this.setState({ detailsLoading: false });
        }
    };

    handleSelectEvent = (index, direction = 'none') => {
        const { events } = this.state;
        this.setState({
            selectedIndex: index,
            slideDirection: direction
        });
        if (events[index]) {
            this.fetchEventDetails(events[index].eventId);
        }
        // Reset slide direction after animation
        setTimeout(() => {
            this.setState({ slideDirection: 'none' });
        }, 400);
    };

    handlePrev = () => {
        const { selectedIndex, events } = this.state;
        const newIndex = selectedIndex > 0 ? selectedIndex - 1 : events.length - 1;
        this.handleSelectEvent(newIndex, 'right');
    };

    handleNext = () => {
        const { selectedIndex, events } = this.state;
        const newIndex = selectedIndex < events.length - 1 ? selectedIndex + 1 : 0;
        this.handleSelectEvent(newIndex, 'left');
    };

    render() {
        const { classes } = this.props;
        const {
            events,
            selectedIndex,
            currentEventDetails,
            loading,
            detailsLoading,
            error,
            slideDirection
        } = this.state;

        if (loading) {
            return (
                <Main className={classes.root} noFrame>
                    <div className={classes.loading}>
                        <div className={classes.loadingSpinner} />
                        <p className={classes.loadingText}>Loading events...</p>
                    </div>
                </Main>
            );
        }

        if (error) {
            return (
                <Main className={classes.root} noFrame>
                    <div className={classes.error}>
                        <h2 className={classes.errorTitle}><Text>Oops!</Text></h2>
                        <p><Text>{error}</Text></p>
                        <button
                            className={classes.retryButton}
                            onClick={this.fetchEvents}
                        >
                            <Text>Try Again</Text>
                        </button>
                    </div>
                </Main>
            );
        }

        if (events.length === 0) {
            return (
                <Main className={classes.root} noFrame>
                    <div className={classes.error}>
                        <h2 className={classes.errorTitle}><Text>No Events</Text></h2>
                        <p><Text>No events available at the moment.</Text></p>
                    </div>
                </Main>
            );
        }

        const currentEvent = events[selectedIndex] || {};
        const slideClass = slideDirection === 'left' ? classes.slideEnter :
            slideDirection === 'right' ? classes.slideEnter : '';

        return (
            <Main className={classes.root} noFrame>
                <Secuence stagger>
                    {/* Top Center Navigation with Event Name - moved up */}
                    <div className={classes.navHeaderWrapper}>
                        <EventNavHeader
                            eventName={currentEvent.eventName}
                            category={currentEvent.category}
                            currentIndex={selectedIndex}
                            totalEvents={events.length}
                            onPrev={this.handlePrev}
                            onNext={this.handleNext}
                            canNavigate={events.length > 1}
                        />
                    </div>

                    {/* Main Layout: Left Image | Right Details */}
                    <div className={classes.layoutContainer}>
                        {/* Left: Image only (no background, moved left) */}
                        <div className={classes.leftPanel}>
                            <div className={`${classes.imageSlider} ${slideClass}`}>
                                <EventImage
                                    key={`event-image-${selectedIndex}`}
                                    event={currentEvent}
                                />
                            </div>
                        </div>

                        {/* Right: Details with background (single page scroll) */}
                        <div className={classes.rightPanel}>
                            <EventDetails
                                key={`event-details-${selectedIndex}`}
                                event={currentEventDetails}
                                loading={detailsLoading}
                            />
                        </div>
                    </div>
                </Secuence>
            </Main>
        );
    }
}

export default withStyles(styles)(Events);
