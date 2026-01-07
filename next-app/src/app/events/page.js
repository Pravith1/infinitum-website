'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@/tools/withStyles';
import { withSounds } from '@/tools/withSounds';
import { Fader } from '@/components/Fader';
import { Secuence } from '@/components/Secuence';
import EventShowcase from '@/components/EventShowcase/EventShowcase';

const styles = theme => ({
    root: {
        position: 'relative',
        display: 'block',
        minHeight: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden'
    },
    content: {
        position: 'relative',
        display: 'block'
    },
    main: {
        padding: 0,
        maxWidth: '100% !important',
        width: '100%'
    },
    mainContent: {
        marginTop: '0 !important',
        paddingTop: '0 !important'
    }
});

class EventsPage extends React.Component {
    static propTypes = {
        classes: PropTypes.object,
        sounds: PropTypes.object
    };

    componentDidMount() {
        window.addEventListener('route-change', this.onRouteChange);
    }

    componentWillUnmount() {
        window.removeEventListener('route-change', this.onRouteChange);
    }

    onRouteChange = () => {
        if (this.contentElement) {
            this.contentElement.scrollTo(0, 0);
        }
    }

    render() {
        const { classes, sounds } = this.props;

        return (
            <div className={classes.root}>
                <div
                    className={classes.content}
                    ref={ref => (this.contentElement = ref)}
                >
                    {/* Header and AppContent removed to avoid duplication with ClientTemplate/App */}
                    <Fader
                        className={classes.main}
                        node='main'
                        classes={{ content: classes.mainContent }}
                    >
                        <div className={classes.mainContent}>
                            <Secuence stagger>
                                <EventShowcase sounds={sounds} />
                            </Secuence>
                        </div>
                    </Fader>
                    {/* Footer removed as per user request */}
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(withSounds()(EventsPage));
