import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { logout, isAuthenticated } from '../utils/auth';
import { useGetMeQuery, useGetOrdersQuery } from '../store/apiSlice';
import { User, Phone, Mail, Shield, LogOut, ArrowRight, BookOpen, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

function formatDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const isAuth = isAuthenticated();
  const storedUser = useSelector((s: any) => s.auth.user);
  const [userName, setUserName] = useState(storedUser?.name || 'User');
  const [userEmail, setUserEmail] = useState(storedUser?.email || '');
  const [userPhone, setUserPhone] = useState(storedUser?.phone || '');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: meData } = useGetMeQuery(undefined, { skip: !isAuth });
  const { data: ordersData } = useGetOrdersQuery(undefined, { skip: !isAuth });

  // Authentication Protection
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true, state: { from: '/profile' } });
    }
  }, [navigate]);

  useEffect(() => {
    if (meData) {
      setUserName(meData.name || (meData.phone ? `+91 ${meData.phone}` : 'Active Member'));
      setUserEmail(meData.email || '');
      setUserPhone(meData.phone || '');
    }

    if (ordersData) {
      setOrders(Array.isArray(ordersData) ? ordersData : ordersData.orders || []);
    }

    if (isAuth) {
      setLoading(false);
    }
  }, [isAuth, meData, ordersData]);

  if (!isAuth) {
    return null;
  }

  const displayName = userName && userName !== 'User' ? userName : (userPhone ? `+91 ${userPhone}` : 'Active Member');
  const avatarLetter = (displayName.replace('+91', '').trim().charAt(0) || 'U').toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <Navbar />
      
      <main className="flex-grow pt-24 sm:pt-32 pb-20 px-4 sm:px-6 max-w-4xl mx-auto w-full space-y-8">
        
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            
            {/* Avatar Pill */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-600/25 flex-shrink-0">
              {avatarLetter}
            </div>

            <div className="space-y-2 flex-grow">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {displayName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                  Verified Member
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                {userPhone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-500" />
                    <span>+91 {userPhone}</span>
                  </span>
                )}
                {userEmail && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{userEmail}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Logout CTA */}
            <button
              onClick={() => { logout(); window.location.href = '/login'; }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/40 border border-rose-200/60 dark:border-rose-900/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Orders & Pathways Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Enrolled Pathways & Orders</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your academic curriculum subscriptions and lab access.</p>
            </div>
            <Link to="/programs" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1">
              <span>Explore More</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length > 0 ? (
            <ul className="space-y-3">
              {orders.map((order, idx) => (
                <li key={order.id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                      {order.title || order.course_name || `Order #${(order.id || idx + 1).toString().slice(0, 8)}`}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(order.created_at || order.createdAt)}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400">
                    {order.amount != null
                      ? `₹${Number(order.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : 'Active'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">No active course enrollments yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore the 4 curriculum streams to enroll in industry AI training and capstone projects.
              </p>
              <Link to="/programs" className="inline-block pt-2">
                <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all">
                  Browse Programs Catalog
                </button>
              </Link>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}

