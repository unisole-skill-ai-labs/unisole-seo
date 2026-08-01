import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import coursesData from '../data/courses';
import { buyCourses } from '../utils/payment';
import '../pages/CoursesPage.css';
import './CartPage.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('token');
}

function getDemoCart() {
  return coursesData.filter((c) => ['complete-python', 'anyone-can-sketech'].includes(c.slug));
}

function getDisplayPrice(course) {
  return course.isFree ? 0 : (course.discountedPrice ?? course.price);
}

function getOldPrice(course) {
  return course.discountedPrice != null ? course.price : null;
}

function formatMinutes(totalSeconds) {
  const totalMinutes = Math.round((totalSeconds || 0) / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return `${hours} total hours`;
}

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => {
    async function fetchCart() {
      const token = getToken();
      if (!token) {
        setCart(getDemoCart());
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load cart');
        }
        setCart(data.cart);
      } catch (err) {
        setCart(getDemoCart());
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

  const removeFromCart = async (courseId) => {
    const token = getToken();
    if (!token) return;

    setBusyId(courseId);
    const prev = cart;
    setCart((p) => p.filter((c) => c._id !== courseId)); // optimistic

    try {
      const res = await fetch(`${API_BASE}/api/cart/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) setCart(prev);
    } catch {
      setCart(prev);
    } finally {
      setBusyId(null);
    }
  };

  const moveToWishlist = async (courseId) => {
    const token = getToken();
    if (!token) return;

    setBusyId(courseId);
    const prev = cart;
    setCart((p) => p.filter((c) => c._id !== courseId)); // optimistic

    try {
      const res = await fetch(`${API_BASE}/api/cart/${courseId}/move-to-wishlist`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) setCart(prev);
    } catch {
      setCart(prev);
    } finally {
      setBusyId(null);
    }
  };

  const { subtotal, originalTotal, percentOff } = useMemo(() => {
    const sub = cart.reduce((sum, c) => sum + getDisplayPrice(c), 0);
    const orig = cart.reduce((sum, c) => sum + (c.isFree ? 0 : c.price), 0);
    const off = orig > 0 ? Math.round(((orig - sub) / orig) * 100) : 0;
    return { subtotal: sub, originalTotal: orig, percentOff: off };
  }, [cart]);

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="courses-page">
          <div className="courses-empty">
            <p className="courses-empty-title">Loading...</p>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <section className="courses-page">
          <div className="courses-empty">
            <p className="courses-empty-title">Couldn't load cart</p>
            <p className="courses-empty-sub">{error}</p>
            {error.includes('log in') && (
              <a href="/login" className="courses-empty-reset">Log In</a>
            )}
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="courses-page">
        <div className="courses-page-header">
          <h1 className="courses-page-title">Shopping Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="courses-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            <p className="courses-empty-title">Your cart is empty</p>
            <p className="courses-empty-sub">Courses you add to cart will show up here.</p>
            <a href="/courses" className="courses-empty-reset">Browse Courses</a>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              <p className="cart-count">
                {cart.length} Course{cart.length !== 1 ? 's' : ''} in Cart
              </p>

              <div className="cart-list">
                {cart.map((course) => {
                  const displayPrice = getDisplayPrice(course);
                  const oldPrice = getOldPrice(course);
                  const busy = busyId === course._id;

                  return (
                    <div className="cart-item" key={course._id}>
                      <a href={`/courses/${course.slug}`} className="cart-item-img-wrap">
                        <img src={course.thumbnail} alt={course.title} className="cart-item-img" />
                      </a>

                      <div className="cart-item-info">
                        <a href={`/courses/${course.slug}`} className="cart-item-title">
                          {course.title}
                        </a>
                        <p className="cart-item-instructor">By {course.instructor}</p>
                        <div className="cart-item-meta">
                          <span className="cart-item-rating">
                            ★ {(course.rating?.average ?? 0).toFixed(1)}
                          </span>
                          <span className="cart-item-ratings-count">
                            ({(course.rating?.count ?? 0).toLocaleString('en-IN')} ratings)
                          </span>
                        </div>
                        <p className="cart-item-submeta">
                          {formatMinutes(course.totalDuration)} • {course.totalLectures} lectures • {course.level}
                        </p>
                      </div>

                      <div className="cart-item-actions">
                        <button
                          type="button"
                          className="cart-action-link"
                          disabled={busy}
                          onClick={() => removeFromCart(course._id)}
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          className="cart-action-link"
                          disabled={busy}
                          onClick={() => moveToWishlist(course._id)}
                        >
                          Move to Wishlist
                        </button>
                      </div>

                      <div className="cart-item-price">
                        <span className="cart-item-price-current">
                          {course.isFree ? 'Free' : `₹${displayPrice.toLocaleString('en-IN')}`}
                        </span>
                        {oldPrice != null && (
                          <span className="cart-item-price-old">
                            ₹{oldPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="cart-summary">
              <p className="cart-summary-label">Total:</p>
              <p className="cart-summary-total">₹{subtotal.toLocaleString('en-IN')}.00</p>

              {originalTotal > subtotal && (
                <>
                  <p className="cart-summary-old">₹{originalTotal.toLocaleString('en-IN')}.00</p>
                  <p className="cart-summary-off">{percentOff}% off</p>
                </>
              )}

              <button
                type="button"
                className="cart-checkout-btn"
                disabled={checkingOut}
                onClick={async () => {
                  const token = getToken();
                  if (!token) {
                    navigate('/login');
                    return;
                  }
                  setCheckingOut(true);
                  setCheckoutError(null);
                  await buyCourses({
                    courses: cart,
                    token,
                    onSuccess: () => {
                      setCheckingOut(false);
                      navigate('/my-learning');
                    },
                    onError: (msg) => {
                      setCheckingOut(false);
                      setCheckoutError(msg);
                    },
                    onDismiss: () => setCheckingOut(false),
                  });
                }}
              >
                {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
                {!checkingOut && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              {checkoutError && (
                <p className="cart-checkout-error">{checkoutError}</p>
              )}

              <p className="cart-summary-note">You won't be charged yet</p>
            </aside>
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}