import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../../utils/auth';
import {
  Sparkles,
  LogOut,
  Atom,
  Cpu,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  User as UserIcon,
} from 'lucide-react';

interface IaptNavbarProps {
  activeTab?: 'home' | 'nain' | 'workshop';
}

export default function IaptNavbar({ activeTab = 'home' }: IaptNavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/iapt/login', { replace: true });
  };

  const navLinks = [
    { label: 'Home', path: '/iapt', key: 'home' },
    { label: 'NAIN', path: '/iapt/nain', key: 'nain', badge: 'Initiative' },
    { label: '7-Day Workshop', path: '/iapt/workshop', key: 'workshop', badge: 'Curriculum' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/80 text-white selection:bg-blue-600">
      {/* Top micro-announcement bar */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/50 to-slate-950 px-4 py-1.5 border-b border-slate-800/50 text-[11px] text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-blue-400">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Official MoU Partnership
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">
              Indian Association of Physics Teachers (IAPT) × Unisole
            </span>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="flex items-center gap-1.5 text-slate-300">
                <UserIcon className="w-3 h-3 text-blue-400" />
                <span className="text-slate-400 hidden sm:inline">Member:</span>
                <span className="font-semibold text-white max-w-[120px] sm:max-w-[180px] truncate">
                  {currentUser.name || currentUser.phone || 'Educator'}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors px-2 py-0.5 rounded hover:bg-slate-800/60 cursor-pointer"
              title="Logout from IAPT session"
            >
              <LogOut className="w-3 h-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand logo */}
          <Link
            to="/iapt"
            className="flex items-center gap-3 group transition-transform duration-200 active:scale-98"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/35 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center gap-0.5">
                <Atom className="w-5 h-5 text-blue-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-blue-200 transition-colors">
                  IAPT
                </span>
                <span className="text-xs font-light text-cyan-400">×</span>
                <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  UNISOLE
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium -mt-0.5">
                AI in Physics Portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                activeTab === link.key ||
                (link.path === '/iapt' && location.pathname === '/iapt') ||
                (link.path !== '/iapt' && location.pathname.startsWith(link.path));

              return (
                <Link
                  key={link.key}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white bg-blue-600/20 border border-blue-500/40 shadow-sm shadow-blue-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/20 text-cyan-300 font-bold border border-blue-400/30">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full" />
                  )}
                </Link>
              );
            })}

            <div className="h-4 w-px bg-slate-800 mx-2" />

            <a
              href="#partnership"
              onClick={(e) => {
                if (location.pathname !== '/iapt') {
                  navigate('/iapt#partnership');
                }
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              About MoU
            </a>

            <Link
              to="/iapt/workshop"
              className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
            >
              <span>Explore Programs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </nav>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive =
                activeTab === link.key ||
                (link.path === '/iapt' && location.pathname === '/iapt') ||
                (link.path !== '/iapt' && location.pathname.startsWith(link.path));

              return (
                <Link
                  key={link.key}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600/25 text-white border border-blue-500/40'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            <Link
              to="/iapt/nain"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400"
            >
              View NAIN Initiative
            </Link>
            <Link
              to="/iapt/workshop"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-md"
            >
              View 7-Day Workshop Curriculum
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
