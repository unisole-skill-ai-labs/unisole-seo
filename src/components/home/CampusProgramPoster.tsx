import React, { useState } from 'react';
import { 
  GraduationCap, 
  Building2, 
  Code2, 
  Users2, 
  Award, 
  Globe, 
  Mail, 
  Phone, 
  Maximize2, 
  X, 
  CheckCircle2, 
  Cpu, 
  TrendingUp, 
  Flame 
} from 'lucide-react';

interface CampusProgramPosterProps {
  className?: string;
}

const teamMembers = [
  {
    name: 'AJAY MOKTA',
    role: 'Founder',
    org: 'UNISOLE Skill AI Labs',
    img: 'https://res.cloudinary.com/hehmsemf/image/upload/f_auto,q_auto,w_240/v1785408578/images_jjared.jpg',
    imgStyle: 'scale-[1.18] object-[center_36%]',
    points: [
      'B.Tech, NIT Hamirpur',
      'AI Educator, Innovator & Entrepreneur',
      'Mentor 5000+ students across India',
    ],
    highlightColor: 'border-blue-500/30'
  },
  {
    name: 'GIRISH GAURAV SHARMA',
    role: 'CTO @ Unisole',
    org: 'NIT Hamirpur',
    img: 'https://res.cloudinary.com/hehmsemf/image/upload/f_auto,q_auto,w_240/v1785403939/IMG-20260730-WA0005.jpg_bgzql0.jpg',
    imgStyle: 'object-[center_20%]',
    points: [
      '20th Rank at NASA App Challenge',
      'AIR 1 in AIEC-DAE 35',
      'Startup Advisor',
    ],
    highlightColor: 'border-orange-500/30'
  },
  {
    name: 'SHABD PATEL',
    role: 'B.Tech NIT Hamirpur',
    org: 'Software Engineer',
    img: '/images/shabd-patel.webp',
    imgStyle: 'object-cover',
    points: [
      'Software Engineer at BlackRock',
      'Experienced in Scalable & Robust Systems',
      'AI Expert at Unisole',
    ],
    highlightColor: 'border-indigo-500/30'
  },
  {
    name: 'KUSHAL KESHARWANI',
    role: 'IIT Patna',
    org: 'Engineer, Tech Mahindra',
    img: 'https://res.cloudinary.com/hehmsemf/image/upload/f_auto,q_auto,w_240/v1785403940/IMG-20250311-WA0007.jpg_vvfqnl.jpg',
    imgStyle: 'object-[center_25%]',
    points: [
      'IIT Patna Graduate',
      'Engineer at Tech Mahindra',
      'Industry Expert at Unisole',
    ],
    highlightColor: 'border-emerald-500/30'
  },
  {
    name: 'ADITYA KAUSHAL',
    role: 'M.Tech, IIT Delhi',
    org: 'AI & Tech Lead',
    img: 'https://res.cloudinary.com/hehmsemf/image/upload/f_auto,q_auto,w_240/v1785403939/IMG-20260720-WA0003.jpg_bjlrkr.jpg',
    imgStyle: 'object-[center_20%]',
    points: [
      'M.Tech, IIT Delhi',
      'Strong Academic & Technical Background',
      'Academic Expert at Unisole',
    ],
    highlightColor: 'border-purple-500/30'
  }
];

const whatWeOffer = [
  'Industry Designed Curriculum',
  'Hands-on Projects',
  'Expert Mentorship & Guidance',
  'Industry Expert Sessions',
  'Internship & Project Opportunities*',
  'Talent Pool Access',
  'Certificate of Completion',
  'Career & Resume Support'
];

const whyUnisole = [
  'Industry-Relevant Learning',
  'Real-World Exposure',
  'Practical Projects',
  'Career-First Approach',
  'Opportunities Beyond Training'
];

const stats = [
  { icon: GraduationCap, title: '5000+', subtitle: 'Students Mentored' },
  { icon: Building2, title: '50+', subtitle: 'Colleges Connected' },
  { icon: Code2, title: 'Real-world', subtitle: 'Projects' },
  { icon: Users2, title: 'Industry Experts', subtitle: '& Mentors' },
  { icon: Award, title: 'Career-Ready', subtitle: 'Skill Pathways' },
];

