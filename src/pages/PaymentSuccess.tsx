import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getUserName } from '../utils/auth';
import { CheckCircle2, Copy, Check, Clock, Phone, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-32 pb-20 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-md w-full minimal-card p-6 sm:p-8 text-center space-y-5">
          
          {/* Success Check Icon */}
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <span className="mono-tag text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/5">
              Payment Confirmed
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mt-2">
              Thank You{userName && userName !== 'Learner' ? `, ${userName}` : ''}!
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Your enrollment transaction has been verified on the Unisole payment gateway.
            </p>
          </div>

          {/* 24-Hour Notice Card */}
          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2.5 text-left">
            <Clock className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed text-xs">
              Purchased program modules and lab repository access will reflect in your <strong>enrolled profile section within 24 hours</strong>.
            </p>
          </div>

          {/* Transaction ID */}
          {paymentId && (
            <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800 flex items-center justify-between gap-2 text-xs">
              <span className="text-zinc-500 font-mono text-[10px]">ID:</span>
              <code className="font-mono font-semibold text-zinc-800 dark:text-zinc-200 text-xs truncate">{paymentId}</code>
              <button
                type="button"
                onClick={handleCopyId}
                className="px-2 py-1 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-mono text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 transition-colors cursor-pointer flex items-center gap-1 flex-shrink-0"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <Link to="/profile" className="w-full">
              <button className="w-full inline-flex items-center justify-center font-semibold px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 text-white text-xs transition-all cursor-pointer">
                <span>View Profile</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </button>
            </Link>
            <Link to="/programs" className="w-full">
              <button className="w-full inline-flex items-center justify-center font-semibold px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs hover:border-zinc-300 transition-all cursor-pointer">
                Explore Programs
              </button>
            </Link>
          </div>

          {/* Support line */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400">
            Need assistance? Call <a href="tel:+918219691201" className="text-zinc-900 dark:text-white font-medium hover:underline">+91 8219691201</a> or email <a href="mailto:unisole.empower@gmail.com" className="text-zinc-900 dark:text-white font-medium hover:underline">unisole.empower@gmail.com</a>.
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

