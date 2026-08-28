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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-32 pb-20 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl text-center space-y-6">
          
          {/* Success Check Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Payment Received
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              Thank You{userName && userName !== 'Learner' ? `, ${userName}` : ''}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Your transaction has been confirmed on the Unisole payment gateway.
            </p>
          </div>

          {/* 24-Hour Notice Card */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-700 dark:text-indigo-200 flex items-start gap-3 text-left">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">
              Your purchased program modules and lab repository access will get reflected in your <strong>enrolled profile section within 24 hours</strong>.
            </p>
          </div>

          {/* Transaction ID */}
          {paymentId && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 font-semibold text-[11px]">Transaction ID:</span>
              <code className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate">{paymentId}</code>
              <button
                type="button"
                onClick={handleCopyId}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1 flex-shrink-0"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to="/profile" className="w-full">
              <button className="w-full inline-flex items-center justify-center font-bold px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 text-xs transition-all cursor-pointer">
                <span>Go to Profile</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </button>
            </Link>
            <Link to="/programs" className="w-full">
              <button className="w-full inline-flex items-center justify-center font-bold px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs hover:border-slate-300 transition-all cursor-pointer">
                Explore More Pathways
              </button>
            </Link>
          </div>

          {/* Support line */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Need urgent assistance? Call <a href="tel:+918219691201" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">+91 8219691201</a> or email <a href="mailto:unisole.empower@gmail.com" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">unisole.empower@gmail.com</a>.
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

