'use client';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { withStyles } from '@/tools/withStyles';

const styles = theme => ({
    root: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 50,
        height: 50,
        border: `1px solid ${theme.color.primary.dark}`,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: theme.color.primary.main,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        transition: 'all 0.3s ease',
        zIndex: 20,
        '&:hover': {
            backgroundColor: theme.color.primary.dark,
            color: theme.color.text.primary,
            boxShadow: `0 0 20px ${theme.color.primary.main}`,
            transform: 'translateY(-50%) scale(1.1)',
        },
        '&:disabled': {
            opacity: 0.2,
            cursor: 'not-allowed',
            '&:hover': {
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                boxShadow: 'none',
            },
        },
    },
    left: {
        left: 10,
    },
    right: {
        right: 10,
    },
    icon: {
        display: 'block',
    },
});

class NavigationArrows extends React.Component {
    static propTypes = {
        classes: PropTypes.object,
        onPrev: PropTypes.func.isRequired,
        onNext: PropTypes.func.isRequired,
        canGoPrev: PropTypes.bool,
        canGoNext: PropTypes.bool,
    };

    static defaultProps = {
        canGoPrev: true,
        canGoNext: true,
    };

    render() {
        const { classes, onPrev, onNext, canGoPrev, canGoNext } = this.props;

        return (
            <>
                <button
                    className={cx(classes.root, classes.left)}
                    onClick={onPrev}
                    disabled={!canGoPrev}
                    aria-label="Previous event"
                >
                    <span className={classes.icon}>←</span>
                </button>
                <button
                    className={cx(classes.root, classes.right)}
                    onClick={onNext}
                    disabled={!canGoNext}
                    aria-label="Next event"
                >
                    <span className={classes.icon}>→</span>
                </button>
            </>
        );
    }
}

export default withStyles(styles)(NavigationArrows);
