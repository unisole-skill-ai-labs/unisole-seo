import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ProgramsPage.css';

const SUBSCRIPTION_PAYMENT_LINK = import.meta.env.VITE_SUBSCRIPTION_PAYMENT_LINK;

const checkSvg = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const arrowSvg = (
  <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
    <path d="M4 9h10M9 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const syllabusSvg = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const chevronDownSvg = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const GROUPS_DATA = [
  {
    id: 'group-1',
    badge: 'GROUP 1',
    icon: '💻',
    title: 'Computer Science & IT',
    target: 'BCA • MCA • B.Sc CS/IT • B.Tech CSE/IT',
    tagline: 'Production AI engineering, full stack web systems, and MLOps deployment.',
    pathways: [
      {
        id: 'cs-p1',
        eyebrow: 'PATHWAY 1',
        title: 'Machine Learning Engineering in Production',
        duration: '3 Months',
        level: 'Intermediate',
        enrollLink: 'https://rzp.io/rzp/6rUVhV4',
        syllabusLink: '',
        description: 'End-to-end ML engineering: data pipelines, deep learning, FastAPI model serving, Docker MLOps, and Generative AI/RAG architectures.',
        modules: [
          {
            num: '01',
            title: 'Python for AI Engineering',
            topics: ['Python fundamentals, OOP & modular architecture', 'Virtual environments, unit testing & Git workflows', 'Handling structured data & packages'],
            practical: 'Build modular Python app with CI checks on GitHub.',
          },
          {
            num: '02',
            title: 'Data Engineering & Pipelines',
            topics: ['NumPy, Pandas & exploratory data analysis', 'SQL relational databases & DuckDB analytics', 'ETL pipelines & Kafka streaming fundamentals'],
            pipeline: ['Data Source', 'ETL Pipeline', 'Parquet Storage', 'DuckDB Engine', 'ML Models'],
          },
          {
            num: '03',
            title: 'Machine Learning Fundamentals',
            topics: ['Supervised & unsupervised learning algorithms', 'Feature engineering, validation & K-fold CV', 'Model evaluation metrics, ROC-AUC & tuning'],
          },
          {
            num: '04',
            title: 'Deep Learning & Transformers',
            topics: ['Neural network architectures & optimization', 'CNNs for computer vision & sequence models', 'Transfer learning, embeddings & LLM foundations'],
          },
          {
            num: '05',
            title: 'Building AI APIs with FastAPI',
            topics: ['High-performance REST APIs with FastAPI & Pydantic', 'Model inference, latency optimization & auth', 'Connecting ML backends to web applications'],
          },
          {
            num: '06',
            title: 'MLOps, Docker & Cloud Deployment',
            topics: ['Docker containerization for model inference', 'CI/CD automated deployment pipelines', 'Model monitoring, data drift & automated retraining'],
          },
          {
            num: '07',
            title: 'Generative AI & RAG Systems',
            topics: ['LLM architecture, prompting & guardrails', 'Vector databases (Pinecone / Chroma / pgvector)', 'Retrieval-Augmented Generation (RAG) pipelines'],
          },
        ],
        capstone: {
          title: 'End-to-End Production AI System',
          flow: ['Data Ingestion', 'Feature Store', 'ML / AI Model', 'FastAPI Backend', 'Docker & Cloud'],
          outputs: ['Production GitHub repo with clean docs', 'Deployed live FastAPI REST API', 'Trained model benchmark report'],
        },
      },
      {
        id: 'cs-p2',
        eyebrow: 'PATHWAY 2',
        title: 'Full Stack Web Development (AI-Powered)',
        duration: '3 Months',
        level: 'Beginner to Intermediate',
        enrollLink: 'https://rzp.io/rzp/K9E9OOw',
        syllabusLink: '',
        description: 'Modern full stack engineering with React, Node.js, Express, MongoDB, and integrated AI capabilities like document Q&A and chatbots.',
        modules: [
          {
            num: '01',
            title: 'Web Foundations & JavaScript',
            topics: ['HTML5, modern CSS, Flexbox & CSS Grid', 'Modern JavaScript (ES6+), DOM & Async/Await', 'Fetch API & consuming RESTful APIs'],
          },
          {
            num: '02',
            title: 'Frontend with React & Vite',
            topics: ['Component architecture, JSX & custom hooks', 'State management, forms & validation', 'Client-side routing with React Router'],
          },
          {
            num: '03',
            title: 'Backend with Node.js & Express',
            topics: ['REST API design & Express server setup', 'JWT authentication & role-based access', 'Centralized error handling & middleware'],
          },
          {
            num: '04',
            title: 'Databases with MongoDB & Mongoose',
            topics: ['Schema modeling, CRUD & indexing', 'Aggregation pipelines for analytics', 'Database connection pooling & security'],
          },
          {
            num: '05',
            title: 'DevOps, CI/CD & Deployment',
            topics: ['Git collaboration & PR review workflows', 'Docker containerization fundamentals', 'Cloud deployment to Vercel/Render/AWS'],
          },
          {
            num: '06',
            title: 'AI-Powered Web Applications',
            topics: ['Connecting LLM APIs (OpenAI, Gemini)', 'RAG-based document Q&A features', 'Intelligent AI chat assistants & dashboards'],
          },
        ],
        capstone: {
          title: 'Full-Stack Intelligent Web Application',
          flow: ['React UI', 'Express Backend', 'MongoDB', 'AI Integration', 'Cloud Deployment'],
          outputs: ['Live full-stack app with authentication', 'Integrated LLM features', 'Clean GitHub documentation'],
        },
      },
      {
        id: 'cs-p3',
        eyebrow: 'PATHWAY 3',
        title: 'Complete Machine Learning + Full Stack',
        duration: '6 Months',
        level: 'Dual-Track Mastery',
        enrollLink: 'https://rzp.io/rzp/34ZzWCiC',
        syllabusLink: '',
        description: 'Comprehensive dual curriculum merging Machine Learning, Deep Learning, and MLOps with full-stack React, Node.js, and cloud systems.',
        modules: [
          {
            num: '01',
            title: 'Python for AI & Clean Engineering',
            topics: ['Python fundamentals, OOP & testing', 'Data structures & modular architecture', 'Git version control workflows'],
          },
          {
            num: '02',
            title: 'Data Engineering & Scalable Storage',
            topics: ['NumPy, Pandas & SQL databases', 'ETL pipelines & DuckDB analytics', 'Kafka streaming concepts'],
          },
          {
            num: '03',
            title: 'Machine Learning & Deep Learning',
            topics: ['Supervised & unsupervised models', 'Neural networks, CNNs & Transformers', 'Model optimization & metrics'],
          },
          {
            num: '04',
            title: 'Frontend UI with React & Vite',
            topics: ['React hooks, state & routing', 'Responsive UI & form workflows', 'Production bundle optimization'],
          },
          {
            num: '05',
            title: 'Backend Systems & MongoDB',
            topics: ['Node.js/Express REST APIs', 'MongoDB data modeling & indexing', 'JWT authentication & security'],
          },
          {
            num: '06',
            title: 'Generative AI & RAG Systems',
            topics: ['Vector databases & embeddings', 'Semantic search & RAG pipelines', 'AI evaluation & Agent workflows'],
          },
          {
            num: '07',
            title: 'MLOps, FastAPI & Cloud Serving',
            topics: ['FastAPI model serving endpoints', 'Docker containerization & CI/CD', 'Cloud deployment & drift monitoring'],
          },
        ],
        capstone: {
          title: 'Full-Stack Production AI Platform',
          flow: ['Data Pipeline', 'ML Model', 'FastAPI Backend', 'React UI', 'Cloud Deployment'],
          outputs: ['End-to-end production AI app', 'Dual certification credential', 'Live API with Swagger docs'],
        },
      },
      {
        id: 'cs-common',
        eyebrow: 'WEEKEND TRACK',
        title: 'AI Entrepreneurship & Innovation',
        duration: 'Weekend Track',
        level: 'All Students',
        enrollLink: 'https://rzp.io/rzp/mysgU9wQ',
        syllabusLink: '',
        description: 'Structured incubator track teaching students how to convert AI technical capability into validated commercial products and startups.',
        modules: [
          {
            num: '01',
            title: 'Problem & Market Discovery',
            topics: ['Design thinking & identifying pain points', 'Customer discovery interviews', 'Competitor matrix & market sizing'],
          },
          {
            num: '02',
            title: 'AI Opportunity & Rapid MVP',
            topics: ['Where AI creates 10x value vs automation', 'Rapid prototyping with low-code & AI tools', 'Validating MVP with early users'],
          },
          {
            num: '03',
            title: 'Business Model & Pitching',
            topics: ['Business Model Canvas (BMC) & revenue models', 'Go-To-Market strategies', 'High-impact 10-slide investor pitch deck'],
          },
        ],
        capstone: {
          title: 'Startup Validation & Pitch Deck',
          flow: ['Problem Statement', 'Functional MVP', 'Business Model', 'Final Pitch'],
          outputs: ['Working MVP prototype', 'Validated Business Model Canvas', '10-slide investor pitch deck'],
        },
      },
    ],
  },
  {
    id: 'group-2',
    badge: 'GROUP 2',
    icon: '🔬',
    title: 'Science & Mathematics',
    target: 'Physics • Mathematics • Chemistry • Biology • Applied Science',
    tagline: 'Scientific computing, physics-informed neural networks, and computational research.',
    pathways: [
      {
        id: 'sci-p1',
        eyebrow: 'PATHWAY 1',
        title: 'Scientific Machine Learning & AI for Science',
        duration: '3 Months',
        level: 'Undergraduate / Postgraduate',
        enrollLink: 'https://rzp.io/rzp/uyG6gkvw',
        syllabusLink: '',
        description: 'Combines mathematical principles with modern scientific computing, differential equations, and Physics-Informed Neural Networks (PINNs).',
        modules: [
          {
            num: '01',
            title: 'Mathematical Foundations for AI',
            topics: ['Linear algebra & matrix decompositions', 'Multivariable calculus & optimization', 'Probability & statistical hypothesis testing'],
          },
          {
            num: '02',
            title: 'Scientific Computing in Python',
            topics: ['NumPy & SciPy numerical computing', 'Publication-quality data visualization', 'Solving differential equations (ODEs)'],
          },
          {
            num: '03',
            title: 'ML for Empirical & Lab Data',
            topics: ['ML workflows for experimental data', 'Regression for physical parameter estimation', 'Signal feature extraction & validation'],
          },
          {
            num: '04',
            title: 'Deep Learning & Scientific Models',
            topics: ['Neural network architectures & loss functions', 'CNNs for scientific imaging & spectroscopy', 'Model interpretability in science'],
          },
          {
            num: '05',
            title: 'Physics-Informed AI (PINNs)',
            topics: ['Embedding physical laws into loss functions', 'Boundary & initial condition constraints', 'Validating models against physical laws'],
          },
          {
            num: '06',
            title: 'Research Computing & Publication',
            topics: ['Reproducible research workflows & GitHub', 'Benchmark dataset curation', 'Technical paper formatting & presentation'],
          },
        ],
        capstone: {
          title: 'Computational Science & SciML Project',
          flow: ['Scientific Hypothesis', 'Lab Dataset', 'SciML / PINN Model', 'Research Report'],
          outputs: ['Jupyter research notebook', 'PINN simulation model', 'Formatted technical research paper'],
        },
      },
      {
        id: 'sci-p2',
        eyebrow: 'PATHWAY 2',
        title: 'Mathematics + AI / Computational Intelligence',
        duration: '3 Months',
        level: 'Mathematics & Statistics Majors',
        enrollLink: 'https://rzp.io/rzp/ik3ig71K',
        syllabusLink: '',
        description: 'Rigorous mathematics-oriented pathway focusing on mathematical proofs, optimization theory, statistical learning, and computational algorithms.',
        modules: [
          {
            num: '01',
            title: 'Mathematics Behind Modern AI',
            topics: ['Vector spaces & matrix decompositions (SVD, PCA)', 'Multivariable calculus & gradient fields', 'Statistical inference & Bayesian theory'],
          },
          {
            num: '02',
            title: 'Optimization Theory & Algorithms',
            topics: ['Convex optimization & gradient descent', 'Stochastic optimization & momentum', 'Convergence analysis'],
          },
          {
            num: '03',
            title: 'Algorithmic AI & Simulation',
            topics: ['Numerical linear algebra', 'Monte Carlo simulations', 'Optimization-driven network training'],
          },
        ],
        capstone: {
          title: 'Mathematical Problem Solving via AI',
          flow: ['Math Formulation', 'Algorithm Design', 'Computational Implementation', 'Final Report'],
          outputs: ['Algorithm notebook', 'Theoretical analysis report', 'GitHub repository'],
        },
      },
    ],
  },
  {
    id: 'group-3',
    badge: 'GROUP 3',
    icon: '📊',
    title: 'Commerce, BBA & Management',
    target: 'B.Com • BBA • M.Com • MBA • Economics • Finance',
    tagline: 'Business analytics, SQL, modern data engineering, FinTech systems, and AI-driven decisions.',
    pathways: [
      {
        id: 'mgmt-p1',
        eyebrow: 'PATHWAY 1',
        title: 'Business Analytics & Data Engineering',
        duration: '3 Months',
        level: 'Undergraduate / Postgraduate',
        enrollLink: 'https://rzp.io/rzp/X2wGPMm',
        syllabusLink: '',
        description: 'Equips business students with advanced Excel, SQL, modern data engineering (ETL, Parquet, DuckDB), Power BI, and Generative AI.',
        modules: [
          {
            num: '01',
            title: 'Business Data & Advanced Excel',
            topics: ['Transactional & operational business data', 'Dynamic array formulas & XLOOKUP', 'Power Pivot & interactive dashboard design'],
          },
          {
            num: '02',
            title: 'SQL for Business Analytics',
            topics: ['Relational schemas & multi-table JOINs', 'Aggregations, GROUP BY & window functions', 'Queries for churn, revenue, and customer KPIs'],
          },
          {
            num: '03',
            title: 'Data Engineering for Analysts',
            topics: ['ETL pipelines & star schema design', 'Columnar Parquet & fast DuckDB queries', 'Event streaming fundamentals with Kafka'],
            pipeline: ['ERP/CRM Data', 'ETL Pipeline', 'Parquet Storage', 'DuckDB Engine', 'Power BI Dashboard'],
          },
          {
            num: '04',
            title: 'BI Dashboards & Data Storytelling',
            topics: ['Power BI / Tableau visual hierarchy', 'Interactive filters & KPI scorecards', 'Executive data presentations'],
          },
          {
            num: '05',
            title: 'Generative AI for Business',
            topics: ['Prompt engineering for analysts', 'Automated document & market synthesis', 'AI-driven executive decision support'],
          },
        ],
        capstone: {
          title: 'Enterprise Business Intelligence System',
          flow: ['Raw Sales Data', 'ETL Pipeline', 'SQL Warehouse', 'Power BI Dashboard', 'Executive Deck'],
          outputs: ['Automated ETL pipeline in DuckDB', 'Interactive Power BI dashboard', 'Executive strategy slide deck'],
        },
      },
      {
        id: 'mgmt-p2',
        eyebrow: 'PATHWAY 2',
        title: 'AI in Finance & FinTech Systems',
        duration: '3 Months',
        level: 'Finance & Banking Students',
        enrollLink: 'https://rzp.io/rzp/Z4l1xd30',
        syllabusLink: '',
        description: 'Explores digital banking, financial modeling, credit risk scoring, fraud detection algorithms, and responsible AI in finance.',
        modules: [
          {
            num: '01',
            title: 'FinTech Landscape & Payment Rails',
            topics: ['Digital banking, UPI & payment gateways', 'Digital lending & automated underwriting', 'InsurTech & RegTech ecosystems'],
          },
          {
            num: '02',
            title: 'Financial Analytics & Forecasting',
            topics: ['P&L, balance sheet & cash flow metrics', 'Revenue modeling & variance analysis', 'Time-series forecasting for budgets'],
          },
          {
            num: '03',
            title: 'AI Credit Scoring & Fraud Detection',
            topics: ['ML models for default & risk prediction', 'Real-time transaction fraud detection', 'Customer lifetime value & churn models'],
          },
          {
            num: '04',
            title: 'Responsible AI & Compliance',
            topics: ['Model explainability (SHAP/LIME)', 'Fair lending compliance & bias reduction', 'Financial data privacy governance'],
          },
        ],
        capstone: {
          title: 'Financial Risk & Fraud Analytics System',
          flow: ['Financial Data', 'Feature Engineering', 'Risk ML Model', 'Executive Dashboard'],
          outputs: ['Trained credit risk ML model', 'Interactive risk dashboard', 'Compliance & business report'],
        },
      },
      {
        id: 'mgmt-common',
        eyebrow: 'WEEKEND TRACK',
        title: 'AI Entrepreneurship & Business Innovation',
        duration: 'Weekend Track',
        level: 'All Commerce & Management',
        enrollLink: 'https://rzp.io/rzp/mysgU9wQ',
        syllabusLink: '',
        description: 'Learn how to launch AI-enabled business services, SaaS tools, SME automation platforms, and investor pitch decks.',
        modules: [
          {
            num: '01',
            title: 'Commercial AI Discovery',
            topics: ['FinTech & SME automation opportunities', 'AI marketing & analytics tools', 'Local business automated workflows'],
          },
          {
            num: '02',
            title: 'Business Model & Unit Economics',
            topics: ['SaaS pricing models & CAC/LTV metrics', 'Business Model Canvas design', 'Go-to-market strategies'],
          },
          {
            num: '03',
            title: 'MVP Prototyping & Pitching',
            topics: ['No-code MVP prototyping', 'Validating willingness to pay', '10-slide investor pitch deck'],
          },
        ],
        capstone: {
          title: 'Commercial AI Venture Plan & Pitch',
          flow: ['Market Need', 'Product Concept', 'Unit Economics', 'Investor Pitch'],
          outputs: ['Validated Business Model Canvas', 'Working prototype wireframe', '10-slide investor deck'],
        },
      },
    ],
  },
  {
    id: 'group-4',
    badge: 'GROUP 4',
    icon: '🎨',
    title: 'BA, Humanities & Other Disciplines',
    target: 'BA • Fine Arts • Education • Law • All Non-Tech Majors',
    tagline: 'AI-Enabled Professional Program — transforming students into high-productivity, AI-fluent leaders.',
    pathways: [
      {
        id: 'arts-p1',
        eyebrow: 'AI-ENABLED PROFESSIONAL PROGRAM',
        title: 'Applied AI for Humanities, Research & Careers',
        duration: '3 Months',
        level: 'All Students (No Coding Required)',
        enrollLink: 'https://rzp.io/rzp/qjdUioKf',
        syllabusLink: '',
        description: 'Elite professional program: prompt engineering, AI research methods, automated content, executive communication, and career mastery.',
        modules: [
          {
            num: '01',
            title: 'AI Literacy & Foundations',
            topics: ['How LLMs work & practical limitations', 'Ethical AI, academic integrity & privacy', 'AI-collaborative professional mindset'],
          },
          {
            num: '02',
            title: 'Mastering Prompt Engineering',
            topics: ['Context, role & constraint formulation', 'Chain-of-thought & step-by-step reasoning', 'Iterative prompt optimization & testing'],
          },
          {
            num: '03',
            title: 'AI for Research & Synthesis',
            topics: ['Synthesizing 50+ page documents quickly', 'Literature exploration & comparative analysis', 'Fact-checking & citation verification'],
          },
          {
            num: '04',
            title: 'Productivity & Executive Writing',
            topics: ['Drafting reports, proposals & memos', 'Slide outlines & presentation workflows', 'Custom AI productivity assistants'],
          },
          {
            num: '05',
            title: 'Career Acceleration & Branding',
            topics: ['AI-optimized resume & ATS alignment', 'LinkedIn transformation & personal branding', 'AI mock interview preparation'],
          },
        ],
        capstone: {
          title: 'AI-Enabled Professional Portfolio',
          flow: ['Research Statement', 'AI Analysis', 'Executive Content', 'Portfolio & Resume'],
          outputs: ['In-depth AI research paper', 'Optimized resume & LinkedIn profile', 'Custom AI workflow dossier'],
        },
      },
    ],
  },
];

