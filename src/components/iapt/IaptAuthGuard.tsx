import { useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

interface IaptAuthGuardProps {
  children: ReactNode;
}

export default function IaptAuthGuard({ children }: IaptAuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const authed = isAuthenticated();

  useEffect(() => {
    if (!isAuthenticated()) {
      const currentPath = location.pathname + location.search;
      navigate(`/iapt/login?redirect=${encodeURIComponent(currentPath)}`, { replace: true });
    }
  }, [navigate, location]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-400">Verifying IAPT Academic Access...</p>
      </div>
    );
  }

  return <>{children}</>;
}
