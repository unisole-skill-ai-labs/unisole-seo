import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ProgramsPage.css';

const SUBSCRIPTION_PAYMENT_LINK = import.meta.env.VITE_SUBSCRIPTION_PAYMENT_LINK;

const checkSvg = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const arrowSvg = (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <path d="M4 9h10M9 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const pathways = [
  { num: '01', title: 'Industrial Training & Internship Program', target: '#industrial-internship' },
  { num: '02', title: 'Faculty AI Training Program', target: '#faculty-training' },
  { num: '03', title: 'AI Workshops for Everyone', target: '#ai-workshop' },
];

const programs = [
  {
    id: 'industrial-internship',
    eyebrow: 'Internships',
    title: 'Industrial Training cum Internship Program',
    tagline: 'Transform students from learners into industry-ready AI professionals.',
    description:
      'The UNISOLE Industrial Training cum Internship Program provides undergraduate students with structured, practical exposure to Artificial Intelligence and emerging technologies. Students learn through a combination of live instruction, recorded learning, practical assignments, projects, assessments, mentorship, and industry-oriented activities.',
    points: [
      'Real industry projects and internships',
      'Mentorship from working professionals',
      'Internship certificates and work experience',
      'Pipeline to industry and research roles',
    ],
    sections: [
      { type: 'heading', text: 'Students can learn:' },
      { type: 'checklist', items: [
        'Artificial Intelligence Fundamentals',
        'Python for Data Science',
        'Data Literacy & Analytics',
        'Machine Learning',
        'Deep Learning',
        'Computer Vision',
        'Natural Language Processing',
        'Generative AI',
        'Large Language Models',
        'AI Project Lifecycle',
        'AI Tools & Automation',
        'Research & Innovation',
      ] },
      { type: 'heading', text: 'What makes the program different?' },
      { type: 'text', text: 'Students don\u2019t simply complete a course. They progress through a structured pathway:' },
      { type: 'flow', steps: ['Training', 'Assessment', 'Projects', 'Certification', 'Talent Pool', 'Internship Opportunities'] },
      { type: 'text', text: 'High-performing students may also receive opportunities to work as AI tutors, project associates, researchers, or interns based on their performance and available opportunities.' },
      { type: 'heading', text: 'Student Outcomes' },
      { type: 'text', text: 'Every participant is encouraged to develop:' },
      { type: 'checklist', items: [
        'Practical AI skills',
        'Individual & team projects',
        'Capstone project',
        'GitHub portfolio',
        'Resume',
        'Professional profile',
        'Technical presentation skills',
        'Industry exposure',
      ] },
      { type: 'heading', text: 'Who can participate?' },
      { type: 'text', text: 'The program is open to students from all academic disciplines and any year of undergraduate study, subject to the specific requirements of the program.' },
      { type: 'callout', heading: 'For Colleges', text: 'Partner colleges can provide students with a structured pathway from classroom learning → practical skills → projects → internship → career opportunities.' },
    ],
    cta: 'Enroll Your College',
    action: 'subscription',
  },
  {
    id: 'faculty-training',
    eyebrow: 'For Faculty',
    title: 'Faculty AI Training Program',
    tagline: 'Make your faculty AI-ready.',
    description:
      'An AI-ready college requires AI-ready educators. The UNISOLE Faculty Training Program is designed to help teachers and faculty members understand Artificial Intelligence and confidently integrate appropriate AI tools and practices into teaching, research, and academic workflows.',
    points: [
      'Hands-on AI training for faculty',
      'Modern teaching tools and methodologies',
      'Access to ready-to-use course material',
      'Ongoing mentorship and support',
    ],
    sections: [
      { type: 'heading', text: 'AI Literacy — Understanding' },
      { type: 'checklist', items: [
        'Artificial Intelligence',
        'Machine Learning',
        'Generative AI',
        'Large Language Models',
        'AI Applications',
      ] },
      { type: 'heading', text: 'Generative AI & Prompt Engineering' },
      { type: 'text', text: 'Faculty learn how to use AI systems effectively for:' },
      { type: 'checklist', items: [
        'Content generation',
        'Lesson preparation',
        'Academic planning',
        'Summarization',
        'Research assistance',
        'Question generation',
        'Productivity',
      ] },
      { type: 'heading', text: 'AI in Teaching & Learning' },
      { type: 'text', text: 'Practical applications include:' },
      { type: 'checklist', items: [
        'AI-assisted lesson planning',
        'Classroom activities',
        'Personalized learning',
        'Assessment support',
        'Educational content creation',
      ] },
      { type: 'heading', text: 'AI for Research' },
      { type: 'text', text: 'Faculty can explore AI tools for:' },
      { type: 'checklist', items: [
        'Literature exploration',
        'Data analysis',
        'Research workflows',
        'Scientific writing support',
        'Research ideation',
      ] },
      { type: 'heading', text: 'Responsible AI' },
      { type: 'text', text: 'Training also addresses:' },
      { type: 'checklist', items: [
        'Academic integrity',
        'Responsible AI usage',
        'Bias',
        'Data privacy',
        'Ethical use of AI',
      ] },
      { type: 'heading', text: 'Continuous Faculty Development' },
      { type: 'text', text: 'Colleges can conduct these programs as Faculty Development Programs, short-term training, workshops, refresher sessions, or advanced AI sessions.' },
    ],
    cta: 'Train Your Faculty',
  },
  {
    id: 'ai-workshop',
    eyebrow: 'For Everyone',
    title: 'AI Workshop for Everyone',
    tagline: 'Start your college\u2019s AI journey in a single workshop.',
    description:
      'For institutions that want to introduce Artificial Intelligence before committing to a long-term program, UNISOLE offers AI awareness and hands-on workshops for students, faculty, and staff. These workshops are designed to make AI understandable and practical for participants regardless of their technical background.',
    points: [
      'Beginner-friendly, no prerequisites',
      'Live, interactive workshop sessions',
      'Learn practical everyday AI applications',
      'Open to students, staff, and faculty',
    ],
    sections: [
      { type: 'heading', text: 'Workshop Themes' },
      { type: 'checklist', items: [
        'Introduction to Artificial Intelligence',
        'Generative AI',
        'ChatGPT & AI Assistants',
        'Prompt Engineering',
        'AI Tools for Students',
        'AI for Teachers',
        'AI for Research',
        'AI & Career Opportunities',
        'AI Ethics & Responsible AI',
        'AI in Different Industries',
      ] },
      { type: 'heading', text: 'Workshop Formats' },
      { type: 'formats', items: [
        { name: 'Awareness Session', desc: 'Understand what AI is and how it is changing the world.' },
        { name: 'Hands-on Workshop', desc: 'Participants actively use AI tools and solve practical problems.' },
        { name: 'Technical Workshop', desc: 'For students interested in coding, Machine Learning, Data Science, and AI development.' },
        { name: 'Career Workshop', desc: 'Explore AI careers, skills, internships, research, and future opportunities.' },
      ] },
      { type: 'heading', text: 'Who Can Attend?' },
      { type: 'text', text: 'Students, faculty, researchers, administrative staff, and college leadership. No prior AI knowledge is required for introductory workshops.' },
    ],
    cta: 'Request an AI Workshop',
  },
];