const PROGRAM_HIGHLIGHTS = [
  {
    icon: '🛠️',
    title: 'Production-Grade Coding & Labs',
    desc: 'Hands-on practice using real developer tools, Python, React, SQL, DuckDB, and Docker.',
  },
  {
    icon: '🏆',
    title: 'Evidence-Based Capstones',
    desc: 'Every student builds and defends a real-world project to create a verifiable GitHub portfolio.',
  },
  {
    icon: '🎯',
    title: 'Practitioner Mentorship',
    desc: 'Direct guidance from active AI engineers, researchers, and industry specialists.',
  },
  {
    icon: '🚀',
    title: 'Career & Profile Acceleration',
    desc: 'ATS-optimized resumes, interview preparation, LinkedIn optimization, and hiring network access.',
  },
];

const JOURNEY_STEPS = [
  { num: '01', title: 'Degree Foundation', desc: 'Core academic coursework' },
  { num: '02', title: 'Applied AI Skills', desc: 'Modern tools & workflows' },
  { num: '03', title: 'Hands-on Labs', desc: 'Production coding & pipelines' },
  { num: '04', title: 'Capstone Project', desc: 'Real-world problem solving' },
  { num: '05', title: 'Career Ready', desc: 'Portfolio, GitHub & interviews' },
];

