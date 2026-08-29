import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SyllabusDrawer from '../components/SyllabusDrawer';
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
  CheckCircle2,
  Download, 
  ExternalLink,
  Award,
  Target,
  Rocket,
  Wrench,
  Trophy,
  ArrowRight,
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  HelpCircle,
  PhoneCall,
  X,
  Briefcase
} from 'lucide-react';

const GROUPS_DATA = [
  {
    id: 'group-1',
    badge: 'GROUP 01',
    icon: Laptop,
    title: 'Computer Science & IT',
    shortName: 'CS & IT',
    target: 'BCA • MCA • B.Sc CS/IT • B.Tech CSE/IT',
    tagline: 'Production AI engineering, full stack web systems, and MLOps deployment.',
    careerRoles: ['Machine Learning Engineer', 'Full Stack AI Developer', 'MLOps Engineer', 'AI Solutions Architect'],
    tools: ['Python', 'PyTorch', 'FastAPI', 'Docker', 'React', 'MongoDB', 'LangChain', 'DuckDB'],
    pathways: [
      {
        id: 'cs-p1',
        eyebrow: 'PATHWAY 01',
        title: 'Machine Learning Engineering in Production',
        duration: '3 Months',
        level: 'Intermediate',
        handsOn: '100% Practical Labs',
        enrollLink: 'https://rzp.io/rzp/6rUVhV4',
        syllabusLink: '/syllabi/cs-p1.pdf',
        description: 'End-to-end ML engineering: data pipelines, deep learning, FastAPI model serving, Docker MLOps, and Generative AI/RAG architectures.',
        roles: ['ML Engineer', 'AI Backend Developer', 'MLOps Specialist'],
        tools: ['Python', 'NumPy', 'Pandas', 'PyTorch', 'FastAPI', 'Docker', 'RAG'],
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
        eyebrow: 'PATHWAY 02',
        title: 'Full Stack Web Development (AI-Powered)',
        duration: '3 Months',
        level: 'Beginner to Intermediate',
        handsOn: '100% Practical Labs',
        enrollLink: 'https://rzp.io/rzp/K9E9OOw',
        syllabusLink: '/syllabi/cs-p2.pdf',
        description: 'Modern full stack engineering with React, Node.js, Express, MongoDB, and integrated AI capabilities like document Q&A and chatbots.',
        roles: ['Full Stack Developer', 'React / Node Engineer', 'AI Web Integrator'],
        tools: ['React', 'Node.js', 'Express', 'MongoDB', 'Vite', 'REST APIs', 'LLM APIs'],
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
        eyebrow: 'PATHWAY 03',
        title: 'Complete Machine Learning + Full Stack',
        duration: '6 Months',
        level: 'Dual-Track Mastery',
        handsOn: '100% Practical Labs',
        enrollLink: 'https://rzp.io/rzp/34ZzWCiC',
        syllabusLink: '/syllabi/cs-p3.pdf',
        description: 'Comprehensive dual curriculum merging Machine Learning, Deep Learning, and MLOps with full-stack React, Node.js, and cloud systems.',
        roles: ['Senior AI Engineer', 'Lead Full Stack Architect', 'AI Systems Specialist'],
        tools: ['Python', 'PyTorch', 'FastAPI', 'React', 'Node.js', 'MongoDB', 'Docker', 'CI/CD'],
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
        handsOn: 'Incubator Labs',
        enrollLink: 'https://rzp.io/rzp/mysgU9wQ',
        syllabusLink: '/syllabi/cs-common.pdf',
        description: 'Structured incubator track teaching students how to convert AI technical capability into validated commercial products and startups.',
        roles: ['AI Product Manager', 'Startup Founder', 'Innovation Lead'],
        tools: ['MVP Prototyping', 'Business Model Canvas', 'Pitch Decks', 'Unit Economics'],
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
    badge: 'GROUP 02',
    icon: Microscope,
    title: 'Science & Mathematics',
    shortName: 'Science & Math',
    target: 'Physics • Mathematics • Chemistry • Biology • Applied Science',
    tagline: 'Scientific computing, physics-informed neural networks, and computational research.',
    careerRoles: ['Scientific Computing Specialist', 'Computational Data Scientist', 'SciML Researcher', 'Quantitative Analyst'],
    tools: ['Python', 'SciPy', 'NumPy', 'PINNs', 'Differential Equations', 'SymPy', 'Matplotlib'],
    pathways: [
      {
        id: 'sci-p1',
        eyebrow: 'PATHWAY 01',
        title: 'Scientific Machine Learning & AI for Science',
        duration: '3 Months',
        level: 'Undergraduate / Postgraduate',
        handsOn: '100% Practical Labs',
        enrollLink: 'https://rzp.io/rzp/uyG6gkvw',
        syllabusLink: '/syllabi/sci-p1.pdf',
        description: 'Combines mathematical principles with modern scientific computing, differential equations, and Physics-Informed Neural Networks (PINNs).',
        roles: ['SciML Researcher', 'Computational Physicist', 'Data Modeler'],
        tools: ['Python', 'NumPy', 'SciPy', 'PINNs', 'ODEs', 'Jupyter'],
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
        eyebrow: 'PATHWAY 02',
        title: 'Mathematics + AI / Computational Intelligence',
        duration: '3 Months',
        level: 'Mathematics & Statistics Majors',
        handsOn: '100% Practical Labs',
        enrollLink: 'https://rzp.io/rzp/ik3ig71K',
        syllabusLink: '/syllabi/sci-p2.pdf',
        description: 'Rigorous mathematics-oriented pathway focusing on mathematical proofs, optimization theory, statistical learning, and computational algorithms.',
        roles: ['Quantitative Analyst', 'Statistical Model Engineer', 'Algorithm Researcher'],
        tools: ['Python', 'Linear Algebra', 'Convex Optimization', 'Monte Carlo', 'SymPy'],
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
    badge: 'GROUP 03',
    icon: BarChart3,
    title: 'Commerce, BBA & Management',
    shortName: 'Commerce & Finance',
    target: 'B.Com • BBA • M.Com • MBA • Economics • Finance',
    tagline: 'Business analytics, SQL, modern data engineering, FinTech systems, and AI-driven decisions.',
    careerRoles: ['Financial AI Analyst', 'Business Intelligence Developer', 'FinTech Risk Specialist', 'Commercial Strategist'],
    tools: ['Advanced Excel', 'PostgreSQL', 'DuckDB', 'Power BI', 'Python', 'Credit Risk ML', 'Tableau'],
    pathways: [
      {
        id: 'mgmt-p1',
        eyebrow: 'PATHWAY 01',
        title: 'Business Analytics & Data Engineering',
        duration: '3 Months',
        level: 'Undergraduate / Postgraduate',
        handsOn: '100% Practical Labs',
        enrollLink: 'https://rzp.io/rzp/X2wGPMm',
        syllabusLink: '/syllabi/mgmt-p1.pdf',
        description: 'Equips business students with advanced Excel, SQL, modern data engineering (ETL, Parquet, DuckDB), Power BI, and Generative AI.',
        roles: ['Business Intelligence Analyst', 'Data Engineer for Analytics', 'Corporate Strategist'],
        tools: ['Excel', 'SQL', 'DuckDB', 'Power BI', 'ETL', 'Prompt Engineering'],
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
        eyebrow: 'PATHWAY 02',
        title: 'AI in Finance & FinTech Systems',
        duration: '3 Months',
        level: 'Finance & Banking Students',
        handsOn: '100% Practical Labs',
        enrollLink: 'https://rzp.io/rzp/Z4l1xd30',
        syllabusLink: '/syllabi/mgmt-p2.pdf',
        description: 'Explores digital banking, financial modeling, credit risk scoring, fraud detection algorithms, and responsible AI in finance.',
        roles: ['FinTech Risk Analyst', 'Financial Forecaster', 'Credit Risk Specialist'],
        tools: ['Python', 'Financial Modeling', 'Credit Scoring ML', 'Fraud Detection', 'SHAP'],
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
        eyebrow: 'PATHWAY 03',
        title: 'Complete Business AI Pathway',
        duration: '6 Months',
        level: 'Dual-Track Mastery',
        handsOn: '100% Practical Labs',
        enrollLink: 'https://rzp.io/rzp/KUuWTEk6',
        syllabusLink: '/syllabi/mgmt-p3.pdf',
        description: 'Comprehensive dual-track program merging Business Analytics, SQL & modern Data Engineering with FinTech AI, credit scoring, fraud risk intelligence, and executive BI dashboards.',
        roles: ['Chief Analytics Officer Track', 'Senior FinTech Analyst', 'Enterprise BI Consultant'],
        tools: ['Excel', 'SQL', 'DuckDB', 'Power BI', 'Python', 'Credit Scoring ML', 'Kafka'],
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
        handsOn: 'Incubator Labs',
        enrollLink: 'https://rzp.io/rzp/mysgU9wQ',
        syllabusLink: '/syllabi/mgmt-common.pdf',
        description: 'Learn how to launch AI-enabled business services, SaaS tools, SME automation platforms, and investor pitch decks.',
        roles: ['AI Venture Builder', 'SaaS Business Analyst', 'Corporate Innovation Manager'],
        tools: ['SaaS Economics', 'MVP Wireframing', 'Pitch Decks', 'GTM Strategy'],
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
    badge: 'GROUP 04',
    icon: Palette,
    title: 'BA, Humanities & Other Disciplines',
    shortName: 'Humanities & Non-Tech',
    target: 'BA • Fine Arts • Education • Law • All Non-Tech Majors',
    tagline: 'AI-Enabled Professional Program — transforming students into high-productivity, AI-fluent leaders.',
    careerRoles: ['AI Operations Lead', 'Prompt Design Consultant', 'Technical Content Architect', 'Executive Research Analyst'],
    tools: ['Claude 3.5', 'ChatGPT Plus', 'Midjourney', 'Notion AI', 'Perplexity', 'Make/Zapier', 'Prompt Engineering'],
    pathways: [
      {
        id: 'arts-p1',
        eyebrow: 'AI-ENABLED PROFESSIONAL PROGRAM',
        title: 'Applied AI for Humanities, Research & Careers',
        duration: '3 Months',
        level: 'All Students (No Coding Required)',
        handsOn: '100% Practical Labs',
        enrollLink: 'https://rzp.io/rzp/qjdUioKf',
        syllabusLink: '/syllabi/arts-p1.pdf',
        description: 'Elite professional program: prompt engineering, AI research methods, automated content, executive communication, and career mastery.',
        roles: ['AI Productivity Specialist', 'Executive Research Associate', 'Creative Technologist'],
        tools: ['Prompt Engineering', 'Document Synthesis', 'AI Copywriting', 'ATS Resumes', 'Perplexity'],
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

const COMPARISON_MATRIX = [
  {
    feature: 'Curriculum Focus',
    unisole: 'Production MLOps, Docker, FastAPI & Live LLM RAG Systems',
    traditional: 'Theoretical textbooks, legacy algorithms & slide presentations',
    recorded: 'Generic video recordings without local deployment practice',
  },
  {
    feature: 'Lab & Coding Practice',
    unisole: '100% hands-on terminal & cluster container labs',
    traditional: 'Occasional computer lab sessions with outdated compilers',
    recorded: 'Passive video watching with zero interactive debugging',
  },
  {
    feature: 'Mentor Guidance',
    unisole: 'Active IIT & NIT engineers with 1-on-1 code reviews',
    traditional: 'Academic lecturers without active industry AI practice',
    recorded: 'Automated chatbots or community forum threads',
  },
  {
    feature: 'Capstone Portfolio',
    unisole: 'Verifiable live GitHub repository & deployed Swagger REST API',
    traditional: 'Theoretical printed project report submitted to college',
    recorded: 'Copy-pasted starter code without custom architecture',
  },
  {
    feature: 'Certification & Career Support',
    unisole: 'Dual accredited certificate with QR code + 1-on-1 career referrals',
    traditional: 'Standard academic marksheet without portfolio defense',
    recorded: 'Generic certificate of completion with zero placement support',
  },
];

const FAQS_DATA = [
  {
    q: 'Do I need prior coding experience to join Unisole pathways?',
    a: 'Not for all tracks! Our Humanities & Non-Tech pathway (Group 4) and Commerce Analytics pathway (Group 3) start from absolute zero with no coding required. For Computer Science (Group 1), Module 01 starts with clean Python foundations before advancing to deep learning and MLOps.',
  },
  {
    q: 'What is the schedule for live sessions and labs?',
    a: 'Sessions are scheduled in evening slots (after 6:00 PM IST) and weekend mornings to ensure college students and working professionals can attend seamlessly without interfering with regular classes.',
  },
  {
    q: 'What if I miss a live lab or mentor session?',
    a: 'Every single live session is recorded in HD and uploaded to your student dashboard within 2 hours, along with all Jupyter notebooks, GitHub repositories, and lab environment setup scripts.',
  },
  {
    q: 'How does payment and enrollment work?',
    a: 'Enrollment is processed securely through Razorpay supporting UPI (Google Pay, PhonePe, Paytm), credit/debit cards, net banking, and EMI. Once payment is confirmed, your credentials and lab access are configured within 24 hours.',
  },
  {
    q: 'Will I receive a verified certificate upon completion?',
    a: 'Yes! Every student who completes their pathway and successfully defends their Capstone Project receives an industry-recognized Unisole Skill AI Labs Certificate featuring a unique QR code for instant employer verification on LinkedIn.',
  },
];

export default function ProgramsPage() {
  const [activeGroup, setActiveGroup] = useState('group-1');
  const [expandedPathway, setExpandedPathway] = useState('cs-p1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('ALL');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const currentGroupData = GROUPS_DATA.find((g) => g.id === activeGroup) || GROUPS_DATA[0];

  const filteredPathways = useMemo(() => {
    return currentGroupData.pathways.filter((pathway) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        pathway.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pathway.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pathway.tools.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDuration =
        selectedDuration === 'ALL' ||
        (selectedDuration === '3M' && pathway.duration.includes('3 Months')) ||
        (selectedDuration === '6M' && pathway.duration.includes('6 Months')) ||
        (selectedDuration === 'WEEKEND' && pathway.duration.toLowerCase().includes('weekend'));

      return matchesSearch && matchesDuration;
    });
  }, [currentGroupData, searchQuery, selectedDuration]);

  const [selectedSyllabusPathway, setSelectedSyllabusPathway] = useState<any>(null);
  const [selectedSyllabusGroup, setSelectedSyllabusGroup] = useState<string>('');
  const [isSyllabusDrawerOpen, setIsSyllabusDrawerOpen] = useState(false);

  const handleEnrollClick = (pathway: any) => {
    if (pathway.enrollLink) {
      window.open(pathway.enrollLink, '_blank', 'noopener,noreferrer');
    } else {
      window.open('tel:+918219691201', '_self');
    }
  };

  const handleSyllabusClick = (pathway: any, groupTitle?: string) => {
    setSelectedSyllabusPathway(pathway);
    setSelectedSyllabusGroup(groupTitle || currentGroupData?.title || '');
    setIsSyllabusDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-28 space-y-16">
        
        {/* ================= HERO SECTION (VALUE PROPOSITION + TRUST) ================= */}
        <section className="space-y-6 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mono-tag text-zinc-700 dark:text-zinc-300">
              Academic Framework 2026
            </span>
            <span className="mono-tag border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
              Spring 2026 Admissions Open
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-zinc-900 dark:text-white">
            Industry-Grade AI Pathways Built for <br className="hidden sm:inline" />
            <span className="text-zinc-400 dark:text-zinc-500">Real-World Careers</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
            Four specialized academic tracks taking students from foundational programming to live MLOps laboratory deployments. Guided directly by active engineers and researchers from IITs and NITs.
          </p>

          {/* Trust Matrix Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { label: 'Mentors', value: 'IIT & NIT Faculty' },
              { label: 'Practice', value: '100% Practical Labs' },
              { label: 'Capstones', value: '50+ Deployable Projects' },
              { label: 'Credential', value: 'Verified Dual Certificate' },
            ].map((stat, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">{stat.label}</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5 block">{stat.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ================= STREAM SELECTOR & SEARCH/FILTER CONTROLS ================= */}
        <section className="space-y-6" id="stream-catalog">
          
          {/* 4 Academic Stream Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5" role="tablist">
            {GROUPS_DATA.map((g) => {
              const isActive = activeGroup === g.id;
              const IconComp = g.icon;
              return (
                <button
                  key={g.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`flex flex-col items-start p-3.5 sm:p-4 rounded-xl border transition-all duration-150 text-left cursor-pointer ${
                    isActive 
                      ? 'border-zinc-900 dark:border-white bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs' 
                      : 'border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/80 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-850'
                  }`}
                  onClick={() => {
                    setActiveGroup(g.id);
                    setExpandedPathway(g.pathways[0].id);
                  }}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className={`text-[9px] font-mono uppercase tracking-wider ${isActive ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-400'}`}>
                      {g.badge}
                    </span>
                    <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white dark:text-zinc-900' : 'text-zinc-400'}`} />
                  </div>
                  <span className="text-xs sm:text-sm font-bold leading-tight block">
                    {g.title}
                  </span>
                  <span className={`text-[10px] mt-1 line-clamp-1 ${isActive ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    {g.target}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Stream Overview Card */}
          <div className="minimal-card p-6 sm:p-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="mono-tag text-zinc-700 dark:text-zinc-300">
                    {currentGroupData.badge}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">
                    <strong>Audience:</strong> {currentGroupData.target}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  {currentGroupData.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed mt-1">
                  {currentGroupData.tagline}
                </p>
              </div>

              {/* Tools Mastered Chips */}
              <div className="space-y-1.5 md:text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">Core Tech Stack:</span>
                <div className="flex flex-wrap md:justify-end gap-1.5">
                  {currentGroupData.tools.map((tool) => (
                    <span key={tool} className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px]">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Prospective Career Roles */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                Career Roles:
              </span>
              {currentGroupData.careerRoles.map((role) => (
                <span key={role} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium">
                  <Check className="w-2.5 h-2.5 text-zinc-400" />
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Search & Duration Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search modules, skills, or tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:border-zinc-400 text-zinc-900 dark:text-white placeholder:text-zinc-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Duration Pills */}
            <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto no-scrollbar">
              {[
                { id: 'ALL', label: 'All Tracks' },
                { id: '3M', label: '3 Months' },
                { id: '6M', label: '6 Months Dual' },
                { id: 'WEEKEND', label: 'Weekend Track' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSelectedDuration(pill.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedDuration === pill.id
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold'
                      : 'border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* ================= PATHWAY CARDS ACCORDION ================= */}
          <div className="space-y-4">
            {filteredPathways.length > 0 ? (
              filteredPathways.map((pathway) => {
                const isOpen = expandedPathway === pathway.id;
                return (
                  <article
                    key={pathway.id}
                    className={`minimal-card overflow-hidden transition-all duration-150 ${
                      isOpen ? 'border-zinc-400 dark:border-zinc-600' : ''
                    }`}
                    id={pathway.id}
                  >
                    {/* Card Header Header Bar */}
                    <header
                      className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row justify-between gap-4 md:items-start select-none"
                      onClick={() => setExpandedPathway(isOpen ? '' : pathway.id)}
                      tabIndex={0}
                      role="button"
                      aria-expanded={isOpen}
                    >
                      <div className="space-y-2 flex-grow">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="mono-tag text-zinc-900 dark:text-white font-bold">
                            {pathway.eyebrow}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            {pathway.duration}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800">
                            <TrendingUp className="w-3 h-3 text-zinc-400" />
                            {pathway.level}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                            <Zap className="w-3 h-3" />
                            {pathway.handsOn}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-tight">
                          {pathway.title}
                        </h3>

                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-4xl">
                          {pathway.description}
                        </p>

                        {/* Tool tags preview */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {pathway.tools.map((t) => (
                            <span key={t} className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right Action Cluster: Enroll Button + Chevron */}
                      <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center font-bold px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 text-white transition-all duration-150 active:scale-[0.98] gap-1.5 text-xs min-h-[38px] cursor-pointer shadow-xs hover:shadow-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnrollClick(pathway);
                          }}
                        >
                          <span>Enroll Pathway</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <div className={`p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' : ''}`}>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </header>

                    {/* Expanded Curriculum & Capstone Body */}
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-6 animate-in fade-in duration-150">
                        
                        {/* Modules Breakdown Grid */}
                        <div className="space-y-3 pt-2">
                          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Curriculum Breakdown ({pathway.modules.length} Modules)</span>
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {pathway.modules.map((mod) => (
                              <div key={mod.num} className="border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 rounded-xl p-4 space-y-2.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono font-bold text-zinc-700 bg-zinc-200/80 dark:bg-zinc-800 dark:text-zinc-300 w-5 h-5 rounded flex items-center justify-center">
                                    {mod.num}
                                  </span>
                                  <h5 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white leading-tight">
                                    {mod.title}
                                  </h5>
                                </div>
                                
                                <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                                  {mod.topics.map((t, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5">
                                      <Check className="w-3 h-3 text-zinc-900 dark:text-zinc-100 mt-0.5 flex-shrink-0" />
                                      <span className="leading-normal">{t}</span>
                                    </li>
                                  ))}
                                </ul>

                                {mod.practical && (
                                  <div className="mt-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-xs">
                                    <span className="font-semibold text-zinc-700 dark:text-zinc-300 block text-[10px] uppercase font-mono tracking-wider">Lab Task:</span>
                                    <span className="text-zinc-500 dark:text-zinc-400 mt-0.5 block italic text-[11px]">{mod.practical}</span>
                                  </div>
                                )}

                                {mod.pipeline && (
                                  <div className="mt-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-xs">
                                    <span className="font-semibold text-zinc-700 dark:text-zinc-300 block text-[10px] uppercase font-mono tracking-wider">Architecture Pipeline:</span>
                                    <div className="flex flex-wrap items-center gap-1 mt-1">
                                      {mod.pipeline.map((step, sIdx) => (
                                        <span key={sIdx} className="px-1.5 py-0.2 text-[9px] font-mono bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded">
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

                        {/* Capstone Project Deliverable Section */}
                        {pathway.capstone && (
                          <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 rounded-xl p-5 space-y-3">
                            <div className="flex flex-wrap items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-2.5 gap-2">
                              <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded">
                                Capstone Defense
                              </span>
                              <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                                {pathway.capstone.title}
                              </h4>
                            </div>

                            {pathway.capstone.flow && (
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">Execution Pipeline:</span>
                                <div className="flex flex-wrap items-center gap-2">
                                  {pathway.capstone.flow.map((st, i) => (
                                    <div key={st} className="flex items-center gap-1.5 text-xs">
                                      <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[9px] font-bold text-zinc-700 dark:text-zinc-300">
                                        {i + 1}
                                      </span>
                                      <span className="font-medium text-zinc-700 dark:text-zinc-300">{st}</span>
                                      {i < pathway.capstone.flow.length - 1 && <span className="text-zinc-400">→</span>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {pathway.capstone.outputs && (
                              <div className="space-y-1.5 pt-1">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">Employer-Ready Deliverables:</span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  {pathway.capstone.outputs.map((out, oIdx) => (
                                    <div key={oIdx} className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100 flex-shrink-0" />
                                      <span className="font-medium">{out}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action buttons & Razorpay link */}
                        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <button
                              type="button"
                              className="inline-flex items-center justify-center font-semibold px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 text-white transition-all duration-150 active:scale-[0.98] gap-1.5 text-xs min-h-[40px] cursor-pointer"
                              onClick={() => handleEnrollClick(pathway)}
                            >
                              <span>Enroll Pathway</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center justify-center font-semibold px-4 py-2.5 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white dark:bg-zinc-900 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs transition-all duration-150 active:scale-[0.98] gap-1.5 min-h-[40px] cursor-pointer"
                              onClick={() => handleSyllabusClick(pathway, currentGroupData?.title)}
                            >
                              <Download className="w-3.5 h-3.5 text-zinc-400" />
                              <span>View Syllabus & Curriculum</span>
                            </button>
                          </div>

                          <span className="text-[11px] text-zinc-400 font-mono">
                            Instant Razorpay Confirmation • Limited Batch Size
                          </span>
                        </div>

                      </div>
                    )}
                  </article>
                );
              })
            ) : (
              <div className="minimal-card p-10 text-center space-y-2">
                <Search className="w-6 h-6 text-zinc-400 mx-auto" />
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">No matching pathways found</h4>
                <p className="text-xs text-zinc-500">Try adjusting your search keywords or duration filter.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedDuration('ALL'); }}
                  className="mt-2 text-xs font-semibold text-zinc-900 dark:text-white underline cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

        </section>

        {/* ================= PROGRAM COMPARISON MATRIX (MARKETING OBJECTION HANDLING) ================= */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 pt-16 space-y-8">
          <div className="space-y-2 max-w-2xl">
            <span className="mono-tag text-zinc-700 dark:text-zinc-300">
              Value Proposition
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Why Unisole AI Labs Outperforms Traditional Courses
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Compare our production-focused laboratory approach against standard university slide lectures and passive video recordings.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-mono uppercase text-zinc-500">
                <tr>
                  <th className="p-4 font-semibold">Evaluation Criteria</th>
                  <th className="p-4 font-bold text-zinc-900 dark:text-white bg-zinc-100/80 dark:bg-zinc-800/80">Unisole Skill AI Labs</th>
                  <th className="p-4 font-medium text-zinc-500">Traditional Degree Syllabus</th>
                  <th className="p-4 font-medium text-zinc-500">Pre-Recorded Courses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {COMPARISON_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 font-bold text-zinc-900 dark:text-white">{row.feature}</td>
                    <td className="p-4 font-semibold text-zinc-900 dark:text-white bg-zinc-50/60 dark:bg-zinc-850/40">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{row.unisole}</span>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.traditional}</td>
                    <td className="p-4 text-zinc-500 dark:text-zinc-400">{row.recorded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= 5-STAGE STUDENT TRANSFORMATION JOURNEY ================= */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 pt-16 space-y-8">
          <div className="space-y-2 max-w-2xl">
            <span className="mono-tag text-zinc-700 dark:text-zinc-300">
              Student Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              The 5-Stage Transformation Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              From academic baseline to employer-ready portfolio defense.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { num: '01', title: 'Foundational Baseline', desc: 'Core academic logic, environment setup, and clean code patterns.' },
              { num: '02', title: 'Applied AI Pipelines', desc: 'Working with production libraries, data ingestion, and cloud APIs.' },
              { num: '03', title: 'Cluster Container Labs', desc: 'Docker containerization, GPU inference testing, and local MLOps.' },
              { num: '04', title: 'Capstone Defense', desc: 'Building and presenting an end-to-end full stack system with documentation.' },
              { num: '05', title: 'Career & Referrals', desc: 'QR-verified dual certification, portfolio review, and hiring referrals.' },
            ].map((step, idx) => (
              <div key={step.num} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-2">
                <span className="text-xs font-mono font-bold text-zinc-400 block">{step.num}</span>
                <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white leading-tight">{step.title}</h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= FREQUENTLY ASKED QUESTIONS (FAQS) ================= */}
        <section className="border-t border-zinc-200 dark:border-zinc-800 pt-16 space-y-8">
          <div className="space-y-2 max-w-2xl">
            <span className="mono-tag text-zinc-700 dark:text-zinc-300">
              Admissions FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Common Questions & Inquiries
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Everything you need to know about curriculum access, schedules, and certification.
            </p>
          </div>

          <div className="space-y-3 max-w-3xl">
            {FAQS_DATA.map((faq, fIdx) => {
              const isFaqOpen = expandedFaq === fIdx;
              return (
                <div
                  key={fIdx}
                  className="minimal-card overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isFaqOpen ? null : fIdx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer gap-3"
                  >
                    <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform duration-200 ${isFaqOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isFaqOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= HIGH-CONVERSION FINAL CTA BANNER ================= */}
        <section className="minimal-card p-8 sm:p-12 text-center space-y-6 bg-zinc-950 text-white dark:bg-zinc-900 dark:text-white border-zinc-800">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="mono-tag text-zinc-300 border-zinc-700 bg-zinc-900">
              Limited Batch Capacity
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Ready to Accelerate Your AI Engineering Career?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Next batch orientation commences soon. Secure your lab seat and start building verified production portfolios today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                const catalogEl = document.getElementById('stream-catalog');
                if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center font-bold px-6 py-3 rounded-lg bg-white text-zinc-950 hover:bg-zinc-100 text-xs transition-all cursor-pointer"
            >
              <span>Explore All Pathways</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
            <a
              href="tel:+918219691201"
              className="w-full sm:w-auto inline-flex items-center justify-center font-semibold px-5 py-3 rounded-lg border border-zinc-700 hover:border-zinc-500 text-white text-xs transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5 mr-1.5" />
              <span>Call Academic Counseling</span>
            </a>
          </div>

          <p className="text-[11px] font-mono text-zinc-500">
            Helpline: +91 8219691201 • unisole.empower@gmail.com
          </p>
        </section>

      </main>

      {/* ================= MOBILE STICKY BOTTOM ACTION BAR ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
        <button
          onClick={() => {
            const catalogEl = document.getElementById('stream-catalog');
            if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex-grow py-2.5 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
        >
          <span>Explore Pathways</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <a
          href="tel:+918219691201"
          className="py-2.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 font-semibold text-xs flex items-center justify-center gap-1 active:scale-[0.98]"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call</span>
        </a>
      </div>

      {/* Interactive Curriculum & Syllabus Drawer */}
      <SyllabusDrawer
        isOpen={isSyllabusDrawerOpen}
        pathway={selectedSyllabusPathway}
        groupTitle={selectedSyllabusGroup}
        onClose={() => setIsSyllabusDrawerOpen(false)}
        onEnroll={(link) => handleEnrollClick({ enrollLink: link })}
      />

      <Footer />
    </div>
  );
}
