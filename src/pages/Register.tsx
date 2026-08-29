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
      redirectUrl: redirect,
      title: 'Join Unisole AI Labs',
      subtitle: 'Enter your mobile number to access models, sandbox telemetry, and curriculum.'
    });
  }, [openAuthModal, redirect]);

  return <Home />;
}
