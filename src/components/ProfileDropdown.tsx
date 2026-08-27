import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth'; // adjust path to match your project structure
import './ProfileDropdown.css';

export default function ProfileDropdown({ onClose }) {
  const panelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
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
    <div className="profile-dropdown" ref={panelRef}>
      <ul className="profile-list">
        <li>
          <Link to="/profile" className="profile-item" onClick={onClose}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            <span>My Profile</span>
          </Link>
        </li>
        <li className="profile-divider" />
        <li>
          <button
            type="button"
            className="profile-item profile-logout"
            onClick={handleLogout}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            <span>Log Out</span>
          </button>
        </li>
      </ul>
    </div>
  );
}