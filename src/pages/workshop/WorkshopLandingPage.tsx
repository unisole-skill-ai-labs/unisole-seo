import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  Cpu,
  Zap,
  BookOpen,
  Award,
  Terminal,
  FileCheck2,
  Lock,
  ChevronDown,
  ChevronUp,
  Share2,
  QrCode,
  Users,
  BrainCircuit,
  Workflow,
  Copy,
  Check,
  ExternalLink,
  Laptop,
  Flame,
  AlertCircle,
  HelpCircle,
  Video,
  FileText,
  BadgeCheck,
  Download,
  Loader2,
} from 'lucide-react';
import { isAuthenticated, getUser } from '../../utils/auth';
import {
  useGetMyWorkshopRegistrationQuery,
  useCreateWorkshopOrderMutation,
  useVerifyWorkshopPaymentMutation,
  useGetWorkshopQrQuery,
} from '../../store/apiSlice';
import { startWorkshopTokenPayment } from '../../utils/workshopPayment';

export default function WorkshopLandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const loggedIn = isAuthenticated();

  const [activeModule, setActiveModule] = useState<number | null>(1);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [shareRefName, setShareRefName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const justRegistered = searchParams.get('registered') === 'true';

  const { data: registrationData, refetch: refetchReg } = useGetMyWorkshopRegistrationQuery(
    user?.phone ? { phone: user.phone } : undefined,
    { skip: !loggedIn }
  );

  const [createOrder] = useCreateWorkshopOrderMutation();
  const [verifyPayment] = useVerifyWorkshopPaymentMutation();

  const currentRegistration = registrationData?.registration;
  const isPaid = currentRegistration?.paymentStatus === 'SUCCESS';

  useEffect(() => {
    document.title = 'Stop Chatting with AI. Start Systemizing It. | Unisole Masterclass';
  }, []);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/workshop/login${shareRefName.trim() ? `?ref=${encodeURIComponent(shareRefName.trim())}` : ''}`
    : 'https://unisole.org/workshop/login';

  const { data: qrData } = useGetWorkshopQrQuery(shareUrl, { skip: !showQrModal });

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleInitiateTokenPayment = async () => {
    setPaymentError('');

    if (!loggedIn) {
      navigate('/workshop/login');
      return;
    }

    if (isPaid) {
      navigate('/workshop/success');
      return;
    }

    setIsProcessingPayment(true);

    try {
      const orderRes = await createOrder({
        registrationId: currentRegistration?.id,
        phone: user?.phone,
      }).unwrap();

      if (orderRes.data?.alreadyPaid) {
        navigate('/workshop/success');
        return;
      }

      const orderData = orderRes.data;

      await startWorkshopTokenPayment({
        orderData: {
          orderId: orderData.orderId,
          amount: orderData.amount || 3900,
          registrationId: orderData.registrationId,
        },
        user: {
          name: user?.name || orderData.name,
          phone: user?.phone || orderData.phone,
          email: user?.email || orderData.email,
        },
        onSuccess: async (payResponse) => {
          try {
            await verifyPayment({
              providerOrderId: payResponse.razorpay_order_id,
              providerPaymentId: payResponse.razorpay_payment_id,
              providerSignature: payResponse.razorpay_signature,
              registrationId: orderData.registrationId,
            }).unwrap();

            refetchReg();
            navigate('/workshop/success');
          } catch (verErr: any) {
            console.error('Payment verification failed:', verErr);
            setPaymentError(
              verErr?.data?.message ||
                'Payment verification failed. If your money was deducted, please contact support with your payment ID.'
            );
          } finally {
            setIsProcessingPayment(false);
          }
        },
        onError: (err) => {
          setIsProcessingPayment(false);
          setPaymentError(err?.message || 'Payment was cancelled or failed.');
        },
        onDismiss: () => {
          setIsProcessingPayment(false);
        },
      });
    } catch (err: any) {
      console.error('Order creation failed:', err);
      setIsProcessingPayment(false);
      setPaymentError(err?.data?.message || 'Could not start payment order. Please try again.');
    }
  };

  const curriculumModules = [
    {
      part: 1,
      time: '30 Mins',
      title: 'Foundational Literacy & The Next-Token Mindset',
      subtitle: 'Understanding the mechanics behind hallucination, probabilistic logic & environmental compute.',
      topics: [
        {
          name: 'Demystifying the Stack',
          detail: 'Understand the exact technical hierarchy from Artificial Intelligence down to Large Language Models and weights.',
        },
        {
          name: 'How the "Brain" Predicts',
          detail: 'Master the mechanics of Next-Token Prediction and why model reliability directly mirrors training data frequency.',
        },
        {
          name: 'The True Environmental Cost',
          detail: 'Understand the compute and energy footprints of prompt loops and how streamlined prompts reduce compute waste.',
        },
        {
          name: 'Skepticism as a Superpower',
          detail: 'Break down why "Fluency is not Evidence" and learn how to run a rigorous live audit on plausible hallucinations.',
        },
      ],
      deliverable: 'Auditing Checklist & Hallucination Defense Protocol',
    },
    {
      part: 2,
      time: '30 Mins',
      title: 'The 2026 Model Landscape & Agentic Engines',
      subtitle: 'Controlling generation hyperparameters, deep research agents, and sandbox code execution.',
      topics: [
        {
          name: 'The Jagged Frontier',
          detail: 'Explore why AI capabilities are highly irregular and how to safely map the "Jagged Intelligence" surface.',
        },
        {
          name: 'Creativity Under the Hood',
          detail: 'Non-technical mastery over generation parameters like Temperature, Top-K, and Top-P to eliminate loops and tune variety.',
        },
        {
          name: 'Search vs. Deep Research',
          detail: 'Deconstruct the dual-agent search loops powering quick browser lookups versus multi-step deep research engines.',
        },
        {
          name: 'Built-in Python Sandboxes',
          detail: 'Discover how modern engines execute code offline to guarantee absolute mathematical precision and reliable data extraction.',
        },
      ],
      deliverable: 'Hyperparameter Matchmaking Cheat Sheet',
    },
    {
      part: 3,
      time: '30 Mins',
      title: '2026 Prompting Methods & Engineering Mastery',
      subtitle: 'The universal P-G-C-I-F-C framework, cognitive scaffolding, and XML contextual separation.',
      topics: [
        {
          name: 'The Prompt Quality Ladder',
          detail: 'Transition forever from fuzzy keyword prompts to precise, task-driven instruction packages.',
        },
        {
          name: 'The P-G-C-I-F-C Framework',
          detail: 'Master the universal blueprint: Persona, Goal, Context, Input, Format, Constraints.',
        },
        {
          name: 'Cognitive Scaffolding',
          detail: 'Deploy Chain-of-Thought (CoT), Step-Back prompting, and neutral framing to defeat model sycophancy and bias.',
        },
        {
          name: 'XML Formatting & Separation',
          detail: 'Use strict structural delimiters (<context>, <rules>, <input>) to isolate signal from ambient noise.',
        },
      ],
      deliverable: 'Universal Prompt Blueprint Template Library',
    },
    {
      part: 4,
      time: '30 Mins',
      title: 'Context Engineering & The Personal AI Operating System',
      subtitle: 'Building a repeatable, compounding workflow pipeline: Snapshotting, 6-Step Artifacts & 5A Quality Test.',
      topics: [
        {
          name: 'Digital Workspace Architecture',
          detail: 'Organize your workspace into Active, Reference, and Archive tiers to prevent valuable context from decaying.',
        },
        {
          name: 'The Project Snapshot & Handover Method',
          detail: 'Learn how to transfer state across multi-turn sessions cleanly without inheriting messy chat baggage.',
        },
        {
          name: 'The 6-Step Artifact Pipeline',
          detail: 'Shift from transient answers to solid deliverables: Define → Structure → Generate → Refine → Verify → Save.',
        },
        {
          name: 'The 5A Quality Test',
          detail: 'Run deliverables through the strict 5A checklist: Accurate, Audience-fit, Actionable, Authentic, and Accessible.',
        },
      ],
      deliverable: '30-Day S.M.A.R.T. Habits System & Handover Blueprint',
    },
  ];

  const takeaways = [
    {
      icon: BookOpen,
      title: 'Interactive 2-Hour Participant Workbook',
      desc: 'Hands-on auditing worksheets, parameter puzzle exercises, and step-by-step Prompt Makeover templates.',
      badge: 'Immediate Access',
    },
    {
      icon: Workflow,
      title: '30-Day S.M.A.R.T. Habits Tracker',
      desc: 'Weekly milestone checkpoints designed to turn your new prompting system into daily professional muscle memory.',
      badge: 'Action Plan',
    },
    {
      icon: Terminal,
      title: 'Universal Prompt Blueprint Library',
      desc: 'Pre-formatted, copy-pasteable P-G-C-I-F-C and A.I.D.E.A structural blocks for Claude, ChatGPT, and Gemini.',
      badge: 'Production Ready',
    },
    {
      icon: Award,
      title: 'Official Unisole Masterclass Credential',
      desc: 'Shareable certificate of completion validating your mastery of 2026 AI Prompting & Context Engineering standards.',
      badge: 'Verified Credential',
    },
  ];

  const targetAudiences = [
    {
      role: 'Students & Researchers',
      desc: 'Analyze vast literature, design structured paper outlines, and establish rigid fact-checking pipelines.',
      highlight: 'Literature reviews & study workflows',
    },
    {
      role: 'Professionals & Managers',
      desc: 'Automate documentation, summarize complex enterprise data, and build reusable business workflows.',
      highlight: 'Zero repetitive manual busywork',
    },
    {
      role: 'Educators & Faculty',
      desc: 'Create personalized curriculum materials, interactive lecture plans, and robust assessment rubrics.',
      highlight: 'Academic standard curriculum design',
    },
    {
      role: 'Curious Innovators',
      desc: 'Understand the physical, architectural, and mathematical machinery of generative agentic technology.',
      highlight: 'Deep generative mechanics',
    },
  ];

  const faqs = [
    {
      q: 'Why is there a ₹39 token fee for registration?',
      a: 'The ₹39 fee is a nominal commitment token to ensure serious attendance and prevent seat-hogging for our live, interactive Zoom capacity. The actual ₹999 masterclass fee is 96% subsidized by our Academic Partner Network.',
    },
    {
      q: 'Do I need any programming or coding experience?',
      a: 'No! The masterclass is designed for all disciplines (Students, Faculty, Working Professionals, Non-tech). You only need a laptop with a modern web browser and access to ChatGPT, Claude, or Gemini.',
    },
    {
      q: 'What if I miss the live session?',
      a: 'All registered participants who complete their token registration will receive the recording, the 2-Hour Interactive Workbook, the Prompt Blueprint Library, and certificate eligibility.',
    },
    {
      q: 'How will I receive the Zoom webinar link?',
      a: 'Upon registration and token payment, the Zoom meeting access link is instantly generated on your confirmation screen and dispatched to your registered WhatsApp mobile number and email.',
    },
    {
      q: 'Will I receive a verified certificate?',
      a: 'Yes. Every participant who completes the masterclass will receive an official verifiable digital certificate issued by Unisole Skill AI Labs.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white font-sans relative overflow-x-hidden antialiased">
      {/* Background Ambience & Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[650px] bg-gradient-to-b from-indigo-600/20 via-blue-600/10 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 -left-60 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Sticky Notification / Urgency Bar */}
      <div className="relative z-50 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/20 px-4 py-2.5 text-center text-xs sm:text-sm text-indigo-200 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 flex-wrap font-medium">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[11px] uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Limited Batch
          </span>
          <span>Live 2-Hour Interactive Masterclass • International AI Engineering Standards</span>
          <span className="hidden sm:inline">•</span>
          <strong className="text-white bg-indigo-600/40 px-2 py-0.5 rounded border border-indigo-400/30">
            Token Fee: ₹39 Only
          </strong>
        </div>
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <Link to="/workshop" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              U
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block">UNISOLE</span>
              <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase block -mt-1">
                AI Masterclass 2026
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-white transition-colors">Overview</a>
            <a href="#curriculum" className="hover:text-white transition-colors">Curriculum</a>
            <a href="#takeaways" className="hover:text-white transition-colors">Takeaways</a>
            <a href="#audience" className="hover:text-white transition-colors">Who Is It For</a>
            <a href="#pricing" className="hover:text-white transition-colors">Token Fee</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowQrModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              title="Share with Campus / Faculty QR"
            >
              <QrCode className="w-4 h-4 text-indigo-400" />
              <span>Campus QR</span>
            </button>

            {isPaid ? (
              <Link
                to="/workshop/success"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-600/30 transition-all"
              >
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                <span>Seat Confirmed</span>
              </Link>
            ) : loggedIn ? (
              <button
                onClick={handleInitiateTokenPayment}
                disabled={isProcessingPayment}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all active:scale-95 cursor-pointer"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹39 Token</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            ) : (
              <Link
                to="/workshop/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
              >
                <span>Register (₹39)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow">
        {/* Banner Alert for User who just registered */}
        {justRegistered && !isPaid && (
          <div className="bg-indigo-900/60 border-b border-indigo-500/30 py-3 px-4 text-center">
            <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 flex-wrap text-xs sm:text-sm text-indigo-100">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Welcome, <strong>{user?.name || 'Learner'}</strong>! Your details have been saved. Complete your <strong>₹39 Token Fee</strong> below to lock your Zoom seat.
              </span>
              <button
                onClick={handleInitiateTokenPayment}
                disabled={isProcessingPayment}
                className="px-3.5 py-1 rounded-lg bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-colors shadow"
              >
                Confirm Now (₹39) →
              </button>
            </div>
          </div>
        )}

        {paymentError && (
          <div className="bg-rose-950/80 border-b border-rose-500/40 py-3 px-4 text-center">
            <div className="max-w-3xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{paymentError}</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. HERO SECTION                                                           */}
        {/* ========================================================================= */}
        <section className="relative pt-14 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 overflow-hidden">
          <div className="max-w-5xl mx-auto text-center">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-8 shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>2-Hour International Standards Masterclass</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
              Stop Chatting with AI. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Start Systemizing It.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-2xl font-normal text-slate-300 mb-10 max-w-3xl mx-auto tracking-tight leading-relaxed">
              An intensive, 2-hour masterclass designed to transition you from a passive AI consumer into an elite workflow designer. Master next-token prediction, parameter-level control, universal prompt architectures, and context engineering.
            </p>

            {/* Highlight Badges Strip */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 max-w-3xl mx-auto text-xs sm:text-sm font-medium text-slate-300">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>2-Hour Live Intensive</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
                <Laptop className="w-4 h-4 text-indigo-400" />
                <span>ChatGPT • Claude • Gemini</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Workbook &amp; Blueprint Included</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Verified Certificate</span>
              </div>
            </div>

            {/* Main Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
              {isPaid ? (
                <Link
                  to="/workshop/success"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl shadow-emerald-600/30 transition-all active:scale-95"
                >
                  <BadgeCheck className="w-5 h-5" />
                  <span>View Your Workshop Ticket</span>
                </Link>
              ) : (
                <button
                  onClick={handleInitiateTokenPayment}
                  disabled={isProcessingPayment}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-base shadow-2xl shadow-indigo-600/40 hover:shadow-indigo-500/60 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Initiating Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Register Now — Pay ₹39 Token Fee</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}

              <a
                href="#curriculum"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 text-slate-300 hover:text-white font-semibold text-base border border-slate-800 transition-all backdrop-blur-md"
              >
                <span>Explore 4-Part Syllabus</span>
                <ChevronDown className="w-4 h-4" />
              </a>
            </div>

            {/* Sub-CTA reassurance */}
            <div className="mt-5 flex items-center justify-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Instant Zoom Link Confirmation
              </span>
              <span>•</span>
              <span>100% Zero Prior Coding Required</span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. ABOUT THE MASTERCLASS                                                  */}
        {/* ========================================================================= */}
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-slate-900/40">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-indigo-400 mb-2">
                The AI Literacy Paradox
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Most People Use AI Like a Search Engine. <br className="hidden sm:inline" />
                <span className="text-slate-400">Power Users Treat It Like an Operating System.</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-12">
              {/* Card 1: The Trap */}
              <div className="bg-slate-900/90 border border-rose-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-4">
                    The Novice Trap
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Casual Chatting &amp; "AI Slop"</h4>
                  <p className="text-sm text-slate-300 leading-relaxed space-y-3 mb-6">
                    Typing rapid, vague conversational questions into a chat box. Settling for shallow summaries, generic bullet points, and hallucinatory confident guesses.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">✕</span>
                      <span>Unpredictable outputs that require 80% manual rewriting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">✕</span>
                      <span>Context rot across long chats with no state isolation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">✕</span>
                      <span>Vulnerability to model sycophancy and plausible false citations</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                  RESULT: 15% Marginal Speedup • High Error Rate
                </div>
              </div>

              {/* Card 2: The System */}
              <div className="bg-slate-900/90 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-indigo-500/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
                    The Power User OS
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Systemized Context Engineering</h4>
                  <p className="text-sm text-slate-300 leading-relaxed space-y-3 mb-6">
                    Building structured input packages with P-G-C-I-F-C boundaries, tuning generation temperature, and executing the 6-Step Artifact Pipeline for verified deliverables.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Deterministic, repeatable outputs fit for production and academic rigor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Clean multi-turn handover snapshots that never lose context state</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Defensive neutral framing &amp; 5A Quality verification protocols</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-indigo-400 font-mono font-semibold">
                  RESULT: 10x Compounding Daily Productivity • Zero Guesswork
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900/90 to-indigo-950/60 border border-indigo-500/20 rounded-2xl p-6 text-center text-sm text-slate-300 max-w-3xl mx-auto">
              <p>
                Designed specifically for <strong>students, educators, researchers, managers, and creators</strong>. This session breaks down the real mechanics of generative models into concrete, repeatable routines you can deploy immediately.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. THE 4-PART CURRICULUM (30 MINS EACH)                                   */}
        {/* ========================================================================= */}
        <section id="curriculum" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
                Continuous 2-Hour Journey
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                The 4-Part Curriculum
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mt-3">
                Each module represents exactly 30 minutes of high-impact, practical training.
              </p>
            </div>

            {/* Modules Accordion / Cards */}
            <div className="space-y-4">
              {curriculumModules.map((mod) => {
                const isOpen = activeModule === mod.part;
                return (
                  <div
                    key={mod.part}
                    className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? 'bg-slate-900 border-indigo-500/50 shadow-2xl shadow-indigo-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Header */}
                    <button
                      onClick={() => setActiveModule(isOpen ? null : mod.part)}
                      className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 transition-colors ${
                          isOpen ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-800 text-slate-400'
                        }`}>
                          P{mod.part}
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5 mb-1">
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                              Part {mod.part} • {mod.time}
                            </span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                            {mod.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-400 mt-0.5 line-clamp-1">
                            {mod.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform ${
                        isOpen ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300 rotate-180' : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {/* Expandable Body */}
                    {isOpen && (
                      <div className="px-6 pb-7 pt-2 border-t border-slate-800/80">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                          {mod.topics.map((t, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
                            >
                              <div>
                                <h4 className="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                  <span>{t.name}</span>
                                </h4>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                  {t.detail}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Deliverable Pill */}
                        <div className="mt-4 p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3 text-xs">
                          <span className="text-slate-400">
                            Hands-On Takeaway for Part {mod.part}:
                          </span>
                          <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            {mod.deliverable}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. EXCLUSIVE MASTERCLASS TAKEAWAYS                                        */}
        {/* ========================================================================= */}
        <section id="takeaways" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-slate-900/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-cyan-400 mb-2">
                Immediate Lifetime Access
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Exclusive Masterclass Deliverables
              </h3>
              <p className="text-sm text-slate-400 max-w-xl mx-auto mt-2">
                Every registered attendee receives permanent access to our production assets:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {takeaways.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. WHO SHOULD REGISTER?                                                   */}
        {/* ========================================================================= */}
        <section id="audience" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-indigo-400 mb-2">
                Designed for High-Impact Roles
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Who Should Register?
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {targetAudiences.map((aud, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 mb-4 font-bold text-sm">
                      0{idx + 1}
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">{aud.role}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {aud.desc}
                    </p>
                  </div>
                  <div className="text-[11px] text-cyan-400 font-semibold pt-3 border-t border-slate-800">
                    {aud.highlight}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. EVENT DETAILS & PREREQUISITES                                         */}
        {/* ========================================================================= */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-slate-900/20">
          <div className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-slate-800">
              {/* Date & Time */}
              <div className="pt-4 md:pt-0 md:pr-6 space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Duration &amp; Format</span>
                </div>
                <h4 className="text-base font-bold text-white">2-Hour Intensive Session</h4>
                <p className="text-xs text-slate-400">Live Interactive Masterclass with Real-time Chat Q&amp;A</p>
              </div>

              {/* Location */}
              <div className="pt-4 md:pt-0 md:px-6 space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Video className="w-4 h-4" />
                  <span>Location</span>
                </div>
                <h4 className="text-base font-bold text-white">Live Zoom Webinar</h4>
                <p className="text-xs text-slate-400">Personal Zoom access link generated upon confirmation</p>
              </div>

              {/* Prerequisites */}
              <div className="pt-4 md:pt-0 md:pl-6 space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Laptop className="w-4 h-4" />
                  <span>Prerequisites</span>
                </div>
                <h4 className="text-base font-bold text-white">Zero Coding Background</h4>
                <p className="text-xs text-slate-400">Just bring a laptop with browser access to ChatGPT, Claude, or Gemini</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. TOKEN FEE & REGISTRATION CHECKOUT CARD (₹39)                           */}
        {/* ========================================================================= */}
        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950">
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-900 border-2 border-indigo-500/60 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-indigo-500/20 text-center relative overflow-hidden backdrop-blur-2xl">
              
              {/* Corner Badge */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl" />
              
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider mb-4">
                Academic Partner Subsidized
              </div>

              <h3 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                Secure Your Masterclass Seat
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
                Seating is strictly capped to preserve high-fidelity interactive chat support during live workshop activities.
              </p>

              {/* Pricing Display */}
              <div className="my-6 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <span className="text-sm text-slate-500 line-through font-semibold">₹999</span>
                  <span className="text-4xl sm:text-5xl font-black text-white">₹39</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    96% Subsidized
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  One-time nominal token commitment fee • Includes Workbook &amp; Certificate
                </p>
              </div>

              {/* Action Button */}
              {isPaid ? (
                <div className="space-y-3 max-w-md mx-auto">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>You are registered and confirmed!</span>
                  </div>
                  <Link
                    to="/workshop/success"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base transition-all"
                  >
                    <span>View Workshop Access Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 max-w-md mx-auto">
                  <button
                    onClick={handleInitiateTokenPayment}
                    disabled={isProcessingPayment}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-lg shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-60"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Opening Secure Gateway...</span>
                      </>
                    ) : loggedIn ? (
                      <>
                        <span>Pay ₹39 Token Fee via Razorpay</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        <span>Register &amp; Pay ₹39 Token Fee</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
                    <span>⚡ Instant UPI / Cards / NetBanking</span>
                    <span>•</span>
                    <span>🔒 256-bit Encrypted</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. CAMPUS AMBASSADOR & FACULTY QR GENERATOR TOOL                          */}
        {/* ========================================================================= */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-slate-900/40">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
              <QrCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>Campus &amp; Faculty Referral Hub</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Distribute via Professor Network or College Batches
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Are you a faculty coordinator or student lead? Generate a custom tracked QR code and registration link for your college.
            </p>
            <div>
              <button
                onClick={() => setShowQrModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>Open Custom QR Generator</span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. FAQ SECTION                                                            */}
        {/* ========================================================================= */}
        <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-indigo-400 mb-2">
                Got Questions?
              </h2>
              <h3 className="text-3xl font-extrabold text-white tracking-tight">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer font-bold text-white text-sm sm:text-base"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-indigo-400' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* QR MODAL FOR FACULTY / CAMPUS PARTNERS                                   */}
      {/* ========================================================================= */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-left relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase tracking-wider">
                <QrCode className="w-3.5 h-3.5" />
                Custom Campus QR
              </div>
              <h3 className="text-xl font-bold text-white">Generate Tracked QR Code</h3>
              <p className="text-xs text-slate-400">
                Enter your name or college code to generate a custom link that attributes student registrations.
              </p>
            </div>

            {/* Input ref */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Faculty Name / College Code
              </label>
              <input
                type="text"
                placeholder="e.g. ProfSharma or ThaparCSE"
                value={shareRefName}
                onChange={(e) => setShareRefName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Display QR */}
            <div className="p-4 rounded-2xl bg-white flex flex-col items-center justify-center">
              {qrData?.qrDataUrl ? (
                <img
                  src={qrData.qrDataUrl}
                  alt="Tracked QR Code"
                  className="w-48 h-48 rounded-lg shadow-sm"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
                </div>
              )}
              <span className="text-[10px] text-slate-600 mt-2 font-mono break-all text-center">
                Scan to Register for AI Masterclass
              </span>
            </div>

            {/* Copy Link Button */}
            <div className="space-y-2">
              <button
                onClick={handleCopyShareLink}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Link Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Shareable URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-10 px-4 border-t border-slate-800/80 bg-slate-950 text-center text-xs text-slate-500 space-y-3">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              U
            </div>
            <span className="font-bold text-slate-300">Unisole Skill AI Labs</span>
          </div>
          <p>© 2026 Unisole. From Novice to Power User AI Masterclass. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/workshop" className="hover:text-white">Workshop</Link>
            <Link to="/programs" className="hover:text-white">Programs</Link>
            <Link to="/login" className="hover:text-white">Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
