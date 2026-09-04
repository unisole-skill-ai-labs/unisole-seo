import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IaptNavbar from '../../components/iapt/IaptNavbar';
import IaptFooter from '../../components/iapt/IaptFooter';
import IaptAuthGuard from '../../components/iapt/IaptAuthGuard';
import { getUser } from '../../utils/auth';
import {
  Sparkles,
  ArrowRight,
  Atom,
  Cpu,
  Compass,
  CheckCircle2,
  Users,
  Lightbulb,
  GraduationCap,
  Network,
  Calendar,
  Award,
  BookOpen,
  Layers,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export default function IaptHomePage() {
  const currentUser = getUser();

  useEffect(() => {
    document.title = 'IAPT × UNISOLE — Bridging Physics & Artificial Intelligence';
  }, []);

  return (
    <IaptAuthGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white antialiased flex flex-col font-sans">
        <IaptNavbar activeTab="home" />

        {/* Ambient Glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl" />
          <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-40 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <main className="relative z-10 flex-grow">
          {/* ========================================================================= */}
          {/* PAGE 1: HERO SECTION                                                      */}
          {/* ========================================================================= */}
          <section className="relative pt-20 pb-24 sm:pt-28 sm:pb-32 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 overflow-hidden">
            <div className="max-w-5xl mx-auto text-center">
              {/* Small top label */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-8 shadow-sm backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>IAPT × UNISOLE</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
                Bridging Physics &amp; <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  Artificial Intelligence
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-2xl font-medium text-slate-300 mb-8 max-w-3xl mx-auto tracking-tight">
                Official Academic &amp; Innovation Partnership
              </p>

              {/* Quote box */}
              <div className="relative max-w-3xl mx-auto bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl mb-10 text-left sm:text-center">
                <div className="absolute -top-3.5 left-8 px-3 py-0.5 rounded-md bg-blue-600 text-[11px] font-bold uppercase tracking-wider text-white">
                  MoU Charter
                </div>
                <blockquote className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed italic">
                  &ldquo;The Indian Association of Physics Teachers (IAPT) and Unisole are working together to build awareness, skills and opportunities at the intersection of{' '}
                  <span className="text-cyan-300 font-semibold not-italic">
                    Physics, Artificial Intelligence and Emerging Technologies.
                  </span>&rdquo;
                </blockquote>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#programs"
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 transition-all duration-200 active:scale-95"
                >
                  <span>Explore Our Programs</span>
                  <ArrowRight className="w-5 h-5" />
                </a>

                <Link
                  to="/iapt/nain"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 hover:text-white font-semibold text-base border border-slate-700/80 transition-all duration-200 backdrop-blur-md"
                >
                  <Network className="w-4 h-4 text-cyan-400" />
                  <span>Join NAIN Initiative</span>
                </Link>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* PARTNERSHIP SECTION: A Partnership for the Future of Physics              */}
          {/* ========================================================================= */}
          <section id="partnership" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-slate-950/60">
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
                  Institutional Synergies
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
                  A Partnership for the Future of Physics
                </h2>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                  IAPT and Unisole have entered into an official{' '}
                  <span className="text-white font-semibold underline decoration-blue-500 underline-offset-4">
                    Memorandum of Understanding (MoU)
                  </span>{' '}
                  to collaborate on education, awareness, skill development and emerging technology initiatives.
                </p>
              </div>

              {/* Two complementary strengths cards */}
              <div className="grid md:grid-cols-2 gap-8 items-stretch relative">
                {/* IAPT Strength Card */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between group hover:border-blue-500/40 transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Atom className="w-7 h-7" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
                        Academic Authority
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-white mb-1">
                      IAPT
                    </h3>
                    <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-6">
                      Scientific Community &amp; Physics Education
                    </p>

                    <ul className="space-y-4 text-slate-300 text-sm">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <span>Network of physics teachers, professors, and educators nationwide</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <span>Academic and scientific outreach across colleges and universities</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <span>Physics education, experimental design, and professional development</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <span>National-level community engagement and competitive scientific Olympiads</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Unisole Strength Card */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500" />
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Cpu className="w-7 h-7" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
                        Technology Pioneer
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-white mb-1">
                      UNISOLE
                    </h3>
                    <p className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-6">
                      AI, Technology &amp; Skill Development
                    </p>

                    <ul className="space-y-4 text-slate-300 text-sm">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>Artificial Intelligence, Large Language Models &amp; Machine Learning</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>Generative AI, Agentic Systems, and automated scientific workflows</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>Industry-oriented hands-on technology education and modern curriculum</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>Practical computational projects, labs, and innovation sandboxes</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Strong Statement Callout */}
              <div className="mt-12 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/60 border border-blue-500/30 rounded-3xl p-8 sm:p-10 text-center shadow-xl backdrop-blur-md">
                <p className="text-lg sm:text-xl md:text-2xl text-white font-medium max-w-4xl mx-auto leading-relaxed">
                  &ldquo;Together, we aim to help the physics community understand not only what AI is, but{' '}
                  <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent font-bold">
                    how AI can become a powerful tool for learning, teaching, research and innovation.
                  </span>&rdquo;
                </p>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* OUR VISION SECTION: Opening New Eyes to the World of AI                    */}
          {/* ========================================================================= */}
          <section id="vision" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
                  Transformative Vision
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
                  Opening New Eyes to the World of AI
                </h2>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-4">
                  Artificial Intelligence is changing how we learn, research, work and solve problems.
                </p>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  Our vision is to ensure that students, teachers and researchers are not merely{' '}
                  <strong className="text-slate-200">users of AI</strong>, but become{' '}
                  <strong className="text-cyan-300">informed creators, critical thinkers and innovators</strong>{' '}
                  who understand how AI can be applied meaningfully to their fields.
                </p>
              </div>

              {/* 5 Pillars Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                {/* Pillar 01 */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-black tracking-widest text-blue-400 font-mono">
                      01
                    </span>
                    <h3 className="text-base font-bold text-white mt-3 mb-2">
                      Create Awareness
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Introduce educators and learners to the rapidly evolving AI ecosystem and foundational models.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800/60 text-[11px] font-semibold text-blue-400">
                    Ecosystem Literacy
                  </div>
                </div>

                {/* Pillar 02 */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-black tracking-widest text-blue-400 font-mono">
                      02
                    </span>
                    <h3 className="text-base font-bold text-white mt-3 mb-2">
                      Build Skills
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Move beyond theoretical awareness toward practical, executable AI capabilities and code.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800/60 text-[11px] font-semibold text-cyan-400">
                    Hands-on Mastery
                  </div>
                </div>

                {/* Pillar 03 */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-black tracking-widest text-blue-400 font-mono">
                      03
                    </span>
                    <h3 className="text-base font-bold text-white mt-3 mb-2">
                      Connect with Physics
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Explore how AI supports physics education, computational modelling, simulations and research.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800/60 text-[11px] font-semibold text-indigo-400">
                    Domain Synergy
                  </div>
                </div>

                {/* Pillar 04 */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-black tracking-widest text-blue-400 font-mono">
                      04
                    </span>
                    <h3 className="text-base font-bold text-white mt-3 mb-2">
                      National Community
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Create a persistent national network of educators, students, researchers and technologists.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800/60 text-[11px] font-semibold text-cyan-400">
                    Collaborative Scale
                  </div>
                </div>

                {/* Pillar 05 */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-black tracking-widest text-blue-400 font-mono">
                      05
                    </span>
                    <h3 className="text-base font-bold text-white mt-3 mb-2">
                      Encourage Innovation
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Enable participants to transform ideas into projects, published papers and real-world tools.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800/60 text-[11px] font-semibold text-amber-400">
                    Applied Impact
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* OUR PROGRAMS SECTION: Two Programs. One Vision.                           */}
          {/* ========================================================================= */}
          <section id="programs" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-slate-950/40">
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                  Core Offerings
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                  Two Programs. One Vision.
                </h2>
                <p className="text-base sm:text-lg text-slate-300">
                  Select an initiative below to explore in-depth curriculums, network resources, and participation pathways.
                </p>
              </div>

              {/* Two Large Cards */}
              <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
                {/* PROGRAM 01: NAIN CARD */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl flex flex-col justify-between relative group hover:border-blue-500/50 hover:shadow-blue-500/10 transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                        PROGRAM 01
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        National Network
                      </span>
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">
                      NAIN
                    </h3>
                    <p className="text-sm font-semibold text-blue-300 mb-1">
                      National AI Network of IAPT
                    </p>
                    <p className="text-xs text-slate-400 italic mb-6">
                      In collaboration with Unisole
                    </p>

                    {/* Short description quote */}
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 mb-6">
                      <p className="text-sm text-slate-200 leading-relaxed">
                        &ldquo;NAIN is a national AI awareness and learning network designed to connect the IAPT community with the rapidly evolving world of Artificial Intelligence.&rdquo;
                      </p>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-6">
                      The idea is not simply to conduct another AI course. NAIN becomes a{' '}
                      <strong className="text-slate-200">community and continuous-learning ecosystem</strong>{' '}
                      where teachers, students, researchers and educators can discover how AI is transforming education, physics and scientific research.
                    </p>

                    {/* Focus points pills */}
                    <div className="mb-8">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                        NAIN Focus Areas:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'AI Awareness',
                          'AI Literacy',
                          'Generative AI',
                          'AI for Education',
                          'AI for Physics',
                          'AI for Research',
                          'Hands-on Workshops',
                          'Community Learning',
                          'Emerging AI Tech',
                          'Innovation & Projects',
                        ].map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/iapt/nain"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-98 group-hover:gap-3"
                  >
                    <span>Explore NAIN</span>
                    <ArrowRight className="w-4 h-4 transition-transform" />
                  </Link>
                </div>

                {/* PROGRAM 02: 7-DAY WORKSHOP CARD */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl flex flex-col justify-between relative group hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                        PROGRAM 02
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Intensive Workshop
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                      National Workshop on AI in Physics
                    </h3>
                    <p className="text-sm font-semibold text-cyan-300 mb-1">
                      A 7-Day National Learning Experience
                    </p>
                    <p className="text-xs text-slate-400 italic mb-6">
                      Organised under the IAPT × Unisole initiative
                    </p>

                    {/* Short description quote */}
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 mb-6">
                      <p className="text-sm text-slate-200 leading-relaxed">
                        &ldquo;A seven-day national workshop designed to introduce participants to the fundamentals of Artificial Intelligence and demonstrate how AI can be applied to Physics, scientific computing, education and research.&rdquo;
                      </p>
                    </div>

                    {/* Highlights stats */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                        <div className="text-cyan-400 font-bold text-base flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>7 Days</span>
                        </div>
                        <span className="text-[11px] text-slate-400">14 Contact Hours</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                        <div className="text-cyan-400 font-bold text-base flex items-center gap-1.5">
                          <Award className="w-4 h-4" />
                          <span>Co-Branded</span>
                        </div>
                        <span className="text-[11px] text-slate-400">CV-Worthy Credential</span>
                      </div>
                    </div>

                    {/* Curriculum features list */}
                    <div className="mb-8 space-y-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>Prompt Engineering &amp; Persona Design for Physics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>Symbolic Physics &amp; Python / SymPy Integrations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>Autonomous Agents (CrewAI, LangChain, Research Bots)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>50+ Templates &amp; Pre-loaded Google Colab Notebooks</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/iapt/workshop"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 transition-all active:scale-98 group-hover:gap-3"
                  >
                    <span>Explore the 7-Day Workshop</span>
                    <ArrowRight className="w-4 h-4 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <IaptFooter />
      </div>
    </IaptAuthGuard>
  );
}
