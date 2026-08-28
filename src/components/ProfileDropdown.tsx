import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getUserName } from '../utils/auth';
import { User, LogOut, BookOpen, ChevronRight, ShieldCheck } from 'lucide-react';

export default function ProfileDropdown({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const userName = getUserName() || 'Member';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  function handleLogout() {
    onClose();
    logout();
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  }

  return (
    <div
      className="w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
      ref={panelRef}
    >
      {/* User Header */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 mb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
            {userName.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{userName}</h4>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              Active Member
            </span>
          </div>
        </div>
      </div>

      {/* Menu Links */}
      <div className="space-y-0.5">
        <Link
          to="/profile"
          className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          onClick={onClose}
        >
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-slate-400" />
            <span>My Profile</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <Link
          to="/programs"
          className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          onClick={onClose}
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Explore Programs</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <div className="border-t border-slate-100 dark:border-slate-800/80 my-1 pt-1">
          <button
            type="button"
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors text-left cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}