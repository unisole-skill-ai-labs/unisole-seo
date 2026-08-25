import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import ProfileDropdown from './ProfileDropdown';
import { isAuthenticated, getUserName } from '../utils/auth';

export default function Navbar() {
  const location = useLocation();
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
              <span>UnisoleAI</span>
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
              <div className="nav-icons">
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