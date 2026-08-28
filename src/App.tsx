import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import AuthGuard from './components/AuthGuard';
import { AuthModalProvider } from './context/AuthModalContext';
import AuthModal from './components/AuthModal';
import './App.css';

// Route Code-Splitting for Optimal Page Load Performance
const Home = lazy(() => import('./pages/Home'));
const ProgramsPage = lazy(() => import('./pages/ProgramsPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const BlogsPage = lazy(() => import('./pages/BlogsPage'));
const AiPlaygroundPage = lazy(() => import('./pages/AiPlaygroundPage'));
const LiveAudiencePage = lazy(() => import('./pages/live/LiveAudiencePage'));
const JoinSessionPage = lazy(() => import('./pages/live/JoinSessionPage'));

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid rgba(0, 0, 0, 0.08)',
        borderTopColor: '#18181b',
        borderRadius: '50%',
        animation: 'pageSpin 0.7s linear infinite'
      }} />
      <style>{`
        @keyframes pageSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <AuthModalProvider>
      <ScrollToTop />
      <AuthModal />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/live/:sessionCode" element={<LiveAudiencePage />} />
            <Route path="/join" element={<JoinSessionPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/blogs" element={
              <AuthGuard>
                <BlogsPage />
              </AuthGuard>
            } />
            <Route path="/playground" element={
              <AuthGuard>
                <AiPlaygroundPage />
              </AuthGuard>
            } />
            <Route path="/query" element={<Navigate to="/programs" replace />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/thank-you" element={<PaymentSuccess />} />
            <Route path="/order-success" element={<PaymentSuccess />} />
            <Route path="/profile" element={
              <AuthGuard>
                <ProfilePage />
              </AuthGuard>
            } />
            <Route path="/courses" element={<Navigate to="/programs" replace />} />
            <Route path="/courses/*" element={<Navigate to="/programs" replace />} />
          </Routes>
        </Suspense>
      </main>
    </AuthModalProvider>
  );
}