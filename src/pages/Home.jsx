import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CoursesPage.css';
import './Home.css';
import './About.css';
import { offerCards } from '../data/offerContent';
import { isAuthenticated } from '../utils/auth';

const QUERY_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe3H0Yv2hwFvFGppiOwZ_dt9zUNI2hk52Z0gaU0J0VFoAB81Q/viewform?usp=dialog';

const openQueryForm = () => {
  window.open(QUERY_FORM_URL, '_blank', 'noopener,noreferrer');
};

const courses = [
  {
    id: 1,
    slug: 'from-notebook-to-production',
    img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785476504/Gemini_Generated_Image_a0vw7ma0vw7ma0v1w_tkzbpn.png',
    title: 'From Notebook to Production: Real AI Engineering',
    instructor: 'Ajay Mokta',
    rating: '4.7',
    ratingsCount: '4,823 ratings',
    price: '₹59,000.00',
    oldPrice: '₹49,000.00',
  },
  {
    id: 2,
    slug: 'complete-python',
    img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785476507/Gemini_Generated_Image_nwyi73nwy1i73nwyi_afrilq.png',
    title: 'Complete Python Programming - From Basics to Object-Oriented Concepts',
    instructor: 'Ajay Mokta',
    rating: '4.6',
    ratingsCount: '4,516 ratings',
    price: '₹3,000.00',
    oldPrice: '4,999.00',
  },
  {
    id: 3,
    slug: 'tableau-ultimate-course',
    img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785476500/Gemini_Generated_Image_oh2zrxxo1hzrxxohzr_kocadb.png',
    title: 'Tableau Ultimate Course',
    instructor: 'Ajay Mokta',
    rating: '4.7',
    ratingsCount: '3,642 ratings',
    price: '₹1,719.00',
    oldPrice: '₹12,000.00',
  },
  {
    id: 4,
    slug: 'full-stack-data-science-pro',
    img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785476502/hey_g2223emini_create_a_thumbn_1_drjlnz.png',
    title: 'Full Stack Data Science Pro',
    instructor: 'Ajay Mokta',
    rating: '4.5',
    ratingsCount: '3,207 ratings',
    price: '₹59,999.00',
    oldPrice: '₹70,000.00',
  },
  {
    id: 5,
    slug: 'anyone-can-sketech',
    img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785479019/Gemini_Generated_Image_mvv06hgmvv0hgmvv0_kmqbgv.png',
    title: 'Anyone Can Sketch',
    instructor: 'Lucky Garg',
    rating: '4.6',
    ratingsCount: '2,849 ratings',
    price: '₹1,499.00',
    oldPrice: '₹2,999.00',
  },
];

