import { Link } from 'react-router-dom';
import { Atom, ExternalLink, ShieldCheck, Mail, Globe } from 'lucide-react';

export default function IaptFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-14 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
        {/* Brand column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Atom className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white">IAPT</span>
              <span className="text-xs font-light text-cyan-400">×</span>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                UNISOLE
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed max-w-md">
            An official Memorandum of Understanding (MoU) partnership between the{' '}
            <strong className="text-slate-200 font-semibold">Indian Association of Physics Teachers (IAPT)</strong> and{' '}
            <strong className="text-slate-200 font-semibold">Unisole</strong>, bridging scientific physics education with modern artificial intelligence, machine learning, and emerging technologies.
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified MoU Initiative
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              National Level Platform
            </span>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
            Initiatives & Programs
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/iapt" className="hover:text-blue-400 transition-colors">
                IAPT × UNISOLE Home
              </Link>
            </li>
            <li>
              <Link to="/iapt/nain" className="hover:text-blue-400 transition-colors">
                NAIN (National AI Network)
              </Link>
            </li>
            <li>
              <Link to="/iapt/workshop" className="hover:text-blue-400 transition-colors">
                7-Day National Workshop
              </Link>
            </li>
            <li>
              <a href="#vision" className="hover:text-blue-400 transition-colors">
                Our Vision & 5 Pillars
              </a>
            </li>
          </ul>
        </div>

        {/* Institutional & Support */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
            Institutional Network
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-400 transition-colors inline-flex items-center gap-1">
                Unisole Main Portal
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </Link>
            </li>
            <li>
              <Link to="/programs" className="hover:text-blue-400 transition-colors">
                Skill Labs & Programs
              </Link>
            </li>
            <li>
              <span className="text-slate-500 text-xs block pt-2">
                Inquiries & Institutional MoUs:
              </span>
              <a
                href="mailto:contact@unisole.org"
                className="text-cyan-400 hover:underline text-xs flex items-center gap-1 mt-1"
              >
                <Mail className="w-3 h-3" />
                contact@unisole.org
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 IAPT × UNISOLE Joint Initiative. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="hover:text-slate-400 transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-slate-400 transition-colors">
            Terms of Academic Access
          </Link>
        </div>
      </div>
    </footer>
  );
}
