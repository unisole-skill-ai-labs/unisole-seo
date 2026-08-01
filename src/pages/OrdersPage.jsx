import { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../pages/CoursesPage.css';
import './OrdersPage.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const PAGE_SIZE = 10;

function getToken() {
  return localStorage.getItem('token');
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchOrders() {
      const token = getToken();
      if (!token) {
        setError('Please log in to see your orders.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/payment/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load orders');
        }
        setOrders(data.orders);
      } catch (err) {
        setError(err.message || 'Something went wrong while loading your orders');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const paginatedOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [orders, totalPages, page]);

  const pageNumbers = useMemo(() => {
    const nums = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) nums.push(i);
      else if (nums[nums.length - 1] !== '...') nums.push('...');
    }
    return nums;
  }, [page, totalPages]);

  return (
    <>
      <Navbar />

      <section className="courses-page">
        <div className="courses-page-header">
          <h1 className="courses-page-title">My Orders</h1>
          <p className="courses-page-subtitle">
            {loading
              ? 'Loading your orders...'
              : `${orders.length} order${orders.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {loading ? (
          <div className="courses-empty">
            <p className="courses-empty-title">Loading...</p>
          </div>
        ) : error ? (
          <div className="courses-empty">
            <p className="courses-empty-title">Couldn't load orders</p>
            <p className="courses-empty-sub">{error}</p>
            {error.includes('log in') && (
              <a href="/login" className="courses-empty-reset">Log In</a>
            )}
          </div>
        ) : paginatedOrders.length === 0 ? (
          <div className="courses-empty">
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="orders-empty-icon">
              <rect x="3" y="7" width="18" height="14" rx="2" />
              <path d="M8 7V5a4 4 0 018 0v2" />
            </svg>
            <p className="courses-empty-title">No orders yet</p>
            <p className="courses-empty-sub">Courses you purchase will show up here.</p>
            <a href="/courses" className="courses-empty-reset">Browse Courses</a>
          </div>
        ) : (
          <div className="orders-list">
            {paginatedOrders.map((order) => (
                <div className="order-card" key={order._id}>
                <div className="order-card-header">
                    <div className="order-row-detail">
                    <span className="order-row-label">Order date</span>
                    <span className="order-row-value">{formatDate(order.createdAt)}</span>
                    </div>

                    <div className="order-row-detail">
                    <span className="order-row-label">Amount paid</span>
                    <span className="order-row-value">₹{order.amount.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="order-row-detail">
                    <span className="order-row-label">Payment ID</span>
                    <span className="order-row-value order-row-payment-id">
                        {order.razorpayPaymentId}
                    </span>
                    </div>

                    <span className="order-status-badge">Paid</span>
                </div>

                <div className="order-card-courses">
                    {order.courses.map((item, i) => (
                    <div className="order-row" key={item.course?._id ?? i}>
                        <a href={`/courses/${item.course?.slug}`} className="order-row-img-wrap">
                        <img
                            src={item.course?.thumbnail}
                            alt={item.course?.title}
                            className="order-row-img"
                        />
                        </a>

                        <div className="order-row-info">
                        <a href={`/courses/${item.course?.slug}`} className="order-row-title">
                            {item.course?.title ?? 'Course unavailable'}
                        </a>
                        <p className="order-row-instructor">By {item.course?.instructor}</p>
                        </div>

                        <span className="order-row-item-price">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                    ))}
                </div>
                </div>
            ))}
            </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="courses-pagination">
            <button
              className="courses-page-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M11 4l-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {pageNumbers.map((n, i) =>
              n === '...' ? (
                <span key={`ellipsis-${i}`} className="courses-page-ellipsis">...</span>
              ) : (
                <button
                  key={n}
                  className={`courses-page-num ${page === n ? 'courses-page-num-active' : ''}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              )
            )}

            <button
              className="courses-page-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}