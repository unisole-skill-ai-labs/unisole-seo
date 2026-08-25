import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getUserName, getUserEmail, getUserPhone, getToken, logout, isAuthenticated, setAuthSession } from '../utils/auth';
import { API_BASE_URL as API_BASE } from '../config/api';
import './ProfilePage.css';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const isAuth = isAuthenticated();
  const [userName, setUserName] = useState(getUserName());
  const [userEmail, setUserEmail] = useState(getUserEmail());
  const [userPhone, setUserPhone] = useState(getUserPhone());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authentication Protection
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true, state: { from: '/profile' } });
    }
  }, [navigate]);

  useEffect(() => {
    async function fetchUserData() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Fetch current user details
        const meRes = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (meRes.ok) {
          const userData = await meRes.json();
          if (userData) {
            setAuthSession({ token, user: userData });
            setUserName(userData.name || (userData.phone ? `+91 ${userData.phone}` : 'Active Member'));
            setUserEmail(userData.email || '');
            setUserPhone(userData.phone || '');
          }
        }

        // Fetch user orders
        const ordersRes = await fetch(`${API_BASE}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(Array.isArray(ordersData) ? ordersData : ordersData.orders || []);
        }
      } catch {
        // graceful fallback
      } finally {
        setLoading(false);
      }
    }

    if (isAuth) {
      fetchUserData();
    }
  }, [isAuth]);

  if (!isAuth) {
    return null;
  }

  const displayName = userName && userName !== 'User' ? userName : (userPhone ? `+91 ${userPhone}` : 'Active Member');
  const avatarLetter = (displayName.replace('+91', '').trim().charAt(0) || 'U').toUpperCase();

  return (
    <>
      <Navbar />
      <section className="profile-page">
        <div className="profile-card">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {avatarLetter}
            </div>
          </div>
          <h1 className="profile-name">{displayName}</h1>
          {userPhone && <p className="profile-email" style={{ fontWeight: 600, color: 'var(--white)' }}>📱 +91 {userPhone}</p>}
          {userEmail && <p className="profile-email">{userEmail}</p>}

          <div className="profile-section">
            <h2 className="profile-section-title">My Account</h2>
            <p className="profile-sub-active">
              Active Member Profile
            </p>
          </div>

          {orders.length > 0 && (
            <div className="profile-section">
              <h2 className="profile-section-title">Recent Orders</h2>
              <ul className="profile-tx-list">
                {orders.map((order, idx) => (
                  <li className="profile-tx-item" key={order.id || idx}>
                    <div>
                      <span className="profile-tx-plan">
                        {order.title || order.course_name || `Order #${(order.id || idx + 1).toString().slice(0, 8)}`}
                      </span>
                      <span className="profile-tx-date">{formatDate(order.created_at || order.createdAt)}</span>
                    </div>
                    <span className="profile-tx-amount">
                      {order.amount != null
                        ? `₹${Number(order.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : '—'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="profile-actions">
            <Link to="/" className="profile-btn profile-btn-primary">Back to Home</Link>
            <button
              className="profile-btn profile-btn-secondary"
              onClick={() => { logout(); window.location.href = '/login'; }}
            >
              Log Out
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
