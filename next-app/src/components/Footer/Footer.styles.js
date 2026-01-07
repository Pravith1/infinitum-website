'use client';
const styles = theme => ({
  root: {
    position: 'relative',
    marginTop: 10,
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
    padding: [40, 20, 25]
  },

  // Logo Section (Top, Centered)
  logoSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  logo: {
    width: 180,
    height: 'auto',
    filter: `drop-shadow(0 0 10px ${theme.color.secondary.main})`,
    transition: 'filter 0.3s ease, transform 0.3s ease',
    '&:hover': {
      filter: `drop-shadow(0 0 20px ${theme.color.secondary.main})`,
      transform: 'scale(1.05)'
    }
  },

  // Contact Sections Grid (5 columns on desktop)
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 25,
    maxWidth: 1200,
    margin: [0, 'auto', 30],
    padding: [0, 10]
  },

  // Individual Contact Section
  contactSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: [15, 15]
  },
  sectionTitle: {
    fontFamily: theme.typography.primary,
    fontSize: 13,
    fontWeight: 700,
    color: theme.color.secondary.main,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: `1px solid ${theme.color.secondary.dark}`,
    width: '100%',
    textShadow: `0 0 8px ${theme.color.secondary.main}`
  },

  // Contact Entry (name, position, phone) - displayed vertically
  contactEntry: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 15,
    '&:last-child': {
      marginBottom: 0
    }
  },
  contactName: {
    display: 'block',
    fontFamily: theme.typography.secondary,
    fontSize: 14,
    fontWeight: 600,
    color: theme.color.text.primary,
    marginBottom: 3
  },
  contactPosition: {
    display: 'block',
    fontFamily: theme.typography.secondary,
    fontSize: 11,
    color: theme.color.primary.main,
    fontStyle: 'italic',
    marginBottom: 3,
    letterSpacing: '0.05em'
  },
  contactPhone: {
    display: 'block',
    fontFamily: theme.typography.secondary,
    fontSize: 13,
    color: theme.color.text.secondary,
    letterSpacing: '0.03em',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: theme.color.primary.main
    }
  },
  phoneLink: {
    color: 'inherit',
    textDecoration: 'none',
    transition: 'color 0.3s ease, text-shadow 0.3s ease',
    '&:hover': {
      color: theme.color.primary.main,
      textShadow: `0 0 6px ${theme.color.secondary.main}`
    }
  },

  // Social Section
  socialSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  socialLinks: {
    margin: 0,
    maxWidth: 200
  },
  socialLinksItem: {
    padding: 0,
    height: 26,
    fontSize: 26
  },

  // Legal Section
  legal: {
    margin: [0, 'auto'],
    padding: [15, 0, 0],
    maxWidth: 600,
    fontSize: 12,
    borderTop: `1px solid ${theme.color.primary.dark}`,
    textAlign: 'center'
  },

  // Tablet (768px - 1024px): 3-column grid
  '@media screen and (max-width: 1024px) and (min-width: 768px)': {
    contactGrid: {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20
    },
    contactSection: {
      paddingBottom: 20
    }
  },

  // Mobile (<768px): Single column, stacked
  '@media screen and (max-width: 767px)': {
    content: {
      padding: [25, 15, 20]
    },
    logoSection: {
      marginBottom: 25
    },
    logo: {
      width: 140
    },
    contactGrid: {
      gridTemplateColumns: '1fr',
      gap: 0,
      padding: 0
    },
    contactSection: {
      padding: [15, 10]
    },
    sectionTitle: {
      fontSize: 12,
      marginBottom: 10
    },
    contactName: {
      fontSize: 13
    },
    contactPosition: {
      fontSize: 10
    },
    contactPhone: {
      fontSize: 12
    },
    socialLinksItem: {
      height: 24,
      fontSize: 24
    },
    legal: {
      fontSize: 11,
      padding: [12, 0, 0]
    }
  },

  // Large Desktop (≥1200px)
  '@media screen and (min-width: 1200px)': {
    content: {
      padding: [50, 30, 30]
    },
    logo: {
      width: 200
    },
    contactGrid: {
      gap: 30
    },
    sectionTitle: {
      fontSize: 14
    },
    contactName: {
      fontSize: 15
    },
    contactPhone: {
      fontSize: 14
    },
    socialLinksItem: {
      height: 30,
      fontSize: 30
    },
    legal: {
      fontSize: 13
    }
  }
});

export { styles };
