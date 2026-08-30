import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { useAuthModal } from '../context/AuthModalContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation();
  const [auth, setAuth] = useState(isAuthenticated());
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    const handleAuthChange = () => {
      setAuth(isAuthenticated());
    };
    window.addEventListener('authChange', handleAuthChange);
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    if (!auth) {
      openAuthModal({
        mode: 'login',
        redirectUrl: location.pathname,
        source: 'NON_PAMPHLET',
        title: 'Login to Access',
        subtitle: 'Enter your mobile number to unlock this protected resource.',
      });
    }
  }, [auth, location.pathname, openAuthModal]);

  if (!auth) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between">
        <Navbar />

        <main className="flex-grow flex items-center justify-center pt-24 sm:pt-32 pb-20 px-4">
          <div className="max-w-md w-full minimal-card p-6 sm:p-8 text-center space-y-5">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center mx-auto border border-zinc-200 dark:border-zinc-700">
              <ShieldCheck className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
            </div>

            <div className="space-y-1.5">
              <span className="mono-tag text-zinc-500">
                Protected Area
              </span>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                Authentication Required
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
                Login with your mobile number to access programs, certifications, and technical curriculum.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                openAuthModal({
                  mode: 'login',
                  redirectUrl: location.pathname,
                  source: 'NON_PAMPHLET',
                  title: 'Login to Access',
                  subtitle: 'Enter your mobile number to unlock this protected resource.',
                })
              }
              className="w-full inline-flex items-center justify-center font-semibold px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 text-white text-xs transition-all duration-150 active:scale-[0.98] gap-1.5 cursor-pointer"
            >
              <span>Login to Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return <>{children}</>;
}
