import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import coursesData from '../data/courses';
import './CoursesPage.css';

const LEVEL_OPTIONS = [
  { value: 'all', label: 'All Levels' },
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'All Levels', label: 'All Levels Only' },
];

const SORT_OPTIONS = [
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

const PAGE_SIZE = 8;

/* ---------- HELPERS: map backend course doc -> UI shape ---------- */
function getDisplayPrice(course) {
  return course.isFree ? 0 : (course.discountedPrice ?? course.price);
}

function getOldPrice(course) {
  // Only show a struck-through price if there's an actual discount
  return course.discountedPrice != null ? course.price : null;
}

function getBadge(course) {
  if (course.enrollmentCount === 0) return 'New';
  // if (course.rating?.average >= 4.5) return 'Bestseller';
  return null;
}

/* ---------- REUSABLE DROPDOWN ---------- */
function FilterDropdown({ label, options, value, onChange, activeExtra }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isActive = value !== 'all' || activeExtra;
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="filter-dropdown-wrap" ref={ref}>
      <button
        type="button"
        className={`filter-pill ${isActive ? 'filter-pill-active' : ''}`}
        onClick={() => setOpen((p) => !p)}
      >
        <span>{isActive && current ? current.label : label}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3.5 5.25L7 8.75l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="filter-dropdown-panel">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`filter-option ${value === opt.value ? 'filter-option-active' : ''}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
              {value === opt.value && (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- MAIN PAGE ---------- */
export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [levelFilter, setLevelFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevant');
  const [page, setPage] = useState(1);

  /* ---------- LOAD COURSES FROM HARDCODED DATA ---------- */
  useEffect(() => {
    setCourses(coursesData);
    setLoading(false);
  }, []);

  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearch(urlSearch);
  }, [searchParams]);

  const hasActiveFilters =
    search.trim() !== '' || levelFilter !== 'all';

  const filteredCourses = useMemo(() => {
    let list = courses.filter((c) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        c.title?.toLowerCase().includes(q) ||
        c.instructor?.toLowerCase().includes(q);
      const matchesLevel = levelFilter === 'all' || c.level === levelFilter;
      return matchesSearch && matchesLevel;
    });

    if (sortBy === 'price-low') {
      list = [...list].sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
    } else if (sortBy === 'price-high') {
      list = [...list].sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
    }

    return list;
  }, [courses, search, levelFilter, sortBy]);

  useEffect(() => setPage(1), [search, levelFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE));
  const paginatedCourses = filteredCourses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => {
    setSearch('');
    setLevelFilter('all');
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
          <h1 className="courses-page-title">All Courses</h1>
          <p className="courses-page-subtitle">
            {loading
              ? 'Loading courses...'
              : `${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''} available`}
          </p>
        </div>

        <div className="courses-page-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className="courses-page-search-input"
            placeholder="Search for any course"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="courses-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        <div className="courses-filter-bar">
          <div className="courses-filter-left">
            <button
              type="button"
              className={`filter-pill filter-pill-all ${hasActiveFilters ? 'filter-pill-active' : ''}`}
              onClick={clearFilters}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
              </svg>
              <span>{hasActiveFilters ? 'Clear filters' : 'All filters'}</span>
            </button>

            <FilterDropdown label="Level" options={LEVEL_OPTIONS} value={levelFilter} onChange={setLevelFilter} />
          </div>

          <div className="courses-filter-right">
            <FilterDropdown label="Sort" options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} activeExtra />
          </div>
        </div>

        {loading ? (
          <div className="courses-empty">
            <p className="courses-empty-title">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="courses-empty">
            <p className="courses-empty-title">Couldn't load courses</p>
            <p className="courses-empty-sub">{error}</p>
          </div>
        ) : paginatedCourses.length === 0 ? (
          <div className="courses-empty">
            <p className="courses-empty-title">No courses found</p>
            <p className="courses-empty-sub">Try adjusting your search or filters.</p>
            <button className="courses-empty-reset" onClick={clearFilters}>Clear filters</button>
          </div>
        ) : (
          <div className="courses-grid">
            {paginatedCourses.map((course) => {
              const displayPrice = getDisplayPrice(course);
              const oldPrice = getOldPrice(course);
              const badge = getBadge(course);

              return (
                <a href={`/courses/${course.slug}`} className="courses-card" key={course._id}>
                  <div className="courses-card-img-wrap">
                    <img src={course.thumbnail} alt={course.title} className="courses-card-img" />
                  </div>
                  <div className="courses-card-body">
                    <h3 className="courses-card-title">{course.title}</h3>
                    <p className="courses-card-instructor">
                      {course.instructor}
                    </p>
                    <div className="courses-card-meta">
                      {badge && <span className="courses-badge">{badge}</span>}
                    </div>
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