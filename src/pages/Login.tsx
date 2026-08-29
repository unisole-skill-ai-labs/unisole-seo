import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import { isAuthenticated } from '../utils/auth';
import Home from './Home';

export default function Login() {
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
      mode: 'login',
      redirectUrl: redirect,
      title: 'Login to Unisole',
      subtitle: 'Enter your mobile number to access programs, certifications, and curriculum.'
    });
  }, [openAuthModal, redirect, navigate]);

  return <Home />;
}
