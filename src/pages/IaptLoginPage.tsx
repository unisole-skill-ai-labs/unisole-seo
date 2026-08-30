import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Phone,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Award,
  BookOpen,
  GraduationCap,
  Building2,
  Check,
  User,
} from 'lucide-react';
import { useLoginMutation } from '../store/apiSlice';
import { setCredentials } from '../store/authSlice';
import { setAuthSession, isAuthenticated, getUser } from '../utils/auth';
import confetti from 'canvas-confetti';

export default function IaptLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const searchParams = new URLSearchParams(location.search);
  const redirectTarget = searchParams.get('redirect') || '/pathways';

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [login] = useLoginMutation();
  const currentUser = getUser();
  const isAlreadyLoggedIn = isAuthenticated();

  useEffect(() => {
    document.title = 'IAPT Candidate Portal | Unisole';
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const authData: any = await login({
        phone: cleanPhone,
        name: name.trim() || undefined,
        signupSource: 'IAPT',
        source: 'IAPT',
        collegeName: 'NIT Hamirpur / IAPT Network',
      }).unwrap();

      const token = authData.token || authData.accessToken;
      const user = authData.user;

      dispatch(setCredentials({ token, user }));
      setAuthSession({ token, user });

      setSuccess(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#18181b', '#6366f1', '#10b981', '#f59e0b'],
      });

      setTimeout(() => {
        navigate(redirectTarget, { replace: true });
      }, 700);
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        'Unable to log in. Please verify your mobile number and try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col justify-between selection:bg-zinc-900 selection:text-white font-sans antialiased">
      {/* ─── 1. Standard Unisole SEO Navbar ──────────────────────────────── */}
      <Navbar />

      {/* ─── 2. Main Body Section ────────────────────────────────────────── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl space-y-8 animate-fade-in">
          {/* Top Header Badge & Text */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
              <span>Academic Partnership · IAPT & NIT Hamirpur</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              IAPT Candidate Portal
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 max-w-md mx-auto leading-relaxed">
              Enter your mobile number to access your curriculum tracks, live projects, and verified joint certifications.
            </p>
          </div>

          {/* Authentication Card */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            {/* If user is already logged in */}
            {isAlreadyLoggedIn && currentUser ? (
              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-4 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-zinc-900">
                    Welcome back, {currentUser.name || 'Learner'}!
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">
                    Signed in with +91 {currentUser.phone}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(redirectTarget, { replace: true })}
                  className="w-full py-3.5 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>Continue to IAPT Pathways</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Direct Mobile Login Form */
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Mobile Number Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 font-bold text-sm">
                      <Phone className="w-4 h-4 mr-1.5 text-zinc-400" />
                      <span className="text-zinc-600 font-mono">+91</span>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPhone(val);
                      }}
                      placeholder="98765 43210"
                      maxLength={10}
                      required
                      autoFocus
                      className="w-full pl-20 pr-4 py-3.5 bg-white border border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-xl text-zinc-900 font-mono text-sm font-semibold placeholder-zinc-400 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Optional Full Name Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                    Full Name <span className="text-zinc-400 font-normal lowercase">(optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <User className="w-4 h-4 text-zinc-400" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-10 pr-4 py-3.5 bg-white border border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 rounded-xl text-zinc-900 text-sm font-medium placeholder-zinc-400 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  disabled={loading || phone.length !== 10}
                  className="w-full py-4 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-zinc-400 border-t-white animate-spin" />
                  ) : (
                    <>
                      <span>Access IAPT Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 flex items-center justify-center gap-2 text-xs text-zinc-500 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Instant 1-Click Fast Pass · Direct Mobile Login</span>
                </div>
              </form>
            )}
          </div>

          {/* Institutional Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-800 shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-900 truncate">NIT Hamirpur</div>
                <div className="text-[11px] text-zinc-500">Academic Host</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-800 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-900 truncate">IAPT Association</div>
                <div className="text-[11px] text-zinc-500">Joint Certification</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-800 shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-900 truncate">UNISOLE AI Labs</div>
                <div className="text-[11px] text-zinc-500">Execution Partner</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── 3. Standard Unisole SEO Footer ──────────────────────────────── */}
      <Footer />
    </div>
  );
}
