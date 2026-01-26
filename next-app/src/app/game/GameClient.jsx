'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function GameClient() {
  const router = useRouter();
  const iframeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!loaded) setShowHelp(true);
    }, 1500);
    return () => clearTimeout(t);
  }, [loaded]);

  useEffect(() => {
    const syncFullscreenState = () => {
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      setIsFullscreen(Boolean(fsEl));

      // Some browsers only allow orientation lock while fullscreen.
      if (fsEl && window.screen?.orientation?.lock) {
        window.screen.orientation.lock('landscape').catch(() => {});
      }
      if (!fsEl && window.screen?.orientation?.unlock) {
        try {
          window.screen.orientation.unlock();
        } catch {
          // ignore
        }
      }
    };

    document.addEventListener('fullscreenchange', syncFullscreenState);
    document.addEventListener('webkitfullscreenchange', syncFullscreenState);
    syncFullscreenState();

    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreenState);
      document.removeEventListener('webkitfullscreenchange', syncFullscreenState);
    };
  }, []);

  const tryLockLandscape = async () => {
    try {
      if (window.screen?.orientation?.lock) {
        await window.screen.orientation.lock('landscape');
      }
    } catch {
      // iOS Safari and some browsers do not support/allow orientation locking.
    }
  };

  const tryUnlockOrientation = () => {
    try {
      if (window.screen?.orientation?.unlock) {
        window.screen.orientation.unlock();
      }
    } catch {
      // ignore
    }
  };

  const exitGame = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // ignore
    }
    tryUnlockOrientation();
    router.replace('/');
  }, [router]);

  useEffect(() => {
    const onMessage = (event) => {
      // Same-origin iframe (served from /godot/...) should match origin.
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'GODOT_GAME_EXIT') {
        exitGame();
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [exitGame]);

  const requestFullscreen = async () => {
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        tryUnlockOrientation();
        return;
      }

      // Enter fullscreen (best-effort across browsers).
      if (iframe.requestFullscreen) {
        await iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      }

      await tryLockLandscape();
    } catch {
      // Some browsers/devices restrict fullscreen requests.
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: 'black',
        // Keep the game behind global UI overlays (e.g. CircularMenu).
        zIndex: 0,
      }}
    >
      <iframe
        ref={iframeRef}
        title="Godot game"
        src="/godot/my-game/game.html"
        onLoad={() => setLoaded(true)}
        style={{ width: '100%', height: '100%', border: 0 }}
        allow="autoplay; fullscreen; gamepad"
        allowFullScreen
      />

      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          pointerEvents: 'auto',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 36,
            padding: '0 12px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(0,0,0,0.35)',
            color: 'white',
            textDecoration: 'none',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            fontSize: 14,
          }}
        >
          Back
        </Link>

        <button
          type="button"
          onClick={requestFullscreen}
          style={{
            height: 36,
            padding: '0 12px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(0,0,0,0.35)',
            color: 'white',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        </button>
      </div>

      {!loaded && showHelp ? (
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 12,
            right: 12,
            maxWidth: 720,
            padding: 12,
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(0,0,0,0.55)',
            color: 'white',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            fontSize: 14,
            lineHeight: 1.4,
          }}
        >
          If you don’t see the game, make sure your Godot Web export is in
          <code style={{ marginLeft: 6 }}>public/godot/my-game</code> and that the
          exported HTML file matches
          <code style={{ marginLeft: 6 }}>/godot/my-game/game.html</code>.
          <div style={{ marginTop: 8, opacity: 0.85 }}>
            On mobile: landscape lock works on most Android browsers in fullscreen;
            iOS Safari may require rotating the device manually.
          </div>
        </div>
      ) : null}
    </div>
  );
}
