const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: 20,
    },

    // Stats bar at top
    statsBar: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
        marginBottom: 30,
        flexWrap: 'wrap',
    },
    statItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px 20px',
        border: `1px solid ${theme.color.primary.dark}`,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${theme.color.primary.main}, transparent)`,
        },
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.color.primary.main,
        fontFamily: theme.typography.primary,
    },
    statLabel: {
        fontSize: 12,
        color: theme.color.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },

    // Main content area
    mainContent: {
        display: 'flex',
        flex: 1,
        gap: 40,
        alignItems: 'center',
        '@media (max-width: 900px)': {
            flexDirection: 'column',
        },
    },

    // Carousel section (left side)
    carouselSection: {
        flex: '0 0 45%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minHeight: 400,
        '@media (max-width: 900px)': {
            flex: '0 0 auto',
            width: '100%',
            minHeight: 300,
        },
    },

    // 3D Carousel container
    carouselContainer: {
        position: 'relative',
        width: '100%',
        height: 350,
        perspective: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Event card styles
    eventCard: {
        position: 'absolute',
        width: 220,
        height: 300,
        backgroundColor: theme.color.background.light,
        border: `1px solid ${theme.color.primary.dark}`,
        borderRadius: 4,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        transformStyle: 'preserve-3d',
        boxShadow: `0 0 20px rgba(${theme.color.primary.main}, 0.2)`,
        '&:hover': {
            boxShadow: `0 0 30px ${theme.color.primary.main}`,
        },
    },
    eventCardActive: {
        transform: 'rotateY(-15deg) translateZ(50px)',
        zIndex: 10,
    },
    eventCardPrev: {
        transform: 'translateX(-120%) rotateY(25deg) scale(0.8)',
        opacity: 0.5,
        zIndex: 5,
    },
    eventCardNext: {
        transform: 'translateX(120%) rotateY(-25deg) scale(0.8)',
        opacity: 0.5,
        zIndex: 5,
    },
    eventCardHidden: {
        opacity: 0,
        pointerEvents: 'none',
    },
    eventCardImage: {
        width: '100%',
        height: '70%',
        objectFit: 'cover',
        backgroundColor: theme.color.background.dark,
    },
    eventCardInfo: {
        padding: 15,
        textAlign: 'center',
    },
    eventCardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.color.text.primary,
        marginBottom: 5,
        fontFamily: theme.typography.primary,
    },
    eventCardCategory: {
        fontSize: 11,
        color: theme.color.primary.main,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    // Navigation arrows
    navArrow: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 50,
        height: 50,
        border: `1px solid ${theme.color.primary.dark}`,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
            boxShadow: `0 0 15px ${theme.color.primary.main}`,
        },
        '&:disabled': {
            opacity: 0.3,
            cursor: 'not-allowed',
        },
    },
    navArrowLeft: {
        left: 0,
    },
    navArrowRight: {
        right: 0,
    },

    // Details section (right side)
    detailsSection: {
        flex: 1,
        padding: 20,
        maxHeight: '70vh',
        overflowY: 'auto',
        '@media (max-width: 900px)': {
            width: '100%',
            maxHeight: 'none',
        },
    },
    detailsHeader: {
        marginBottom: 20,
    },
    detailsCategory: {
        display: 'inline-block',
        padding: '5px 15px',
        backgroundColor: theme.color.primary.dark,
        color: theme.color.primary.main,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 10,
    },
    detailsTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.color.text.primary,
        marginBottom: 10,
        fontFamily: theme.typography.primary,
    },
    detailsDescription: {
        color: theme.color.text.secondary,
        lineHeight: 1.6,
        marginBottom: 20,
    },

    // Details info grid
    detailsInfoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 15,
        marginBottom: 25,
        '@media (max-width: 600px)': {
            gridTemplateColumns: '1fr',
        },
    },
    detailsInfoItem: {
        padding: 15,
        border: `1px solid ${theme.color.primary.dark}`,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    detailsInfoLabel: {
        fontSize: 10,
        color: theme.color.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 5,
    },
    detailsInfoValue: {
        fontSize: 16,
        color: theme.color.text.primary,
        fontWeight: 'bold',
    },

    // Rounds section
    roundsSection: {
        marginTop: 25,
    },
    roundsTitle: {
        fontSize: 18,
        color: theme.color.text.primary,
        marginBottom: 15,
        fontFamily: theme.typography.primary,
    },
    roundItem: {
        display: 'flex',
        gap: 15,
        marginBottom: 15,
        padding: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        border: `1px solid ${theme.color.primary.dark}`,
    },
    roundNumber: {
        width: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.color.primary.dark,
        color: theme.color.primary.main,
        fontWeight: 'bold',
        fontSize: 14,
        flexShrink: 0,
    },
    roundContent: {
        flex: 1,
    },
    roundTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.color.text.primary,
        marginBottom: 5,
    },
    roundDescription: {
        fontSize: 13,
        color: theme.color.text.secondary,
        lineHeight: 1.5,
    },

    // Loading state
    loading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
    },
    loadingSpinner: {
        width: 40,
        height: 40,
        border: `2px solid ${theme.color.primary.dark}`,
        borderTopColor: theme.color.primary.main,
        borderRadius: '50%',
        animation: '$spin 1s linear infinite',
    },
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
    loadingText: {
        marginTop: 15,
        color: theme.color.text.secondary,
    },

    // Error state
    error: {
        textAlign: 'center',
        padding: 40,
        color: theme.color.text.secondary,
    },
});

export { styles };
