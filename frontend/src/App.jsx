import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Loader from './components/Loader';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const EventDetailsPage = lazy(() => import('./pages/EventDetailsPage'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

// Dashboards
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const HODDashboard = lazy(() => import('./pages/hod/HODDashboard'));
const LeaderDashboard = lazy(() => import('./pages/leader/LeaderDashboard'));
const StaffDashboard = lazy(() => import('./pages/staff/StaffDashboard'));

const Unauthorized = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h1>403 - Unauthorized</h1>
    <p>You do not have permission to access this page.</p>
  </div>
);

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/events/:id" element={<EventDetailsPage />} />
                <Route path="/register/:id" element={<RegistrationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                  <Route path="/admin/*" element={<AdminDashboard />} />
                </Route>

                {/* HOD Routes */}
                <Route element={<ProtectedRoute allowedRoles={['HOD']} />}>
                  <Route path="/hod/*" element={<HODDashboard />} />
                </Route>

                {/* Leader Routes */}
                <Route element={<ProtectedRoute allowedRoles={['LEADER']} />}>
                  <Route path="/leader/*" element={<LeaderDashboard />} />
                </Route>

                {/* Staff Routes */}
                <Route element={<ProtectedRoute allowedRoles={['STAFF']} />}>
                  <Route path="/staff/*" element={<StaffDashboard />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
          <ToastContainer position="top-right" autoClose={4000} />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
