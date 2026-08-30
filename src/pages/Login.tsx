import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import { isAuthenticated } from '../utils/auth';
import Home from './Home';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';
  const querySource = searchParams.get('source');

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(redirect, { replace: true });
      return;
    }

    const isSessionRedirect = redirect.includes('/live/') || querySource === 'SESSION_QR' || querySource === 'session';
    const effectiveSource = isSessionRedirect ? 'SESSION_QR' : (querySource || 'PAMPHLET_QR');

    openAuthModal({
      mode: 'login',
      redirectUrl: redirect,
      source: effectiveSource,
      title: isSessionRedirect ? 'Join Live Presentation' : 'Welcome to Unisole',
      subtitle: isSessionRedirect
        ? 'Enter your mobile number to join your campus presentation.'
        : 'Enter your mobile number to get started instantly.',
    });

    const handleAuthChange = () => {
      if (isAuthenticated()) {
        navigate(redirect, { replace: true });
      }
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [openAuthModal, redirect, querySource, navigate]);

  return <Home />;
}
