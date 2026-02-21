import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMe } from './store/slices/authSlice';
import { fetchEvents } from './store/slices/eventsSlice';
import { fetchAdminSettings } from './store/slices/adminSlice';

import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminBookings from './pages/admin/AdminBookings';
import AdminPayments from './pages/admin/AdminPayments';
import AdminPromos from './pages/admin/AdminPromos';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector(state => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isAdmin } = useSelector(state => state.auth);
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Bootstrap: load events + settings, and restore user session from token
    dispatch(fetchEvents());
    dispatch(fetchAdminSettings());
    const token = localStorage.getItem('eventify_token');
    if (token) {
      dispatch(fetchMe());
    }
  }, [dispatch]);

  return (
    <Routes>
      {/* Public routes with Navbar + Footer */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailPage />} />
        <Route path="booking/:id" element={<BookingPage />} />
      </Route>

      {/* Auth pages (standalone — no navbar/footer) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected user dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<UserDashboardPage />} />
      </Route>

      {/* Admin panel */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="promos" element={<AdminPromos />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
