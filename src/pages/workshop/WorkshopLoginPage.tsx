import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import {
  useRegisterWorkshopMutation,
  useSubmitWorkshopSurveyMutation,
  useGetPublicCollegesQuery,
  useGetPublicBranchesQuery,
} from '../../store/apiSlice';
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
  Layers,
  Search,
  Plus,
  HelpCircle,
  Briefcase,
  Check,
  BrainCircuit,
  Zap,
} from 'lucide-react';
import { POPULAR_INDIAN_COLLEGES, POPULAR_BRANCHES, OCCUPATION_OPTIONS } from '../../data/indianColleges';

type AuthScreenState = 'REGISTER' | 'SURVEY';

export default function WorkshopLoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerWorkshop, { isLoading: isRegistering }] = useRegisterWorkshopMutation();
  const [submitSurvey, { isLoading: isSubmittingSurvey }] = useSubmitWorkshopSurveyMutation();
  const { data: dbColleges } = useGetPublicCollegesQuery();
  const { data: dbBranches } = useGetPublicBranchesQuery();

  const [screen, setScreen] = useState<AuthScreenState>('REGISTER');

  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [branch, setBranch] = useState('');
  const [occupation, setOccupation] = useState('STUDENT_1');
  const [errorMsg, setErrorMsg] = useState('');

  // Dropdown UI states
  const [collegeSearch, setCollegeSearch] = useState('');
  const [isCollegeDropdownOpen, setIsCollegeDropdownOpen] = useState(false);
  const collegeRef = useRef<HTMLDivElement>(null);

  const [branchSearch, setBranchSearch] = useState('');
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const branchRef = useRef<HTMLDivElement>(null);

  // Survey States
  const [primaryGoal, setPrimaryGoal] = useState('Building Personal AI Workflows & Daily Productivity');
  const [aiToolsUsed, setAiToolsUsed] = useState<string[]>(['ChatGPT']);
  const [priorityTopic, setPriorityTopic] = useState('');

  // Combined College List
  const allColleges = useMemo(() => {
    const list = new Set<string>();
    POPULAR_INDIAN_COLLEGES.forEach((c) => list.add(c));
    if (Array.isArray(dbColleges)) {
      dbColleges.forEach((c: any) => {
        if (c?.name) list.add(c.name);
      });
    }
    return Array.from(list);
  }, [dbColleges]);

  // Filtered Colleges based on user query
  const filteredColleges = useMemo(() => {
    if (!collegeSearch.trim()) return allColleges.slice(0, 30);
    const q = collegeSearch.toLowerCase();
    return allColleges.filter((c) => c.toLowerCase().includes(q)).slice(0, 30);
  }, [allColleges, collegeSearch]);

  // Combined Branch List
  const allBranches = useMemo(() => {
    const list = new Set<string>();
    POPULAR_BRANCHES.forEach((b) => list.add(b));
    if (Array.isArray(dbBranches)) {
      dbBranches.forEach((b: any) => {
        if (b?.name) list.add(b.name);
      });
    }
    return Array.from(list);
  }, [dbBranches]);

  // Filtered Branches based on user query
  const filteredBranches = useMemo(() => {
    if (!branchSearch.trim()) return allBranches;
    const q = branchSearch.toLowerCase();
    return allBranches.filter((b) => b.toLowerCase().includes(q));
  }, [allBranches, branchSearch]);

  useEffect(() => {
    document.title = 'AI Masterclass Portal | Unisole';

    const handleClickOutside = (event: MouseEvent) => {
      if (collegeRef.current && !collegeRef.current.contains(event.target as Node)) {
        setIsCollegeDropdownOpen(false);
      }
      if (branchRef.current && !branchRef.current.contains(event.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Step 1: Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phone.replace(/\D/g, '');
    const cleanName = name.trim();

    if (!cleanName) {
      setErrorMsg('Please enter your full name');
      return;
    }

    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorMsg('Please provide a valid 10-digit WhatsApp number');
      return;
    }

    try {
      const response = await registerWorkshop({
        name: cleanName,
        phone: cleanPhone,
        email: email.trim() || undefined,
        collegeName: collegeName.trim() || undefined,
        branch: branch.trim() || undefined,
        occupation: occupation || undefined,
      }).unwrap();

      const token = response.token || response.accessToken;
      const user = response.user;

      if (token && user) {
        dispatch(setCredentials({ token, user }));
        setAuthSession({ token, user });
      }

      // Move to Step 2: Survey
      setScreen('SURVEY');
    } catch (err: any) {
      console.error('Workshop registration error:', err);
      setErrorMsg(
        err?.data?.message ||
          err?.data?.error ||
          err?.message ||
          'Unable to complete registration. Please verify your details and try again.'
      );
    }
  };

  // Toggle AI Tools in survey
  const handleToggleTool = (tool: string) => {
    if (aiToolsUsed.includes(tool)) {
      setAiToolsUsed(aiToolsUsed.filter((t) => t !== tool));
    } else {
      setAiToolsUsed([...aiToolsUsed, tool]);
    }
  };

  // Handle Step 2: Survey Submission
  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = getUser();
      await submitSurvey({
        userId: user?.id,
        phone: user?.phone || phone.replace(/\D/g, ''),
        primaryGoal,
        aiToolsUsed,
        priorityTopic: priorityTopic.trim() || undefined,
      }).unwrap();
    } catch (err) {
      console.warn('Survey submission notice:', err);
    }

    navigate('/workshop?registered=true', { replace: true });
  };

  const availableGoals = [
    'Building Personal AI Workflows & Daily Productivity',
    'Understanding Next-Token Prediction & Model Parameters',
    'Mastering the P-G-C-I-F-C Universal Prompt Blueprint',
    'Academic Literature Review, Derivations & Fact-checking',
    'Preventing Hallucinations & Sycophancy with CoT Framing',
  ];

  const availableTools = [
    'ChatGPT',
    'Claude',
    'Gemini',
    'Perplexity',
    'GitHub Copilot',
    'DeepSeek',
    'Beginner / None yet',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between antialiased selection:bg-indigo-600 selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Lighting */}
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

          <Link
            to="/workshop"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Masterclass Page
          </Link>
        </div>
      </header>

      {/* Main Registration / Survey Form */}
      <main className="relative z-10 flex-grow flex items-center justify-center py-10 px-4 sm:px-6">
        <div className="max-w-xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-6">
          
          {/* STEP 1: REGISTRATION */}
          {screen === 'REGISTER' && (
            <>
              <div className="text-center space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
                  Masterclass Access
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Stop Chatting with AI. <br />
                  <span className="bg-gradient-to-r from-indigo-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
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

              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
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
                  <p className="text-[11px] text-slate-500 mt-1">Zoom webinar link will be sent to this WhatsApp number.</p>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Email Address <span className="text-slate-500 font-normal">(For calendar invitation)</span>
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

                {/* College / Institution Searchable Dropdown */}
                <div className="relative" ref={collegeRef}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    College / Institution
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search or type college name..."
                      value={collegeName}
                      onFocus={() => setIsCollegeDropdownOpen(true)}
                      onChange={(e) => {
                        setCollegeName(e.target.value);
                        setCollegeSearch(e.target.value);
                        setIsCollegeDropdownOpen(true);
                      }}
                      className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  {/* College Dropdown Menu */}
                  {isCollegeDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 max-h-56 overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 divide-y divide-slate-800">
                      {collegeSearch.trim() && (
                        <button
                          type="button"
                          onClick={() => {
                            setCollegeName(collegeSearch.trim());
                            setIsCollegeDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Use custom: <strong>"{collegeSearch.trim()}"</strong></span>
                        </button>
                      )}

                      {filteredColleges.map((col, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCollegeName(col);
                            setIsCollegeDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors block cursor-pointer"
                        >
                          {col}
                        </button>
                      ))}

                      {filteredColleges.length === 0 && !collegeSearch.trim() && (
                        <div className="px-4 py-3 text-xs text-slate-500">
                          Type to search your university or college
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Branch / Stream Searchable Dropdown */}
                <div className="relative" ref={branchRef}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Branch / Stream
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Layers className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search or type branch (e.g. CSE, BCA, MBA...)"
                      value={branch}
                      onFocus={() => setIsBranchDropdownOpen(true)}
                      onChange={(e) => {
                        setBranch(e.target.value);
                        setBranchSearch(e.target.value);
                        setIsBranchDropdownOpen(true);
                      }}
                      className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  {/* Branch Dropdown Menu */}
                  {isBranchDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 max-h-48 overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 divide-y divide-slate-800">
                      {branchSearch.trim() && (
                        <button
                          type="button"
                          onClick={() => {
                            setBranch(branchSearch.trim());
                            setIsBranchDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Use custom: <strong>"{branchSearch.trim()}"</strong></span>
                        </button>
                      )}

                      {filteredBranches.map((br, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setBranch(br);
                            setIsBranchDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors block cursor-pointer"
                        >
                          {br}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Role / Occupation Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Current Role / Occupation
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <select
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      {OCCUPATION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.label}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full inline-flex items-center justify-center font-bold px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white text-base transition-all duration-200 active:scale-[0.98] gap-2 shadow-xl shadow-indigo-600/30 disabled:opacity-60 cursor-pointer pt-3 mt-2"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Masterclass Portal</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* STEP 2: POST-LOGIN SURVEY */}
          {screen === 'SURVEY' && (
            <div className="space-y-6 text-left">
              <div className="text-center space-y-1.5 pb-2 border-b border-slate-800">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Step 2 of 2: Personalize Your Masterclass
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  What are your top expectations?
                </h2>
                <p className="text-xs text-slate-400">
                  Help the instructor tailor live examples &amp; hands-on exercises to your daily workflow.
                </p>
              </div>

              <form onSubmit={handleSurveySubmit} className="space-y-5">
                {/* Q1: Primary Expectation */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-2 uppercase tracking-wider">
                    1. What is your main objective from this 2-Hour session?
                  </label>
                  <div className="space-y-2">
                    {availableGoals.map((goal, idx) => {
                      const isSelected = primaryGoal === goal;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPrimaryGoal(goal)}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                              : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <span>{goal}</span>
                          {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Q2: AI Tools Used */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-2 uppercase tracking-wider">
                    2. Which AI tools do you actively use today? <span className="text-slate-500 font-normal">(Select all that apply)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTools.map((tool, idx) => {
                      const isSelected = aiToolsUsed.includes(tool);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleToggleTool(tool)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                          <span>{tool}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Q3: Specific challenge or topic */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 uppercase tracking-wider">
                    3. Any specific challenge you want covered during Live Q&amp;A? <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. How to prompt for research papers, preventing hallucinations, multi-turn state handover..."
                    value={priorityTopic}
                    onChange={(e) => setPriorityTopic(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>

                {/* Submit & Skip Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmittingSurvey}
                    className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmittingSurvey ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Finish &amp; Lock My Seat</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/workshop?registered=true', { replace: true })}
                    className="text-xs text-slate-400 hover:text-white transition-colors py-2 px-3"
                  >
                    Skip &amp; Proceed →
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>© 2026 Unisole Skill AI Labs • International Standards AI Masterclass</p>
      </footer>
    </div>
  );
}
