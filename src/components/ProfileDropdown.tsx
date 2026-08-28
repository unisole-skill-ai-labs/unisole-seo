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
      className="w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-minimal border border-zinc-200 dark:border-zinc-800 p-1.5 z-50 animate-in fade-in duration-150"
      ref={panelRef}
    >
      {/* User Header */}
      <div className="p-2.5 border-b border-zinc-100 dark:border-zinc-800 mb-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs flex items-center justify-center">
            {userName.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">{userName}</h4>
            <span className="text-[10px] text-zinc-400 font-mono block">
              Verified Member
            </span>
          </div>
        </div>
      </div>

      {/* Menu Links */}
      <div className="space-y-0.5">
        <Link
          to="/profile"
          className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-200 transition-colors"
          onClick={onClose}
        >
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span>My Profile</span>
          </div>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
        </Link>

        <Link
          to="/programs"
          className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-200 transition-colors"
          onClick={onClose}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            <span>Explore Programs</span>
          </div>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
        </Link>

        <div className="border-t border-zinc-100 dark:border-zinc-800 my-1 pt-1">
          <button
            type="button"
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 text-xs font-medium text-zinc-700 dark:text-zinc-200 transition-colors text-left cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="w-3.5 h-3.5 text-rose-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}