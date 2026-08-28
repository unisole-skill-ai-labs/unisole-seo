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
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950">
      <Navbar />
      
      <main className="flex-grow pt-24 sm:pt-32 pb-20 px-4 sm:px-6 max-w-4xl mx-auto w-full space-y-6">
        
        {/* Profile Header Card */}
        <div className="minimal-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            
            {/* Avatar Pill */}
            <div className="w-16 h-16 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xl shadow-xs flex-shrink-0">
              {avatarLetter}
            </div>

            <div className="space-y-1.5 flex-grow">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white leading-tight">
                  {displayName}
                </h1>
                <span className="mono-tag text-zinc-600 dark:text-zinc-400">
                  Verified Member
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                {userPhone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    <span>+91 {userPhone}</span>
                  </span>
                )}
                {userEmail && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{userEmail}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Logout CTA */}
            <button
              onClick={() => { logout(); window.location.href = '/login'; }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/40 border border-rose-200/60 dark:border-rose-900/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Orders & Pathways Section */}
        <div className="minimal-card p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3.5">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">Enrolled Pathways & Orders</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Your academic curriculum subscriptions and lab access.</p>
            </div>
            <Link to="/programs" className="text-xs font-semibold text-zinc-900 dark:text-white hover:underline inline-flex items-center gap-1">
              <span>Explore Programs</span>
              <ChevronRight className="w-3 h-3 text-zinc-400" />
            </Link>
          </div>

          {orders.length > 0 ? (
            <ul className="space-y-2.5">
              {orders.map((order, idx) => (
                <li key={order.id || idx} className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white block">
                      {order.title || order.course_name || `Order #${(order.id || idx + 1).toString().slice(0, 8)}`}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(order.created_at || order.createdAt)}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-900 dark:text-white">
                    {order.amount != null
                      ? `₹${Number(order.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : 'Active'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-2.5">
              <BookOpen className="w-6 h-6 text-zinc-400 mx-auto" />
              <h3 className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-white">No active course enrollments yet</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Explore our 4 curriculum streams to enroll in verified AI training and capstone projects.
              </p>
              <Link to="/programs" className="inline-block pt-1">
                <button className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 text-white text-xs font-semibold transition-all">
                  Browse Catalog
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

