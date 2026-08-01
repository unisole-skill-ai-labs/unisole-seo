import { useEffect, useRef, useState } from 'react';
import './NotificationDropdown.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  const intervals = [
    { label: 'y', secs: 31536000 },
    { label: 'mo', secs: 2592000 },
    { label: 'd', secs: 86400 },
    { label: 'h', secs: 3600 },
    { label: 'm', secs: 60 },
  ];
  for (const { label, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count}${label} ago`;
  }
  return 'just now';
}

export default function NotificationDropdown({ onClose }) {
  const panelRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    async function fetchNotifications() {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Failed to load notifications');
        } else {
          setNotifications(data.notifications);
        }
      } catch (err) {
        setError('Network error, please try again');
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    const token = localStorage.getItem('token');
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      // silent fail, UI already updated optimistically
    }
  };

  const isEmpty = !loading && !error && notifications.length === 0;

  return (
    <div className="notif-dropdown" ref={panelRef}>
      <div className="notif-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M18 9a6 6 0 10-12 0c0 6-2.5 7.5-2.5 7.5h17S18 15 18 9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M10.5 20a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span>Notifications {!loading && !isEmpty ? `(${notifications.length})` : ''}</span>
      </div>

      <div className="notif-body">
        {loading ? (
          <div className="notif-empty">
            <p className="notif-empty-sub">Loading...</p>
          </div>
        ) : error ? (
          <div className="notif-empty">
            <p className="notif-empty-title">Couldn't load notifications</p>
            <p className="notif-empty-sub">{error}</p>
          </div>
        ) : isEmpty ? (
          <div className="notif-empty">
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none" className="notif-empty-icon">
              <circle cx="45" cy="45" r="30" stroke="var(--muted)" strokeWidth="1.5" />
              <path d="M32 50c4 4 8 6 13 6s9-2 13-6" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="36" cy="38" r="2.2" fill="var(--muted)" />
              <circle cx="54" cy="38" r="2.2" fill="var(--muted)" />
            </svg>
            <p className="notif-empty-title">No notifications yet</p>
            <p className="notif-empty-sub">We'll let you know when something arrives.</p>
          </div>
        ) : (
          <ul className="notif-list">
            {notifications.map((n) => (
              <li
                key={n._id}
                className={`notif-item ${!n.isRead ? 'notif-item-unread' : ''}`}
                onClick={() => !n.isRead && markAsRead(n._id)}
              >
                {!n.isRead && <span className="notif-dot" />}
                <div className="notif-content">
                  <p className="notif-title">{n.title}</p>
                  <p className="notif-text">{n.message}</p>
                  <span className="notif-time">{timeAgo(n.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="notif-footer">
        <a href="/notifications">See all notifications</a>
      </div>
    </div>
  );
}