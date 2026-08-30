import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
  Lock,
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
    document.title = 'IAPT Portal Login | Unisole × NIT Hamirpur';
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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981'],
      });

      setTimeout(() => {
        navigate(redirectTarget, { replace: true });
      }, 800);
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        'Unable to log in. Please check your mobile number and try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-pink-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ─── 1. Header Navigation ────────────────────────────────────────── */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-white/10 backdrop-blur-xl relative z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            U
          </div>
          <div>
            <span className="text-base font-black tracking-tight block text-white leading-none">
              UNISOLE
            </span>
            <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">
              SKILL AI LABS
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono">
            IAPT × NIT HAMIRPUR
          </span>
        </div>
      </header>

      {/* ─── 2. Main Login Hero Card ─────────────────────────────────────── */}
      <main className="my-auto px-4 py-12 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          {/* Partnership Banner Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-6 relative">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-purple-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Official IAPT Candidate Fast-Pass</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-300">
                IAPT Program Login
              </h1>

              <p className="text-xs sm:text-sm text-zinc-400 max-w-xs mx-auto leading-relaxed">
                Enter your mobile number to access your curriculum, technical pathways, and joint certifications.
              </p>
            </div>

            {/* If user is already authenticated */}
            {isAlreadyLoggedIn && currentUser && (
              <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 text-center space-y-3 animate-fade-in">
                <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Already Logged In</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {currentUser.name || 'Candidate'}{' '}
                  <span className="text-xs font-normal text-zinc-400 font-mono">
                    ({currentUser.phone})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(redirectTarget, { replace: true })}
                  className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <span>Continue to IAPT Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Direct Mobile Login Form */}
            {(!isAlreadyLoggedIn || success) && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Mobile Number Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-300">
                    WhatsApp / Mobile Number <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 font-bold text-xs">
                      <Phone className="w-4 h-4 mr-1 text-indigo-400" />
                      <span>+91</span>
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
                      className="w-full pl-16 pr-4 py-3.5 bg-zinc-950 border border-white/15 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl text-white font-mono text-sm font-bold placeholder-zinc-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Optional Name Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-300">
                    Full Name <span className="text-zinc-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3.5 bg-zinc-950 border border-white/15 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl text-white text-sm font-medium placeholder-zinc-500 outline-none transition-all"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading || phone.length !== 10}
                  className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 active:scale-[0.98] transition-all cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      <span>Access IAPT Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Instant 1-Click Fast Pass • No Password Required</span>
                </div>
              </form>
            )}
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
              <BookOpen className="w-4 h-4 text-indigo-400 mx-auto" />
              <div className="text-[11px] font-bold text-zinc-200">AI Curriculum</div>
              <div className="text-[9px] text-zinc-500">Industrial Modules</div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
              <Award className="w-4 h-4 text-amber-400 mx-auto" />
              <div className="text-[11px] font-bold text-zinc-200">Certification</div>
              <div className="text-[9px] text-zinc-500">NIT × IAPT × Unisole</div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
              <GraduationCap className="w-4 h-4 text-emerald-400 mx-auto" />
              <div className="text-[11px] font-bold text-zinc-200">Placement Pool</div>
              <div className="text-[9px] text-zinc-500">Tier-1 Network</div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── 3. Footer ───────────────────────────────────────────────────── */}
      <footer className="px-6 py-4 border-t border-white/10 text-center text-xs text-zinc-500 relative z-10">
        © {new Date().getFullYear()} UNISOLE Skill AI Labs in academic collaboration with IAPT & NIT Hamirpur.
      </footer>
    </div>
  );
}
