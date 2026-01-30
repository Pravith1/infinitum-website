'use client';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { withStyles } from '@/tools/withStyles';
import { Secuence as SecuenceComponent } from '@/components/Secuence';

import { Brand } from '@/components/Brand';
import { Menu } from '@/components/Menu';
import PrizePool from '@/components/PrizePool/PrizePool';
import SimpleHeader from '@/components/SimpleHeader/SimpleHeader';
import FlagshipEvent from '@/components/FlagshipEvent/FlagshipEvent';
import EventsGrid from '@/components/EventsGrid';
import Sponsors from '@/components/Sponsors';
import Speakers from '@/components/Speakers';
import Collaboration from '@/components/Collaboration';
import { HomeFooter } from '@/components/HomeFooter';
import FAQ from '@/components/FAQ';

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
        fontSize: '1.5rem',
        letterSpacing: '0.1em'
      }
    },
    subtitle: {
      fontFamily: theme.typography.primary,
      fontSize: '1.5rem',
      fontWeight: 700,
      fontStyle: 'italic',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: 'yellow',
      textAlign: 'center',
      marginBottom: 30,
      textShadow: `0 0 12px ${theme.color.secondary.main}, 0 0 25px ${theme.color.secondary.dark}`,
      whiteSpace: 'nowrap',
      '@media (max-width: 480px)': {
        fontSize: '0.7rem',
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
    },
    poweredby: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 40,
      marginTop: 20,
      marginBottom: 40,
      flexWrap: 'wrap',
      '@media (max-width: 768px)': {
        gap: 20,
        marginTop: 15,
        marginBottom: 30
      },
      '@media (max-width: 480px)': {
        gap: 15,
        flexDirection: 'column'
      },
      '& a': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)'
        }
      },
      '& img': {
        filter: `drop-shadow(0 0 10px ${theme.color.secondary.main})`,
        transition: 'filter 0.3s ease',
        '&:hover': {
          filter: `drop-shadow(0 0 20px ${theme.color.secondary.light})`
        }
      }
    },
    sponsor: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 30px',
      '& p': {
        fontFamily: theme.typography.primary,
        fontSize: '1.2rem',
        fontWeight: 700,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: theme.color.heading.main,
        textAlign: 'center',
        margin: 5,
        textShadow: `0 0 8px ${theme.color.secondary.main}`,
        '@media (max-width: 768px)': {
          fontSize: '1rem',
          letterSpacing: '0.1em'
        },
        '@media (max-width: 480px)': {
          fontSize: '0.85rem',
          letterSpacing: '0.08em'
        }
      }
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

              <span className={classes.subtitle}>National level technical symposium</span>
              <span className={classes.dates}>FEB 13 & 14, 2026</span>
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
              <span className={classes.presenter} style={{ marginTop: "20px" }}>powered by</span>
              <div className={classes.poweredby}>
                <a href='https://psiog.com/'>
                  <Image
                    src='/images/sponsors/psiog_logo.png'
                    height={220}
                    width={220}
                    alt='psiog digital logo'
                    style={{ margin: 0 }}
                  />
                </a>
                <a>
                  <div className={classes.sponsor}>
                    <p>BE CSE 2002 BATCH</p>
                    <p>ALUMNUS</p>
                  </div>
                </a>
              </div>
            </div>
            <PrizePool />
            <Collaboration />
            <FlagshipEvent />
            <EventsGrid />
            <Speakers />
            <Sponsors />
            <FAQ />
            <HomeFooter />
          </div>
        </SecuenceComponent>
      </>
    );
  }
}

Component.propTypes = {
  classes: PropTypes.any.isRequired
};

const StyledComponent = withStyles(styles)(Component);

// Wrapper to capture referral code on homepage
function HomePage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');

    if (ref) {
      // Save referral code to localStorage
      localStorage.setItem('club_referral_code', ref);
      //console.log('Referral code captured on homepage:', ref);

      // Remove the 'ref' query parameter from URL without page reload
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('ref');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  return <StyledComponent />;
}

export default HomePage;
