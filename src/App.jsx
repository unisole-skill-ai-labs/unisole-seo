import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

// Route Code-Splitting for Optimal Page Load Performance
const Home = lazy(() => import('./pages/Home'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const DetailedCourse = lazy(() => import('./pages/DetailedCourse'));
const ProgramsPage = lazy(() => import('./pages/ProgramsPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const LectureWatch = lazy(() => import('./pages/LectureWatch'));
const QueryPage = lazy(() => import('./pages/QueryPage'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid rgba(0, 0, 0, 0.08)',
        borderTopColor: '#0f172a',
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
    <>
      <ScrollToTop />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:slug" element={<DetailedCourse />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/learn/:courseId/:lectureId" element={<LectureWatch />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/query" element={<QueryPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}