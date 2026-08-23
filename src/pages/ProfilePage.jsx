import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getUserName, getUserEmail, getToken, logout } from '../utils/auth';
import './ProfilePage.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ProfilePage() {
  const name = getUserName();
  const email = getUserEmail();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : data.orders || []);
        }
      } catch {
        // graceful fallback
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  return (
    <>
      <Navbar />
      <section className="profile-page">
        <div className="profile-card">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {name.charAt(0).toUpperCase()}
            </div>
          </div>
          <h1 className="profile-name">{name}</h1>
          <p className="profile-email">{email}</p>

          <div className="profile-section">
            <h2 className="profile-section-title">My Learning Account</h2>
            <p className="profile-sub-active">
              Active Unisole Student Profile
            </p>
          </div>

          <div className="profile-section">
            <h2 className="profile-section-title">Recent Orders & Enrollments</h2>
            {loading ? (
              <p className="profile-empty">Loading...</p>
            ) : orders.length === 0 ? (
              <p className="profile-empty">No orders or enrollments yet.</p>
            ) : (
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
                        : 'Enrolled'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

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
