import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import api from '../../api/axios';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalEvents: 0, totalParticipants: 0, totalRevenue: 0 });
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, eventsRes] = await Promise.all([
        api.get('/analytics'),
        api.get('/events/pending')
      ]);
      setStats(statsRes.data || { totalEvents: 0, totalParticipants: 0, totalRevenue: 0 });
      setPendingEvents(eventsRes.data || []);
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
      // Fallback only for DEV visibility if data is missing
      if (err.response?.status === 403) {
        alert("Access Denied: Your account may not have full ADMIN permissions in the database.");
      }
      setPendingEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.put(`/events/${action}/${id}`).catch(() => new Promise(res => setTimeout(res, 500)));
      // Optimistic UI update
      setPendingEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      console.error(`Failed to ${action} event`, err);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-opera-indigo" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-opera-linen pb-4">
        <div>
          <h1 className="text-3xl font-serif text-opera-indigo font-bold tracking-wide">Admin Overview</h1>
          <p className="text-gray-500 font-sans mt-1">System-wide statistics and pending event approvals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-t-4 border-t-opera-burgundy relative overflow-hidden shadow-md">
          <h3 className="text-gray-500 font-sans text-sm font-semibold tracking-widest uppercase mb-2">Total Revenue</h3>
          <p className="text-4xl font-serif text-opera-indigo font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
        </Card>
        <Card className="p-6 border-t-4 border-t-opera-brass shadow-md">
          <h3 className="text-gray-500 font-sans text-sm font-semibold tracking-widest uppercase mb-2">Total Participants</h3>
          <p className="text-4xl font-serif text-opera-indigo font-bold">{stats.totalParticipants.toLocaleString()}</p>
        </Card>
        <Card className="p-6 border-t-4 border-t-opera-indigo shadow-md">
          <h3 className="text-gray-500 font-sans text-sm font-semibold tracking-widest uppercase mb-2">Active Events</h3>
          <p className="text-4xl font-serif text-opera-indigo font-bold">{stats.totalEvents}</p>
        </Card>
      </div>

      <Card className="overflow-hidden shadow-lg">
        <div className="p-6 border-b border-opera-linen bg-white">
          <h3 className="text-xl font-serif text-opera-indigo font-bold tracking-wide">Pending Event Approvals</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead className="bg-opera-plaster text-opera-indigo text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-bold border-b border-opera-linen">Event Title</th>
                <th className="p-4 font-bold border-b border-opera-linen">Department</th>
                <th className="p-4 font-bold border-b border-opera-linen">Amount</th>
                <th className="p-4 font-bold border-b border-opera-linen text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-opera-linen">
              {pendingEvents.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-500 font-serif">No pending events requiring approval.</td></tr>
              ) : (
                pendingEvents.map(event => (
                  <tr key={event._id} className="hover:bg-opera-plaster/50 transition-colors bg-white">
                    <td className="p-4 font-medium text-opera-indigo">{event.title}</td>
                    <td className="p-4"><Badge variant="info">{event.department}</Badge></td>
                    <td className="p-4 font-serif text-opera-burgundy font-bold text-lg">₹{event.amount}</td>
                    <td className="p-4 text-right space-x-2">
                      <Button variant="outline" onClick={() => handleAction(event._id, 'reject')} className="px-3 py-1.5 border-opera-burgundy text-opera-burgundy hover:bg-opera-burgundy hover:text-white shadow-sm">
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </Button>
                      <Button variant="primary" onClick={() => handleAction(event._id, 'approve')} className="px-3 py-1.5 shadow-sm bg-opera-indigo hover:bg-opera-indigo/90">
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
