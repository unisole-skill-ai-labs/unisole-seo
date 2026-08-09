import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCurrentUser, saveTransaction, setActiveSubscription } from '../utils/supabase';
import { getUserEmail } from '../utils/auth';
import './PaymentSuccess.css';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('saving');
  const [error, setError] = useState('');

  useEffect(() => {
    const record = async () => {
      const paymentId = searchParams.get('razorpay_payment_id');
      const paymentLinkId = searchParams.get('razorpay_payment_link_id');
      const paymentStatus = searchParams.get('razorpay_payment_link_status') || 'completed';
      const referenceId = searchParams.get('razorpay_payment_link_reference_id');
      const user = await getCurrentUser();
      const email = getUserEmail() || searchParams.get('email');
      const plan = referenceId || 'unisoleai-subscription';

      const { error: txError } = await saveTransaction({
        user,
        email,
        plan,
        paymentId,
        paymentLinkId,
        status: paymentStatus,
      });

      if (paymentStatus === 'paid') {
        await setActiveSubscription({ user, email, plan });
      }

      if (txError) {
        setError(txError.message);
        setStatus('error');
        return;
      }
      setStatus('success');
    };
    record();
  }, [searchParams]);

  return (
    <>
      <Navbar />
      <section className="payment-success-page">
        <div className="payment-success-card">
          {status === 'saving' && (
            <>
              <span className="payment-success-icon payment-success-icon--spin">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 11-9-9" />
                </svg>
              </span>
              <h1 className="payment-success-title">Recording your payment...</h1>
              <p className="payment-success-sub">Please wait while we confirm your subscription.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <span className="payment-success-icon payment-success-icon--ok">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <h1 className="payment-success-title">Payment Successful</h1>
              <p className="payment-success-sub">
                Your subscription payment has been received and recorded.
              </p>
              <Link to="/profile" className="payment-success-btn">Go to Profile</Link>
            </>
          )}

          {status === 'error' && (
            <>
              <span className="payment-success-icon payment-success-icon--error">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </span>
              <h1 className="payment-success-title">Couldn't record payment</h1>
              <p className="payment-success-sub">{error}</p>
              <Link to="/programs" className="payment-success-btn">Back to Programs</Link>
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
