import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CoursesPage from './pages/CoursesPage';

import DetailedCourse from './pages/DetailedCourse';
import OrdersPage from './pages/OrdersPage';
import LectureWatch from "./pages/LectureWatch";
import EventsPage from './pages/EventsPage';
import ProgramsPage from './pages/ProgramsPage';
import PaymentSuccess from './pages/PaymentSuccess';
import ProfilePage from './pages/ProfilePage';
import { initAuthListener } from './utils/supabase';
import './App.css';

export default function App() {
  useEffect(() => {
    initAuthListener();
  }, []);

  return (
    <>
      <ScrollToTop />
      <main>
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
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </>
  );
}