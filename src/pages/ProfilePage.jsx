import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getUserName, getUserEmail, logout } from '../utils/auth';
import './ProfilePage.css';

export default function ProfilePage() {
  const name = getUserName();
  const email = getUserEmail();

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
