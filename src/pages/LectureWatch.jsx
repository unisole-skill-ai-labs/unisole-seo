import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './LectureWatch.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('token');
}

function formatMinutes(totalSeconds) {
  const totalMinutes = Math.round(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}min`;
  return `${hours}hr ${minutes}min`;
}

function formatLectureDuration(seconds) {
  if (!seconds) return '';
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

export default function LectureWatch() {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const token = getToken();

  const [course, setCourse] = useState(null);
  const [lecture, setLecture] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sectionsOpen, setSectionsOpen] = useState([]);
  const [completedLectures, setCompletedLectures] = useState(new Set());
  const [markingComplete, setMarkingComplete] = useState(false);

  if (!token) {
    return (
      <>
        <Navbar />
        <div className="lw-status">Please log in to watch lectures</div>
        <Footer />
      </>
    );
  }

  // Fetch course details
  useEffect(() => {
    async function fetchCourse() {
      try {
        setLoading(true);
        setError(null);

        // We need to find the slug first — assuming we can derive it or need it from elsewhere
        // For now, we'll try to fetch course by courseId directly from enrollments
        const enrollRes = await fetch(`${API_BASE}/api/courses/enrollments/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const enrollData = await enrollRes.json();

        if (!enrollRes.ok || !enrollData.success) {
          throw new Error('Failed to fetch enrollments');
        }

        const enrollment = enrollData.enrollments.find((e) => e.course._id === courseId);
        if (!enrollment) {
          throw new Error('Course not found in enrollments');
        }

        setCourse(enrollment.course);
        setSectionsOpen(enrollment.course.sections?.map(() => false) || []);
        setCompletedLectures(new Set(enrollment.completedLectures || []));
      } catch (err) {
        setError(err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [courseId, token]);

  // Fetch lecture with SAS URL
  useEffect(() => {
    if (!lectureId || !token) return;

    async function fetchLecture() {
      try {
        const res = await fetch(`${API_BASE}/api/courses/${courseId}/lectures/${lectureId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load lecture');
        }

        setLecture(data.lecture);
        setVideoUrl(data.lecture.videoUrl);
      } catch (err) {
        setError(err.message || 'Failed to load lecture');
      }
    }

    fetchLecture();
  }, [lectureId, courseId, token]);

  const toggleSection = (index) => {
    setSectionsOpen((prev) =>
      prev.map((open, i) => (i === index ? !open : open))
    );
  };

  const handleLectureSelect = (newLectureId) => {
    // Navigate to the new lecture
    navigate(`/learn/${courseId}/${newLectureId}`);
  };

  const handleMarkComplete = async (lec, e) => {  // ← Accept the lecture object
    e.stopPropagation();
    if (!lec._id || markingComplete) return;  // Use lec._id instead of lectureId

    setMarkingComplete(true);
    const wasCompleted = completedLectures.has(lec._id);  // Use lec._id
    setCompletedLectures((prev) => {
        const updated = new Set(prev);
        if (wasCompleted) {
        updated.delete(lec._id);  // Use lec._id
        } else {
        updated.add(lec._id);  // Use lec._id
        }
        return updated;
    });

    try {
        const res = await fetch(
        `${API_BASE}/api/courses/${courseId}/lectures/${lec._id}/complete`,  // Use lec._id
        {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        }
        );

        const data = await res.json();
        if (!res.ok || !data.success) {
        setCompletedLectures((prev) => {
            const updated = new Set(prev);
            if (wasCompleted) {
            updated.add(lec._id);
            } else {
            updated.delete(lec._id);
            }
            return updated;
        });
        }
    } catch {
        setCompletedLectures((prev) => {
        const updated = new Set(prev);
        if (wasCompleted) {
            updated.add(lec._id);
        } else {
            updated.delete(lec._id);
        }
        return updated;
        });
    } finally {
        setMarkingComplete(false);
    }
    };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="lw-status">Loading course...</div>
        <Footer />
      </>
    );
  }

  if (error || !course) {
    return (
      <>
        <Navbar />
        <div className="lw-status">
          <p>{error || 'Course not found'}</p>
          <button className="lw-back-btn" onClick={() => navigate('/my-learning')}>
            Back to My Learning
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="lw-container">
        <div className="lw-header">
          <button className="lw-back-btn" onClick={() => navigate('/my-learning')} title="Back to My Learning">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            </button>
          <h1 className="lw-course-title">{course.title}</h1>
        </div>

        <div className="lw-main">
          {/* LEFT: Video Player & Course Info */}
          <div className="lw-left">

            {/* Lecture Info */}
            {lecture && (
              <div className="lw-lecture-info">
                <h2 className="lw-lecture-title">{lecture.title}</h2>
              </div>
            )}
            {/* Video Player */}
            <div className="lw-player-wrap">
              {videoUrl ? (
                <video
                  key={videoUrl}
                  className="lw-video"
                  controls
                  controlsList="nodownload"
                  src={videoUrl}
                />
              ) : (
                <div className="lw-no-video">No video available</div>
              )}
            </div>

            
          </div>

          {/* RIGHT: Lecture List */}
          <div className="lw-right">
            <div className="lw-sections-wrap">
              <h3 className="lw-sections-title">Course content</h3>

              {course.sections && course.sections.length > 0 ? (
                <div className="lw-sections">
                  {course.sections.map((section, sIndex) => (
                    <div className="lw-section" key={section._id ?? sIndex}>
                      <button
                        type="button"
                        className="lw-section-header"
                        onClick={() => toggleSection(sIndex)}
                      >
                        <svg
                          className={`lw-chevron ${sectionsOpen[sIndex] ? 'is-open' : ''}`}
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
                        <span className="lw-section-title">{section.title}</span>
                        <span className="lw-section-count">
                          {section.lectures?.length || 0}
                        </span>
                      </button>

                      {sectionsOpen[sIndex] && (
                        <ul className="lw-lecture-list">
                          {section.lectures?.map((lec, lIndex) => (
                            <li
                              key={lec._id ?? lIndex}
                              className={`lw-lecture-item ${lectureId === lec._id ? 'is-active' : ''}`}
                            >
                              <label className="lw-lecture-row" onClick={() => handleLectureSelect(lec._id)}>
                                <input
                                type="checkbox"
                                className="lw-lecture-checkbox"
                                checked={completedLectures.has(lec._id)}
                                onChange={(e) => handleMarkComplete(lec, e)}  // ← Pass lec object
                                disabled={markingComplete}
                                onClick={(e) => e.stopPropagation()}
                                />
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                  <path d="M5 3.5l6 4-6 4v-8z" fill="currentColor" />
                                </svg>
                                <span className="lw-lecture-name">{lec.title}</span>
                                <span className="lw-lecture-duration-small">
                                  {formatLectureDuration(lec.duration)}
                                </span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="lw-no-sections">No sections available</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}