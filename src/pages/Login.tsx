import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileOtpAuth from '../components/MobileOtpAuth';
import { Shield, Sparkles, CheckCircle2, Terminal } from 'lucide-react';

export default function Login() {
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-950">
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-28 pb-16 px-4">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 rounded-3xl shadow-xl overflow-hidden min-h-[580px]">
          
          {/* Left panel: Premium features preview */}
          <div className="md:col-span-6 bg-slate-900 dark:bg-slate-950 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Background blur */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-slate-800 rounded-full blur-3xl opacity-30 pointer-events-none" />
            
            <div className="space-y-8 relative z-10">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-slate-300 border border-white/10 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  Unisole AI Member Access
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-4 leading-tight">
                  Welcome back to Unisole AI Labs
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
                  Sign in to resume testing open-source model weights, reading technical guides, or checking system diagnostic logs.
                </p>
              </div>

              {/* Benefits checklist */}
              <div className="space-y-4">
                {[
                  { title: "AI Sandbox & Telemetry", desc: "Test open-source model weights (Llama-3, Mistral) in a live sandbox." },
                  { title: "Technical Blogs & Archives", desc: "Read in-depth guides on RAG setup, Docker deployment, and MLOps telemetry." },
                  { title: "Academic Pathways", desc: "Access certificates and syllabus paths for digital capability building." }
                ].map((b, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">{b.title}</h4>
                      <p className="text-slate-400 text-[11px] sm:text-xs mt-1 leading-normal">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Glowing System Stats Footer */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono relative z-10">
              <span className="flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5" />
                sys_status: ready
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Secure Gateway
              </span>
            </div>
          </div>

          {/* Right panel: Login form wrapper */}
          <div className="md:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-slate-900">
            <div className="max-w-md w-full mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Welcome back
                </h1>
                <p className="text-xs text-slate-500 mt-2">
                  {redirect 
                    ? 'You must sign in or log in to access this protected area.' 
                    : 'Sign in with your mobile number below.'
                  }
                </p>
              </div>

              {/* Form Input Wrapper */}
              <div>
                <MobileOtpAuth />
              </div>

              {/* Redirection Links */}
              <div className="text-center text-xs text-slate-500 mt-6 pt-4 border-t border-slate-150 dark:border-slate-800">
                Don't have an account?{' '}
                <Link 
                  to={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} 
                  className="text-slate-900 dark:text-white font-bold hover:underline"
                >
                  Create one
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
