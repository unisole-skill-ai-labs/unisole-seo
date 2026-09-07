import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShieldCheck,
  Lock,
  Sparkles,
  Clock,
  AlertCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { getUser, getUserPhone, getUserEmail, getUserName, isAuthenticated } from '../utils/auth';
import { initiatePathwayPayment, PathwayItem } from '../utils/pathwayPayment';

interface PathwayEnrollModalProps {
  isOpen: boolean;
  pathway: PathwayItem | null;
  groupTitle?: string;
  onClose: () => void;
}

export default function PathwayEnrollModal({
  isOpen,
  pathway,
  groupTitle,
  onClose,
}: PathwayEnrollModalProps) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    collegeName: '',
    branch: '',
    yearOfStudy: '3rd Year',
    occupation: 'STUDENT',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill with existing authenticated user details
  useEffect(() => {
    if (isOpen) {
      const user = getUser();
      setFormData((prev) => ({
        ...prev,
        name: user?.name || getUserName() || prev.name,
        phone: user?.phone ? user.phone.replace(/^\+91/, '') : getUserPhone() ? getUserPhone().replace(/^\+91/, '') : prev.phone,
        email: user?.email || getUserEmail() || prev.email,
        collegeName: user?.collegeName || user?.college || prev.collegeName,
        branch: user?.branch || prev.branch,
      }));
      setErrorMessage('');
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen || !pathway || !isAuthenticated()) return null;

  const finalPrice = pathway.price || 2999;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    const cleanDigits = formData.phone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setErrorMessage('Please enter a valid 10-digit WhatsApp/mobile number');
      return;
    }

    const formattedPhone = cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`;

    setIsLoading(true);

    try {
      await initiatePathwayPayment({
        pathway,
        student: {
          name: formData.name.trim(),
          phone: formattedPhone,
          email: formData.email.trim() || undefined,
          collegeName: formData.collegeName.trim() || undefined,
          branch: formData.branch.trim() || undefined,
          yearOfStudy: formData.yearOfStudy,
          occupation: formData.occupation,
        },
        onSuccess: (result) => {
          setIsLoading(false);
          onClose();
          navigate(
            `/payment-success?id=${result.paymentId}&orderNumber=${result.orderNumber}&pathwayTitle=${encodeURIComponent(
              pathway.title
            )}&amount=${result.amount}`
          );
        },
        onError: (err) => {
          setIsLoading(false);
          setErrorMessage(err);
        },
        onDismiss: () => {
          setIsLoading(false);
        },
      });
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Payment initialization failed');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && !isLoading && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-black text-xs flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Secure Pathway Enrollment
              </h3>
              <p className="text-[11px] text-zinc-500 font-mono">
                Official Admission & Batch Reservation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Pathway Preview Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-600 text-white dark:bg-indigo-500">
                {groupTitle || 'Academic Pathway'}
              </span>
              <div className="flex items-center gap-2 text-xs font-mono">
                {pathway.duration && (
                  <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {pathway.duration}
                  </span>
                )}
                {pathway.level && (
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                    • {pathway.level}
                  </span>
                )}
              </div>
            </div>

            <h4 className="text-base font-bold text-zinc-900 dark:text-white leading-tight">
              {pathway.title}
            </h4>

            {/* Pricing Tag */}
            <div className="flex items-baseline gap-2.5 pt-1">
              <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-mono">
                ₹{finalPrice.toLocaleString('en-IN')}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
                Full Admission
              </span>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
              <div className="leading-normal">{errorMessage}</div>
            </div>
          )}

          {/* Student Form */}
          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 block">
                Student Admission Information
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    WhatsApp / Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 font-mono text-xs text-zinc-400 font-bold select-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      className="w-full pl-11 pr-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-mono text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="rohan@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    College / University
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Delhi University / HPU"
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Branch / Stream
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BCA, B.Sc Physics, B.Com"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Current Year
                  </label>
                  <select
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Graduate / Alum">Graduate / Alum</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Total Summary & Checkout Button */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-zinc-900 dark:text-white">Payable Total:</span>
                <span className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                  ₹{finalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-extrabold shadow-lg shadow-indigo-500/25 transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to Razorpay...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{finalPrice.toLocaleString('en-IN')} via Razorpay</span>
                    <ChevronRight className="w-4 h-4 ml-0.5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-zinc-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 256-Bit SSL Encrypted
                </span>
                <span>•</span>
                <span>UPI, Cards, NetBanking, EMI</span>
              </div>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}
