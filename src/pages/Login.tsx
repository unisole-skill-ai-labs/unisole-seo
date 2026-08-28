import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import Home from './Home';

export default function Login() {
  const location = useLocation();
  const { openAuthModal } = useAuthModal();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    openAuthModal({
      mode: 'login',
      redirectUrl: redirect,
      title: 'Sign in to Unisole',
      subtitle: 'Enter your mobile number to access models, sandbox telemetry, and guides.'
    });
  }, [openAuthModal, redirect]);

  return <Home />;
}
