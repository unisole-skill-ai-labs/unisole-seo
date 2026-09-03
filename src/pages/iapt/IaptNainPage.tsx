import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IaptNavbar from '../../components/iapt/IaptNavbar';
import IaptFooter from '../../components/iapt/IaptFooter';
import IaptAuthGuard from '../../components/iapt/IaptAuthGuard';
import { getUser } from '../../utils/auth';
import {
  useRegisterNainMutation,
  useGetMyNainRegistrationQuery,
} from '../../store/apiSlice';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  BookOpen,
  Compass,
  Hammer,
  Share2,
  GraduationCap,
  Microscope,
  Cpu,
  UserCheck,
  CheckCircle,
  Network,
  Globe,
  Layers,
  ArrowUpRight,
  Lightbulb,
  Loader2,
  Edit3,
  Building,
  MapPin,
  Phone,
  User,
} from 'lucide-react';

export default function IaptNainPage() {
  const currentUser = getUser();
  const { data: existingRegData, isLoading: isLoadingReg } = useGetMyNainRegistrationQuery();
  const [registerNain, { isLoading: isRegistering }] = useRegisterNainMutation();

  const [joined, setJoined] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState('Physics Teacher / Educator');
  const [cityState, setCityState] = useState('');
  const [institution, setInstitution] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const currentReg = existingRegData?.data;

  useEffect(() => {
    document.title = 'NAIN — National AI Network of IAPT | In collaboration with Unisole';
  }, []);

  useEffect(() => {
    if (currentReg) {
      setRole(currentReg.category || 'Physics Teacher / Educator');
      setInstitution(currentReg.institution || '');
      setCityState(currentReg.cityState || '');
      setJoined(true);
    }
  }, [currentReg]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!role || !institution.trim() || !cityState.trim()) {
      setErrorMsg('Please fill in all fields (category, institution, and city/state).');
      return;
    }

    try {
      await registerNain({
        category: role,
        institution: institution.trim(),
        cityState: cityState.trim(),
      }).unwrap();
      setJoined(true);
      setIsEditing(false);
    } catch (err: any) {
      console.error('NAIN registration error:', err);
      setErrorMsg(err?.data?.error || err?.message || 'Failed to submit NAIN registration.');
    }
  };

  return (
    <IaptAuthGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white antialiased flex flex-col font-sans">
        <IaptNavbar activeTab="nain" />

        {/* Ambient Glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl" />
          <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <main className="relative z-10 flex-grow">
          {/* Breadcrumb Bar */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <Link
              to="/iapt"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors py-1 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800 backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to IAPT × Unisole Portal</span>
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* HERO SECTION                                                              */}
          {/* ========================================================================= */}
          <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
            <div className="max-w-5xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-6 shadow-sm backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Flagship National Initiative</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white mb-3">
                NAIN
              </h1>

              {/* Subheading */}
              <p className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent mb-2">
                National AI Network of IAPT
              </p>
              <p className="text-sm sm:text-base text-slate-400 font-medium italic mb-8">
                In collaboration with Unisole
              </p>

              {/* Tagline */}
              <div className="relative max-w-2xl mx-auto bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl mb-8">
                <blockquote className="text-lg sm:text-2xl text-white font-medium leading-relaxed">
                  &ldquo;Opening Eyes to the World of{' '}
                  <span className="text-cyan-300 font-bold">AI in physics</span> and{' '}
                  <span className="text-blue-400 font-bold">physics in AI</span>.&rdquo;
                </blockquote>
              </div>

              {/* Mission Statement */}
              <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
                NAIN is envisioned as a national platform connecting the IAPT community with{' '}
                <strong className="text-white font-semibold">Artificial Intelligence, Generative AI, Machine Learning</strong>, and emerging technologies — empowering physicists to lead in the intelligent era.
              </p>

              {/* Quick actions */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#pillars"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-95"
                >
                  <span>Explore the 4 Pillars</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#join-nain"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all"
                >
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <span>Join NAIN Community</span>
                </a>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* WHAT IS NAIN? (FOUR PILLARS)                                              */}
          {/* ========================================================================= */}
          <section id="pillars" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-slate-950/60">
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
                  Foundational Architecture
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                  What is NAIN?
                </h2>
                <p className="text-base sm:text-lg text-slate-300">
                  NAIN operates across four interconnected dimensions designed to transform theoretical physics curiosity into computational mastery.
                </p>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Pillar 1: LEARN */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-blue-500/50 hover:-translate-y-1.5 transition-all duration-300 shadow-xl backdrop-blur-md flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black tracking-widest text-blue-400 font-mono">
                      PILLAR 01
                    </span>
                    <h3 className="text-2xl font-black text-white mt-2 mb-3">
                      LEARN
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Understand foundational and state-of-the-art AI concepts, machine learning algorithms, and prompt engineering tools.
                    </p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-800/80 text-xs font-semibold text-blue-400">
                    Foundational Literacy →
                  </div>
                </div>

                {/* Pillar 2: EXPLORE */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-cyan-500/50 hover:-translate-y-1.5 transition-all duration-300 shadow-xl backdrop-blur-md flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                      <Compass className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black tracking-widest text-cyan-400 font-mono">
                      PILLAR 02
                    </span>
                    <h3 className="text-2xl font-black text-white mt-2 mb-3">
                      EXPLORE
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Discover novel applications of AI across physics, computational mechanics, literature analysis, and classroom pedagogy.
                    </p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-800/80 text-xs font-semibold text-cyan-400">
                    Domain Horizons →
                  </div>
                </div>

                {/* Pillar 3: BUILD */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-indigo-500/50 hover:-translate-y-1.5 transition-all duration-300 shadow-xl backdrop-blur-md flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                      <Hammer className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black tracking-widest text-indigo-400 font-mono">
                      PILLAR 03
                    </span>
                    <h3 className="text-2xl font-black text-white mt-2 mb-3">
                      BUILD
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Create working Python simulations, autonomous physics agents, symbolic mathematics pipelines, and interactive demos.
                    </p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-800/80 text-xs font-semibold text-indigo-400">
                    Tangible Prototypes →
                  </div>
                </div>

                {/* Pillar 4: CONNECT */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-purple-500/50 hover:-translate-y-1.5 transition-all duration-300 shadow-xl backdrop-blur-md flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black tracking-widest text-purple-400 font-mono">
                      PILLAR 04
                    </span>
                    <h3 className="text-2xl font-black text-white mt-2 mb-3">
                      CONNECT
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Become part of a thriving, persistent national network of educators, students, researchers, and scientific innovators.
                    </p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-800/80 text-xs font-semibold text-purple-400">
                    National Collective →
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* WHO CAN JOIN? (FOUR SIMPLE CARDS)                                         */}
          {/* ========================================================================= */}
          <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                  Stakeholders &amp; Audiences
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                  Who Can Join NAIN?
                </h2>
                <p className="text-base sm:text-lg text-slate-300">
                  NAIN offers tailored pathways for every tier of the scientific and educational ecosystem.
                </p>
              </div>

              {/* 4 Audience Cards */}
              <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
                {/* Card 1: Physics Teachers */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-blue-500/40 transition-all shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Physics Teachers &amp; Faculty
                      </h3>
                      <span className="text-xs text-blue-400 font-medium">Higher Education &amp; High School</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Learn how AI can support teaching, assessment, customized question generation, concept visualizations, and institutional professional development.
                  </p>
                </div>

                {/* Card 2: Students */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-cyan-500/40 transition-all shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Students (UG, PG, PhD)
                      </h3>
                      <span className="text-xs text-cyan-400 font-medium">Physics &amp; Allied Sciences</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Develop practical AI coding and prompt skills, build computational physics portfolios, and discover high-demand career and research opportunities.
                  </p>
                </div>

                {/* Card 3: Researchers */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-indigo-500/40 transition-all shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      <Microscope className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Researchers &amp; Scientists
                      </h3>
                      <span className="text-xs text-indigo-400 font-medium">Laboratories &amp; Academia</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Explore AI-assisted research, automated literature review extraction, complex curve fitting, simulation generation, and scientific paper workflows.
                  </p>
                </div>

                {/* Card 4: AI & Tech Enthusiasts */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-purple-500/40 transition-all shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                      <Network className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        AI &amp; Technology Enthusiasts
                      </h3>
                      <span className="text-xs text-purple-400 font-medium">Innovators &amp; Developers</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Connect advanced AI and LLM agentic architectures with pure sciences, scientific computing challenges, and real-world physical systems.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* CROSS-PROMOTION BANNER: 7-DAY WORKSHOP                                   */}
          {/* ========================================================================= */}
          <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border-b border-slate-800/80">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl border border-blue-500/30 bg-slate-900/70 backdrop-blur-xl">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Complementary Program
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Ready for hands-on practice? Explore the 7-Day National Workshop
                </h3>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                  Dive into 14 contact hours covering Prompt Engineering, Symbolic Python Physics, and Autonomous Physics Agents.
                </p>
              </div>

              <Link
                to="/iapt/workshop"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-95"
              >
                <span>Explore 7-Day Workshop</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* JOIN NAIN INTERACTIVE SECTION                                            */}
          {/* ========================================================================= */}
          <section id="join-nain" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
                  National Registry
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                  Register with NAIN
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Join the official network directory to receive research alerts, workshop updates, and national faculty circulars.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <span className="font-semibold">{errorMsg}</span>
                </div>
              )}

              {isLoadingReg ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-xs">Checking your NAIN registration status...</p>
                </div>
              ) : joined && !isEditing ? (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/30 via-slate-900 to-cyan-950/30 border border-blue-500/30 shadow-lg">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 bg-blue-500/20 text-cyan-400 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">
                            Officially Registered with NAIN
                          </h3>
                          <span className="text-xs text-cyan-400 font-mono">
                            ID: {currentReg?.id || 'Active Member'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Update</span>
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <span className="text-[11px] text-slate-500 block mb-0.5">Participant Name</span>
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-400" />
                          {currentReg?.name || currentUser?.name || 'Educator'}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <span className="text-[11px] text-slate-500 block mb-0.5">Mobile Number</span>
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-blue-400" />
                          +91 {currentReg?.phone || currentUser?.phone}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <span className="text-[11px] text-slate-500 block mb-0.5">Category</span>
                        <span className="font-semibold text-white">{currentReg?.category || role}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <span className="text-[11px] text-slate-500 block mb-0.5">Institution / College</span>
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-cyan-400" />
                          {currentReg?.institution || institution}
                        </span>
                      </div>

                      <div className="sm:col-span-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <span className="text-[11px] text-slate-500 block mb-0.5">City / State</span>
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                          {currentReg?.cityState || cityState}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-xs text-slate-400">
                    Your details are verified in the IAPT × UNISOLE National AI Network directory.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleJoin} className="space-y-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Your Category
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option>Physics Teacher / Educator</option>
                      <option>College / University Student</option>
                      <option>Physics Researcher / PostDoc</option>
                      <option>Tech / Industry Professional</option>
                      <option>Institutional Head / Principal</option>
                    </select>
                  </div>

                  {/* Institution & City / State */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Institution / College
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. St. Stephen's / IISc / BHU"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        City / State
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. New Delhi, Delhi / Bangalore, KA"
                        value={cityState}
                        onChange={(e) => setCityState(e.target.value)}
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isRegistering}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/25 transition-all active:scale-98 cursor-pointer disabled:opacity-60"
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving to NAIN Directory...</span>
                        </>
                      ) : (
                        <>
                          <span>{isEditing ? 'Save Updated Details' : 'Confirm NAIN Registration'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-3.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </section>
        </main>

        <IaptFooter />
      </div>
    </IaptAuthGuard>
  );
}
