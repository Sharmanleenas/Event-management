import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import useFetch from '../../utils/useFetch';
import staffApi from '../../api/staffApi';
import Loader from '../../components/Loader';
import EventCard from '../../components/staff/EventCard';
import EventWorkspace from './EventWorkspace';
import StaffEvents from './StaffEvents';
import StaffNotifications from './StaffNotifications';
import { useAuth } from '../../context/AuthContext';
import '../../styles/dashboard.css';
import '../../styles/staff-dashboard.css';

/* ---- Helpers ---- */
const formatDate = () =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

/* ---- StaffOverview ---- */
const StaffOverview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: stats, loading: statsLoading } = useFetch(() => staffApi.getDashboardStats());
  const { data: events, loading: eventsLoading } = useFetch(() => staffApi.getAssignedEvents({ limit: 6 }));

  if (statsLoading || eventsLoading) return <Loader />;

  const staffName = user?.name || user?.email?.split('@')[0] || 'Staff';

  return (
    <div className="staff-overview anim-fade-in">

      {/* ── Welcome Header ── */}
      <div className="staff-welcome-header">
        <div className="swh-left">
          <p className="swh-greeting">Welcome back 👋</p>
          <h1>{staffName}</h1>
        </div>
        <div className="swh-right">
          <span className="swh-date">{formatDate()}</span>
          <span className="swh-badge">STAFF</span>
        </div>
      </div>

      {/* ── Compact Stats Strip ── */}
      <div className="staff-stats-strip">
        <div className="stat-strip-item">
          <div className="ssi-icon blue">📁</div>
          <div className="ssi-info">
            <span className="ssi-value">{stats?.assigned ?? 0}</span>
            <span className="ssi-label">Assigned Events</span>
          </div>
        </div>
        <div className="stat-strip-item">
          <div className="ssi-icon yellow">⏳</div>
          <div className="ssi-info">
            <span className="ssi-value">{stats?.pendingUploads ?? 0}</span>
            <span className="ssi-label">Pending Uploads</span>
          </div>
        </div>
        <div className="stat-strip-item">
          <div className="ssi-icon green">✅</div>
          <div className="ssi-info">
            <span className="ssi-value">{stats?.completed ?? 0}</span>
            <span className="ssi-label">Completed</span>
          </div>
        </div>
      </div>

      {/* ── Events Grid ── */}
      <div className="staff-body">
        <div className="staff-section-header">
          <h3>My Events</h3>
          <button className="staff-view-all" onClick={() => navigate('events')}>View All →</button>
        </div>

        {events?.length > 0 ? (
          <div className="staff-events-grid">
            {events.map(event => (
              <EventCard
                key={event._id}
                event={event}
                onClick={() => navigate(`workspace/${event._id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="staff-empty-state card">
            <div className="empty-illustration">📭</div>
            <h4>No Assigned Events Yet</h4>
            <p>You'll see your events here once the admin assigns them to you.</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Shell ── */
const StaffDashboard = () => (
  <div className="dashboard-layout">
    <Sidebar />
    <main className="dashboard-main" style={{ padding: 0, background: '#f6f7fb' }}>
      <Routes>
        <Route index element={<StaffOverview />} />
        <Route path="events" element={<StaffEvents />} />
        <Route path="workspace/:id" element={<EventWorkspace />} />
        <Route path="notifications" element={<StaffNotifications />} />
      </Routes>
    </main>
  </div>
);

export default StaffDashboard;

