import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Laptop, 
  Microscope, 
  BarChart3, 
  Palette, 
  Clock, 
  BookOpen, 
  TrendingUp, 
  ChevronDown, 
  Check, 
  Download, 
  ExternalLink,
  Award,
  Target,
  Rocket,
  Wrench,
  Trophy,
  ArrowRight
} from 'lucide-react';

const SUBSCRIPTION_PAYMENT_LINK = import.meta.env.VITE_SUBSCRIPTION_PAYMENT_LINK;

const GROUPS_DATA = [
  {
    id: 'group-1',
    badge: 'GROUP 1',
    icon: Laptop,
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
        syllabusLink: 'https://drive.google.com/file/d/1RggQ-b98tL1plZ9xzqjP0pOe1Q53lDGT/view?usp=sharing',
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
        syllabusLink: 'https://drive.google.com/file/d/1lUpD7d9XAnHJDCfV7Pa37bAkq76iMJFW/view?usp=sharing',
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
        syllabusLink: 'https://drive.google.com/file/d/1QNo7KKUR0Ogo49cNuZDJMVtvra_lw02x/view?usp=sharing',
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
        syllabusLink: 'https://drive.google.com/file/d/1TikAdxgJXkIkT6OapYtBoe2-U6KOCino/view?usp=sharing',
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
    icon: Microscope,
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
        syllabusLink: 'https://drive.google.com/file/d/1qdVw0O-BfmiL0v3qzDWcAjkkwmAk9FLO/view?usp=sharing',
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
        syllabusLink: 'https://drive.google.com/file/d/1CeMGDt3LuYpdTaB2tLl6vW-A4JUeAP8z/view?usp=sharing',
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
    icon: BarChart3,
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
        syllabusLink: 'https://drive.google.com/file/d/15RpNVt-OxkNNvfmS7k_rSgwlswKtVmOB/view?usp=sharing',
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
        syllabusLink: 'https://drive.google.com/file/d/1iNFZKMFAaxNdLqBPk1n3dHZtAPn0Et6i/view?usp=sharing',
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
        id: 'mgmt-p3',
        eyebrow: 'PATHWAY 3',
        title: 'Complete Business AI Pathway',
        duration: '6 Months',
        level: 'Dual-Track Mastery',
        enrollLink: 'https://rzp.io/rzp/KUuWTEk6',
        syllabusLink: 'https://drive.google.com/file/d/19dGBR7uKNksbOGdoeLfQJaczxi2Cl6rr/view?usp=sharing',
        description: 'Comprehensive dual-track program merging Business Analytics, SQL & modern Data Engineering with FinTech AI, credit scoring, fraud risk intelligence, and executive BI dashboards.',
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
            title: 'FinTech Landscape & Payment Rails',
            topics: ['Digital banking, UPI & payment gateways', 'Digital lending & automated underwriting', 'InsurTech & RegTech ecosystems'],
          },
          {
            num: '05',
            title: 'AI Credit Scoring & Fraud Intelligence',
            topics: ['ML models for default & risk prediction', 'Real-time transaction fraud detection', 'Customer lifetime value & churn models'],
          },
          {
            num: '06',
            title: 'BI Dashboards & Executive Storytelling',
            topics: ['Power BI / Tableau visual hierarchy', 'Interactive filters & KPI scorecards', 'Executive data presentations'],
          },
          {
            num: '07',
            title: 'Generative AI & Enterprise Automation',
            topics: ['Prompt engineering for analysts', 'Automated market synthesis & document parsing', 'AI-driven executive decision support'],
          },
        ],
        capstone: {
          title: 'Enterprise Business & FinTech AI Platform',
          flow: ['Data Ingestion', 'ETL Pipeline', 'Risk ML Model', 'Power BI Dashboard', 'Executive Strategy'],
          outputs: ['Automated DuckDB/Parquet data pipeline', 'Trained financial risk ML model', 'Dual certification credential', 'Executive strategy slide deck'],
        },
      },
      {
        id: 'mgmt-common',
        eyebrow: 'WEEKEND TRACK',
        title: 'AI Entrepreneurship & Business Innovation',
        duration: 'Weekend Track',
        level: 'All Commerce & Management',
        enrollLink: 'https://rzp.io/rzp/mysgU9wQ',
        syllabusLink: 'https://drive.google.com/file/d/1Y7FqJBSwl94ZJyBpFItEKbCVWbNJDixx/view?usp=sharing',
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
    icon: Palette,
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
        syllabusLink: 'https://drive.google.com/file/d/1ySAQ3ZarHXPq7SbqGbXX5e_sm86DK1Sa/view?usp=sharing',
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
    icon: Wrench,
    title: 'Production-Grade Coding & Labs',
    desc: 'Hands-on practice using real developer tools, Python, React, SQL, DuckDB, and Docker.',
  },
  {
    icon: Trophy,
    title: 'Evidence-Based Capstones',
    desc: 'Every student builds and defends a real-world project to create a verifiable GitHub portfolio.',
  },
  {
    icon: Target,
    title: 'Practitioner Mentorship',
    desc: 'Direct guidance from active AI engineers, researchers, and industry specialists.',
  },
  {
    icon: Rocket,
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

  const handleEnrollClick = (pathway: any) => {
    if (pathway.enrollLink) {
      window.open(pathway.enrollLink, '_blank', 'noopener,noreferrer');
    } else {
      window.open('tel:+918219691201', '_self');
    }
  };

  const handleSyllabusClick = (pathway: any) => {
    if (pathway.syllabusLink && pathway.syllabusLink !== '#') {
      window.open(pathway.syllabusLink, '_blank', 'noopener,noreferrer');
    } else {
      window.open(`mailto:unisole.empower@gmail.com?subject=${encodeURIComponent(`Syllabus Request: ${pathway.title}`)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-16">
        
        {/* ================= HERO HEADER ================= */}
        <header className="text-center max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 uppercase tracking-wider">
            ⚡ Campus Programs
          </span>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none text-slate-900 dark:text-white">
            Industry-Ready Curriculum — <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500">
              4 Student Pathways
            </span>
          </h1>
          
          <p className="text-sm sm:text-base text-slate-650 dark:text-slate-405 leading-relaxed">
            Practical, industry-aligned AI education frameworks designed across 4 core academic streams.
          </p>

          {/* Quick Group Switcher Tab Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6" role="tablist">
            {GROUPS_DATA.map((g) => {
              const isActive = activeGroup === g.id;
              const IconComp = g.icon;
              return (
                <button
                  key={g.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`flex flex-col items-center p-4 border rounded-2xl transition-all duration-300 text-center ${
                    isActive 
                      ? 'border-indigo-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-indigo-500/10' 
                      : 'border-slate-200 bg-white/40 dark:border-slate-800 dark:bg-slate-900/30 hover:border-slate-300 hover:bg-white dark:hover:bg-slate-900/50'
                  }`}
                  onClick={() => {
                    setActiveGroup(g.id);
                    setExpandedPathway(g.pathways[0].id);
                  }}
                >
                  <IconComp className={`w-5 h-5 mb-2 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{g.badge}</span>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white mt-1.5 leading-tight">{g.title.split(' & ')[0]}</span>
                </button>
              );
            })}
          </div>
        </header>

        {/* ================= ACTIVE GROUP SECTION ================= */}
        <section className="space-y-6" id="group-content">
          
          {/* Main Info Card for selected group */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-indigo-900/40">
            <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-2.5 py-1 text-[10px] font-bold bg-white/10 backdrop-blur-md rounded-md tracking-wider border border-white/10">
                  {currentGroupData.badge}
                </span>
                <span className="text-xs text-indigo-200">
                  <strong>Target Learners:</strong> {currentGroupData.target}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">{currentGroupData.title}</h2>
              <p className="text-sm text-indigo-100 max-w-2xl leading-relaxed">{currentGroupData.tagline}</p>
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {currentGroupData.pathways.map((pathway) => {
              const isOpen = expandedPathway === pathway.id;
              return (
                <article
                  key={pathway.id}
                  className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? 'border-indigo-200 dark:border-indigo-900/50 shadow-md' 
                      : 'border-slate-200/80 dark:border-slate-800/80 hover:border-slate-350 dark:hover:border-slate-700'
                  }`}
                  id={pathway.id}
                >
                  <header
                    className="p-6 cursor-pointer flex flex-col md:flex-row justify-between gap-4 md:items-start select-none"
                    onClick={() => setExpandedPathway(isOpen ? '' : pathway.id)}
                    tabIndex={0}
                    role="button"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-2 flex-grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">{pathway.eyebrow}</span>
                        {pathway.duration && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {pathway.duration}
                          </span>
                        )}
                        {pathway.level && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300">
                            <TrendingUp className="w-3 h-3 text-slate-400" />
                            {pathway.level}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{pathway.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-4xl">{pathway.description}</p>
                    </div>
                    
                    <div className={`p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 transition-transform duration-300 self-start md:self-auto ${isOpen ? 'rotate-180 bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-slate-800 dark:border-slate-700 dark:text-white' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </header>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-4 border-t border-slate-100 dark:border-slate-800/40 space-y-6">
                      
                      {/* Curriculum Modules grid */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-indigo-500" />
                          Core Curriculum Modules
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {pathway.modules.map((mod) => (
                            <div key={mod.num} className="border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl p-5 space-y-3">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400 w-6 h-6 rounded-lg flex items-center justify-center border border-indigo-100/50 dark:border-indigo-900/30">
                                  {mod.num}
                                </span>
                                <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{mod.title}</h5>
                              </div>
                              
                              <ul className="space-y-1.5 text-xs text-slate-650 dark:text-slate-400 pl-1">
                                {mod.topics.map((t, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                                    <span>{t}</span>
                                  </li>
                                ))}
                              </ul>

                              {mod.practical && (
                                <div className="mt-3 pt-2.5 border-t border-slate-150 dark:border-slate-800/60 text-xs">
                                  <span className="font-bold text-slate-700 dark:text-slate-350 block">Hands-on Lab:</span>
                                  <span className="text-slate-500 dark:text-slate-400 mt-0.5 block italic">{mod.practical}</span>
                                </div>
                              )}

                              {mod.pipeline && (
                                <div className="mt-3 pt-2.5 border-t border-slate-150 dark:border-slate-800/60 text-xs">
                                  <span className="font-bold text-slate-700 dark:text-slate-350 block">Pipeline Blueprint:</span>
                                  <div className="flex flex-wrap items-center gap-1 mt-1">
                                    {mod.pipeline.map((step, sIdx) => (
                                      <span key={sIdx} className="px-1.5 py-0.5 text-[9px] font-semibold bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border border-slate-300/20">
                                        {step} {sIdx < mod.pipeline.length - 1 ? '→' : ''}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Capstone System */}
                      {pathway.capstone && (
                        <div className="border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/20 dark:bg-indigo-950/10 rounded-2xl p-6 space-y-4">
                          <div className="flex items-center justify-between border-b border-indigo-100/50 dark:border-indigo-900/20 pb-3">
                            <span className="px-2 py-0.5 text-[9px] font-bold bg-indigo-600 text-white rounded uppercase tracking-wider">
                              Capstone Project
                            </span>
                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{pathway.capstone.title}</h4>
                          </div>

                          {pathway.capstone.flow && (
                            <div className="space-y-2">
                              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">System Flow:</span>
                              <div className="flex flex-wrap items-center gap-2">
                                {pathway.capstone.flow.map((st, i) => (
                                  <div key={st} className="flex items-center gap-2 text-xs">
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                                      {i + 1}
                                    </span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{st}</span>
                                    {i < pathway.capstone.flow.length - 1 && <span className="text-slate-400 dark:text-slate-600">&rarr;</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {pathway.capstone.outputs && (
                            <div className="space-y-2 pt-2">
                              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Project Deliverables:</span>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {pathway.capstone.outputs.map((out, oIdx) => (
                                  <div key={oIdx} className="flex items-center gap-2 text-xs text-slate-650 dark:text-slate-350">
                                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    <span>{out}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action buttons inside Pathway */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center font-bold px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-750 text-white shadow-md shadow-indigo-500/10 transition-all duration-200 active:scale-[0.98] gap-2 text-xs min-h-[40px]"
                          onClick={() => handleEnrollClick(pathway)}
                        >
                          Enroll Pathway
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center font-bold px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:text-white transition-all duration-200 active:scale-[0.98] gap-2 text-xs min-h-[40px]"
                          onClick={() => handleSyllabusClick(pathway)}
                        >
                          <Download className="w-3.5 h-3.5" />
                          {pathway.syllabusLink ? 'Download Syllabus' : 'Request Syllabus'}
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
        <section className="border-t border-slate-200/60 dark:border-slate-800/80 pt-16 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">What We Deliver</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Why Unisole Programs</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Every pathway is designed to turn classroom theory into verifiable, industry-ready capability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROGRAM_HIGHLIGHTS.map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.title} className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 space-y-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100/50 dark:border-indigo-900/30">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= THE STUDENT JOURNEY ================= */}
        <section className="border-t border-slate-200/60 dark:border-slate-800/80 pt-16 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Lifecycle</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">The Student Journey</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              A structured progression from foundational concepts to an employer-ready portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
            {JOURNEY_STEPS.map((s, idx) => (
              <div key={s.num} className="relative border border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/20 rounded-2xl p-6 space-y-4">
                <span className="text-2xl font-black text-indigo-100 dark:text-slate-800 block">
                  {s.num}
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                  {s.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
                
                {/* Visual arrow connector on larger screens */}
                {idx < 4 && (
                  <div className="hidden sm:block absolute top-1/2 -right-3.5 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-800 font-bold text-lg select-none">
                    &rarr;
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
