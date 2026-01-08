'use client';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import anime from 'animejs';

import { Link } from '../Link';

class Component extends React.Component {
  static displayName = 'Brand';

  static propTypes = {
    theme: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    energy: PropTypes.object.isRequired,
    audio: PropTypes.object.isRequired,
    sounds: PropTypes.object.isRequired,
    className: PropTypes.any,
    link: PropTypes.string,
    hover: PropTypes.bool,
    stableTime: PropTypes.bool,
    onEnter: PropTypes.func,
    onExit: PropTypes.func,
    onLinkStart: PropTypes.func,
    onLinkEnd: PropTypes.func,
    variant: PropTypes.oneOf(['text', 'image'])
  };

  static defaultProps = {
    link: '/',
    variant: 'text'
  };

  constructor() {
    super(...arguments);

    const { energy, stableTime } = this.props;

    if (!stableTime) {
      energy.updateDuration({ enter: 820 });
    }
  }

  componentWillUnmount() {
    if (this.imageElement) {
      anime.remove(this.imageElement);
    }
    if (this.svgElement) {
      const paths = this.svgElement.querySelectorAll('path');
      anime.remove(paths);
    }
  }

  enter() {
    const { energy, sounds, stableTime, onEnter, variant } = this.props;
    
    if (variant === 'image') {
      const duration = energy.duration.enter;
      anime.set(this.imageElement, { opacity: 0, scale: 0.8 });
      anime({
        targets: this.imageElement,
        opacity: [0, 1],
        scale: [0.8, 1],
        easing: 'easeOutCubic',
        duration,
        delay: stableTime ? 0 : 200,
        complete: () => onEnter && onEnter()
      });
      return;
    }

    const paths = this.svgElement.querySelectorAll('path');

    anime.set(this.svgElement, { opacity: 1 });

    sounds.logo.play();

    anime({
      targets: paths,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'linear',
      delay: (path, index) => stableTime ? 0 : index * energy.duration.stagger,
      duration: path => stableTime ? energy.duration.enter : path.getTotalLength(),
      complete: () => {
        onEnter && onEnter();
      }
    });
  }

  exit() {
    const { energy, sounds, onExit, variant } = this.props;

    if (variant === 'image') {
      const duration = energy.duration.exit;
      anime({
        targets: this.imageElement,
        opacity: 0,
        easing: 'easeOutCubic',
        duration,
        complete: () => onExit && onExit()
      });
      return;
    }

    const paths = this.svgElement.querySelectorAll('path');

    sounds.fade.play();

    anime({
      targets: this.svgElement,
      easing: 'easeInCubic',
      duration: energy.duration.exit,
      opacity: 0
    });
    anime({
      targets: paths,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'linear',
      direction: 'reverse',
      duration: energy.duration.exit,
      complete: () => {
        anime.set(this.svgElement, { opacity: 0 });
        onExit && onExit();
      }
    });
  }



  render() {
    const {
      theme,
      classes,
      energy,
      audio,
      sounds,
      className,
      link,
      hover,
      stableTime,
      onEnter,
      onExit,
      onLinkStart,
      onLinkEnd,
      variant,
      ...etc
    } = this.props;

    return (
      <h1 className={cx(classes.root, hover && classes.hover, className)} {...etc}>
        <Link
          className={classes.link}
          href={link}
          title='Infinitum logo'
          onLinkStart={onLinkStart}
          onLinkEnd={onLinkEnd}
        >
          <span className={classes.title}>Infinitum</span>
          {variant === 'image' ? (
            <img
              ref={ref => (this.imageElement = ref)}
              className={classes.image}
              src="/images/InfinitumPink.png"
              alt="Infinitum"
              onMouseEnter={() => sounds.hover.play()}
            />
          ) : (
            <svg
              ref={ref => (this.svgElement = ref)}
              className={classes.svg}
              viewBox='0 0 1000 80'
              xmlns='http://www.w3.org/2000/svg'
              onMouseEnter={() => sounds.hover.play()}
            >
              {/* I */}
              <path className={classes.path} d='M10,70 L10,10' />
              {/* N */}
              <path className={classes.path} d='M60,70 L60,10 L140,70 L140,10' />
              {/* F */}
              <path className={classes.path} d='M190,10 L270,10 M190,10 L190,70 M190,40 L250,40' />
              {/* I */}
              <path className={classes.path} d='M320,70 L320,10' />
              {/* N */}
              <path className={classes.path} d='M370,70 L370,10 L450,70 L450,10' />
              {/* I */}
              <path className={classes.path} d='M500,70 L500,10' />
              {/* T */}
              <path className={classes.path} d='M550,10 L670,10 M610,10 L610,70' />
              {/* U */}
              <path className={classes.path} d='M720,10 L720,60 L720,70 L820,70 L820,60 L820,10' />
              {/* M */}
              <path className={classes.path} d='M870,70 L870,10 L920,45 L970,10 L970,70' />
            </svg>
          )}
        </Link>
      </h1>
    );
  }
}

export { Component };




