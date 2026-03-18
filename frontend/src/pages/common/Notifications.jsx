import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Loader2, Bell, Check, Clock } from 'lucide-react';
import api from '../../api/axios';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/read/${id}`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-opera-indigo" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-opera-linen pb-4">
        <div>
          <h1 className="text-3xl font-serif text-opera-indigo font-bold tracking-wide">System Inbox</h1>
          <p className="text-gray-500 font-sans mt-1">Updates on event approvals, registrations, and system alerts.</p>
        </div>
        <Badge variant="info" className="mb-1">{notifications.length} Total Messages</Badge>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {notifications.length === 0 ? (
          <Card className="p-12 text-center text-gray-500 flex flex-col items-center">
            <Bell className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-serif italic text-lg">Your inbox is empty.</p>
          </Card>
        ) : (
          notifications.map(n => (
            <Card 
              key={n._id} 
              className={`p-6 transition-all border-l-4 shadow-md flex items-start space-x-4
                ${n.read ? 'border-l-gray-200 bg-white/50 opacity-80' : 'border-l-opera-burgundy bg-white font-semibold transform hover:scale-[1.01]'}`}
            >
              <div className={`p-2 rounded-full ${n.read ? 'bg-gray-100 text-gray-400' : 'bg-opera-burgundy/10 text-opera-burgundy'}`}>
                 <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`text-lg font-serif ${n.read ? 'text-gray-600' : 'text-opera-indigo font-bold'}`}>{n.title}</h3>
                  <span className="text-[10px] text-gray-400 flex items-center font-sans tracking-widest uppercase">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 mt-1 font-sans text-sm leading-relaxed">{n.message}</p>
                {!n.read && (
                  <Button variant="ghost" size="sm" className="mt-3 text-opera-brass font-bold text-xs" onClick={() => markAsRead(n._id)}>
                    <Check className="w-4 h-4 mr-1" /> Mark Read
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
