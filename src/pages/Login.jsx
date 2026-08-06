import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GoogleSignIn from '../components/GoogleSignIn';
import './Login.css';

export default function Login() {
  return (
    <>
      <Navbar />
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          <GoogleSignIn />

          <p className="signup-link">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
        <div className="login-blob"></div>
      </div>
      <Footer />
    </>
  );
}
