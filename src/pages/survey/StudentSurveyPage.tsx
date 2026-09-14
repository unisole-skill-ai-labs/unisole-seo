import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Check,
  GraduationCap,
  Laptop,
  Flame,
  Award,
  Send,
  Loader2,
  Building2,
  Compass,
  Zap,
  Target,
  BookOpen,
  Briefcase,
  HelpCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import { setAuthSession } from '../../utils/auth';

interface Question {
  id: string;
  title: string;
  subtitle?: string;
  type: 'single-select' | 'multi-select' | 'text';
  required?: boolean;
  options?: string[];
  placeholder?: string;
  hasOtherOption?: boolean;
  condition?: {
    field: string;
    operator: 'eq';
    value: string;
  };
}

interface Section {
  id: string;
  title: string;
  subtitle?: string;
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

// Complete built-in fallback schema extracted 1-to-1 from the Google Form
export const DEFAULT_STUDENT_SURVEY_SCHEMA: SurveySchema = {
  slug: 'student-skills-survey',
  title: 'Student Skills & Career Aspirations Survey 🎓',
  description:
    'A quick snapshot of where you are, where you want to go, and what skills can help you get there. Your responses will help shape tailored, industry-relevant learning opportunities.',
  sections: [
    {
      id: 'career_vision',
      title: 'Your Goals & Learning Needs 🚀',
      subtitle: 'Part 1 of 2: Discovering your ambitions',
      description: 'Tell us about what you want to achieve and the challenges holding you back.',
      questions: [
        {
          id: 'aiming_for',
          title: 'What are you currently aiming for?',
          subtitle: 'Select all career tracks you are passionate about exploring',
          type: 'multi-select',
          required: true,
          hasOtherOption: true,
          options: [
            '💻 Software Development / IT Career',
            '🤖 AI / Machine Learning Career',
            '📊 Data Science / Data Analytics',
            '🔐 Cybersecurity / Cloud / IT Infrastructure',
            '💼 Business / Entrepreneurship / Startup',
            '📈 Finance / Accounting / Commerce Career',
            '📣 Digital Marketing / Content Creation',
            '🎓 Higher Studies / Further Education',
          ],
        },
        {
          id: 'why_learn',
          title: 'Why do you want to learn new skills?',
          subtitle: 'What is your primary motivation right now?',
          type: 'multi-select',
          required: true,
          hasOtherOption: true,
          options: [
            'Improve job opportunities',
            'Prepare for internships',
            'Build real-world projects',
            'Freelancing / Earning',
            'Start a business / Startup',
            'Academic knowledge',
            'Explore a new field',
            'Keep up with emerging technology',
            'Personal interest',
          ],
        },
        {
          id: 'challenges',
          title: 'What challenges are you currently facing when trying to learn new skills?',
          type: 'multi-select',
          required: true,
          hasOtherOption: true,
          options: [
            'Lack of time',
            'Course fees',
            "Don't know where to start",
            'Lack of proper guidance',
            'College workload',
            "Don't know which skills are useful for my career",
            'Lack of practical learning opportunities',
            'Lack of access to tools/resources',
            'Difficulty staying consistent',
          ],
        },
        {
          id: 'course_factors',
          title: 'According to you, what factors make a course truly valuable?',
          type: 'multi-select',
          required: true,
          hasOtherOption: true,
          options: [
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
          ],
        },
        {
          id: 'laptop_access',
          title: 'Do you currently have access to a laptop or computer for learning?',
          type: 'single-select',
          required: true,
          options: [
            'Yes, I have my own laptop/computer',
            'Yes, but I share it with someone',
            "No, I don't currently have access to one",
            'I can access one when needed (college/lab/library, etc.)',
          ],
        },
      ],
    },
    {
      id: 'stream_skills',
      title: 'Explore Your Skills & Courses 💡',
      subtitle: 'Part 2 of 2: Tailored to your academic degree',
      description: 'Select your degree stream to unlock targeted course and technology paths.',
      questions: [
        {
          id: 'stream',
          title: 'What is your current course / stream?',
          type: 'single-select',
          required: true,
          options: [
            'BCA',
            'MCA',
            'B.Com',
            'B.Sc',
            'B.Sc. CS',
            'B.A.',
            'BBA / Management',
            'Other',
          ],
        },
        {
          id: 'skills_bca',
          title: 'Which of the following courses/skills would you be interested in learning? (BCA)',
          type: 'multi-select',
          required: false,
          hasOtherOption: true,
          condition: { field: 'stream', operator: 'eq', value: 'BCA' },
          options: [
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
          ],
        },
        {
          id: 'skills_mca',
          title: 'Which of the following courses/skills would you be interested in learning? (MCA)',
          type: 'multi-select',
          required: false,
          hasOtherOption: true,
          condition: { field: 'stream', operator: 'eq', value: 'MCA' },
          options: [
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
          ],
        },
        {
          id: 'skills_bcom',
          title: 'Which of the following courses/skills would you be interested in learning? (B.Com)',
          type: 'multi-select',
          required: false,
          hasOtherOption: true,
          condition: { field: 'stream', operator: 'eq', value: 'B.Com' },
          options: [
            'Tally Prime & Accounting',
            'Excel & Advanced Excel',
            'Financial Analytics',
            'Data Analytics & Visualization',
            'AI for Business & Commerce',
            'Generative AI & AI Tools',
            'Digital Marketing',
            'AI Applications & Automation',
          ],
        },
        {
          id: 'skills_bsc',
          title: 'Which of the following courses/skills would you be interested in learning? (B.Sc)',
          type: 'multi-select',
          required: false,
          hasOtherOption: true,
          condition: { field: 'stream', operator: 'eq', value: 'B.Sc' },
          options: [
            'Python Programming',
            'Artificial Intelligence & Machine Learning',
            'Data Science',
            'Data Analytics & Visualization',
            'Generative AI & AI Tools',
            'Database & SQL',
            'Web Development',
            'Cybersecurity & Ethical Hacking',
            'Cloud Computing & DevOps',
          ],
        },
        {
          id: 'skills_bsc_cs',
          title: 'Which of the following courses/skills would you be interested in learning? (B.Sc CS)',
          type: 'multi-select',
          required: false,
          hasOtherOption: true,
          condition: { field: 'stream', operator: 'eq', value: 'B.Sc. CS' },
          options: [
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
          ],
        },
        {
          id: 'skills_ba',
          title: 'Which of the following courses/skills would you be interested in learning? (B.A.)',
          type: 'multi-select',
          required: false,
          hasOtherOption: true,
          condition: { field: 'stream', operator: 'eq', value: 'B.A.' },
          options: [
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
          ],
        },
        {
          id: 'skills_bba',
          title: 'Which of the following courses/skills would you be interested in learning? (BBA / Management)',
          type: 'multi-select',
          required: false,
          hasOtherOption: true,
          condition: { field: 'stream', operator: 'eq', value: 'BBA / Management' },
          options: [
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
          ],
        },
        {
          id: 'skills_other',
          title: 'Which AI applications would you be interested in learning? (Other)',
          type: 'multi-select',
          required: false,
          hasOtherOption: true,
          condition: { field: 'stream', operator: 'eq', value: 'Other' },
          options: [
            '🧠 AI for Psychology & Behavioural Sciences',
            '🧬 AI for Life Sciences & Biotechnology',
            '🏥 AI for Healthcare & Medical Applications',
            '📚 AI for Education & Teaching',
            '⚖️ AI for Law & Legal Applications',
            '🎨 AI for Media, Design & Creative Work',
            '📱 Generative AI & AI Tools for Everyday Work',
            '🔬 AI for Research & Academic Work',
          ],
        },
        {
          id: 'missed_skills',
          title: 'Is there any course or skill we missed that you would genuinely like to learn?',
          type: 'text',
          required: false,
          placeholder: 'e.g. Rust, Robotics, Blockchain, Quantum Computing...',
        },
      ],
    },
    {
      id: 'student_identity',
      title: 'Where should we send your results? 🎓',
      subtitle: 'Final Step: Personal details & verification',
      description: 'Enter your name and contact details so we can deliver your career roadmap directly to you.',
      questions: [],
    },
  ],
};

export default function StudentSurveyPage() {
  const { slug = 'student-skills-survey' } = useParams();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  // Default directly to the full Google Form schema so it is NEVER blank or empty
  const [survey, setSurvey] = useState<SurveySchema>(DEFAULT_STUDENT_SURVEY_SCHEMA);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [otherInputs, setOtherInputs] = useState<Record<string, string>>({});

  // Final step identity state (Name, Phone, College, Year)
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

  // Background fetch for dynamic admin overrides, keeping built-in schema as instant fallback
  useEffect(() => {
    fetchSurveyLiveOverrides();
  }, [slug]);

  const fetchSurveyLiveOverrides = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.surveys.get(slug));
      if (res.ok) {
        const data = await res.json();
        if (data?.data?.schema && data.data.schema.sections?.length > 0) {
          setSurvey(data.data.schema);
        }
      }
    } catch (err) {
      // Safely silent - local fallback is already in place
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

  const isQuestionVisible = (q: Question): boolean => {
    if (!q.condition) return true;
    const { field, value } = q.condition;
    const answeredValue = answers[field];
    if (value === 'BBA / Management') {
      return answeredValue === 'BBA / Management' || answeredValue === 'BBA';
    }
    return answeredValue === value;
  };

  const totalSteps = survey.sections.length; // usually 3
  const isFinalStep = currentStep === totalSteps - 1;
  const currentSection = survey.sections[currentStep];

  const validateCurrentStep = (): boolean => {
    setErrorMsg('');

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
        setErrorMsg('Please select or enter your institution name.');
        return false;
      }
      if (!yearOfStudy) {
        setErrorMsg('Please select your current year of study.');
        return false;
      }
      return true;
    }

    // Validate regular questions in section
    if (currentSection?.questions) {
      for (const q of currentSection.questions) {
        if (!isQuestionVisible(q)) continue;
        if (q.required) {
          const val = answers[q.id];
          if (!val || (Array.isArray(val) && val.length === 0) || (typeof val === 'string' && !val.trim())) {
            setErrorMsg(`Please answer: "${q.title.replace(/^[^\w]+/, '')}"`);
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      const consolidatedAnswers = {
        ...answers,
        student_name: studentName.trim(),
        student_phone: phone.trim(),
        student_email: email.trim(),
        student_college: finalCollege,
        student_stream: finalStream,
        student_year: yearOfStudy,
        ...otherInputs,
      };

      const payload = {
        name: studentName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        collegeName: finalCollege,
        stream: finalStream,
        yearOfStudy,
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

      setSubmissionResult(data);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting your responses. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start antialiased selection:bg-indigo-500 selection:text-white">
      {/* Clean Distraction-Free Header (No site Navbar, No SEO clutter) */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/hehmsemf/image/upload/f_auto,q_auto,w_64/v1785299421/Unisole_logo_new_mhqbma.png"
              alt="Unisole"
              className="w-8 h-8 rounded-lg object-contain shadow-xs"
            />
            <div>
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                Unisole <span className="text-indigo-400">AI Labs</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Official Campus Diagnostic
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Verified & Confidential</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-3xl px-4 py-8 sm:py-12">
        {isSubmitted ? (
          /* Submission Success State */
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Survey Recorded Successfully
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Thank You, {studentName || 'Student'}! 🎓
              </h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                Your career preferences and skills diagnosis have been saved. Your personalized learning
                roadmap has been generated.
              </p>
            </div>

            {/* Student Summary Card */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">Student Profile</span>
                <span className="text-xs font-bold text-indigo-400 font-mono">
                  {answers.stream || 'GENERAL'} • {yearOfStudy}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Institution</span>
                  <span className="font-semibold text-slate-200">
                    {isCustomCollege ? customCollege : collegeName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Registered Contact</span>
                  <span className="font-mono font-semibold text-slate-200">{phone}</span>
                </div>
              </div>

              {/* Chosen Skills Chips */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[11px] text-slate-400 font-semibold block">Targeted Career Track:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(answers.aiming_for) ? answers.aiming_for : [answers.aiming_for || 'Software & Technology']).map(
                    (goal: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-lg font-medium"
                      >
                        {goal}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs text-slate-500">
                You may now close this window or return to the main platform.
              </p>
            </div>
          </div>
        ) : (
          /* Multi-Step Wizard Form Card */
          <div className="space-y-6">
            {/* Title & Introduction */}
            <div className="text-center space-y-2 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>UNISOLE SKILLS DIAGNOSTIC 2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                {survey.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                {survey.description}
              </p>
            </div>

            {/* Stepper Progress Bar */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center font-mono">
                    {currentStep + 1}
                  </span>
                  <span className="text-white">{currentSection?.title || 'Survey'}</span>
                </div>
                <span className="font-mono text-indigo-400">
                  Step {currentStep + 1} of {totalSteps}
                </span>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>

              {currentSection?.subtitle && (
                <p className="text-[11px] text-slate-400 italic">{currentSection.subtitle}</p>
              )}
            </div>

            {/* Form Error Banner */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in">
                <div className="w-2 h-2 rounded-full bg-rose-400 animate-ping shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form Container Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
              {isFinalStep ? (
                /* STEP 3: Student Identity (Contact & College details at the end) */
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-indigo-400" />
                      <span>Where should we send your results?</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Final step! Provide your contact info so we can deliver your personalized career
                      roadmap and workshop invitations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                        Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder:text-slate-600 text-sm transition-all"
                      />
                    </div>

                    {/* WhatsApp / Mobile */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                        WhatsApp / Mobile Number <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9816012345"
                        maxLength={15}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder:text-slate-600 text-sm font-mono transition-all"
                      />
                    </div>
                  </div>

                  {/* College / Institution */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                      What is your institution / college name? <span className="text-rose-400">*</span>
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
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-sm transition-all cursor-pointer"
                        >
                          <option value="">-- Select Your Institution --</option>
                          {DEFAULT_COLLEGES.map((col) => (
                            <option key={col} value={col}>
                              {col}
                            </option>
                          ))}
                          <option value="__OTHER__">+ Other Institution (Type Manually)</option>
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
                            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder:text-slate-600 text-sm transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setIsCustomCollege(false);
                              setCustomCollege('');
                            }}
                            className="px-4 py-3 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Year of Study */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                      Which year are you currently studying in? <span className="text-rose-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['1st Year', '2nd Year', '3rd Year', 'Final Year'].map((year) => {
                        const isSelected = yearOfStudy === year;
                        return (
                          <button
                            key={year}
                            type="button"
                            onClick={() => setYearOfStudy(year)}
                            className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all text-center cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
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
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      Email Address <span className="text-slate-600 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. priya@gmail.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder:text-slate-600 text-sm transition-all"
                    />
                  </div>
                </div>
              ) : (
                /* STEPS 1 & 2: Render Questions */
                <div className="space-y-8 animate-in fade-in duration-200">
                  {currentSection?.questions.map((q) => {
                    if (!isQuestionVisible(q)) return null;

                    return (
                      <div key={q.id} className="space-y-3">
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                            <span>{q.title}</span>
                            {q.required && <span className="text-rose-400 text-xs">*</span>}
                          </h4>
                          {q.subtitle && (
                            <p className="text-xs text-slate-400 mt-0.5">{q.subtitle}</p>
                          )}
                        </div>

                        {/* Multi-Select Pills */}
                        {q.type === 'multi-select' && q.options && (
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2 pt-1">
                              {q.options.map((opt) => {
                                const isSelected =
                                  Array.isArray(answers[q.id]) && answers[q.id].includes(opt);
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => handleToggleMulti(q.id, opt)}
                                    className={`px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-150 flex items-center gap-2.5 text-left cursor-pointer ${
                                      isSelected
                                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/20'
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

                            {/* Optional write-in for Other */}
                            {q.hasOtherOption && (
                              <div className="pt-2">
                                <input
                                  type="text"
                                  placeholder="Other / Specific interest (Optional)..."
                                  value={otherInputs[`${q.id}_other`] || ''}
                                  onChange={(e) =>
                                    setOtherInputs((prev) => ({
                                      ...prev,
                                      [`${q.id}_other`]: e.target.value,
                                    }))
                                  }
                                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-hidden"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Single-Select Grid */}
                        {q.type === 'single-select' && q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            {q.options.map((opt) => {
                              const isSelected = answers[q.id] === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleSelectSingle(q.id, opt)}
                                  className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-150 flex items-center justify-between text-left cursor-pointer ${
                                    isSelected
                                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
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

                        {/* Text Field */}
                        {q.type === 'text' && (
                          <input
                            type="text"
                            value={answers[q.id] || ''}
                            onChange={(e) => handleTextChange(q.id, e.target.value)}
                            placeholder={q.placeholder || 'Type your response here...'}
                            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder:text-slate-600 text-sm transition-all"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Navigation Controls */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
                {currentStep > 0 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-3 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {isFinalStep ? (
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={submitting}
                    className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Your Survey...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Survey</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Continue to Next Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="w-full py-6 border-t border-slate-900 text-center text-xs text-slate-600">
        <p>Unisole Skill AI Labs • Student Career Diagnostic System</p>
      </footer>
    </div>
  );
}
