import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../utils/supabase';
import './QueryPage.css';

export default function QueryPage() {
  const location = useLocation();
  const expertise = location.state?.expertise || '';

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setSubmitError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[+]?[\d\s()-]{7,20}$/.test(form.phone)) newErrors.phone = 'Invalid phone number';
    if (!form.message.trim()) newErrors.message = 'Please enter your query';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setSubmitError('');
    try {
      const { error } = await supabase.from('queries').insert([
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          expertise: expertise || null,
        },
      ]);
      if (error) throw new Error(error.message || 'Something went wrong. Please try again.');
      setSuccess(true);
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="query-wrapper">
        <div className="query-container reveal-up">
          {success ? (
            <div className="query-success">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="32" fill="#10b981" opacity="0.1" />
                <path d="M20 32l8 8 16-16" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h2 className="query-success-title">Query Submitted!</h2>
              <p className="query-success-desc">We'll get back to you shortly.</p>
            </div>
          ) : (
            <>
              <div className="query-header">
                <h1 className="query-title word-reveal">Get Started</h1>
                <p className="query-subtitle">
                  {expertise ? `Interested in ${expertise}?` : 'Tell us about your query'}
                </p>
              </div>

              <form className="query-form" onSubmit={handleSubmit}>
                <div className="form-group reveal-up" style={{ '--delay': '0.1s' }}>
                  <label htmlFor="name" className="form-label">Name</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="6.5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M3.5 17c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-input"
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.name && <span className="error-message show">{errors.name}</span>}
                </div>

                <div className="form-group reveal-up" style={{ '--delay': '0.15s' }}>
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2.5 4a1.5 1.5 0 0 1 1.5-1.5h12a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H4a1.5 1.5 0 0 1-1.5-1.5V4Z" stroke="currentColor" strokeWidth="1.2" />
                      <path d="m2.5 4 7.5 5 7.5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && <span className="error-message show">{errors.email}</span>}
                </div>

                <div className="form-group reveal-up" style={{ '--delay': '0.2s' }}>
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M3 4a1 1 0 0 1 1-1h2.5a1 1 0 0 1 .9.6l1.3 2.8a1 1 0 0 1-.1 1.1L7 9a10.8 10.8 0 0 0 4 4l1.6-1.6a1 1 0 0 1 1.1-.2l2.8 1.3a1 1 0 0 1 .5.9V16a1 1 0 0 1-1 1A13 13 0 0 1 3 4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="form-input"
                      placeholder="+91 234 567 890"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.phone && <span className="error-message show">{errors.phone}</span>}
                </div>

                <div className="form-group reveal-up" style={{ '--delay': '0.25s' }}>
                  <label htmlFor="message" className="form-label">Your Query</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M3 3h14v10H7l-4 4V3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <textarea
                      id="message"
                      name="message"
                      className="form-input form-textarea"
                      placeholder="Tell us what you're looking for..."
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.message && <span className="error-message show">{errors.message}</span>}
                </div>

                {submitError && (
                  <span className="error-message show" style={{ marginBottom: 12 }}>{submitError}</span>
                )}

                <button type="submit" className="btn-login reveal-up" style={{ '--delay': '0.3s' }} disabled={loading}>
                  <span className="btn-text">{loading ? 'Submitting...' : 'Submit'}</span>
                  {!loading && (
                    <svg className="btn-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M6 9h8M12 5l4 4m-4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
        <div className="query-blob"></div>
      </div>
      <Footer />
    </>
  );
}
