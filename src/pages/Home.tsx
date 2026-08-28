import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { offerCards } from '../data/offerContent';
import { getOptimizedImageUrl } from '../utils/image';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  Star, 
  Users, 
  Award, 
  BookOpen, 
  Clock, 
  Terminal, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  CheckCircle2,
  Building2,
  Compass,
  ArrowUpRight
} from 'lucide-react';

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
  const [modalCard, setModalCard] = useState<any>(null);
  const [cardWidth, setCardWidth] = useState(340);
  const [gap, setGap] = useState(16);
  const viewportRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const len = offerCards.length;

  const updateDimensions = () => {
    const vp = viewportRef.current;
    if (!vp) return;
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth < 1024;
    const g = isMobile ? 12 : 16;
    setGap(g);

    const visibleCards = isMobile ? 1.15 : isTablet ? 2.15 : 3;
    const totalGap = (Math.floor(visibleCards) - 1) * g;
    const w = (vp.offsetWidth - totalGap) / visibleCards;
    setCardWidth(Math.max(w, 280));
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (isModalOpen) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % len);
    }, 5000);
    return () => clearInterval(timer);
  }, [len, isModalOpen]);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current > 40) {
      handlePrev();
    } else if (touchDeltaX.current < -40) {
      handleNext();
    }
  };

  const openModal = (card: any) => {
    setModalCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalCard(null);
  };

  const xOffset = activeIndex * (cardWidth + gap);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
        <div className="max-w-xl space-y-2">
          <span className="mono-tag text-zinc-500 dark:text-zinc-400 block">
            Focus Areas
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Core Institutional Expertise
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Practical AI education frameworks, faculty training, and specialized local campus laboratories.
          </p>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          <div className="text-xs font-mono text-zinc-400">
            <span className="text-zinc-900 dark:text-white font-bold">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="mx-1 opacity-40">/</span>
            <span>{String(len).padStart(2, '0')}</span>
          </div>
          <div className="flex gap-1.5">
            <button
              className="p-2 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              onClick={handlePrev}
              type="button"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              onClick={handleNext}
              type="button"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Track */}
      <div
        className="w-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
        ref={viewportRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
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
                className={`minimal-card flex flex-col justify-between overflow-hidden cursor-pointer group ${
                  isActive
                    ? 'border-zinc-400 dark:border-zinc-600'
                    : ''
                }`}
                style={{ width: `${cardWidth}px`, flex: `0 0 ${cardWidth}px` }}
                onClick={() => openModal(card)}
              >
                {/* Visual Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                  <img
                    src={getOptimizedImageUrl(card.img, { width: 500 })}
                    alt={card.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    width="500"
                    height="280"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
                  
                  {/* Card top badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 text-[9px] font-mono text-white bg-zinc-950/80 backdrop-blur-xs rounded tracking-wider uppercase border border-white/10">
                      {expertiseTags[i] || `DOMAIN 0${i + 1}`}
                    </span>
                    <span className="p-1 rounded bg-zinc-950/60 text-white">
                      <Maximize2 className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-5 justify-between space-y-4">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  
                  {/* Action Link */}
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-white group-hover:translate-x-0.5 transition-transform">
                    <span>Explore Pathway</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center gap-1.5 mt-6">
        {offerCards.map((_, i) => (
          <button
            key={i}
            className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              i === activeIndex ? 'w-6 bg-zinc-900 dark:bg-white' : 'w-1.5 bg-zinc-300 dark:bg-zinc-700'
            }`}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            type="button"
          />
        ))}
      </div>

      {/* Detail Modal */}
      {isModalOpen && modalCard && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150" 
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-white backdrop-blur-xs transition-colors cursor-pointer"
              onClick={closeModal} 
              type="button" 
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="relative h-44 sm:h-52 w-full flex-shrink-0 overflow-hidden bg-zinc-950">
              <img
                src={getOptimizedImageUrl(modalCard.img, { width: 900 })}
                alt={modalCard.title}
                className="h-full w-full object-cover"
                width="900"
                height="280"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
              
              <div className="absolute bottom-4 left-5 right-5">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Domain Focus</span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1 leading-tight">{modalCard.title}</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-grow overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed custom-modal-body">
              <div 
                dangerouslySetInnerHTML={{ __html: modalCard.fullContent || `<p>${modalCard.desc}</p>` }} 
                className="prose dark:prose-invert max-w-none prose-h3:text-sm prose-h3:font-bold prose-h3:mt-4 prose-h3:mb-2 prose-p:my-2 prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 text-xs sm:text-sm"
              />

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2">
                <Link to="/programs" onClick={closeModal}>
                  <button className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer">
                    <span>View Curriculum</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
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
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-2xl mb-10 space-y-2">
        <span className="mono-tag text-zinc-500 dark:text-zinc-400 block">
          Advisory & Faculty
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Leadership Team
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Engineers and faculty advisors from premier institutions (IIT Delhi, NIT Hamirpur, IIT Patna) designing curriculum frameworks.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {teamMembers.map((member) => (
          <div
            className="minimal-card flex flex-col p-3 group"
            key={member.name}
          >
            {/* Avatar */}
            <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950 rounded-lg mb-2.5">
              <img
                src={getOptimizedImageUrl(member.img, { width: 300 })}
                alt={member.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
                width="300"
                height="300"
                loading="lazy"
                decoding="async"
              />
            </div>
            
            {/* Details */}
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-1">
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
                    {member.name}
                  </h3>
                  {member.tag && (
                    <span className="px-1 py-0.2 text-[8px] font-mono text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 rounded">
                      {member.tag}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                  {member.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950">
      <Navbar />

      {/* ---------- HERO SECTION ---------- */}
      <section className="relative pt-24 pb-14 sm:pt-32 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 sm:gap-14">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Academic AI Framework 2026</span>
              </div>
              
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-zinc-900 dark:text-white">
                Applied Artificial Intelligence <br />
                <span className="text-zinc-500 dark:text-zinc-400">
                  for Higher Education.
                </span>
              </h1>
              
              {/* Subheading */}
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
                Bridging institutional classrooms and production machine learning engineering. Verified curricula, containerized local laboratories, and hands-on faculty mentoring.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1 w-full sm:w-auto">
                <Link to="/programs" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center font-semibold px-5 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white text-xs sm:text-sm transition-all duration-150 active:scale-[0.98] gap-2 min-h-[44px] cursor-pointer">
                    <span>Explore 4 Pathways</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>

                <Link to="/playground" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center font-semibold px-5 py-3 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white dark:bg-zinc-900 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm transition-all duration-150 active:scale-[0.98] gap-2 min-h-[44px] cursor-pointer">
                    <Terminal className="w-4 h-4 text-zinc-500" />
                    <span>Inference Sandbox</span>
                  </button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-3 flex flex-wrap items-center gap-5 text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/80 w-full font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                  <span>IIT & NIT Mentored</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                  <span>Production MLOps</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                  <span>Campus Lab Setup</span>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5 relative w-full aspect-square max-w-[440px] mx-auto lg:max-w-none">
              <div className="relative h-full w-full overflow-hidden border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900 shadow-minimal">
                <img
                  src={getOptimizedImageUrl("https://res.cloudinary.com/da3sqradg/image/upload/v1783159721/ajay_mokta_millionare_cr33xx.png", { width: 600 })}
                  alt="Student learning with Unisole Skill AI Labs"
                  className="h-full w-full object-cover"
                  width="600"
                  height="600"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />

                {/* Floating Metrics Badge Overlay */}
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-zinc-950/85 backdrop-blur-xs rounded-xl border border-white/10 text-white flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 block">Verified Deployments</span>
                    <span className="text-xs font-bold">5,000+ Enrolled Students</span>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] font-mono">
                    25+ Labs
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ---------- STATS SECTION ---------- */}
      <section className="bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-200/80 dark:border-zinc-800/80 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
            {[
              { value: '4', label: 'Academic Pathways', desc: 'CS, Science, Commerce, Design' },
              { value: '5,000+', label: 'Active Learners', desc: 'Across universities and colleges' },
              { value: '25+', label: 'Campus Labs', desc: 'Local air-gapped lab nodes' },
              { value: '2+', label: 'Years Building', desc: 'Continuous curriculum updates' }
            ].map((s) => (
              <div className="minimal-card p-4 sm:p-5" key={s.label}>
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white block">{s.value}</span>
                <span className="text-xs text-zinc-800 dark:text-zinc-200 font-bold mt-1 block">{s.label}</span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 block">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- INSTITUTE ABOUT SECTION & 3 PILLARS ---------- */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12 space-y-2">
            <span className="mono-tag text-zinc-500 dark:text-zinc-400 block">
              Pedagogy
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Learn · Build · Research · Innovate
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We guide academic strategy and deliver practical skill frameworks for institutions across India.
            </p>
          </div>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
            {[
              { num: "01", title: "Curriculum Alignment", desc: "Syllabi mapped directly to modern industry requirements and university standards." },
              { num: "02", title: "Hands-on MLOps Labs", desc: "Students build, containerize, and deploy real models with FastAPI and Docker." },
              { num: "03", title: "Faculty & Student Mentorship", desc: "Live guidance by IIT and NIT alumni on applied research and open source projects." }
            ].map((p, idx) => (
              <div key={idx} className="minimal-card p-6 space-y-3">
                <span className="text-xs font-mono text-zinc-400 font-bold block">{p.num}</span>
                <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">{p.title}</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- EXPERTISE / CAROUSEL ---------- */}
      <section className="bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <OfferCarousel />
      </section>

      {/* ---------- TEAM SECTION ---------- */}
      <TeamSection />

      {/* ---------- TESTIMONIALS SECTION ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-2xl mb-10 space-y-2">
          <span className="mono-tag text-zinc-500 dark:text-zinc-400 block">
            Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Community Testimonials
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              text: "Unisole Empower is a promising platform for anyone interested in AI, Data Science, and Analytics. The mix of live and recorded lectures gives flexibility.",
              author: "Mehul Atri",
              role: "Student Member"
            },
            {
              text: "unisole is the best platform where you get mentors who not just taught you but how to approach companies for a job or how to get internships.",
              author: "Ravi Kumar Saini",
              role: "Student Member"
            },
            {
              text: "Great platform for learning AI! The lessons are structured cleanly and cover high-production engineering topics like APIs and Docker containers.",
              author: "Piyush Sharma",
              role: "Student Member"
            },
            {
              text: "A valuable collaboration that brought meaningful AI exposure to our school. The teachers felt empowered and the students built interesting projects.",
              author: "Deepak Katoch",
              role: "School Teacher"
            }
          ].map((t, i) => (
            <div 
              className="minimal-card flex flex-col justify-between p-5"
              key={i}
            >
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-2.5 mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center font-bold text-xs">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-white block leading-tight">{t.author}</span>
                  <span className="text-[10px] text-zinc-400 block">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}