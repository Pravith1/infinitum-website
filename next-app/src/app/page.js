'use client';
import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@/tools/withStyles';
import { Secuence } from '@/tools/withAnimation'; // Wait, Secuence component or tool? Original: import { Secuence } from '../components/Secuence';
import { Secuence as SecuenceComponent } from '@/components/Secuence';

import { Brand } from '@/components/Brand';
import { Menu } from '@/components/Menu';
import { SocialLinks } from '@/components/SocialLinks';
import { Legal } from '@/components/Legal';
import { Link } from '@/components/Link';
import { Text } from '@/components/Text';
import { Header } from '@/components/Header';
import PrizePool from '@/components/PrizePool/PrizePool';
import SimpleHeader from '@/components/SimpleHeader/SimpleHeader';
import FlagshipEvent from '@/components/FlagshipEvent/FlagshipEvent';
import EventsGrid from '@/components/EventsGrid';

// Original had: import { Secuence } from '../components/Secuence';
// Note: I need to ensure import paths are correct. @/ is src/

const styles = theme => {
  return {
    root: {
      margin: 'auto',
      width: '100%'
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: [0, 'auto'],
      paddingTop: 120,
      padding: [120, 20, 20, 20]
    },
    presenter: {
      fontFamily: theme.typography.secondary,
      fontSize: '1.4rem',
      fontWeight: 400,
      letterSpacing: '0.4em',
      textTransform: 'uppercase',
      color: theme.color.heading.main,
      textAlign: 'center',
      marginBottom: 20,
      textShadow: `0 0 8px ${theme.color.secondary.main}`,
      maxWidth: '90%',
      '@media (max-width: 480px)': {
        fontSize: '0.85rem',
        letterSpacing: '0.25em',
        maxWidth: '85%'
      }
    },
    brand: {
      margin: [0, 'auto', 20],
      padding: [10, 0],
      width: '100%',
      maxWidth: 1000,
      '& svg': {
        maxWidth: '100%',
        padding: '20px 0',
        filter: `drop-shadow(0 0 5px ${theme.color.secondary.main})`
      },
      '& path': {
        strokeWidth: 22
      }
    },
    dates: {
      fontFamily: theme.typography.primary,
      fontSize: '3rem',
      fontWeight: 700,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: theme.color.heading.main,
      textAlign: 'center',
      marginBottom: 30,
      textShadow: `0 0 12px ${theme.color.secondary.main}, 0 0 25px ${theme.color.secondary.dark}`,
      whiteSpace: 'nowrap',
      '@media (max-width: 480px)': {
        fontSize: '2.2rem',
        letterSpacing: '0.1em'
      }
    },
    scheduleLink: {
      position: 'absolute',
      top: 20,
      right: 20,
      display: 'inline-block',
      marginBottom: 0,
      padding: '12px 24px',
      border: `2px solid ${theme.color.secondary.main}`,
      backgroundColor: 'transparent',
      fontFamily: theme.typography.primary,
      fontSize: 14,
      textTransform: 'uppercase',
      letterSpacing: '0.05em', // Adjusted to match likely Menu style
      color: '#fff',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      zIndex: 10, // Ensure it's on top
      '&:hover': {
        backgroundColor: theme.color.secondary.main,
        color: '#fff',
        boxShadow: `0 0 20px ${theme.color.secondary.main}`
      }
    },
    menu: {
      margin: [0, 'auto', 20],
      width: '100%',
      maxWidth: 600
    },
    social: {
      margin: [0, 'auto'],
      width: '100%',
      maxWidth: 400
    },
    legal: {
      position: 'absolute',
      left: '50%',
      bottom: 0,
      transform: 'translateX(-50%)'
    }
  };
};

class Component extends React.Component {
  onLinkStart = (event, { isInternal }) => {
    if (isInternal) {
      this.secuenceElement.exit();
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <>
        <SimpleHeader />
        <SecuenceComponent ref={ref => (this.secuenceElement = ref)}>
          <div className={classes.root}>
            <div className={classes.content}>
              <span className={classes.presenter}>Computer Science and Engineering Association</span>
              <span className={classes.presenter}>Presents</span>
              <Brand
                className={classes.brand}
                onLinkStart={this.onLinkStart}
              />
              <span className={classes.dates}>FEB 13 & 14</span>
              {/* <Link
              href='/schedule'
              className={classes.scheduleLink}
              onLinkStart={this.onLinkStart}
            >
              <Text>Schedule</Text>
            </Link> */}
              <Menu
                className={classes.menu}
                animation={{ duration: { enter: 400 } }}
                scheme='expand'
                onLinkStart={this.onLinkStart}
              />
              <SocialLinks
                className={classes.social}
                onLinkStart={this.onLinkStart}
              />
            </div>
            <PrizePool />
            <FlagshipEvent />
            <EventsGrid />
          </div>
        </SecuenceComponent>
      </>
    );
  }
}

Component.propTypes = {
  classes: PropTypes.any.isRequired
};

export default withStyles(styles)(Component);
