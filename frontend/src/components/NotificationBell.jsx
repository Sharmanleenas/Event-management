import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import '../styles/components.css';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isPopping, setIsPopping] = useState(false);
  const prevCount = useRef(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('/api/notifications');
        const unread = response.data.filter(n => !n.read).length;
        
        if (unread > prevCount.current) {
          setIsPopping(true);
          setTimeout(() => setIsPopping(false), 2000);
        }
        
        prevCount.current = unread;
        setUnreadCount(unread);
        setNotifications(response.data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => setShowDropdown(!showDropdown);

  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(`/api/notifications/read/${id}`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  return (
    <div className={`notification-bell-container ${isPopping ? 'pop-anim' : ''}`}>
      <div className="bell-icon" onClick={handleToggle}>
        <span className="bell-emoji">🔔</span>
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
      </div>
      
      {showDropdown && (
        <div className="notification-dropdown card">
          <h4>Notifications</h4>
          <div className="notification-list">
            {notifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              notifications.slice(0, 5).map(n => (
                <div 
                  key={n._id} 
                  className={`notification-item ${n.read ? 'read' : 'unread'}`}
                  onClick={() => markAsRead(n._id)}
                >
                  <p>{n.message}</p>
                  <span className="notification-time">{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
          <Link to="/notifications" className="view-all-link" onClick={() => setShowDropdown(false)}>
            View All Notifications →
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
