import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import ManageGames from './ManageGames';
import VerifyPayments from './VerifyPayments';
import useFetch from '../../utils/useFetch';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import AnalyticsCards from '../../components/leader/AnalyticsCards';
import ParticipantsTable from '../../components/leader/ParticipantsTable';
import '../../styles/dashboard.css';

const LeaderOverview = () => {
  const { data: stats, loading: statsLoading } = useFetch(() => axiosInstance.get('/api/analytics/leader').then(res => res.data));
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);

  useEffect(() => {
    if (stats?.eventId) {
      setParticipantsLoading(true);
      axiosInstance.get(`/api/participants/event/${stats.eventId}`)
        .then(res => {
          setParticipants(res.data);
        })
        .catch(err => console.error("Failed to fetch participants", err))
        .finally(() => setParticipantsLoading(false));
    }
  }, [stats?.eventId]);

  if (statsLoading) return <Loader />;

  return (
    <div className="dashboard-content">
      <div className="dash-header-flex">
        <h2 className="dash-title">Leader Overview: {stats?.eventName}</h2>
      </div>
      
      {/* Analytics Cards Row */}
      <AnalyticsCards stats={stats} />

      <div className="ses-workflow-grid">
        {/* Game Slots Summary */}
        <div className="games-summary-section card">
          <div className="section-header">
            <h3>Game Slots Usage</h3>
          </div>
          <div className="bar-chart-container">
            {stats?.gameStats?.map(game => (
              <div key={game.name} className="chart-item">
                <span className="dept-name">{game.name}</span>
                <div className="bar-wrapper">
                  <div 
                    className="bar" 
                    style={{ 
                      width: `${Math.min(100, (game.filled / game.limit) * 100)}%`,
                      background: (game.filled / game.limit) > 0.9 ? 'var(--error)' : 'var(--indigo)'
                    }}
                  >
                    <span className="bar-count">{game.filled}/{game.limit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info card */}
        <div className="card stat-card" style={{ height: 'fit-content' }}>
          <span className="stat-icon">ℹ️</span>
          <div className="stat-info">
            <p>Assigned Department</p>
            <h3>{stats?.department || "General"}</h3>
            <p className="text-sm">Manage your event's registrations and game slots efficiently.</p>
          </div>
        </div>
      </div>

      {/* Main Participants Analytics Table */}
      {participantsLoading ? (
        <div className="text-center py-4">Loading participant records...</div>
      ) : (
        <ParticipantsTable participants={participants} eventName={stats?.eventName || 'Event'} />
      )}
    </div>
  );
};

const LeaderDashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <Routes>
          <Route index element={<LeaderOverview />} />
          <Route path="manage-games" element={<ManageGames />} />
          <Route path="verify-payments" element={<VerifyPayments />} />
        </Routes>
      </main>
    </div>
  );
};

export default LeaderDashboard;
