import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import { isAuthenticated, getUserName, logout } from '../utils/auth';
import { useAuthModal } from '../context/AuthModalContext';
import { 
  Menu, 
  X, 
  LogOut, 
  User, 
  ChevronRight, 
  Search, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  FileText, 
  Activity
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
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
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-200 ${
          scrolled 
            ? 'bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200/90 dark:border-zinc-800/90 py-2.5 sm:py-3 shadow-subtle' 
            : 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm py-3.5 sm:py-4 border-b border-zinc-200/50 dark:border-zinc-800/50'
        }`}
        id="navbar"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          
          {/* Brand Logo & Status Pill */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-sm sm:text-base font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5 group"
              onClick={() => {
                if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
                setMenuOpen(false);
              }}
            >
              <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-black text-xs shadow-xs group-hover:scale-105 transition-transform">
                U
              </div>
              <span className="font-extrabold tracking-tight">
                Unisole <span className="text-zinc-500 dark:text-zinc-400 font-medium">AI Labs</span>
              </span>
            </Link>

            {/* AI Status Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Core Ready
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {[
              { label: 'AI Masterclass (₹39)', path: '/workshop', icon: Sparkles, highlight: true },
              { label: 'Programs', path: '/programs', icon: BookOpen },
              { label: 'Events', path: '/events', icon: Calendar },
            ].map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-normal transition-all flex items-center gap-1.5 ${
                    link.highlight
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/25 font-bold shadow-xs'
                      : isActive
                      ? 'bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-white font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  <link.icon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Search Bar & Auth CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 text-xs transition-all dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-900 cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span>Search...</span>
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-zinc-200 bg-white font-mono text-[9px] text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800">
                ⌘K
              </kbd>
            </button>

            {loggedIn ? (
              <div className="relative">
                <button
                  className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
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
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => openAuthModal({ mode: 'login', source: 'NON_PAMPHLET' })}
                  className="inline-flex items-center justify-center font-semibold px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white text-xs transition-all duration-150 active:scale-[0.98] cursor-pointer"
                >
                  Login / Register
                </button>
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
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-zinc-950/50 backdrop-blur-xs animate-in fade-in duration-150" 
          onClick={() => setIsSearchOpen(false)}
        >
          <div 
            className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in duration-150" 
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-3.5 sm:p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-950/40">
              <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search programs, research blogs, events..."
                className="w-full bg-transparent outline-none text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                autoFocus
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-zinc-400 hover:text-zinc-600 p-1"
                >
                  Clear
                </button>
              )}
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="text-[10px] font-mono text-zinc-400 hover:text-zinc-600 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Search Results List */}
            <div className="p-3 max-h-[380px] overflow-y-auto space-y-1">
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider px-2 mb-1">
                {searchQuery ? `Results (${filteredSearch.length})` : 'Recommended Destinations'}
              </div>

              {filteredSearch.length === 0 ? (
                <div className="text-center py-8 text-zinc-400 text-xs font-medium">
                  No matches found for "{searchQuery}". Try exploring our <Link to="/programs" className="text-zinc-900 dark:text-white underline font-semibold" onClick={() => setIsSearchOpen(false)}>Programs Catalog</Link>.
                </div>
              ) : (
                filteredSearch.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors group"
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate(item.link);
                    }}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {item.desc}
                      </div>
                    </div>
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex-shrink-0 ml-2">
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
          className="fixed inset-0 z-50 md:hidden bg-zinc-950/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150"
          onClick={() => setMenuOpen(false)}
        >
          <div 
            className="w-full max-w-[280px] h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="space-y-6 pt-10">
              
              {/* Header Close */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs">
                    U
                  </div>
                  <span className="font-bold text-xs text-zinc-900 dark:text-white">Navigation</span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">Menu</span>
                
                {[
                  { label: 'AI Masterclass (₹39)', path: '/workshop', icon: Sparkles, desc: '2-Hour Intensive Session' },
                  { label: 'Programs Catalog', path: '/programs', icon: BookOpen, desc: 'AI Engineering & Dual tracks' },
                  { label: 'Meetups & Events', path: '/events', icon: Calendar, desc: 'Campus sessions & labs' },
                ].map((item) => {
                  const isActive = location.pathname === item.path;
                  const IconComp = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between p-2.5 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-white font-bold'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${isActive ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold block">{item.label}</span>
                          <span className="text-[10px] text-zinc-400 block">{item.desc}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3 h-3 text-zinc-400" />
                    </Link>
                  );
                })}
              </div>

              {/* Account Section */}
              {loggedIn ? (
                <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Account</span>
                  <div className="flex items-center gap-2.5 p-2.5 bg-zinc-50 dark:bg-zinc-950/60 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                    <div className="w-7 h-7 rounded-md bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
                      {userName.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white block truncate">{userName || 'Member'}</span>
                      <span className="text-[10px] text-zinc-400 block">Verified Account</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <Link
                      to="/profile"
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-zinc-400" />
                        My Profile
                      </span>
                      <ChevronRight className="w-3 h-3 text-zinc-400" />
                    </Link>
                    <button
                      type="button"
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 text-xs font-medium text-zinc-700 dark:text-zinc-300 text-left cursor-pointer"
                      onClick={handleMobileLogout}
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Access</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      openAuthModal({ mode: 'login', source: 'NON_PAMPHLET' });
                    }}
                    className="flex justify-center w-full font-semibold py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 text-white text-xs transition-colors cursor-pointer"
                  >
                    Login / Register
                  </button>
                </div>
              )}
            </div>

            <div className="text-[10px] text-zinc-400 text-center pt-4">
              © 2026 Unisole AI Labs
            </div>
          </div>
        </div>
      )}

    </>
  );
}