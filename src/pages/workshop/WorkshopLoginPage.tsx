import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import { useRegisterWorkshopMutation, useGetPublicCollegesQuery } from '../../store/apiSlice';
import { setAuthSession, isAuthenticated, getUser } from '../../utils/auth';
import {
  User,
  Phone,
  Mail,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle,
  ShieldCheck,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';

export default function WorkshopLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const searchParams = new URLSearchParams(location.search);
  const refCode = searchParams.get('ref') || searchParams.get('professor') || searchParams.get('faculty') || searchParams.get('referrer') || '';
  const collegeParam = searchParams.get('college') || searchParams.get('collegeName') || '';
  const utmSource = searchParams.get('utm_source') || (refCode ? 'PROFESSOR_NETWORK' : 'DIRECT_QR');
  const utmMedium = searchParams.get('utm_medium') || 'email_or_qr';
  const utmCampaign = searchParams.get('utm_campaign') || 'ai_masterclass_2026';

  const [registerWorkshop, { isLoading }] = useRegisterWorkshopMutation();
  const { data: collegesList } = useGetPublicCollegesQuery();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [collegeName, setCollegeName] = useState(collegeParam);
  const [branch, setBranch] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.title = 'Register for AI Masterclass | Unisole Academic Initiative';
    if (isAuthenticated()) {
      const user = getUser();
      if (user?.phone) {
        navigate('/workshop', { replace: true });
      }
    }
  }, [navigate]);

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
      setErrorMsg('Please provide a valid 10-digit mobile number');
      return;
    }

    try {
      const response = await registerWorkshop({
        name: cleanName,
        phone: cleanPhone,
        email: email.trim() || undefined,
        collegeName: collegeName.trim() || undefined,
        branch: branch.trim() || undefined,
        yearOfStudy: yearOfStudy || undefined,
        referredBy: refCode || undefined,
        campaignSource: refCode ? 'PROFESSOR_NETWORK' : 'AI_WORKSHOP',
        utmSource,
        utmMedium,
        utmCampaign,
      }).unwrap();

      const token = response.token || response.accessToken;
      const user = response.user;

      if (token && user) {
        dispatch(setCredentials({ token, user }));
        setAuthSession({ token, user });
      }

      navigate('/workshop?registered=true', { replace: true });
    } catch (err: any) {
      console.error('Workshop registration error:', err);
      setErrorMsg(
        err?.data?.message || err?.data?.error || err?.message || 'Unable to register. Please check your details and try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between antialiased selection:bg-indigo-600 selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -left-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Header Bar */}
      <header className="relative z-10 py-5 px-4 sm:px-8 border-b border-slate-800/80 backdrop-blur-md bg-slate-950/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/workshop" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              U
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block">UNISOLE</span>
              <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase block -mt-0.5">
                AI Masterclass 2026
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Live 2-Hour Intensive</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Registration Area */}
      <main className="relative z-10 flex-grow flex items-center justify-center py-10 px-4 sm:px-6">
        <div className="max-w-xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-6">
          
          {/* Referral Badge if student came via Professor/Coordinator */}
          {refCode && (
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center gap-3 text-xs text-indigo-300">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Academic Faculty Referral</p>
                <p className="text-[11px] text-indigo-300/90">
                  Invited via Professor/Campus Network: <strong className="text-white uppercase">{refCode}</strong>
                </p>
              </div>
            </div>
          )}

          {/* Title & Headline */}
          <div className="text-center space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Priority Workshop Access
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Stop Chatting with AI. <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                Start Systemizing It.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Enter your details to confirm your seat for the 2-Hour International Masterclass on Advanced AI Prompting &amp; Context Engineering.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs leading-relaxed flex items-center gap-2.5">
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                WhatsApp Mobile Number <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-medium text-sm">
                  <Phone className="w-4 h-4 mr-1 text-slate-500" />
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-16 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all tracking-wider"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">We will send your Zoom webinar access link to this WhatsApp number.</p>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address <span className="text-slate-500 font-normal">(Optional, for calendar invite)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* College & Branch Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* College / Institution */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  College / Institution
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. IIT, NIT, Thapar..."
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Branch / Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Branch / Stream
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Layers className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. CSE, ECE, BCA, MBA..."
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Year of study dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Current Status / Year of Study
              </label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              >
                <option value="">Select Year / Status</option>
                <option value="1st Year">1st Year Student</option>
                <option value="2nd Year">2nd Year Student</option>
                <option value="3rd Year">3rd Year Student</option>
                <option value="4th Year / Final Year">4th / Final Year Student</option>
                <option value="Postgraduate / Researcher">Postgraduate / Researcher</option>
                <option value="Faculty / Educator">Faculty / Educator</option>
                <option value="Working Professional">Working Professional</option>
              </select>
            </div>

            {/* Workshop Perks Bullet Points */}
            <div className="pt-2 pb-1 space-y-2 text-[12px] text-slate-400 bg-slate-800/40 p-3.5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live 2-Hour Interactive Masterclass + Live Q&amp;A</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Includes 2-Hour Participant Interactive Workbook &amp; Blueprint Library</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Certificate of Participation issued by Unisole</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center font-bold px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white text-base transition-all duration-200 active:scale-[0.98] gap-2 shadow-xl shadow-indigo-600/30 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Securing Access...</span>
                </>
              ) : (
                <>
                  <span>Continue to Masterclass Portal</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Back link */}
          <div className="text-center pt-2">
            <Link to="/workshop" className="text-xs text-slate-400 hover:text-white transition-colors">
              Want to see syllabus details first? <span className="text-indigo-400 underline font-medium">View Masterclass Page →</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>© 2026 Unisole Skill AI Labs • Academic &amp; Faculty Partner Network</p>
      </footer>
    </div>
  );
}