export default function ProgramsPage() {
  const [activeGroup, setActiveGroup] = useState('group-1');
  const [expandedPathway, setExpandedPathway] = useState('cs-p1');

  const currentGroupData = GROUPS_DATA.find((g) => g.id === activeGroup) || GROUPS_DATA[0];

  const handleEnrollClick = (pathway) => {
    if (pathway.enrollLink) {
      window.open(pathway.enrollLink, '_blank', 'noopener,noreferrer');
    } else {
      window.open('tel:+918219691201', '_self');
    }
  };

  const handleSyllabusClick = (pathway) => {
    if (pathway.syllabusLink && pathway.syllabusLink !== '#') {
      window.open(pathway.syllabusLink, '_blank', 'noopener,noreferrer');
    } else {
      window.open(`mailto:unisole.empower@gmail.com?subject=${encodeURIComponent(`Syllabus Request: ${pathway.title}`)}`, '_blank');
    }
  };

  return (
    <>
      <Navbar />

      <main className="programs-page">
        {/* ================= HERO HEADER ================= */}
        <header className="programs-hero">
          <div className="programs-hero-badge">
            <span>⚡ UNISOLE SKILL AI LABS CAMPUS PROGRAM</span>
          </div>
          <h1 className="programs-hero-title">
            Industry-Ready Curriculum — 4 Student Pathways
          </h1>
          <p className="programs-hero-subtitle">
            Practical, industry-aligned AI education frameworks designed across 4 core academic streams.
          </p>

          {/* Quick Group Switcher Pills */}
          <div className="group-switcher-tabs" role="tablist">
            {GROUPS_DATA.map((g) => {
              const isActive = activeGroup === g.id;
              return (
                <button
                  key={g.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`group-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveGroup(g.id);
                    setExpandedPathway(g.pathways[0].id);
                  }}
                >
                  <span className="group-tab-icon">{g.icon}</span>
                  <div className="group-tab-text">
                    <span className="group-tab-badge">{g.badge}</span>
                    <span className="group-tab-title">{g.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </header>

        {/* ================= ACTIVE GROUP SECTION ================= */}
        <section className="active-group-panel" id="group-content">
          <div className="group-header-card">
            <div className="group-header-top">
              <span className="group-header-badge">{currentGroupData.badge}</span>
              <span className="group-header-target">🎯 <strong>Target:</strong> {currentGroupData.target}</span>
            </div>
            <h2 className="group-header-title">{currentGroupData.title}</h2>
            <p className="group-header-tagline">{currentGroupData.tagline}</p>
          </div>

          {/* Pathways Accordion / Cards for Current Group */}
          <div className="pathways-list">
            {currentGroupData.pathways.map((pathway) => {
              const isOpen = expandedPathway === pathway.id;
              return (
                <article
                  key={pathway.id}
                  className={`pathway-card ${isOpen ? 'pathway-card--open' : ''}`}
                  id={pathway.id}
                >
                  <header
                    className="pathway-card-header"
                    onClick={() => setExpandedPathway(isOpen ? null : pathway.id)}
                    tabIndex={0}
                    role="button"
                    aria-expanded={isOpen}
                  >
                    <div className="pathway-header-meta">
                      <span className="pathway-eyebrow">{pathway.eyebrow}</span>
                      {pathway.duration && <span className="pathway-duration-pill">⏱️ {pathway.duration}</span>}
                      {pathway.level && <span className="pathway-level-pill">📊 {pathway.level}</span>}
                    </div>

                    <div className="pathway-title-row">
                      <h3 className="pathway-title">{pathway.title}</h3>
                      <div className={`pathway-chevron ${isOpen ? 'open' : ''}`}>
                        {chevronDownSvg}
                      </div>
                    </div>

                    <p className="pathway-description">{pathway.description}</p>
                  </header>

                  {isOpen && (
                    <div className="pathway-details-body">
                      {/* Modules Grid */}
                      <h4 className="section-subheading">📚 Core Curriculum Modules</h4>
                      <div className="modules-grid">
                        {pathway.modules.map((mod) => (
                          <div key={mod.num} className="module-item-card">
                            <div className="module-item-header">
                              <span className="module-item-num">{mod.num}</span>
                              <h5 className="module-item-title">{mod.title}</h5>
                            </div>
                            <ul className="module-topics-list">
                              {mod.topics.map((t, idx) => (
                                <li key={idx}>
                                  {checkSvg}
                                  <span>{t}</span>
                                </li>
                              ))}
                            </ul>
                            {mod.practical && (
                              <div className="module-practical-box">
                                <span className="practical-label">💡 Hands-on:</span>
                                <span className="practical-text">{mod.practical}</span>
                              </div>
                            )}
                            {mod.pipeline && (
                              <div className="module-pipeline-box">
                                <span className="pipeline-label">⚡ Pipeline:</span>
                                <div className="pipeline-steps">
                                  {mod.pipeline.map((step, sIdx) => (
                                    <span key={sIdx} className="pipeline-step-badge">
                                      {step} {sIdx < mod.pipeline.length - 1 ? '→' : ''}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Capstone Box */}
                      {pathway.capstone && (
                        <div className="capstone-highlight-card">
                          <div className="capstone-header">
                            <span className="capstone-badge">🏆 CAPSTONE PROJECT</span>
                            <h4 className="capstone-title">{pathway.capstone.title}</h4>
                          </div>

                          {pathway.capstone.flow && (
                            <div className="capstone-flow-container">
                              <span className="flow-title">Architecture:</span>
                              <div className="capstone-flow-steps">
                                {pathway.capstone.flow.map((st, i) => (
                                  <div key={st} className="flow-chip">
                                    <span className="flow-chip-num">{i + 1}</span>
                                    <span className="flow-chip-label">{st}</span>
                                    {i < pathway.capstone.flow.length - 1 && <span className="flow-chip-arrow">→</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {pathway.capstone.outputs && (
                            <div className="capstone-outputs-box">
                              <span className="outputs-label">Deliverables:</span>
                              <div className="outputs-grid">
                                {pathway.capstone.outputs.map((out, oIdx) => (
                                  <div key={oIdx} className="output-item">
                                    {checkSvg}
                                    <span>{out}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* CTA inside pathway */}
                      <div className="pathway-actions-row">
                        <button
                          type="button"
                          className="btn-enroll-primary"
                          onClick={() => handleEnrollClick(pathway)}
                        >
                          <span>Enroll</span>
                          {arrowSvg}
                        </button>
                        <button
                          type="button"
                          className="btn-enroll-secondary"
                          onClick={() => handleSyllabusClick(pathway)}
                        >
                          {syllabusSvg}
                          <span>Request Syllabus</span>
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* ================= PROGRAM HIGHLIGHTS ================= */}
        <section className="common-layer-section">
          <div className="section-header-center">
            <span className="section-badge">WHAT WE DELIVER</span>
            <h2 className="section-title">Why Unisole Programs</h2>
            <p className="section-subtitle">
              Every pathway is designed to turn classroom theory into verifiable, industry-ready capability.
            </p>
          </div>

          <div className="common-layer-grid">
            {PROGRAM_HIGHLIGHTS.map((item) => (
              <div key={item.title} className="common-layer-card">
                <div className="common-layer-top">
                  <span className="layer-icon">{item.icon}</span>
                </div>
                <h3 className="layer-card-title">{item.title}</h3>
                <p className="layer-card-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= THE STUDENT JOURNEY ================= */}
        <section className="journey-section">
          <div className="section-header-center">
            <span className="section-badge">LIFECYCLE</span>
            <h2 className="section-title">The Student Journey</h2>
            <p className="section-subtitle">
              A structured progression from foundational concepts to an employer-ready portfolio.
            </p>
          </div>

          <div className="journey-steps-grid">
            {JOURNEY_STEPS.map((s) => (
              <div key={s.num} className="journey-step-box">
                <span className="step-num">{s.num}</span>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
