'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@/tools/withStyles';

const styles = theme => ({
    root: {
        position: 'fixed',
        bottom: 20,
        left: 20,
        zIndex: 1000,
        padding: '8px 12px',
        backgroundColor: 'transparent',
        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
        border: `2px solid ${theme.color.secondary.main}`,
        color: theme.color.text.main,
        fontSize: '0.45rem',
        lineHeight: 1.2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        textDecoration: 'none',
        fontFamily: theme.typography.primary,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(5px)',
        minWidth: '100px',
        '&:hover': {
            backgroundColor: theme.color.secondary.main,
            boxShadow: `0 0 10px ${theme.color.secondary.main}`,
            color: '#fff'
        },
        '@media (max-width: 480px)': {
            bottom: 15,
            left: 15,
            padding: '6px 10px',
            fontSize: '0.55rem',
            minWidth: '80px'
        }
    }
});

const GrievanceButton = ({ classes }) => {
    return (
        <a
            href={process.env.NEXT_PUBLIC_GRIEVANCE_FORM_URL || "https://forms.gle/placeholder"}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.root}
        >
            <span>Issues /</span>
            <span>Grievance</span>
        </a>
    );
};

GrievanceButton.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GrievanceButton);
