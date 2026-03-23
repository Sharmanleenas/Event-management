import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import '../../styles/dashboard.css';

const StaffNotifications = () => {
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
    <div className="staff-notifications-page anim-fade-in dashboard-content">
      <div className="dash-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="dash-title">Notifications Center</h2>
        <button className="btn-primary" onClick={markAllRead}>Mark All as Read</button>
      </div>

      <div className="notifications-list-container card glass-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '20px' }}>
        {notifications.length === 0 ? (
          <div className="empty-notif" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-light)' }}>
            <p>No new notifications at this time.</p>
          </div>
        ) : (
          notifications.map((notif, index) => (
            <div 
              key={notif._id} 
              className={`notif-full-item ${notif.read ? 'read' : 'unread'}`}
              style={{ 
                padding: '1.5rem 2rem',
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'center',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                transition: 'all 0.3s',
                background: notif.read ? 'transparent' : '#fdfaf3',
                borderLeft: notif.read ? 'none' : '5px solid var(--brass)'
              }}
            >
              <div className="notif-bullet" style={{ width: '10px', height: '10px', borderRadius: '50%', background: notif.read ? '#ccc' : 'var(--brass)', flexShrink: 0 }}></div>
              <div className="notif-content" style={{ flexGrow: 1 }}>
                <p className="notif-msg" style={{ margin: '0', fontSize: '1rem', color: 'var(--indigo)', fontWeight: '500' }}>{notif.message}</p>
                <div className="notif-meta" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  <span className="notif-time" style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{new Date(notif.createdAt).toLocaleString()}</span>
                  {!notif.read && <span className="status-pill" style={{ fontSize: '0.7rem', background: 'var(--brass)', color: 'var(--indigo)', padding: '2px 8px', borderRadius: '10px', fontWeight: '800', textTransform: 'uppercase' }}>New</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StaffNotifications;
