import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Send,
  Loader2,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
} from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import { setAuthSession } from '../../utils/auth';

interface QuestionDef {
  id: string;
  title: string;
  subtitle?: string;
  type: 'single-select' | 'multi-select' | 'text';
  required?: boolean;
  hasOther?: boolean;
  options?: string[];
  placeholder?: string;
  condition?: {
    field: string;
    value: string;
  };
}

export default function StudentSurveyPage() {
  const { slug = 'student-skills-survey' } = useParams();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [otherInputs, setOtherInputs] = useState<Record<string, string>>({});

  // Step 3 (Final Step) Identity State
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [customInstitution, setCustomInstitution] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [customYear, setCustomYear] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Background sync with backend if online
  useEffect(() => {
    fetch(API_ENDPOINTS.surveys.get(slug)).catch(() => {});
  }, [slug]);

  // Option handlers
  const handleRadioSelect = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleCheckboxToggle = (questionId: string, option: string) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      if (current.includes(option)) {
        return { ...prev, [questionId]: current.filter((x: string) => x !== option) };
      } else {
        return { ...prev, [questionId]: [...current, option] };
      }
    });
  };

  const handleTextChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Visibility logic for stream-based branch
  const isStreamMatch = (streamValue: string): boolean => {
    const chosen = answers['stream'];
    if (streamValue === 'BBA / Management') {
      return chosen === 'BBA / Management' || chosen === 'BBA';
    }
    return chosen === streamValue;
  };

  // Validation
  const validateStep = (): boolean => {
    setErrorMsg('');

    if (currentStep === 0) {
      if (!answers['aiming_for'] || answers['aiming_for'].length === 0) {
        setErrorMsg('Please select at least one career track you are aiming for.');
        return false;
      }
      if (!answers['why_learn'] || answers['why_learn'].length === 0) {
        setErrorMsg('Please select why you want to learn new skills.');
        return false;
      }
      if (!answers['challenges'] || answers['challenges'].length === 0) {
        setErrorMsg('Please select the challenges you are facing.');
        return false;
      }
      if (!answers['course_factors'] || answers['course_factors'].length === 0) {
        setErrorMsg('Please select what factors make a course valuable.');
        return false;
      }
      if (!answers['laptop_access']) {
        setErrorMsg('Please answer whether you have access to a laptop or computer.');
        return false;
      }
      return true;
    }

    if (currentStep === 1) {
      if (!answers['stream']) {
        setErrorMsg('Please select your current course/stream.');
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      if (!studentName.trim()) {
        setErrorMsg('Please enter your full name.');
        return false;
      }
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile / WhatsApp number.');
        return false;
      }
      const finalInst = institution === '__OTHER__' ? customInstitution.trim() : institution;
      if (!finalInst) {
        setErrorMsg('Please select or specify your institution name.');
        return false;
      }
      const finalYr = yearOfStudy === '__OTHER__' ? customYear.trim() : yearOfStudy;
      if (!finalYr) {
        setErrorMsg('Please select your current year of study.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStep()) return;

    const finalInst = institution === '__OTHER__' ? customInstitution.trim() : institution;
    const finalYr = yearOfStudy === '__OTHER__' ? customYear.trim() : yearOfStudy;
    const finalStream = answers['stream'] === '__OTHER__' ? otherInputs['stream_other'] || 'Other' : answers['stream'] || 'GENERAL';

    setSubmitting(true);
    setErrorMsg('');

    try {
      const consolidatedAnswers = {
        ...answers,
        student_name: studentName.trim(),
        student_phone: phone.trim(),
        student_email: email.trim(),
        student_college: finalInst,
        student_stream: finalStream,
        student_year: finalYr,
        ...otherInputs,
      };

      const payload = {
        name: studentName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        collegeName: finalInst,
        stream: finalStream,
        yearOfStudy: finalYr,
        answers: consolidatedAnswers,
      };

      const res = await fetch(API_ENDPOINTS.surveys.submit(slug), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit survey');
      }

      if (data.token && data.user) {
        setAuthSession({ token: data.token, user: data.user });
      }

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while submitting. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0ebf8] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-6 sm:py-10 px-3 sm:px-4 font-sans antialiased">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Brand Header Bar */}
        <div className="flex items-center justify-between px-2 py-1 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <img
              src="https://res.cloudinary.com/hehmsemf/image/upload/f_auto,q_auto,w_64/v1785299421/Unisole_logo_new_mhqbma.png"
              alt="Unisole"
              className="w-5 h-5 rounded object-contain"
            />
            <span className="font-bold text-slate-700 dark:text-slate-300 tracking-tight">
              Unisole Skill AI Labs
            </span>
          </div>
          <span className="font-mono text-[11px]">Official Student Survey</span>
        </div>

        {/* Main Form Box / Success Box */}
        {isSubmitted ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden text-center p-8 sm:p-12 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Your response has been recorded.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Thank you, <span className="font-semibold text-slate-800 dark:text-slate-200">{studentName}</span>! Your
              skills diagnostic and career interests have been submitted successfully.
            </p>
            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 text-xs text-slate-400">
              You can now safely close this tab.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top Google Forms Header Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 border-t-[10px] border-t-[#5746e3] p-6 sm:p-8 space-y-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Student Skills &amp; Career Aspirations Survey 🎓
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                A quick snapshot of where you are, where you want to go, and what skills can help you get there.
                Your responses will help us shape high-impact, industry-relevant learning opportunities tailored for you.
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-red-500 font-medium">* Indicates required question</span>
                <span className="text-slate-400 font-mono">Page {currentStep + 1} of 3</span>
              </div>
            </div>

            {/* Error Message Toast */}
            {errorMsg && (
              <div className="bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 rounded-xl p-4 text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STEP 0: Goals & Learning Needs */}
            {currentStep === 0 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Question 1: Aiming for */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      🚀 What are you currently aiming for? <span className="text-red-500">*</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Select all that apply</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      '💻 Software Development / IT Career',
                      '🤖 AI / Machine Learning Career',
                      '📊 Data Science / Data Analytics',
                      '🔐 Cybersecurity / Cloud / IT Infrastructure',
                      '💼 Business / Entrepreneurship / Startup',
                      '📈 Finance / Accounting / Commerce Career',
                      '📣 Digital Marketing / Content Creation',
                      '🎓 Higher Studies / Further Education',
                    ].map((opt) => {
                      const checked = (answers['aiming_for'] || []).includes(opt);
                      return (
                        <label
                          key={opt}
                          onClick={() => handleCheckboxToggle('aiming_for', opt)}
                          className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {}}
                            className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                          />
                          <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                        </label>
                      );
                    })}
                    {/* Other option */}
                    <div className="flex items-center gap-3.5 py-2 px-3">
                      <input
                        type="checkbox"
                        checked={Boolean(otherInputs['aiming_for_other'])}
                        onChange={() => {}}
                        className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                      <input
                        type="text"
                        placeholder="Your answer"
                        value={otherInputs['aiming_for_other'] || ''}
                        onChange={(e) =>
                          setOtherInputs((prev) => ({ ...prev, aiming_for_other: e.target.value }))
                        }
                        className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Question 2: Why learn new skills */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      💡 Why do you want to learn new skills? <span className="text-red-500">*</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Select all that apply</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Improve job opportunities',
                      'Prepare for internships',
                      'Build real-world projects',
                      'Freelancing / Earning',
                      'Start a business / Startup',
                      'Academic knowledge',
                      'Explore a new field',
                      'Keep up with emerging technology',
                      'Personal interest',
                    ].map((opt) => {
                      const checked = (answers['why_learn'] || []).includes(opt);
                      return (
                        <label
                          key={opt}
                          onClick={() => handleCheckboxToggle('why_learn', opt)}
                          className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {}}
                            className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                          />
                          <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                        </label>
                      );
                    })}
                    <div className="flex items-center gap-3.5 py-2 px-3">
                      <input
                        type="checkbox"
                        checked={Boolean(otherInputs['why_learn_other'])}
                        onChange={() => {}}
                        className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                      <input
                        type="text"
                        placeholder="Your answer"
                        value={otherInputs['why_learn_other'] || ''}
                        onChange={(e) =>
                          setOtherInputs((prev) => ({ ...prev, why_learn_other: e.target.value }))
                        }
                        className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Question 3: Challenges */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      What challenges are you currently facing when trying to learn new skills? <span className="text-red-500">*</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Select all that apply</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Lack of time',
                      'Course fees',
                      "Don't know where to start",
                      'Lack of proper guidance',
                      'College workload',
                      "Don't know which skills are useful for my career",
                      'Lack of practical learning opportunities',
                      'Lack of access to tools/resources',
                      'Difficulty staying consistent',
                    ].map((opt) => {
                      const checked = (answers['challenges'] || []).includes(opt);
                      return (
                        <label
                          key={opt}
                          onClick={() => handleCheckboxToggle('challenges', opt)}
                          className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {}}
                            className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                          />
                          <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                        </label>
                      );
                    })}
                    <div className="flex items-center gap-3.5 py-2 px-3">
                      <input
                        type="checkbox"
                        checked={Boolean(otherInputs['challenges_other'])}
                        onChange={() => {}}
                        className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                      <input
                        type="text"
                        placeholder="Your answer"
                        value={otherInputs['challenges_other'] || ''}
                        onChange={(e) =>
                          setOtherInputs((prev) => ({ ...prev, challenges_other: e.target.value }))
                        }
                        className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Question 4: Course factors */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      🤝 According to you, what factors make a course truly valuable? <span className="text-red-500">*</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Select all that apply</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Practical, hands-on learning',
                      'Real-world projects',
                      'Industry-relevant skills',
                      'Internship opportunity',
                      'Mentorship from professionals',
                      'Portfolio / GitHub projects',
                      'Certificate',
                      'Flexible timings',
                      'Affordable fees',
                      'Access to AI tools & software',
                      'Beginner-friendly teaching',
                    ].map((opt) => {
                      const checked = (answers['course_factors'] || []).includes(opt);
                      return (
                        <label
                          key={opt}
                          onClick={() => handleCheckboxToggle('course_factors', opt)}
                          className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {}}
                            className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                          />
                          <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                        </label>
                      );
                    })}
                    <div className="flex items-center gap-3.5 py-2 px-3">
                      <input
                        type="checkbox"
                        checked={Boolean(otherInputs['course_factors_other'])}
                        onChange={() => {}}
                        className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                      <input
                        type="text"
                        placeholder="Your answer"
                        value={otherInputs['course_factors_other'] || ''}
                        onChange={(e) =>
                          setOtherInputs((prev) => ({ ...prev, course_factors_other: e.target.value }))
                        }
                        className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Question 5: Laptop access */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Do you currently have access to a laptop or computer for learning? <span className="text-red-500">*</span>
                  </h2>
                  <div className="space-y-2">
                    {[
                      'Yes, I have my own laptop/computer',
                      'Yes, but I share it with someone',
                      "No, I don't currently have access to one",
                      'I can access one when needed (college/lab/library, etc.)',
                    ].map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleRadioSelect('laptop_access', opt)}
                        className="flex items-center gap-3.5 py-2.5 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="laptop_access"
                          checked={answers['laptop_access'] === opt}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Stream & Degree Specific Skills */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Course / Stream Question */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    What is your course/stream? <span className="text-red-500">*</span>
                  </h2>
                  <div className="space-y-2">
                    {[
                      'BCA',
                      'MCA',
                      'B.Com',
                      'B.Sc',
                      'B.Sc. CS',
                      'B.A.',
                      'BBA / Management',
                    ].map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleRadioSelect('stream', opt)}
                        className="flex items-center gap-3.5 py-2.5 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="stream"
                          checked={answers['stream'] === opt}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                      </label>
                    ))}
                    {/* Other Stream */}
                    <div className="flex items-center gap-3.5 py-2 px-3">
                      <input
                        type="radio"
                        name="stream"
                        checked={answers['stream'] === '__OTHER__'}
                        onChange={() => handleRadioSelect('stream', '__OTHER__')}
                        className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                      <input
                        type="text"
                        placeholder="Your degree stream"
                        value={otherInputs['stream_other'] || ''}
                        onFocus={() => handleRadioSelect('stream', '__OTHER__')}
                        onChange={(e) =>
                          setOtherInputs((prev) => ({ ...prev, stream_other: e.target.value }))
                        }
                        className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Stream Tailored Courses (BCA) */}
                {isStreamMatch('BCA') && (
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                    <div>
                      <div className="text-xs font-mono font-bold text-[#5746e3] uppercase mb-1">Explore Your Skills — BCA</div>
                      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                        ⭐ Which of the following courses/skills would you be interested in learning?
                      </h2>
                    </div>
                    <div className="space-y-2">
                      {[
                        'Web Development — HTML, CSS & JavaScript',
                        'Full-Stack Development',
                        'Python Programming',
                        'Java Programming',
                        'App Development',
                        'DSA & Problem Solving',
                        'Artificial Intelligence & Machine Learning',
                        'Generative AI & AI Tools',
                        'Data Science',
                        'Data Analytics & Visualization',
                        'Cybersecurity & Ethical Hacking',
                        'Cloud Computing & DevOps',
                        'Database & SQL',
                        'Software Testing & Automation',
                      ].map((opt) => {
                        const checked = (answers['skills_bca'] || []).includes(opt);
                        return (
                          <label
                            key={opt}
                            onClick={() => handleCheckboxToggle('skills_bca', opt)}
                            className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {}}
                              className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                            />
                            <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                          </label>
                        );
                      })}
                      <div className="flex items-center gap-3.5 py-2 px-3">
                        <input
                          type="checkbox"
                          checked={Boolean(otherInputs['skills_bca_other'])}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                        <input
                          type="text"
                          placeholder="Your answer"
                          value={otherInputs['skills_bca_other'] || ''}
                          onChange={(e) =>
                            setOtherInputs((prev) => ({ ...prev, skills_bca_other: e.target.value }))
                          }
                          className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Stream Tailored Courses (MCA) */}
                {isStreamMatch('MCA') && (
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                    <div>
                      <div className="text-xs font-mono font-bold text-[#5746e3] uppercase mb-1">Explore Your Skills — MCA</div>
                      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                        ⭐ Which of the following courses/skills would you be interested in learning?
                      </h2>
                    </div>
                    <div className="space-y-2">
                      {[
                        'Full-Stack Development',
                        'Web Development — HTML, CSS & JavaScript',
                        'Python Programming',
                        'Java Programming',
                        'DSA & Problem Solving',
                        'Artificial Intelligence & Machine Learning',
                        'Generative AI & AI Tools',
                        'Data Science',
                        'Data Analytics & Visualization',
                        'Cloud Computing & DevOps',
                        'Cybersecurity & Ethical Hacking',
                        'Database & SQL',
                        'App Development',
                        'Git & GitHub / Version Control',
                      ].map((opt) => {
                        const checked = (answers['skills_mca'] || []).includes(opt);
                        return (
                          <label
                            key={opt}
                            onClick={() => handleCheckboxToggle('skills_mca', opt)}
                            className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {}}
                              className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                            />
                            <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                          </label>
                        );
                      })}
                      <div className="flex items-center gap-3.5 py-2 px-3">
                        <input
                          type="checkbox"
                          checked={Boolean(otherInputs['skills_mca_other'])}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                        <input
                          type="text"
                          placeholder="Your answer"
                          value={otherInputs['skills_mca_other'] || ''}
                          onChange={(e) =>
                            setOtherInputs((prev) => ({ ...prev, skills_mca_other: e.target.value }))
                          }
                          className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Stream Tailored Courses (B.Com) */}
                {isStreamMatch('B.Com') && (
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                    <div>
                      <div className="text-xs font-mono font-bold text-[#5746e3] uppercase mb-1">Explore Your Skills — B.Com</div>
                      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                        ⭐ Which of the following courses/skills would you be interested in learning?
                      </h2>
                    </div>
                    <div className="space-y-2">
                      {[
                        'Tally Prime & Accounting',
                        'Excel & Advanced Excel',
                        'Financial Analytics',
                        'Data Analytics & Visualization',
                        'AI for Business & Commerce',
                        'Generative AI & AI Tools',
                        'Digital Marketing',
                        'AI Applications & Automation',
                      ].map((opt) => {
                        const checked = (answers['skills_bcom'] || []).includes(opt);
                        return (
                          <label
                            key={opt}
                            onClick={() => handleCheckboxToggle('skills_bcom', opt)}
                            className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {}}
                              className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                            />
                            <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                          </label>
                        );
                      })}
                      <div className="flex items-center gap-3.5 py-2 px-3">
                        <input
                          type="checkbox"
                          checked={Boolean(otherInputs['skills_bcom_other'])}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                        <input
                          type="text"
                          placeholder="Your answer"
                          value={otherInputs['skills_bcom_other'] || ''}
                          onChange={(e) =>
                            setOtherInputs((prev) => ({ ...prev, skills_bcom_other: e.target.value }))
                          }
                          className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Stream Tailored Courses (B.Sc) */}
                {isStreamMatch('B.Sc') && (
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                    <div>
                      <div className="text-xs font-mono font-bold text-[#5746e3] uppercase mb-1">Explore Your Skills — B.Sc</div>
                      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                        ⭐ Which of the following courses/skills would you be interested in learning?
                      </h2>
                    </div>
                    <div className="space-y-2">
                      {[
                        'Python Programming',
                        'Artificial Intelligence & Machine Learning',
                        'Data Science',
                        'Data Analytics & Visualization',
                        'Generative AI & AI Tools',
                        'Database & SQL',
                        'Web Development',
                        'Cybersecurity & Ethical Hacking',
                        'Cloud Computing & DevOps',
                      ].map((opt) => {
                        const checked = (answers['skills_bsc'] || []).includes(opt);
                        return (
                          <label
                            key={opt}
                            onClick={() => handleCheckboxToggle('skills_bsc', opt)}
                            className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {}}
                              className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                            />
                            <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                          </label>
                        );
                      })}
                      <div className="flex items-center gap-3.5 py-2 px-3">
                        <input
                          type="checkbox"
                          checked={Boolean(otherInputs['skills_bsc_other'])}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                        <input
                          type="text"
                          placeholder="Your answer"
                          value={otherInputs['skills_bsc_other'] || ''}
                          onChange={(e) =>
                            setOtherInputs((prev) => ({ ...prev, skills_bsc_other: e.target.value }))
                          }
                          className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Stream Tailored Courses (B.Sc CS) */}
                {isStreamMatch('B.Sc. CS') && (
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                    <div>
                      <div className="text-xs font-mono font-bold text-[#5746e3] uppercase mb-1">Explore Your Skills — B.Sc (CS)</div>
                      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                        ⭐ Which of the following courses/skills would you be interested in learning?
                      </h2>
                    </div>
                    <div className="space-y-2">
                      {[
                        'Web Development — HTML, CSS & JavaScript',
                        'Full-Stack Development',
                        'Python Programming',
                        'Java Programming',
                        'DSA & Problem Solving',
                        'Artificial Intelligence & Machine Learning',
                        'Generative AI & AI Tools',
                        'Data Science',
                        'Data Analytics & Visualization',
                        'Cloud Computing & DevOps',
                        'Cybersecurity & Ethical Hacking',
                        'Database & SQL',
                        'App Development',
                      ].map((opt) => {
                        const checked = (answers['skills_bsc_cs'] || []).includes(opt);
                        return (
                          <label
                            key={opt}
                            onClick={() => handleCheckboxToggle('skills_bsc_cs', opt)}
                            className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {}}
                              className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                            />
                            <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                          </label>
                        );
                      })}
                      <div className="flex items-center gap-3.5 py-2 px-3">
                        <input
                          type="checkbox"
                          checked={Boolean(otherInputs['skills_bsc_cs_other'])}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                        <input
                          type="text"
                          placeholder="Your answer"
                          value={otherInputs['skills_bsc_cs_other'] || ''}
                          onChange={(e) =>
                            setOtherInputs((prev) => ({ ...prev, skills_bsc_cs_other: e.target.value }))
                          }
                          className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Stream Tailored Courses (B.A.) */}
                {isStreamMatch('B.A.') && (
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                    <div>
                      <div className="text-xs font-mono font-bold text-[#5746e3] uppercase mb-1">Explore Your Skills — B.A.</div>
                      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                        ⭐ Which of the following courses/skills would you be interested in learning?
                      </h2>
                    </div>
                    <div className="space-y-2">
                      {[
                        '🧠 AI for Psychology & Behavioural Sciences',
                        '🐍 Python Programming for Beginners',
                        '📚 AI for Education & Teaching',
                        '⚖️ AI for Law & Legal Applications',
                        '🎨 AI for Media, Design & Creative Work',
                        '📱 Generative AI & AI Tools for Everyday Work',
                        '📣 Digital Marketing & Social Media',
                        '🎬 Video Editing & Content Creation',
                        '🎨 Graphic Design',
                        '🖥️ UI/UX Design',
                        '📊 Data Analytics & Visualization',
                        '📝 AI Tools for Research & Academic Work',
                      ].map((opt) => {
                        const checked = (answers['skills_ba'] || []).includes(opt);
                        return (
                          <label
                            key={opt}
                            onClick={() => handleCheckboxToggle('skills_ba', opt)}
                            className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {}}
                              className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                            />
                            <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                          </label>
                        );
                      })}
                      <div className="flex items-center gap-3.5 py-2 px-3">
                        <input
                          type="checkbox"
                          checked={Boolean(otherInputs['skills_ba_other'])}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                        <input
                          type="text"
                          placeholder="Your answer"
                          value={otherInputs['skills_ba_other'] || ''}
                          onChange={(e) =>
                            setOtherInputs((prev) => ({ ...prev, skills_ba_other: e.target.value }))
                          }
                          className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Stream Tailored Courses (BBA) */}
                {isStreamMatch('BBA / Management') && (
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                    <div>
                      <div className="text-xs font-mono font-bold text-[#5746e3] uppercase mb-1">Explore Your Skills — BBA / Management</div>
                      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                        ⭐ Which of the following courses/skills would you be interested in learning?
                      </h2>
                    </div>
                    <div className="space-y-2">
                      {[
                        '🤖 AI for Business & Management',
                        '📊 Data Analytics for Business',
                        '📈 Business Intelligence & Dashboards',
                        '📣 Digital Marketing & Social Media Strategy',
                        '💰 Financial Analytics & Business Finance',
                        '📊 Excel & Advanced Excel for Business',
                        '🧠 Business Strategy & Decision Making',
                        '🚀 Startup & Entrepreneurship',
                        '🛒 E-Commerce & Digital Business',
                        '📱 Generative AI & AI Tools for Business',
                        '🧾 Tally Prime & Accounting',
                      ].map((opt) => {
                        const checked = (answers['skills_bba'] || []).includes(opt);
                        return (
                          <label
                            key={opt}
                            onClick={() => handleCheckboxToggle('skills_bba', opt)}
                            className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {}}
                              className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                            />
                            <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                          </label>
                        );
                      })}
                      <div className="flex items-center gap-3.5 py-2 px-3">
                        <input
                          type="checkbox"
                          checked={Boolean(otherInputs['skills_bba_other'])}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                        <input
                          type="text"
                          placeholder="Your answer"
                          value={otherInputs['skills_bba_other'] || ''}
                          onChange={(e) =>
                            setOtherInputs((prev) => ({ ...prev, skills_bba_other: e.target.value }))
                          }
                          className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Other stream skills */}
                {(answers['stream'] === 'Other' || answers['stream'] === '__OTHER__') && (
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                    <div>
                      <div className="text-xs font-mono font-bold text-[#5746e3] uppercase mb-1">Explore Your Skills — Other</div>
                      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                        ⭐ Which AI applications would you be interested in learning?
                      </h2>
                    </div>
                    <div className="space-y-2">
                      {[
                        '🧠 AI for Psychology & Behavioural Sciences',
                        '🧬 AI for Life Sciences & Biotechnology',
                        '🏥 AI for Healthcare & Medical Applications',
                        '📚 AI for Education & Teaching',
                        '⚖️ AI for Law & Legal Applications',
                        '🎨 AI for Media, Design & Creative Work',
                        '📱 Generative AI & AI Tools for Everyday Work',
                        '🔬 AI for Research & Academic Work',
                      ].map((opt) => {
                        const checked = (answers['skills_other'] || []).includes(opt);
                        return (
                          <label
                            key={opt}
                            onClick={() => handleCheckboxToggle('skills_other', opt)}
                            className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {}}
                              className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                            />
                            <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Missed skills free text */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-3">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Is there any course or skill we missed that you would genuinely like to learn?
                  </h2>
                  <input
                    type="text"
                    value={answers['missed_skills'] || ''}
                    onChange={(e) => handleTextChange('missed_skills', e.target.value)}
                    placeholder="Your answer"
                    className="w-full border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-2 bg-transparent text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Student Identity & Campus Information */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Full Name */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-3">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Full Name <span className="text-red-500">*</span>
                  </h2>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Your answer"
                    className="w-full border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-2 bg-transparent text-slate-900 dark:text-white"
                  />
                </div>

                {/* WhatsApp / Phone */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      WhatsApp / Mobile Number <span className="text-red-500">*</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Where we can WhatsApp your personalized roadmap</p>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your 10-digit mobile number"
                    maxLength={15}
                    className="w-full border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-2 bg-transparent font-mono text-slate-900 dark:text-white"
                  />
                </div>

                {/* Institution Name */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    what is your institution name ? <span className="text-red-500">*</span>
                  </h2>
                  <div className="space-y-2">
                    {[
                      'Rajkiya Kanya Mahavidyalaya, Shimla',
                      'Centre of Excellence Government College, Sanjauli',
                      'Rajiv Gandhi Government Degree College, Kotshera',
                    ].map((col) => (
                      <label
                        key={col}
                        onClick={() => setInstitution(col)}
                        className="flex items-center gap-3.5 py-2.5 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="institution"
                          checked={institution === col}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{col}</span>
                      </label>
                    ))}
                    {/* Other Institution */}
                    <div className="flex items-center gap-3.5 py-2 px-3">
                      <input
                        type="radio"
                        name="institution"
                        checked={institution === '__OTHER__'}
                        onChange={() => setInstitution('__OTHER__')}
                        className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                      <input
                        type="text"
                        placeholder="Your institution name"
                        value={customInstitution}
                        onFocus={() => setInstitution('__OTHER__')}
                        onChange={(e) => setCustomInstitution(e.target.value)}
                        className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Which year currently studying in */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Which year are you currently studying in? <span className="text-red-500">*</span>
                  </h2>
                  <div className="space-y-2">
                    {['1st Year', '2nd Year', '3rd Year', 'Final Year'].map((yr) => (
                      <label
                        key={yr}
                        onClick={() => setYearOfStudy(yr)}
                        className="flex items-center gap-3.5 py-2.5 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="yearOfStudy"
                          checked={yearOfStudy === yr}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{yr}</span>
                      </label>
                    ))}
                    <div className="flex items-center gap-3.5 py-2 px-3">
                      <input
                        type="radio"
                        name="yearOfStudy"
                        checked={yearOfStudy === '__OTHER__'}
                        onChange={() => setYearOfStudy('__OTHER__')}
                        className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                      <input
                        type="text"
                        placeholder="Your year / Graduated"
                        value={customYear}
                        onFocus={() => setYearOfStudy('__OTHER__')}
                        onChange={(e) => setCustomYear(e.target.value)}
                        className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address (Optional) */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">Email Address</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Optional - to receive your PDF roadmap report</p>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your answer"
                    className="w-full border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-2 bg-transparent text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Google Forms Style Navigation Buttons */}
            <div className="flex items-center justify-between pt-3">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition cursor-pointer flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-7 py-2.5 rounded-lg bg-[#5746e3] hover:bg-[#4a39d4] text-white text-sm font-semibold shadow-xs transition cursor-pointer flex items-center gap-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={submitting}
                  className="px-8 py-2.5 rounded-lg bg-[#5746e3] hover:bg-[#4a39d4] text-white text-sm font-semibold shadow-xs transition cursor-pointer flex items-center gap-2 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Bottom Footer Note */}
            <div className="text-center pt-6 text-xs text-slate-400 dark:text-slate-600">
              Never submit passwords through this form. • Report Abuse • Terms of Service
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
