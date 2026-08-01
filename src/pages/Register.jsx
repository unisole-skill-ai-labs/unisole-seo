import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Login.css';

export default function Register() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const sendOtp = (e) => {
    e?.preventDefault();
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
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
      localStorage.setItem('userName', fullName.trim());
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
        <div className="login-container reveal-up">
          <div className="login-header">
            <h1 className="login-title word-reveal">Create Account</h1>
            <p className="login-subtitle">
              {step === 1 ? 'Sign up to get started' : `Enter the code sent to ${email}`}
            </p>
          </div>

          {step === 1 && (
            <form className="login-form" onSubmit={sendOtp}>
              <div className="form-group reveal-up" style={{ '--delay': '0.1s' }}>
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="6.5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M3.5 17c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <input
                    type="text"
                    id="fullName"
                    className="form-input"
                    placeholder="Your Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                {errors.fullName && <span className="error-message show">{errors.fullName}</span>}
              </div>

              <div className="form-group reveal-up" style={{ '--delay': '0.15s' }}>
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

              <button type="submit" className="btn-login reveal-up" style={{ '--delay': '0.2s' }} disabled={loading}>
                <span className="btn-text">{loading ? 'Sending...' : 'Send OTP'}</span>
                {!loading && (
                  <svg className="btn-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M6 9h8M12 5l4 4m-4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              <p className="signup-link reveal-up" style={{ '--delay': '0.4s' }}>
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </form>
          )}

          {step === 2 && (
            <form className="login-form" onSubmit={verifyOtp}>
              <div className="form-group reveal-up">
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

              <button type="submit" className="btn-login reveal-up" disabled={loading}>
                <span className="btn-text">
                  {success ? '✓ Account created!' : loading ? 'Verifying...' : 'Verify & Create Account'}
                </span>
              </button>

              <p className="signup-link reveal-up">
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