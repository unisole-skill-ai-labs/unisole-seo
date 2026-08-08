import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ProgramsPage.css';

const ENROLL_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe3H0Yv2hwFvFGppiOwZ_dt9zUNI2hk52Z0gaU0J0VFoAB81Q/viewform?usp=dialog';
const SUBSCRIPTION_PAYMENT_LINK = import.meta.env.VITE_SUBSCRIPTION_PAYMENT_LINK;

const programs = [
  {
    id: 'campus-ai',
    eyebrow: 'For Colleges',
    title: 'Campus AI Program',
    tagline: 'Bring a complete AI ecosystem to your campus.',
    description:
      'UnisoleAI partners with your college to set up a dedicated AI program on campus. From curriculum support to live mentor-led sessions, we help students build real, portfolio-ready AI skills while they study.',
    points: [
      'Dedicated AI curriculum for your campus',
      'Live mentor-led sessions with industry experts',
      'Hands-on projects students can showcase',
      'Progress tracking and student assessments',
    ],
    cta: 'Enroll Your College',
  },
  {
    id: 'industrial-internship',
    eyebrow: 'Internships',
    title: 'Industrial cum Internship Opportunity Program',
    tagline: 'Give your students real industry exposure.',
    description:
      'Enroll your college as a Unisole industrial cum internship opportunity program partner. Students get internship opportunities that combine classroom learning with real-world AI projects mentored by our team.',
    points: [
      'Real industry projects and internships',
      'Mentorship from working professionals',
      'Internship certificates and work experience',
      'Pipeline to industry and research roles',
    ],
    cta: 'Enroll Your College',
  },
  {
    id: 'value-added-nep',
    eyebrow: 'NEP Compliance',
    title: 'Value Added Program Under NEP',
    tagline: 'Meet NEP requirements with industry-aligned courses.',
    description:
      'Enroll your college for a value added program under NEP. Our short, credit-based courses in AI, data science, and emerging technologies help your institution offer compliant, high-impact learning experiences.',
    points: [
      'Aligned with NEP 2020 guidelines',
      'Credit-based, industry-aligned courses',
      'Flexible duration to fit your semester',
      'Certificates recognized across institutions',
    ],
    cta: 'Enroll Your College',
  },
  {
    id: 'skill-enhancement-nep',
    eyebrow: 'NEP Compliance',
    title: 'Skill Enhancement Program Under NEP',
    tagline: 'Build employable skills alongside academics.',
    description:
      'Enroll your college for the skill enhancement program under NEP. Students gain practical, employable skills in AI and allied technologies through structured, mentor-guided learning paths.',
    points: [
      'Practical, project-first learning approach',
      'Employability-focused skill building',
      'Structured learning paths with mentors',
      'Performance-based certifications',
    ],
    cta: 'Enroll Your College',
  },
  {
    id: 'faculty-training',
    eyebrow: 'For Faculty',
    title: 'Faculty Training Program',
    tagline: 'Upskill your faculty with modern AI teaching.',
    description:
      'Enroll your college for the faculty training program. We train your faculty in AI concepts and modern teaching tools so they can confidently deliver AI education to students.',
    points: [
      'Hands-on AI training for faculty',
      'Modern teaching tools and methodologies',
      'Access to ready-to-use course material',
      'Ongoing mentorship and support',
    ],
    cta: 'Enroll Your College',
  },
  {
    id: 'ai-workshop',
    eyebrow: 'For Everyone',
    title: 'AI Workshop for Everyone',
    tagline: 'Interactive workshops open to all.',
    description:
      'Enroll your college for the AI workshop for everyone. From students to staff, anyone can join our interactive workshops that make AI approachable, fun, and immediately useful in everyday life.',
    points: [
      'Beginner-friendly, no prerequisites',
      'Live, interactive workshop sessions',
      'Learn practical everyday AI applications',
      'Open to students, staff, and faculty',
    ],
    cta: 'Enroll Your College',
  },
  {
    id: 'buy-subscription',
    eyebrow: 'For Learners',
    title: 'Buy / Subscription',
    tagline: 'Unlock full access to all courses and programs.',
    description:
      'Subscribe to UnisoleAI for unlimited access to our courses, workshops, live sessions, and learning resources. Choose a plan that fits your goals and start learning at your own pace.',
    points: [
      'Full access to all courses and content',
      'Live sessions and workshops included',
      'Progress tracking and certificates',
      'Cancel or upgrade anytime',
    ],
    cta: 'Get Subscription',
    action: 'subscription',
  },
];

const openEnrollForm = () => {
  window.open(ENROLL_FORM_URL, '_blank', 'noopener,noreferrer');
};

const openSubscriptionPayment = () => {
  window.open(SUBSCRIPTION_PAYMENT_LINK, '_blank', 'noopener,noreferrer');
};

export default function ProgramsPage() {
  return (
    <>
      <Navbar />

      <section className="programs-page">
        <div className="programs-header">
          <span className="programs-eyebrow">For Institutions &amp; Learners</span>
          <h1 className="programs-title">Our Programs</h1>
          <p className="programs-subtitle">
            Empowering colleges, faculty, and students with AI education,
            internships, and skill-building opportunities that meet NEP
            guidelines and real-world industry needs.
          </p>
        </div>

        <div className="programs-list">
          {programs.map((program, i) => (
            <section className="program-card" key={program.id} id={program.id}>
              <div className="program-card-index">{String(i + 1).padStart(2, '0')}</div>
              <div className="program-card-body">
                <span className="program-card-eyebrow">{program.eyebrow}</span>
                <h2 className="program-card-title">{program.title}</h2>
                <p className="program-card-tagline">{program.tagline}</p>
                <p className="program-card-desc">{program.description}</p>

                <ul className="program-card-points">
                  {program.points.map((point) => (
                    <li key={point}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>

                <button
                  className="program-card-btn"
                  onClick={() => (program.action === 'subscription' ? openSubscriptionPayment() : openEnrollForm())}
                >
                  {program.cta}
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M4 9h10M9 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </section>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
