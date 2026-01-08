'use client';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Image from 'next/image';

import { SocialLinks } from '../SocialLinks';

const contactSections = [
    {
        title: 'Heads',
        contacts: [
            { name: 'Arulkumara B R', position: 'Secretary', phone: '+91 8610202823' },
            { name: 'Sanjay J', position: 'Joint Secretary', phone: '+91 9789710033' },
            { name: 'Naren Siddharth M', position: 'Head-Sponsorship', phone: '+91 9940979069' }
        ]
    },
    {
        title: 'Tech Support',
        contacts: [
            { name: 'Darshan V G', phone: '+91 9790521129' },
            { name: 'Adhish Krishna S', phone: '+91 8217896832' },
            { name: 'Abinav P', phone: '+91 9965511133' }
        ]
    },
    {
        title: 'Event Support',
        contacts: [
            { name: 'Rohith Dharshan', phone: '+91 9920946666' },
            { name: 'Shashwath', phone: '+91 9845677934' },
            { name: 'Dinesh T M', phone: '+91 9535372504' }
        ]
    },
    {
        title: 'Accommodation (Boys)',
        contacts: [
            { name: 'Rohith Sarveshaa', phone: '+91 8610272023' },
            { name: 'Karthick Saravanan', phone: '+91 8056936690' },
        ]
    },
    {
        title: 'Accommodation (Girls)',
        contacts: [
            { name: 'Kanishka', phone: '+91 8838401957' },
            { name: 'Thejashree N', phone: '+91 9842119832' }
        ]
    }
];

class Component extends React.PureComponent {
    static displayName = 'HomeFooter';

    static propTypes = {
        theme: PropTypes.object.isRequired,
        classes: PropTypes.object.isRequired,
        className: PropTypes.any
    };

    render() {
        const { classes, className, ...etc } = this.props;

        return (
            <footer className={cx(classes.root, className)} {...etc}>
                <div className={classes.content}>
                    {/* Logo Section */}
                    <div className={classes.logoSection}>
                        <Image
                            src="/images/Infinitum.png"
                            alt="Infinitum Logo"
                            width={200}
                            height={70}
                            className={classes.logo}
                            priority
                        />
                    </div>

                    {/* Contact Sections Grid */}
                    <div className={classes.contactGrid}>
                        {contactSections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className={classes.contactSection}>
                                <span className={classes.sectionTitle}>{section.title}</span>
                                {section.contacts.map((contact, contactIndex) => (
                                    <div key={contactIndex} className={classes.contactEntry}>
                                        <span className={classes.contactName}>{contact.name}</span>
                                        {contact.position && (
                                            <span className={classes.contactPosition}>{contact.position}</span>
                                        )}
                                        <span className={classes.contactPhone}>
                                            <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className={classes.phoneLink}>
                                                {contact.phone}
                                            </a>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Social Links */}
                    <div className={classes.socialSection}>
                        <SocialLinks
                            className={classes.socialLinks}
                            itemClassName={classes.socialLinksItem}
                            animateY={false}
                        />
                    </div>
                </div>
            </footer>
        );
    }
}

export { Component };
