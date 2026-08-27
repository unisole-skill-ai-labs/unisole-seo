import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 dark:bg-slate-950 border-t border-slate-800/80">
      
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm sm:text-base font-semibold text-white">
          Building projects that <span className="text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">solve real problems.</span>
        </p>
      </div>

      {/* Navigation & Contact Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest">Our Services</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li className="hover:text-white transition-colors cursor-default">AI Education Programs</li>
            <li className="hover:text-white transition-colors cursor-default">Teacher Training</li>
            <li className="hover:text-white transition-colors cursor-default">University Programs</li>
            <li className="hover:text-white transition-colors cursor-default">Research & Innovation</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest">Quick Links</h4>
          <div className="flex flex-col gap-2.5 text-xs text-slate-400">
            <Link to="/programs" className="hover:text-white transition-colors">Programs</Link>
            <Link to="/events" className="hover:text-white transition-colors">Events</Link>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest">Support</h4>
          <div className="flex flex-col gap-2.5 text-xs text-slate-400">
            <a href="mailto:unisole.empower@gmail.com" className="hover:text-white transition-colors flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              unisole.empower@gmail.com
            </a>
            <a href="tel:+918219691201" className="hover:text-white transition-colors flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              +91 8219691201
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest">Connect</h4>
          <div className="flex flex-col gap-2.5 text-xs text-slate-400">
            <a href="https://www.instagram.com/unisole_empower?igsh=MTQ3d2F3bTR4ZW5oZQ==" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              Instagram
            </a>
            <a href="https://www.facebook.com/profile.php?id=61553977302008&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              Facebook
            </a>
            <a href="https://www.linkedin.com/company/unisole-empower/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </a>
          </div>
        </div>

      </div>

      {/* Copyright Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-slate-500">
        <span>© 2026 Unisole Skill AI Labs. All rights reserved.</span>
        <div className="flex gap-4">
          <Link to="/" className="hover:text-slate-455 transition-colors">Privacy Policy</Link>
          <Link to="/" className="hover:text-slate-455 transition-colors">Terms of Service</Link>
        </div>
      </div>

    </footer>
  );
}
