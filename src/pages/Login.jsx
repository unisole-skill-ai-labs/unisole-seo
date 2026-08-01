import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Login.css';

export default function Login() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const sendOtp = (e) => {
    e?.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Please enter a valid email address';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setStep(2);
      setLoading(false);
    }, 500);
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Enter the 6-digit code' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (otp !== '123456') {
        setErrors({ otp: 'Invalid OTP' });
        setLoading(false);
        return;
      }

      localStorage.setItem('token', 'demo_token_123');
      localStorage.setItem('userName', email.split('@')[0]);
      localStorage.setItem('userEmail', email);
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }, 600);
  };

  return (
    <>
      <Navbar />
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">
              {step === 1 ? 'Sign in with your email' : `Enter the code sent to ${email}`}
            </p>
          </div>

          {step === 1 && (
            <form className="login-form" onSubmit={sendOtp}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2.5 4a1.5 1.5 0 0 1 1.5-1.5h12a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H4a1.5 1.5 0 0 1-1.5-1.5V4Z" stroke="currentColor" strokeWidth="1.2" />
                    <path d="m2.5 4 7.5 5 7.5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && <span className="error-message show">{errors.email}</span>}
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                <span className="btn-text">{loading ? 'Sending...' : 'Send OTP'}</span>
                {!loading && (
                  <svg className="btn-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M6 9h8M12 5l4 4m-4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              <p className="signup-link">
                Don't have an account? <Link to="/register">Create one</Link>
              </p>
            </form>
          )}

          {step === 2 && (
            <form className="login-form" onSubmit={verifyOtp}>
              <div className="form-group">
                <label htmlFor="otp" className="form-label">Enter OTP</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="6" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M3 7l7 5 7-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <input
                    type="text"
                    id="otp"
                    className="form-input"
                    placeholder="6-digit code (use 123456)"
                    maxLength={6}
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                {errors.otp && <span className="error-message show">{errors.otp}</span>}
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                <span className="btn-text">
                  {success ? '✓ Signed in!' : loading ? 'Verifying...' : 'Verify & Sign In'}
                </span>
              </button>

              <p className="signup-link">
                Didn't get the code?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); sendOtp(); }}>Resend</a>
              </p>
            </form>
          )}
        </div>
        <div className="login-blob"></div>
      </div>
      <Footer />
    </>
  );
}