import { useEffect, useRef, useState } from 'react';
import { loginWithGoogle } from '../utils/auth';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GSI_SRC = 'https://accounts.google.com/gsi/client';

let gsiPromise = null;

function ensureGsiScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!gsiPromise) {
    gsiPromise = new Promise((resolve, reject) => {
      const existing = document.getElementById('gsi-client');
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('Failed to load Google Identity Services')));
        return;
      }
      const script = document.createElement('script');
      script.id = 'gsi-client';
      script.src = GSI_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(script);
    });
  }
  return gsiPromise;
}

export default function GoogleSignIn() {
  const buttonRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;
    let ro = null;
    let lastWidth = 0;

    const handleCredential = (response) => {
      loginWithGoogle(response.credential);
      window.dispatchEvent(new Event('authChange'));
      window.location.href = '/';
    };

    const render = () => {
      const el = buttonRef.current;
      if (!el || !window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({ client_id: CLIENT_ID, callback: handleCredential });
      el.innerHTML = '';
      window.google.accounts.id.renderButton(el, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        width: el.offsetWidth || 320,
      });
    };

    const onResize = () => {
      const el = buttonRef.current;
      if (!el) return;
      const width = el.offsetWidth;
      if (width !== lastWidth) {
        lastWidth = width;
        render();
      }
    };

    ensureGsiScript()
      .then(() => {
        if (cancelled || !buttonRef.current) return;
        lastWidth = buttonRef.current.offsetWidth;
        render();
        ro = new ResizeObserver(onResize);
        ro.observe(buttonRef.current);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
      if (ro) ro.disconnect();
    };
  }, []);

  if (!CLIENT_ID) return null;

  return (
    <div className="google-signin">
      <div ref={buttonRef} className="google-btn-wrap"></div>
      {error && <p className="google-error">Google sign-in failed to load. Please check your connection.</p>}
    </div>
  );
}
