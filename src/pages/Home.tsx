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
  ExternalLink
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
    const g = isMobile ? 12 : 20;
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
    }, 4000);
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
        <div className="max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            Capabilities & Focus Areas
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Our Core Expertise
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Unconventional knowledge delivered through industry-aligned AI programs, research collaborations, and state-of-the-art campus lab setups.
          </p>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center justify-between md:justify-end gap-4">
          <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
            <span className="text-indigo-600 dark:text-indigo-400 text-sm">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="mx-1.5 opacity-40">/</span>
            <span>{String(len).padStart(2, '0')}</span>
          </div>
          <div className="flex gap-2">
            <button
              className="p-2.5 rounded-xl border border-slate-200/80 hover:border-indigo-400 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-all duration-200 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer shadow-xs"
              onClick={handlePrev}
              type="button"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="p-2.5 rounded-xl border border-slate-200/80 hover:border-indigo-400 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-all duration-200 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer shadow-xs"
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
          className="flex transition-transform duration-500 ease-out"
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
                className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300 group cursor-pointer ${
                  isActive
                    ? 'border-indigo-500/80 bg-white dark:bg-slate-900 shadow-xl ring-2 ring-indigo-500/20'
                    : 'border-slate-200/80 hover:border-indigo-400/60 bg-white dark:border-slate-800 dark:bg-slate-900/50 hover:shadow-md'
                }`}
                style={{ width: `${cardWidth}px`, flex: `0 0 ${cardWidth}px` }}
                onClick={() => openModal(card)}
              >
                {/* Visual Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                  <img
                    src={getOptimizedImageUrl(card.img, { width: 500 })}
                    alt={card.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    width="500"
                    height="280"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  
                  {/* Card top badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 text-[10px] font-bold text-white bg-slate-950/75 backdrop-blur-md rounded-lg tracking-wider border border-white/10 uppercase">
                      {expertiseTags[i]?.split(' · ')[1] || `DOMAIN 0${i + 1}`}
                    </span>
                    <span className="p-1.5 rounded-lg bg-white/25 backdrop-blur-md text-white border border-white/20">
                      <Maximize2 className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-5 sm:p-6 justify-between space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  
                  {/* Action Link */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Explore Pathway Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center gap-1.5 mt-8">
        {offerCards.map((_, i) => (
          <button
            key={i}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === activeIndex ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200" 
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-colors cursor-pointer"
              onClick={closeModal} 
              type="button" 
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="relative h-48 sm:h-56 w-full flex-shrink-0 overflow-hidden bg-slate-950">
              <img
                src={getOptimizedImageUrl(modalCard.img, { width: 900 })}
                alt={modalCard.title}
                className="h-full w-full object-cover"
                width="900"
                height="280"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              
              <div className="absolute bottom-5 left-6 right-6">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block">Domain Focus</span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1 leading-tight">{modalCard.title}</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed custom-modal-body">
              <div 
                dangerouslySetInnerHTML={{ __html: modalCard.fullContent || `<p>${modalCard.desc}</p>` }} 
                className="prose dark:prose-invert prose-indigo max-w-none prose-h3:text-base prose-h3:font-extrabold prose-h3:mt-6 prose-h3:mb-2 prose-p:my-2 prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 text-xs sm:text-sm"
              />

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <Link to="/programs" onClick={closeModal}>
                  <button className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all inline-flex items-center gap-2">
                    <span>View Related Pathways</span>
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
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-slate-200/70 dark:border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 uppercase tracking-wider">
          <Users className="w-3.5 h-3.5" />
          The Leadership & Advisory
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Meet the Minds Behind Unisole
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Researchers, engineers, and faculty advisors from premier institutions (IIT Delhi, NIT Hamirpur, IIT Patna) dedicated to building AI ecosystems.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {teamMembers.map((member) => (
          <div
            className="flex flex-col group border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 rounded-2xl p-3 sm:p-4 transition-all duration-300 hover:shadow-card-hover hover:border-indigo-300 dark:hover:border-indigo-700/60"
            key={member.name}
          >
            {/* Avatar */}
            <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-950 rounded-xl mb-3">
              <img
                src={getOptimizedImageUrl(member.img, { width: 300 })}
                alt={member.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                width="300"
                height="300"
                loading="lazy"
                decoding="async"
              />
            </div>
            
            {/* Details */}
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight">
                    {member.name}
                  </h3>
                  {member.tag && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 rounded-md">
                      {member.tag}
                    </span>
                  )}
                </div>
                <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium block mt-1">
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* ---------- HERO SECTION ---------- */}
      <section className="relative overflow-hidden pt-24 pb-14 sm:pt-32 sm:pb-20">
        {/* Soft Background Glows */}
        <div className="absolute right-1/4 top-10 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-10 top-1/2 w-80 h-80 bg-violet-500/10 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 sm:gap-14">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
              
              {/* Badge */}
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200/70 dark:border-indigo-800/70 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>India's Next-Gen AI Platform</span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              </span>
              
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                Welcome to <br />
                <span className="gradient-heading">
                  Unisole Skill AI Labs
                </span>
              </h1>
              
              {/* Subheading */}
              <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-350 leading-relaxed max-w-xl">
                Empowering schools, higher education institutions, teachers, and student groups with world-class Artificial Intelligence pathways, specialized lab setups, and industry research.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2 w-full sm:w-auto">
                <Link to="/programs" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center font-bold px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 active:scale-[0.98] gap-2.5 text-xs sm:text-sm min-h-[48px] cursor-pointer">
                    <span>Explore 4 Academic Pathways</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>

                <Link to="/playground" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center font-bold px-5 py-3.5 rounded-2xl border border-slate-200/90 hover:border-indigo-400 bg-white dark:bg-slate-900/60 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm transition-all duration-200 active:scale-[0.98] gap-2 min-h-[48px] cursor-pointer shadow-xs">
                    <Terminal className="w-4 h-4 text-indigo-500" />
                    <span>Launch AI Sandbox</span>
                  </button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60 w-full">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>IIT & NIT Mentored</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Verified Credentials</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Hands-on MLOps Labs</span>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5 relative w-full aspect-square max-w-[480px] mx-auto lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-violet-500/10 to-cyan-500/10 rounded-3xl blur-2xl pointer-events-none transform -rotate-3 scale-95" />
              
              <div className="relative h-full w-full overflow-hidden border border-slate-200/80 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl">
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
                <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-white/10 text-white flex items-center justify-between shadow-xl">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">AI Ecosystem</span>
                    <span className="text-xs sm:text-sm font-black">5,000+ Enrolled Students</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    Active Labs
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ---------- STATS SECTION ---------- */}
      <section className="bg-white dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { value: '4', label: 'Academic Pathways', desc: 'CS, Science, Commerce, Design', icon: BookOpen },
              { value: '5,000+', label: 'Active Students', desc: 'Trained across campuses', icon: Users },
              { value: '25+', label: 'Partner Institutions', desc: 'Colleges & high schools', icon: Award },
              { value: '2+', label: 'Years Building', desc: 'Continuous lab deployment', icon: Clock }
            ].map((s) => (
              <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 hover-lift" key={s.label}>
                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-2 border border-indigo-100 dark:border-indigo-900/40">
                  <s.icon className="w-5 h-5" />
                </div>
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">{s.value}</span>
                <span className="text-xs text-slate-900 dark:text-white font-bold mt-1 uppercase tracking-wider">{s.label}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- INSTITUTE ABOUT SECTION ---------- */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-transparent to-slate-100/50 dark:to-slate-900/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            About the Institute
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Learn · Build · Research · Innovate
          </h2>
          
          <div className="text-xs sm:text-base text-slate-600 dark:text-slate-350 space-y-5 leading-relaxed max-w-3xl mx-auto pt-2">
            <p>
              Unisole Skill AI Labs is dedicated to establishing sustainable artificial intelligence ecosystems. We work closely with government bodies, schools, colleges, and research associations to guide academic strategy and deliver practical skill frameworks.
            </p>
            <p>
              By combining theoretical machine learning foundations with high-intensity product development, MLOps orchestration, and structured internship programs, we equip young minds with capabilities ready for the future technological landscape.
            </p>
          </div>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left">
            {[
              { title: "Curriculum Alignment", desc: "Syllabi mapped directly to modern industry requirements and university standards." },
              { title: "Hands-on MLOps", desc: "Students build, containerize, and deploy real models with FastAPI and Docker." },
              { title: "Mentorship & Internships", desc: "Live guidance by IIT and NIT alumni on applied research and open source projects." }
            ].map((p, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  0{idx + 1}
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{p.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- EXPERTISE / CAROUSEL ---------- */}
      <section className="bg-slate-100/40 dark:bg-slate-950 py-6">
        <OfferCarousel />
      </section>

      {/* ---------- TEAM SECTION ---------- */}
      <TeamSection />

      {/* ---------- TESTIMONIALS SECTION ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-slate-200/70 dark:border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-current" />
            Verified Learner Feedback
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            What Our Community Says
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              text: "Unisole Empower is a promising platform for anyone interested in AI, Data Science, and Analytics. The mix of live and recorded lectures gives flexibility, and having mentors plus a peer community makes learning much more engaging.",
              author: "Mehul Atri",
              role: "Student Member"
            },
            {
              text: "unisole is the best platform where you get mentors who not just taught you but how to approach companies for a job or how to get internships ....so helpful.",
              author: "Ravi Kumar Saini",
              role: "Student Member"
            },
            {
              text: "Great platform for learning AI! The lessons are structured cleanly and cover high-production engineering topics like APIs, Docker containers, and live RAG setups.",
              author: "Piyush Sharma",
              role: "Student Member"
            },
            {
              text: "A valuable collaboration that brought meaningful AI exposure to our school. The teachers felt empowered and the students built interesting local projects.",
              author: "Deepak Katoch",
              role: "School Teacher"
            }
          ].map((t, i) => (
            <div 
              className="flex flex-col justify-between p-6 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/50 shadow-xs hover-lift"
              key={i}
            >
              <div>
                {/* Rating stars */}
                <div className="flex gap-0.5 text-amber-500 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star className="w-3.5 h-3.5 fill-current" key={idx} />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/30 font-bold text-xs">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block leading-tight">{t.author}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block mt-0.5">{t.role}</span>
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