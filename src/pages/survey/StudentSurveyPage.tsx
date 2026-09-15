import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Send,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Building2,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import { setAuthSession } from '../../utils/auth';

const HP_COLLEGES = [
  'Rajkiya Kanya Mahavidyalaya (RKMV), Shimla',
  'Centre of Excellence Government College, Sanjauli',
  'Rajiv Gandhi Government Degree College, Kotshera',
  'Government College, Dharamshala',
  'Government College, Mandi',
  'Government College, Solan',
  'Government College, Hamirpur',
  'Government College, Bilaspur',
  'Government College, Kullu',
  'Government College, Una',
  'Government College, Chamba',
  'Himachal Pradesh University (HPU), Shimla',
];

const STREAMS = [
  'BCA (Bachelor of Computer Applications)',
  'B.Sc Computer Science / IT',
  'B.Tech / B.E. (Engineering)',
  'MCA (Master of Computer Applications)',
  'B.Com (Commerce)',
  'BBA / Management',
  'B.Sc (General Sciences)',
  'B.A. (Arts / Humanities)',
];

const YEARS_OF_STUDY = ['1st Year', '2nd Year', '3rd Year', 'Final Year / 4th Year'];

export default function StudentSurveyPage() {
  const { slug = 'student-skills-survey' } = useParams();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [otherInputs, setOtherInputs] = useState<Record<string, string>>({});

  // Step 0: Student Profile State
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [customInstitution, setCustomInstitution] = useState('');
  const [stream, setStream] = useState('');
  const [customStream, setCustomStream] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [customYear, setCustomYear] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Background ping with backend
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

  // Validation per step
  const validateStep = (): boolean => {
    setErrorMsg('');

    // Step 0: Student Identity & Academic Profile
    if (currentStep === 0) {
      if (!studentName.trim()) {
        setErrorMsg('Please enter your full name.');
        return false;
      }
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number.');
        return false;
      }
      const finalInst = institution === '__OTHER__' ? customInstitution.trim() : institution;
      if (!finalInst) {
        setErrorMsg('Please select or specify your college / institution name.');
        return false;
      }
      const finalStream = stream === '__OTHER__' ? customStream.trim() : stream;
      if (!finalStream) {
        setErrorMsg('Please select your current degree / course stream.');
        return false;
      }
      const finalYr = yearOfStudy === '__OTHER__' ? customYear.trim() : yearOfStudy;
      if (!finalYr) {
        setErrorMsg('Please select your current year of study.');
        return false;
      }
      return true;
    }

    // Step 1: Education Realities & Career Perspective
    if (currentStep === 1) {
      if (!answers['current_focus']) {
        setErrorMsg('Please answer Question 1: What are you currently focusing on?');
        return false;
      }
      if (!answers['career_ambition']) {
        setErrorMsg('Please answer Question 2: What is your primary career ambition?');
        return false;
      }
      if (!answers['college_problem']) {
        setErrorMsg('Please answer Question 3: What is the biggest problem at the college level?');
        return false;
      }
      if (!answers['system_problem']) {
        setErrorMsg('Please answer Question 4: What is the biggest problem in the education system?');
        return false;
      }
      if (!answers['past_course_exp']) {
        setErrorMsg('Please answer Question 5: Have you taken any offline or online courses?');
        return false;
      }
      if (!answers['course_motivation']) {
        setErrorMsg('Please answer Question 6: What is your main reason for taking a course?');
        return false;
      }
      if (!answers['seniors_guidance']) {
        setErrorMsg('Please answer Question 7: Do seniors provide useful guidance?');
        return false;
      }
      if (!answers['professors_direction']) {
        setErrorMsg('Please answer Question 8: Which direction do professors push you towards?');
        return false;
      }
      if (!answers['parents_expectation']) {
        setErrorMsg('Please answer Question 9: What career path do your parents expect?');
        return false;
      }
      if (!answers['sector_preference']) {
        setErrorMsg('Please answer Question 10: Private sector vs Government sector opinion.');
        return false;
      }
      return true;
    }

    // Step 2: Skill Course Design & NEP
    if (currentStep === 2) {
      if (!answers['interested_skills'] || answers['interested_skills'].length === 0) {
        setErrorMsg('Please select at least one skill program you are interested in.');
        return false;
      }
      if (!answers['learning_mode']) {
        setErrorMsg('Please select your preferred learning mode (Offline, Online, or Hybrid).');
        return false;
      }
      if (!answers['degree_skill_weightage']) {
        setErrorMsg('Please select how degree vs skill training weightage should be divided.');
        return false;
      }
      if (!answers['credit_value']) {
        setErrorMsg('Please answer whether official academic credits make the training more valuable.');
        return false;
      }
      if (!answers['budget_preference']) {
        setErrorMsg('Please select your realistic budget for a 3-month skill program.');
        return false;
      }
      if (!answers['weekly_hours']) {
        setErrorMsg('Please select how many weekly hours you can dedicate to training.');
        return false;
      }
      if (!answers['has_laptop']) {
        setErrorMsg('Please answer Question 17: Do you have a laptop or computer?');
        return false;
      }
      if (!answers['join_ai_network']) {
        setErrorMsg('Please answer Question 18: Would you like to join the National AI Network of Unisole?');
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
    const finalStream = stream === '__OTHER__' ? customStream.trim() : stream;
    const finalYr = yearOfStudy === '__OTHER__' ? customYear.trim() : yearOfStudy;

    setSubmitting(true);
    setErrorMsg('');

    try {
      const consolidatedAnswers = {
        ...answers,
        student_name: studentName.trim(),
        student_phone: phone.trim(),
        student_email: email.trim() || undefined,
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
        confetti({ particleCount: 110, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while submitting. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f9] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 py-6 sm:py-10 px-3 sm:px-4 font-sans antialiased">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Brand & Partner Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-1 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <img
              src="https://res.cloudinary.com/hehmsemf/image/upload/f_auto,q_auto,w_64/v1785299421/Unisole_logo_new_mhqbma.png"
              alt="Unisole Skill AI Labs"
              className="w-5 h-5 rounded object-contain"
            />
            <span className="font-bold text-slate-800 dark:text-slate-200 tracking-tight">
              Unisole Skill AI Labs
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#5746e3]/10 text-[#5746e3] dark:text-[#8b7ff5] font-semibold text-[11px]">
            <Building2 className="w-3 h-3" />
            Govt. of Himachal Pradesh &bull; NEP Survey Partner
          </span>
        </div>

        {/* Main Survey Content Box */}
        {isSubmitted ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden text-center p-8 sm:p-12 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Thank You! Your Feedback Has Been Recorded.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Thank you, <span className="font-semibold text-slate-800 dark:text-slate-200">{studentName}</span>! Your
              honest feedback will directly help shape upcoming credit-linked NEP industrial training courses across Himachal Pradesh.
            </p>
            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 text-xs text-slate-400">
              You can now safely close this window.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top Google Forms Style Header Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 border-t-[10px] border-t-[#5746e3] p-6 sm:p-8 space-y-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#5746e3] dark:text-[#8b7ff5] uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  Himachal Pradesh Undergraduate Higher Education Initiative
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                  Undergraduate Student Skills &amp; Career Survey 🎓
                </h1>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2.5 leading-relaxed bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-slate-100 dark:border-zinc-800">
                <p>
                  <strong>Unisole Skill AI Labs</strong> is surveying college students across Himachal Pradesh in support of initiatives with the <strong>Government of Himachal Pradesh</strong> to implement the National Education Policy (NEP) and design meaningful, credit-linked industrial courses at the undergraduate level.
                </p>
                <p>
                  This survey takes just <strong>5–7 minutes</strong>. There are no right or wrong answers — we simply want your authentic, honest input to build courses and career systems that genuinely help college students succeed.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-red-500 font-medium">* Indicates required question</span>
                <span className="text-slate-400 font-mono font-medium">Page {currentStep + 1} of 3</span>
              </div>
            </div>

            {/* Error Message Toast */}
            {errorMsg && (
              <div className="bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 rounded-xl p-4 text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ========================================================
                STEP 0: Student Profile & Academic Information
            ======================================================== */}
            {currentStep === 0 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="px-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Section 1 of 3: Your Academic Profile
                </div>

                {/* Full Name */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-3">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    1. Full Name <span className="text-red-500">*</span>
                  </h2>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-2 bg-transparent text-slate-900 dark:text-white"
                  />
                </div>

                {/* Mobile Number */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      2. Mobile Number <span className="text-red-500">*</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Used to verify student identity and share feedback</p>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-2 bg-transparent font-mono text-slate-900 dark:text-white"
                  />
                </div>

                {/* College Name */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    3. College / Institution Name <span className="text-red-500">*</span>
                  </h2>
                  <div className="space-y-2">
                    {HP_COLLEGES.map((col) => (
                      <label
                        key={col}
                        onClick={() => setInstitution(col)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
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
                    {/* Other College */}
                    <div className="flex items-center gap-3.5 py-2 px-3">
                      <input
                        type="radio"
                        name="institution"
                        checked={institution === '__OTHER__'}
                        onChange={() => setInstitution('__OTHER__')}
                        className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other College:</span>
                      <input
                        type="text"
                        placeholder="Type your college name"
                        value={customInstitution}
                        onFocus={() => setInstitution('__OTHER__')}
                        onChange={(e) => setCustomInstitution(e.target.value)}
                        className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Course / Stream */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    4. Current Course / Degree Stream <span className="text-red-500">*</span>
                  </h2>
                  <div className="space-y-2">
                    {STREAMS.map((s) => (
                      <label
                        key={s}
                        onClick={() => setStream(s)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="stream"
                          checked={stream === s}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{s}</span>
                      </label>
                    ))}
                    <div className="flex items-center gap-3.5 py-2 px-3">
                      <input
                        type="radio"
                        name="stream"
                        checked={stream === '__OTHER__'}
                        onChange={() => setStream('__OTHER__')}
                        className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                      <input
                        type="text"
                        placeholder="Type your degree name"
                        value={customStream}
                        onFocus={() => setStream('__OTHER__')}
                        onChange={(e) => setCustomStream(e.target.value)}
                        className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Year of Study */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    5. Which year are you currently studying in? <span className="text-red-500">*</span>
                  </h2>
                  <div className="space-y-2">
                    {YEARS_OF_STUDY.map((yr) => (
                      <label
                        key={yr}
                        onClick={() => setYearOfStudy(yr)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
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
                      <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other / Graduated:</span>
                      <input
                        type="text"
                        placeholder="e.g. Recently Graduated"
                        value={customYear}
                        onFocus={() => setYearOfStudy('__OTHER__')}
                        onChange={(e) => setCustomYear(e.target.value)}
                        className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================
                STEP 1: College Experiences & Career Reality
            ======================================================== */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="px-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Section 2 of 3: College Realities &amp; Career Perspective
                </div>

                {/* Q1: Current Focus & Decision */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      1. Abhi aap kya kar rahe ho — job ki taiyari, koi course, ya kuch specific nahi? <span className="text-red-500">*</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Select the primary option that describes your current focus</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Preparing for private / tech industry jobs & placements',
                      'Preparing for government exams (Civil Services, Banking, Defense, etc.)',
                      'Enrolled in an external skill course or certification',
                      'Working on personal projects, coding, or freelancing',
                      'Focusing strictly on regular college exams and syllabus',
                      'Nothing specific right now / still exploring options',
                    ].map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleRadioSelect('current_focus', opt)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="current_focus"
                          checked={answers['current_focus'] === opt}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                      </label>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-zinc-800">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                      Yeh khud ki choice thi ya kisi ne suggest kiya? (agar khud ki choice thi, toh kyun?)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Khud ki choice thi because I love software, ya parents/friends ne suggest kiya"
                      value={otherInputs['current_focus_reason'] || ''}
                      onChange={(e) => setOtherInputs((prev) => ({ ...prev, current_focus_reason: e.target.value }))}
                      className="w-full border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1.5 bg-transparent text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Q2: Current Ambition & Prep */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      2. Current ambition kya hai — job, higher study, business, ya govt exam? <span className="text-red-500">*</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Select your primary career target</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Private sector job (Software / Tech / Corporate)',
                      'Government job / Competitive exam',
                      'Higher studies (Master’s, MCA, M.Tech, MBA, Ph.D.)',
                      'Starting a business / Startup / Entrepreneurship',
                      'Freelancing / Remote global client work',
                      'Still undecided / Exploring different careers',
                    ].map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleRadioSelect('career_ambition', opt)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="career_ambition"
                          checked={answers['career_ambition'] === opt}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                      </label>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-zinc-800">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                      Uske liye abhi kya kar rahe ho? (What are you currently doing to prepare?)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Practicing coding daily, studying for exams, building projects, nothing yet"
                      value={otherInputs['ambition_preparation'] || ''}
                      onChange={(e) => setOtherInputs((prev) => ({ ...prev, ambition_preparation: e.target.value }))}
                      className="w-full border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1.5 bg-transparent text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Q3: Biggest College Level Problem */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      3. College level pe sabse badi problem kya lagti hai? <span className="text-red-500">*</span>
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Outdated syllabus that does not match modern industry requirements',
                      'Lack of hands-on computer labs, practical projects, and coding exposure',
                      'Very few or no campus placement and internship opportunities',
                      'Too much focus on memorization and exams instead of real skill building',
                      'Lack of career mentorship from experienced industry professionals',
                    ].map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleRadioSelect('college_problem', opt)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="college_problem"
                          checked={answers['college_problem'] === opt}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                      </label>
                    ))}
                    <div className="flex items-center gap-3.5 py-2 px-3">
                      <input
                        type="radio"
                        name="college_problem"
                        checked={answers['college_problem'] === '__OTHER__'}
                        onChange={() => handleRadioSelect('college_problem', '__OTHER__')}
                        className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                      <input
                        type="text"
                        placeholder="Describe your college challenge"
                        value={otherInputs['college_problem_other'] || ''}
                        onFocus={() => handleRadioSelect('college_problem', '__OTHER__')}
                        onChange={(e) => setOtherInputs((prev) => ({ ...prev, college_problem_other: e.target.value }))}
                        className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Q4: Biggest Education System Problem */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      4. Poore education system mein sabse badi problem kya lagti hai? <span className="text-red-500">*</span>
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {[
                      'College degrees no longer guarantee jobs or practical capability',
                      'Huge gap between theoretical classroom teaching and corporate hiring standards',
                      'Students are taught for marks, not for critical thinking or problem solving',
                      'Emerging fields (AI, Machine Learning, Data) are not integrated early enough',
                      'Career guidance starts too late (usually only in final year)',
                    ].map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleRadioSelect('system_problem', opt)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="system_problem"
                          checked={answers['system_problem'] === opt}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                      </label>
                    ))}
                    <div className="flex items-center gap-3.5 py-2 px-3">
                      <input
                        type="radio"
                        name="system_problem"
                        checked={answers['system_problem'] === '__OTHER__'}
                        onChange={() => handleRadioSelect('system_problem', '__OTHER__')}
                        className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                      <input
                        type="text"
                        placeholder="Your thoughts on the system"
                        value={otherInputs['system_problem_other'] || ''}
                        onFocus={() => handleRadioSelect('system_problem', '__OTHER__')}
                        onChange={(e) => setOtherInputs((prev) => ({ ...prev, system_problem_other: e.target.value }))}
                        className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Q5: Past Course Experience */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      5. Pehle koi offline/online course kiya hai? <span className="text-red-500">*</span>
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Yes, offline training / coaching institute',
                      'Yes, online platforms (Udemy, Coursera, YouTube, etc.)',
                      'Yes, both online and offline programs',
                      'No, I have never taken an external course',
                    ].map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleRadioSelect('past_course_exp', opt)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="past_course_exp"
                          checked={answers['past_course_exp'] === opt}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                      </label>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-zinc-800">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                      Kya achha tha, kya nahi? (What was good, and what was disappointing or missing?)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Good theory but missed real projects, or mentor didn't reply to doubts"
                      value={otherInputs['past_course_feedback'] || ''}
                      onChange={(e) => setOtherInputs((prev) => ({ ...prev, past_course_feedback: e.target.value }))}
                      className="w-full border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1.5 bg-transparent text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Q6: Main Reason for Taking a Course */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      6. Course lene ka main reason kya hota hai — certification, job-skill, ya apni interest? <span className="text-red-500">*</span>
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {[
                      'To acquire practical, job-ready skills (Job-skill)',
                      'To get a verified certificate for my resume (Certification)',
                      'Genuine personal curiosity and interest in technology (Apni interest)',
                      'College / internship mandatory requirement',
                      'To build real projects for my GitHub / portfolio',
                    ].map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleRadioSelect('course_motivation', opt)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="course_motivation"
                          checked={answers['course_motivation'] === opt}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                      </label>
                    ))}
                    <div className="flex items-center gap-3.5 py-2 px-3">
                      <input
                        type="radio"
                        name="course_motivation"
                        checked={answers['course_motivation'] === '__OTHER__'}
                        onChange={() => handleRadioSelect('course_motivation', '__OTHER__')}
                        className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                      <input
                        type="text"
                        placeholder="Your main motivation"
                        value={otherInputs['course_motivation_other'] || ''}
                        onFocus={() => handleRadioSelect('course_motivation', '__OTHER__')}
                        onChange={(e) => setOtherInputs((prev) => ({ ...prev, course_motivation_other: e.target.value }))}
                        className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Q7: Guidance from Seniors */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      7. Seniors se sahi guidance milti hai, ya woh bhi confused hote hain? <span className="text-red-500">*</span>
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Yes, seniors provide clear, practical guidance on careers and skills',
                      'Somewhat, but most seniors are equally confused about what to do next',
                      'No, there is almost no interaction or guidance from seniors',
                      'Seniors mostly only advise preparing for government exams',
                    ].map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleRadioSelect('seniors_guidance', opt)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="seniors_guidance"
                          checked={answers['seniors_guidance'] === opt}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q8: Professors' Direction */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      8. Professors kis taraf push karte hain — higher study, govt job, ya private job? <span className="text-red-500">*</span>
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Higher studies (Master’s, MCA, M.Tech, MBA)',
                      'Government jobs / Civil service exams',
                      'Private sector / IT / Corporate jobs',
                      'They mostly focus only on syllabus and exams, rarely discussing careers',
                    ].map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleRadioSelect('professors_direction', opt)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="professors_direction"
                          checked={answers['professors_direction'] === opt}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                      </label>
                    ))}
                    <div className="flex items-center gap-3.5 py-2 px-3">
                      <input
                        type="radio"
                        name="professors_direction"
                        checked={answers['professors_direction'] === '__OTHER__'}
                        onChange={() => handleRadioSelect('professors_direction', '__OTHER__')}
                        className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                      <input
                        type="text"
                        placeholder="Your observation"
                        value={otherInputs['professors_direction_other'] || ''}
                        onFocus={() => handleRadioSelect('professors_direction', '__OTHER__')}
                        onChange={(e) => setOtherInputs((prev) => ({ ...prev, professors_direction_other: e.target.value }))}
                        className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Q9: Parents' Expectations vs Personal Interest */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      9. Parents kya chahte hain, aur kya woh aapki apni pasand se match karta hai? <span className="text-red-500">*</span>
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Parents want a government job — and that matches my personal ambition',
                      'Parents want a government job — but I prefer private sector / tech / business',
                      'Parents want a private / tech career — and that matches my choice',
                      'Parents fully support whatever career path I choose for myself',
                    ].map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleRadioSelect('parents_expectation', opt)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="parents_expectation"
                          checked={answers['parents_expectation'] === opt}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                      </label>
                    ))}
                    <div className="flex items-center gap-3.5 py-2 px-3">
                      <input
                        type="radio"
                        name="parents_expectation"
                        checked={answers['parents_expectation'] === '__OTHER__'}
                        onChange={() => handleRadioSelect('parents_expectation', '__OTHER__')}
                        className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                      <input
                        type="text"
                        placeholder="Your situation"
                        value={otherInputs['parents_expectation_other'] || ''}
                        onFocus={() => handleRadioSelect('parents_expectation', '__OTHER__')}
                        onChange={(e) => setOtherInputs((prev) => ({ ...prev, parents_expectation_other: e.target.value }))}
                        className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Q10: Private Sector vs Government Sector */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      10. Private sector vs government sector — honest opinion? <span className="text-red-500">*</span>
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Prefer Private Sector (Faster career growth, merit-based, higher salary upside)',
                      'Prefer Government Sector (Long-term job security, pension/benefits, work-life balance)',
                      'Open to both — whichever offers a solid and genuine starting opportunity',
                      'Prefer starting my own business / Entrepreneurship / Freelancing',
                    ].map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleRadioSelect('sector_preference', opt)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="sector_preference"
                          checked={answers['sector_preference'] === opt}
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

            {/* ========================================================
                STEP 2: Skill Course Design & NEP Academic Integration
            ======================================================== */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="px-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Section 3 of 3: Designing Your Ideal Skill Program (NEP)
                </div>

                {/* Q11: Skill Program Interest (Multi-select) */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      11. Skill program mein sabse zyada interest kis mein hoga? <span className="text-red-500">*</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Select all fields you would like to explore</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Data Science',
                      'Data Analytics',
                      'Machine Learning',
                      'Generative AI',
                      'Full Stack Data Science',
                      'Entrepreneurship',
                      'Cyber Security',
                      'Data Engineering',
                      'Finance',
                    ].map((opt) => {
                      const checked = (answers['interested_skills'] || []).includes(opt);
                      return (
                        <label
                          key={opt}
                          onClick={() => handleCheckboxToggle('interested_skills', opt)}
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
                        checked={Boolean(otherInputs['interested_skills_other'])}
                        onChange={() => {}}
                        className="w-4 h-4 text-[#5746e3] rounded border-slate-300 dark:border-zinc-700"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 shrink-0">Other:</span>
                      <input
                        type="text"
                        placeholder="e.g. Web Development, Cloud Computing, Mobile Apps"
                        value={otherInputs['interested_skills_other'] || ''}
                        onChange={(e) =>
                          setOtherInputs((prev) => ({ ...prev, interested_skills_other: e.target.value }))
                        }
                        className="flex-1 border-b border-slate-300 dark:border-zinc-700 focus:border-[#5746e3] outline-none text-sm py-1 bg-transparent text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Q12: Preferred Learning Mode */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      12. Offline, online, ya hybrid — kya prefer karoge? <span className="text-red-500">*</span>
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Offline (In-person classes and hands-on computer labs)',
                      'Online (Live online sessions + recorded learning materials)',
                      'Hybrid (Online sessions + regular weekend in-person workshops)',
                    ].map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleRadioSelect('learning_mode', opt)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="learning_mode"
                          checked={answers['learning_mode'] === opt}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q13: Degree vs Skill Training Weightage */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      13. Core degree aur skill training ko kitna weightage dena chahiye? <span className="text-red-500">*</span>
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {[
                      '50% Degree + 50% Practical Skill Training (Equal balance)',
                      '30% Degree + 70% Practical Skill Training (Heavy emphasis on practical skills)',
                      '70% Degree + 30% Practical Skill Training (College degree as main priority)',
                      '100% Practical Skill Training & Projects',
                    ].map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleRadioSelect('degree_skill_weightage', opt)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="degree_skill_weightage"
                          checked={answers['degree_skill_weightage'] === opt}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q14: Academic Credit Value (NEP) */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      14. Agar yeh skill training aapki degree mein official academic credit ke roop mein count ho sake, toh kya woh zyada valuable lagega — ya ek separate certificate kaafi hai? <span className="text-red-500">*</span>
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Yes! Official academic credits in my degree would make it significantly more valuable',
                      'A separate recognized industry certificate is already enough for me',
                      'Both official credits and industry certificates are equally important',
                      'Not sure / Depends on course quality and university recognition',
                    ].map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleRadioSelect('credit_value', opt)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="credit_value"
                          checked={answers['credit_value'] === opt}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q15: Realistic Budget for 3-Month Skill Program */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      15. Ek genuinely accha 3-month skill program ke liye aap kitna realistically pay kar sakte ho — ya sirf tab lenge jab woh free/govt-subsidized ho? <span className="text-red-500">*</span>
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Only if it is 100% free or fully government-subsidized',
                      '₹1,000 – ₹2,500 for the entire 3 months',
                      '₹2,500 – ₹5,000 for the entire 3 months',
                      '₹5,000+ if it directly includes assured internship or placement support',
                    ].map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleRadioSelect('budget_preference', opt)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="budget_preference"
                          checked={answers['budget_preference'] === opt}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q16: Weekly Hours Commitment */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      16. Weekly kitne ghante nikal sakte ho aisi training ke liye, apni regular padhai ke saath? <span className="text-red-500">*</span>
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {[
                      '3–5 hours per week (around 30–45 minutes daily)',
                      '6–10 hours per week (around 1–1.5 hours daily)',
                      '10–15 hours per week (regular practice + weekends)',
                      '15+ hours per week (intensive commitment)',
                    ].map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleRadioSelect('weekly_hours', opt)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="weekly_hours"
                          checked={answers['weekly_hours'] === opt}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q17: Laptop / PC Availability */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      17. laptop hai ?? <span className="text-red-500">*</span>
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Yes, I have my own personal laptop / PC',
                      'No, but I have regular access to college computer labs or a shared laptop',
                      'No, I currently only have a smartphone',
                    ].map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleRadioSelect('has_laptop', opt)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="has_laptop"
                          checked={answers['has_laptop'] === opt}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#5746e3] border-slate-300 dark:border-zinc-700 focus:ring-[#5746e3]"
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200 leading-normal">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q18: National AI Network */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#5746e3] shrink-0" />
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      18. would you like to join the national AI network of unisole <span className="text-red-500">*</span>
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500">Get access to exclusive AI workshops, peer community, hackathons, and early access to industry courses.</p>
                  <div className="space-y-2">
                    {[
                      'Yes! I want to join the Unisole National AI Network & receive community invites',
                      'Maybe later / Still exploring options',
                    ].map((opt) => (
                      <label
                        key={opt}
                        onClick={() => handleRadioSelect('join_ai_network', opt)}
                        className="flex items-center gap-3.5 py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer transition select-none"
                      >
                        <input
                          type="radio"
                          name="join_ai_network"
                          checked={answers['join_ai_network'] === opt}
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

            {/* Navigation Buttons */}
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
                      <span>Submit Survey</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Footer Note */}
            <div className="text-center pt-6 text-xs text-slate-400 dark:text-slate-600">
              In initiative with Government of Himachal Pradesh &bull; Unisole Skill AI Labs NEP Survey
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
