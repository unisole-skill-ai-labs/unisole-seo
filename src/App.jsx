import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CoursesPage from './pages/CoursesPage';

import DetailedCourse from './pages/DetailedCourse';
import OrdersPage from './pages/OrdersPage';
import LectureWatch from "./pages/LectureWatch";
import EventsPage from './pages/EventsPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

export default function App() {
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
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </>
  );
}