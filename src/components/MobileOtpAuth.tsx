import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import {
  useCheckUserMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useUpdateProfileMutation,
  useGetPublicCollegesQuery,
  useGetPublicBranchesQuery,
} from '../store/apiSlice';
import { setAuthSession } from '../utils/auth';
import {
  Phone,
  User,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export interface MobileOtpAuthProps {
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
}

type AuthStep = 'PHONE' | 'OTP' | 'PROFILE_SETUP';

const DEFAULT_COLLEGES = [
  { id: 'dtu', name: 'Delhi Technological University (DTU)' },
  { id: 'iitd', name: 'Indian Institute of Technology Delhi (IITD)' },
  { id: 'nsut', name: 'Netaji Subhas University of Technology (NSUT)' },
  { id: 'iiitd', name: 'Indraprastha Institute of Information Technology Delhi (IIITD)' },
  { id: 'nit', name: 'National Institute of Technology (NIT)' },
  { id: 'au', name: 'Anna University' },
  { id: 'other', name: 'Other University / College' },
];

const DEFAULT_BRANCHES = [
  { id: 'cse', name: 'Computer Science & Engineering (CSE)' },
  { id: 'it', name: 'Information Technology (IT)' },
  { id: 'aiml', name: 'Artificial Intelligence & Machine Learning (AIML)' },
  { id: 'ds', name: 'Data Science & Big Data Analytics' },
  { id: 'ece', name: 'Electronics & Communication Engineering (ECE)' },
  { id: 'eee', name: 'Electrical & Electronics Engineering (EEE)' },
  { id: 'mech', name: 'Mechanical Engineering (MECH)' },
  { id: 'civil', name: 'Civil Engineering (CIVIL)' },
  { id: 'cs', name: 'Cyber Security & Digital Forensics' },
  { id: 'bca_mca', name: 'Computer Applications (BCA / MCA)' },
  { id: 'bba_mba', name: 'Management & Business Studies (BBA / MBA)' },
  { id: 'other', name: 'Other / Multidisciplinary' },
];

export default function MobileOtpAuth({ onSuccess, onError }: MobileOtpAuthProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const from = new URLSearchParams(location.search).get('redirect') || '/';

  const [sendOtp] = useSendOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [updateProfile] = useUpdateProfileMutation();

  // Form states
  const [step, setStep] = useState<AuthStep>('PHONE');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [customCollege, setCustomCollege] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [customBranch, setCustomBranch] = useState('');
  const [otp, setOtp] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);

  const { data: serverColleges = [] } = useGetPublicCollegesQuery(undefined);
  const selectedCollegeObj = serverColleges.find(
    (c: any) => c.name === selectedCollege || c.id === selectedCollege
  );
  const { data: serverBranches = [] } = useGetPublicBranchesQuery(selectedCollegeObj?.id);

  const collegeOptions = serverColleges.length > 0 ? serverColleges : DEFAULT_COLLEGES;
  const branchOptions = serverBranches.length > 0 ? serverBranches : DEFAULT_BRANCHES;

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [countdown, setCountdown] = useState(0);

  const otpInputRef = useRef<HTMLInputElement>(null);
  const otpTimerRef = useRef<any>(null);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    return () => {
      if (otpTimerRef.current) {
        clearTimeout(otpTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (step === 'OTP' && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  // Step 1: User enters phone number -> Request OTP -> Move to OTP Step
  const handlePhoneSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const otpRes = await sendOtp({ phone: cleanPhone }).unwrap();
      const code = otpRes.dummyOtp || '1234';
      const userExists = !!otpRes.exists;
      setIsExistingUser(userExists);

      setSuccessMsg(`Verification code sent to +91 ${cleanPhone}`);
      setStep('OTP');
      setCountdown(30);

      if (otpTimerRef.current) clearTimeout(otpTimerRef.current);
      otpTimerRef.current = setTimeout(() => {
        setOtp(code);
      }, 1000);
    } catch (err: any) {
      // Fallback in case of mock/offline dev
      const randomOtp = '1234';
      setIsExistingUser(false);
      setSuccessMsg(`Verification code sent to +91 ${cleanPhone}`);
      setStep('OTP');
      setCountdown(30);

      if (otpTimerRef.current) clearTimeout(otpTimerRef.current);
      otpTimerRef.current = setTimeout(() => {
        setOtp(randomOtp);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP helper
  const handleResendOtp = async () => {
    setErrorMsg('');
    setOtp('');
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) return;

    setLoading(true);
    try {
      const otpRes = await sendOtp({
        phone: cleanPhone,
      }).unwrap();

      const code = otpRes.dummyOtp || '1234';
      setSuccessMsg(`New code sent to +91 ${cleanPhone}`);
      setCountdown(30);

      if (otpTimerRef.current) clearTimeout(otpTimerRef.current);
      otpTimerRef.current = setTimeout(() => {
        setOtp(code);
      }, 1000);
    } catch {
      setSuccessMsg(`New code sent to +91 ${cleanPhone}`);
      setCountdown(30);
      setOtp('1234');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      setErrorMsg('Please provide a valid mobile number');
      setStep('PHONE');
      return;
    }

    if (!otp || otp.trim().length === 0) {
      setErrorMsg('Please enter the 4-digit verification code');
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOtp({
        phone: cleanPhone,
        otp: otp.trim(),
      }).unwrap();

      const token = data.token || data.accessToken;
      const user = data.user;

      dispatch(setCredentials({ token, user }));
      setAuthSession({ token, user });

      // Determine if profile details need to be collected (new user or incomplete profile)
      const isNew = data.isNewUser || !isExistingUser || !user?.name || user?.name.startsWith('Learner ') || !user?.collegeName;

      if (isNew) {
        // Pre-fill name if user has a custom name already
        if (user?.name && !user.name.startsWith('Learner ')) {
          setName(user.name);
        }
        setSuccessMsg('Phone verified! Please complete your learner details.');
        setStep('PROFILE_SETUP');
      } else {
        // Existing user with complete profile -> complete authentication
        if (onSuccess) {
          onSuccess(data);
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Verification failed. Please check the code and try again.';
      setErrorMsg(msg);
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: New user completes profile details
  const handleProfileSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    const effectiveCollege =
      selectedCollege === 'other' || selectedCollege === 'Other University / College'
        ? customCollege.trim()
        : selectedCollege.trim();

    if (!effectiveCollege) {
      setErrorMsg('Please select or enter your college / university');
      return;
    }

    const effectiveBranch =
      selectedBranch === 'other' || selectedBranch === 'Other / Multidisciplinary'
        ? customBranch.trim()
        : selectedBranch.trim();

    if (!effectiveBranch) {
      setErrorMsg('Please select or enter your branch / field of study');
      return;
    }

    setLoading(true);
    try {
      const updateRes = await updateProfile({
        name: name.trim(),
        collegeName: effectiveCollege,
        branch: effectiveBranch,
      }).unwrap();

      const token = updateRes.token || updateRes.accessToken;
      const user = updateRes.user;

      if (token && user) {
        dispatch(setCredentials({ token, user }));
        setAuthSession({ token, user });
      }

      if (onSuccess) {
        onSuccess(updateRes);
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Could not save profile details. Please try again.';
      setErrorMsg(msg);
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-3.5">
      {/* Alert Error */}
      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Alert Success */}
      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
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
              Enter your mobile number to receive a 4-digit verification code.
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
                <span>Sending OTP...</span>
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

      {step === 'OTP' && (
        /* STEP 2: OTP Verification */
        <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in duration-200">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300" htmlFor="otp-code">
                Enter 4-Digit Code
              </label>
              <button
                type="button"
                onClick={() => {
                  if (otpTimerRef.current) clearTimeout(otpTimerRef.current);
                  setStep('PHONE');
                  setOtp('');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" /> Change Number
              </button>
            </div>

            <div className="relative">
              <input
                id="otp-code"
                ref={otpInputRef}
                type="text"
                maxLength={4}
                required
                className="w-full text-center text-xl font-black tracking-[0.5em] px-3 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 text-zinc-900 dark:text-white transition-colors font-mono min-h-[48px]"
                placeholder="0 0 0 0"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
              />
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 text-center">
              Sent to <strong className="font-mono text-zinc-700 dark:text-zinc-300">+91 {phone}</strong>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 4}
            className="w-full inline-flex items-center justify-center font-bold px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white transition-all duration-150 active:scale-[0.98] gap-2 text-xs min-h-[44px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verify OTP</span>
              </>
            )}
          </button>

          <div className="text-center pt-1">
            {countdown > 0 ? (
              <span className="text-[11px] font-mono text-zinc-400">
                Resend code in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Resend Code</span>
              </button>
            )}
          </div>
        </form>
      )}

      {step === 'PROFILE_SETUP' && (
        /* STEP 3: New User Profile Details (Name, College, Branch) */
        <form onSubmit={handleProfileSubmit} className="space-y-3.5 animate-in fade-in duration-200">
          <div className="p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-medium">
              <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span>Verified: <strong>+91 {phone}</strong></span>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          </div>

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

          {/* College Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block" htmlFor="new-user-college">
              College / University <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <GraduationCap className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="new-user-college"
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                required
                className="w-full text-xs pl-9 pr-8 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 focus:outline-none focus:border-zinc-400 text-zinc-900 dark:text-white min-h-[40px] appearance-none cursor-pointer"
              >
                <option value="">-- Select Your College / University --</option>
                {collegeOptions.map((c: any) => (
                  <option key={c.id || c.slug || c.name} value={c.name}>
                    {c.name} {c.shortName ? `(${c.shortName})` : ''}
                  </option>
                ))}
                <option value="other">Other University / College (Specify below)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {(selectedCollege === 'other' || selectedCollege === 'Other University / College') && (
              <div className="pt-1.5 animate-in fade-in duration-150">
                <input
                  type="text"
                  required
                  placeholder="Enter your college / university name"
                  value={customCollege}
                  onChange={(e) => setCustomCollege(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 focus:outline-none focus:border-zinc-400 text-zinc-900 dark:text-white placeholder:text-zinc-400 min-h-[38px]"
                />
              </div>
            )}
          </div>

          {/* Academic Branch Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block" htmlFor="new-user-branch">
              Branch / Specialization <span className="text-rose-500">*</span>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center font-bold px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white transition-all duration-150 active:scale-[0.98] gap-2 text-xs min-h-[44px] cursor-pointer disabled:opacity-50 mt-2 shadow-sm"
          >
            {loading ? (
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
