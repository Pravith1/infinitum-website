'use client';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import anime from 'animejs';

import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
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
    isAuthPage: PropTypes.bool
  };

  static defaultProps = {
    scheme: SCHEME_NORMAL
  };

  constructor() {
    super(...arguments);

    this.state = {
      showSecuence: false
    };
  }

  componentDidMount() {
    window.addEventListener('route-change', this.onURLChange);
  }

  componentDidUpdate(prevProps) {
    const { energy } = this.props;

    if (prevProps.energy.status !== energy.status) {
      if (energy.entering) {
        this.setState({ showSecuence: true }); // eslint-disable-line react/no-did-update-set-state
      } else if (energy.exiting) {
        this.setState({ showSecuence: false }); // eslint-disable-line react/no-did-update-set-state
      }
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
    const showAuthButtons = !isAuthenticated && !isAuthPage;

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
            <>
              <Link href='/portal/profile' {...linkProps}>
                <Text
                  animation={{ animate: animateText }}
                  audio={{ silent: !animateText }}
                >
                  Profile
                </Text>
              </Link>
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
            </>
          ) : showAuthButtons ? (
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
          ) : null}
        </nav>
      </Secuence>
    );
  }
}

// Wrapper component to use hooks with class component
const MenuWithAuth = React.forwardRef((props, ref) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  return <Component {...props} user={user} logout={logout} isAuthPage={isAuthPage} ref={ref} />;
});

MenuWithAuth.displayName = 'Menu';

export { MenuWithAuth as Component };