const openSubscriptionPayment = () => {
  window.open(SUBSCRIPTION_PAYMENT_LINK, '_blank', 'noopener,noreferrer');
};

function ProgramSection({ section }) {
  switch (section.type) {
    case 'text':
      return <p className="program-section-text">{section.text}</p>;
    case 'heading':
      return <h3 className="program-section-heading">{section.text}</h3>;
    case 'checklist':
      return (
        <ul className="program-section-checklist">
          {section.items.map((item) => (
            <li key={item}>
              {checkSvg}
              {item}
            </li>
          ))}
        </ul>
      );
    case 'flow':
      return (
        <div className="program-section-flow">
          {section.steps.map((step, i) => (
            <div className="program-flow-step" key={step}>
              <span className="program-flow-dot">{i + 1}</span>
              <span className="program-flow-label">{step}</span>
              {i < section.steps.length - 1 && <span className="program-flow-arrow">→</span>}
            </div>
          ))}
        </div>
      );
    case 'domains':
      return (
        <div className="program-section-domains">
          {section.items.map((item) => (
            <div className="program-domain" key={item.subject}>
              <span className="program-domain-subject">{item.subject}</span>
              <span className="program-domain-arrow">→</span>
              <span className="program-domain-example">{item.example}</span>
            </div>
          ))}
        </div>
      );
    case 'formats':
      return (
        <div className="program-section-formats">
          {section.items.map((item) => (
            <div className="program-format" key={item.name}>
              <span className="program-format-name">{item.name}</span>
              <span className="program-format-desc">{item.desc}</span>
            </div>
          ))}
        </div>
      );
    case 'callout':
      return (
        <div className="program-section-callout">
          <h4 className="program-callout-heading">{section.heading}</h4>
          <p className="program-callout-text">{section.text}</p>
        </div>
      );
    default:
      return null;
  }
}

