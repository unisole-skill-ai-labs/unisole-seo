import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './PaymentSuccess.css';

export default function PaymentSuccess() {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setConfirmed(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Navbar />
      <section className="payment-success-page">
        <div className="payment-success-card">
          {!confirmed ? (
            <>
              <span className="payment-success-icon payment-success-icon--spin">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 11-9-9" />
                </svg>
              </span>
              <h1 className="payment-success-title">Confirming your payment...</h1>
              <p className="payment-success-sub">Please wait a moment while your subscription is activated.</p>
            </>
          ) : (
            <>
              <span className="payment-success-icon payment-success-icon--ok">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <h1 className="payment-success-title">Payment Successful</h1>
              <p className="payment-success-sub">
                Your subscription payment has been received. Your plan is now active.
              </p>
              <Link to="/profile" className="payment-success-btn">Go to Profile</Link>
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
