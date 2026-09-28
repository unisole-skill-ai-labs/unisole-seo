import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  BrainCircuit,
  Layers,
  Terminal,
  ArrowRight,
  ShieldCheck,
  Phone,
  Mail,
  Globe,
  Building2,
  GraduationCap,
  User,
  Loader2,
  Check,
  Copy,
  AlertCircle,
  X,
  Zap,
  Cpu,
  BookOpen,
  Share2,
  Sliders,
  Send,
  Workflow,
  MessageCircle,
} from 'lucide-react';
import { isAuthenticated, getUser } from '../../utils/auth';
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useRegisterWorkshopMutation,
} from '../../store/apiSlice';
import { setCredentials } from '../../store/authSlice';

interface SlotOption {
  id: 'slot-1' | 'slot-2';
  title: 'Slot 1' | 'Slot 2';
  time: string;
  tz: string;
}

const SLOTS: SlotOption[] = [
  { id: 'slot-1', title: 'Slot 1', time: '7–8 PM', tz: 'IST' },
  { id: 'slot-2', title: 'Slot 2', time: '9–10 PM', tz: 'IST' },
];

export default function WorkshopJevPage() {
  const dispatch = useDispatch();

  // Auth & registration mutations
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [registerWorkshop, { isLoading: isRegistering }] = useRegisterWorkshopMutation();

  const currentUser = getUser();
  const alreadyLoggedIn = isAuthenticated();

  // State
  const [showRegModal, setShowRegModal] = useState(false);
  const [regStep, setRegStep] = useState<'PHONE_OTP' | 'PROFILE' | 'SLOT' | 'CONFIRMED'>('PHONE_OTP');

  // Form Fields
  const [phone, setPhone] = useState(currentUser?.phone ? currentUser.phone.replace(/\D/g, '').slice(-10) : '');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [instituteName, setInstituteName] = useState(currentUser?.collegeName || '');
  const [branchCourse, setBranchCourse] = useState(currentUser?.branch || '');
  const [selectedSlot, setSelectedSlot] = useState<SlotOption>(SLOTS[0]);
  const [confirmedSlot, setConfirmedSlot] = useState<string>(
    currentUser?.metadata?.slot || (currentUser?.metadata?.slotId === 'slot-2' ? '9–10 PM IST' : '')
  );

  // Status messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const otpInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // SEO Title & Meta tags
  useEffect(() => {
    document.title = 'Free Online Session: Discover JEV — The Future of Decision-Making AI | UNISOLE';

    // Check if user already registered in metadata
    if (currentUser?.metadata?.registeredForWorkshop && currentUser?.metadata?.workshopSlug === 'workshop-jev') {
      if (currentUser?.metadata?.slot) {
        setConfirmedSlot(currentUser.metadata.slot);
      }
    }
  }, [currentUser]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setInterval(() => {
      setOtpCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCountdown]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (showRegModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showRegModal]);

  const handleOpenRegistration = (preselectedSlot?: SlotOption) => {
    if (preselectedSlot) {
      setSelectedSlot(preselectedSlot);
    }
    setErrorMsg('');

    // If already authenticated and verified, skip straight to Profile or Slot
    if (alreadyLoggedIn && currentUser?.phone) {
      if (currentUser.name && currentUser.collegeName && currentUser.branch) {
        setRegStep('SLOT');
      } else {
        setRegStep('PROFILE');
      }
    } else {
      setRegStep('PHONE_OTP');
    }
    setShowRegModal(true);
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const clean = phone.replace(/\D/g, '');
    if (clean.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp number');
      return;
    }

    try {
      await sendOtp({ phone: clean, channel: 'WHATSAPP' }).unwrap();
      setOtpSent(true);
      setOtpCountdown(30);
      setSuccessNotice(`4-digit OTP sent to WhatsApp (+91 ${clean})`);
      setTimeout(() => otpInputRef.current?.focus(), 150);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || 'Failed to send WhatsApp OTP. Please retry.');
    }
  };

  // Step 1b: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanOtp = otp.trim();
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanOtp.length !== 4) {
      setErrorMsg('Please enter the 4-digit code received on WhatsApp');
      return;
    }

    try {
      const res = await verifyOtp({
        phone: cleanPhone,
        otp: cleanOtp,
        source: 'WORKSHOP_JEV',
      }).unwrap();

      if (res.token || res.accessToken) {
        dispatch(setCredentials({ token: res.token || res.accessToken, user: res.user }));
      }

      if (res.user?.name && !res.user.name.startsWith('Learner ')) {
        setFullName(res.user.name);
      }
      if (res.user?.collegeName) {
        setInstituteName(res.user.collegeName);
      }
      if (res.user?.branch) {
        setBranchCourse(res.user.branch);
      }

      setSuccessNotice('WhatsApp number verified successfully!');
      // Proceed to Step 2: Profile details
      setRegStep('PROFILE');
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || 'Invalid or expired OTP. Please verify and retry.');
    }
  };

  // Step 2: Save Profile details (Compulsory: Full Name, Institute, Branch/Course)
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Full name is compulsory. Please enter your name.');
      return;
    }
    if (!instituteName.trim()) {
      setErrorMsg('Institute / Organization name is compulsory. Please enter where you study or work.');
      return;
    }
    if (!branchCourse.trim()) {
      setErrorMsg('Branch / Course name is compulsory. Please enter your field or specialization.');
      return;
    }

    // Proceed to Step 3: Choose Timing Slot
    setRegStep('SLOT');
  };

  // Step 3: Confirm Registration & Slot
  const handleConfirmSlot = async () => {
    setErrorMsg('');
    const cleanPhone = phone.replace(/\D/g, '');

    try {
      const slotString = `${selectedSlot.title}: ${selectedSlot.time} ${selectedSlot.tz}`;
      const payload = {
        name: fullName.trim(),
        phone: cleanPhone,
        collegeName: instituteName.trim(),
        branch: branchCourse.trim(),
        workshopSlug: 'workshop-jev',
        workshopName: 'Discover JEV — The Future of Decision-Making AI',
        sessionDate: '2026-09-29',
        slot: slotString,
        slotId: selectedSlot.id,
      };

      const res = await registerWorkshop(payload).unwrap();
      if (res.token || res.accessToken) {
        dispatch(setCredentials({ token: res.token || res.accessToken, user: res.user }));
      }

      setConfirmedSlot(slotString);
      setRegStep('CONFIRMED');
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || 'Registration encountered an error. Please try again.');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'Discover JEV — The Future of Decision-Making AI | UNISOLE',
        text: 'Join UNISOLE for a free live session on JEV: The Future of Decision-Making AI!',
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    'UNISOLE Free Live Session: Discover JEV — Decision-Making AI'
  )}&dates=20260929T133000Z/20260929T163000Z&details=${encodeURIComponent(
    'Free online session on JEV - The Future of Decision-Making AI by UNISOLE Skill AI Labs.\nSession Date: Tuesday, 29 September 2026\nWebsite: https://www.unisole.org\nContact: 8219691201'
  )}&location=${encodeURIComponent('Online / Live on UNISOLE')}`;

  const curriculumModules = [
    {
      icon: BrainCircuit,
      title: 'Introduction to JEV',
      desc: 'What it is, how it works and how it differs from general-purpose AI models like ChatGPT.',
      highlight: 'Core AI Foundation',
    },
    {
      icon: Cpu,
      title: 'System 1 vs. System 2 AI',
      desc: 'Understanding fast, intuitive decisions versus complex multi-step reasoning.',
      highlight: 'Cognitive Architecture',
    },
    {
      icon: Sliders,
      title: 'Noul, Choice & Score',
      desc: "Explore JEV's three question types for probability estimation, classification and scoring.",
      highlight: 'Decision Primitives',
    },
    {
      icon: Workflow,
      title: 'State & Context',
      desc: 'Learn how providing the right situational information dramatically improves AI decision-making.',
      highlight: 'Context Engineering',
    },
    {
      icon: Terminal,
      title: 'Live Python Demonstration',
      desc: 'Build a practical, real-world AI-powered customer support classifier using JEV.',
      highlight: 'Hands-on Code',
    },
    {
      icon: Zap,
      title: 'Real-World Applications',
      desc: 'Explore how JEV supports automation, customer service, intelligent agents and decision workflows.',
      highlight: 'Production Deployment',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Ambient Glow Effect */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 right-[-100px] w-[500px] h-[400px] bg-indigo-500/10 blur-[140px] rounded-full" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#090a0f]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              UNISOLE
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
              Skill AI Labs
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>

            {confirmedSlot ? (
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Registered: {confirmedSlot}</span>
              </div>
            ) : (
              <button
                onClick={() => handleOpenRegistration()}
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                Register Free
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 pt-10 pb-20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Free Online Session:{' '}
            <span className="block mt-1 bg-gradient-to-r from-emerald-400 via-teal-200 to-indigo-300 bg-clip-text text-transparent">
              Discover JEV — The Future of Decision-Making AI
            </span>
          </h1>

          {/* Hook / Subtitle */}
          <p className="text-lg sm:text-xl text-zinc-300 leading-relaxed font-normal">
            What if AI could do more than generate text? Join UNISOLE&apos;s free online session to explore{' '}
            <strong className="text-white font-semibold">JEV</strong>, a specialized AI model designed for fast,
            structured decision-making.
          </p>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Through live demonstrations and practical examples, discover how JEV can be integrated into real-world AI
            applications.
          </p>

          {/* Primary Action Button */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            {confirmedSlot ? (
              <div className="w-full sm:w-auto p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-semibold text-emerald-300">You are Registered!</p>
                  <p className="text-sm font-bold text-white">Your Time: {confirmedSlot}</p>
                </div>
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 text-xs px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400"
                >
                  Add to Calendar
                </a>
              </div>
            ) : (
              <button
                onClick={() => handleOpenRegistration()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base bg-emerald-500 hover:bg-emerald-400 text-black shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 group"
              >
                <span>Register Now — It&apos;s 100% Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* What You'll Learn Section */}
        <section className="mt-20">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Curriculum</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
              <span>📚 What You&apos;ll Learn</span>
            </h2>
            <p className="text-sm text-zinc-400">
              Designed from ground up to take you from foundational concepts to live production deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {curriculumModules.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-zinc-800/80 bg-[#121316]/90 p-6 flex flex-col justify-between hover:border-emerald-500/40 hover:bg-[#14161a] transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-800/60 text-zinc-400 border border-zinc-700/40">
                        {item.highlight}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
                    <span>Topic 0{index + 1}</span>
                    <span className="text-emerald-400/80 font-medium">Live Demo & Q&A</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why JEV Callout Banner */}
        <section className="mt-20 rounded-2xl bg-gradient-to-br from-zinc-900 via-[#101216] to-[#0c0d11] border border-zinc-800 p-8 sm:p-10 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Beyond Text Generation</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why Fast, Structured AI Decision-Making Matters
            </h3>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Traditional LLMs take seconds to generate paragraphs of text when all your application needs is a rapid,
              deterministic decision — a probability score, a classification, or a discrete action. JEV solves this by
              introducing low-latency cognitive primitives built specifically for autonomous workflows.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleOpenRegistration()}
                className="px-6 py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 transition-all"
              >
                Claim Your Free Seat
              </button>
              <a
                href="https://www.unisole.org"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-xl font-medium text-sm text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 transition-all flex items-center gap-2"
              >
                <span>Learn about UNISOLE</span>
                <Globe className="w-4 h-4 text-zinc-400" />
              </a>
            </div>
          </div>
        </section>

        {/* Footer & Organization Section */}
        <footer className="mt-20 border-t border-zinc-800/80 pt-10 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-800/60">
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Hosted & Certified by</p>
              <h4 className="text-xl font-extrabold text-white mt-1">UNISOLE Skill AI Labs</h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-md">
                Empowering college campuses and developers across India with applied AI, industrial automation, and
                next-gen engineering systems.
              </p>
            </div>

            {/* Direct Contacts */}
            <div className="flex flex-col sm:items-end gap-2 text-sm text-zinc-300">
              <a
                href="https://www.unisole.org"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>www.unisole.org</span>
              </a>

              <a
                href="mailto:unisole.ai.labs@gmail.com"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>unisole.ai.labs@gmail.com</span>
              </a>

              <a
                href="tel:8219691201"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>8219691201</span>
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-3">
            <p>© {new Date().getFullYear()} UNISOLE Skill AI Labs. All rights reserved.</p>
            <p className="text-zinc-400">Register now and choose the time that works best for you!</p>
          </div>
        </footer>
      </main>

      {/* REGISTRATION MODAL / PROGRESSIVE DIALOG */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            ref={modalRef}
            className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#121316] p-6 sm:p-8 shadow-2xl relative text-zinc-100 max-h-[92vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowRegModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {successNotice && regStep !== 'CONFIRMED' && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                <span>{successNotice}</span>
              </div>
            )}

            {/* STEP 1: Phone + WhatsApp OTP */}
            {regStep === 'PHONE_OTP' && (
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800/50">
                    Step 1 of 3 · Verification
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                    Enter your WhatsApp Number
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    We send an instant 4-digit verification code directly to your WhatsApp to confirm your seat.
                  </p>
                </div>

                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-300 block mb-1.5" htmlFor="phone-input">
                        WhatsApp Mobile Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-400">
                          +91
                        </span>
                        <input
                          id="phone-input"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="98765 43210"
                          maxLength={10}
                          className="w-full bg-[#18191f] border border-zinc-700/80 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                          required
                          autoFocus
                        />
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">No spam. Only session access links and reminders.</p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSendingOtp || phone.replace(/\D/g, '').length !== 10}
                      className="w-full py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
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
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-zinc-300 block" htmlFor="otp-input">
                          Enter 4-Digit Code
                        </label>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-[11px] text-emerald-400 hover:underline"
                        >
                          Change Number ({phone})
                        </button>
                      </div>

                      <input
                        ref={otpInputRef}
                        id="otp-input"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="• • • •"
                        maxLength={4}
                        className="w-full bg-[#18191f] border border-zinc-700/80 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-bold"
                        required
                        autoFocus
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifyingOtp || otp.trim().length !== 4}
                      className="w-full py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Proceed</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="text-center pt-1">
                      {otpCountdown > 0 ? (
                        <p className="text-xs text-zinc-400">Resend code in {otpCountdown}s</p>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendOtp()}
                          className="text-xs text-emerald-400 hover:underline font-semibold"
                        >
                          Didn&apos;t receive code? Resend OTP
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* STEP 2: Profile Details (Full Name, Institute Name, Branch/Course - Free text, NO DROPDOWNS) */}
            {regStep === 'PROFILE' && (
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800/50">
                    Step 2 of 3 · Participant Profile
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2">Tell Us About Yourself</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Open for everyone across colleges, companies and independent learners. All fields are compulsory.
                  </p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1.5" htmlFor="full-name">
                      Full Name <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        id="full-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g., Aditya Sharma"
                        className="w-full bg-[#18191f] border border-zinc-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Institute Name - Plain text, NO DROPDOWN */}
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1.5" htmlFor="institute-name">
                      Institute / College / Organization Name <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        id="institute-name"
                        type="text"
                        value={instituteName}
                        onChange={(e) => setInstituteName(e.target.value)}
                        placeholder="e.g., HPU Shimla / IIT Delhi / Startup / Freelancer"
                        className="w-full bg-[#18191f] border border-zinc-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      No restriction: Anyone from any institute or workplace can join.
                    </p>
                  </div>

                  {/* Branch / Course Name - Plain text, NO DROPDOWN */}
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1.5" htmlFor="branch-course">
                      Branch / Course / Specialization <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        id="branch-course"
                        type="text"
                        value={branchCourse}
                        onChange={(e) => setBranchCourse(e.target.value)}
                        placeholder="e.g., B.Tech CSE / BCA / MCA / Data Science / Professional"
                        className="w-full bg-[#18191f] border border-zinc-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <span>Next: Select Session Timing</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* STEP 3: Choose Timing Slot */}
            {regStep === 'SLOT' && (
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800/50">
                    Step 3 of 3 · Session Timing
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                    Choose Your Preferred Time Slot
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Register now and choose the time that works best for you!
                  </p>
                </div>

                {/* Session Date pill */}
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2 text-sm text-zinc-200">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">Tuesday, 29 September 2026</span>
                </div>

                {/* Slot Selection Buttons */}
                <div className="space-y-3">
                  {SLOTS.map((slot) => {
                    const isSelected = selectedSlot.id === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500'
                            : 'border-zinc-800 bg-[#16171b] hover:border-zinc-700'
                        }`}
                      >
                        <div>
                          <span className="text-xs text-zinc-400 block">{slot.title}</span>
                          <span className="text-xl font-bold text-white block mt-0.5">
                            {slot.time} <span className="text-xs text-zinc-400 font-medium">{slot.tz}</span>
                          </span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-emerald-400 bg-emerald-500 text-black' : 'border-zinc-600'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-zinc-400">
                  Suitable for students, developers, AI enthusiasts and anyone interested in building practical AI
                  applications.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRegStep('PROFILE')}
                    className="px-4 py-3 rounded-xl border border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSlot}
                    disabled={isRegistering}
                    className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Confirming Registration...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm & Complete Registration</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Success / Confirmed Pass */}
            {regStep === 'CONFIRMED' && (
              <div className="space-y-6 text-center py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-in zoom-in-75 duration-200">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                    Registration Confirmed
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    You&apos;re Officially Registered!
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-2">
                    Welcome, <strong className="text-zinc-200">{fullName}</strong>! We look forward to seeing you at
                    the live session.
                  </p>
                </div>

                {/* Ticket Pass Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-800/40 text-left space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>EVENT PASS</span>
                    <span className="text-emerald-400 font-semibold">FREE · ONLINE · LIVE</span>
                  </div>
                  <p className="text-base font-bold text-white">Discover JEV — Decision-Making AI</p>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-zinc-800/80">
                    <div>
                      <span className="text-zinc-400 block">Date</span>
                      <span className="font-semibold text-zinc-200">29 Sep 2026</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block">Time Slot</span>
                      <span className="font-semibold text-emerald-400">{confirmedSlot}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2.5">
                  <a
                    href={calendarUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Add to Google Calendar</span>
                  </a>

                  <a
                    href="https://chat.whatsapp.com/invite"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-xl font-semibold text-xs sm:text-sm bg-[#16171b] hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Join WhatsApp Updates Community</span>
                  </a>
                </div>

                {/* Organizer Contact details */}
                <div className="border-t border-zinc-800 pt-4 text-xs text-zinc-400 space-y-1">
                  <p className="font-semibold text-zinc-300">Organized by UNISOLE Skill AI Labs</p>
                  <p>
                    🌐{' '}
                    <a href="https://www.unisole.org" target="_blank" rel="noreferrer" className="hover:underline">
                      www.unisole.org
                    </a>{' '}
                    | 📧{' '}
                    <a href="mailto:unisole.ai.labs@gmail.com" className="hover:underline">
                      unisole.ai.labs@gmail.com
                    </a>{' '}
                    | 📞{' '}
                    <a href="tel:8219691201" className="hover:underline">
                      8219691201
                    </a>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRegModal(false)}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
