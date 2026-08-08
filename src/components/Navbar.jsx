import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import ProfileDropdown from './ProfileDropdown';
import { isAuthenticated, getUserName } from '../utils/auth'; // adjust path

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

  return (
    <header className="nav-wrap" id="navbar">
      <nav className="nav">
        <div className="nav-left">
          <Link to="/" className="nav-logo" onClick={() => { if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
        
            <span>UnisoleAI</span>
          </Link>
        </div>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/programs">Programs</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/events">Events</Link>
          {loggedIn ? (
            <div className="nav-icons">
              <div className="nav-icon-wrap">
                <button className="nav-profile-btn" aria-label="Profile" onClick={() => setProfileOpen((prev) => !prev)}>
                  <span className="nav-profile-letter">{userName.charAt(0).toUpperCase() || 'U'}</span>
                </button>
                {profileOpen && <ProfileDropdown onClose={() => setProfileOpen(false)} />}
              </div>
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <Link to="/login" className="nav-btn-login">Log In</Link>
              <Link to="/register" className="nav-btn-signup">Sign Up</Link>
            </div>
          )}
        </div>

        <button
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span><span></span><span></span>
        </button>
      </nav>
    </header>
  );
}