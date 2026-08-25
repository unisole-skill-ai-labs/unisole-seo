import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import coursesData from '../data/courses';
import { buyCourses } from '../utils/payment';
import { getOptimizedImageUrl } from '../utils/image';
import './DetailedCourse.css';
import './CoursesPage.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('token');
}

function formatLectureDuration(seconds) {
  if (!seconds) return '';
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

function formatCurrency(amount) {
  return `₹${amount.toLocaleString('en-IN')}.00`;
}

function getFirstLectureId(course) {
  if (!course.sections || course.sections.length === 0) return null;
  const firstSection = course.sections[0];
  if (!firstSection.lectures || firstSection.lectures.length === 0) return null;
  return firstSection.lectures[0]._id;
}

export default function DetailedCourse() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectionsOpen, setSectionsOpen] = useState([]);

  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);

  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    const found = coursesData.find((c) => c.slug === slug);
    if (found) {
      setCourse(found);
      setSectionsOpen(found.sections.map(() => true));
    } else {
      setError('Course not found');
    }
    setLoading(false);
  }, [slug]);

  // Check whether this course is already purchased
  useEffect(() => {
    if (!course) return;
    const token = getToken();
    if (!token) return;

    async function checkPurchased() {
      try {
        const res = await fetch(`${API_BASE}/api/profile/purchased`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setPurchased(data.purchasedCourses.some((c) => c._id === course._id));
        }
      } catch {
        // silent
      }
    }
    checkPurchased();
  }, [course]);

  const handleBuyNow = async () => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }
    setPurchasing(true);
    setPurchaseError(null);
    await buyCourses({
      courses: [course],
      token,
      onSuccess: () => {
        setPurchasing(false);
        setPurchased(true);
        navigate('/my-learning');
      },
      onError: (msg) => {
        setPurchasing(false);
        setPurchaseError(msg);
      },
      onDismiss: () => setPurchasing(false),
    });
  };

  const toggleSection = (index) => {
    setSectionsOpen((prev) =>
      prev.map((open, i) => (i === index ? !open : open))
    );
  };

  if (loading) {
  return (
    <>
      <Navbar />
      <section className="courses-page">
        <div className="courses-empty">
          <p className="courses-empty-title">Loading course...</p>
        </div>
      </section>
      <Footer />
    </>
  );
}