export default function ProgramsPage() {
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  const toggle = (id) => {
    setExpanded((current) => (current === id ? null : id));
  };

  const handleProgramCta = (program) => {
    if (program.action === 'subscription') {
      openSubscriptionPayment();
    } else {
      navigate('/query', { state: { expertise: program.title } });
    }
  };

  return (
    <>
      <Navbar />

      <section className="programs-page">
        <div className="programs-header">
          <span className="programs-eyebrow">🎓 Campus AI Program for Colleges</span>
          <h1 className="programs-title">
            Building AI-Ready Colleges Through Education, Skills, Faculty
            Development &amp; Industry Exposure
          </h1>
          <p className="programs-subtitle">
            The UNISOLE Campus AI Program is a structured institutional
            initiative designed to help colleges build a sustainable Artificial
            Intelligence ecosystem.
          </p>
          <p className="programs-subtitle">
            Instead of limiting AI education to a short workshop, UNISOLE works
            with colleges across multiple dimensions — student training,
            internships, skill programs, faculty development,
            research, innovation, and AI awareness.
          </p>
          <p className="programs-subtitle">
            Colleges can choose individual programs or implement the complete
            Campus AI Ecosystem according to their academic requirements.
          </p>

          <div className="program-pathways">
            <h3 className="program-section-heading">Our Campus AI Pathways</h3>
            {pathways.map((p) => (
              <a className="program-pathway-link" href={p.target} key={p.target}>
                <span className="program-pathway-num">{p.num}</span>
                <span className="program-pathway-title">{p.title}</span>
                {arrowSvg}
              </a>
            ))}
          </div>
        </div>

        <div className="programs-list">
          {programs.map((program, i) => {
            const isOpen = expanded === program.id;
            return (
              <section className={`program-card ${isOpen ? 'program-card--open' : ''}`} key={program.id} id={program.id}>
                <button
                  className="program-card-header"
                  onClick={() => toggle(program.id)}
                  aria-expanded={isOpen}
                >
                  <span className="program-card-index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="program-card-body">
                    <span className="program-card-eyebrow">{program.eyebrow}</span>
                    <span className="program-card-title">{program.title}</span>
                    <span className="program-card-tagline">{program.tagline}</span>
                    <span className="program-card-desc">{program.description}</span>
                  </span>
                  <span className={`program-card-chevron ${isOpen ? 'open' : ''}`}>
                    {arrowSvg}
                  </span>
                </button>

                <div className={`program-card-details ${isOpen ? 'open' : ''}`}>
                  <div className="program-card-details-inner">
                    <div className="program-card-details-content">
                      <ul className="program-card-points">
                        {program.points.map((point) => (
                          <li key={point}>
                            {checkSvg}
                            {point}
                          </li>
                        ))}
                      </ul>

                      {program.sections && (
                        <div className="program-sections">
                          {program.sections.map((section, j) => (
                            <ProgramSection section={section} key={j} />
                          ))}
                        </div>
                      )}

                      <button
                        className="program-card-btn"
                        onClick={() => handleProgramCta(program)}
                      >
                        {program.cta}
                        {arrowSvg}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <Footer />
    </>
  );
}
