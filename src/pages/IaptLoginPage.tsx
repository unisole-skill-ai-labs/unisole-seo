import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import { isAuthenticated } from '../utils/auth';
import Home from './Home';

export default function IaptLoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/pathways';

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(redirect, { replace: true });
      return;
    }

    openAuthModal({
      mode: 'login',
      redirectUrl: redirect,
      source: 'IAPT',
      title: 'IAPT Login',
      subtitle: 'Enter your mobile number to get started instantly.',
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
  }, [openAuthModal, redirect, navigate]);

  return <Home />;
}
