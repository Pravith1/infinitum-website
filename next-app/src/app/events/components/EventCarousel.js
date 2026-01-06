'use client';
import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@/tools/withStyles';
import EventCard from './EventCard';

const styles = theme => ({
    root: {
        flex: '0 0 40%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minHeight: 350,
        // No background - transparent
        '@media (max-width: 900px)': {
            flex: '0 0 auto',
            width: '100%',
            minHeight: 300,
        },
    },
    container: {
        position: 'relative',
        width: '100%',
        height: 320,
        perspective: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // No overflow hidden - allow cards to show naturally
    },
    cardsWrapper: {
        position: 'relative',
        width: 200,
        height: 280,
        transformStyle: 'preserve-3d',
    },
});

class EventCarousel extends React.Component {
    static propTypes = {
        classes: PropTypes.object,
        events: PropTypes.array.isRequired,
        selectedIndex: PropTypes.number.isRequired,
        onSelectEvent: PropTypes.func.isRequired,
    };

    getCardPosition = (index) => {
        const { selectedIndex, events } = this.props;
        const diff = index - selectedIndex;

        if (diff === 0) return 'active';
        if (diff === -1 || (selectedIndex === 0 && index === events.length - 1)) return 'prev';
        if (diff === 1 || (selectedIndex === events.length - 1 && index === 0)) return 'next';
        return 'hidden';
    };

    render() {
        const { classes, events, selectedIndex, onSelectEvent } = this.props;

        if (!events || events.length === 0) {
            return null;
        }

        return (
            <div className={classes.root}>
                <div className={classes.container}>
                    <div className={classes.cardsWrapper}>
                        {events.map((event, index) => (
                            <EventCard
                                key={event._id || event.eventId || index}
                                event={event}
                                position={this.getCardPosition(index)}
                                onClick={() => onSelectEvent(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(EventCarousel);
