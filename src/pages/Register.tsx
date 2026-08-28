import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import Home from './Home';

export default function Register() {
  const location = useLocation();
  const { openAuthModal } = useAuthModal();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    openAuthModal({
      mode: 'register',
      redirectUrl: redirect,
      title: 'Join Unisole AI Labs',
      subtitle: 'Create a free member account to access our AI tools, telemetry, and curriculum.'
    });
  }, [openAuthModal, redirect]);

  return <Home />;
}
