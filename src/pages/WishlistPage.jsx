import { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import coursesData from '../data/courses';
import { getOptimizedImageUrl } from '../utils/image';
import '../pages/CoursesPage.css';
import './WishlistPage.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const PAGE_SIZE = 8;

function getToken() {
  return localStorage.getItem('token');
}

function getDemoWishlist() {
  return coursesData.filter((c) => ['tableau-ultimate-course', 'full-stack-data-science-pro', 'from-notebook-to-production'].includes(c.slug));
}

function getDisplayPrice(course) {
  return course.isFree ? 0 : (course.discountedPrice ?? course.price);
}

function getOldPrice(course) {
  return course.discountedPrice != null ? course.price : null;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchWishlist() {
      const token = getToken();
      if (!token) {
        setWishlist(getDemoWishlist());
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load wishlist');
        }
        setWishlist(data.wishlist);
      } catch (err) {
        setWishlist(getDemoWishlist());
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, []);

  const totalPages = Math.max(1, Math.ceil(wishlist.length / PAGE_SIZE));
  const paginatedCourses = wishlist.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [wishlist, totalPages, page]);

  const removeFromWishlist = async (courseId) => {
    const token = getToken();
    if (!token) return;

    const prev = wishlist;
    setWishlist((p) => p.filter((c) => c._id !== courseId)); // optimistic

    try {
      const res = await fetch(`${API_BASE}/api/wishlist/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setWishlist(prev); // revert on failure
      }
    } catch {
      setWishlist(prev);
    }
  };

  

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
          <h1 className="courses-page-title">My Wishlist</h1>
          <p className="courses-page-subtitle">
            {loading
              ? 'Loading your wishlist...'
              : `${wishlist.length} course${wishlist.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>

        {loading ? (
          <div className="courses-empty">
            <p className="courses-empty-title">Loading...</p>
          </div>
        ) : error ? (
          <div className="courses-empty">
            <p className="courses-empty-title">Couldn't load wishlist</p>
            <p className="courses-empty-sub">{error}</p>
            {error.includes('log in') && (
              <a href="/login" className="courses-empty-reset">Log In</a>
            )}
          </div>
        ) : paginatedCourses.length === 0 ? (
          <div className="courses-empty">
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="wishlist-empty-icon">
              <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 000-7.8z" />
            </svg>
            <p className="courses-empty-title">Your wishlist is empty</p>
            <p className="courses-empty-sub">Courses you heart will show up here.</p>
            <a href="/courses" className="courses-empty-reset">Browse Courses</a>
          </div>
        ) : (
          <div className="courses-grid">
            {paginatedCourses.map((course) => {
              const displayPrice = getDisplayPrice(course);
              const oldPrice = getOldPrice(course);

              return (
                <div className="courses-card wishlist-card" key={course._id}>
                  <button
                    type="button"
                    className="wishlist-remove-btn"
                    aria-label="Remove from wishlist"
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlist(course._id);
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 000-7.8z" />
                    </svg>
                  </button>

                  <a href={`/courses/${course.slug}`} className="wishlist-card-link">
                    <div className="courses-card-img-wrap">
                      <img
                        src={getOptimizedImageUrl(course.thumbnail, { width: 480 })}
                        alt={course.title}
                        className="courses-card-img"
                        width="360"
                        height="200"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="courses-card-body">
                      <h3 className="courses-card-title">{course.title}</h3>
                      <p className="courses-card-instructor">{course.instructor}</p>
                      <div className="courses-card-footer">
                        <div className="courses-card-price">
                          <span className="courses-price">
                            {course.isFree ? 'Free' : `₹${displayPrice.toLocaleString('en-IN')}`}
                          </span>
                          {oldPrice != null && (
                            <span className="courses-old-price">₹{oldPrice.toLocaleString('en-IN')}</span>
                          )}
                        </div>
                        <span className="courses-level-tag">{course.level}</span>
                      </div>
                      
                    </div>
                  </a>
                </div>
              );
            })}
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