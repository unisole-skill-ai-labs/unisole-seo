import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

export interface OpenAuthModalOptions {
  mode?: 'login' | 'register';
  redirectUrl?: string;
  source?: 'PAMPHLET_QR' | 'NON_PAMPHLET' | 'SESSION_QR' | string;
  sessionCode?: string;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

interface AuthModalContextType {
  isOpen: boolean;
  mode: 'login' | 'register';
  redirectUrl?: string;
  source?: 'PAMPHLET_QR' | 'NON_PAMPHLET' | 'SESSION_QR' | string;
  sessionCode?: string;
  customTitle?: string;
  customSubtitle?: string;
  openAuthModal: (options?: OpenAuthModalOptions) => void;
  closeAuthModal: () => void;
  setMode: (mode: 'login' | 'register') => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

const TIMED_POPUP_DELAY_MS = 15000; // 15 seconds
const DISMISS_SESSION_KEY = 'unisole_auth_modal_dismissed';

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [redirectUrl, setRedirectUrl] = useState<string | undefined>(undefined);
  const [source, setSource] = useState<'PAMPHLET_QR' | 'NON_PAMPHLET' | 'SESSION_QR' | string | undefined>(undefined);
  const [sessionCode, setSessionCode] = useState<string | undefined>(undefined);
  const [customTitle, setCustomTitle] = useState<string | undefined>(undefined);
  const [customSubtitle, setCustomSubtitle] = useState<string | undefined>(undefined);
  const [successCallback, setSuccessCallback] = useState<(() => void) | undefined>(undefined);

  const openAuthModal = useCallback((options?: OpenAuthModalOptions) => {
    // If the user is already authenticated, never open the modal
    if (isAuthenticated()) {
      if (options?.redirectUrl) {
        navigate(options.redirectUrl, { replace: true });
      }
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return;
    }

    if (options?.mode) setMode(options.mode);
    setRedirectUrl(options?.redirectUrl);
    setSource(options?.source);
    setSessionCode(options?.sessionCode);
    setCustomTitle(options?.title);
    setCustomSubtitle(options?.subtitle);
    if (options?.onSuccess) setSuccessCallback(() => options.onSuccess);
    setIsOpen(true);
  }, [navigate]);

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
    sessionStorage.setItem(DISMISS_SESSION_KEY, 'true');
  }, []);

  // Listen for global custom event 'openAuthModal'
  useEffect(() => {
    const handleGlobalEvent = (e: any) => {
      if (
        typeof window !== 'undefined' &&
        (window.location.pathname.startsWith('/live') || window.location.pathname.startsWith('/join'))
      ) {
        return;
      }
      if (isAuthenticated()) {
        return;
      }
      const detail: OpenAuthModalOptions = e.detail || {};
      openAuthModal(detail);
    };

    window.addEventListener('openAuthModal', handleGlobalEvent as EventListener);
    return () => {
      window.removeEventListener('openAuthModal', handleGlobalEvent as EventListener);
    };
  }, [openAuthModal]);

  // Timed popup trigger for unauthenticated users
  useEffect(() => {
    if (isAuthenticated()) return;
    if (sessionStorage.getItem(DISMISS_SESSION_KEY) === 'true') return;
    if (
      typeof window !== 'undefined' &&
      (window.location.pathname.startsWith('/live') || window.location.pathname.startsWith('/join'))
    ) {
      return;
    }

    const timer = setTimeout(() => {
      if (
        !isAuthenticated() &&
        sessionStorage.getItem(DISMISS_SESSION_KEY) !== 'true' &&
        typeof window !== 'undefined' &&
        !window.location.pathname.startsWith('/live') &&
        !window.location.pathname.startsWith('/join')
      ) {
        openAuthModal({
          mode: 'register',
          source: 'NON_PAMPHLET',
          title: 'Welcome to Unisole AI Labs',
          subtitle: 'Sign in with your mobile number to access programs, certifications, and research guides.',
        });
      }
    }, TIMED_POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, [openAuthModal]);

  // Close modal when auth changes to authenticated
  useEffect(() => {
    const handleAuthChange = () => {
      if (isAuthenticated()) {
        setIsOpen(false);
        if (successCallback) {
          successCallback();
        }
      }
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, [successCallback]);

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        redirectUrl,
        source,
        sessionCode,
        customTitle,
        customSubtitle,
        openAuthModal,
        closeAuthModal,
        setMode,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}

// Global helper for non-React contexts
export function triggerAuthModal(options?: OpenAuthModalOptions) {
  window.dispatchEvent(new CustomEvent('openAuthModal', { detail: options }));
}
