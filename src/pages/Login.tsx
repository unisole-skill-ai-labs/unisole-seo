import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileOtpAuth from '../components/MobileOtpAuth';
import { Shield, Sparkles, CheckCircle2, Terminal } from 'lucide-react';

export default function Login() {
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '';

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950">
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-24 sm:pt-32 pb-16 px-4">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 minimal-card overflow-hidden">
          
          {/* Left panel: Minimalist studio preview */}
          <div className="md:col-span-5 bg-zinc-950 text-white p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800">
            <div className="space-y-6">
              <div>
                <span className="mono-tag text-zinc-400 border-zinc-800 bg-zinc-900 block">
                  Member Portal
                </span>
                <h2 className="text-xl sm:text-2xl font-bold mt-3 leading-tight text-white">
                  Unisole AI Labs
                </h2>
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                  Sign in to access inference sandboxes, technical research guides, and institutional telemetry.
                </p>
              </div>

              {/* Benefits checklist */}
              <div className="space-y-3">
                {[
                  { title: "AI Sandbox & Telemetry", desc: "Execute model weights inside local cluster sandboxes." },
                  { title: "Technical Archives", desc: "Read research blueprints and MLOps deployment guides." },
                  { title: "Curriculum Pathways", desc: "Access accredited university curriculum modules." }
                ].map((b, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-200 leading-tight">{b.title}</h4>
                      <p className="text-zinc-500 text-[11px] mt-0.5 leading-normal">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status Footer */}
            <div className="mt-8 pt-4 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span className="flex items-center gap-1">
                <Terminal className="w-3 h-3 text-zinc-400" />
                node-04: live
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Ready
              </span>
            </div>
          </div>

          {/* Right panel: Login form wrapper */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white dark:bg-zinc-900">
            <div className="max-w-sm w-full mx-auto space-y-5">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Sign in to account
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {redirect 
                    ? 'Authentication required to view this area.' 
                    : 'Enter your verified mobile phone number.'
                  }
                </p>
              </div>

              {/* Form Input Wrapper */}
              <div>
                <MobileOtpAuth />
              </div>

              {/* Redirection Links */}
              <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                Don't have an account?{' '}
                <Link 
                  to={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} 
                  className="text-zinc-900 dark:text-white font-semibold hover:underline"
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
