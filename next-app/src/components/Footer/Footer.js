'use client';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { rgba } from 'polished';
import anime from 'animejs';
import Image from 'next/image';

import { getViewportRange } from '../../tools/viewport';
import { Secuence } from '../Secuence';
import { SocialLinks } from '../SocialLinks';

class Component extends React.PureComponent {
  static displayName = 'Footer';

  static propTypes = {
    theme: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    energy: PropTypes.object.isRequired,
    audio: PropTypes.object.isRequired,
    sounds: PropTypes.object.isRequired,
    className: PropTypes.any,
    children: PropTypes.any
  };

  constructor() {
    super(...arguments);

    this.state = {
      show: false,
      shapes: [],
      shutterExtension: 0
    };

    const { energy } = this.props;
    const durationEnter = this.getDurationEnter();

    energy.updateDuration({ enter: durationEnter });
  }

  componentDidMount() {
    this.draw();

    window.addEventListener('resize', this.onResize);
    window.addEventListener('shutter-state-change', this.onShutterChange);
  }

  componentWillUnmount() {
    this.stop();

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('shutter-state-change', this.onShutterChange);
  }

  onResize = () => {
    this.draw();
    this.reset();
  }

  onShutterChange = (event) => {
    const { shutterState } = event.detail;
    const isActive = shutterState === 'closing' || shutterState === 'closed';

    // Calculate exact distance to screen center
    const screenCenter = window.innerHeight / 2;
    const footerTop = this.element.getBoundingClientRect().top;
    const distanceToCenter = Math.max(0, footerTop - screenCenter);
    const extension = isActive ? distanceToCenter : 0;

    this.setState({ shutterExtension: extension }, () => {
      this.draw();
    });
  }

  draw() {
    const { theme } = this.props;
    const { small } = getViewportRange();
    const { shutterExtension } = this.state;
    const width = this.element.offsetWidth;
    const height = this.element.offsetHeight;
    const totalHeight = height + shutterExtension;

    this.svg.setAttribute('width', width);
    this.svg.setAttribute('height', totalHeight);
    // Position SVG to grow upward by setting negative top
    this.svg.style.top = `-${shutterExtension}px`;
    this.svg.style.transition = 'top 0.4s ease-in-out, height 0.4s ease-in-out';

    const boxWidth = Math.min(1000, width);
    const offset = small ? 5 : 20;
    const pit = small ? 5 : 10;

    const x1 = ((width - boxWidth) / 2);
    const x2 = ((width - boxWidth) / 2) + offset;
    const x3 = x2 + (boxWidth / 2);
    const x4 = x2 + boxWidth - (offset * 2);
    const x5 = x4 + offset;

    const backgroundColor = rgba(theme.color.background.dark, theme.color.alpha);
    const lineColor = rgba(theme.color.primary.dark, 0.5);

    // Keep decorative lines at y=0, fill from 0 down to totalHeight
    const ground = {
      d: `M0,0 L${x1},0 L${x2},${pit} L${x4},${pit} L${x5},0 L${width},0 L${width},${totalHeight} L0,${totalHeight} L0,0`,
      fill: backgroundColor,
      stroke: backgroundColor
    };
    // Decorative lines at y=0 (will move with SVG)
    const line1 = {
      d: `M0,0 L${x1},0`,
      stroke: lineColor
    };
    const slash1 = {
      d: `M${x1},0 L${x2},${pit}`,
      stroke: theme.color.tertiary.main,
      strokeWidth: 3
    };
    const line2 = {
      d: `M${x2},${pit} L${x3},${pit}`,
      stroke: lineColor
    };
    const line3 = {
      d: `M${x4},${pit} L${x3},${pit}`,
      stroke: lineColor
    };
    const slash2 = {
      d: `M${x5},0 L${x4},${pit}`,
      stroke: theme.color.tertiary.main,
      strokeWidth: 3
    };
    const line4 = {
      d: `M${width},0 L${x5},0`,
      stroke: lineColor
    };

    const shapes = [ground, line1, slash1, line2, line3, slash2, line4];

    this.setState({ shapes });
  }

  getDurationEnter() {
    const { theme } = this.props;
    const { small, medium } = getViewportRange();
    return (small || medium ? 2 : 4) * theme.animation.time;
  }

  playSound() {
    const { sounds } = this.props;

    if (!sounds.deploy.playing()) {
      sounds.deploy.play();
    }
  }

  stopSound() {
    const { sounds } = this.props;
    sounds.deploy.stop();
  }

  enter() {
    const shapes = Array.from(this.svg.querySelectorAll('path'));
    const [ground, line1, slash1, line2, line3, slash2, line4] = shapes;
    const duration = this.getDurationEnter();

    anime.set(shapes, { opacity: 0 });

    this.playSound();

    anime({
      targets: this.element,
      translateY: ['100%', 0],
      easing: 'easeOutCubic',
      duration,
      complete: () => this.stopSound()
    });

    anime({
      targets: ground,
      opacity: [0, 1],
      easing: 'easeOutCubic',
      duration,
      complete: () => {
        this.draw();
        this.setState({ show: true });
      }
    });

    const shapesGroup1 = [line1, line4];
    const scaleGroup1 = shapesGroup1[0].getTotalLength() / this.element.offsetWidth;
    const durationGroup1 = duration * scaleGroup1;

    anime.set(shapesGroup1, { opacity: 1 });
    anime({
      targets: shapesGroup1,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'linear',
      duration: durationGroup1
    });

    const shapesGroup2 = [slash1, slash2];
    const scaleGroup2 = shapesGroup2[0].getTotalLength() / this.element.offsetWidth;
    const durationGroup2 = duration * scaleGroup2;

    anime.set(shapesGroup2, { opacity: 1 });
    anime({
      targets: shapesGroup2,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'linear',
      delay: durationGroup1,
      duration: durationGroup2
    });

    const shapesGroup3 = [line2, line3];
    const scaleGroup3 = shapesGroup3[0].getTotalLength() / this.element.offsetWidth;
    const durationGroup3 = duration * scaleGroup3;

    anime.set(shapesGroup3, { opacity: 1 });
    anime({
      targets: shapesGroup3,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'linear',
      delay: durationGroup1,
      duration: durationGroup3
    });
  }

