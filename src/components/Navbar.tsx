import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import ProfileDropdown from './ProfileDropdown';
import { isAuthenticated, getUserName, logout } from '../utils/auth';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const refresh = () => {
      setLoggedIn(isAuthenticated());
      setUserName(getUserName());
    };
    refresh();
    window.addEventListener('authChange', refresh);
    return () => window.removeEventListener('authChange', refresh);
  }, []);

  // Close menu and profile dropdown on navigation
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile menu is open
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
      <header className="nav-wrap" id="navbar">
        <nav className="nav">
          <div className="nav-left">
            <Link
              to="/"
              className="nav-logo"
              onClick={() => {
                if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
                setMenuOpen(false);
              }}
            >
              <span>Unisole Skill AI Labs</span>
            </Link>
          </div>

          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <Link
              to="/programs"
              className={location.pathname === '/programs' ? 'active-nav-link' : ''}
              onClick={() => setMenuOpen(false)}
            >
              Programs
            </Link>
            <Link
              to="/events"
              className={location.pathname === '/events' ? 'active-nav-link' : ''}
              onClick={() => setMenuOpen(false)}
            >
              Events
            </Link>

            {loggedIn ? (
              <>
                {/* Desktop Profile Icon & Dropdown */}
                <div className="nav-icons desktop-only">
                  <div className="nav-icon-wrap">
                    <button
                      className="nav-profile-btn"
                      aria-label="Profile"
                      onClick={() => setProfileOpen((prev) => !prev)}
                    >
                      <span className="nav-profile-letter">{userName.charAt(0).toUpperCase() || 'U'}</span>
                    </button>
                    {profileOpen && <ProfileDropdown onClose={() => setProfileOpen(false)} />}
                  </div>
                </div>

                {/* Mobile Drawer Profile Section */}
                <div className="mobile-profile-section mobile-only">
                  <div className="mobile-user-card">
                    <div className="mobile-user-avatar">
                      {userName.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="mobile-user-info">
                      <span className="mobile-user-name">{userName || 'Active Member'}</span>
                      <span className="mobile-user-role">Student Account</span>
                    </div>
                  </div>

                  <div className="mobile-profile-actions">
                    <Link
                      to="/profile"
                      className="mobile-profile-action-btn"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="mobile-action-left">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                        </svg>
                        <span>My Profile</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </Link>

                    <button
                      type="button"
                      className="mobile-logout-action-btn"
                      onClick={handleMobileLogout}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <path d="M16 17l5-5-5-5" />
                        <path d="M21 12H9" />
                      </svg>
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="nav-auth-buttons">
                <Link
                  to="/login"
                  className="nav-btn-login"
                  onClick={() => setMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="nav-btn-signup"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div
          className="nav-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}