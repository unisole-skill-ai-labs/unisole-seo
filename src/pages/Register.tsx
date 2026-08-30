import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import { isAuthenticated } from '../utils/auth';
import Home from './Home';

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(redirect, { replace: true });
      return;
    }

    openAuthModal({
      mode: 'register',
      redirectUrl: redirect,
      source: 'NON_PAMPHLET',
      title: 'Register on Unisole',
      subtitle: 'Enter your mobile number to register and access programs, certifications, and curriculum.',
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
