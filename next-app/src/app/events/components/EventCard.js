'use client';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { withStyles } from '@/tools/withStyles';

const styles = theme => ({
    root: {
        position: 'absolute',
        width: 200,
        height: 280,
        // Transparent background - no black overlay
        backgroundColor: 'transparent',
        border: `1px solid ${theme.color.primary.dark}`,
        borderRadius: 4,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        transformStyle: 'preserve-3d',
    },
    active: {
        // Flipped: left side outside screen, right side inside
        transform: 'rotateY(15deg) translateZ(30px) scale(1.05)',
        zIndex: 10,
        border: `1px solid ${theme.color.primary.main}`,
    },
    prev: {
        transform: 'translateX(-80%) rotateY(-30deg) scale(0.7)',
        opacity: 0.3,
        zIndex: 5,
    },
    next: {
        transform: 'translateX(80%) rotateY(30deg) scale(0.7)',
        opacity: 0.3,
        zIndex: 5,
    },
    hidden: {
        opacity: 0,
        pointerEvents: 'none',
        transform: 'scale(0.5)',
    },
    imageContainer: {
        width: '100%',
        height: '70%',
        // No background - transparent/natural image display
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
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
        // Subtle semi-transparent background for text readability
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        height: '30%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    title: {
        fontSize: 13,
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

class EventCard extends React.Component {
    static propTypes = {
        classes: PropTypes.object,
        event: PropTypes.object.isRequired,
        position: PropTypes.oneOf(['active', 'prev', 'next', 'hidden']),
        onClick: PropTypes.func,
    };

    static defaultProps = {
        position: 'hidden',
    };

    render() {
        const { classes, event, position, onClick } = this.props;

        const cardClasses = cx(classes.root, {
            [classes.active]: position === 'active',
            [classes.prev]: position === 'prev',
            [classes.next]: position === 'next',
            [classes.hidden]: position === 'hidden',
        });

        return (
            <div className={cardClasses} onClick={onClick}>
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
        );
    }
}

export default withStyles(styles)(EventCard);
