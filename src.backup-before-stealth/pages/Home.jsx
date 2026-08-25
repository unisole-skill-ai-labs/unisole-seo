import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Home.css';
import './About.css';
import { offerCards } from '../data/offerContent';
import { isAuthenticated } from '../utils/auth';
import { getOptimizedImageUrl } from '../utils/image';

function OfferCarousel() {
  const initialActiveIndex = Math.min(offerCards.length - 1, Math.floor(offerCards.length / 2));
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCard, setModalCard] = useState(null);
  const [xOffset, setXOffset] = useState(0);
  const [slideW, setSlideW] = useState(0);
  const timerRef = useRef(null);
  const viewportRef = useRef(null);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const len = offerCards.length;
  const slideGap = 24;

  useEffect(() => {
    const calc = () => {
      const vp = viewportRef.current;
      if (!vp) return;
      const isSmall = window.innerWidth <= 640;
      const cardGap = slideGap;
      const viewportWidth = vp.offsetWidth;
      const mobilePadding = 16;
      const sw = isSmall ? Math.max(viewportWidth - 2 * mobilePadding, 280) : (viewportWidth - 2 * cardGap) / 3;
      setSlideW(sw);
      setXOffset((viewportWidth - sw) / 2 - activeIndex * (sw + cardGap));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [activeIndex]);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % len);
    }, 3500);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const goNext = () => {
    setActiveIndex((i) => (i + 1) % len);
    startTimer();
  };

  const goPrev = () => {
    setActiveIndex((i) => (i - 1 + len) % len);
    startTimer();
  };

  const goTo = (i) => {
    setActiveIndex(i);
    startTimer();
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    clearInterval(timerRef.current);
  };

  const handleTouchMove = (e) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current > 40) {
      goPrev();
    } else if (touchDeltaX.current < -40) {
      goNext();
    } else {
      startTimer();
    }
  };

  const openModal = (card) => {
    setModalCard(card);
    setIsModalOpen(true);
    clearInterval(timerRef.current);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalCard(null);
    startTimer();
  };

  return (
    <div className="offer-carousel" style={slideW ? { '--slide-w': `${slideW}px` } : undefined}>
      <div
        className="offer-carousel-viewport"
        ref={viewportRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="offer-carousel-track"
          style={{ transform: `translateX(${xOffset}px)` }}
        >
          {offerCards.map((card, i) => {
            const isCenter = i === activeIndex;
            return (
              <button
                key={card.id}
                className={`offer-slide ${isCenter ? 'offer-slide--center' : 'offer-slide--side'}`}
                onClick={() => (isCenter ? openModal(card) : goTo(i))}
                type="button"
              >
                <div className="offer-slide-img-wrap">
                  <img
                    src={getOptimizedImageUrl(card.img, { width: 600 })}
                    alt={card.title}
                    className="offer-slide-img"
                    width="600"
                    height="360"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="offer-slide-overlay" />
                <div className="offer-slide-content">
                  <h3 className="offer-slide-title">{card.title}</h3>
                  <span className={`offer-slide-cta ${isCenter ? 'cta-visible' : ''}`}>
                    Learn more
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <button className="offer-arrow offer-arrow--left" onClick={goPrev} type="button" aria-label="Previous">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4l-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button className="offer-arrow offer-arrow--right" onClick={goNext} type="button" aria-label="Next">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="offer-dots">
        {offerCards.map((_, i) => (
          <button
            key={i}
            className={`offer-dot ${i === activeIndex ? 'offer-dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            type="button"
          />
        ))}
      </div>

      {isModalOpen && modalCard && (
        <div className="offer-modal-overlay" onClick={closeModal}>
          <div className="offer-modal" onClick={(e) => e.stopPropagation()}>
            <button className="offer-modal-close" onClick={closeModal} type="button" aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="offer-modal-top">
              <div className="offer-modal-top-img-wrap">
                <img
                  src={getOptimizedImageUrl(modalCard.img, { width: 800 })}
                  alt={modalCard.title}
                  className="offer-modal-top-img"
                  width="800"
                  height="260"
                  loading="lazy"
                  decoding="async"
                />
                <div className="offer-modal-top-overlay" />
              </div>
              <div className="offer-modal-top-content">
                <h2 className="offer-modal-top-title">{modalCard.title}</h2>
                <p className="offer-modal-top-desc">{modalCard.desc}</p>
              </div>
            </div>
            <div className="offer-modal-body" dangerouslySetInnerHTML={{ __html: modalCard.fullContent || '' }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <h1 className="hero-title reveal-up" style={{ '--delay': '0.05s' }}>
              Welcome to <span className="hero-highlight">UnisoleAI</span>
            </h1>

            <span className="hero-eyebrow reveal-up" style={{ '--delay': '0.12s' }}>
              Building India's Next Generation of AI Innovators
            </span>

            <p className="hero-subtitle reveal-up" style={{ '--delay': '0.18s' }}>
              Empowering Schools, Universities, Teachers, and Organizations with world-class Artificial Intelligence education, research, and real-world AI solutions.
            </p>

            <div className="hero-actions reveal-up" style={{ '--delay': '0.26s' }}>
              <button className="btn-hero-primary" onClick={() => (isAuthenticated() ? navigate('/query') : navigate('/register'))}>
                Get Started
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M6 9h8M12 5l4 4m-4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <Link to="/programs" className="btn-hero-secondary">
                Explore Programs
              </Link>
            </div>
          </div>

          <div className="hero-right reveal-up" style={{ '--delay': '0.15s' }}>
            <div className="hero-visual">
              <img
                src={getOptimizedImageUrl("https://res.cloudinary.com/da3sqradg/image/upload/v1783159721/ajay_mokta_millionare_cr33xx.png", { width: 600 })}
                alt="Student learning with UnisoleAI"
                className="hero-visual-img"
                width="600"
                height="600"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- STATS ---------- */}
      <section className="about-stats">
        <div className="about-stats-grid">
          {[{ value: '4', label: 'Academic Pathways' }, { value: '5000+', label: 'Active Students' }, { value: '25+', label: 'Partner Institutions' }, { value: '2+', label: 'Years Building' }].map((s, i) => (
            <div className="about-stat-card reveal-up" style={{ '--delay': `${0.05 + i * 0.05}s` }} key={s.label}>
              <span className="about-stat-value">{s.value}</span>
              <span className="about-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- INSTITUTE ---------- */}
      <section className="about-institute">
        <div className="about-institute-inner">
          <div className="about-institute-header">
            <span className="about-eyebrow">About</span>
            <h2 className="about-institute-title">Our Institute</h2>
          </div>

          <div className="about-institute-body">
            <p className="about-institute-text">
              UNISOLE AI is the Artificial Intelligence education, research, and innovation vertical of UNISOLE Skill AI Labs, focused on building AI-ready students, educators, and institutions.
            </p>
            <p className="about-institute-text">
              We deliver industry-oriented AI education, industrial training, internships, faculty development, research mentorship, and AI implementation programs for schools, colleges, universities, government institutions, and aspiring AI professionals.
            </p>
            <p className="about-institute-text">
              Our approach combines learning, hands-on projects, research, and real-world implementation to prepare the next generation for an AI-driven world.
            </p>
            <p className="about-institute-text">
              Learn. Build. Research. Innovate.
            </p>
          </div>
        </div>
      </section>

      <section className="offer">
        <div className="offer-header">
          <h2 className="offer-title reveal-up" style={{ '--delay': '0.05s' }}>
            Our Expertise
          </h2>
          <p className="offer-subtitle reveal-up" style={{ '--delay': '0.1s' }}>
            Empower yourself with essential, unconventional knowledge
          </p>
        </div>

        <OfferCarousel />
      </section>

      {/* ---------- TEAM ---------- */}
      <section className="about-team">
        <div className="about-team-header">
          <span className="about-eyebrow">The People</span>
          <h2 className="about-team-title">Meet the Team</h2>
          <p className="about-team-subtitle">
            A small team building AI education infrastructure for students across
            Himachal Pradesh and beyond.
          </p>
        </div>

        <div className="about-team-grid">
          {[
            { name: 'Ajay Mokta', role: 'Founder & CEO', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785408578/images_jjared.jpg' },
            { name: 'Girish Gaurav Sharma', role: 'Lead Advisor – Research & Innovation', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403939/IMG-20260730-WA0005.jpg_bgzql0.jpg' },
            { name: 'Ajay Sharma', role: 'Project Coordinator & Social Media Advisor', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1786345745/ajay_y6qmkw.png' },
            { name: 'Peeyush', role: 'Lead Researcher', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785408576/IMG-20260616-WA0002.jpg_qe7akr.jpg' },
            { name: 'Sargam', role: 'Pilot Project Manager', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403939/IMG-20260616-WA0005.jpg_uiuqbo.jpg' },
            { name: 'Rahul Chauhan', role: 'Implementation Associate', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1786260818/rahul_x7n0ag.jpg' },
            { name: 'Anshu Roy', role: 'Software Developer', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785477270/196225806_ufrfe9.jpg' },
            { name: 'Divyank', role: 'Tech Lead', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785404022/WhatsApp_Image_2026-07-30_at_3.03.01_PM_rheqln.jpg' },
            { name: 'Kushal', role: 'Academic Head', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403940/IMG-20250311-WA0007.jpg_vvfqnl.jpg' },
            { name: 'Aditya Kaudhal', role: 'AI & Technology Lead', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403939/IMG-20260720-WA0003.jpg_bjlrkr.jpg' },
            { name: 'Dishant Gupta', role: 'Lead Researcher', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785408916/IMG-20260310-WA0059.jpg_s6q25v.jpg' },
          ].map((member, i) => (
            <div className="about-team-card reveal-up" style={{ '--delay': `${0.05 + i * 0.05}s` }} key={member.name}>
              <div className="about-team-img-wrap">
                <img
                  src={getOptimizedImageUrl(member.img, { width: 240 })}
                  alt={member.name}
                  className="about-team-img"
                  width="240"
                  height="240"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="about-team-body">
                <div className="about-team-name-row">
                  <h3 className="about-team-name">{member.name}</h3>
                  {['Girish Gaurav Sharma', 'Peeyush', 'Anshu Roy', 'Kushal', 'Aditya Kaudhal'].includes(member.name) && (
                    <span className="about-team-tag">
                      {['Girish Gaurav Sharma', 'Peeyush', 'Anshu Roy'].includes(member.name)
                        ? 'NIT Hamirpur'
                        : member.name === 'Kushal'
                          ? 'IIT Patna'
                          : 'IIT Delhi'}
                    </span>
                  )}
                </div>
                <span className="about-team-role">{member.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mentor-promo">
        <div className="mentor-promo-card">
          <div className="mentor-promo-left">
            <span className="mentor-promo-brand">UnisoleAI</span>

            <h2 className="mentor-promo-title">
              Get in touch with us
            </h2>

            <ul className="mentor-promo-list">
              <li>Reach out for project collaborations and partnerships.</li>
              <li>Contact us for AI solutions, workshops, and training.</li>
              <li>Connect with our team for queries, support, or consultations.</li>
            </ul>

            <Link to="/query" className="mentor-promo-btn">
              Get in Touch
            </Link>
          </div>

          <div className="mentor-promo-right">
            <div className="mentor-promo-image-wrap">
              <img
                src={getOptimizedImageUrl("https://res.cloudinary.com/da3sqradg/image/upload/v1783159721/ajay_mokta_millionare_cr33xx.png", { width: 400 })}
                alt="Mentor session"
                className="mentor-promo-image"
                width="320"
                height="320"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2 className="testimonials-title reveal-up" style={{ '--delay': '0.05s' }}>
                Join others transforming their lives through learning
            </h2>

            <div className="testimonials-scroll">
                <div className="testimonial-card reveal-up" style={{ '--delay': '0.1s' }}>
                <span className="testimonial-quote">{'\u201C'}</span>
                <p className="testimonial-text">
                    {'\u201C'}Unisole Empower is a promising platform for anyone interested in AI, Data Science, and Analytics. The mix of live and recorded lectures gives flexibility, and having mentors plus a peer community makes learning much more engaging. The progress tracking is also a helpful touch.{'\u201D'} {'\u2014'} Student
                </p>
                <div className="testimonial-author">
                    <span className="testimonial-avatar">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                        </svg>
                    </span>
                    <div>
                    <span className="testimonial-name">Mehul Atri</span>
                    {/* <span className="testimonial-role">Student</span> */}
                    </div>
                </div>
                </div>

                <div className="testimonial-card reveal-up" style={{ '--delay': '0.15s' }}>
                <span className="testimonial-quote">{'\u201C'}</span>
                <p className="testimonial-text">
                    {'\u201C'}unisole is the best platform where you get mentors who not just taught you but how to approach companies for a job or how to get internships ....so helpful.{'\u201D'} {'\u2014'} Student
                </p>
                <div className="testimonial-author">
                    <span className="testimonial-avatar">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                        </svg>
                    </span>
                    <div>
                    <span className="testimonial-name">Ravi Kumar Saini</span>
                    {/* <span className="testimonial-role">School Coordinator</span> */}
                    </div>
                </div>
                </div>

                <div className="testimonial-card reveal-up" style={{ '--delay': '0.2s' }}>
                <span className="testimonial-quote">{'\u201C'}</span>
                <p className="testimonial-text">
                    {'\u201C'}Great platform for learning AI!.{'\u201D'} {'\u2014'} Student
                </p>
                <div className="testimonial-author">
                    <span className="testimonial-avatar">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                        </svg>
                    </span>
                    <div>
                    <span className="testimonial-name">Piyush Sharma</span>
                    {/* <span className="testimonial-role">Student</span> */}
                    </div>
                </div>
                </div>

                <div className="testimonial-card reveal-up" style={{ '--delay': '0.25s' }}>
                <span className="testimonial-quote">{'\u201C'}</span>
                <p className="testimonial-text">
                    {'\u201C'}A valuable collaboration that brought meaningful AI exposure to our school.{'\u201D'} {'\u2014'} School Teacher
                </p>
                <div className="testimonial-author">
                    <span className="testimonial-avatar">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                        </svg>
                    </span>
                    <div>
                    <span className="testimonial-name">Anita Sharma</span>
                    {/* <span className="testimonial-role">School Teacher</span> */}
                    </div>
                </div>
                </div>
            </div>
            </section>

      <Footer />
    </>
  );
}