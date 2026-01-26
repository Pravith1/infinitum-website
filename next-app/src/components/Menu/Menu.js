'use client';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import anime from 'animejs';

import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { usePreRegistration } from '../../context/PreRegistrationContext';
import { isPreRegistrationEnabled, preRegistrationConfig } from '../../settings/featureFlags';
import { Link } from '../Link';
import { Text } from '../Text';
import { Secuence } from '../Secuence';
import { SCHEME_NORMAL, SCHEME_EXPAND } from './Menu.constants';

class Component extends React.PureComponent {
  static displayName = 'Menu';

  static propTypes = {
    theme: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    energy: PropTypes.object.isRequired,
    audio: PropTypes.object.isRequired,
    sounds: PropTypes.object.isRequired,
    className: PropTypes.any,
    scheme: PropTypes.oneOf([SCHEME_NORMAL, SCHEME_EXPAND]),
    onEnter: PropTypes.func,
    onExit: PropTypes.func,
    onLinkStart: PropTypes.func,
    onLinkEnd: PropTypes.func,
    user: PropTypes.object,
    logout: PropTypes.func,
    isAuthPage: PropTypes.bool,
    isProfilePage: PropTypes.bool,  // Used to hide logout on mobile for profile page
    isEventsPage: PropTypes.bool,  // Used to hide auth buttons on mobile for events page
    isFeePaymentPage: PropTypes.bool,  // Used to hide logout on mobile for fee-payment page
    isMobile: PropTypes.bool,  // Mobile screen detection
    openPreRegModal: PropTypes.func,
    showPreRegButton: PropTypes.bool  // When false and pre-reg enabled, hide buttons entirely
  };

  static defaultProps = {
    scheme: SCHEME_NORMAL,
    showPreRegButton: true  // Default to showing pre-reg button (for home page Menu)
  };

  constructor() {
    super(...arguments);

    this.state = {
      showSecuence: false
    };
  }

  componentDidMount() {
    window.addEventListener('route-change', this.onURLChange);

    // Fix: If parent energy is already entering/entered on mount (e.g. after navigation),
    // trigger the sequence animation immediately
    const { energy } = this.props;
    if (energy && (energy.entering || energy.entered)) {
      this.setState({ showSecuence: true });
      // Also trigger the button opacity animation
      setTimeout(() => this.enter(), 0);
    }
  }

  componentDidUpdate(prevProps) {
    const { energy, user } = this.props;

    if (prevProps.energy.status !== energy.status) {
      if (energy.entering) {
        this.setState({ showSecuence: true }); // eslint-disable-line react/no-did-update-set-state
      } else if (energy.exiting) {
        this.setState({ showSecuence: false }); // eslint-disable-line react/no-did-update-set-state
      }
    }

    // Fix: When user becomes authenticated after mount (login redirect),
    // the logout button wasn't there when enter() ran in componentDidMount.
    // Trigger animation now that the button exists.
    if (!prevProps.user && user && (energy.entering || energy.entered)) {
      this.setState({ showSecuence: true }); // eslint-disable-line react/no-did-update-set-state
      setTimeout(() => this.enter(), 0);
    }
  }

  componentWillUnmount() {
    const elements = this.element.querySelectorAll('a, b');
    anime.remove(elements);

    window.removeEventListener('route-change', this.onURLChange);
  }

  onURLChange = () => {
    this.forceUpdate();
  }

  handleLogout = async () => {
    const { logout } = this.props;
    if (logout) {
      await logout();
      window.location.href = '/';
    }
  }

  enter() {
    const { scheme } = this.props;

    if (scheme === SCHEME_NORMAL) {
      this.animateNormalEnter();
    } else {
      this.animateExpandEnter();
    }
  }

  animateNormalEnter() {
    const { energy, onEnter } = this.props;
    const { duration } = energy;

    const links = this.element.querySelectorAll('a, button');

    anime({
      targets: links,
      easing: 'easeOutCubic',
      opacity: [0, 1],
      duration: duration.enter,
      complete: () => onEnter && onEnter()
    });
  }

