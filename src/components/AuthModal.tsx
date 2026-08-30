import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import MobileOtpAuth from './MobileOtpAuth';
import { X, Sparkles, ShieldCheck } from 'lucide-react';

export default function AuthModal() {
  const {
    isOpen,
    mode,
    redirectUrl,
    source,
    sessionCode,
    customTitle,
    customSubtitle,
    closeAuthModal,
    setMode,
  } = useAuthModal();
  const navigate = useNavigate();

  const isAuthRoute =
    window.location.pathname === '/login' ||
    window.location.pathname === '/register' ||
    window.location.pathname === '/iapt' ||
    window.location.pathname === '/iapt/login' ||
    window.location.pathname === '/login/iapt';

  const handleClose = () => {
    closeAuthModal();
    if (isAuthRoute) {
      navigate('/', { replace: true });
    }
  };

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Never render on live presentation pages or join pages
  if (
    typeof window !== 'undefined' &&
    (window.location.pathname.startsWith('/live') || window.location.pathname.startsWith('/join'))
  ) {
    return null;
  }

  const handleAuthSuccess = () => {
    const searchRedirect = new URLSearchParams(window.location.search).get('redirect');
    const targetUrl = redirectUrl || searchRedirect;
    closeAuthModal();
    if (targetUrl && !isAuthRoute) {
      navigate(targetUrl, { replace: true });
    } else if (targetUrl && (window.location.pathname === '/iapt' || window.location.pathname === '/iapt/login' || window.location.pathname === '/login/iapt')) {
      navigate(targetUrl, { replace: true });
    } else if (isAuthRoute) {
      navigate('/', { replace: true });
    }
  };

  const title =
    customTitle ||
    (source === 'PAMPHLET_QR'
      ? 'Welcome to Unisole'
      : source === 'SESSION_QR'
      ? 'Join Live Presentation'
      : mode === 'login'
      ? 'Login to Unisole'
      : 'Register on Unisole');

  const subtitle =
    customSubtitle ||
    (source === 'PAMPHLET_QR'
      ? 'Enter your mobile number to get started instantly.'
      : source === 'SESSION_QR'
      ? 'Enter your mobile number to participate in the presentation.'
      : mode === 'login'
      ? 'Enter your mobile number to access programs, certifications, and curriculum.'
      : 'Create a learner account with your mobile number.');

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs flex items-center justify-center">
              U
            </span>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Heading */}
          <div className="space-y-1">
            <h3
              id="auth-modal-title"
              className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight"
            >
              {title}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Direct Auth Form */}
          <div>
            <MobileOtpAuth
              source={source}
              sessionCode={sessionCode}
              onSuccess={handleAuthSuccess}
            />
          </div>

          {/* Trust Footer */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Direct Instant Access
            </span>
            <span className="inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-zinc-400" />
              100% Free Access
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
