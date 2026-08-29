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

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(redirect, { replace: true });
      return;
    }

    openAuthModal({
      mode: 'login',
      redirectUrl: redirect,
      title: 'Login to Unisole',
      subtitle: 'Enter your mobile number to access the live presentation.',
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
