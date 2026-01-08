'use client';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { usePathname } from 'next/navigation';

import { AppContent } from '../AppContent';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { useShutter } from '@/context/ShutterContext';

// Wrapper component to use hooks
function AppWithShutter({ classes, className, children, ...etc }) {
  const { shutterState } = useShutter();
  const pathname = usePathname();

  const isShuttering = shutterState === 'closing' || shutterState === 'closed' || shutterState === 'opening';
  const contentRef = useRef(null);

  // Scroll to top on mount (handles client-side navigation)
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0);
    }
  }, []);

  // Only show footer on routes other than home and about
  const showFooter = pathname !== '/' && pathname !== '/about';
  return (
    <div className={cx(classes.root, className)} {...etc}>
      <div
        className={cx(
          classes.content,
          shutterState === 'closing' && classes.shutterClosing,
          shutterState === 'closed' && classes.shutterClosed,
          shutterState === 'opening' && classes.shutterOpening
        )}
        ref={ref => {
          contentRef.current = ref;
          window.__appContentElement = ref;
        }}
      >
        <Header pathname={pathname} />
        <AppContent>
          {children}
        </AppContent>
        {showFooter && <Footer />}
      </div>
    </div>
  );
}

class Component extends React.Component {
  static displayName = 'App';

  static propTypes = {
    theme: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    className: PropTypes.any,
    children: PropTypes.any
  };

  componentDidMount() {
    window.addEventListener('route-change-start', this.onRouteChangeStart);
    window.addEventListener('route-change', this.onRouteChange);
  }

  componentWillUnmount() {
    window.removeEventListener('route-change-start', this.onRouteChangeStart);
    window.removeEventListener('route-change', this.onRouteChange);
  }

  onRouteChangeStart = ({ detail: { isInternal, href } }) => {
    // Logic restored if needed, or empty
  }

  onRouteChange = () => {
    if (window.__appContentElement) {
      window.__appContentElement.scrollTo(0, 0);
    }
  }

  render() {
    const {
      theme,
      classes,
      className,
      children,
      ...etc
    } = this.props;

    return (
      <AppWithShutter classes={classes} className={className} {...etc}>
        {children}
      </AppWithShutter>
    );
  }
}

export { Component };
