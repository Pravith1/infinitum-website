'use client';
import React from 'react';
import { withStyles } from '@/tools/withStyles';
import { withSounds } from '@/tools/withSounds';
import { Fader } from '@/components/Fader';
import { Secuence } from '@/components/Secuence';
import EventShowcase from '@/components/EventShowcase/EventShowcase';

const styles = theme => ({
    root: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%'
    },
    content: {
        position: 'relative',
        display: 'block',
        flex: 1
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

import { useParams, useRouter } from 'next/navigation';

const EventIdPage = ({ classes, sounds }) => {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const contentElement = React.useRef(null);

    // Redirect to query param version to avoid header re-animation on navigation
    React.useEffect(() => {
        if (id) {
            router.replace(`/events?id=${id}`);
        }
    }, [id, router]);

    React.useEffect(() => {
        const onRouteChange = () => {
            if (contentElement.current) {
                contentElement.current.scrollTo(0, 0);
            }
        };
        window.addEventListener('route-change', onRouteChange);
        return () => window.removeEventListener('route-change', onRouteChange);
    }, []);

    return (
        <div className={classes.root}>
            <div
                className={classes.content}
                ref={contentElement}
            >
                <Fader
                    className={classes.main}
                    node='main'
                    classes={{ content: classes.mainContent }}
                >
                    <div className={classes.mainContent}>
                        <Secuence stagger>
                            <EventShowcase sounds={sounds} initialEventId={id} />
                        </Secuence>
                    </div>
                </Fader>
            </div>
        </div>
    );
};

export default withStyles(styles)(withSounds()(EventIdPage));
