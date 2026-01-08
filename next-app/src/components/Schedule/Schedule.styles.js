import { rgba } from 'polished';

export const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: '100vw', // Ensure it doesn't overflow viewport
    overflowX: 'hidden', // Prevent page-level scroll
    overflowY: 'auto',
    color: theme.color.text.main,
    fontFamily: theme.typography.secondary,
    padding: '50px 0 20px 0',
    background: `linear-gradient(180deg, ${rgba(0, 0, 0, 0)} 0%, ${rgba(0, 0, 0, 0.3)} 100%)`,
    minHeight: 'auto', // Let content define height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start' // Align to top
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Force center alignment
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 0,
    marginTop: 0,
    padding: '0 10px' // Add padding to prevent text touching edges
  },
  title: {
    fontFamily: theme.typography.primary,
    color: theme.color.heading.main,
    fontSize: '1.4rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: 0,
    marginTop: 0,
    width: '100%', // Ensure it takes full width for centering
    textAlign: 'center',
    textShadow: `0 0 20px ${theme.color.secondary.main}, 0 0 10px ${theme.color.secondary.light}`,
    '@media (max-width: 600px)': {
      fontSize: '1.1rem',
      letterSpacing: '0.1em'
    }
  },
  subtitle: {
    fontSize: '0.8rem',
    color: theme.color.text.main,
    opacity: 0.8,
    letterSpacing: '0.1em',
    fontFamily: theme.typography.primary,
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  dayTabs: {
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 8,
    flexWrap: 'wrap',
    marginTop: 0,
    width: '100%' // Ensure tabs container is full width
  },
  dayTab: {
    padding: '6px 20px',
    fontSize: '0.8rem',
    fontFamily: theme.typography.primary,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    backgroundColor: 'transparent',
    border: `1px solid ${rgba(theme.color.secondary.main, 0.4)}`,
    color: theme.color.text.main,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '@media (max-width: 600px)': {
      padding: '5px 12px',
      fontSize: '0.7rem'
    },
    '&:hover': {
      backgroundColor: rgba(theme.color.secondary.main, 0.15),
      borderColor: theme.color.secondary.main
    }
  },
  dayTabActive: {
    backgroundColor: theme.color.secondary.main,
    borderColor: theme.color.secondary.main,
    color: '#fff',
    boxShadow: `0 0 15px ${rgba(theme.color.secondary.main, 0.5)}`
  },
  timelineWrapper: {
    width: '100%',
    maxWidth: '100%',
    padding: '0 5px',
    overflowX: 'auto', // Enable horizontal scroll
    overflowY: 'visible',
    WebkitOverflowScrolling: 'touch',
    display: 'block', // Ensure block display
    position: 'relative', // Layout context
    paddingTop: 80 // Add padding for first row tooltips
  },
  timeline: {
    minWidth: '100%',
    position: 'relative',
    paddingTop: 60,
    paddingBottom: 40,
    '@media (max-width: 600px)': {
      minWidth: 1000
    }
  },
  timeAxis: {
    position: 'absolute',
    top: 0,
    left: 110,
    right: 110,
    display: 'flex',
    height: 30, // Increased height to prevent text cut
    borderBottom: `1px solid ${rgba(theme.color.primary.light, 0.1)}`,
    '@media (max-width: 600px)': {
      left: 100,
      right: 100,
      fontSize: '0.6rem'
    }
  },
  timeSlot: {
    flex: 1,
    fontSize: '0.6rem',
    color: rgba(theme.color.text.main, 0.5),
    textAlign: 'center',
    whiteSpace: 'nowrap', // Prevent wrapping
    position: 'relative',
    fontFamily: theme.typography.secondary,
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: -4,
      left: '50%',
      width: 1,
      height: 4,
      background: theme.color.secondary.main
    }
  },
  // Vertical grid lines
  gridLines: {
    position: 'absolute',
    top: 20,
    left: 110,
    right: 110,
    bottom: 0,
    display: 'flex',
    pointerEvents: 'none',
    zIndex: 0,
    '@media (max-width: 600px)': {
      left: 100,
      right: 100
    }
  },
  gridLine: {
    flex: 1,
    borderLeft: `1px dashed ${rgba(theme.color.primary.light, 0.05)}`,
    height: '100%',
    '&:last-child': {
      borderRight: `1px dashed ${rgba(theme.color.primary.light, 0.05)}`
    }
  },
  categoryRow: {
    display: 'flex',
    marginBottom: 30,
    minHeight: 50,
    position: 'relative',
    paddingRight: 110,
    zIndex: 1,
    overflow: 'visible',
    '@media (max-width: 600px)': {
      paddingRight: 100
    }
  },
  categoryLabel: {
    width: 110,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10,
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: rgba(theme.color.heading.main, 0.8),
    borderRight: `2px solid ${rgba(theme.color.secondary.main, 0.3)}`,
    background: `linear-gradient(90deg, transparent 0%, ${rgba(0, 0, 0, 0.2)} 100%)`,
    fontFamily: theme.typography.primary,
    '@media (max-width: 600px)': {
      width: 100,
      fontSize: '0.55rem',
      paddingRight: 5
    }
  },
  eventsTrack: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flexDirection: 'column',
    gap: 8,
    marginLeft: 8,
    marginRight: 8
  },
  eventLane: {
    position: 'relative',
    height: 56
  },
  event: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    borderRadius: 2,
    padding: '8px 8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    overflow: 'visible',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255,255,255,0.1)',
    minHeight: 50,
    '&:hover': {
      transform: 'translateY(-4px) scale(1.05)',
      zIndex: 100,
      filter: 'brightness(1.15)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
    },
    '&:hover $eventTooltip': {
      opacity: 1,
      visibility: 'visible',
      transform: 'translateY(0)'
    }
  },
  eventTitle: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#000',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: 1.2,
    textShadow: '0 1px 3px rgba(255,255,255,0.5)',
    position: 'relative',
    paddingRight: 0,
    maxWidth: '100%',
    display: 'block'
  },
  eventTime: {
    fontSize: '0.65rem',
    color: 'rgba(0,0,0,0.75)',
    whiteSpace: 'nowrap',
    fontWeight: 600,
    marginTop: 3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textShadow: '0 1px 2px rgba(255,255,255,0.3)'
  },

  // Custom Tooltip
  eventTooltip: {
    position: 'absolute',
    bottom: 'calc(100% + 12px)',
    left: 0,
    right: 0,
    margin: '0 auto',
    width: 'max-content',
    maxWidth: '300px',
    minWidth: '200px',
    padding: '12px 16px',
    background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.98) 0%, rgba(30, 30, 30, 0.98) 100%)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${rgba(theme.color.secondary.main, 0.5)}`,
    borderRadius: 8,
    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.8), 0 0 20px ${rgba(theme.color.secondary.main, 0.3)}`,
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    pointerEvents: 'none',
    zIndex: 9999,
    whiteSpace: 'normal',
    '&:after': {
      content: '""',
      position: 'absolute',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderWidth: '10px 10px 0 10px',
      borderColor: `rgba(20, 20, 20, 0.98) transparent transparent transparent`
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 'calc(100% - 1px)',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderWidth: '11px 11px 0 11px',
      borderColor: `${rgba(theme.color.secondary.main, 0.5)} transparent transparent transparent`
    }
  },
  tooltipTitle: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: 6,
    fontFamily: theme.typography.primary,
    textShadow: `0 0 10px ${rgba(theme.color.secondary.main, 0.8)}`,
    lineHeight: 1.3
  },
  tooltipTime: {
    fontSize: '0.75rem',
    color: theme.color.secondary.main,
    fontFamily: theme.typography.secondary,
    fontWeight: 600
  },

  // Neon Color Variants with Gradients and Glows
  general: {
    background: 'linear-gradient(135deg, #FF1E64 0%, #D81552 100%)', // Neon Pink
    boxShadow: '0 0 15px rgba(255, 30, 100, 0.4)',
    '&:hover': { boxShadow: '0 0 25px rgba(255, 30, 100, 0.6)' }
  },
  flagship: {
    background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%)', // Bright Orange/Gold
    boxShadow: '0 0 20px rgba(255, 107, 0, 0.5)',
    '&:hover': { boxShadow: '0 0 30px rgba(255, 107, 0, 0.7)' },
    border: '2px solid rgba(255, 215, 0, 0.3)'
  },
  competition: {
    background: 'linear-gradient(135deg, #00E5FF 0%, #00B8D4 100%)', // Cyan
    boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)',
    '&:hover': { boxShadow: '0 0 25px rgba(0, 229, 255, 0.6)' }
  },
  workshop: {
    background: 'linear-gradient(135deg, #FFEA00 0%, #FFD600 100%)', // Electric Yellow
    boxShadow: '0 0 15px rgba(255, 234, 0, 0.4)',
    '&:hover': { boxShadow: '0 0 25px rgba(255, 234, 0, 0.6)' }
  },
  talk: {
    background: 'linear-gradient(135deg, #D500F9 0%, #AA00FF 100%)', // Neon Purple
    boxShadow: '0 0 15px rgba(213, 0, 249, 0.4)',
    '&:hover': { boxShadow: '0 0 25px rgba(213, 0, 249, 0.6)' }
  },
  quiz: {
    background: 'linear-gradient(135deg, #FF3D00 0%, #DD2C00 100%)', // Neon Orange
    boxShadow: '0 0 15px rgba(255, 61, 0, 0.4)',
    '&:hover': { boxShadow: '0 0 25px rgba(255, 61, 0, 0.6)' }
  },
  presentation: {
    background: 'linear-gradient(135deg, #00E676 0%, #00C853 100%)', // Neon Green
    boxShadow: '0 0 15px rgba(0, 230, 118, 0.4)',
    '&:hover': { boxShadow: '0 0 25px rgba(0, 230, 118, 0.6)' }
  },
  awards: {
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)', // Gold
    boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
    '&:hover': { boxShadow: '0 0 25px rgba(255, 215, 0, 0.6)' }
  },

  // Registered Event Styles
  registeredEvent: {
    border: `2px solid ${theme.color.primary.main} !important`,
    zIndex: 10,
    '&:hover': {
      transform: 'translateY(-2px) scale(1.03) !important'
    }
  },
  registeredBadge: {
    position: 'absolute',
    right: 3,
    top: 3,
    fontSize: '0.6rem',
    fontWeight: 700,
    color: '#000',
    borderRadius: 3,
    padding: '2px 4px',
    textAlign: 'center',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    '@media (max-width: 768px)': {
      right: 10,
      top: -4,
      fontSize: '1.2rem',
      color: '#fff',
      padding: 0,
      '& span:last-child': {
        display: 'none'
      }
    },
    '& span:first-child': {
      fontSize: '1em',
      fontWeight: 900,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  },
  // Mobile View Styles
  // Mobile View Styles
  desktopView: {
    display: 'block',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  mobileView: {
    display: 'none',
    width: '100%',
    padding: '0 20px',
    boxSizing: 'border-box',
    '@media (max-width: 768px)': {
      display: 'flex',
      flexDirection: 'column',
      gap: 30, // Increased gap for timeline flow
      paddingLeft: 30 // Make space for the vertical line
    }
  },
  mobileCategoryGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    position: 'relative'
  },
  mobileCategoryTitle: {
    color: theme.color.secondary.main,
    fontSize: '1rem', // Slightly larger
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    fontFamily: theme.typography.primary,
    marginBottom: 10,
    paddingLeft: 20, // Align with cards
    textShadow: `0 0 10px ${rgba(theme.color.secondary.main, 0.5)}`
  },
  mobileEventWrapper: {
    position: 'relative',
    paddingLeft: 25 // Space for dot and line
  },
  // Glowing dot on the timeline
  mobileTimelineDot: {
    position: 'absolute',
    left: 0,
    top: 20, // Center vertically with first line of text roughly
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: theme.color.secondary.main,
    boxShadow: `0 0 10px ${theme.color.secondary.main}, 0 0 20px ${theme.color.secondary.main}`,
    zIndex: 1,
    border: '2px solid #fff'
  },
  mobileEventCard: {
    position: 'relative',
    padding: '20px',
    borderRadius: 12, // More rounded
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    background: 'rgba(25, 25, 25, 0.6)', // Darker, richer background
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)', // Stronger blur
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Bouncy transition
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-2px) scale(1.02)',
      background: 'rgba(35, 35, 35, 0.7)',
      borderColor: 'rgba(255, 255, 255, 0.3)'
    },
    '&:active': {
      transform: 'scale(0.98)'
    }
  },
  mobileEventHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10
  },
  mobileEventTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#fff',
    fontFamily: theme.typography.primary,
    letterSpacing: '0.05em',
    lineHeight: 1.2,
    textShadow: '0 0 10px rgba(0,0,0,0.5)',
    position: 'relative',
    paddingRight: 35 // Space for tick icon
  },
  mobileEventTime: {
    fontSize: '0.8rem',
    color: theme.color.secondary.main, // Colored time
    fontFamily: theme.typography.secondary,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    '& svg': {
      fontSize: '1.1em'
    }
  }
});
