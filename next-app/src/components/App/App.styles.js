'use client';
const styles = theme => ({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: 'auto',
    width: '100%'
  },

  // When shutter is active, hide main content (not header/footer)
  shutterClosing: {
    '& > *:nth-child(2)': {  // AppContent is second child
      opacity: '0 !important',
      transition: 'opacity 0.2s ease',
      visibility: 'hidden !important',
      pointerEvents: 'none !important',
      position: 'relative',
      zIndex: -1,
      '& *': {
        opacity: '0 !important',
        visibility: 'hidden !important'
      }
    }
  },
  shutterClosed: {
    '& > *:nth-child(2)': {
      opacity: '0 !important',
      visibility: 'hidden !important',
      pointerEvents: 'none !important',
      position: 'relative',
      zIndex: -1,
      '& *': {
        opacity: '0 !important',
        visibility: 'hidden !important'
      }
    }
  },
  shutterOpening: {
    '& > *:nth-child(2)': {
      opacity: 1,
      transition: 'opacity 0.3s ease 0.1s',
      visibility: 'visible',
      pointerEvents: 'auto',
      position: 'relative',
      zIndex: 'auto',
      '& *': {
        opacity: 1,
        visibility: 'visible'
      }
    }
  },

  '@media (min-width: 768px)': {
    content: {
      overflow: 'hidden'
    }
  }
});

export { styles };
