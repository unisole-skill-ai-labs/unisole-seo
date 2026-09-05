import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Sparkles,
  Calendar,
  Clock,
  Video,
  Download,
  Share2,
  ArrowRight,
  ShieldCheck,
  FileText,
  Terminal,
  Award,
  ExternalLink,
} from 'lucide-react';
import { getUser, isAuthenticated } from '../../utils/auth';
import { useGetWorkshopStatusQuery } from '../../store/apiSlice';

export default function WorkshopSuccessPage() {
  const navigate = useNavigate();
  const user = getUser();
  const loggedIn = isAuthenticated();

  const { data: statusData } = useGetWorkshopStatusQuery(
    user?.phone ? { phone: user.phone } : undefined,
    { skip: !loggedIn }
  );

  const currentUser = statusData?.user || user;
  const isPaid = statusData?.tokenPaid || currentUser?.metadata?.workshopTokenPaid;

  useEffect(() => {
    document.title = 'Registration Confirmed | AI Masterclass 2026';

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'],
      });
    } catch {
      // safe fallback if confetti fails
    }
  }, []);

  const handleAddToCalendar = () => {
    const title = encodeURIComponent('Unisole 2-Hour AI Masterclass: Stop Chatting. Start Systemizing.');
    const details = encodeURIComponent(
      'Live 2-Hour Intensive Masterclass on Advanced AI Prompting & Context Engineering.\nZoom Link: https://zoom.us/j/unisole-ai-masterclass\n\nBring your laptop with access to ChatGPT, Claude, or Gemini.'
    );
    const location = encodeURIComponent('Live Interactive Zoom Webinar');
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between antialiased selection:bg-indigo-600 selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-indigo-600/20 via-blue-600/10 to-transparent blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header Bar */}
      <header className="relative z-10 py-5 px-4 sm:px-8 border-b border-slate-800/80 backdrop-blur-md bg-slate-950/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/workshop" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/25">
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
            ← Back to Masterclass Overview
          </Link>
        </div>
      </header>

      {/* Main Confirmation Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="max-w-2xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-8 text-center">
          
          {/* Confirmed Icon & Badge */}
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/15">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Registration Confirmed • ₹39 Token Received
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              You're Officially Registered!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Welcome to the <strong>From Novice to Power User</strong> AI Masterclass. Your seat has been locked and your participant kit is ready.
            </p>
          </div>

          {/* Ticket Information Card */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attendee Pass</span>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                {currentUser?.id ? `PASS-${currentUser.id.slice(0, 8).toUpperCase()}` : 'PASS-CONFIRMED'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">Attendee Name:</span>
                <span className="text-white font-bold text-sm">{currentUser?.name || 'Registered Participant'}</span>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">WhatsApp Mobile:</span>
                <span className="text-white font-mono">{currentUser?.phone || 'Linked to account'}</span>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">Institution / College:</span>
                <span className="text-white font-medium">{currentUser?.collegeName || 'Academic Partner'}</span>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">Token Fee Paid:</span>
                <span className="text-emerald-400 font-bold">
                  {isPaid ? '₹39 (100% Confirmed)' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Live Zoom Access & Calendar Details */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 text-left space-y-4 shadow-lg shadow-indigo-500/10">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Video className="w-4 h-4 text-cyan-400" />
              <span>Live Zoom Webinar Access</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span><strong>Duration:</strong> 2 Hours (Intensive Masterclass + Live Q&amp;A)</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                <span><strong>Access Link:</strong> Dispatched to your WhatsApp mobile and email before the session.</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleAddToCalendar}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Add to Google Calendar</span>
              </button>

              <a
                href="#materials"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
              >
                <span>View Participant Kit ↓</span>
              </a>
            </div>
          </div>

          {/* Masterclass Materials Kit */}
          <div id="materials" className="space-y-4 text-left">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Your Masterclass Deliverables Kit
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">2-Hour Participant Interactive Workbook</h4>
                    <p className="text-[11px] text-slate-400">Auditing exercises &amp; parameter matchmaking puzzles</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
                  Included
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Universal Prompt Blueprint Library</h4>
                    <p className="text-[11px] text-slate-400">P-G-C-I-F-C &amp; A.I.D.E.A template blocks</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
                  Included
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Official Unisole AI Masterclass Certificate</h4>
                    <p className="text-[11px] text-slate-400">Verifiable credential generated after live session</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
                  Unlocked
                </span>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <Link to="/workshop" className="hover:text-white transition-colors">
              ← Return to Workshop Home
            </Link>
            <Link to="/programs" className="hover:text-indigo-300 font-semibold transition-colors">
              Explore Unisole Long-Term AI Fellowships →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>© 2026 Unisole Skill AI Labs • Academic Partner Network</p>
      </footer>
    </div>
  );
}