function OfferCarousel() {
  const initialActiveIndex = Math.min(offerCards.length - 1, Math.floor(offerCards.length / 2));
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCard, setModalCard] = useState(null);
  const [xOffset, setXOffset] = useState(0);
  const [slideW, setSlideW] = useState(0);
  const timerRef = useRef(null);
  const viewportRef = useRef(null);
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
      <div className="offer-carousel-viewport" ref={viewportRef}>
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
                  <img src={card.img} alt={card.title} className="offer-slide-img" />
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
                <img src={modalCard.img} alt={modalCard.title} className="offer-modal-top-img" />
                <div className="offer-modal-top-overlay" />
              </div>
              <div className="offer-modal-top-content">
                <h2 className="offer-modal-top-title">{modalCard.title}</h2>
                <p className="offer-modal-top-desc">{modalCard.desc}</p>
              </div>
            </div>
            <div className="offer-modal-body" dangerouslySetInnerHTML={{ __html: modalCard.fullContent || '' }} />
            <div className="modal-footer-cta">
              <button className="modal-cta-btn" onClick={openQueryForm}>
                Get Started
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9h10M9 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

    const [slideIndex, setSlideIndex] = useState(0);
    const [vw, setVw] = useState(window.innerWidth);
    const [cardStep, setCardStep] = useState(0);
    const coursesTrackRef = useRef(null);
    const firstCourseCardRef = useRef(null);

    useEffect(() => {
      const onResize = () => setVw(window.innerWidth);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }, []);

    const visibleCount = vw < 640 ? 1 : vw < 1024 ? 2 : 4;
    const maxIndex = Math.max(0, courses.length - visibleCount);

    // Measure the real rendered width of a single card (+ the track's gap)
    // instead of guessing with percentage/px math. This is what guarantees
    // that on small screens exactly ONE card moves per slide, no matter
    // what width the CSS media queries end up giving the card.
    useEffect(() => {
      const measure = () => {
        const card = firstCourseCardRef.current;
        const track = coursesTrackRef.current;
        if (!card || !track) return;
        const trackStyle = window.getComputedStyle(track);
        const gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;
        setCardStep(card.getBoundingClientRect().width + gap);
      };
      measure();
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }, [vw]);

    // If the viewport grows/shrinks and visibleCount changes, keep the
    // current slideIndex within the new valid range instead of getting
    // stuck past the last card.
    useEffect(() => {
      setSlideIndex((i) => Math.min(i, maxIndex));
    }, [maxIndex]);

    const goPrev = () => setSlideIndex((i) => Math.max(0, i - 1));
    const goNext = () => setSlideIndex((i) => Math.min(maxIndex, i + 1));

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
              <button className="btn-hero-primary" onClick={() => (isAuthenticated() ? openQueryForm() : navigate('/register'))}>
                Get Started
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M6 9h8M12 5l4 4m-4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <Link to="/courses" className="btn-hero-secondary">
                Explore Courses
              </Link>
            </div>
          </div>

          <div className="hero-right reveal-up" style={{ '--delay': '0.15s' }}>
            <div className="hero-visual">
              <img
                src="https://res.cloudinary.com/da3sqradg/image/upload/v1783159721/ajay_mokta_millionare_cr33xx.png"
                alt="Student learning with UnisoleAI"
                className="hero-visual-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- STATS ---------- */}
      <section className="about-stats">
        <div className="about-stats-grid">
          {[{ value: '5+', label: 'Courses' }, { value: '5000+', label: 'Active Students' }, { value: '25+', label: 'Partner Institutions' }, { value: '2+', label: 'Years Building' }].map((s, i) => (
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
              UnisoleAI started as a side project between two final-year
              engineering students, Ajay Mokta and Dishant Gupta. We kept running
              into the same problem: a lot of people wanted to learn AI and data
              science, but most courses either dragged on too long or skipped the
              part where you actually build something.
            </p>
            <p className="about-institute-text">
              So we built what we wished existed: mentor-led courses in AI, data
              science, and machine learning, taught through live sessions and
              projects you can actually put in a portfolio, not just a certificate
              you forget about a week later.
            </p>
            <p className="about-institute-text">
              Outside the classroom, our team is also working on a research
              project of our own: an AI-powered hail prediction and anti-hail net
              deployment system, built to help apple growers in Himachal Pradesh
              protect their crops from increasingly unpredictable weather.
            </p>
            <p className="about-institute-text">
              Everything we do comes back to one idea. Technology should be
              something students actually get to use, not just read about.
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

        <section className="courses">
        <div className="courses-header">
          <h2 className="courses-title reveal-up" style={{ '--delay': '0.05s' }}>
            Trending Courses
          </h2>
        </div>

        <div className="courses-carousel">
          <button
            className="courses-nav courses-nav-left"
            onClick={goPrev}
            disabled={slideIndex === 0}
            aria-label="Previous courses"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4l-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="courses-viewport">
            <div
              className="courses-track"
              ref={coursesTrackRef}
              style={{
                transform: `translateX(-${slideIndex * cardStep}px)`,
              }}
            >
              {courses.map((course, courseIdx) => (
            <Link
              to={`/courses/${course.slug}`}
              className="course-card courses-card"
              key={course.id}
              ref={courseIdx === 0 ? firstCourseCardRef : null}
            >
                <div className="courses-card-img-wrap">
                  <img src={course.img} alt={course.title} className="courses-card-img" />
                </div>
                <div className="courses-card-body">
                  <h3 className="courses-card-title">{course.title}</h3>
                  <p className="courses-card-instructor">{course.instructor}</p>
                  <div className="courses-card-meta">
                    <span className="courses-rating">★ {course.rating}</span>
                    <span className="courses-ratings-count">{course.ratingsCount}</span>
                  </div>
                  <div className="courses-card-footer">
                    <div className="courses-card-price">
                      <span className="courses-price">{course.price}</span>
                      <span className="courses-old-price">{course.oldPrice}</span>
                    </div>
                </div>
              </div>
            </Link>
            ))}
            </div>
          </div>

          <button
            className="courses-nav courses-nav-right"
            onClick={goNext}
            disabled={slideIndex === maxIndex}
            aria-label="Next courses"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </section>
      {/* ---------- OUR STORY ---------- */}
      {/* <section className="about-hero">
        <div className="about-hero-inner">
          <div className="about-hero-visual reveal-up" style={{ '--delay': '0.05s' }}>
            <img
              src="https://res.cloudinary.com/da3sqradg/image/upload/v1783159721/ajay_mokta_millionare_cr33xx.png"
              alt="Unisole"
              className="about-hero-logo"
            />
          </div>

          <div className="about-hero-text">
            <span className="about-eyebrow reveal-up" style={{ '--delay': '0.1s' }}>Our Story</span>
            <h1 className="about-hero-title reveal-up" style={{ '--delay': '0.15s' }}>
              Empowering generations to become <span className="hero-highlight">geniuses</span>
            </h1>
            <p className="about-hero-subtitle reveal-up" style={{ '--delay': '0.2s' }}>
              UnisoleAI helps generations become tech-savvy through accessible,
              step-by-step courses in AI, Data Science, and Machine Learning.
            </p>
            <button className="about-hero-cta reveal-up" style={{ '--delay': '0.28s' }} onClick={() => (isAuthenticated() ? openQueryForm() : navigate('/register'))}>
              Start Your Journey With Us
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M6 9h8M12 5l4 4m-4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section> */}

      

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
            { name: 'Ajay Mokta', role: 'Founder & CEO', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785408578/images_jjared.jpg', bio: 'B.Tech in Physics & Photonics Science from NIT Hamirpur. Leads the vision of making AI education accessible to every student, having trained 2,000+ learners and mentored 5,000+ students across 50+ institutions in Himachal Pradesh.' },
            { name: 'Girish Gaurav Sharma', role: 'Lead Advisor – Research & Innovation', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403939/IMG-20260730-WA0005.jpg_bgzql0.jpg', bio: "Girish is Lead Advisor – Research & Innovation at UnisoleAI, guiding AI strategy, software engineering, and product innovation. He mentors student researchers and technical teams, bridging academia and industry to build scalable AI solutions—supporting UnisoleAI's mission of solving real-world problems through education, research, and innovation."},
            { name: 'Ajay Sharma', role: 'Project Coordinator & Social Media Advisor', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403939/IMG-20260616-WA0003.jpg_sfvzmm.jpg', bio: 'Manages project execution and stakeholder coordination, while strengthening our digital presence and showcasing the impact of AI-driven learning across Himachal Pradesh.' },
            { name: 'Peeyush', role: 'Lead Researcher', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785408576/IMG-20260616-WA0002.jpg_qe7akr.jpg', bio: 'Researches latent reasoning in Small Language Models, focusing on Group Relative Policy Optimization to enhance reasoning and generalisation under limited compute.' },
            { name: 'Sargam', role: 'Pilot Project Manager', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403939/IMG-20260616-WA0005.jpg_uiuqbo.jpg', bio: 'Final-year student at St. Bede\u2019s College, Shimla. Coordinates the AI & Computational Thinking Pilot Project across government schools, from training sessions to impact reporting.' },
            { name: 'Rahul Chauhan', role: 'Implementation Associate', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1786260818/rahul_x7n0ag.jpg', bio: 'Rahul is an Implementation Associate at UnisoleAI, responsible for ensuring the smooth execution of our AI initiatives and projects.' },
            { name: 'Anshu Roy', role: 'Software Developer', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785477270/196225806_ufrfe9.jpg', bio: 'Anshu Roy is a software developer currently studying at NIT Hamirpur. He enjoys building efficient, scalable applications and is always exploring new technologies to grow as a developer.' },
            { name: 'Divyank', role: 'Tech Lead', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785404022/WhatsApp_Image_2026-07-30_at_3.03.01_PM_rheqln.jpg', bio: 'Divyank leads engineering at Unisole, helping the team ship great products together. Passionate about computers and technology, he believes the best work happens through collaboration and curiosity.' },
            { name: 'Kushal', role: 'Academic Head', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403940/IMG-20250311-WA0007.jpg_vvfqnl.jpg', bio: 'Academic Head at UnisoleAI. An IIT Patna graduate and Engineer at Tech Mahindra, he leads curriculum development, technical mentoring and AI Education initiatives with strong industry and academic expertise.' },
            { name: 'Aditya Kaudhal', role: 'AI & Technology Lead', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403939/IMG-20260720-WA0003.jpg_bjlrkr.jpg', bio: 'AI & Technology Lead at UnisoleAI. An IIT Delhi M.Tech graduate, AI System Development and the integration of advanced technologies across our education programs.' },
            { name: 'Dishant Gupta', role: 'Lead Reseacher', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785408916/IMG-20260310-WA0059.jpg_s6q25v.jpg', bio: 'Lead Researcher at UnisoleAI and former engineer at Baker Hughes. He leads AI research, profuct innovation and applied machine learning initiatives to develop impactful and scalable AI Solutions.'},
          ].map((member, i) => (
            <div className="about-team-card reveal-up" style={{ '--delay': `${0.05 + i * 0.05}s` }} key={member.name}>
              <div className="about-team-img-wrap">
                <img src={member.img} alt={member.name} className="about-team-img" />
              </div>
              <div className="about-team-body">
                <h3 className="about-team-name">{member.name}</h3>
                <span className="about-team-role">{member.role}</span>
                <p className="about-team-bio">{member.bio}</p>
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

            <a href="https://docs.google.com/forms/d/e/1FAIpQLSe3H0Yv2hwFvFGppiOwZ_dt9zUNI2hk52Z0gaU0J0VFoAB81Q/viewform?usp=dialog" target="_blank" rel="noopener noreferrer" className="mentor-promo-btn">
                Get in Touch
            </a>

            </div>

            <div className="mentor-promo-right">
            <div className="mentor-promo-image-wrap">
                <img
                src="https://res.cloudinary.com/da3sqradg/image/upload/v1783159721/ajay_mokta_millionare_cr33xx.png"
                alt="Mentor session"
                className="mentor-promo-image"
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