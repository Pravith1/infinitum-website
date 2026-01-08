'use client';
import { SCHEME_EXPAND } from './Menu.constants';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    margin: [0, 'auto', 20],
    userSelect: 'none',
    flexWrap: 'wrap'
  },
  item: {
    display: 'block',
    padding: [10, 0, 10],
    width: 'auto',
    minWidth: '120px',
    lineHeight: 1,
    fontSize: 14,
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadow: `0 0 5px ${theme.color.secondary.main}`,
    fontFamily: theme.typography.primary,
    color: theme.color.text.main,
    whiteSpace: 'nowrap'
  },
  divisor: {
    display: 'none',
    width: 0,
    color: theme.color.tertiary.main,
    textShadow: `0 0 5px ${theme.color.tertiary.main}`,
    fontWeight: 'normal',
    transform: 'scale(1, 0)',
    transformOrigin: 'center center'
  },
  link: {
    overflow: 'visible',
    opacity: ({ scheme }) => scheme === SCHEME_EXPAND ? 0 : 1,
    backgroundColor: 'transparent',
    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
    border: `2px solid ${theme.color.secondary.main}`,
    cursor: 'pointer',
    padding: [12, 24],
    transition: 'all 0.3s ease',

    '&:hover, &:focus': {
      backgroundColor: theme.color.secondary.main,
      color: '#ffffff'
    }
  },

  '@media (min-width: 768px)': {
    root: {
      gap: 20,
      margin: 0
    },
    item: {
      display: 'block'
    },
    divisor: {
      display: 'block'
    }
  }
});

export { styles };

