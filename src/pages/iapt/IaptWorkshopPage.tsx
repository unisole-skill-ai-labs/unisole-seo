import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IaptNavbar from '../../components/iapt/IaptNavbar';
import IaptFooter from '../../components/iapt/IaptFooter';
import IaptAuthGuard from '../../components/iapt/IaptAuthGuard';
import { getUser } from '../../utils/auth';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Calendar,
  Award,
  Target,
  BookOpen,
  FileCheck,
  CheckCircle2,
  Package,
  Clock,
  Code2,
  Cpu,
  GraduationCap,
  Download,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function IaptWorkshopPage() {
  const currentUser = getUser();
  const [activeDay, setActiveDay] = useState<number | null>(null);

  useEffect(() => {
    document.title = '7-Day National Workshop: AI for Physics | IAPT × UNISOLE';
  }, []);

  const curriculumDays = [
    {
      day: 1,
      title: 'Prompt Engineering for Physics',
      tag: 'Fundamentals & Persona Design',
      outcomes: [
        "Evaluate an LLM's suitability for specific physics tasks (explaining, deriving, simulating, or analyzing data)",
        'Construct effective prompts using role, context, constraint, and chain-of-thought techniques for physics',
      ],
      deliverable: 'Personal "Physics Explainer" Prompt Template',
      session: 'LLM failure modes; fundamentals; persona design; context priming.',
      handsOn: 'Prompting the same physics concept 5 ways; ranking and evaluating outputs.',
      accent: 'border-l-blue-600',
    },
    {
      day: 2,
      title: 'AI as Literature & Math Assistant',
      tag: 'Research Efficiency',
      outcomes: [
        'Apply AI tools to convert physics papers into structured summaries, derivations, and LaTeX documents',
        'Validate AI-generated math and formula reductions against peer-reviewed sources',
      ],
      deliverable: '"AI Research Assistant" Workflow Checklist',
      session: 'Paper summarization; LaTeX conversion; equation extraction and verification.',
      handsOn: 'ArXiv extraction → "Explain like Feynman" challenge using Claude and GPT-4o.',
      accent: 'border-l-blue-500',
    },
    {
      day: 3,
      title: 'AI + Symbolic Computation',
      tag: 'Symbolic Physics',
      outcomes: [
        'Direct AI to set up analytical physics problems in Python (SymPy, NumPy)',
        'Debug AI-generated computational scripts and verify symbolic solutions',
      ],
      deliverable: '"AI Co-Pilot for Problem Sets" Notebook',
      session: 'Classical mechanics and quantum setups; SymPy integration; setup vs solve philosophy.',
      handsOn: 'Hydrogen wavefunctions SymPy closed-form solution and orbital plotting.',
      accent: 'border-l-blue-400',
    },
    {
      day: 4,
      title: 'AI for Simulation & Data Analysis',
      tag: 'Experimental & Numerical',
      outcomes: [
        'Generate ODE/PDE/Monte Carlo physics simulation code with AI co-pilots',
        'Execute AI-assisted curve fitting, residual calculation, and experimental error analysis',
      ],
      deliverable: '"AI as Lab Assistant" Template Pair',
      session: 'Simulation code generation; experimental dataset analysis; error bar synthesis.',
      handsOn: 'Double pendulum chaotic animation; Lorentzian & Gaussian spectral curve fitting.',
      accent: 'border-l-cyan-500',
    },
    {
      day: 5,
      title: 'Introduction to AI Agents',
      tag: 'Agentic Frameworks',
      outcomes: [
        'Explain the Agent = LLM + Tools + Memory + Planning paradigm for physical sciences',
        'Decompose complex multi-step physics tasks into discrete, autonomous agent steps',
      ],
      deliverable: 'Task-Decomposition Worksheet & Architecture Plan',
      session: 'Tools, memory, planning; CrewAI, LangChain, and agentic loop architectures.',
      handsOn: 'Build a "Literature Review Agent" that executes ArXiv search and comparative summary.',
      accent: 'border-l-indigo-500',
    },
    {
      day: 6,
      title: 'Physics-Specific Agents',
      tag: 'Custom Tools',
      outcomes: [
        'Build subfield-specific agents combining search, SymPy, and Python execution',
        'Integrate agentic systems with plotting tools to auto-generate publication figures',
      ],
      deliverable: 'Working Subfield-Specific Autonomous Agent',
      session: 'Case studies: Paper Replicator Agent, Teaching Assistant Agent, Experimental Data Agent.',
      handsOn: 'Build a "Concept Explainer Agent" (e.g. Graphene Band Structure or Ising Model).',
      accent: 'border-l-purple-500',
    },
    {
      day: 7,
      title: 'Capstone: From Prompt to Impact',
      tag: 'Validation & Demos',
      outcomes: [
        'Critically validate AI outputs for scientific hallucination, dimensional consistency, and validity',
        'Present an autonomous agent pipeline solving a real physics pedagogy or research task',
      ],
      deliverable: 'Physics AI Toolkit & Capstone Demo Portfolio',
      session: 'Academic ethics; RAG vs Fine-tuning; Outlook on AI + Quantum & Physics-Informed NNs (PINNs).',
      handsOn: 'Capstone Demos: Participant live showcase — "My AI Agent for Physics".',
      accent: 'border-l-amber-500',
    },
  ];

  return (
    <IaptAuthGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white antialiased flex flex-col font-sans">
        <IaptNavbar activeTab="workshop" />

        {/* Ambient Glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-cyan-600/15 via-blue-600/10 to-transparent blur-3xl" />
          <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-6 shadow-sm backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>IAPT × UNISOLE Co-Branded Program</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4">
                National Workshop on <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  AI in Physics
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
                A 7-Day National Learning Experience designed for professional educators, researchers, and students to master the intersection of Large Language Models and Physical Sciences.
              </p>

              {/* Key Features Pill Bar */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-200 backdrop-blur-md">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>7 Days (14 Contact Hours)</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-200 backdrop-blur-md">
                  <Award className="w-4 h-4 text-cyan-400" />
                  <span>UGC MMTTC Complementary</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-200 backdrop-blur-md">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>Hands-on Python &amp; Colab</span>
                </div>
              </div>

              {/* Direct Anchor Action */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#curriculum"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 transition-all active:scale-95"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>View 7-Day Curriculum</span>
                </a>

                <a
                  href="#credentials"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all"
                >
                  <Award className="w-4 h-4 text-cyan-400" />
                  <span>Certification Details</span>
                </a>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* PROGRAM LEARNING OUTCOMES                                                 */}
          {/* ========================================================================= */}
          <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-slate-950/60">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Program Learning Outcomes
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Assessable competencies acquired across the 7 workshop modules
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    num: '01',
                    title: 'Evaluate',
                    desc: "Evaluate an LLM's suitability for specific physics tasks (explaining, deriving, simulating, or analyzing data).",
                  },
                  {
                    num: '02',
                    title: 'Construct',
                    desc: 'Construct effective prompts using role, context, constraint, and chain-of-thought techniques for physics.',
                  },
                  {
                    num: '03',
                    title: 'Apply',
                    desc: 'Apply AI tools to convert physics papers into structured summaries, derivations, and LaTeX documents.',
                  },
                  {
                    num: '04',
                    title: 'Build',
                    desc: 'Build working simulation and data-analysis code using AI-assisted Python (SymPy, NumPy, Matplotlib).',
                  },
                  {
                    num: '05',
                    title: 'Design',
                    desc: 'Design simple autonomous agents (tools + memory + planning) for physics-specific workflows.',
                  },
                  {
                    num: '06',
                    title: 'Critically Assess',
                    desc: 'Critically assess AI-generated physics output for hallucination, unit errors, and scientific validity.',
                  },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg backdrop-blur-md hover:border-cyan-500/40 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-black text-xs font-mono mb-4 group-hover:bg-cyan-500/20 transition-colors">
                      {item.num}
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 7-DAY CURRICULUM SECTION                                                  */}
          {/* ========================================================================= */}
          <section id="curriculum" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between gap-4 mb-12 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      7-Day Intensive Curriculum
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Detailed session breakdown, hands-on challenges, and key deliverables
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                  14 Total Contact Hours
                </span>
              </div>

              {/* Day Cards */}
              <div className="space-y-6">
                {curriculumDays.map((item) => {
                  const isExpanded = activeDay === item.day;

                  return (
                    <div
                      key={item.day}
                      className={`bg-slate-900/80 rounded-3xl overflow-hidden shadow-xl border border-slate-800 border-l-8 ${item.accent} backdrop-blur-xl transition-all duration-200`}
                    >
                      <div className="p-6 sm:p-8">
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                          <div>
                            <span className="text-xs font-black tracking-widest uppercase font-mono text-cyan-400">
                              Day 0{item.day}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                              {item.title}
                            </h3>
                          </div>
                          <div className="bg-slate-800/80 text-cyan-300 border border-slate-700/80 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                            Focus: {item.tag}
                          </div>
                        </div>

                        {/* Outcomes and Deliverable */}
                        <div className="grid md:grid-cols-2 gap-6 pt-2">
                          <div>
                            <h4 className="font-semibold text-slate-400 uppercase text-[11px] tracking-wider mb-2">
                              Learning Outcomes
                            </h4>
                            <ul className="space-y-1.5 text-slate-300 text-xs sm:text-sm">
                              {item.outcomes.map((o, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-cyan-400 font-bold">•</span>
                                  <span>{o}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-slate-400 uppercase text-[11px] tracking-wider mb-2">
                              Key Deliverable
                            </h4>
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-200 font-medium">
                              <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>{item.deliverable}</span>
                            </div>
                          </div>
                        </div>

                        {/* Session Breakdown Bars */}
                        <div className="mt-6 pt-6 border-t border-slate-800/80 grid md:grid-cols-2 gap-4">
                          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-[11px] text-cyan-400 uppercase tracking-wider">
                                THEORY &amp; WALKTHROUGH
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">75 MIN</span>
                            </div>
                            <p className="text-xs text-slate-300 italic">{item.session}</p>
                          </div>

                          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-[11px] text-blue-400 uppercase tracking-wider">
                                HANDS-ON CHALLENGE
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">30 MIN</span>
                            </div>
                            <p className="text-xs text-slate-300 italic">{item.handsOn}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* CERTIFICATION & MATERIALS PACKAGE                                         */}
          {/* ========================================================================= */}
          <section id="credentials" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-slate-950/60">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Card 1: Certification */}
              <div className="bg-gradient-to-br from-blue-900/60 via-slate-900 to-indigo-950/70 border border-blue-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 mb-6">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">
                    Certification &amp; Credentialing
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    This workshop provides a <strong className="text-white font-semibold">CV-worthy academic credential</strong> validating assessable outcomes in AI-driven physics education.
                  </p>

                  <ul className="space-y-4 text-xs sm:text-sm text-slate-200">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">IAPT-UNISOLE Co-Branded Certificate:</strong> Verified digital credential listing specific assessable outcomes for academic promotions.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">Daily 1-Prompt Challenge:</strong> Ensures continuous hands-on assessment and measurable skill growth.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">Day 7 Capstone Project:</strong> Summative project presentation building an autonomous physics tool.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Recognized across participating universities</span>
                  <span className="text-cyan-400 font-semibold">Verified via QR</span>
                </div>
              </div>

              {/* Card 2: Materials Package */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                    <Package className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">
                    Materials Package
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    Participants receive a comprehensive professional toolkit to accelerate their AI journey after the workshop:
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                      <span className="font-black text-cyan-400 block text-3xl font-mono">50+</span>
                      <span className="text-xs text-slate-400 font-medium">Prompt Templates for Physics</span>
                    </div>
                    <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                      <span className="font-black text-blue-400 block text-3xl font-mono">Colab</span>
                      <span className="text-xs text-slate-400 font-medium">Pre-loaded Python Notebooks</span>
                    </div>
                    <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                      <span className="font-black text-indigo-400 block text-3xl font-mono">3</span>
                      <span className="text-xs text-slate-400 font-medium">Sample Physics Papers</span>
                    </div>
                    <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                      <span className="font-black text-purple-400 block text-3xl font-mono">2</span>
                      <span className="text-xs text-slate-400 font-medium">Exp. CSV Physics Datasets</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Full lifetime access to materials</span>
                  <span className="text-blue-400 font-semibold">Ready for Classroom</span>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* INSTITUTIONAL POSITIONING                                                 */}
          {/* ========================================================================= */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
            <div className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 text-center shadow-xl backdrop-blur-xl">
              <h4 className="text-white font-bold text-lg mb-3">
                Institutional Positioning &amp; Replication
              </h4>
              <p className="max-w-3xl mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Positioned explicitly as an intensive add-on module complementing standard UGC MMTTC Faculty Development Program (FDP) structures. Designed to facilitate replication at the institutional level, empowering professors to lead AI adoption in their own colleges and departments.
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-300">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>Colleges can invite IAPT-UNISOLE master trainers for on-campus cohorts</span>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* CROSS-PROMOTION BANNER: NAIN                                             */}
          {/* ========================================================================= */}
          <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-950/50 via-slate-900 to-indigo-950/50">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl border border-cyan-500/30 bg-slate-900/70 backdrop-blur-xl">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Permanent Network
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Join the National AI Network of IAPT (NAIN)
                </h3>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                  Stay connected beyond the 7 days with continuous peer learning, webinars, and open physics-AI code repositories.
                </p>
              </div>

              <Link
                to="/iapt/nain"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 transition-all active:scale-95"
              >
                <span>Explore NAIN Initiative</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </main>

        <IaptFooter />
      </div>
    </IaptAuthGuard>
  );
}
