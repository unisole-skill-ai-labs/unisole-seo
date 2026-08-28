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
    customTitle,
    customSubtitle,
    closeAuthModal,
    setMode,
  } = useAuthModal();
  const navigate = useNavigate();

  const handleClose = () => {
    closeAuthModal();
    if (window.location.pathname === '/login' || window.location.pathname === '/register') {
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

  const handleAuthSuccess = () => {
    closeAuthModal();
    if (redirectUrl && redirectUrl !== '/login' && redirectUrl !== '/register') {
      navigate(redirectUrl, { replace: true });
    } else if (window.location.pathname === '/login' || window.location.pathname === '/register') {
      navigate('/', { replace: true });
    }
  };

  const title =
    customTitle ||
    (mode === 'login' ? 'Sign in to Unisole' : 'Join Unisole AI Labs');

  const subtitle =
    customSubtitle ||
    (mode === 'login'
      ? 'Enter your mobile number to access models, sandbox, and guides.'
      : 'Create a free member account to access our AI tools & telemetry.');

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
            <span className="mono-tag text-zinc-600 dark:text-zinc-400">
              {mode === 'login' ? 'Authentication' : 'Registration'}
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
          {/* Segmented Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg border border-zinc-200 dark:border-zinc-700/60">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-bold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-bold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

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

          {/* OTP Auth Form */}
          <div>
            <MobileOtpAuth onSuccess={handleAuthSuccess} />
          </div>

          {/* Trust Footer */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Instant SMS Code
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