  animateExpandEnter() {
    const { energy, sounds, onEnter } = this.props;
    const { duration } = energy;

    const links = this.element.querySelectorAll('a, button');

    sounds.expand.play();

    anime({
      targets: links,
      easing: 'easeOutCubic',
      opacity: [0, 1],
      duration: duration.enter,
      complete: () => onEnter && onEnter()
    });
  }

  exit() {
    const { energy, onExit } = this.props;
    const { duration } = energy;

    const links = this.element.querySelectorAll('a, button');

    anime({
      targets: links,
      easing: 'easeOutCubic',
      opacity: 0,
      duration: duration.exit,
      complete: () => onExit && onExit()
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
      scheme,
      onEnter,
      onExit,
      onLinkStart,
      onLinkEnd,
      user,
      logout,
      isAuthPage,
      isProfilePage,
      isEventsPage,
      isFeePaymentPage,
      isMobile,
      openPreRegModal,
      showPreRegButton,
      ...etc
    } = this.props;
    const { showSecuence } = this.state;

    const animateText = scheme === SCHEME_NORMAL;
    const linkProps = {
      className: cx(classes.item, classes.link),
      onMouseEnter: () => sounds.hover.play(),
      onLinkStart,
      onLinkEnd
    };

    const isAuthenticated = user != null;
    // Hide auth buttons on mobile when on events page
    const showAuthButtons = !isAuthenticated && !isAuthPage && !(isMobile && isEventsPage);

    return (
      <Secuence
        animation={{ show: showSecuence, independent: true }}
        stagger
      >
        <nav
          className={cx(classes.root, className)}
          ref={ref => (this.element = ref)}
          {...etc}
        >
          {isAuthenticated ? (
            // Hide logout button on mobile for events page, profile page, and fee-payment page
            !(isMobile && (isEventsPage || isProfilePage || isFeePaymentPage)) && (
              <button
                className={cx(classes.item, classes.link)}
                onMouseEnter={() => sounds.hover.play()}
                onClick={this.handleLogout}
              >
                <Text
                  animation={{ animate: animateText }}
                  audio={{ silent: !animateText }}
                >
                  Logout
                </Text>
              </button>
            )
          ) : showAuthButtons ? (
            isPreRegistrationEnabled ? (
              // If showPreRegButton is true, show Pre-Register button; otherwise hide entirely
              showPreRegButton ? (
                <button
                  className={cx(classes.item, classes.link)}
                  onMouseEnter={() => sounds.hover.play()}
                  onClick={openPreRegModal}
                >
                  <Text
                    animation={{ animate: animateText }}
                    audio={{ silent: !animateText }}
                  >
                    {preRegistrationConfig.buttonText}
                  </Text>
                </button>
              ) : null
            ) : (
              <>
                <Link href='/auth?type=register' {...linkProps}>
                  <Text
                    animation={{ animate: animateText }}
                    audio={{ silent: !animateText }}
                  >
                    RegisteR
                  </Text>
                </Link>
                <Link href='/auth?type=login' {...linkProps}>
                  <Text
                    animation={{ animate: animateText }}
                    audio={{ silent: !animateText }}
                  >
                    Login
                  </Text>
                </Link>
              </>
            )
          ) : null}
        </nav>
      </Secuence>
    );
  }
}

// Wrapper component to use hooks with class component
const MenuWithAuth = React.forwardRef((props, ref) => {
  const { user, logout } = useAuth();
  const { openModal } = usePreRegistration();
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  const isProfilePage = pathname?.startsWith('/portal/profile');
  const isEventsPage = pathname?.startsWith('/events');
  const isFeePaymentPage = pathname?.startsWith('/fee-payment');

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return <Component {...props} user={user} logout={logout} isAuthPage={isAuthPage} isProfilePage={isProfilePage} isEventsPage={isEventsPage} isFeePaymentPage={isFeePaymentPage} isMobile={isMobile} openPreRegModal={openModal} ref={ref} />;
});

MenuWithAuth.displayName = 'Menu';

export { MenuWithAuth as Component };
