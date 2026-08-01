import { Link } from 'react-router-dom';
import './Footer.css';

const QUERY_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe3H0Yv2hwFvFGppiOwZ_dt9zUNI2hk52Z0gaU0J0VFoAB81Q/viewform?usp=dialog';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <p className="footer-tagline">
          Building projects that <span className="footer-highlight">solve real problems.</span>
        </p>
      </div>

      <div className="footer-grid">
        <div className="footer-col">
          <h4>Our Services</h4>
          <a href={QUERY_FORM_URL} target="_blank" rel="noopener noreferrer">AI Education Programs</a>
          <a href={QUERY_FORM_URL} target="_blank" rel="noopener noreferrer">Teacher Training</a>
          <a href={QUERY_FORM_URL} target="_blank" rel="noopener noreferrer">University Programs</a>
          <a href={QUERY_FORM_URL} target="_blank" rel="noopener noreferrer">Research & Innovation</a>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/courses">Courses</Link>
          <Link to="/events">Events</Link>
          <a href={QUERY_FORM_URL} target="_blank" rel="noopener noreferrer">Get in Touch</a>
        </div>

        <div className="footer-col">
          <h4>Connect</h4>
          <a href="https://www.instagram.com/unisole_empower?igsh=MTQ3d2F3bTR4ZW5oZQ==">Instagram</a>
          <a href="https://www.facebook.com/profile.php?id=61553977302008&mibextid=ZbWKwL">Facebook</a>
          <a href="https://www.linkedin.com/company/unisole-empower/">LinkedIn</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Unisole Skill AI Labs. All rights reserved.</span>
        <div className="footer-legal">
          <Link to="/">Privacy</Link>
          <Link to="/">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