  exit() {
    const { energy, sounds } = this.props;
    const shapes = Array.from(this.svg.querySelectorAll('path'));
    const [ground, line1, slash1, line2, line3, slash2, line4] = shapes;
    const duration = energy.duration.exit;

    sounds.deploy.play();

    this.setState({ show: false });

    anime({
      targets: ground,
      opacity: [1, 0],
      easing: 'easeOutCubic',
      duration,
      complete: () => this.stopSound()
    });

    const shapesGroup1 = [line1, line4];
    const scaleGroup1 = shapesGroup1[0].getTotalLength() / this.element.offsetWidth;
    const durationGroup1 = duration * scaleGroup1;

    anime({
      targets: shapesGroup1,
      strokeDashoffset: [anime.setDashoffset, 0],
      direction: 'reverse',
      easing: 'linear',
      duration: durationGroup1
    });

    const shapesGroup2 = [slash1, slash2];
    const scaleGroup2 = shapesGroup2[0].getTotalLength() / this.element.offsetWidth;
    const durationGroup2 = duration * scaleGroup2;

    anime({
      targets: shapesGroup2,
      strokeDashoffset: [anime.setDashoffset, 0],
      direction: 'reverse',
      easing: 'linear',
      delay: durationGroup1,
      duration: durationGroup2
    });

    const shapesGroup3 = [line2, line3];
    const scaleGroup3 = shapesGroup3[0].getTotalLength() / this.element.offsetWidth;
    const durationGroup3 = duration * scaleGroup3;

    anime({
      targets: shapesGroup3,
      strokeDashoffset: [anime.setDashoffset, 0],
      direction: 'reverse',
      easing: 'linear',
      delay: durationGroup1,
      duration: durationGroup3
    });
  }

  stop() {
    const shapes = this.svg.querySelectorAll('path');

    anime.remove(shapes);
    anime.remove(this.element);
  }

  reset() {
    const { energy } = this.props;
    const show = energy.entering || energy.entered;
    const shapes = Array.from(this.svg.querySelectorAll('path'));

    this.setState({ show });

    shapes.forEach(shape => {
      shape.removeAttribute('style');
      shape.removeAttribute('stroke-dasharray');
      shape.removeAttribute('stroke-dashoffset');
    });

    anime.set(this.element, { translateY: 0 });
    anime.set(shapes, { opacity: show ? 1 : 0 });
  }

  render() {
    const {
      theme,
      classes,
      energy,
      audio,
      sounds,
      className,
      ...etc
    } = this.props;
    const { show, shapes } = this.state;

    // Contact sections data
    const contactSections = [
      {
        title: 'Heads',
        contacts: [
          { name: 'Arulkumara B R', position: 'Secretary', phone: '+91 XXXXX XXXXX' },
          { name: 'Sanjay J', position: 'Joint Secretary', phone: '+91 XXXXX XXXXX' },
          { name: 'Naren Siddharth M', position: 'Head-Sponsorship', phone: '+91 XXXXX XXXXX' }
        ]
      },
      {
        title: 'Tech Support',
        contacts: [
          { name: 'Darshan V G', phone: '+91 XXXXX XXXXX' },
          { name: 'Adhish Krishna S', phone: '+91 XXXXX XXXXX' },
          { name: 'Abinav P', phone: '+91 XXXXX XXXXX' }
        ]
      },
      {
        title: 'Event Support',
        contacts: [
          { name: 'Rohith Dharshan', phone: '+91 XXXXX XXXXX' },
          { name: 'Shashwath', phone: '+91 XXXXX XXXXX' },
          { name: 'Dinesh T M', phone: '+91 XXXXX XXXXX' }
        ]
      },
      {
        title: 'Accommodation (Boys)',
        contacts: [
          { name: 'Rohith Sarveshaa', phone: '+91 XXXXX XXXXX' },
          { name: 'Karthick Saravanan', phone: '+91 XXXXX XXXXX' },
        ]
      },
      {
        title: 'Accommodation (Girls)',
        contacts: [
          { name: 'Kanishka', phone: '+91 XXXXX XXXXX' },
          { name: 'Thejashree N', phone: '+91 XXXXX XXXXX' }
        ]
      }
    ];

    return (
      <footer
        className={cx(classes.root, className)}
        ref={ref => (this.element = ref)}
        {...etc}
      >
        <svg
          className={classes.svg}
          ref={ref => (this.svg = ref)}
          xmlns='http://www.w3.org/2000/svg'
        >
          {shapes.map((shape, index) => (
            <path
              key={index}
              className={classes.path}
              stroke={shape.stroke || theme.color.primary.dark}
              strokeWidth={shape.strokeWidth || 1}
              fill={shape.fill}
              d={shape.d}
            />
          ))}
        </svg>
        <div className={classes.content}>
          <Secuence animation={{ show, independent: true }}>
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
          </Secuence>
        </div>
      </footer>
    );
  }
}

export { Component };




