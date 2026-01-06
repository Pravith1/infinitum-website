'use client';
import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@/tools/withStyles';
import { Text } from '@/components/Text';

const styles = theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: '15px 0',
        marginBottom: 10,
    },
    navButton: {
        width: 30,
        height: 30,
        border: `1px solid ${theme.color.primary.dark}`,
        backgroundColor: 'transparent',
        color: theme.color.primary.main,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        transition: 'all 0.3s ease',
        flexShrink: 0,
        '&:hover': {
            backgroundColor: theme.color.primary.dark,
            color: theme.color.text.primary,
        },
        '&:disabled': {
            opacity: 0.3,
            cursor: 'not-allowed',
            '&:hover': {
                backgroundColor: 'transparent',
            },
        },
    },
    eventInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        minWidth: 200,
    },
    eventName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.color.text.primary,
        fontFamily: theme.typography.primary,
        textAlign: 'center',
    },
    eventMeta: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
    },
    category: {
        fontSize: 10,
        color: theme.color.primary.main,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    counter: {
        fontSize: 10,
        color: theme.color.text.secondary,
    },
});

class EventNavHeader extends React.Component {
    static propTypes = {
        classes: PropTypes.object,
        eventName: PropTypes.string,
        category: PropTypes.string,
        currentIndex: PropTypes.number,
        totalEvents: PropTypes.number,
        onPrev: PropTypes.func.isRequired,
        onNext: PropTypes.func.isRequired,
        canNavigate: PropTypes.bool,
    };

    static defaultProps = {
        eventName: 'Event',
        category: '',
        currentIndex: 0,
        totalEvents: 0,
        canNavigate: true,
    };

    render() {
        const { classes, eventName, category, currentIndex, totalEvents, onPrev, onNext, canNavigate } = this.props;

        return (
            <div className={classes.root}>
                <button
                    className={classes.navButton}
                    onClick={onPrev}
                    disabled={!canNavigate}
                    aria-label="Previous event"
                >
                    ←
                </button>

                <div className={classes.eventInfo}>
                    <span className={classes.eventName}>
                        <Text>{eventName}</Text>
                    </span>
                    <div className={classes.eventMeta}>
                        {category && <span className={classes.category}>{category}</span>}
                        {totalEvents > 0 && (
                            <span className={classes.counter}>
                                {currentIndex + 1} / {totalEvents}
                            </span>
                        )}
                    </div>
                </div>

                <button
                    className={classes.navButton}
                    onClick={onNext}
                    disabled={!canNavigate}
                    aria-label="Next event"
                >
                    →
                </button>
            </div>
        );
    }
}

export default withStyles(styles)(EventNavHeader);
