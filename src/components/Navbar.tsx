import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import { isAuthenticated, getUserName, logout } from '../utils/auth';
import { Menu, X, LogOut, User, Compass, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setLoggedIn(isAuthenticated());
      setUserName(getUserName());
    };
    refresh();
    window.addEventListener('authChange', refresh);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('authChange', refresh);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleMobileLogout = () => {
    setMenuOpen(false);
    logout();
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/40 shadow-xs py-3' 
            : 'bg-transparent py-5'
        }`}
        id="navbar"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-md sm:text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2"
              onClick={() => {
                if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
                setMenuOpen(false);
              }}
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                U
              </div>
              <span className="hidden sm:inline">Unisole Skill AI Labs</span>
              <span className="inline sm:hidden">Unisole AI</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/programs"
              className={`text-xs font-bold uppercase tracking-wider transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                location.pathname === '/programs' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-350'
              }`}
            >
              Programs
            </Link>
            <Link
              to="/events"
              className={`text-xs font-bold uppercase tracking-wider transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                location.pathname === '/events' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-350'
              }`}
            >
              Events
            </Link>

            {loggedIn ? (
              <div className="relative">
                <button
                  className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center shadow-md active:scale-95 transition-all"
                  aria-label="Profile"
                  onClick={() => setProfileOpen((prev) => !prev)}
                >
                  {userName.charAt(0).toUpperCase() || 'U'}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-3 z-50">
                    <ProfileDropdown onClose={() => setProfileOpen(false)} />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350 hover:text-slate-900 px-3 py-1.5 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center font-bold px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-750 text-white text-xs transition-all duration-200 active:scale-[0.98]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-3">
            {loggedIn && !menuOpen && (
              <Link
                to="/profile"
                className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center"
              >
                {userName.charAt(0).toUpperCase() || 'U'}
              </Link>
            )}
            <button
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </nav>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-slate-950/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-[280px] h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="space-y-8 pt-20">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Menu Navigation</span>
                <Link
                  to="/programs"
                  className={`text-sm font-bold block py-2 ${
                    location.pathname === '/programs' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-350'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Programs Catalog
                </Link>
                <Link
                  to="/events"
                  className={`text-sm font-bold block py-2 ${
                    location.pathname === '/events' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-350'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Meetups & Events
                </Link>
              </div>

              {loggedIn ? (
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2 block">Account</span>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-150 dark:border-slate-800/40">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                      {userName.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">{userName || 'Member'}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Active Account</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/profile"
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs font-bold text-slate-700 dark:text-slate-300"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile Page
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 text-xs font-bold text-slate-700 dark:text-slate-300 text-left"
                      onClick={handleMobileLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2 block">Join Platform</span>
                  <Link
                    to="/login"
                    className="flex justify-center w-full font-bold py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 text-xs transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="flex justify-center w-full font-bold py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-750 text-white text-xs transition-colors shadow-sm shadow-indigo-500/10"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-400 text-center">
              © 2026 Unisole Skill AI Labs
            </div>
          </div>
        </div>
      )}
    </>
  );
}