import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Home.css';
import './About.css';
import { offerCards } from '../data/offerContent';
import { getOptimizedImageUrl } from '../utils/image';

const expertiseTags = [
  '01 · Academic Pathways',
  '02 · School AI Labs',
  '03 · Faculty Development',
  '04 · Higher Education',
  '05 · Applied AI Research',
  '06 · Live Internships',
  '07 · Public Partnerships',
  '08 · Venture Incubation',
];

function OfferCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCard, setModalCard] = useState(null);
  const [cardWidth, setCardWidth] = useState(360);
  const [gap, setGap] = useState(20);
  const viewportRef = useRef(null);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const len = offerCards.length;

  const updateDimensions = () => {
    const vp = viewportRef.current;
    if (!vp) return;
    const isMobile = window.innerWidth <= 600;
    const isTablet = window.innerWidth <= 960;
    const g = isMobile ? 12 : 20;
    setGap(g);

    const visibleCards = isMobile ? 1.15 : isTablet ? 2 : 3;
    const totalGap = (Math.floor(visibleCards) - 1) * g;
    const w = (vp.offsetWidth - totalGap) / visibleCards;
    setCardWidth(w);
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Automatic slide interval (every 3.2 seconds)
  useEffect(() => {
    if (isModalOpen) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % len);
    }, 3200);
    return () => clearInterval(timer);
  }, [len, isModalOpen]);

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

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % len);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + len) % len);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current > 40) {
      handlePrev();
    } else if (touchDeltaX.current < -40) {
      handleNext();
    }
  };

  const openModal = (card) => {
    setModalCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalCard(null);
  };

  const xOffset = activeIndex * (cardWidth + gap);

  return (
    <div className="offer-carousel-wrapper">
      <div className="offer-header-row">
        <div className="offer-header-left">
          <span className="about-eyebrow reveal-up" style={{ '--delay': '0.05s' }}>Domains & Capabilities</span>
          <h2 className="offer-title reveal-up" style={{ '--delay': '0.1s' }}>Our Expertise</h2>
          <p className="offer-subtitle reveal-up" style={{ '--delay': '0.15s' }}>
            Empower yourself with essential, unconventional knowledge through industry-aligned AI programs and tech.
          </p>
        </div>

        <div className="offer-controls reveal-up" style={{ '--delay': '0.2s' }}>
          <div className="offer-counter">
            <span className="offer-counter-current">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="offer-counter-sep">/</span>
            <span className="offer-counter-total">{String(len).padStart(2, '0')}</span>
          </div>
          <button
            className="offer-nav-btn"
            onClick={handlePrev}
            type="button"
            aria-label="Previous slide"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            className="offer-nav-btn"
            onClick={handleNext}
            type="button"
            aria-label="Next slide"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className="offer-carousel-viewport reveal-up"
        style={{ '--delay': '0.25s' }}
        ref={viewportRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="offer-track"
          style={{
            transform: `translateX(-${xOffset}px)`,
            gap: `${gap}px`,
          }}
        >
          {offerCards.map((card, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={card.id}
                className={`offer-card ${isActive ? 'offer-card--active' : ''}`}
                style={{ width: `${cardWidth}px`, flex: `0 0 ${cardWidth}px` }}
                onClick={() => openModal(card)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openModal(card)}
              >
                <div className="offer-card-img-wrap">
                  <img
                    src={getOptimizedImageUrl(card.img, { width: 700 })}
                    alt={card.title}
                    className="offer-card-img"
                    width="700"
                    height="440"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="offer-card-overlay" />

                <div className="offer-card-top">
                  <span className="offer-card-badge">{expertiseTags[i] || `0${i + 1}`}</span>
                  <span className="offer-card-expand" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </span>
                </div>

                <div className="offer-card-content">
                  <h3 className="offer-card-title">{card.title}</h3>
                  <p className="offer-card-desc">{card.desc}</p>
                  <div className="offer-card-footer">
                    <span className="offer-card-cta">
                      Explore Details
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7h8M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="offer-dots">
        {offerCards.map((_, i) => (
          <button
            key={i}
            className={`offer-dot ${i === activeIndex ? 'offer-dot--active' : ''}`}
            onClick={() => setActiveIndex(i)}
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
                  src={getOptimizedImageUrl(modalCard.img, { width: 900 })}
                  alt={modalCard.title}
                  className="offer-modal-top-img"
                  width="900"
                  height="300"
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

const teamMembers = [
  { name: 'Ajay Mokta', role: 'Founder & CEO', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785408578/images_jjared.jpg' },
  { name: 'Girish Gaurav Sharma', role: 'Lead Advisor – Research & Innovation', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403939/IMG-20260730-WA0005.jpg_bgzql0.jpg', tag: 'NIT Hamirpur' },
  { name: 'Ajay Sharma', role: 'Project Coordinator & Social Media Advisor', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1786345745/ajay_y6qmkw.png' },
  { name: 'Peeyush', role: 'Lead Researcher', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785408576/IMG-20260616-WA0002.jpg_qe7akr.jpg', tag: 'NIT Hamirpur' },
  { name: 'Sargam', role: 'Pilot Project Manager', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403939/IMG-20260616-WA0005.jpg_uiuqbo.jpg' },
  { name: 'Rahul Chauhan', role: 'Implementation Associate', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1786260818/rahul_x7n0ag.jpg' },
  { name: 'Anshu Roy', role: 'Software Developer', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785477270/196225806_ufrfe9.jpg', tag: 'NIT Hamirpur' },
  { name: 'Divyank', role: 'Tech Lead', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785404022/WhatsApp_Image_2026-07-30_at_3.03.01_PM_rheqln.jpg' },
  { name: 'Kushal', role: 'Academic Head', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403940/IMG-20250311-WA0007.jpg_vvfqnl.jpg', tag: 'IIT Patna' },
  { name: 'Aditya Kaudhal', role: 'AI & Technology Lead', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403939/IMG-20260720-WA0003.jpg_bjlrkr.jpg', tag: 'IIT Delhi' },
  { name: 'Dishant Gupta', role: 'Lead Researcher', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785408916/IMG-20260310-WA0059.jpg_s6q25v.jpg' },
];

function TeamSection() {
  return (
    <section className="about-team">
      <div className="about-team-container">
        <div className="about-team-header">
          <span className="about-eyebrow reveal-up" style={{ '--delay': '0.05s' }}>The People</span>
          <h2 className="about-team-title reveal-up" style={{ '--delay': '0.1s' }}>Meet the Team</h2>
          <p className="about-team-subtitle reveal-up" style={{ '--delay': '0.15s' }}>
            A small team building AI education infrastructure for students across Himachal Pradesh and beyond.
          </p>
        </div>

        <div className="about-team-grid">
          {teamMembers.map((member, i) => (
            <div
              className="about-team-card reveal-up"
              style={{ '--delay': `${0.03 + (i % 6) * 0.03}s` }}
              key={member.name}
            >
              <div className="about-team-img-wrap">
                <img
                  src={getOptimizedImageUrl(member.img, { width: 300 })}
                  alt={member.name}
                  className="about-team-img"
                  width="300"
                  height="300"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="about-team-body">
                <div className="about-team-name-row">
                  <h3 className="about-team-name">{member.name}</h3>
                  {member.tag && (
                    <span className="about-team-tag">{member.tag}</span>
                  )}
                </div>
                <span className="about-team-role">{member.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <h1 className="hero-title reveal-up" style={{ '--delay': '0.05s' }}>
              Welcome to <span className="hero-highlight">Unisole Skill AI Labs</span>
            </h1>

            <span className="hero-eyebrow reveal-up" style={{ '--delay': '0.12s' }}>
              Building India's Next Generation of AI Innovators
            </span>

            <p className="hero-subtitle reveal-up" style={{ '--delay': '0.18s' }}>
              Empowering Schools, Universities, Teachers, and Organizations with world-class Artificial Intelligence education, research, and real-world AI solutions.
            </p>

            <div className="hero-actions reveal-up" style={{ '--delay': '0.26s' }}>
              <Link to="/programs" className="btn-hero-primary">
                Explore Programs
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M6 9h8M12 5l4 4m-4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="hero-right reveal-up" style={{ '--delay': '0.15s' }}>
            <div className="hero-visual">
              <img
                src={getOptimizedImageUrl("https://res.cloudinary.com/da3sqradg/image/upload/v1783159721/ajay_mokta_millionare_cr33xx.png", { width: 600 })}
                alt="Student learning with Unisole Skill AI Labs"
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
              Unisole Skill AI Labs is focused on building AI-ready students, educators, and institutions through world-class Artificial Intelligence education, research, and innovation.
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

      {/* ---------- EXPERTISE ---------- */}
      <section className="offer">
        <OfferCarousel />
      </section>

      {/* ---------- TEAM ---------- */}
      <TeamSection />


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