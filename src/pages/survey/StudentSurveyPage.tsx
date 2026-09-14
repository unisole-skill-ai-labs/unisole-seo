import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Check,
  BookOpen,
  GraduationCap,
  Laptop,
  Flame,
  Award,
  Send,
  Loader2,
  Building2,
  Compass,
  Zap,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { API_ENDPOINTS } from '../../config/api';
import { setAuthSession } from '../../utils/auth';

interface Question {
  id: string;
  title: string;
  subtitle?: string;
  type: 'single-select' | 'multi-select' | 'text' | 'phone' | 'dropdown-or-custom';
  required?: boolean;
  options?: string[];
  placeholder?: string;
  condition?: {
    field: string;
    operator: 'eq';
    value: string;
  };
}

interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface SurveySchema {
  slug: string;
  title: string;
  description: string;
  sections: Section[];
}

const DEFAULT_COLLEGES = [
  'Rajkiya Kanya Mahavidyalaya, Shimla',
  'Centre of Excellence Government College, Sanjauli',
  'Rajiv Gandhi Government Degree College, Kotshera',
];

export default function StudentSurveyPage() {
  const { slug = 'student-skills-survey' } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [survey, setSurvey] = useState<SurveySchema | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  // Final step identity state
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [customCollege, setCustomCollege] = useState('');
  const [isCustomCollege, setIsCustomCollege] = useState(false);
  const [yearOfStudy, setYearOfStudy] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  useEffect(() => {
    fetchSurvey();
  }, [slug]);

  const fetchSurvey = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.surveys.get(slug));
      if (res.ok) {
        const data = await res.json();
        if (data?.data?.schema) {
          setSurvey(data.data.schema);
        }
      }
    } catch (err) {
      console.warn('[SurveyPage] Failed to fetch survey dynamically, using local fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMulti = (questionId: string, option: string) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      if (current.includes(option)) {
        return { ...prev, [questionId]: current.filter((x: string) => x !== option) };
      } else {
        return { ...prev, [questionId]: [...current, option] };
      }
    });
  };

  const handleSelectSingle = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleTextChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Check if a conditional question should be displayed based on answers so far
  const isQuestionVisible = (q: Question) => {
    if (!q.condition) return true;
    const { field, operator, value } = q.condition;
    const answeredValue = answers[field];
    if (operator === 'eq') {
      return answeredValue === value;
    }
    return true;
  };

  const currentSection = survey?.sections?.[currentStep];
  const totalSteps = survey?.sections?.length || 3;
  const isFinalStep = currentStep === totalSteps - 1;

  const validateCurrentStep = (): boolean => {
    setErrorMsg('');
    if (!currentSection) return true;

    if (isFinalStep) {
      if (!studentName.trim()) {
        setErrorMsg('Please enter your full name.');
        return false;
      }
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number.');
        return false;
      }
      const finalCol = isCustomCollege ? customCollege.trim() : collegeName.trim();
      if (!finalCol) {
        setErrorMsg('Please select or specify your college name.');
        return false;
      }
      if (!yearOfStudy) {
        setErrorMsg('Please select your current year of study.');
        return false;
      }
      return true;
    }

    // Validate regular questions in section
    for (const q of currentSection.questions) {
      if (!isQuestionVisible(q)) continue;
      if (q.required) {
        const val = answers[q.id];
        if (!val || (Array.isArray(val) && val.length === 0) || (typeof val === 'string' && !val.trim())) {
          setErrorMsg(`Please answer: "${q.title}"`);
          return false;
        }
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    window.scrollTo({ top: 120, behavior: 'smooth' });
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateCurrentStep()) return;

    const finalCollege = isCustomCollege ? customCollege.trim() : collegeName.trim();
    const finalStream = answers.stream || 'GENERAL';

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        name: studentName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        collegeName: finalCollege,
        stream: finalStream,
        yearOfStudy,
        answers: {
          ...answers,
          college_name: finalCollege,
          year_of_study: yearOfStudy,
        },
      };

      const res = await fetch(API_ENDPOINTS.surveys.submit(slug), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit survey.');
      }

      // If token and user returned, save auth
      if (data.token && data.user) {
        setAuthSession({ token: data.token, user: data.user });
      }

      setSubmissionResult(data);
      setIsSubmitted(true);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting response. Please check your network and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
          <p className="text-slate-400 text-sm">Loading survey questions...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Survey Header Banner */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Unisole Skills Diagnostic 2026
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {survey?.title || 'Student Skills & Career Aspirations Survey 🎓'}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {survey?.description ||
              'A quick snapshot of where you are, where you want to go, and what skills can help you get there.'}
          </p>
        </div>

        {/* Success View */}
        {isSubmitted ? (
          <div className="bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 sm:p-12 shadow-2xl shadow-emerald-500/10 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Thank You, {studentName.split(' ')[0]}! 🎉
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto">
                Your responses have been recorded successfully. Our academic advisors are curating your personalized
                learning roadmap for <span className="font-semibold text-indigo-400">{answers.stream || 'your stream'}</span>.
              </p>
            </div>

            {/* Personalized Pathway Card Preview */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-left max-w-lg mx-auto space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                  <Compass className="w-4 h-4" /> Recommended Stream Roadmap
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full">
                  {answers.stream || 'All-Track'}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-400 font-medium">Institution</p>
                <p className="text-sm font-semibold text-white">
                  {isCustomCollege ? customCollege : collegeName || 'Registered College'}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-400 font-medium">Top High-Impact Focus Areas for You</p>
                <div className="flex flex-wrap gap-2">
                  {(
                    Object.entries(answers)
                      .filter(([k]) => k.startsWith('skills'))
                      .flatMap(([_, v]) => (Array.isArray(v) ? v : [v]))
                      .slice(0, 4)
                  ).map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                  {Object.entries(answers).filter(([k]) => k.startsWith('skills')).length === 0 && (
                    <span className="text-xs text-slate-400">Full-Stack Development, GenAI & Applied Python</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/programs"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Explore Recommended Programs
              </Link>
              <Link
                to="/workshop"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                Free AI Masterclass
              </Link>
            </div>
          </div>
        ) : (
          /* Multi-Step Wizard Container */
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            {/* Progress Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                <span>
                  Step {currentStep + 1} of {totalSteps}:{' '}
                  <span className="text-white font-semibold">{currentSection?.title || 'Section'}</span>
                </span>
                <span className="text-indigo-400 font-bold">
                  {Math.round(((currentStep + 1) / totalSteps) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3 animate-in fade-in">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Section Questions */}
            <div className="space-y-8 min-h-[300px]">
              {isFinalStep ? (
                /* Step 3: Student Contact & Identity */
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-indigo-400" />
                      Where should we send your results?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Final step! Enter your details so we can email/WhatsApp your personalized career roadmap.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder:text-slate-600 text-sm transition-all"
                      />
                    </div>

                    {/* WhatsApp Phone */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                        WhatsApp / Mobile <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9816012345"
                        maxLength={15}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder:text-slate-600 text-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* College / Institution */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                      Institution / College <span className="text-red-400">*</span>
                    </label>

                    {!isCustomCollege ? (
                      <div className="space-y-2">
                        <select
                          value={collegeName}
                          onChange={(e) => {
                            if (e.target.value === '__OTHER__') {
                              setIsCustomCollege(true);
                              setCollegeName('');
                            } else {
                              setCollegeName(e.target.value);
                            }
                          }}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-sm transition-all"
                        >
                          <option value="">-- Select Your College --</option>
                          {DEFAULT_COLLEGES.map((col) => (
                            <option key={col} value={col}>
                              {col}
                            </option>
                          ))}
                          <option value="__OTHER__">+ Other (Type College Name)</option>
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customCollege}
                            onChange={(e) => setCustomCollege(e.target.value)}
                            placeholder="Type your complete college or university name..."
                            className="flex-1 px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder:text-slate-600 text-sm transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setIsCustomCollege(false);
                              setCustomCollege('');
                            }}
                            className="px-4 py-3 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Year of study */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                      Which year are you currently studying in? <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['1st Year', '2nd Year', '3rd Year', 'Final Year'].map((year) => {
                        const isSelected = yearOfStudy === year;
                        return (
                          <button
                            key={year}
                            type="button"
                            onClick={() => setYearOfStudy(year)}
                            className={`p-3 rounded-xl border text-sm font-medium transition-all text-center ${
                              isSelected
                                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                                : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                            }`}
                          >
                            {year}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      Email Address <span className="text-slate-500">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. priya@gmail.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder:text-slate-600 text-sm transition-all"
                    />
                  </div>
                </div>
              ) : (
                /* Steps 1 & 2: Render Questions */
                currentSection?.questions.map((q) => {
                  if (!isQuestionVisible(q)) return null;

                  return (
                    <div key={q.id} className="space-y-3">
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                          {q.title}
                          {q.required && <span className="text-red-400 text-sm">*</span>}
                        </h4>
                        {q.subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{q.subtitle}</p>}
                      </div>

                      {/* Multi-Select Pills */}
                      {q.type === 'multi-select' && q.options && (
                        <div className="flex flex-wrap gap-2.5 pt-1">
                          {q.options.map((opt) => {
                            const isSelected = Array.isArray(answers[q.id]) && answers[q.id].includes(opt);
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleToggleMulti(q.id, opt)}
                                className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 text-left ${
                                  isSelected
                                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                    isSelected
                                      ? 'bg-white text-indigo-600 border-white'
                                      : 'border-slate-600 bg-slate-900'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Single-Select Pills */}
                      {q.type === 'single-select' && q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {q.options.map((opt) => {
                            const isSelected = answers[q.id] === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleSelectSingle(q.id, opt)}
                                className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between text-left ${
                                  isSelected
                                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                                }`}
                              >
                                <span>{opt}</span>
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                    isSelected
                                      ? 'border-indigo-400 bg-indigo-500'
                                      : 'border-slate-600 bg-slate-900'
                                  }`}
                                >
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Text Input */}
                      {q.type === 'text' && (
                        <input
                          type="text"
                          value={answers[q.id] || ''}
                          onChange={(e) => handleTextChange(q.id, e.target.value)}
                          placeholder={q.placeholder || 'Type your answer here...'}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder:text-slate-600 text-sm transition-all"
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-6">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div />
              )}

              {!isFinalStep ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleSubmit()}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold transition-all duration-200 shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      Submit Survey <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
