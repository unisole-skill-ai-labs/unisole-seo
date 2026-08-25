import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ProgramsPage.css';

const SUBSCRIPTION_PAYMENT_LINK = import.meta.env.VITE_SUBSCRIPTION_PAYMENT_LINK;

const checkSvg = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const arrowSvg = (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <path d="M4 9h10M9 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const syllabusSvg = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
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
    target: 'BCA • MCA • B.Sc. CS/IT • PGDCA • B.Tech CSE/IT • Related disciplines',
    tagline: 'Production AI engineering, full stack web systems, and high-impact AI product creation.',
    pathways: [
      {
        id: 'cs-p1',
        eyebrow: 'PATHWAY 1',
        title: 'Machine Learning Engineering in Production',
        duration: '3 Months',
        level: 'Intermediate (Basic Python exposure recommended)',
        enrollLink: 'https://rzp.io/rzp/6rUVhV4',
        syllabusLink: '',
        description: 'End-to-end ML engineering covering foundational data pipelines, deep learning, production APIs, MLOps containerization, and Generative AI/RAG architectures.',
        modules: [
          {
            num: '01',
            title: 'Python for AI Engineering',
            topics: [
              'Python programming fundamentals',
              'Functions, modules and packages',
              'Object-oriented programming (OOP)',
              'Exception handling & testing',
              'File and structured data handling',
              'Virtual environments & package management',
              'Writing reusable, modular code',
              'Git/GitHub version control workflow',
            ],
            practical: 'Build a modular Python application and publish it with CI checks on GitHub.',
          },
          {
            num: '02',
            title: 'Data Engineering Foundations',
            topics: [
              'Structured vs unstructured data (CSV, JSON, Parquet)',
              'NumPy & Pandas for data manipulation',
              'Data cleaning, schema validation & EDA',
              'SQL fundamentals & relational database design',
              'OLTP vs OLAP architecture',
              'ETL vs ELT pipelines',
              'Batch vs streaming data processing',
              'DuckDB for high-speed analytical queries',
              'Apache Kafka event streaming fundamentals',
            ],
            pipeline: ['Data Source', 'ETL Pipeline', 'Parquet Storage', 'DuckDB Engine', 'Analytics / ML Models'],
          },
          {
            num: '03',
            title: 'Machine Learning',
            topics: [
              'Complete ML lifecycle & workflow',
              'Supervised learning: Regression & Classification',
              'Unsupervised learning & Clustering',
              'Advanced feature engineering & selection',
              'Train / validation / test data splitting',
              'K-Fold Cross-validation techniques',
              'Model evaluation: Accuracy, Precision, Recall, F1-Score',
              'Confusion matrix & ROC-AUC analysis',
              'Systematic model selection & hyperparameter tuning',
            ],
          },
          {
            num: '04',
            title: 'Deep Learning & Modern AI',
            topics: [
              'Neural network architectures & mathematical intuition',
              'Forward & backpropagation optimization',
              'Convolutional Neural Networks (CNNs)',
              'Sequence models & Recurrent architectures',
              'Transfer learning & modern pre-trained models',
              'Model fine-tuning principles',
              'Introduction to Transformer architectures',
              'Vector embeddings & representation learning',
              'LLM foundational concepts',
            ],
          },
          {
            num: '05',
            title: 'Building AI Applications',
            topics: [
              'Model inference & latency optimization',
              'High-performance REST APIs with FastAPI',
              'Request/response validation with Pydantic',
              'Connecting ML models to production web applications',
              'Authentication & API key management',
              'Robust error handling & logging',
            ],
          },
          {
            num: '06',
            title: 'MLOps & Deployment',
            topics: [
              'Model serialization & registry',
              'Experiment tracking & versioning',
              'Docker & containerization for reproducible inference',
              'CI/CD automated deployment pipelines',
              'Cloud deployment concepts (AWS/GCP/Vercel/Docker)',
              'Model monitoring, data drift & concept drift',
              'Automated retraining pipelines',
            ],
          },
          {
            num: '07',
            title: 'Generative AI & RAG Systems',
            topics: [
              'LLM architecture & prompting strategies',
              'Advanced Prompt Engineering & Few-Shot techniques',
              'Vector databases (Pinecone / Chroma / pgvector)',
              'Retrieval-Augmented Generation (RAG) architecture',
              'Document ingestion, chunking & semantic retrieval',
              'LLM response generation & guardrails',
              'AI evaluation frameworks & Agent fundamentals',
            ],
          },
        ],
        capstone: {
          title: 'End-to-End Production AI System',
          flow: ['Data Ingestion', 'ETL & Feature Store', 'ML / AI Model', 'FastAPI Backend', 'Client Application', 'Docker Container', 'Cloud Deployment'],
          outputs: [
            'Production GitHub repository with clean documentation',
            'Trained ML / AI model with evaluation benchmarks',
            'Deployed FastAPI REST API with live swagger documentation',
            'Working user-facing interface',
            'Technical architecture report & live demo presentation',
            'Resume project entry with quantifiable metrics',
          ],
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
        description: 'Modern full-stack engineering combining React, Node.js, Express, MongoDB, and integrated AI features like intelligent document Q&A, LLM assistants, and smart dashboards.',
        modules: [
          {
            num: '01',
            title: 'Web Foundations',
            topics: [
              'Semantic HTML5 & modern accessibility standards',
              'Modern CSS, Flexbox, CSS Grid & Responsive design',
              'Modern JavaScript (ES6+), DOM manipulation & events',
              'Asynchronous JS, Promises & Async/Await',
              'Fetch API & RESTful data consumption',
            ],
          },
          {
            num: '02',
            title: 'Modern Frontend with React',
            topics: [
              'React core architecture & JSX',
              'Components, props & state management',
              'React Hooks (useState, useEffect, useMemo, custom hooks)',
              'Form handling, validation & user feedback',
              'Client-side routing with React Router',
              'Vite build system & clean project structure',
            ],
          },
          {
            num: '03',
            title: 'Backend Development with Node.js & Express',
            topics: [
              'Node.js runtime & event-driven architecture',
              'Express.js server creation & routing',
              'REST API design principles',
              'Middleware pipelines (logging, CORS, rate-limiting)',
              'Authentication (JWT, bcrypt) & Role-based Authorization',
              'Validation & centralized error handling',
            ],
          },
          {
            num: '04',
            title: 'Databases & Data Modeling',
            topics: [
              'Database paradigms & schema design',
              'MongoDB & Mongoose ODM',
              'CRUD operations & indexing strategies',
              'Aggregation pipelines & complex queries',
              'Connecting backend services with database pools',
            ],
          },
          {
            num: '05',
            title: 'Software Engineering Best Practices',
            topics: [
              'Git & GitHub collaboration, branching & PRs',
              'Clean code organization & environment configurations',
              'Debugging workflows & browser devtools',
              'Unit & integration testing fundamentals',
            ],
          },
          {
            num: '06',
            title: 'Production Deployment & DevOps',
            topics: [
              'Optimized production bundle builds',
              'Cloud hosting & environment variables',
              'Docker containerization fundamentals',
              'CI/CD concepts & basic uptime monitoring',
            ],
          },
          {
            num: '07',
            title: 'AI-Powered Web Applications',
            topics: [
              'Connecting LLM APIs (OpenAI, Gemini, Anthropic)',
              'Embedding intelligent AI features into web apps',
              'RAG-based web applications & document Q&A',
              'Interactive AI assistants & chatbots',
              'AI-powered analytics dashboards',
            ],
          },
        ],
        capstone: {
          title: 'Full-Stack Intelligent Web Application',
          flow: ['Frontend UI', 'Express Backend', 'REST API', 'Database', 'AI Integration', 'Cloud Deployment'],
          outputs: [
            'Complete full stack web application with authentication',
            'Integrated LLM / AI capability solving a real user problem',
            'Live hosted URL on Vercel / Render / Cloud',
            'GitHub repository with comprehensive README',
          ],
        },
      },
      {
        id: 'cs-p3',
        eyebrow: 'PATHWAY 3',
        title: 'Complete Machine Learning + Full Stack',
        duration: '6 Months (Integrated Mastery)',
        level: 'Comprehensive Dual Track (Beginner to Production)',
        enrollLink: 'https://rzp.io/rzp/34ZzWCiC',
        syllabusLink: '',
        description: 'Unified mastery curriculum merging advanced Machine Learning, Deep Learning, and MLOps pipelines with full-stack React, Node.js backend systems, and production AI web applications.',
        modules: [
          {
            num: '01',
            title: 'Python for AI & Modern Engineering',
            topics: [
              'Python programming fundamentals & OOP',
              'Modular software design & unit testing',
              'Virtual environments & package workflows',
              'Git/GitHub collaborative version control',
            ],
            practical: 'Build and deploy a modular Python core engine with CI/CD checks.',
          },
          {
            num: '02',
            title: 'Data Engineering & Scalable Pipelines',
            topics: [
              'NumPy & Pandas for large dataset manipulation',
              'Data cleaning, schema validation & EDA',
              'SQL relational design & DuckDB analytics',
              'ETL/ELT pipeline architectures & Kafka streaming',
            ],
          },
          {
            num: '03',
            title: 'Machine Learning & Deep Learning',
            topics: [
              'Supervised, unsupervised & ensemble methods',
              'Neural networks, CNNs, Transformers & Embeddings',
              'Model evaluation metrics & hyperparameter tuning',
              'Transfer learning & LLM foundational concepts',
            ],
          },
          {
            num: '04',
            title: 'Full-Stack Frontend & UI Engineering',
            topics: [
              'Modern JavaScript (ES6+) & asynchronous programming',
              'React component architecture & custom hooks',
              'Responsive design, state management & routing',
              'Production bundle optimization & Vite workflows',
            ],
          },
          {
            num: '05',
            title: 'Backend Systems & Database Architecture',
            topics: [
              'Node.js & Express server architecture',
              'RESTful API design & security middleware',
              'MongoDB/Mongoose data modeling & indexing',
              'JWT authentication & role-based access control',
            ],
          },
          {
            num: '06',
            title: 'Generative AI, RAG & LLM Agents',
            topics: [
              'Vector databases (Pinecone / Chroma / pgvector)',
              'Retrieval-Augmented Generation (RAG) pipelines',
              'Prompt engineering & semantic retrieval systems',
              'AI evaluation frameworks & Autonomous Agents',
            ],
          },
          {
            num: '07',
            title: 'MLOps, Cloud Deployment & Production APIs',
            topics: [
              'FastAPI high-performance model serving',
              'Docker containerization & multi-container architecture',
              'CI/CD automated deployment to Cloud (AWS/Vercel/Render)',
              'Live monitoring, drift detection & automated retraining',
            ],
          },
        ],
        capstone: {
          title: 'Full-Stack Production AI Platform',
          flow: ['Data Pipelines', 'ML Model Training', 'FastAPI/Express Backend', 'React UI', 'RAG Integration', 'Cloud Deployment'],
          outputs: [
            'End-to-end production AI web application',
            'Full stack GitHub repository with clean documentation & CI/CD',
            'Deployed live REST API with interactive Swagger docs',
            'Dual certification credential (ML Engineering + Full Stack Web)',
          ],
        },
      },
      {
        id: 'cs-common',
        eyebrow: 'WEEKEND IMMERSION TRACK',
        title: 'AI Entrepreneurship & Innovation',
        duration: 'Weekend Track (Saturday + Sunday)',
        level: 'All CS & IT Students',
        enrollLink: 'https://rzp.io/rzp/mysgU9wQ',
        syllabusLink: '',
        description: 'Structured incubator track teaching students how to convert AI technical capability into validated commercial products and startups.',
        modules: [
          {
            num: '01',
            title: 'Problem & Market Discovery',
            topics: ['Design thinking principles', 'Identifying real user pain points', 'Customer discovery interviews', 'Competitor matrix & TAM/SAM analysis'],
          },
          {
            num: '02',
            title: 'AI Opportunity & MVP Building',
            topics: ['Where AI creates 10x value vs automation', 'Human + AI workflow design', 'Rapid prototyping with low-code & AI tools', 'Validating MVP with initial users'],
          },
          {
            num: '03',
            title: 'Business Model & Pitching',
            topics: ['Value proposition & revenue models', 'Business Model Canvas (BMC)', 'Go-To-Market & initial customer acquisition', 'High-impact investor pitch deck creation'],
          },
        ],
        capstone: {
          title: 'Startup Validation & Pitch Deck',
          flow: ['Problem Statement', 'Validated Concept', 'Functional MVP', 'Business Model Canvas', 'Final Pitch'],
          outputs: ['Working MVP prototype', 'Validated Business Model Canvas', 'Polished 10-slide investor pitch deck'],
        },
      },
    ],
  },
  {
    id: 'group-2',
    badge: 'GROUP 2',
    icon: '🔬',
    title: 'Science & Mathematics',
    target: 'Physics • Mathematics • Chemistry • Biology • Applied Science • Other science disciplines',
    tagline: 'Scientific computing, physics-informed neural networks, and computational research.',
    pathways: [
      {
        id: 'sci-p1',
        eyebrow: 'PATHWAY 1',
        title: 'Scientific Machine Learning & AI for Science',
        duration: '3 Months',
        level: 'Undergraduate / Postgraduate Science Students',
        enrollLink: 'https://rzp.io/rzp/uyG6gkvw',
        syllabusLink: '',
        description: 'Combines rigorous mathematical principles with modern scientific computing, differential equations, and Physics-Informed Neural Networks (PINNs) to solve empirical scientific problems.',
        modules: [
          {
            num: '01',
            title: 'Mathematical Foundations for AI',
            topics: [
              'Linear algebra: Vectors, matrices, eigenvalues & eigenvectors',
              'Calculus: Derivatives, gradients, Jacobians & optimization',
              'Probability theory & statistical distributions',
              'Hypothesis testing & scientific statistical inference',
            ],
          },
          {
            num: '02',
            title: 'Scientific Computing in Python',
            topics: [
              'Python for scientific research & analysis',
              'NumPy & SciPy for vectorized numerical computing',
              'Pandas for experimental and tabular dataset handling',
              'Matplotlib, Seaborn & publication-quality scientific visualization',
              'Jupyter notebooks & reproducible computational research',
              'Numerical integration & solving differential equations (ODEs)',
            ],
          },
          {
            num: '03',
            title: 'Machine Learning for Scientists',
            topics: [
              'ML workflow tailored to scientific empirical data',
              'Regression models for physical parameter estimation',
              'Classification & clustering on experimental data',
              'Feature engineering from raw sensor/lab signals',
              'Model validation against physical constraints',
            ],
          },
          {
            num: '04',
            title: 'Deep Learning & Scientific Models',
            topics: [
              'Neural network architectures & loss optimization',
              'CNNs for scientific imaging (microscopy, spectroscopy, astronomy)',
              'Sequence modeling for time-series lab data',
              'Transfer learning on scientific foundation models',
              'Model interpretability & explainability in science',
            ],
          },
          {
            num: '05',
            title: 'Scientific Machine Learning (SciML)',
            topics: [
              'Data-driven vs physics-based modeling paradigms',
              'Hybrid scientific modeling approaches',
              'Integrating differential equations with neural networks',
              'Neural operators for complex physical systems',
              'Accelerated computational prediction for physical simulations',
            ],
          },
          {
            num: '06',
            title: 'Physics-Informed AI (PINNs)',
            topics: [
              'Embedding physical conservation laws into loss functions',
              'Boundary conditions & initial condition constraints',
              'Physics-Informed Neural Networks (PINN) architecture & workflow',
              'Validating ML models against fundamental physical laws',
            ],
          },
          {
            num: '07',
            title: 'Research Computing & Publication Workflows',
            topics: [
              'Scientific problem formulation & literature review',
              'Benchmark dataset creation & curation',
              'Reproducible research protocols & Git/GitHub for scientists',
              'Technical paper formatting, data visualization & presentation',
            ],
          },
        ],
        capstone: {
          title: 'Computational Science & SciML Research Project',
          flow: ['Scientific Hypothesis', 'Lab / Sensor Dataset', 'SciML / PINN Model', 'Simulation Benchmark', 'Research Report'],
          outputs: [
            'Research-style computational project & Jupyter notebook',
            'Physics-informed or data-driven simulation model',
            'GitHub repository with reproducible scientific environment',
            'Formatted technical research report & findings presentation',
          ],
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
        description: 'Positioned as the rigorous mathematics-oriented pathway focusing on mathematical proofs, optimization theory, statistical learning, and computational algorithms behind modern AI.',
        modules: [
          {
            num: '01',
            title: 'Mathematics Behind Modern AI',
            topics: ['Vector spaces, inner products & projections', 'Matrix decompositions (SVD, PCA)', 'Multivariable calculus & gradient fields'],
          },
          {
            num: '02',
            title: 'Optimization Theory & Algorithms',
            topics: ['Convex optimization & duality', 'Gradient Descent, Momentum, Adam', 'Stochastic optimization & convergence rates'],
          },
          {
            num: '03',
            title: 'Probability, Statistics & Information Theory',
            topics: ['Bayesian inference & maximum likelihood (MLE)', 'Random variables & stochastic processes', 'Entropy, KL divergence & information metrics'],
          },
          {
            num: '04',
            title: 'Numerical Computing & Algorithmic AI',
            topics: ['Numerical linear algebra', 'Monte Carlo simulations', 'Optimization-driven neural network training'],
          },
        ],
        capstone: {
          title: 'Mathematical Problem Solving via Computational AI',
          flow: ['Math Formulation', 'Algorithm Design', 'Computational Implementation', 'Theoretical Analysis', 'Final Report'],
          outputs: ['Algorithm implementation notebook', 'Theoretical analysis report', 'GitHub repo & presentation'],
        },
      },
    ],
  },
  {
    id: 'group-3',
    badge: 'GROUP 3',
    icon: '📊',
    title: 'Commerce, BBA & Management',
    target: 'B.Com • BBA • BBM • M.Com • MBA/Management • Economics • Finance-related disciplines',
    tagline: 'Business analytics, SQL, modern data engineering, FinTech systems, and AI-driven decision making.',
    pathways: [
      {
        id: 'mgmt-p1',
        eyebrow: 'PATHWAY 1',
        title: 'Business Analytics & Data Engineering',
        duration: '3 Months',
        level: 'Undergraduate / Postgraduate Commerce & Management',
        enrollLink: 'https://rzp.io/rzp/X2wGPMm',
        syllabusLink: '',
        description: 'Equips business students with high-demand analytical tools — advanced Excel, SQL, modern data engineering (ETL, Parquet, DuckDB, Kafka), Power BI visualization, and Generative AI for automated business intelligence.',
        modules: [
          {
            num: '01',
            title: 'Business Data Foundations',
            topics: [
              'Types of business data (transactional, operational, customer, financial)',
              'Internal vs external data sources',
              'Structured vs unstructured business data',
              'Data quality assessment, validation & cleaning principles',
            ],
          },
          {
            num: '02',
            title: 'Advanced Excel for Business Intelligence',
            topics: [
              'Advanced lookup functions (XLOOKUP, INDEX/MATCH)',
              'Dynamic array formulas & conditional logic',
              'Multi-table Pivot Tables & Power Pivot basics',
              'Financial modeling calculations & scenario analysis',
              'Interactive executive dashboard design in Excel',
            ],
          },
          {
            num: '03',
            title: 'SQL for Business Analytics',
            topics: [
              'Relational databases & business data schemas',
              'Data retrieval with SELECT, WHERE, ORDER BY',
              'Aggregations with GROUP BY & HAVING clauses',
              'Multi-table relational JOINs (INNER, LEFT, FULL)',
              'Subqueries, CTEs & window functions for business KPIs',
              'Writing real-world queries for churn, revenue, and retention',
            ],
          },
          {
            num: '04',
            title: 'Data Engineering for Business Analysts',
            topics: [
              'OLTP (transactional) vs OLAP (analytical) databases',
              'Data warehousing concepts & star schemas',
              'ETL (Extract-Transform-Load) vs ELT data pipelines',
              'Batch vs real-time streaming data processing',
              'Columnar Parquet storage for high-efficiency reporting',
              'DuckDB for embedded, lightning-fast analytical queries',
              'Apache Kafka event streaming fundamentals for business events',
            ],
            pipeline: ['ERP/CRM Data', 'ETL Transformation', 'Parquet Lake', 'DuckDB Engine', 'Power BI / Dashboard'],
          },
          {
            num: '05',
            title: 'Core Business Analytics Methodologies',
            topics: [
              'Descriptive analytics (What happened?)',
              'Diagnostic analytics (Why did it happen?)',
              'Predictive analytics (What is likely to happen?)',
              'Prescriptive analytics (What action should we take?)',
              'KPI design & metrics architecture',
              'Sales, marketing, operations, and customer analytics',
            ],
          },
          {
            num: '06',
            title: 'Data Visualization & BI Dashboards',
            topics: [
              'Data storytelling & visual hierarchy principles',
              'Power BI / Tableau fundamentals & dashboard architecture',
              'Interactive filters, drill-throughs & KPI scorecards',
              'Presenting actionable insights to executive leadership',
            ],
          },
          {
            num: '07',
            title: 'Generative AI & Automation for Business',
            topics: [
              'Generative AI & Prompt Engineering for analysts',
              'AI-assisted data analysis & automated synthesis',
              'Automating market research & competitive intelligence',
              'Document parsing & contract analysis with LLMs',
              'AI-driven executive decision support systems',
            ],
          },
        ],
        capstone: {
          title: 'Retail / Enterprise Business Intelligence System',
          flow: ['Raw Sales Data', 'ETL Data Pipeline', 'SQL Data Warehouse', 'Business Analytics Model', 'Interactive BI Dashboard', 'Actionable Recommendations'],
          outputs: [
            'Automated ETL pipeline processing business data into Parquet/DuckDB',
            'Comprehensive SQL script repository answering key management queries',
            'Interactive Power BI / Tableau dashboard with drill-down analytics',
            'Executive slide deck with data-backed business strategy recommendations',
          ],
        },
      },
      {
        id: 'mgmt-p2',
        eyebrow: 'PATHWAY 2',
        title: 'AI in Finance & FinTech Systems',
        duration: '3 Months',
        level: 'Finance, Banking & Economics Students',
        enrollLink: 'https://rzp.io/rzp/Z4l1xd30',
        syllabusLink: '',
        description: 'Explores the modern financial technology landscape, payment gateways, risk analytics, AI credit scoring, fraud detection algorithms, and responsible governance in automated finance.',
        modules: [
          {
            num: '01',
            title: 'Financial Technology Landscape',
            topics: [
              'Evolution of digital banking, UPI & global payment rails',
              'Neobanks, digital lending & alternate credit underwriting',
              'InsurTech, RegTech & WealthTech ecosystems',
            ],
          },
          {
            num: '02',
            title: 'Financial Data & Ratio Analysis',
            topics: [
              'Analyzing balance sheets, P&L statements & cash flow tables',
              'High-frequency market & transactional dataset handling',
              'Core financial KPIs (EBITDA, Net Margin, Liquidity, Debt/Equity)',
            ],
          },
          {
            num: '03',
            title: 'Financial Analytics & Forecasting',
            topics: [
              'Revenue modeling & cash flow forecasting',
              'Variance analysis & financial trend identification',
              'Time-series forecasting for budget planning',
            ],
          },
          {
            num: '04',
            title: 'AI in Finance & Risk Intelligence',
            topics: [
              'Machine Learning models for credit scoring & default prediction',
              'Real-time transaction fraud detection algorithms',
              'Customer churn prediction & customer lifetime value (CLV)',
              'Algorithmic decision support in portfolio risk management',
            ],
          },
          {
            num: '05',
            title: 'FinTech Systems & Open Banking',
            topics: [
              'Payment processing architectures & gateway integration',
              'Digital lending workflows & automated approval engines',
              'Open Banking APIs & financial data pipelines',
            ],
          },
          {
            num: '06',
            title: 'Responsible AI & Governance in Finance',
            topics: [
              'Algorithmic bias & fair lending compliance',
              'Model explainability (SHAP, LIME) for regulatory scrutiny',
              'Financial data privacy & model risk management',
            ],
          },
        ],
        capstone: {
          title: 'AI-Assisted Financial Risk & Fraud Analytics System',
          flow: ['Financial Data', 'Feature Engineering', 'Risk Model', 'Executive Dashboard', 'Strategy Report'],
          outputs: [
            'Trained credit risk / fraud detection predictive model',
            'Interactive executive risk dashboard',
            'Business proposal & regulatory compliance review',
          ],
        },
      },
      {
        id: 'mgmt-common',
        eyebrow: 'WEEKEND IMMERSION TRACK',
        title: 'AI Entrepreneurship & Business Innovation',
        duration: 'Weekend Track (Saturday + Sunday)',
        level: 'All Commerce & Management Students',
        enrollLink: 'https://rzp.io/rzp/mysgU9wQ',
        syllabusLink: '',
        description: 'Learn how to conceptualize and launch AI-enabled business services — from FinTech startups and AI accounting tools to SME analytics platforms and local business automation.',
        modules: [
          {
            num: '01',
            title: 'Commercial AI Opportunity Discovery',
            topics: ['FinTech startup opportunities', 'AI marketing & customer intelligence tools', 'SME analytics platforms & automated accounting assistants', 'Local business automation workflows'],
          },
          {
            num: '02',
            title: 'Business Model & Unit Economics',
            topics: ['SaaS pricing models & customer acquisition cost (CAC)', 'Unit economics & lifetime value (LTV)', 'Designing the Business Model Canvas'],
          },
          {
            num: '03',
            title: 'MVP & Investor Pitch Deck',
            topics: ['No-code MVP prototyping', 'Validating commercial willingness to pay', 'Pitching before corporate clients and investors'],
          },
        ],
        capstone: {
          title: 'Commercial AI Venture Plan & Pitch',
          flow: ['Market Opportunity', 'Product Architecture', 'Unit Economics', 'Validated MVP', 'Investor Deck'],
          outputs: ['Complete business plan with financial projections', 'Working prototype / wireframe', '10-slide investor pitch deck'],
        },
      },
    ],
  },
  {
    id: 'group-4',
    badge: 'GROUP 4',
    icon: '🎨',
    title: 'BA, Humanities & Other Disciplines',
    target: 'BA (English, History, Sociology, Political Science, Economics, Journalism) • Fine Arts • Education • Law • All Other Disciplines',
    tagline: 'AI-Enabled Professional Program — transforming non-technical students into high-productivity, AI-fluent leaders.',
    pathways: [
      {
        id: 'arts-p1',
        eyebrow: 'AI-ENABLED PROFESSIONAL PROGRAM',
        title: 'Applied AI for Humanities, Research & Careers',
        duration: '3 Months',
        level: 'All Students (No Prior Technical Background Needed)',
        enrollLink: 'https://rzp.io/rzp/qjdUioKf',
        syllabusLink: '',
        description: 'Positioned as an elite, high-value professional acceleration program. Equips students with advanced prompt engineering, AI research methods, automated content creation, personal branding, and career mastery.',
        modules: [
          {
            num: '01',
            title: 'AI Literacy & Foundational Understanding',
            topics: [
              'What AI is and how Large Language Models actually work',
              'Generative AI capabilities vs limitations & hallucinations',
              'Ethical AI, academic integrity, bias & data privacy',
              'Developing an AI-collaborative professional mindset',
            ],
          },
          {
            num: '02',
            title: 'Mastering Prompt Engineering',
            topics: [
              'Anatomy of a high-impact prompt (Context, Role, Constraints, Output Format)',
              'Few-shot prompting, chain-of-thought & step-by-step reasoning',
              'Iterative refinement & prompt optimization techniques',
              'Evaluating and benchmark testing AI responses',
            ],
          },
          {
            num: '03',
            title: 'AI for In-Depth Academic & Market Research',
            topics: [
              'Formulating sharp research questions with AI assistance',
              'Information discovery, literature exploration & thematic mapping',
              'Synthesizing and summarizing complex 50+ page documents in seconds',
              'Comparative analysis, data interpretation & citation verification',
              'Rigorous fact-checking & hallucination elimination protocols',
            ],
          },
          {
            num: '04',
            title: 'AI for Professional Productivity & Workflows',
            topics: [
              'Executive writing: Reports, proposals, formal communication & memos',
              'Rapid presentation drafting & slide outline generation',
              'Automating daily administrative & documentation workflows',
              'Creating personalized AI assistants for specific repetitive tasks',
            ],
          },
          {
            num: '05',
            title: 'AI for Creative Content & Strategic Communication',
            topics: [
              'Content strategy, storytelling & audience engagement',
              'Visual ideation & multimodal AI generation (image, audio, diagram)',
              'Professional journalism, digital media & communication workflows',
              'Editing, tone calibration & audience-specific tailoring',
            ],
          },
          {
            num: '06',
            title: 'Career Acceleration & Personal Branding',
            topics: [
              'AI-optimized resume creation & ATS keyword alignment',
              'LinkedIn profile transformation & thought leadership posting',
              'Interactive AI mock interview prep & personalized feedback',
              'Job market research, company analysis & career roadmap design',
            ],
          },
          {
            num: '07',
            title: 'Entrepreneurship & Innovation for Creatives',
            topics: [
              'Problem discovery in society, media, education & community',
              'Creative business ideation powered by AI tools',
              'Rapid MVP prototyping without writing a line of code',
              'Pitch deck creation & presenting creative ventures',
            ],
          },
        ],
        capstone: {
          title: 'AI-Enabled Professional Portfolio',
          flow: ['Research / Problem Statement', 'AI-Assisted Analysis', 'Strategic Content / Workflow', 'Professional Resume & Profile', 'Final Presentation'],
          outputs: [
            'In-depth AI-assisted research paper or market analysis report',
            'Custom AI productivity workflow / automated system',
            'Professional portfolio website or documentation dossier',
            'AI-optimized resume, active LinkedIn profile & career strategy plan',
            'Validated entrepreneurship concept & pitch presentation',
          ],
        },
      },
    ],
  },
];

const COMMON_LAYER = [
  {
    module: 'Module A',
    title: 'Professional Digital Profile',
    icon: '🌐',
    desc: 'Every student builds a polished professional presence — professional email etiquette, high-impact LinkedIn profile, ATS-aligned resume, project documentation, and digital portfolio.',
  },
  {
    module: 'Module B',
    title: 'GitHub & Concrete Evidence',
    icon: '📁',
    desc: 'For technical streams: Git, GitHub repo architecture, clean READMEs, and version control. For non-tech streams: Digital portfolio, interactive BI reports, research dossiers, and slide decks.',
  },
  {
    module: 'Module C',
    title: 'Interview Mastery & Communication',
    icon: '🎯',
    desc: 'Resume walkthroughs, "Tell me about yourself" storytelling, technical project explanations, behavioral frameworks (STAR), AI-driven mock interviews, and personalized mentor feedback.',
  },
  {
    module: 'Module D',
    title: 'Industry Interaction & Networking',
    icon: '🤝',
    desc: 'Weekly industry expert masterclasses, corporate hiring case studies, understanding recruiter filters, networking etiquette, and cold outreach strategies to professionals.',
  },
  {
    module: 'Module E',
    title: 'Project Defence & Evaluation',
    icon: '🛡️',
    desc: 'Every student defends their project before a panel: What problem was solved? Why this approach? What was built? What are the limitations? What would you improve? Making the program 100% evidence-based.',
  },
];

const CAPSTONE_STEPS = [
  { num: '1', title: 'PROBLEM', desc: 'Identify a real-world, industry or academic problem.' },
  { num: '2', title: 'RESEARCH', desc: 'Study the domain, existing literature & current solutions.' },
  { num: '3', title: 'DATA / INFO', desc: 'Collect, clean & structure required data and parameters.' },
  { num: '4', title: 'BUILD', desc: 'Develop the appropriate technical, analytical, or research solution.' },
  { num: '5', title: 'VALIDATE', desc: 'Test accuracy, benchmark performance & interpret results.' },
  { num: '6', title: 'DOCUMENT', desc: 'Prepare repository, technical report, portfolio & slides.' },
  { num: '7', title: 'DEFEND', desc: 'Present and defend the project live before industry evaluators.' },
];

const EVIDENCE_MATRIX = [
  {
    stream: 'CS & IT',
    icon: '💻',
    deliverables: ['Production GitHub Repository', 'Full Stack / ML Software Project', 'Deployed REST API / Cloud Application', 'Technical Architecture Documentation', 'Industry-Ready Technical Resume'],
  },
  {
    stream: 'Science & Math',
    icon: '🔬',
    deliverables: ['Scientific / Computational SciML Project', 'Reproducible Jupyter Research Notebook', 'PINN / Physical Simulation Model', 'Publication-Ready Technical Report', 'Scientific Findings Presentation'],
  },
  {
    stream: 'Commerce & Management',
    icon: '📊',
    deliverables: ['Enterprise Business Intelligence System', 'SQL Data Engineering Repository', 'Interactive Power BI / Tableau Dashboard', 'Financial / Risk Analytics Model', 'Executive Strategy Recommendations Deck'],
  },
  {
    stream: 'BA & Humanities',
    icon: '🎨',
    deliverables: ['AI-Enabled Professional Portfolio Dossier', 'In-Depth Research / Market Analysis Paper', 'Custom AI Workflow Automation System', 'Optimized LinkedIn & Professional Brand', 'Creative Venture Business Pitch'],
  },
];

const JOURNEY_STEPS = [
  'College Degree',
  'Domain Knowledge',
  'AI / Tech Skills',
  'Hands-on Practice',
  'Real-World Project',
  'Digital Portfolio',
  'Rigorous Assessment',
  'Talent Pool',
  'Industry / Internship Opportunities',
];

export default function ProgramsPage() {
  const [activeGroup, setActiveGroup] = useState('group-1');
  const [expandedPathway, setExpandedPathway] = useState('cs-p1');
  const navigate = useNavigate();

  const currentGroupData = GROUPS_DATA.find((g) => g.id === activeGroup) || GROUPS_DATA[0];

  const handleEnrollClick = (pathway) => {
    if (pathway.enrollLink) {
      window.open(pathway.enrollLink, '_blank', 'noopener,noreferrer');
    } else {
      navigate('/query', { state: { expertise: `Campus AI Program: ${pathway.title}` } });
    }
  };

  const handleSyllabusClick = (pathway) => {
    if (pathway.syllabusLink && pathway.syllabusLink !== '#') {
      window.open(pathway.syllabusLink, '_blank', 'noopener,noreferrer');
    } else {
      navigate('/query', { state: { expertise: `Syllabus Request: ${pathway.title}` } });
    }
  };

  const handleSubscriptionClick = () => {
    if (SUBSCRIPTION_PAYMENT_LINK) {
      window.open(SUBSCRIPTION_PAYMENT_LINK, '_blank', 'noopener,noreferrer');
    } else {
      navigate('/query', { state: { expertise: 'Institutional Subscription' } });
    }
  };

  return (
    <>
      <Navbar />

      <main className="programs-page">
        {/* ================= HERO HEADER ================= */}
        <header className="programs-hero">
          <div className="programs-hero-badge">
            <span>⚡ UNISOLE AI CAMPUS PROGRAM</span>
          </div>
          <h1 className="programs-hero-title">
            Industry-Ready Curriculum — 4 Student Pathways
          </h1>
          <p className="programs-hero-subtitle">
            A comprehensive, evidence-based AI education framework tailored specifically across four core academic disciplines. Transforming college students from classroom learners into industry-ready practitioners through practical skills, production code, research computing, business intelligence, and real-world capstone projects.
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
              <span className="group-header-target">🎯 <strong>Target Students:</strong> {currentGroupData.target}</span>
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
                      <h4 className="section-subheading">📚 Structured Curriculum Modules</h4>
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
                                <span className="practical-label">💡 Hands-on Practical:</span>
                                <span className="practical-text">{mod.practical}</span>
                              </div>
                            )}
                            {mod.pipeline && (
                              <div className="module-pipeline-box">
                                <span className="pipeline-label">⚡ Data Pipeline:</span>
                                <div className="pipeline-steps">
                                  {mod.pipeline.map((step, sIdx) => (
                                    <span key={sIdx} className="pipeline-step-badge">
                                      {step} {sIdx < mod.pipeline.length - 1 ? '↓' : ''}
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
                            <span className="capstone-badge">🏆 MANDATORY CAPSTONE PROJECT</span>
                            <h4 className="capstone-title">{pathway.capstone.title}</h4>
                          </div>

                          {pathway.capstone.flow && (
                            <div className="capstone-flow-container">
                              <span className="flow-title">Architectural Lifecycle:</span>
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
                              <span className="outputs-label">Student Tangible Outputs & Deliverables:</span>
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
                          <span>Syllabus</span>
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* ================= COMMON INDUSTRY-READINESS LAYER ================= */}
        <section className="common-layer-section">
          <div className="section-header-center">
            <span className="section-badge">MANDATORY ACROSS ALL 4 GROUPS</span>
            <h2 className="section-title">Common Industry-Readiness Layer</h2>
            <p className="section-subtitle">
              We do not treat career preparation as an optional add-on. Every student across all disciplines completes this foundational industry layer to guarantee professional competence.
            </p>
          </div>

          <div className="common-layer-grid">
            {COMMON_LAYER.map((layer) => (
              <div key={layer.module} className="common-layer-card">
                <div className="common-layer-top">
                  <span className="layer-icon">{layer.icon}</span>
                  <span className="layer-module-tag">{layer.module}</span>
                </div>
                <h3 className="layer-card-title">{layer.title}</h3>
                <p className="layer-card-desc">{layer.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 7-STEP CAPSTONE FRAMEWORK ================= */}
        <section className="capstone-framework-section">
          <div className="section-header-center">
            <span className="section-badge">RIGOROUS EXECUTION MODEL</span>
            <h2 className="section-title">Common Final Capstone Framework</h2>
            <p className="section-subtitle">
              Every student project follows a standardized 7-step engineering, research, or business problem-solving methodology.
            </p>
          </div>

          <div className="capstone-steps-flow">
            {CAPSTONE_STEPS.map((cs) => (
              <div key={cs.num} className="capstone-step-card">
                <div className="step-num-bubble">{cs.num}</div>
                <h3 className="step-card-title">{cs.title}</h3>
                <p className="step-card-desc">{cs.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= WHAT A STUDENT HAS AT THE END ================= */}
        <section className="evidence-matrix-section">
          <div className="section-header-center">
            <span className="section-badge">NO EMPTY PROMISES — PROVEN EVIDENCE</span>
            <h2 className="section-title">What a Student Has at the End</h2>
            <p className="section-subtitle">
              We don&apos;t make superficial placement promises. We build undeniable, evidence-backed portfolios that prove real-world capability to top employers and research institutions.
            </p>
          </div>

          <div className="evidence-grid">
            {EVIDENCE_MATRIX.map((em) => (
              <div key={em.stream} className="evidence-card">
                <div className="evidence-header">
                  <span className="evidence-icon">{em.icon}</span>
                  <h3 className="evidence-stream">{em.stream}</h3>
                </div>
                <ul className="evidence-list">
                  {em.deliverables.map((d, dIdx) => (
                    <li key={dIdx}>
                      {checkSvg}
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ================= THE COMMON JOURNEY (CENTRAL VISUAL) ================= */}
        <section className="journey-section">
          <div className="section-header-center">
            <span className="section-badge">THE STUDENT LIFECYCLE</span>
            <h2 className="section-title">The Common Campus AI Journey</h2>
            <p className="section-subtitle">
              From foundational degree coursework to industry opportunities — how UNISOLE transforms students through structured, progressive milestones.
            </p>
          </div>

          <div className="journey-track-container">
            <div className="journey-track">
              {JOURNEY_STEPS.map((step, idx) => (
                <div key={step} className="journey-node">
                  <div className="node-marker">
                    <span className="node-num">{idx + 1}</span>
                  </div>
                  <span className="node-label">{step}</span>
                  {idx < JOURNEY_STEPS.length - 1 && <div className="node-connector" />}
                </div>
              ))}
            </div>
          </div>

          <div className="journey-clarification-card">
            <div className="clarification-icon">ℹ️</div>
            <div className="clarification-content">
              <h4>Important Program Distinction</h4>
              <p>
                Training, hands-on lab work, and project evaluations are integral, guaranteed components for every enrolled student. Internships, advanced industry deployments, hackathons, and research mentorship engagements are performance- and availability-based and subject to applicable selection procedures.
              </p>
            </div>
          </div>
        </section>

        {/* ================= INSTITUTIONAL CTA ================= */}
        <section className="programs-cta-banner">
          <div className="cta-banner-content">
            <span className="cta-eyebrow">PARTNER WITH UNISOLE</span>
            <h2 className="cta-title">Ready to Make Your Campus AI-Ready?</h2>
            <p className="cta-desc">
              Bring the 4-Pathways AI Campus Program to your college or university. Connect with our academic partnerships team for a customized implementation plan and syllabus walkthrough.
            </p>
            <div className="cta-buttons-row">
              <button
                type="button"
                className="cta-primary-btn"
                onClick={() => navigate('/query', { state: { expertise: 'Campus AI Program Implementation' } })}
              >
                <span>Partner Your College</span>
                {arrowSvg}
              </button>
              <button
                type="button"
                className="cta-secondary-btn"
                onClick={handleSubscriptionClick}
              >
                <span>Explore Institutional Pricing</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
