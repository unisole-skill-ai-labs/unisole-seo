import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import { isAuthenticated, getUserName, logout } from '../utils/auth';
import { 
  Menu, 
  X, 
  LogOut, 
  User, 
  ChevronRight, 
  Lock, 
  Search, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  FileText, 
  Terminal,
  Activity
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const refresh = () => {
      setLoggedIn(isAuthenticated());
      setUserName(getUserName());
    };
    refresh();
    window.addEventListener('authChange', refresh);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

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
    setIsSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (menuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, isSearchOpen]);

  const handleMobileLogout = () => {
    setMenuOpen(false);
    logout();
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  const searchItems = [
    { title: "Machine Learning & Production MLOps", category: "Programs", link: "/programs", desc: "FastAPI, Docker, RAG & PyTorch Pipelines" },
    { title: "Full Stack Web Development (AI-Powered)", category: "Programs", link: "/programs", desc: "React, Node.js, Express & LLM integration" },
    { title: "Complete ML + Full Stack Dual-Track", category: "Programs", link: "/programs", desc: "Dual credential engineering track" },
    { title: "AI Sandbox & Telemetry Gateway", category: "AI Tools", link: "/playground", desc: "Test live inference on Llama-3 & Mistral" },
    { title: "Applied AI Research & Technical Blogs", category: "Blogs", link: "/blogs", desc: "Deep dive articles by IIT & NIT mentors" },
    { title: "Community Meetups & AI Seminars", category: "Events", link: "/events", desc: "Upcoming campus showcases & sessions" },
  ];

  const filteredSearch = searchItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs py-2.5 sm:py-3' 
            : 'bg-white/60 dark:bg-slate-950/50 backdrop-blur-sm py-3.5 sm:py-4 border-b border-slate-200/40 dark:border-slate-800/40'
        }`}
        id="navbar"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          
          {/* Brand Logo & Status Pill */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5 group"
              onClick={() => {
                if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
                setMenuOpen(false);
              }}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-transform">
                U
              </div>
              <span className="font-extrabold tracking-tight">
                Unisole <span className="text-indigo-600 dark:text-indigo-400">AI Labs</span>
              </span>
            </Link>

            {/* AI Status Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 text-[10px] font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              AI Core Live
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {[
              { label: 'Programs', path: '/programs', icon: BookOpen },
              { label: 'Events', path: '/events', icon: Calendar },
              { label: 'Blogs', path: '/blogs', icon: FileText, lock: !loggedIn },
              { label: 'AI Sandbox', path: '/playground', icon: Terminal, lock: !loggedIn },
            ].map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.lock && <Lock className="w-3 h-3 text-slate-400 opacity-70" />}
                </Link>
              );
            })}
          </div>

          {/* Search Bar & Auth CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 text-xs transition-all dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900 cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search...</span>
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-slate-200 bg-white font-mono text-[9px] text-slate-500 dark:border-slate-700 dark:bg-slate-800">
                ⌘K
              </kbd>
            </button>

            {loggedIn ? (
              <div className="relative">
                <button
                  className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90 text-white font-black text-sm flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
                  aria-label="Profile menu"
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
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center font-bold px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-md shadow-indigo-600/20 text-xs transition-all duration-200 active:scale-[0.98]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Bar Actions */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900"
              aria-label="Search labs"
            >
              <Search className="w-4 h-4" />
            </button>

            {loggedIn && !menuOpen && (
              <Link
                to="/profile"
                className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs"
                aria-label="Profile"
              >
                {userName.charAt(0).toUpperCase() || 'U'}
              </Link>
            )}

            <button
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 cursor-pointer"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </nav>
      </header>

      {/* Global Search Modal Overlay */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200" 
          onClick={() => setIsSearchOpen(false)}
        >
          <div 
            className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200" 
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-950/40">
              <Search className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pathways, MLOps, AI sandbox, research..."
                className="w-full bg-transparent outline-none text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                autoFocus
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 p-1"
                >
                  Clear
                </button>
              )}
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="text-[10px] font-mono font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-lg transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Search Results List */}
            <div className="p-4 max-h-[380px] overflow-y-auto space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">
                {searchQuery ? `Results (${filteredSearch.length})` : 'Recommended Destinations'}
              </div>

              {filteredSearch.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-medium">
                  No matches found for "{searchQuery}". Try exploring our <Link to="/programs" className="text-indigo-600 underline font-bold" onClick={() => setIsSearchOpen(false)}>Programs Catalog</Link>.
                </div>
              ) : (
                filteredSearch.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-indigo-50/60 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group border border-transparent hover:border-indigo-100 dark:hover:border-slate-700/60"
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate(item.link);
                    }}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.desc}
                      </div>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex-shrink-0 ml-2">
                      {item.category}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {menuOpen && (
        <div 
          className="fixed inset-0 z-50 md:hidden bg-slate-950/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
          onClick={() => setMenuOpen(false)}
        >
          <div 
            className="w-full max-w-[300px] h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="space-y-6 pt-12">
              
              {/* Header Close */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                    U
                  </div>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">Navigation</span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Explore Hub</span>
                
                {[
                  { label: 'Programs Catalog', path: '/programs', icon: BookOpen, desc: 'AI Engineering & Dual tracks' },
                  { label: 'Meetups & Events', path: '/events', icon: Calendar, desc: 'Campus sessions & labs' },
                  { label: 'AI Blogs & Guides', path: '/blogs', icon: FileText, lock: !loggedIn, desc: 'Research & tutorials' },
                  { label: 'AI Sandbox & Telemetry', path: '/playground', icon: Terminal, lock: !loggedIn, desc: 'Test model weights' },
                ].map((item) => {
                  const isActive = location.pathname === item.path;
                  const IconComp = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between p-3 rounded-2xl transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold block">{item.label}</span>
                          <span className="text-[10px] text-slate-400 block">{item.desc}</span>
                        </div>
                      </div>
                      {item.lock ? (
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Account Section */}
              {loggedIn ? (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Account</span>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                      {userName.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">{userName || 'Member'}</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">Active Account</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Link
                      to="/profile"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                    <button
                      type="button"
                      className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 text-xs font-bold text-slate-700 dark:text-slate-300 text-left cursor-pointer"
                      onClick={handleMobileLogout}
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Access Portal</span>
                  <Link
                    to="/login"
                    className="flex justify-center w-full font-bold py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 text-xs transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="flex justify-center w-full font-bold py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs transition-colors shadow-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-400 text-center pt-6">
              © 2026 Unisole Skill AI Labs
            </div>
          </div>
        </div>
      )}
    </>
  );
}