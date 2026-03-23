import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import PendingEvents from './PendingEvents';
import DepartmentView from './DepartmentView';
import AdminMessages from './AdminMessages';
import AdminNotifications from './AdminNotifications'; // [NEW]
import SliderManagement from './SliderManagement';      // [NEW]
import useFetch from '../../utils/useFetch';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import '../../styles/dashboard.css';

const AdminOverview = () => {
  const { data: stats, loading } = useFetch(() => axiosInstance.get('/api/analytics').then(res => res.data));

  if (loading) return <Loader />;

  return (
    <div className="dashboard-content">
      <h2 className="dash-title">Admin Overview</h2>
      
      <div className="stats-grid">
        <div className="card stat-card">
          <span className="stat-icon">📅</span>
          <div className="stat-info">
            <p>Total Events</p>
            <h3>{stats?.totalEvents || 0}</h3>
          </div>
        </div>
        <div className="card stat-card">
          <span className="stat-icon">👥</span>
          <div className="stat-info">
            <p>Total Participants</p>
            <h3>{stats?.totalParticipants || 0}</h3>
          </div>
        </div>
        <div className="card stat-card">
          <span className="stat-icon">⏳</span>
          <div className="stat-info">
            <p>Pending Approvals</p>
            <h3>{stats?.pendingApprovals || 0}</h3>
          </div>
        </div>
      </div>

      <div className="analytics-section container-fluid">
        <h3>Department Participation</h3>
        <div className="bar-chart-container card">
          {stats?.deptStats?.map(dept => (
            <div key={dept.name} className="chart-item">
              <span className="dept-name">{dept.name}</span>
              <div className="bar-wrapper">
                <div 
                  className="bar" 
                  style={{ width: `${(dept.count / (stats.maxCount || 1)) * 100}%` }}
                >
                  <span className="bar-count">{dept.count}</span>
                </div>
              </div>
            </div>
          ))}
          {!stats?.deptStats?.length && <p>No data available for charting.</p>}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="pending" element={<PendingEvents />} />
          <Route path="departments" element={<DepartmentView />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="sliders" element={<SliderManagement />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
