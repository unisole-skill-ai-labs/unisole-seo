import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { useLoginMutation } from '../store/apiSlice';
import { setAuthSession, isAuthenticated } from '../utils/auth';
import { User, Phone, ArrowRight, Loader2, Sparkles, BookOpen, Award, CheckCircle } from 'lucide-react';

export default function IaptLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/iapt';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(redirect, { replace: true });
    }
  }, [navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phone.replace(/\D/g, '');
    const cleanName = name.trim();

    if (!cleanName) {
      setErrorMsg('Please enter your full name');
      return;
    }

    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      const response = await login({
        phone: cleanPhone,
        name: cleanName,
        signupSource: 'IAPT',
        source: 'IAPT',
      }).unwrap();

      const token = response.token || response.accessToken;
      const user = response.user;

      dispatch(setCredentials({ token, user }));
      setAuthSession({ token, user });

      navigate(redirect, { replace: true });
    } catch (err: any) {
      console.error('IAPT login error:', err);
      setErrorMsg(
        err?.data?.message || err?.message || 'Unable to log in. Please check your credentials and try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between antialiased selection:bg-blue-600 selection:text-white">
      {/* Background Subtle Gradient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl" />
      </div>

      {/* Header Bar */}
      <header className="relative z-10 py-6 px-4 border-b border-slate-800/80 backdrop-blur-md bg-slate-950/60">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              IAPT-UNISOLE Program
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            National Level Workshop
          </span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Workshop Portal Access
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI for Physics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              Enter your details to view the 7-day curriculum and workshop resources.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs leading-relaxed flex items-center gap-2">
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. / Prof. / Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-medium text-sm">
                  <Phone className="w-4 h-4 mr-1.5 text-slate-500" />
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-20 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all tracking-wider"
                />
              </div>
            </div>

            {/* Highlights */}
            <div className="pt-2 pb-1 space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Instant access to 7-Day Curriculum & Modules</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>IAPT-UNISOLE Co-Branded Credentialing</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center font-bold px-5 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm transition-all duration-150 active:scale-[0.98] gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Accessing Portal...</span>
                </>
              ) : (
                <>
                  <span>Access Workshop Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>© 2026 IAPT-UNISOLE Initiative. All rights reserved.</p>
      </footer>
    </div>
  );
}
