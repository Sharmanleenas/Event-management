import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const Sidebar = () => {
  const { role } = useAuth();

  const getLinks = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { path: '/admin', label: 'Dashboard Overview', icon: '📊' },
          { path: '/admin/pending', label: 'Pending Events', icon: '⏳' },
          { path: '/admin/departments', label: 'Departments', icon: '🏢' },
          { path: '/admin/messages', label: 'Messages', icon: '📩' },
          { path: '/admin/notifications', label: 'Notifications', icon: '🔔' },
          { path: '/admin/sliders', label: 'Slider Management', icon: '🖼️' },
        ];
      case 'HOD':
        return [
          { path: '/hod', label: 'Events Overview', icon: '📋' },
          { path: '/hod/create-event', label: 'Create Event', icon: '➕' },
          { path: '/hod/create-leader', label: 'Create Leader', icon: '👤' },
          { path: '/hod/iqac-report', label: 'IQAC Report', icon: '📄' },
        ];
      case 'LEADER':
        return [
          { path: '/leader', label: 'My Games', icon: '🎮' },
          { path: '/leader/verify-payments', label: 'Verify Payments', icon: '💰' },
          { path: '/leader/notifications', label: 'Notifications', icon: '🔔' },
        ];
      case 'STAFF':
        return [
          { path: '/staff', label: 'Dashboard', icon: '📊' },
          { path: '/staff/events', label: 'Assigned Events', icon: '📋' },
          { path: '/staff/notifications', label: 'Notifications', icon: '🔔' },
        ];
      default:
        return [];
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>{role} PORTAL</h3>
      </div>
      <nav className="sidebar-nav">
        {getLinks().map(link => (
          <NavLink 
            key={link.path} 
            to={link.path} 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            end
          >
            <span className="sidebar-icon">{link.icon}</span>
            <span className="sidebar-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>Sacred Heart College</p>
      </div>
    </aside>
  );
};

export default Sidebar;
