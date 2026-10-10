import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X, Sparkles, Calendar, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'unisole_dismissed_deadline_notice_oct14_v1';

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(STORAGE_KEY);
      if (dismissed === 'true') {
        setIsVisible(false);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
  };

  if (!isVisible) return null;

  return (
    <div className="relative w-full bg-gradient-to-r from-zinc-950 via-indigo-950/90 to-zinc-950 border-b border-indigo-500/30 text-white z-50 text-xs shadow-md backdrop-blur-md">
      {/* Subtle background glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/15 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2.5 sm:gap-4 relative">
        
        {/* Left / Center: Announcement Content */}
        <div className="flex items-center gap-2 sm:gap-3 flex-grow overflow-hidden">
          {/* Pulsing Urgency Badge */}
          <span className="shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            <span>Deadline: 14 Oct</span>
          </span>

          {/* Notice Copy */}
          <p className="text-[11px] sm:text-xs font-medium text-zinc-200 truncate leading-tight">
            <span className="hidden md:inline text-zinc-400">Campus Roadshow Notice: </span>
            Last date for registration for <strong className="text-white font-bold underline decoration-indigo-400 decoration-1 underline-offset-2">Govt College Seema (Rohru)</strong> & <strong className="text-white font-bold underline decoration-indigo-400 decoration-1 underline-offset-2">M.L.S.M. College Sundernagar</strong> is <strong className="text-amber-300 font-extrabold">14th October</strong>.
          </p>
        </div>

        {/* Right: CTA & Dismiss Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/programs"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] sm:text-xs transition-all shadow-sm active:scale-95"
          >
            <span>Register Now</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          <button
            onClick={handleDismiss}
            type="button"
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Dismiss notice"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
