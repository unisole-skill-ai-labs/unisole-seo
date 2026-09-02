import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import {
  useCheckUserMutation,
  useLoginMutation,
  useGetPublicBranchesQuery,
} from '../store/apiSlice';
import { setAuthSession } from '../utils/auth';
import {
  User,
  BookOpen,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  QrCode,
} from 'lucide-react';

export interface MobileOtpAuthProps {
  source?: 'PAMPHLET_QR' | 'NON_PAMPHLET' | 'SESSION_QR' | string;
  sessionCode?: string;
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
}

type AuthStep = 'PHONE' | 'PROFILE_SETUP';

const DEFAULT_BRANCHES = [
  { id: 'ba', name: 'BA' },
  { id: 'bba', name: 'BBA' },
  { id: 'bcom', name: 'BCOM' },
  { id: 'bca', name: 'BCA' },
  { id: 'bsc_non_med', name: 'BSC Non-Med' },
  { id: 'bsc_med', name: 'BSC Med' },
  { id: 'others', name: 'Others' },
];

export default function MobileOtpAuth({
  source: propSource,
  sessionCode: propSessionCode,
  onSuccess,
  onError,
}: MobileOtpAuthProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const from = new URLSearchParams(location.search).get('redirect') || '/';

  // Detect sessionCode from redirect parameter or path (e.g. /live/UNI123 or ?redirect=/live/UNI123)
  const [sessionCollege, setSessionCollege] = useState<{ id?: string; name: string } | null>(null);
  const [sessionBranches, setSessionBranches] = useState<any[]>([]);
  const [detectedSessionCode, setDetectedSessionCode] = useState<string | null>(propSessionCode || null);

  const [checkUser] = useCheckUserMutation();
  const [login] = useLoginMutation();

  // Form states
  const [step, setStep] = useState<AuthStep>('PHONE');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [customBranch, setCustomBranch] = useState('');

  // Extract session code and pre-fetch college info if live presentation
  useEffect(() => {
    const redirectParam = new URLSearchParams(location.search).get('redirect') || '';
    const match =
      redirectParam.match(/\/live\/([A-Z0-9_-]+)/i) ||
      location.pathname.match(/\/live\/([A-Z0-9_-]+)/i) ||
      (propSessionCode ? [null, propSessionCode] : null);

    if (match && match[1]) {
      const code = match[1].toUpperCase();
      setDetectedSessionCode(code);

      const apiUrl = (
        import.meta.env.VITE_API_URL ||
        (typeof window !== 'undefined'
          ? window.location.hostname.includes('stg')
            ? 'https://stg.engine.unisole.org'
            : window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
            ? 'https://api.unisole.org'
            : 'http://localhost:3000'
          : 'http://localhost:3000')
      ).replace(/\/+$/, '');

      fetch(`${apiUrl}/api/public/presentations/sessions/${code}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.data?.session?.collegeName) {
            const clgName = data.data.session.collegeName;
            const clgId = data.data.session.collegeId;
            setSessionCollege({ id: clgId, name: clgName });

            if (Array.isArray(data.data.collegeBranches) && data.data.collegeBranches.length > 0) {
              setSessionBranches(data.data.collegeBranches);
            }
          }
        })
        .catch((e) => console.warn('Could not prefetch session college', e));
    }
  }, [location.search, location.pathname, propSessionCode]);

  // Determine effective signup channel
  const searchParams = new URLSearchParams(location.search);
  const querySource = searchParams.get('source');
  const isSessionChannel =
    propSource === 'SESSION_QR' ||
    querySource === 'SESSION_QR' ||
    querySource === 'session' ||
    !!detectedSessionCode ||
    from.includes('/live/');

  const isPamphletChannel =
    !isSessionChannel &&
    propSource !== 'IAPT' &&
    querySource !== 'IAPT' &&
    (propSource === 'PAMPHLET_QR' ||
      querySource === 'PAMPHLET_QR' ||
      querySource === 'pamphlet' ||
      querySource === 'qr' ||
      location.pathname === '/login');

  const effectiveSource: 'PAMPHLET_QR' | 'NON_PAMPHLET' | 'SESSION_QR' | string = isSessionChannel
    ? 'SESSION_QR'
    : propSource === 'IAPT' || querySource === 'IAPT'
    ? 'IAPT'
    : isPamphletChannel
    ? 'PAMPHLET_QR'
    : (propSource || querySource || 'NON_PAMPHLET');

  const { data: serverBranches = [] } = useGetPublicBranchesQuery(sessionCollege?.id);
  const branchOptions =
    sessionBranches.length > 0
      ? sessionBranches
      : serverBranches.length > 0
      ? serverBranches
      : DEFAULT_BRANCHES;

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const completeAuth = (data: any) => {
    const token = data.token || data.accessToken;
    const user = data.user;

    dispatch(setCredentials({ token, user }));
    setAuthSession({ token, user });

    if (onSuccess) {
      onSuccess(data);
    } else {
      navigate(from, { replace: true });
    }
  };

  // Step 1: User enters phone number and clicks continue
  const handlePhoneSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      // Check if user exists in system
      const checkRes = await checkUser({ phone: cleanPhone }).unwrap();

      if (checkRes.exists && checkRes.user) {
        // User exists: login directly and proceed
        const authData = await login({
          phone: cleanPhone,
          signupSource: effectiveSource,
          sessionCode: detectedSessionCode || undefined,
        }).unwrap();

        completeAuth(authData);
      } else {
        // New user: ask for Name (and Branch if from Live Session QR)
        setStep('PROFILE_SETUP');
      }
    } catch {
      // Fallback: if check endpoint fails, ask for profile details
      setStep('PROFILE_SETUP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: New user fills profile and completes direct registration
  const handleProfileSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      setStep('PHONE');
      return;
    }

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    // Branch is only mandatory for Live Campus Presentation Sessions
    let effectiveBranch = '';
    if (isSessionChannel) {
      effectiveBranch =
        selectedBranch === 'other' || selectedBranch === 'Other / Multidisciplinary'
          ? customBranch.trim()
          : selectedBranch.trim();

      if (!effectiveBranch) {
        setErrorMsg('Please select or enter your academic branch');
        return;
      }
    }

    setLoading(true);
    try {
      const authData = await login({
        phone: cleanPhone,
        name: name.trim(),
        collegeName: isSessionChannel ? sessionCollege?.name : undefined,
        collegeId: isSessionChannel ? sessionCollege?.id : undefined,
        branch: effectiveBranch || undefined,
        sessionCode: detectedSessionCode || undefined,
        signupSource: effectiveSource,
      }).unwrap();

      completeAuth(authData);
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Authentication failed. Please try again.';
      setErrorMsg(msg);
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-3.5">
      {/* Session College Verified Banner (Only on Live Session QR flows) */}
      {isSessionChannel && sessionCollege && (
        <div className="p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-between gap-2.5 text-xs text-indigo-900 dark:text-indigo-200 shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              🏛️
            </span>
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-500 dark:text-indigo-400 block font-mono">
                Campus Session Presentation
              </span>
              <span className="font-black truncate block text-xs text-zinc-900 dark:text-zinc-100">
                {sessionCollege.name}
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold shrink-0">
            QR Verified
          </span>
        </div>
      )}

      {/* Pamphlet QR Quick Welcome Banner */}
      {isPamphletChannel && (
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200 font-medium">
          <QrCode className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Pamphlet Quick Pass: Instant login with name & mobile.</span>
        </div>
      )}

      {/* Alert Error */}
      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {step === 'PHONE' && (
        /* STEP 1: Enter Mobile Number */
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block" htmlFor="otp-phone">
              Mobile Phone Number
            </label>
            <div className="relative flex items-center rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition-colors overflow-hidden min-h-[44px]">
              <span className="px-3.5 py-2.5 text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 border-r border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5 select-none">
                <span>🇮🇳 +91</span>
              </span>
              <input
                id="otp-phone"
                type="tel"
                maxLength={10}
                required
                autoFocus
                className="w-full text-sm font-bold px-3.5 py-2.5 bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none font-mono tracking-wider"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Enter your mobile number to get instant access.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || phone.replace(/\D/g, '').length !== 10}
            className="w-full inline-flex items-center justify-center font-bold px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white transition-all duration-150 active:scale-[0.98] gap-2 text-xs min-h-[44px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {step === 'PROFILE_SETUP' && (
        /* STEP 2: New User Profile Details */
        <form onSubmit={handleProfileSubmit} className="space-y-3.5 animate-in fade-in duration-200">
          <div className="p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-medium">
              <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span>New Learner: <strong>+91 {phone}</strong></span>
            </div>
            <button
              type="button"
              onClick={() => {
                setStep('PHONE');
                setErrorMsg('');
              }}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
            >
              Change
            </button>
          </div>

          {/* Full Name Input (Always requested for new users) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block" htmlFor="new-user-name">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="new-user-name"
                type="text"
                required
                autoFocus
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 focus:outline-none focus:border-zinc-400 text-zinc-900 dark:text-white placeholder:text-zinc-400 min-h-[40px]"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Academic Branch Dropdown (ONLY shown on Live Presentation Session QR flows) */}
          {isSessionChannel && (
            <div className="space-y-1 animate-in fade-in duration-150">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block" htmlFor="new-user-branch">
                Branch / Department <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="new-user-branch"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  required
                  className="w-full text-xs pl-9 pr-8 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 focus:outline-none focus:border-zinc-400 text-zinc-900 dark:text-white min-h-[40px] appearance-none cursor-pointer"
                >
                  <option value="">-- Select Your Academic Branch --</option>
                  {branchOptions.map((b: any) => (
                    <option key={b.id || b.code || b.name} value={b.name}>
                      {b.name} {b.code ? `(${b.code})` : ''}
                    </option>
                  ))}
                  <option value="other">Other / Multidisciplinary (Specify below)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {(selectedBranch === 'other' || selectedBranch === 'Other / Multidisciplinary') && (
                <div className="pt-1.5 animate-in fade-in duration-150">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chemical, Biotechnology, etc."
                    value={customBranch}
                    onChange={(e) => setCustomBranch(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 focus:outline-none focus:border-zinc-400 text-zinc-900 dark:text-white placeholder:text-zinc-400 min-h-[38px]"
                  />
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center font-bold px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white transition-all duration-150 active:scale-[0.98] gap-2 text-xs min-h-[44px] cursor-pointer disabled:opacity-50 mt-2 shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Start Learning Now</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
