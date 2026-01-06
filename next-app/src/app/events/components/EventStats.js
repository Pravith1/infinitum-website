'use client';
import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@/tools/withStyles';
import { Text } from '@/components/Text';
import { Fader } from '@/components/Fader';

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
        marginBottom: 30,
        flexWrap: 'wrap',
    },
    statItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '15px 25px',
        position: 'relative',
        border: `1px solid ${theme.color.primary.dark}`,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.color.primary.main,
        fontFamily: theme.typography.primary,
    },
    statLabel: {
        fontSize: 11,
        color: theme.color.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginTop: 5,
    },
    categoryBadge: {
        padding: '8px 20px',
        backgroundColor: theme.color.primary.dark,
        border: `1px solid ${theme.color.primary.main}`,
        color: theme.color.primary.main,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 3,
        fontWeight: 'bold',
    },
});

class EventStats extends React.Component {
    static propTypes = {
        classes: PropTypes.object,
        event: PropTypes.object,
    };

    render() {
        const { classes, event } = this.props;

        if (!event) return null;

        return (
            <div className={classes.root}>
                <Fader>
                    <div className={classes.statItem}>
                        <span className={classes.statValue}>
                            <Text>{event.prizePool || '₹5000'}</Text>
                        </span>
                        <span className={classes.statLabel}>Prize Pool</span>
                    </div>
                </Fader>

                <Fader>
                    <div className={classes.categoryBadge}>
                        <Text>{event.category || 'Technical'}</Text>
                    </div>
                </Fader>

                <Fader>
                    <div className={classes.statItem}>
                        <span className={classes.statValue}>
                            <Text>{event.teamSize || 1}</Text>
                        </span>
                        <span className={classes.statLabel}>Team Size</span>
                    </div>
                </Fader>
            </div>
        );
    }
}

export default withStyles(styles)(EventStats);
