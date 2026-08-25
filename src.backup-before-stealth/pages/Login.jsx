import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileOtpAuth from '../components/MobileOtpAuth';
import './Login.css';

export default function Login() {
  return (
    <>
      <Navbar />
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in with your mobile number</p>
          </div>

          <MobileOtpAuth />

          <p className="signup-link" style={{ marginTop: '20px' }}>
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
        <div className="login-blob"></div>
      </div>
      <Footer />
    </>
  );
}

