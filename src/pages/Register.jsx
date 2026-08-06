import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GoogleSignIn from '../components/GoogleSignIn';
import './Login.css';

export default function Register() {
  return (
    <>
      <Navbar />
      <div className="login-wrapper">
        <div className="login-container reveal-up">
          <div className="login-header">
            <h1 className="login-title word-reveal">Create Account</h1>
            <p className="login-subtitle">Sign up to get started</p>
          </div>

          <GoogleSignIn />

          <p className="signup-link reveal-up">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
        <div className="login-blob"></div>
      </div>
      <Footer />
    </>
  );
}
