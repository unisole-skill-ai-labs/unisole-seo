import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { setAuthSession } from '../utils/auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function GoogleSignIn({ onSuccess, onError, label = 'Continue with Google' }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setErrorMsg('');
      try {
        // Fetch user profile from Google
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        if (!userInfoRes.ok) {
          throw new Error('Failed to fetch Google profile information');
        }

        const profile = await userInfoRes.json();

        // Authenticate with Unisole Engine backend
        const res = await fetch(`${API_BASE}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            googleId: profile.sub,
            email: profile.email,
            name: profile.name || profile.given_name || 'Learner',
            avatar_url: profile.picture,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.detail || data.error || data.message || 'Google authentication failed');
        }

        // Save session
        setAuthSession({
          token: data.token || data.accessToken,
          user: data.user || { name: profile.name, email: profile.email },
        });

        if (onSuccess) {
          onSuccess(data);
        } else {
          navigate('/');
        }
      } catch (err) {
        const msg = err.message || 'Google sign-in failed';
        setErrorMsg(msg);
        if (onError) onError(msg);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      const msg = error.error_description || 'Google sign-in was cancelled or failed';
      setErrorMsg(msg);
      if (onError) onError(msg);
    },
  });

  const handleClick = () => {
    if (!clientId) {
      setErrorMsg('VITE_GOOGLE_CLIENT_ID is not configured in .env yet.');
      return;
    }
    triggerGoogleLogin();
  };

  return (
    <div className="google-signin">
      <button
        type="button"
        className="gsi-button"
        onClick={handleClick}
        disabled={loading}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M21.35 11.1H12v3.4h5.32c-.4 2.09-1.87 3.87-3.82 4.63v3.05h4.4c3.42-3.15 5.45-7.79 5.45-11.08z"
            fill="#4285F4"
          />
          <path
            d="M12 22c3.6 0 6.62-1.2 8.83-3.24l-4.4-3.05c-1.22.82-2.78 1.3-4.43 1.3-3.4 0-6.28-2.3-7.31-5.39H.6v3.13A12 12 0 0012 22z"
            fill="#34A853"
          />
          <path
            d="M4.69 13.62a7.4 7.4 0 010-3.24V7.25H.6a12 12 0 000 9.5l4.09-3.13z"
            fill="#FBBC05"
          />
          <path
            d="M12 4.75c1.96 0 3.71.68 5.1 2l3.7-3.7A12 12 0 000 7.25l4.09 3.13C5.72 7.05 8.6 4.75 12 4.75z"
            fill="#EA4335"
          />
        </svg>
        <span>{loading ? 'Connecting to Google...' : label}</span>
      </button>
      {errorMsg && <p className="google-error">{errorMsg}</p>}
    </div>
  );
}
