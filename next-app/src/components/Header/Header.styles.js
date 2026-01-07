'use client';
import { rgba } from 'polished';

const styles = theme => ({
  root: {
    position: 'relative',
    display: 'block',
    margin: [0, 'auto', 10],
    width: '100%',
    overflow: 'visible'
  },
  svg: {
    display: 'block',
    position: 'absolute',
    left: 0,
    top: 0,
    transition: 'transform 0.4s ease-in-out'
  },
  path: {
    opacity: ({ energy }) => energy.animate ? 0 : 1,
    transition: 'd 0.4s ease-in-out'
  },
  content: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    margin: [0, 'auto'],
    padding: [20, 20, 10],
    width: '100%',
    maxWidth: 1000
  },
  spacer: {
    display: 'none'
  },
  brand: {
    margin: [0, 'auto', 10],
    width: '100%',
    maxWidth: 250
  },
  menu: {
    width: '100%'
  },

  // Shutter overlay that expands downward
  shutterOverlay: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    height: 0,
    backgroundColor: rgba(theme.color.background.dark, theme.color.alpha),
    transition: 'height 0.4s ease-in-out',
    zIndex: 5
  },
  shutterActive: {
    height: '50vh'
  },

  '@media screen and (min-width: 768px)': {
    root: {
      marginBottom: 20
    },
    content: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: [20, 20, 30]
    },
    spacer: {
      display: 'block',
      flex: '1 1 0',
      minWidth: 0
    },
    brand: {
      flex: '0 0 auto',
      margin: 0,
      maxWidth: 250
    },
    menu: {
      flex: '1 1 0',
      minWidth: 0,
      display: 'flex',
      justifyContent: 'flex-end',
      maxWidth: 'none'
    }
  },

  '@media screen and (min-width: 1025px)': {
    brand: {
      maxWidth: 300
    }
  }
});

export { styles };
