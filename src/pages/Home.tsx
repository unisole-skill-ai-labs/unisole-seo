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
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Layers, 
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCard, setModalCard] = useState<any>(null);

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

  const openModal = (card: any) => {
    setModalCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalCard(null);
  };

  const currentCard = offerCards[selectedIndex] || offerCards[0];
  const currentDomainTag = expertiseTags[selectedIndex] || `DOMAIN 0${selectedIndex + 1}`;

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* Header */}
      <div className="max-w-2xl mb-10 sm:mb-12 space-y-2">
        <span className="mono-tag text-zinc-500 dark:text-zinc-400 block">
          Institutional Capabilities
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Core Institutional Expertise
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Select any domain below to inspect specialized academic infrastructure, implementation frameworks, and campus laboratory models.
        </p>
      </div>

      {/* Split Feature Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        
        {/* Left Side: Domain Selector List (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-2">
          {offerCards.map((card, idx) => {
            const isSelected = idx === selectedIndex;
            const domainNumber = String(idx + 1).padStart(2, '0');

            return (
              <button
                key={card.id}
                onClick={() => setSelectedIndex(idx)}
                type="button"
                className={`w-full text-left p-3 sm:p-3.5 rounded-xl transition-all duration-200 border flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-800 dark:bg-white dark:text-zinc-950 dark:border-white shadow-sm ring-1 ring-zinc-900/10 dark:ring-white/20'
                    : 'bg-zinc-50/70 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200/70 dark:border-zinc-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded transition-colors ${
                    isSelected
                      ? 'bg-white/15 text-white dark:bg-zinc-950/15 dark:text-zinc-950'
                      : 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                  }`}>
                    {domainNumber}
                  </span>
                  <div>
                    <h3 className={`text-xs sm:text-sm font-bold leading-tight ${
                      isSelected ? 'text-white dark:text-zinc-950' : 'text-zinc-900 dark:text-white'
                    }`}>
                      {card.title}
                    </h3>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 transition-transform shrink-0 ${
                  isSelected
                    ? 'translate-x-0.5 text-white dark:text-zinc-950'
                    : 'text-zinc-400 group-hover:translate-x-0.5 group-hover:text-zinc-600 dark:group-hover:text-zinc-200'
                }`} />
              </button>
            );
          })}
        </div>

        {/* Right Side: Dynamic Showcase Display (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="h-full min-h-[440px] flex flex-col justify-between overflow-hidden rounded-2xl bg-zinc-900 text-white border border-zinc-800 shadow-minimal relative">
            {/* Top Visual Image with Gradient Layer */}
            <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-zinc-950">
              <img
                src={getOptimizedImageUrl(currentCard.img, { width: 800 })}
                alt={currentCard.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                width="800"
                height="360"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
              
              {/* Domain Tag Pill */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-950/80 text-white backdrop-blur-xs rounded-full border border-white/10">
                  {currentDomainTag}
                </span>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-950/80 px-2.5 py-1 rounded-full border border-white/10">
                  {String(selectedIndex + 1).padStart(2, '0')} / {String(offerCards.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Showcase Details */}
            <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {currentCard.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
                  {currentCard.desc}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-5 border-t border-white/10 flex items-center justify-start">
                <button
                  onClick={() => openModal(currentCard)}
                  type="button"
                  className="inline-flex items-center justify-center font-semibold px-5 py-3 rounded-lg bg-white text-zinc-950 hover:bg-zinc-100 text-xs sm:text-sm transition-all duration-150 active:scale-[0.98] gap-2 cursor-pointer shadow-sm"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>View Full Framework</span>
                </button>
              </div>
            </div>
          </div>
        </div>

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
  { name: 'Divyank', role: 'Tech Lead', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785404022/WhatsApp_Image_2026-07-30_at_3.03.01_PM_rheqln.jpg' },
  { name: 'Kushal', role: 'Academic Head', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403940/IMG-20250311-WA0007.jpg_vvfqnl.jpg', tag: 'IIT Patna' },
  { name: 'Aditya Kaudhal', role: 'AI & Technology Lead', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785403939/IMG-20260720-WA0003.jpg_bjlrkr.jpg', tag: 'IIT Delhi' },
  { name: 'Dishant Gupta', role: 'Lead Researcher', img: 'https://res.cloudinary.com/hehmsemf/image/upload/v1785408916/IMG-20260310-WA0059.jpg_s6q25v.jpg' },
];

function TeamSection() {
  const marqueeList = [...teamMembers, ...teamMembers];

  return (
    <section className="w-full py-12 sm:py-16 border-t border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <span className="mono-tag text-zinc-500 dark:text-zinc-400 block">
              Advisory & Faculty
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Leadership Team
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Engineers and faculty advisors from premier institutions (IIT Delhi, NIT Hamirpur, IIT Patna) designing curriculum frameworks.
            </p>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 shrink-0 hidden sm:block">
            Auto-scrolling • Hover to pause
          </span>
        </div>
      </div>

      {/* Infinite Auto-Moving Carousel with Gradient Edge Masks */}
      <div className="relative w-full overflow-hidden">
        {/* Left Fade Mask */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent z-10" />

        {/* Right Fade Mask */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent z-10" />

        {/* Marquee Track */}
        <div className="animate-team-marquee flex items-stretch gap-3.5 sm:gap-4 px-4 py-2">
          {marqueeList.map((member, index) => (
            <div
              key={`${member.name}-${index}`}
              className="w-[200px] sm:w-[220px] shrink-0 p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl shadow-minimal hover:shadow-minimal-hover transition-all flex flex-col justify-between group cursor-default"
            >
              {/* Avatar */}
              <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950 rounded-lg mb-2.5">
                <img
                  src={getOptimizedImageUrl(member.img, { width: 300 })}
                  alt={member.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  width="300"
                  height="300"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Details */}
              <div className="flex flex-col justify-between flex-grow">
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
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mt-0.5 line-clamp-2">
                    {member.role}
                  </span>
                </div>
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
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950">
      <Navbar />

      {/* ---------- HERO SECTION ---------- */}
      <section className="relative pt-24 pb-14 sm:pt-32 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 sm:gap-14">
            
            {/* Left Content */}
            <div className="lg:col-span-5 flex flex-col items-start text-left space-y-4 sm:space-y-5">
              {/* Main Headline */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-zinc-900 dark:text-white">
                Applied Artificial Intelligence <br />
                <span className="text-zinc-500 dark:text-zinc-400">
                  for Higher Education.
                </span>
              </h1>
              
              {/* Subheading */}
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-md">
                Bridging institutional classrooms and production machine learning engineering. Verified curricula, containerized local laboratories, and hands-on faculty mentoring.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 w-full sm:w-auto">
                <Link to="/programs" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center font-semibold px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white text-xs sm:text-sm transition-all duration-150 active:scale-[0.98] gap-1.5 min-h-[40px] cursor-pointer">
                    <span>Explore 4 Pathways</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>

                <Link to="/events" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center font-semibold px-4 py-2.5 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white dark:bg-zinc-900 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm transition-all duration-150 active:scale-[0.98] gap-1.5 min-h-[40px] cursor-pointer">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Campus Events</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Visual Card (Big Poster) */}
            <div className="lg:col-span-7 relative w-full aspect-[3/2] mx-auto">
              <div className="relative h-full w-full overflow-hidden border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900 shadow-minimal">
                <img
                  src="/images/unisole-ai-campus-program.webp"
                  alt="Unisole AI Campus Program - Industrial Training & Internship Opportunity Program for Himachal Students"
                  className="h-full w-full object-cover"
                  width="1024"
                  height="682"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ---------- STATS SECTION ---------- */}
      <section className="bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-200/80 dark:border-zinc-800/80 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-left">
            {[
              { value: '4', label: 'Academic Pathways', desc: 'CS, Science, Commerce, Design' },
              { value: '5,000+', label: 'Active Learners', desc: 'Across universities and colleges' },
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


      {/* ---------- EXPERTISE / CAROUSEL ---------- */}
      <section className="bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <OfferCarousel />
      </section>

      {/* ---------- TEAM SECTION ---------- */}
      <TeamSection />

      <Footer />
    </div>
  );
}