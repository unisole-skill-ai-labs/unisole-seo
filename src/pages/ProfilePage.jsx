import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getUserName, getUserEmail, logout } from '../utils/auth';
import { getMySubscription, getMyTransactions } from '../utils/supabase';
import './ProfilePage.css';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ProfilePage() {
  const name = getUserName();
  const email = getUserEmail();
  const [subscription, setSubscription] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [subRes, txRes] = await Promise.all([getMySubscription(), getMyTransactions()]);
      setSubscription(subRes.data);
      setTransactions(txRes.data || []);
      setLoading(false);
    })();
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
            <h2 className="profile-section-title">Subscription</h2>
            {loading ? (
              <p className="profile-empty">Loading...</p>
            ) : subscription ? (
              <p className="profile-sub-active">
                Active · {subscription.plan} · expires {formatDate(subscription.expires_at)}
              </p>
            ) : (
              <p className="profile-empty">No active subscription.</p>
            )}
          </div>

          <div className="profile-section">
            <h2 className="profile-section-title">Transactions</h2>
            {loading ? (
              <p className="profile-empty">Loading...</p>
            ) : transactions.length === 0 ? (
              <p className="profile-empty">No transactions yet.</p>
            ) : (
              <ul className="profile-tx-list">
                {transactions.map((tx) => (
                  <li className="profile-tx-item" key={tx.id}>
                    <div>
                      <span className="profile-tx-plan">{tx.plan}</span>
                      <span className="profile-tx-date">{formatDate(tx.created_at)}</span>
                    </div>
                    <span className="profile-tx-amount">
                      {tx.currency} {Number(tx.amount || 0).toLocaleString('en-IN')}
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