if (error || !course) {
  return (
    <>
      <Navbar />
      <section className="courses-page">
        <div className="courses-empty">
          <p className="courses-empty-title">Couldn't load course</p>
          <p className="courses-empty-sub">{error || 'Course not found'}</p>
        </div>
      </section>
      <Footer />
    </>
  );
}

  const hasDiscount =
    !course.isFree &&
    course.discountedPrice != null &&
    course.discountedPrice < course.price;

  return (
    <>
      <Navbar />

      <section className="dc-header">
        <div className="dc-header-inner">
          <div className="dc-header-left">
            <div className="dc-breadcrumb reveal-up" style={{ '--delay': '0.05s' }}>
              <span>{course.category}</span>
              {course.tags?.[0] && (
                <>
                  <span className="dc-breadcrumb-sep">›</span>
                  <span>{course.tags[0]}</span>
                </>
              )}
            </div>

            <h1 className="dc-title reveal-up" style={{ '--delay': '0.1s' }}>
              {course.title}
            </h1>

            <p className="dc-subtitle reveal-up" style={{ '--delay': '0.15s' }}>
              {course.shortDescription}
            </p>

            <div className="dc-badges reveal-up" style={{ '--delay': '0.2s' }}>
              <span className="dc-badge">{course.level}</span>
            </div>

            <div className="dc-meta reveal-up" style={{ '--delay': '0.25s' }}>
              <span className="dc-instructor">
                Created by <span className="dc-instructor-name">{course.instructor}</span>
              </span>
            </div>

            <div className="dc-stats reveal-up" style={{ '--delay': '0.3s' }}>
              <span>{course.language}</span>
            </div>

            {course.tags?.length > 0 && (
              <div className="dc-header-tags reveal-up" style={{ '--delay': '0.35s' }}>
                <span className="dc-tag-group">
                  <span className="dc-tag-label">Tags:</span>{' '}
                  {course.tags.join(', ')}
                </span>
              </div>
            )}
          </div>

          <div className="dc-header-right reveal-up" style={{ '--delay': '0.15s' }}>
            <div className="dc-enroll-card">
              <div className="dc-preview-wrap">
                {course.previewVideo ? (
                  <video
                    className="dc-preview-media"
                    poster={getOptimizedImageUrl(course.thumbnail, { width: 720 })}
                    controls
                    src={course.previewVideo}
                  />
                ) : (
                  <img
                    className="dc-preview-media"
                    src={getOptimizedImageUrl(course.thumbnail, { width: 720 })}
                    alt={course.title}
                    width="440"
                    height="240"
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>

              <div className="dc-enroll-body">
                <div className="dc-price-row">
                  {course.isFree ? (
                    <span className="dc-price">Free</span>
                  ) : hasDiscount ? (
                    <>
                      <span className="dc-price">
                        {formatCurrency(course.discountedPrice)}
                      </span>
                      <span className="dc-old-price">
                        {formatCurrency(course.price)}
                      </span>
                    </>
                  ) : (
                    <span className="dc-price">{formatCurrency(course.price)}</span>
                  )}
                </div>

                <a
                  href={course?.classplusUrl || 'https://classplusapp.com/w/unisole-empower/courses/825063'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dc-enroll-btn"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  Get this course
                </a>

              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="dc-body">
        <div className="dc-body-inner">
          <div className="dc-main">
            {course.whatYouWillLearn?.length > 0 && (
              <div className="dc-card reveal-up" style={{ '--delay': '0.05s' }}>
                <h2 className="dc-card-title">What you'll learn</h2>
                <div className="dc-learn-grid">
                  {course.whatYouWillLearn.map((item, i) => (
                    <div className="dc-learn-item" key={i}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M3 8.5l3 3 7-7"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="dc-card reveal-up" style={{ '--delay': '0.1s' }}>
              <h2 className="dc-card-title">Course content</h2>
              <p className="dc-content-meta">
                {course.sections.length} section{course.sections.length !== 1 && 's'} •{' '}
                {course.totalLectures} lectures
              </p>

              <div className="dc-sections">
                {course.sections.map((section, sIndex) => (
                  <div className="dc-section" key={section._id ?? sIndex}>
                    <button
                      type="button"
                      className="dc-section-header"
                      onClick={() => toggleSection(sIndex)}
                    >
                      <svg
                        className={`dc-chevron ${sectionsOpen[sIndex] ? 'is-open' : ''}`}
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M4 5.5l3 3 3-3"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="dc-section-title">{section.title}</span>
                      <span className="dc-section-count">
                        {section.lectures.length} lectures
                      </span>
                    </button>

                    {sectionsOpen[sIndex] && (
                      <ul className="dc-lecture-list">
                        {section.lectures.map((lecture, lIndex) => (
                          <li className="dc-lecture" key={lecture._id ?? lIndex}>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                              <path d="M5 3.5l6 4-6 4v-8z" fill="currentColor" />
                            </svg>
                            <span className="dc-lecture-name">{lecture.title ?? lecture.name}</span>
                            {(lecture.isPreview ?? lecture.preview) && (
                              <span className="dc-lecture-preview">Preview</span>
                            )}
                            <span className="dc-lecture-duration">
                              {formatLectureDuration(lecture.duration)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {course.requirements?.length > 0 && (
              <div className="dc-card reveal-up" style={{ '--delay': '0.15s' }}>
                <h2 className="dc-card-title">Requirements</h2>
                <ul className="dc-plain-list">
                  {course.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="dc-card reveal-up" style={{ '--delay': '0.2s' }}>
              <h2 className="dc-card-title">Description</h2>
              <div className="dc-description">
                {course.description.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}