import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Actual Page Imports
import { Landing } from './pages/public/Landing';
import { Register } from './pages/public/Register';
import { Payment } from './pages/public/Payment';
import { Login } from './pages/auth/Login';
import { DashboardShell } from './components/layout/DashboardShell';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { HODDashboard } from './pages/hod/HODDashboard';
import { Leaders } from './pages/hod/Leaders';
import { EventDetails } from './pages/hod/EventDetails';
import { LeaderDashboard } from './pages/leader/LeaderDashboard';
import { Notifications } from './pages/common/Notifications';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};



function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/register/:eventId" element={<Register />} />
      <Route path="/payment/:participantId" element={<Payment />} />
      
      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Protected Dashboards */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardShell>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </DashboardShell>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/hod/*" 
        element={
          <ProtectedRoute allowedRoles={['HOD']}>
            <DashboardShell>
              <Routes>
                <Route path="dashboard" element={<HODDashboard />} />
                <Route path="leaders" element={<Leaders />} />
                <Route path="events/:id" element={<EventDetails />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </DashboardShell>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/leader/*" 
        element={
          <ProtectedRoute allowedRoles={['LEADER']}>
            <DashboardShell>
              <Routes>
                <Route path="dashboard" element={<LeaderDashboard />} />
                <Route path="events/:id" element={<EventDetails />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </DashboardShell>
          </ProtectedRoute>
        } 
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
