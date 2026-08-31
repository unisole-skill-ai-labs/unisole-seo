import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isAuthenticated, getUser, logout } from '../utils/auth';
import {
  Target,
  BookOpen,
  Calendar,
  Award,
  FileCheck,
  CheckCircle2,
  Package,
  LogOut,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';

export default function IaptPage() {
  const navigate = useNavigate();
  const auth = isAuthenticated();
  const currentUser = getUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/iapt/login', { replace: true });
    }
  }, [navigate]);

  if (!auth) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/iapt/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Banner / User Navigation Bar */}
      <div className="bg-slate-900 text-slate-300 border-b border-slate-800 text-xs py-2.5 px-4 sticky top-0 z-40 backdrop-blur-md bg-slate-900/95">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
              <Sparkles className="w-3 h-3 text-blue-400" />
              IAPT-UNISOLE Portal
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300">
              National Level Workshop: AI for Physics
            </span>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="text-slate-300">
                Logged in as <span className="font-semibold text-white">{currentUser.name || currentUser.phone}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors py-1 px-2 rounded hover:bg-white/5 cursor-pointer"
              title="Logout from IAPT session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Header / Hero Section */}
      <header className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white py-16 md:py-20 px-4 shadow-xl">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block px-4 py-1 mb-4 text-xs md:text-sm font-semibold tracking-wider uppercase bg-blue-500/30 border border-blue-400/50 rounded-full">
            IAPT-UNISOLE Co-Branded Program
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            National Level Workshop on <br />
            <span className="text-blue-200">AI for Physics</span>
          </h1>
          <p className="text-lg md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 font-light leading-relaxed">
            An intensive 7-day module designed for professional educators and researchers to master the intersection of Large Language Models and Physical Sciences.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-xl border border-white/20 text-sm font-medium shadow-sm backdrop-blur-sm">
              <Calendar className="w-4 h-4 mr-2 text-blue-300" />
              <span>7 Days (14 Contact Hours)</span>
            </div>
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-xl border border-white/20 text-sm font-medium shadow-sm backdrop-blur-sm">
              <Award className="w-4 h-4 mr-2 text-blue-300" />
              <span>UGC MMTTC Complementary</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16">
        
        {/* Program Learning Outcomes */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Program Learning Outcomes</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Outcome 1 */}
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 font-bold text-sm">1</div>
              <p className="text-slate-700 text-sm leading-relaxed">
                <strong>Evaluate</strong> an LLM's suitability for specific physics tasks (explaining, deriving, simulating, or analyzing data).
              </p>
            </div>
            {/* Outcome 2 */}
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 font-bold text-sm">2</div>
              <p className="text-slate-700 text-sm leading-relaxed">
                <strong>Construct</strong> effective prompts using role, context, constraint, and chain-of-thought techniques for physics.
              </p>
            </div>
            {/* Outcome 3 */}
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 font-bold text-sm">3</div>
              <p className="text-slate-700 text-sm leading-relaxed">
                <strong>Apply</strong> AI tools to convert physics papers into structured summaries, derivations, and LaTeX documents.
              </p>
            </div>
            {/* Outcome 4 */}
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 font-bold text-sm">4</div>
              <p className="text-slate-700 text-sm leading-relaxed">
                <strong>Build</strong> working simulation and data-analysis code using AI-assisted Python (SymPy, NumPy, Matplotlib).
              </p>
            </div>
            {/* Outcome 5 */}
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 font-bold text-sm">5</div>
              <p className="text-slate-700 text-sm leading-relaxed">
                <strong>Design</strong> simple autonomous agents (tools + memory + planning) for physics-specific workflows.
              </p>
            </div>
            {/* Outcome 6 */}
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 font-bold text-sm">6</div>
              <p className="text-slate-700 text-sm leading-relaxed">
                <strong>Critically assess</strong> AI-generated physics output for hallucination, unit errors, and scientific validity.
              </p>
            </div>
          </div>
        </section>

        {/* 7-Day Curriculum */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">7-Day Intensive Curriculum</h2>
          </div>
          
          <div className="space-y-8">
            {/* Day 1 */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 border-l-8 border-l-blue-600 hover:-translate-y-1 transition-transform duration-200">
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <span className="text-blue-600 font-bold tracking-widest uppercase text-xs">Day 01</span>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1 text-slate-900">Prompt Engineering for Physics</h3>
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                    Focus: Fundamentals & Persona Design
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <h4 className="font-semibold text-slate-400 uppercase text-xs tracking-wider mb-2">Learning Outcomes</h4>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-700 text-sm">
                      <li>Distinguish LLM reliability in physics contexts</li>
                      <li>Construct role/context/constraint prompts</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-400 uppercase text-xs tracking-wider mb-2">Key Deliverable</h4>
                    <div className="flex items-center gap-2 text-slate-800 text-sm font-medium">
                      <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Personal "Physics Explainer" Prompt Template</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100 grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="block font-bold text-xs text-blue-600 mb-1">SESSION (75 MIN)</span>
                    <p className="text-sm text-slate-600 italic">LLM failure modes; fundamentals; persona design.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="block font-bold text-xs text-blue-600 mb-1">HANDS-ON (30 MIN)</span>
                    <p className="text-sm text-slate-600 italic">Prompting the same concept 5 ways; ranking outputs.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Day 2 */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 border-l-8 border-l-blue-500 hover:-translate-y-1 transition-transform duration-200">
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <span className="text-blue-500 font-bold tracking-widest uppercase text-xs">Day 02</span>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1 text-slate-900">AI as Literature & Math Assistant</h3>
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                    Focus: Research Efficiency
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <h4 className="font-semibold text-slate-400 uppercase text-xs tracking-wider mb-2">Learning Outcomes</h4>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-700 text-sm">
                      <li>Extract results and derivations from papers</li>
                      <li>Validate AI-generated math against sources</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-400 uppercase text-xs tracking-wider mb-2">Key Deliverable</h4>
                    <div className="flex items-center gap-2 text-slate-800 text-sm font-medium">
                      <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>"AI Research Assistant" Workflow Checklist</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100 grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="block font-bold text-xs text-blue-500 mb-1">SESSION (75 MIN)</span>
                    <p className="text-sm text-slate-600 italic">Paper summarization; LaTeX conversion; derivations.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="block font-bold text-xs text-blue-500 mb-1">HANDS-ON (30 MIN)</span>
                    <p className="text-sm text-slate-600 italic">ArXiv extraction → "Explain like Feynman" challenge.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Day 3 */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 border-l-8 border-l-blue-400 hover:-translate-y-1 transition-transform duration-200">
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <span className="text-blue-400 font-bold tracking-widest uppercase text-xs">Day 03</span>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1 text-slate-900">AI + Symbolic Computation</h3>
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                    Focus: Symbolic Physics
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <h4 className="font-semibold text-slate-400 uppercase text-xs tracking-wider mb-2">Learning Outcomes</h4>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-700 text-sm">
                      <li>Direct AI to set up physics in Python/SymPy</li>
                      <li>Debug AI-generated computational code</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-400 uppercase text-xs tracking-wider mb-2">Key Deliverable</h4>
                    <div className="flex items-center gap-2 text-slate-800 text-sm font-medium">
                      <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>"AI Co-Pilot for Problem Sets" Notebook</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100 grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="block font-bold text-xs text-blue-400 mb-1">SESSION (75 MIN)</span>
                    <p className="text-sm text-slate-600 italic">Mechanics/QM setup; SymPy integration; setup vs solve.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="block font-bold text-xs text-blue-400 mb-1">HANDS-ON (30 MIN)</span>
                    <p className="text-sm text-slate-600 italic">Hydrogen wavefunctions SymPy solution & plotting.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Day 4 */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 border-l-8 border-l-cyan-500 hover:-translate-y-1 transition-transform duration-200">
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <span className="text-cyan-500 font-bold tracking-widest uppercase text-xs">Day 04</span>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1 text-slate-900">AI for Simulation & Data Analysis</h3>
                  </div>
                  <div className="bg-cyan-50 text-cyan-700 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                    Focus: Experimental & Numerical
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <h4 className="font-semibold text-slate-400 uppercase text-xs tracking-wider mb-2">Learning Outcomes</h4>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-700 text-sm">
                      <li>Generate ODE/PDE/Monte Carlo simulation code</li>
                      <li>AI-assisted curve fitting and error analysis</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-400 uppercase text-xs tracking-wider mb-2">Key Deliverable</h4>
                    <div className="flex items-center gap-2 text-slate-800 text-sm font-medium">
                      <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>"AI as Lab Assistant" Template Pair</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100 grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="block font-bold text-xs text-cyan-600 mb-1">SESSION (75 MIN)</span>
                    <p className="text-sm text-slate-600 italic">Simulation code generation; data analysis; error bars.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="block font-bold text-xs text-cyan-600 mb-1">HANDS-ON (30 MIN)</span>
                    <p className="text-sm text-slate-600 italic">Double pendulum animation; Lorentzian curve fitting.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Day 5 */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 border-l-8 border-l-indigo-500 hover:-translate-y-1 transition-transform duration-200">
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <span className="text-indigo-500 font-bold tracking-widest uppercase text-xs">Day 05</span>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1 text-slate-900">Introduction to AI Agents</h3>
                  </div>
                  <div className="bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                    Focus: Agentic Frameworks
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <h4 className="font-semibold text-slate-400 uppercase text-xs tracking-wider mb-2">Learning Outcomes</h4>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-700 text-sm">
                      <li>Explain the Agent = LLM + Tools + Goal framework</li>
                      <li>Decompose physics tasks into discrete steps</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-400 uppercase text-xs tracking-wider mb-2">Key Deliverable</h4>
                    <div className="flex items-center gap-2 text-slate-800 text-sm font-medium">
                      <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Task-Decomposition Worksheet</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100 grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="block font-bold text-xs text-indigo-600 mb-1">SESSION (75 MIN)</span>
                    <p className="text-sm text-slate-600 italic">Tools, memory, planning; CrewAI/LangChain overview.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="block font-bold text-xs text-indigo-600 mb-1">HANDS-ON (30 MIN)</span>
                    <p className="text-sm text-slate-600 italic">Build a "Literature Review Agent" (Search + Summary).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Day 6 */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 border-l-8 border-l-purple-500 hover:-translate-y-1 transition-transform duration-200">
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <span className="text-purple-500 font-bold tracking-widest uppercase text-xs">Day 06</span>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1 text-slate-900">Physics-Specific Agents</h3>
                  </div>
                  <div className="bg-purple-50 text-purple-700 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                    Focus: Custom Tools
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <h4 className="font-semibold text-slate-400 uppercase text-xs tracking-wider mb-2">Learning Outcomes</h4>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-700 text-sm">
                      <li>Build subfield-specific agents (Search + Code)</li>
                      <li>Integrate agents with SymPy/Matplotlib tools</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-400 uppercase text-xs tracking-wider mb-2">Key Deliverable</h4>
                    <div className="flex items-center gap-2 text-slate-800 text-sm font-medium">
                      <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Working Subfield-Specific Agent</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100 grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="block font-bold text-xs text-purple-600 mb-1">SESSION (75 MIN)</span>
                    <p className="text-sm text-slate-600 italic">Case studies: Paper Replicator, TA Agent, Data Agent.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="block font-bold text-xs text-purple-600 mb-1">HANDS-ON (30 MIN)</span>
                    <p className="text-sm text-slate-600 italic">Build a "Concept Explainer Agent" (e.g. Graphene Band Structure).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Day 7 */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 border-l-8 border-l-amber-500 hover:-translate-y-1 transition-transform duration-200">
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <span className="text-amber-500 font-bold tracking-widest uppercase text-xs">Day 07</span>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1 text-slate-900">Capstone: From Prompt to Impact</h3>
                  </div>
                  <div className="bg-amber-50 text-amber-700 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                    Focus: Validation & Demos
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <h4 className="font-semibold text-slate-400 uppercase text-xs tracking-wider mb-2">Learning Outcomes</h4>
                    <ul className="list-disc list-inside space-y-1.5 text-slate-700 text-sm">
                      <li>Critically validate AI output for hallucinations</li>
                      <li>Present an autonomous agent solving real tasks</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-400 uppercase text-xs tracking-wider mb-2">Key Deliverable</h4>
                    <div className="flex items-center gap-2 text-slate-800 text-sm font-medium">
                      <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Physics AI Toolkit & Capstone Demo</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100 grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="block font-bold text-xs text-amber-600 mb-1">SESSION (75 MIN)</span>
                    <p className="text-sm text-slate-600 italic">Ethics; RAG vs Fine-tuning; AI + Quantum outlook.</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="block font-bold text-xs text-amber-600 mb-1">HANDS-ON (30 MIN)</span>
                    <p className="text-sm text-slate-600 italic">Capstone Demos: "My agent does X for my research".</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final Outcomes & Credentialing */}
        <section className="grid md:grid-cols-2 gap-8 md:gap-12 mb-20">
          <div className="p-8 rounded-3xl shadow-lg bg-gradient-to-br from-blue-700 to-blue-900 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2.5">
                <Award className="w-6 h-6 text-blue-300" />
                Certification & Credentialing
              </h3>
              <p className="mb-6 text-blue-100 text-sm leading-relaxed">
                This workshop provides a <strong className="text-white font-semibold">CV-worthy credential</strong> for academic and career advancement.
              </p>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
                  <span><strong className="text-white font-semibold">IAPT-UNISOLE Co-Branded Certificate</strong> listing specific assessable outcomes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
                  <span><strong className="text-white font-semibold">Daily 1-Prompt Challenge</strong> ensures continuous hands-on assessment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
                  <span><strong className="text-white font-semibold">Day 7 Capstone Project</strong> serves as the final summative assessment.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 p-8 rounded-3xl shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2.5 text-slate-900">
                <Package className="w-6 h-6 text-blue-600" />
                Materials Package
              </h3>
              <p className="mb-6 text-slate-600 italic text-sm">
                Participants receive a comprehensive professional toolkit to accelerate their AI journey:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="font-bold text-blue-600 block text-2xl">50+</span>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Prompt Templates</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="font-bold text-blue-600 block text-2xl">Colab</span>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Pre-loaded Notebooks</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="font-bold text-blue-600 block text-2xl">3</span>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Sample Physics Papers</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="font-bold text-blue-600 block text-2xl">2</span>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Exp. CSV Datasets</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Positioning Note */}
        <section className="bg-slate-900 text-slate-300 p-8 sm:p-10 rounded-3xl text-center shadow-md">
          <h4 className="text-white font-bold text-lg mb-2">Institutional Positioning</h4>
          <p className="max-w-3xl mx-auto text-sm text-slate-300 leading-relaxed">
            Positioned explicitly as an intensive add-on module complementing standard UGC FDP structures. 
            Designed to facilitate replication at the institutional level, empowering professors to lead AI adoption in their own colleges.
          </p>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="text-lg font-bold text-slate-800">National Level Physics Workshop</div>
            <div className="text-sm text-slate-500 mt-0.5">Empowering Educators with Artificial Intelligence</div>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Unisole Home
            </Link>
            <span>•</span>
            <Link to="/programs" className="hover:text-blue-600 transition-colors">
              Programs
            </Link>
          </div>
          <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            © 2026 IAPT-UNISOLE Initiative
          </div>
        </div>
      </footer>
    </div>
  );
}
