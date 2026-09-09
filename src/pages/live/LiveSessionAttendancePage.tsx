import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../store/apiSlice';
import { setCredentials } from '../../store/authSlice';
import confetti from 'canvas-confetti';
import {
  User,
  Phone,
  Building2,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

const DEFAULT_INSTITUTE = 'Government Hydro Engineering College Bandla, Bilaspur, HP';

const POPULAR_COURSES = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'Diploma', 'Other'];

const POPULAR_BRANCHES = [
  'Computer Science & Engineering (CSE)',
  'Electrical Engineering (EE)',
  'Civil Engineering (CE)',
  'Mechanical Engineering (ME)',
  'Artificial Intelligence & Data Science',
  'Other',
];

const YEARS = [
  { id: '1st Year', label: '1st Year', num: '1' },
  { id: '2nd Year', label: '2nd Year', num: '2' },
  { id: '3rd Year', label: '3rd Year', num: '3' },
  { id: '4th Year', label: '4th Year', num: '4' },
];

export default function LiveSessionAttendancePage() {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [institute, setInstitute] = useState(DEFAULT_INSTITUTE);
  const [course, setCourse] = useState('B.Tech');
  const [customCourse, setCustomCourse] = useState('');
  const [branch, setBranch] = useState('Computer Science & Engineering (CSE)');
  const [customBranch, setCustomBranch] = useState('');
  const [year, setYear] = useState('1st Year');
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  const finalCourse = course === 'Other' ? (customCourse.trim() || 'Other') : course;
  const finalBranch = branch === 'Other' ? (customBranch.trim() || 'Other') : branch;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#7c3aed', '#10b981', '#f59e0b'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || (cleanPhone.length !== 10 && cleanPhone.length !== 12)) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!institute.trim()) {
      setErrorMsg('Please specify your institute / college name.');
      return;
    }

    if (!finalCourse.trim()) {
      setErrorMsg('Please specify your course name.');
      return;
    }

    if (!finalBranch.trim()) {
      setErrorMsg('Please specify your branch name.');
      return;
    }

    if (!year) {
      setErrorMsg('Please select your year of study.');
      return;
    }

    const formattedBranchCombined = `${finalCourse} - ${finalBranch}`;
    const timestamp = new Date().toISOString();

    try {
      const res: any = await login({
        name: name.trim(),
        phone: cleanPhone.slice(-10),
        collegeName: institute.trim(),
        college: institute.trim(),
        branch: formattedBranchCombined,
        signupSource: 'LIVE_SESSION',
        source: 'LIVE_SESSION',
        metadata: {
          attendanceMarked: true,
          attendanceType: 'CAMPUS_ROADSHOW_SESSION',
          institute: institute.trim(),
          course: finalCourse,
          branchName: finalBranch,
          yearOfStudy: year,
          submittedAt: timestamp,
          source: 'LIVE_SESSION',
        },
      }).unwrap();

      if (res?.token && res?.user) {
        dispatch(setCredentials({ token: res.token, user: res.user }));
      }

      setSubmittedData({
        name: name.trim(),
        phone: cleanPhone.slice(-10),
        institute: institute.trim(),
        course: finalCourse,
        branch: finalBranch,
        year,
        time: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      });

      triggerConfetti();
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Failed to submit attendance. Please try again.';
      setErrorMsg(msg);
    }
  };

  const handleReset = () => {
    setSubmittedData(null);
    setName('');
    setPhone('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar Brand */}
      <header className="max-w-xl w-full mx-auto flex items-center justify-between z-10 pt-2 pb-4">
        <div className="flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/hehmsemf/image/upload/f_auto,q_auto,w_64/v1785299421/Unisole_logo_new_mhqbma.png"
            alt="Unisole Logo"
            className="w-8 h-8 rounded-xl object-contain shadow-md"
          />
          <div className="flex flex-col">
            <span className="font-black text-base tracking-tight text-white">
              Unisole <span className="text-indigo-400">Live</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">
              Campus Roadshow & Attendance Desk
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Session</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="my-auto max-w-xl w-full mx-auto z-10 py-4">
        {submittedData ? (
          /* Confirmation Success Card */
          <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Attendance Verified</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Attendance Recorded!
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                Thank you, <span className="text-zinc-100 font-bold">{submittedData.name}</span>. Your attendance has been successfully registered in the session records.
              </p>
            </div>

            {/* Details Summary Box */}
            <div className="bg-zinc-950/80 rounded-2xl p-4 sm:p-5 border border-zinc-800 text-left space-y-3 text-xs">
              <div className="flex items-start justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
                <span className="text-zinc-500 font-medium">Institute</span>
                <span className="text-zinc-200 font-semibold text-right max-w-[240px]">
                  {submittedData.institute}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 border-b border-zinc-800/80 pb-2.5">
                <div>
                  <span className="text-zinc-500 block text-[11px]">Course & Year</span>
                  <span className="text-zinc-200 font-bold">
                    {submittedData.course} ({submittedData.year})
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[11px]">Phone</span>
                  <span className="text-zinc-200 font-mono font-semibold">
                    +91 {submittedData.phone}
                  </span>
                </div>
              </div>

              <div className="flex items-start justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
                <span className="text-zinc-500 font-medium">Branch</span>
                <span className="text-zinc-200 font-semibold text-right">
                  {submittedData.branch}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-0.5 text-zinc-400">
                <span>Check-in Timestamp</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  Today at {submittedData.time}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Mark Another Student</span>
              </button>

              <a
                href="/programs"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <span>Explore AI Pathways</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          /* Attendance Registration Form */
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Session Attendance</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Mark Your Attendance
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                Please enter your details below to record your attendance for today's session.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Mobile Number *</span>
                </label>
                <div className="flex rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                  <div className="px-3.5 py-3 bg-zinc-900/90 text-xs font-bold text-zinc-400 border-r border-zinc-800 flex items-center gap-1.5 shrink-0 select-none">
                    <span>🇮🇳 +91</span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Institute Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Institute / College *</span>
                </label>
                <input
                  type="text"
                  required
                  value={institute}
                  onChange={(e) => setInstitute(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              {/* Course Name Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Course Name *</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_COURSES.map((c) => {
                    const active = course === c;
                    return (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setCourse(c)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          active
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
                {course === 'Other' && (
                  <input
                    type="text"
                    required
                    placeholder="Enter your course name (e.g. B.Sc, MBA)"
                    value={customCourse}
                    onChange={(e) => setCustomCourse(e.target.value)}
                    className="w-full mt-2 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-indigo-500"
                  />
                )}
              </div>

              {/* Branch Name Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Branch Name *</span>
                </label>
                <div className="space-y-1.5">
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {POPULAR_BRANCHES.map((b) => (
                      <option key={b} value={b} className="bg-zinc-900 text-zinc-200">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                {branch === 'Other' && (
                  <input
                    type="text"
                    required
                    placeholder="Enter your branch name"
                    value={customBranch}
                    onChange={(e) => setCustomBranch(e.target.value)}
                    className="w-full mt-2 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-indigo-500"
                  />
                )}
              </div>

              {/* Year Selection (1st year, 2nd year, 3rd year, 4th year) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Year of Study *</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {YEARS.map((y) => {
                    const active = year === y.id;
                    return (
                      <button
                        type="button"
                        key={y.id}
                        onClick={() => setYear(y.id)}
                        className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer border ${
                          active
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25 scale-[1.02]'
                            : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-black">{y.label}</span>
                        <span className="text-[9px] font-normal opacity-70">
                          {y.num === '1' ? 'Freshman' : y.num === '2' ? 'Sophomore' : y.num === '3' ? 'Junior' : 'Senior'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Recording Attendance...</span>
                    </>
                  ) : (
                    <>
                      <span>Register & Submit Attendance</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-xl w-full mx-auto text-center text-[11px] text-zinc-500 z-10 py-3">
        Powered by Unisole EdTech Engine • unisole.org
      </footer>
    </div>
  );
}
