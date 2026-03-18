import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export const Header = () => {
  const { user, role } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock get notifications
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        const unread = (res.data || []).filter(n => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Notification fetch failed:", err);
        setUnreadCount(0);
      }
    };
    fetchNotifications();
  }, []);

  const handleNotificationsClick = () => {
    navigate(`/${role?.toLowerCase()}/notifications`);
  };

  return (
    <header className="h-20 bg-white border-b border-opera-linen px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm relative">
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-opera-linen via-opera-brass to-opera-linen"></div>
      
      <h2 className="text-2xl font-serif text-opera-indigo font-bold capitalize tracking-wide">
        Welcome, {user?.name || user?.email?.split('@')[0] || 'User'}
      </h2>
      
      <div className="flex items-center space-x-6">
        <button 
          onClick={handleNotificationsClick}
          className="relative p-2 text-opera-indigo hover:text-opera-burgundy transition-colors"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-opera-burgundy text-white text-xs font-bold font-sans flex items-center justify-center rounded-full border-2 border-white shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
