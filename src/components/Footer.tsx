import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ArrowUp, Send, CheckCircle2, Shield, Heart } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-zinc-950 text-zinc-300 border-t border-zinc-900 relative overflow-hidden">
      {/* Top Banner / Inquiry Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 border-b border-zinc-900">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              <Shield className="w-3 h-3 text-zinc-400" />
              Institutional Partnerships
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Ready to setup an AI Lab at your campus?
            </h3>
            <p className="text-xs text-zinc-400 max-w-lg">
              Get in touch with our IIT & NIT mentors to evaluate academic pathways and student training modules.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex items-center gap-2 max-w-md">
            {subscribed ? (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-medium w-full justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thank you! We will reach out shortly.</span>
              </div>
            ) : (
              <div className="flex items-center w-full bg-zinc-950 border border-zinc-800 rounded-lg p-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your institutional email..."
                  required
                  className="bg-transparent text-xs text-white px-3 py-1.5 outline-none w-full placeholder:text-zinc-500"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-white hover:bg-zinc-100 text-zinc-900 font-semibold text-xs transition-all flex-shrink-0 cursor-pointer"
                >
                  <span>Connect</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Navigation Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
        
        {/* Col 1: Brand & Bio */}
        <div className="col-span-2 md:col-span-1 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-white text-zinc-950 flex items-center justify-center font-bold text-xs">
              U
            </div>
            <span className="font-bold text-sm text-white tracking-tight">
              Unisole <span className="text-zinc-400 font-normal">AI Labs</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Building sustainable AI ecosystems, state-of-the-art laboratory setups, and rigorous engineering pathways for institutions across India.
          </p>
        </div>

        {/* Col 2: Pathways */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Pathways</h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li><Link to="/programs" className="hover:text-white transition-colors">ML Engineering & MLOps</Link></li>
            <li><Link to="/programs" className="hover:text-white transition-colors">AI-Powered Full Stack</Link></li>
            <li><Link to="/programs" className="hover:text-white transition-colors">Scientific Machine Learning</Link></li>
            <li><Link to="/programs" className="hover:text-white transition-colors">AI Business & Incubation</Link></li>
          </ul>
        </div>

        {/* Col 3: Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Platform</h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li><Link to="/programs" className="hover:text-white transition-colors">Programs Catalog</Link></li>
            <li><Link to="/events" className="hover:text-white transition-colors">Meetups & Events</Link></li>
            <li><Link to="/blogs" className="hover:text-white transition-colors">AI Research Blogs</Link></li>
            <li><Link to="/playground" className="hover:text-white transition-colors">AI Sandbox & Telemetry</Link></li>
          </ul>
        </div>

        {/* Col 4: Contact & Social */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Contact</h4>
          <div className="flex flex-col gap-2 text-xs text-zinc-400">
            <a href="mailto:unisole.empower@gmail.com" className="hover:text-white transition-colors flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
              <span className="truncate">unisole.empower@gmail.com</span>
            </a>
            <a href="tel:+918219691201" className="hover:text-white transition-colors flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
              <span>+91 8219691201</span>
            </a>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <a 
              href="https://www.instagram.com/unisole_empower?igsh=MTQ3d2F3bTR4ZW5oZQ==" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-7 h-7 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all"
              aria-label="Instagram"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=61553977302008&mibextid=ZbWKwL" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-7 h-7 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all"
              aria-label="Facebook"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a 
              href="https://www.linkedin.com/company/unisole-empower/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-7 h-7 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all"
              aria-label="LinkedIn"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>

      </div>

      {/* Copyright Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <div>
          © 2026 Unisole Skill AI Labs Private Limited. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <Link to="/" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          <button
            onClick={scrollToTop}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </footer>
  );
}

