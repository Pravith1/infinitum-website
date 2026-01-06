'use client';
import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@/tools/withStyles';
import { Text } from '@/components/Text';

const styles = theme => ({
    root: {
        padding: 20,
        // No overflow - parent scrollContainer handles scrolling
        '@media (max-width: 900px)': {
            width: '100%',
        },
    },

    // Header with Register Button
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
        gap: 20,
        animation: '$fadeIn 0.4s ease-out',
    },
    headerContent: {
        flex: 1,
    },
    category: {
        display: 'inline-block',
        padding: '5px 14px',
        backgroundColor: theme.color.primary.dark,
        color: theme.color.primary.main,
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 10,
    },
    title: {
        margin: 0,
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.color.text.primary,
        fontFamily: theme.typography.primary,
        lineHeight: 1.2,
    },
    oneLiner: {
        color: theme.color.primary.main,
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 10,
        lineHeight: 1.4,
        margin: 0,
    },
    registerButton: {
        padding: '12px 28px',
        backgroundColor: 'transparent',
        border: `2px solid ${theme.color.primary.main}`,
        color: theme.color.primary.main,
        fontFamily: theme.typography.primary,
        fontSize: 13,
        fontWeight: 'bold',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: 2,
        transition: 'all 0.3s ease',
        flexShrink: 0,
        '&:hover': {
            backgroundColor: theme.color.primary.main,
            color: theme.color.background.dark,
        },
    },
    closedBadge: {
        padding: '8px 20px',
        backgroundColor: 'rgba(255, 100, 100, 0.2)',
        border: '1px solid rgba(255, 100, 100, 0.5)',
        color: '#ff6b6b',
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    // About Section
    aboutSection: {
        marginBottom: 25,
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        border: `1px solid ${theme.color.primary.dark}`,
        animation: '$fadeIn 0.4s ease-out 0.1s both',
    },
    sectionTitle: {
        fontSize: 14,
        color: theme.color.primary.main,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 12,
        fontWeight: 'bold',
    },
    description: {
        color: theme.color.text.secondary,
        lineHeight: 1.7,
        fontSize: 13,
        margin: 0,
    },

    // Info Grid
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12,
        marginBottom: 25,
        animation: '$fadeIn 0.4s ease-out 0.2s both',
        '@media (max-width: 600px)': {
            gridTemplateColumns: '1fr',
        },
    },
    infoItem: {
        padding: 15,
        border: `1px solid ${theme.color.primary.dark}`,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    infoLabel: {
        fontSize: 9,
        color: theme.color.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 5,
    },
    infoValue: {
        fontSize: 14,
        color: theme.color.text.primary,
        fontWeight: 'bold',
    },

    // Unique Rounds Timeline
    roundsSection: {
        marginBottom: 25,
        animation: '$fadeIn 0.4s ease-out 0.3s both',
    },
    roundsTimeline: {
        position: 'relative',
        marginLeft: 15,
    },
    // Main vertical line
    timelineLine: {
        position: 'absolute',
        left: 12,
        top: 20,
        bottom: 20,
        width: 2,
        background: `linear-gradient(180deg, ${theme.color.primary.main} 0%, ${theme.color.primary.dark} 100%)`,
    },
    roundItem: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 20,
        marginBottom: 20,
        position: 'relative',
        '&:last-child': {
            marginBottom: 0,
        },
    },
    // Dot on timeline
    roundDot: {
        width: 26,
        height: 26,
        borderRadius: '50%',
        backgroundColor: theme.color.background.dark,
        border: `3px solid ${theme.color.primary.main}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        position: 'relative',
        zIndex: 2,
        transition: 'all 0.3s ease',
    },
    roundDotInner: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: theme.color.primary.main,
    },
    roundNumber: {
        position: 'absolute',
        top: -8,
        right: -8,
        width: 18,
        height: 18,
        borderRadius: '50%',
        backgroundColor: theme.color.primary.main,
        color: theme.color.background.dark,
        fontSize: 10,
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    roundCard: {
        flex: 1,
        padding: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        border: `1px solid ${theme.color.primary.dark}`,
        borderLeft: `3px solid ${theme.color.primary.main}`,
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderLeftColor: theme.color.primary.main,
        },
    },
    roundTitle: {
        fontSize: 15,
        color: theme.color.text.primary,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: theme.typography.primary,
    },
    roundDescription: {
        fontSize: 12,
        color: theme.color.text.secondary,
        lineHeight: 1.6,
        margin: 0,
    },

    // Rules Section
    rulesSection: {
        marginBottom: 25,
        padding: 15,
        backgroundColor: 'rgba(255, 200, 100, 0.05)',
        border: '1px solid rgba(255, 200, 100, 0.2)',
        animation: '$fadeIn 0.4s ease-out 0.4s both',
    },
    rulesText: {
        fontSize: 12,
        color: theme.color.text.secondary,
        lineHeight: 1.6,
        margin: 0,
    },

    // Contacts Section
    contactsSection: {
        marginBottom: 20,
        animation: '$fadeIn 0.4s ease-out 0.5s both',
    },
    contactsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12,
        '@media (max-width: 600px)': {
            gridTemplateColumns: '1fr',
        },
    },
    contactItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        border: `1px solid ${theme.color.primary.dark}`,
    },
    contactAvatar: {
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.color.primary.dark,
        color: theme.color.primary.main,
        fontWeight: 'bold',
        fontSize: 14,
        borderRadius: '50%',
        flexShrink: 0,
    },
    contactInfo: {
        flex: 1,
        minWidth: 0,
    },
    contactName: {
        fontSize: 13,
        color: theme.color.text.primary,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    contactPhone: {
        fontSize: 11,
        color: theme.color.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },

    // Club Name
    clubSection: {
        marginTop: 15,
        padding: 10,
        textAlign: 'center',
        borderTop: `1px solid ${theme.color.primary.dark}`,
    },
    clubName: {
        fontSize: 11,
        color: theme.color.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },

    // Loading state
    loading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        color: theme.color.text.secondary,
    },

    '@keyframes fadeIn': {
        '0%': { opacity: 0, transform: 'translateY(10px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
    },
});

class EventDetails extends React.Component {
    static propTypes = {
        classes: PropTypes.object,
        event: PropTypes.object,
        loading: PropTypes.bool,
    };

    formatDate = (dateStr) => {
        if (!dateStr) return 'TBA';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    render() {
        const { classes, event, loading } = this.props;

        if (loading) {
            return (
                <div className={classes.root}>
                    <div className={classes.loading}>
                        <Text>Loading event details...</Text>
                    </div>
                </div>
            );
        }

        if (!event) {
            return (
                <div className={classes.root}>
                    <div className={classes.loading}>
                        <Text>Select an event to view details</Text>
                    </div>
                </div>
            );
        }

        return (
            <div className={classes.root}>
                {/* Header with Register Button */}
                <div className={classes.headerRow}>
                    <div className={classes.headerContent}>
                        <div className={classes.category}>{event.category || 'Event'}</div>
                        <h1 className={classes.title}>
                            <Text>{event.eventName}</Text>
                        </h1>
                        {event.oneLineDescription && (
                            <p className={classes.oneLiner}>{event.oneLineDescription}</p>
                        )}
                    </div>
                    {event.closed ? (
                        <div className={classes.closedBadge}>Closed</div>
                    ) : (
                        <button className={classes.registerButton}>
                            Register
                        </button>
                    )}
                </div>

                {/* About This Event */}
                {event.description && (
                    <div className={classes.aboutSection}>
                        <h3 className={classes.sectionTitle}>About This Event</h3>
                        <p className={classes.description}>{event.description}</p>
                    </div>
                )}

                {/* Info Grid */}
                <div className={classes.infoGrid}>
                    <div className={classes.infoItem}>
                        <div className={classes.infoLabel}>Date</div>
                        <div className={classes.infoValue}>{this.formatDate(event.date)}</div>
                    </div>
                    <div className={classes.infoItem}>
                        <div className={classes.infoLabel}>Timing</div>
                        <div className={classes.infoValue}>{event.timing || 'TBA'}</div>
                    </div>
                    <div className={classes.infoItem}>
                        <div className={classes.infoLabel}>Venue</div>
                        <div className={classes.infoValue}>{event.hall || 'TBA'}</div>
                    </div>
                    <div className={classes.infoItem}>
                        <div className={classes.infoLabel}>Team Size</div>
                        <div className={classes.infoValue}>{event.teamSize || 1} Members</div>
                    </div>
                </div>

                {/* Rounds with Unique Timeline */}
                {event.rounds && event.rounds.length > 0 && (
                    <div className={classes.roundsSection}>
                        <h3 className={classes.sectionTitle}>Rounds</h3>
                        <div className={classes.roundsTimeline}>
                            {/* Vertical connecting line */}
                            {event.rounds.length > 1 && (
                                <div className={classes.timelineLine} />
                            )}
                            {event.rounds.map((round, index) => (
                                <div key={round._id || index} className={classes.roundItem}>
                                    {/* Timeline dot with number */}
                                    <div className={classes.roundDot}>
                                        <div className={classes.roundDotInner} />
                                        <div className={classes.roundNumber}>{index + 1}</div>
                                    </div>
                                    {/* Round content card */}
                                    <div className={classes.roundCard}>
                                        <div className={classes.roundTitle}>{round.title}</div>
                                        <p className={classes.roundDescription}>{round.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Rules */}
                {event.eventRules && (
                    <div className={classes.rulesSection}>
                        <h3 className={classes.sectionTitle}>Rules</h3>
                        <p className={classes.rulesText}>{event.eventRules}</p>
                    </div>
                )}

                {/* Event Coordinators */}
                {event.contacts && event.contacts.length > 0 && (
                    <div className={classes.contactsSection}>
                        <h3 className={classes.sectionTitle}>Event Coordinators</h3>
                        <div className={classes.contactsGrid}>
                            {event.contacts.map((contact, index) => (
                                <div key={contact._id || index} className={classes.contactItem}>
                                    <div className={classes.contactAvatar}>
                                        {contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div className={classes.contactInfo}>
                                        <div className={classes.contactName}>{contact.name}</div>
                                        <a href={`tel:${contact.mobile}`} className={classes.contactPhone}>
                                            {contact.mobile}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Club Name */}
                {event.clubName && (
                    <div className={classes.clubSection}>
                        <span className={classes.clubName}>Organized by {event.clubName}</span>
                    </div>
                )}
            </div>
        );
    }
}

export default withStyles(styles)(EventDetails);
