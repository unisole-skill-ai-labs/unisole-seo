import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import {
  useCheckUserMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
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
  MessageCircle,
  Phone,
  RefreshCw,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export interface MobileOtpAuthProps {
  source?: 'PAMPHLET_QR' | 'NON_PAMPHLET' | 'SESSION_QR' | string;
  sessionCode?: string;
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
}

type AuthStep = 'PHONE' | 'OTP_VERIFY' | 'PROFILE_SETUP';

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

  // Detect sessionCode from redirect parameter or path
  const [sessionCollege, setSessionCollege] = useState<{ id?: string; name: string } | null>(null);
  const [sessionBranches, setSessionBranches] = useState<any[]>([]);
  const [detectedSessionCode, setDetectedSessionCode] = useState<string | null>(propSessionCode || null);

  const [checkUser] = useCheckUserMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  // Form states
  const [step, setStep] = useState<AuthStep>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [customBranch, setCustomBranch] = useState('');
  const [channel, setChannel] = useState<'WHATSAPP' | 'SMS'>('WHATSAPP');
  const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);

  // Timer & Resend state
  const [countdown, setCountdown] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const otpInputRef = useRef<HTMLInputElement>(null);

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

  // Countdown timer effect for OTP resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

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

  // Step 1: Request WhatsApp OTP via Fast2SMS
  const handleRequestOtp = async (targetChannel: 'WHATSAPP' | 'SMS' = channel, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      const res: any = await sendOtp({
        phone: cleanPhone,
        channel: targetChannel,
      }).unwrap();

      setIsExistingUser(!!res.exists);
      if (res.exists && res.user?.name) {
        setName(res.user.name);
      }

      setChannel(targetChannel);
      setStep('OTP_VERIFY');
      setCountdown(30);
      setSuccessMsg(
        targetChannel === 'WHATSAPP'
          ? `4-digit OTP sent to WhatsApp (+91 ${cleanPhone})`
          : `4-digit OTP sent via SMS (+91 ${cleanPhone})`
      );

      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 200);
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Failed to send verification code. Please try again.';
      setErrorMsg(msg);
      if (onError) onError(err);
    }
  };

  // Step 2: Verify Submitted OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phone.replace(/\D/g, '');
    const cleanOtp = otp.trim();

    if (!cleanOtp || cleanOtp.length !== 4) {
      setErrorMsg('Please enter the 4-digit verification code');
      return;
    }

    // If new user and name is not filled yet, transition to profile setup step
    if (!isExistingUser && !name.trim()) {
      setStep('PROFILE_SETUP');
      return;
    }

    let effectiveBranch = '';
    if (isSessionChannel) {
      effectiveBranch =
        selectedBranch === 'other' || selectedBranch === 'Other / Multidisciplinary'
          ? customBranch.trim()
          : selectedBranch.trim();
    }

    try {
      const authData = await verifyOtp({
        phone: cleanPhone,
        otp: cleanOtp,
        name: name.trim() || undefined,
        collegeName: isSessionChannel ? sessionCollege?.name : undefined,
        collegeId: isSessionChannel ? sessionCollege?.id : undefined,
        branch: effectiveBranch || undefined,
        sessionCode: detectedSessionCode || undefined,
        signupSource: effectiveSource,
      }).unwrap();

      completeAuth(authData);
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Invalid or expired OTP. Please check and try again.';
      setErrorMsg(msg);
      if (onError) onError(err);
    }
  };

  // Step 3: Complete Profile for New User after OTP Verified
  const handleProfileSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phone.replace(/\D/g, '');
    const cleanOtp = otp.trim();

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

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

    try {
      const authData = await verifyOtp({
        phone: cleanPhone,
        otp: cleanOtp,
        name: name.trim(),
        collegeName: isSessionChannel ? sessionCollege?.name : undefined,
        collegeId: isSessionChannel ? sessionCollege?.id : undefined,
        branch: effectiveBranch || undefined,
        sessionCode: detectedSessionCode || undefined,
        signupSource: effectiveSource,
      }).unwrap();

      completeAuth(authData);
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Registration failed. Please try again.';
      setErrorMsg(msg);
      if (onError) onError(err);
    }
  };

  return (
    <div className="w-full space-y-3.5 font-sans">
      {/* Session College Verified Banner */}
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

      {/* Alert Error */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Alert Success */}
      {successMsg && !errorMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* STEP 1: Enter Mobile Number */}
      {step === 'PHONE' && (
        <form onSubmit={(e) => handleRequestOtp(channel, e)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block" htmlFor="otp-phone">
              Mobile Phone Number
            </label>
            <div className="relative flex items-center rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 focus-within:border-emerald-500 dark:focus-within:border-emerald-500 transition-colors overflow-hidden min-h-[44px]">
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
            <div className="flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 pt-0.5">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <MessageCircle className="w-3 h-3" />
                <span>Instant OTP via WhatsApp</span>
              </span>
              <span>100% Free & Secure</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSendingOtp || phone.replace(/\D/g, '').length !== 10}
            className="w-full inline-flex items-center justify-center font-extrabold px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all duration-150 active:scale-[0.98] gap-2 text-xs min-h-[44px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSendingOtp ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending WhatsApp OTP...</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4" />
                <span>Get OTP on WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* STEP 2: Enter 4-Digit Verification Code */}
      {step === 'OTP_VERIFY' && (
        <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in duration-150">
          <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-zinc-500 block">Sent to WhatsApp</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-white truncate block">
                  +91 {phone}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setStep('PHONE');
                setOtp('');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Edit Number
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block text-center" htmlFor="otp-input">
              Enter 4-Digit Verification Code
            </label>
            <input
              ref={otpInputRef}
              id="otp-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              required
              autoFocus
              className="w-full text-center text-3xl font-mono font-black py-3 px-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-emerald-600 dark:text-emerald-400 tracking-[0.35em] placeholder:text-zinc-300 dark:placeholder:text-zinc-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
              placeholder="••••"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                setOtp(val);
                if (val.length === 4 && isExistingUser) {
                  // Auto-submit when 4 digits are typed for existing user
                  setTimeout(() => {
                    handleVerifyOtp();
                  }, 50);
                }
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isVerifyingOtp || otp.trim().length !== 4}
            className="w-full inline-flex items-center justify-center font-extrabold px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white transition-all duration-150 active:scale-[0.98] gap-2 text-xs min-h-[44px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {isVerifyingOtp ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Verify & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Resend Controls */}
          <div className="flex items-center justify-center text-xs pt-1 border-t border-zinc-100 dark:border-zinc-800">
            {countdown > 0 ? (
              <span className="text-[11px] text-zinc-400 font-mono">
                Resend code in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleRequestOtp('WHATSAPP')}
                disabled={isSendingOtp}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Resend code on WhatsApp</span>
              </button>
            )}
          </div>
        </form>
      )}

      {/* STEP 3: Profile Setup for New User */}
      {step === 'PROFILE_SETUP' && (
        <form onSubmit={handleProfileSubmit} className="space-y-3.5 animate-in fade-in duration-150">
          <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Verified: <strong>+91 {phone}</strong></span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block" htmlFor="reg-name">
              Your Full Name *
            </label>
            <div className="relative flex items-center rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 focus-within:border-emerald-500 dark:focus-within:border-emerald-500 transition-colors overflow-hidden min-h-[44px]">
              <span className="px-3.5 py-2.5 text-zinc-400">
                <User className="w-4 h-4" />
              </span>
              <input
                id="reg-name"
                type="text"
                required
                autoFocus
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs font-medium py-2.5 pr-3.5 bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none"
              />
            </div>
          </div>

          {/* Academic Branch Selection (Only if live presentation session) */}
          {isSessionChannel && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block" htmlFor="reg-branch">
                Academic Stream / Branch *
              </label>
              <div className="relative">
                <select
                  id="reg-branch"
                  required
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full text-xs font-medium py-2.5 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 text-zinc-900 dark:text-white outline-none focus:border-emerald-500 appearance-none min-h-[44px] cursor-pointer"
                >
                  <option value="">Select your branch / major...</option>
                  {branchOptions.map((b: any) => (
                    <option key={b.id || b.name} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                  <option value="other">Other / Not Listed</option>
                </select>
                <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {selectedBranch === 'other' && (
                <input
                  type="text"
                  required
                  placeholder="Specify branch name (e.g. Civil, Mechanical)"
                  value={customBranch}
                  onChange={(e) => setCustomBranch(e.target.value)}
                  className="w-full mt-1.5 text-xs font-medium py-2 px-3 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-emerald-500"
                />
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifyingOtp || !name.trim()}
            className="w-full inline-flex items-center justify-center font-extrabold px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all duration-150 active:scale-[0.98] gap-2 text-xs min-h-[44px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isVerifyingOtp ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Completing Setup...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
