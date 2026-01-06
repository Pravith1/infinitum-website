'use client';
import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@/tools/withStyles';

const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        // No background - transparent
    },
    imageWrapper: {
        width: '100%',
        maxWidth: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: 220,
        height: 300,
        backgroundColor: 'transparent',
        border: `1px solid ${theme.color.primary.dark}`,
        borderRadius: 4,
        overflow: 'hidden',
        // Slight 3D rotation for depth effect
        transform: 'rotateY(15deg)',
        transformStyle: 'preserve-3d',
        transition: 'all 0.4s ease',
    },
    imageContainer: {
        width: '100%',
        height: '75%',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    placeholder: {
        fontSize: 64,
        opacity: 0.5,
    },
    info: {
        padding: 12,
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        height: '25%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.color.text.primary,
        marginBottom: 4,
        fontFamily: theme.typography.primary,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    category: {
        fontSize: 10,
        color: theme.color.primary.main,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});

class EventImage extends React.Component {
    static propTypes = {
        classes: PropTypes.object,
        event: PropTypes.object,
    };

    render() {
        const { classes, event } = this.props;

        if (!event) {
            return null;
        }

        return (
            <div className={classes.root}>
                <div className={classes.imageWrapper}>
                    <div className={classes.card}>
                        <div className={classes.imageContainer}>
                            {event.image ? (
                                <img
                                    src={event.image}
                                    alt={event.eventName}
                                    className={classes.image}
                                />
                            ) : (
                                <span className={classes.placeholder}>🎯</span>
                            )}
                        </div>
                        <div className={classes.info}>
                            <div className={classes.title}>{event.eventName}</div>
                            <div className={classes.category}>{event.category}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(EventImage);
