import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getUserName } from '../utils/auth';
import './PaymentSuccess.css';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('razorpay_payment_id') || searchParams.get('payment_id') || searchParams.get('razorpay_payment_link_id') || searchParams.get('id');
  const userName = getUserName();
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    if (paymentId) {
      navigator.clipboard.writeText(paymentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <Navbar />
      <section className="payment-success-page">
        <div className="payment-success-card">
          <div className="success-icon-badge">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <span className="payment-tag">Payment Received</span>

          <h1 className="payment-success-title">
            Thank You{userName && userName !== 'Learner' ? `, ${userName}` : ''}!
          </h1>

          {/* 24-Hour Notice */}
          <div className="notice-box-compact">
            <span className="notice-icon">⏱️</span>
            <p>
              Your purchased course will get reflected in the <strong>enrolled section after 24 hours</strong>.
            </p>
          </div>

          {/* Transaction ID if present */}
          {paymentId && (
            <div className="payment-ref-row">
              <span className="ref-label">Transaction ID:</span>
              <code className="ref-code">{paymentId}</code>
              <button type="button" onClick={handleCopyId} className="copy-btn">
                {copied ? '✓' : 'Copy'}
              </button>
            </div>
          )}

          {/* Action CTAs */}
          <div className="payment-action-buttons">
            <Link to="/profile" className="btn-primary-action">
              Go to Profile
            </Link>
            <Link to="/programs" className="btn-secondary-action">
              Explore Programs
            </Link>
          </div>

          {/* Short Contact Support */}
          <div className="support-compact-note">
            Need help? Call <a href="tel:+918219691201" className="support-link">+91 8219691201</a> or email <a href="mailto:unisole.empower@gmail.com" className="support-link">unisole.empower@gmail.com</a>.
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
