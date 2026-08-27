import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import { isAuthenticated, getUserName, logout } from '../utils/auth';
import { Menu, X, LogOut, User, Compass, ChevronRight, Lock, Search, Terminal } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('authChange', refresh);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
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
            ? 'bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/40 shadow-xs py-3' 
            : 'bg-white/20 dark:bg-transparent backdrop-blur-xs py-4 border-b border-slate-200/20'
        }`}
        id="navbar"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2"
              onClick={() => {
                if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
                setMenuOpen(false);
              }}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-black text-sm">
                U
              </div>
              <span className="hidden sm:inline">Unisole AI Labs</span>
              <span className="inline sm:hidden">Unisole</span>
            </Link>

            {/* AI Status Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              AI Core Online
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              to="/programs"
              className={`text-xs font-bold uppercase tracking-wider transition-colors hover:text-slate-900 dark:hover:text-white ${
                location.pathname === '/programs' ? 'text-slate-900 dark:text-white border-b-2 border-slate-800 dark:border-white pb-1' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Programs
            </Link>
            <Link
              to="/events"
              className={`text-xs font-bold uppercase tracking-wider transition-colors hover:text-slate-900 dark:hover:text-white ${
                location.pathname === '/events' ? 'text-slate-900 dark:text-white border-b-2 border-slate-800 dark:border-white pb-1' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Events
            </Link>
            <Link
              to="/blogs"
              className={`text-xs font-bold uppercase tracking-wider transition-colors hover:text-slate-900 dark:hover:text-white flex items-center gap-1 ${
                location.pathname === '/blogs' ? 'text-slate-900 dark:text-white border-b-2 border-slate-800 dark:border-white pb-1' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Blogs
              {!loggedIn && <Lock className="w-3 h-3 text-slate-400" />}
            </Link>
            <Link
              to="/playground"
              className={`text-xs font-bold uppercase tracking-wider transition-colors hover:text-slate-900 dark:hover:text-white flex items-center gap-1 ${
                location.pathname === '/playground' ? 'text-slate-900 dark:text-white border-b-2 border-slate-800 dark:border-white pb-1' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              AI Sandbox
              {!loggedIn && <Lock className="w-3 h-3 text-slate-400" />}
            </Link>
          </div>

          {/* Interactive Search Bar & Auth CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 text-xs transition-all dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search labs...</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-slate-200 bg-white font-mono text-[9px] text-slate-400 dark:border-slate-700 dark:bg-slate-800">
                ⌘K
              </kbd>
            </button>

            {loggedIn ? (
              <div className="relative">
                <button
                  className="w-9 h-9 rounded-full bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90 text-white font-bold text-sm flex items-center justify-center shadow-md active:scale-95 transition-all"
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
                  className="inline-flex items-center justify-center font-bold px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs transition-all duration-200 active:scale-[0.98]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {loggedIn && !menuOpen && (
              <Link
                to="/profile"
                className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center"
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

      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/45 backdrop-blur-xs animate-in fade-in duration-200" 
          onClick={() => setIsSearchOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses, labs, and research archives..."
                className="w-full bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                autoFocus
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-white border border-slate-200 dark:border-slate-750 px-2.5 py-1 rounded-lg transition-colors"
              >
                ESC
              </button>
            </div>
            <div className="p-4 max-h-[300px] overflow-y-auto">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Suggested Labs & Commands</div>
              <div className="space-y-1">
                {[
                  { title: "Advanced Machine Learning & MLOps", category: "Programs", link: "/programs" },
                  { title: "Retrieval Augmented Generation (RAG) Setup", category: "AI Sandbox", link: "/playground" },
                  { title: "Applied AI Research Collaborations", category: "Research", link: "/" },
                  { title: "Docker Containers & Microservices", category: "Developer Sandbox", link: "/playground" }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate(item.link);
                    }}
                  >
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-350 group-hover:text-slate-900 dark:group-hover:text-white">
                      {item.title}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
                    location.pathname === '/programs' ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-350'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Programs Catalog
                </Link>
                <Link
                  to="/events"
                  className={`text-sm font-bold block py-2 ${
                    location.pathname === '/events' ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-350'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Meetups & Events
                </Link>
                <Link
                  to="/blogs"
                  className={`text-sm font-bold py-2 flex items-center justify-between ${
                    location.pathname === '/blogs' ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-350'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>AI Blogs Portal</span>
                  {!loggedIn && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                </Link>
                <Link
                  to="/playground"
                  className={`text-sm font-bold py-2 flex items-center justify-between ${
                    location.pathname === '/playground' ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-350'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>AI Sandbox</span>
                  {!loggedIn && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                </Link>
              </div>

              {loggedIn ? (
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2 block">Account</span>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-150 dark:border-slate-800/40">
                    <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold text-sm flex items-center justify-center">
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
                    className="flex justify-center w-full font-bold py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs transition-colors shadow-xs"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-450 text-center">
              © 2026 Unisole Skill AI Labs
            </div>
          </div>
        </div>
      )}
    </>
  );
}