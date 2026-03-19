import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import '../../styles/dashboard.css';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await axiosInstance.get('/api/notifications');
      setNotifications(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load notifications");
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await axiosInstance.put('/api/notifications/mark-all-read');
      fetchNotifications();
      toast.success("All marked as read");
    } catch (error) {
      toast.error("Failed to update notifications");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-notifications-page anim-fade-in">
      <div className="dash-header-flex">
        <h2 className="dash-title">Notifications Center</h2>
        <button className="btn-primary" onClick={markAllRead}>Mark All as Read</button>
      </div>

      <div className="notifications-list-container card glass-card">
        {notifications.length === 0 ? (
          <div className="empty-notif">
            <p>No system alerts at this time.</p>
          </div>
        ) : (
          notifications.map((notif, index) => (
            <div 
              key={notif._id} 
              className={`notif-full-item ${notif.read ? 'read' : 'unread'}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="notif-bullet"></div>
              <div className="notif-content">
                <p className="notif-msg">{notif.message}</p>
                <div className="notif-meta">
                  <span className="notif-time">{new Date(notif.createdAt).toLocaleString()}</span>
                  {!notif.read && <span className="status-pill">New</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .notifications-list-container { padding: 0 !important; overflow: hidden; border-radius: 20px !important; }
        .notif-full-item {
          padding: 1.5rem 2rem;
          display: flex;
          gap: 1.5rem;
          align-items: center;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          transition: all 0.3s;
          animation: slideRight 0.4s ease both;
        }

        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .notif-full-item:hover { background: rgba(212, 175, 55, 0.05); }
        .notif-full-item.unread { background: #fdfaf3; border-left: 5px solid var(--brass); }
        .notif-bullet { width: 10px; height: 10px; border-radius: 50%; background: var(--brass); flex-shrink: 0; }
        .notif-full-item.read .notif-bullet { background: #ccc; }
        
        .notif-content { flex-grow: 1; }
        .notif-msg { margin: 0; font-size: 1rem; color: var(--indigo); font-weight: 500; }
        .notif-meta { display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem; }
        .notif-time { font-size: 0.8rem; color: var(--text-light); }
        .status-pill { font-size: 0.7rem; background: var(--brass); color: var(--indigo); padding: 2px 8px; border-radius: 10px; font-weight: 800; text-transform: uppercase; }

        .empty-notif { padding: 4rem; text-align: center; color: var(--text-light); }
      `}</style>
    </div>
  );
};

export default AdminNotifications;
