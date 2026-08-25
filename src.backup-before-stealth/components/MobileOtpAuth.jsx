import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setAuthSession } from '../utils/auth';
import { API_BASE_URL as API_BASE } from '../config/api';

export default function MobileOtpAuth({ onSuccess, onError }) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = new URLSearchParams(location.search).get('redirect') || '/';

  const [step, setStep] = useState(1); // 1: Phone + Name, 2: OTP
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [countdown, setCountdown] = useState(0);

  const otpInputRef = useRef(null);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (step === 2 && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          name: name.trim() || undefined,
        }),
      });

      const data = await res.json();
      const code = data.dummyOtp || '0000';
      setOtp(code);
      setSuccessMsg(`OTP sent to +91 ${cleanPhone}! (Code: ${code})`);
      setStep(2);
      setCountdown(30);
    } catch {
      // Fallback for seamless developer testing
      const randomOtp = '0000';
      setOtp(randomOtp);
      setSuccessMsg(`OTP sent to +91 ${cleanPhone}! (Code: ${randomOtp})`);
      setStep(2);
      setCountdown(30);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      setErrorMsg('Please provide a valid mobile number');
      return;
    }

    if (!otp || otp.trim().length === 0) {
      setErrorMsg('Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          otp: otp.trim(),
          name: name.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.error || data.message || 'Verification failed');
      }

      setAuthSession({
        token: data.token || data.accessToken,
        user: data.user,
      });

      if (onSuccess) {
        onSuccess(data);
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="mobile-otp-auth">
      {errorMsg && (
        <div className="auth-alert auth-alert-error">
          <span>⚠️ {errorMsg}</span>
        </div>
      )}

      {successMsg && step === 2 && (
        <div className="auth-alert auth-alert-success">
          <span>✅ {successMsg}</span>
        </div>
      )}

      {step === 1 ? (
        /* STEP 1: Name and Mobile Number */
        <form onSubmit={handleSendOtp} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="otp-name">Full Name</label>
            <div className="input-wrapper">
              <input
                id="otp-name"
                type="text"
                className="form-input no-icon"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="otp-phone">Mobile Number</label>
            <div className="input-wrapper phone-input-wrapper">
              <span className="phone-prefix">🇮🇳 +91</span>
              <input
                id="otp-phone"
                type="tel"
                maxLength={10}
                required
                className="form-input phone-input"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
            style={{ width: '100%', marginTop: '10px' }}
          >
            <span className="btn-text">
              {loading ? 'Sending Code...' : 'Get Verification Code →'}
            </span>
          </button>
        </form>
      ) : (
        /* STEP 2: OTP Verification */
        <form onSubmit={handleVerifyOtp} className="login-form">
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="form-label" htmlFor="otp-code">4-Digit Code</label>
              <button
                type="button"
                onClick={() => { setStep(1); setErrorMsg(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent, #6366f1)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
              >
                ← Change Number
              </button>
            </div>

            <input
              id="otp-code"
              ref={otpInputRef}
              type="text"
              maxLength={6}
              required
              className="form-input"
              style={{ textAlign: 'center', letterSpacing: '0.4em', fontSize: '18px', fontWeight: 700, paddingLeft: '14px' }}
              placeholder="0 0 0 0"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
            style={{ width: '100%', marginTop: '10px' }}
          >
            <span className="btn-text">
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </span>
          </button>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            {countdown > 0 ? (
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                Resend code in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                style={{ background: 'none', border: 'none', color: 'var(--accent, #6366f1)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Resend Verification Code
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

