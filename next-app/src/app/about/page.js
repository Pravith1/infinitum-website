'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { withStyles } from '@/tools/withStyles';
import { Fader } from '@/components/Fader';
import { Secuence } from '@/components/Secuence';
import { Text } from '@/components/Text';

const styles = theme => ({
    root: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        minHeight: '100vh'
    },
    content: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        padding: [40, 20],
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        '@media (max-width: 768px)': {
            padding: [30, 16]
        }
    },
    mainTitle: {
        fontFamily: theme.typography.primary,
        fontSize: '4rem',
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: theme.color.heading.main,
        textAlign: 'center',
        marginBottom: 60,
        textShadow: `0 0 20px ${theme.color.secondary.main}, 0 0 40px ${theme.color.secondary.dark}`,
        '@media (max-width: 768px)': {
            fontSize: '2.5rem',
            letterSpacing: '0.15em',
            marginBottom: 40
        }
    },
    section: {
        width: '100%',
        marginBottom: 60,
        padding: [40, 40],
        background: `linear-gradient(135deg, rgba(199, 32, 113, 0.08) 0%, rgba(0, 0, 0, 0.4) 100%)`,
        border: `1px solid rgba(199, 32, 113, 0.3)`,
        borderRadius: 8,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${theme.color.secondary.main}, transparent)`
        },
        '@media (max-width: 768px)': {
            padding: [30, 20],
            marginBottom: 40
        }
    },
    sectionWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 40,
        '@media (max-width: 768px)': {
            flexDirection: 'column',
            gap: 24
        }
    },
    sectionContent: {
        flex: 1,
        order: 1,
        '@media (max-width: 768px)': {
            order: 2  // Content goes below image on mobile
        }
    },
    sectionImageContainer: {
        flexShrink: 0,
        order: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '@media (max-width: 768px)': {
            order: 1,  // Image goes above content on mobile
            width: '100%'
        }
    },
    sectionImage: {
        borderRadius: 8,
        border: `2px solid rgba(199, 32, 113, 0.4)`,
        boxShadow: `0 0 20px rgba(199, 32, 113, 0.2)`
    },
    sectionTitle: {
        fontFamily: theme.typography.primary,
        fontSize: '2rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: theme.color.secondary.light,
        marginBottom: 24,
        textShadow: `0 0 10px ${theme.color.secondary.main}`,
        '@media (max-width: 768px)': {
            fontSize: '1.5rem',
            marginBottom: 16,
            textAlign: 'center'
        }
    },
    sectionText: {
        fontFamily: theme.typography.secondary,
        fontSize: '1.1rem',
        lineHeight: 1.8,
        color: theme.color.text.main,
        marginBottom: 16,
        '&:last-child': {
            marginBottom: 0
        },
        '@media (max-width: 768px)': {
            fontSize: '1rem',
            lineHeight: 1.7
        }
    },
    highlight: {
        color: theme.color.tertiary.main,
        fontWeight: 500
    },
    prizeHighlight: {
        color: theme.color.tertiary.light,
        fontWeight: 700,
        fontSize: '1.2em'
    },
    themeQuote: {
        fontFamily: theme.typography.primary,
        fontSize: '1.3rem',
        fontStyle: 'italic',
        color: theme.color.secondary.light,
        textAlign: 'center',
        marginTop: 24,
        padding: [16, 24],
        borderLeft: `4px solid ${theme.color.tertiary.main}`,
        background: 'rgba(250, 225, 39, 0.05)',
        '@media (max-width: 768px)': {
            fontSize: '1.1rem',
            padding: [12, 16]
        }
    }
});

class AboutPage extends React.Component {
    static propTypes = {
        classes: PropTypes.object
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Fader node='main'>
                    <div className={classes.content}>
                        <Secuence stagger>
                            <Text className={classes.mainTitle}>About</Text>

                            {/* PSG Tech Section */}
                            <div className={classes.section}>
                                <div className={classes.sectionWrapper}>
                                    <div className={classes.sectionContent}>
                                        <Text className={classes.sectionTitle}>PSG Tech</Text>
                                        <Text className={classes.sectionText}>
                                            PSG College of Technology (PSG CT), established in 1951 by PSG & Sons' Charities,
                                            is a premier engineering institution known for academic excellence and industry-focused
                                            education. The college offers <span className={classes.highlight}>21 undergraduate</span> and{' '}
                                            <span className={classes.highlight}>24 postgraduate programmes</span> in Engineering,
                                            Technology, Computer Applications, and Applied Sciences.
                                        </Text>
                                        <Text className={classes.sectionText}>
                                            PSG Tech houses advanced Centers of Excellence such as the{' '}
                                            <span className={classes.highlight}>TIFAC Core</span>,{' '}
                                            <span className={classes.highlight}>Virtual Reality Centre</span>, and{' '}
                                            <span className={classes.highlight}>Nano-tool Centre</span>, and operates in-campus
                                            manufacturing units. The institution maintains strong industry and research collaborations,
                                            promoting innovation and practical learning.
                                        </Text>
                                        <Text className={classes.sectionText}>
                                            PSG CT has received several national recognitions, including{' '}
                                            <span className={classes.highlight}>2nd rank in ARIIA 2021</span> and the{' '}
                                            <span className={classes.highlight}>AICTE–CII Best Industry-Linked Institute Award (2012)</span>.
                                            During India's G20 Presidency in 2022, the college was selected among 75 institutions
                                            nationwide for academic and cultural outreach.
                                        </Text>
                                        <Text className={classes.sectionText}>
                                            With a strong alumni network in leadership roles across government and corporate sectors,
                                            PSG Tech continues to contribute significantly to technical education and national development.
                                        </Text>
                                    </div>
                                    <div className={classes.sectionImageContainer}>
                                        <Image
                                            src="/images/College.jpeg"
                                            alt="PSG College of Technology"
                                            width={300}
                                            height={200}
                                            className={classes.sectionImage}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* CSEA Section */}
                            <div className={classes.section}>
                                <div className={classes.sectionWrapper}>
                                    <div className={classes.sectionContent}>
                                        <Text className={classes.sectionTitle}>CSEA</Text>
                                        <Text className={classes.sectionText}>
                                            The Computer Science and Engineering Association (CSEA) of PSG College of Technology
                                            is a student-driven professional body that aims to enhance the technical knowledge,
                                            leadership qualities, and overall development of Computer Science and Engineering students.
                                            CSEA serves as a platform for students to explore emerging technologies, share knowledge,
                                            and develop skills beyond the classroom curriculum.
                                        </Text>
                                        <Text className={classes.sectionText}>
                                            The association organizes various technical events such as{' '}
                                            <span className={classes.highlight}>workshops</span>,{' '}
                                            <span className={classes.highlight}>coding competitions</span>,{' '}
                                            <span className={classes.highlight}>hackathons</span>,{' '}
                                            <span className={classes.highlight}>seminars</span>,{' '}
                                            <span className={classes.highlight}>guest lectures</span>, and{' '}
                                            <span className={classes.highlight}>industrial interactions</span>.
                                            In addition to technical activities, CSEA also focuses on soft skill development,
                                            teamwork, and leadership through cultural events, quizzes, and outreach programs.
                                        </Text>
                                        <Text className={classes.sectionText}>
                                            By encouraging innovation, collaboration, and continuous learning, CSEA bridges the gap
                                            between academic learning and real-world applications, helping students prepare for
                                            careers in industry, research, and entrepreneurship.
                                        </Text>
                                    </div>
                                    <div className={classes.sectionImageContainer}>
                                        <Image
                                            src="/images/CSEA.png"
                                            alt="CSEA Logo"
                                            width={150}
                                            height={150}
                                            className={classes.sectionImage}
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Infinitum Section */}
                            <div className={classes.section}>
                                <div className={classes.sectionWrapper}>
                                    <div className={classes.sectionContent}>
                                        <Text className={classes.sectionTitle}>Infinitum</Text>
                                        <Text className={classes.sectionText}>
                                            <span className={classes.highlight}>Infinitum 2026</span> is the flagship technical fest
                                            of the Computer Science and Engineering Association (CSEA), PSG College of Technology.
                                            Designed to ignite innovation and creativity, Infinitum brings together students from
                                            diverse backgrounds to compete, collaborate, and learn.
                                        </Text>
                                        <Text className={classes.sectionText}>
                                            The fest features an exciting mix of{' '}
                                            <span className={classes.highlight}>hackathons</span>,{' '}
                                            <span className={classes.highlight}>coding contests</span>,{' '}
                                            <span className={classes.highlight}>workshops</span>,{' '}
                                            <span className={classes.highlight}>technical and non-technical events</span>,{' '}
                                            <span className={classes.highlight}>paper presentations</span>, and an{' '}
                                            <span className={classes.highlight}>open quiz</span>, creating a vibrant platform for
                                            skill development and knowledge exchange. With a total prize pool of{' '}
                                            <span className={classes.prizeHighlight}>₹1,00,000</span>, Infinitum 2026 celebrates
                                            talent, problem-solving, and emerging technologies.
                                        </Text>
                                        <div className={classes.themeQuote}>
                                            "The Silent Rise of a Limitless Future"
                                        </div>
                                        <Text className={classes.sectionText} style={{ marginTop: 24 }}>
                                            Driven by this theme, Infinitum 2026 aims to inspire students to explore cutting-edge
                                            advancements and shape the future of technology.
                                        </Text>
                                    </div>
                                    <div className={classes.sectionImageContainer}>
                                        <Image
                                            src="/images/Infinitum.png"
                                            alt="Infinitum Logo"
                                            width={250}
                                            height={90}
                                            className={classes.sectionImage}
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Secuence>
                    </div>
                </Fader>
            </div>
        );
    }
}

export default withStyles(styles)(AboutPage);