/**
 * Inner Poster Layout rendered with CSS Container Queries (@container)
 * for 100% mathematical vector sharpness at any pixel density.
 */
const PosterLayout: React.FC<{ onExpand?: () => void; isExpanded?: boolean }> = ({ onExpand, isExpanded = false }) => {
  return (
    <div className="relative w-full h-full select-none flex flex-col justify-between bg-[#f8fafc] dark:bg-[#070d18] text-zinc-900 dark:text-zinc-100 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-blue-50/20 to-amber-50/25 dark:from-zinc-950/95 dark:via-slate-900/60 dark:to-zinc-900/90 pointer-events-none" />

      {/* Optional HD Expand Button */}
      {onExpand && (
        <button
          onClick={onExpand}
          className="absolute top-[1.2cqw] right-[1.2cqw] z-30 inline-flex items-center gap-[0.4cqw] px-[1cqw] py-[0.4cqw] rounded-full bg-zinc-950/85 hover:bg-zinc-950 text-white text-[0.85cqw] font-bold backdrop-blur-md shadow-md border border-white/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          title="Click to view full HD poster"
        >
          <Maximize2 className="w-[1cqw] h-[1cqw] text-amber-400" />
          <span>Full HD</span>
        </button>
      )}

      {/* ========================================================
          TOP SECTION: Logos, Banner & QR Section
         ======================================================== */}
      <div className="relative z-10 px-[2.2cqw] pt-[1.6cqw] pb-[0.6cqw] flex items-center justify-between gap-[1.2cqw]">
        {/* Institution Logos */}
        <div className="flex items-center gap-[1.5cqw] shrink-0">
          {/* Unisole Brand */}
          <div className="flex items-center gap-[0.7cqw]">
            <div className="w-[3.4cqw] h-[3.4cqw] rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center p-[0.3cqw] shadow-xs">
              <Flame className="w-[2.2cqw] h-[2.2cqw] text-white" />
            </div>
            <div>
              <span className="text-[1.8cqw] font-black tracking-tight text-[#0b1b3d] dark:text-white leading-none block">Unisole</span>
              <span className="text-[0.6cqw] font-bold text-zinc-500 tracking-wider uppercase block mt-[0.1cqw]">EMPOWER THE WAY</span>
            </div>
          </div>

          {/* NIT Hamirpur Crest */}
          <div className="flex items-center gap-[0.6cqw] pl-[1cqw] border-l border-zinc-200 dark:border-zinc-800">
            <img 
              src="/images/nit-hamirpur-logo.webp" 
              alt="NIT Hamirpur" 
              className="w-[3cqw] h-[3cqw] object-contain rounded-full bg-white dark:bg-zinc-800 shadow-xs" 
              loading="eager"
            />
            <span className="text-[1cqw] font-bold text-zinc-700 dark:text-zinc-300 leading-tight">NIT Hamirpur</span>
          </div>

          {/* Govt of HP */}
          <div className="flex items-center gap-[0.6cqw] pl-[1cqw] border-l border-zinc-200 dark:border-zinc-800">
            <img 
              src="/images/govt-hp-logo.webp" 
              alt="Govt. of H.P." 
              className="w-[3cqw] h-[3cqw] object-contain" 
              loading="eager"
            />
            <span className="text-[1cqw] font-bold text-zinc-700 dark:text-zinc-300 leading-tight">Govt. of H.P.</span>
          </div>
        </div>

        {/* Registration Ribbon & Mountains */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative px-[1cqw] py-[0.2cqw] text-center">
            {/* Mountain Vector Silhouette Background */}
            <svg className="absolute -top-[1.2cqw] left-1/2 -translate-x-1/2 w-[15cqw] h-[3.8cqw] opacity-25 dark:opacity-20 pointer-events-none text-sky-500" viewBox="0 0 100 30" fill="currentColor">
              <polygon points="0,30 20,12 35,22 55,5 75,25 90,14 100,30" />
              <polygon points="55,5 48,12 62,12" fill="white" />
            </svg>

            {/* Angled Ribbon */}
            <div className="inline-block transform -rotate-1 shadow-md rounded-md overflow-hidden bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white px-[1.2cqw] py-[0.4cqw]">
              <div className="flex items-center justify-center gap-[0.6cqw]">
                <span className="text-[1.1cqw] font-black tracking-wider uppercase">REGISTRATION</span>
                <span className="bg-yellow-400 text-zinc-950 px-[0.6cqw] py-[0.1cqw] rounded font-black text-[1.1cqw] tracking-tight">
                  STARTS NOW
                </span>
              </div>
              <div className="text-[0.75cqw] font-bold tracking-widest text-amber-100 uppercase mt-[0.1cqw]">
                FOR HIMACHAL STUDENTS ⛰️
              </div>
            </div>
            <div className="text-[0.8cqw] italic font-semibold text-rose-600 dark:text-rose-400 mt-[0.2cqw]">
              Don't Miss This Opportunity!
            </div>
          </div>
        </div>

        {/* Right QR Box */}
        <div className={`shrink-0 bg-[#0b1b3d] dark:bg-zinc-900 border border-zinc-700/50 text-white rounded-xl p-[0.7cqw] flex items-center gap-[0.7cqw] shadow-md ${onExpand ? 'mr-[5.5cqw]' : ''}`}>
          <div className="bg-white p-[0.3cqw] rounded-lg">
            <img 
              src="/images/qr-code.webp" 
              alt="Scan to Explore Courses" 
              className="w-[4.2cqw] h-[4.2cqw] object-contain rounded" 
              loading="eager"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[0.65cqw] font-semibold text-zinc-300 uppercase leading-none">CHECK OUT</span>
            <span className="text-[0.8cqw] font-extrabold text-orange-400 leading-tight">OUR COURSES</span>
            <span className="text-[0.65cqw] font-medium text-amber-300 italic mt-[0.2cqw]">Scan to Explore ➔</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          MAIN TITLE & FEATURE PILLS
         ======================================================== */}
      <div className="relative z-10 px-[2.2cqw] text-center my-[0.1cqw]">
        {/* Main Title */}
        <h1 className="text-[3.5cqw] font-black tracking-tight leading-none text-[#0b1b3d] dark:text-white uppercase flex items-center justify-center gap-[1cqw]">
          <span>UNISOLE AI</span>
          <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 bg-clip-text text-transparent">
            CAMPUS PROGRAM
          </span>
        </h1>

        {/* Subtitle Divider */}
        <div className="flex items-center justify-center gap-[1cqw] my-[0.4cqw]">
          <div className="h-[1px] w-[5cqw] bg-zinc-300 dark:bg-zinc-700" />
          <span className="text-[0.85cqw] font-extrabold tracking-wider text-zinc-700 dark:text-zinc-300 uppercase">
            INDUSTRIAL TRAINING & INTERNSHIP OPPORTUNITY PROGRAM
          </span>
          <div className="h-[1px] w-[5cqw] bg-zinc-300 dark:bg-zinc-700" />
        </div>

        {/* 4 Feature Badges Strip */}
        <div className="max-w-[70cqw] mx-auto bg-[#0b1b3d] dark:bg-zinc-900/90 text-white rounded-full px-[1.5cqw] py-[0.45cqw] shadow-md border border-zinc-700/40 grid grid-cols-4 gap-[0.8cqw] text-[0.8cqw] font-bold">
          <div className="flex items-center justify-center gap-[0.4cqw]">
            <Cpu className="w-[1.1cqw] h-[1.1cqw] text-orange-400" />
            <span>INDUSTRY-READY SKILLS</span>
          </div>
          <div className="flex items-center justify-center gap-[0.4cqw]">
            <Code2 className="w-[1.1cqw] h-[1.1cqw] text-blue-400" />
            <span>REAL PROJECTS</span>
          </div>
          <div className="flex items-center justify-center gap-[0.4cqw]">
            <Users2 className="w-[1.1cqw] h-[1.1cqw] text-emerald-400" />
            <span>EXPERT MENTORSHIP</span>
          </div>
          <div className="flex items-center justify-center gap-[0.4cqw]">
            <TrendingUp className="w-[1.1cqw] h-[1.1cqw] text-amber-400" />
            <span>CAREER OPPORTUNITIES*</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          BODY: 5 TEAM MEMBERS (LEFT) + 3 INFORMATION CARDS (RIGHT)
         ======================================================== */}
      <div className="relative z-10 px-[2.2cqw] flex gap-[1.2cqw] flex-1 my-[0.4cqw]">
        {/* Left Column: Meet Our Team (72%) */}
        <div className="flex-[3] flex flex-col justify-between">
          {/* Team Title */}
          <div className="text-center mb-[0.3cqw]">
            <span className="inline-flex items-center gap-[0.5cqw] text-[1cqw] font-black tracking-wider text-[#0b1b3d] dark:text-zinc-100 uppercase">
              <span className="w-[0.45cqw] h-[0.45cqw] rounded-full bg-orange-500" />
              MEET OUR TEAM
              <span className="w-[0.45cqw] h-[0.45cqw] rounded-full bg-orange-500" />
            </span>
          </div>

          {/* 5 Team Member Cards Grid */}
          <div className="grid grid-cols-5 gap-[0.7cqw]">
            {teamMembers.map((m, idx) => (
              <div 
                key={idx}
                className={`bg-white dark:bg-zinc-900 rounded-xl p-[0.6cqw] border ${m.highlightColor} shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow`}
              >
                {/* Photo Frame */}
                <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-[0.4cqw] bg-zinc-100 dark:bg-zinc-800">
                  <img 
                    src={m.img} 
                    alt={m.name} 
                    className={`w-full h-full object-cover ${m.imgStyle}`}
                    loading="lazy"
                  />
                </div>

                {/* Name & Role */}
                <div className="text-left mb-[0.3cqw]">
                  <h3 className="text-[0.75cqw] font-black text-[#0b1b3d] dark:text-white leading-tight line-clamp-1">
                    {m.name}
                  </h3>
                  <p className="text-[0.62cqw] font-bold text-orange-600 dark:text-orange-400 leading-tight line-clamp-1 mt-[0.1cqw]">
                    {m.role}
                  </p>
                  <p className="text-[0.52cqw] text-zinc-500 font-semibold line-clamp-1">
                    {m.org}
                  </p>
                </div>

                {/* Bullet Credentials */}
                <div className="space-y-[0.2cqw] border-t border-zinc-100 dark:border-zinc-800/80 pt-[0.3cqw] text-[0.52cqw] text-zinc-600 dark:text-zinc-300 font-medium">
                  {m.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-[0.2cqw] leading-tight">
                      <span className="text-orange-500 font-black shrink-0">•</span>
                      <span className="line-clamp-2">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Purpose Badge Underneath Team */}
          <div className="text-center mt-[0.4cqw]">
            <span className="inline-flex items-center gap-[0.4cqw] px-[1.2cqw] py-[0.2cqw] rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-[0.68cqw] font-black text-zinc-800 dark:text-zinc-200">
              <Users2 className="w-[0.85cqw] h-[0.85cqw] text-blue-600 dark:text-blue-400" />
              A TEAM DRIVEN BY <span className="text-orange-600 dark:text-orange-400">PURPOSE, EXPERTISE & IMPACT</span>
            </span>
          </div>
        </div>

        {/* Right Column: Offers, Why Unisole, Mission (28%) */}
        <div className="flex-1 flex flex-col justify-between gap-[0.4cqw]">
          {/* What We Offer Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-[0.7cqw] shadow-2xs">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-[0.25cqw] mb-[0.3cqw]">
              <span className="text-[0.85cqw] font-black text-[#0b1b3d] dark:text-white uppercase tracking-tight">
                WHAT WE <span className="text-orange-600 dark:text-orange-400">OFFER</span>
              </span>
            </div>
            <div className="grid grid-cols-1 gap-[0.2cqw] text-[0.6cqw] text-zinc-700 dark:text-zinc-300 font-semibold">
              {whatWeOffer.map((item, idx) => (
                <div key={idx} className="flex items-center gap-[0.3cqw] leading-tight">
                  <CheckCircle2 className="w-[0.7cqw] h-[0.7cqw] text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Why Unisole Card */}
          <div className="bg-[#0b1b3d] dark:bg-zinc-900 text-white rounded-xl p-[0.6cqw] shadow-2xs border border-zinc-700/40">
            <span className="text-[0.8cqw] font-black text-orange-400 uppercase tracking-tight block mb-[0.15cqw]">
              WHY UNISOLE?
            </span>
            <div className="space-y-[0.15cqw] text-[0.58cqw] text-zinc-300 font-medium">
              {whyUnisole.map((item, idx) => (
                <div key={idx} className="flex items-center gap-[0.25cqw] leading-tight">
                  <span className="w-[0.3cqw] h-[0.3cqw] rounded-full bg-orange-400 shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-[#0b1b3d] dark:bg-zinc-900 text-white rounded-xl p-[0.6cqw] shadow-2xs border border-zinc-700/40">
            <span className="text-[0.75cqw] font-black text-rose-400 uppercase tracking-tight block mb-[0.15cqw]">
              OUR MISSION
            </span>
            <p className="text-[0.55cqw] text-zinc-300 leading-tight">
              Empower students with industry-ready skills, real-world experience and opportunities to build meaningful careers in the AI era.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          STATS STRIP
         ======================================================== */}
      <div className="relative z-10 px-[2.2cqw] py-[0.35cqw] bg-zinc-100/90 dark:bg-zinc-900/60 border-t border-zinc-200 dark:border-zinc-800">
        <div className="grid grid-cols-5 gap-[0.8cqw]">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="flex items-center gap-[0.5cqw] justify-center">
                <div className="w-[2cqw] h-[2cqw] rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-2xs shrink-0">
                  <Icon className="w-[1.1cqw] h-[1.1cqw] text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <span className="text-[0.8cqw] font-black text-zinc-900 dark:text-white leading-none block">
                    {s.title}
                  </span>
                  <span className="text-[0.55cqw] font-bold text-zinc-500 dark:text-zinc-400 leading-tight block">
                    {s.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          BOTTOM DARK BLUE CONTACT FOOTER
         ======================================================== */}
      <div className="relative z-10 bg-[#0b1b3d] dark:bg-black text-white px-[2.2cqw] py-[0.5cqw] flex items-center justify-between text-[0.7cqw] font-bold tracking-wide">
        <a 
          href="https://www.unisole.org" 
          target="_blank" 
          rel="noreferrer" 
          className="flex items-center gap-[0.35cqw] hover:text-orange-400 transition-colors"
        >
          <Globe className="w-[0.9cqw] h-[0.9cqw] text-blue-400" />
          <span>www.unisole.org</span>
        </a>

        <a 
          href="mailto:unisole.empower@gmail.com" 
          className="flex items-center gap-[0.35cqw] hover:text-orange-400 transition-colors"
        >
          <Mail className="w-[0.9cqw] h-[0.9cqw] text-amber-400" />
          <span>unisole.empower@gmail.com</span>
        </a>

        <a 
          href="tel:8219691201" 
          className="flex items-center gap-[0.35cqw] hover:text-orange-400 transition-colors"
        >
          <Phone className="w-[0.9cqw] h-[0.9cqw] text-emerald-400" />
          <span>8219691201</span>
        </a>

        <a 
          href="https://instagram.com/unisole_empower" 
          target="_blank" 
          rel="noreferrer" 
          className="flex items-center gap-[0.35cqw] hover:text-orange-400 transition-colors"
        >
          <svg className="w-[0.9cqw] h-[0.9cqw] text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          <span>unisole_empower</span>
        </a>
      </div>
    </div>
  );
};

export const CampusProgramPoster: React.FC<CampusProgramPosterProps> = ({ className = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Outer Card with Container Queries for Infinite Vector Scaling */}
      <div 
        className={`group relative w-full aspect-[3/2] [container-type:inline-size] overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-minimal ${className}`}
      >
        <PosterLayout onExpand={() => setIsModalOpen(true)} />
      </div>

      {/* ========================================================
          FULL HD EXPANDED MODAL (For Pinch-to-zoom on Mobile & 4K View)
         ======================================================== */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-40 p-2 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Poster Inner View */}
            <div className="w-full aspect-[3/2] [container-type:inline-size] rounded-xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800">
              <PosterLayout isExpanded={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CampusProgramPoster;
