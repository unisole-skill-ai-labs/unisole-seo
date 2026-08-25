import { Link } from 'react-router-dom';
import './Footer.css';

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
          <span>AI Education Programs</span>
          <span>Teacher Training</span>
          <span>University Programs</span>
          <span>Research & Innovation</span>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/programs">Programs</Link>
          <Link to="/events">Events</Link>
          <Link to="/query">Get in Touch</Link>
        </div>

        <div className="footer-col">
          <h4>Connect</h4>
          <a href="https://www.instagram.com/unisole_empower?igsh=MTQ3d2F3bTR4ZW5oZQ==">Instagram</a>
          <a href="https://www.facebook.com/profile.php?id=61553977302008&mibextid=ZbWKwL">Facebook</a>
          <a href="https://www.linkedin.com/company/unisole-empower/">LinkedIn</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 UnisoleAI. All rights reserved.</span>
        <div className="footer-legal">
          <Link to="/">Privacy</Link>
          <Link to="/">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
