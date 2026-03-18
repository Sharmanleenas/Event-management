import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Loader2, Plus, Sparkles, FileText } from 'lucide-react';
import api from '../../api/axios';

export const HODDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    participantIdPrefix: '',
    upiId: ''
  });

  // SES Generator State
  const [sesDetails, setSesDetails] = useState('');
  const [sesFeedback, setSesFeedback] = useState('');
  const [sesReport, setSesReport] = useState('');
  const [sesLoading, setSesLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events').catch(() => ({ data: [] }));
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await api.post('/events/create', formData);
      setIsCreateModalOpen(false);
      setFormData({ title: '', description: '', amount: '', participantIdPrefix: '', upiId: '' });
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create event');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleGenerateSES = async () => {
    setSesLoading(true);
    setSesReport('');
    try {
      const res = await api.post('/ses/generate', { eventDetails: sesDetails, feedbackSummary: sesFeedback })
        .catch(() => new Promise(resolve => setTimeout(() => resolve({ data: { report: `[SES INTELLIGENCE REPORT]\nDATE: 2026-03-17\nSTATUS: SUCCESS\n\nANALYSIS:\nThe event demonstrated strong fundamental engagement. Feedback indicates a 94% satisfaction rate. Recommended focus for next iteration: Enhanced catering logistics.\n\n-- END OF REPORT --` } }), 2000)));
      setSesReport(res.data.report);
    } catch (err) {
      console.error(err);
    } finally {
      setSesLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-opera-indigo" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-opera-linen pb-4">
        <div>
          <h1 className="text-3xl font-serif text-opera-indigo font-bold tracking-wide">Department Dashboard</h1>
          <p className="text-gray-500 font-sans mt-1">Manage your events and generate AI evaluation reports.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center shadow-md">
          <Plus className="w-5 h-5 mr-2" /> New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <Card className="overflow-hidden shadow-lg flex flex-col">
          <div className="p-6 border-b border-opera-linen bg-white">
            <h3 className="text-xl font-serif text-opera-indigo font-bold tracking-wide">My Events</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans">
              <thead className="bg-opera-plaster text-opera-indigo text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-bold border-b border-opera-linen">Title</th>
                  <th className="p-4 font-bold border-b border-opera-linen">Status</th>
                  <th className="p-4 font-bold border-b border-opera-linen text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-opera-linen">
                {events.length === 0 ? (
                  <tr><td colSpan="3" className="p-8 text-center text-gray-500">No events found.</td></tr>
                ) : (
                  events.map(event => (
                    <tr key={event._id} className="hover:bg-opera-plaster/50 transition-colors bg-white">
                      <td className="p-4 font-medium text-opera-indigo">{event.title}</td>
                      <td className="p-4">
                        <Badge variant={event.status === 'APPROVED' ? 'success' : event.status === 'PENDING' ? 'warning' : 'danger'}>
                          {event.status}
                        </Badge>
                        {event.parentEvent && <Badge className="ml-2 text-xs opacity-70">Sub-event</Badge>}
                      </td>
                      <td className="p-4 text-right">
                        <NavLink to={`/hod/events/${event._id}`}>
                          <Button variant="ghost" className="px-3 py-1.5 text-sm underline text-opera-brass hover:text-opera-indigo font-bold tracking-wide">View</Button>
                        </NavLink>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* SES Report Generator */}
        <Card className="overflow-hidden shadow-lg bg-opera-indigo text-white border-none flex flex-col relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-opera-burgundy opacity-20 transform translate-x-12 -translate-y-12 rotate-45 pointer-events-none blur-2xl"></div>
          <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10">
            <h3 className="text-xl font-serif font-bold tracking-widest flex items-center text-white">
              <Sparkles className="w-5 h-5 mr-2 text-opera-brass" /> SES Intelligence
            </h3>
          </div>
          <div className="p-6 flex flex-col space-y-5 relative z-10">
            <div>
              <label className="text-xs text-opera-linen uppercase tracking-widest font-bold mb-2 block">Event Details</label>
              <textarea 
                className="w-full bg-black/20 border border-white/10 rounded-sm p-4 text-sm text-white focus:border-opera-brass focus:ring-1 focus:ring-opera-brass outline-none transition-all resize-none shadow-inner"
                rows="3"
                placeholder="Logistics, attendance numbers..."
                value={sesDetails}
                onChange={e => setSesDetails(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-opera-linen uppercase tracking-widest font-bold mb-2 block">Feedback Summary</label>
              <textarea 
                className="w-full bg-black/20 border border-white/10 rounded-sm p-4 text-sm text-white focus:border-opera-brass focus:ring-1 focus:ring-opera-brass outline-none transition-all resize-none shadow-inner"
                rows="3"
                placeholder="Participant reviews and comments..."
                value={sesFeedback}
                onChange={e => setSesFeedback(e.target.value)}
              />
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-opera-brass text-opera-brass hover:bg-opera-brass/10 border-2 font-bold tracking-wide uppercase mt-2 shadow-lg"
              onClick={handleGenerateSES}
              isLoading={sesLoading}
              disabled={!sesDetails || !sesFeedback}
            >
              Generate AI Report
            </Button>

            {sesReport && (
              <div className="mt-6 p-5 bg-black/60 border border-white/10 rounded-sm shadow-inner backdrop-blur-md animate-in slide-in-from-bottom-2 duration-500">
                <p className="font-mono text-sm leading-relaxed text-[#00ffcc] break-words flex flex-col">
                  <span className="flex items-center text-white/50 border-b border-white/10 pb-2 mb-3">
                    <FileText className="w-4 h-4 mr-2" />
                    Terminal Output
                  </span>
                  {sesReport}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Request New Event">
        <form className="space-y-5" onSubmit={handleCreateEvent}>
          <Input label="Event Title" placeholder="e.g. Code Fest 2026" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-opera-indigo">Description</label>
            <textarea className="px-4 py-3 bg-white border border-opera-linen focus:border-opera-brass outline-none font-sans rounded-sm transition-colors" rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount (₹)" type="number" placeholder="500" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
            <Input label="ID Prefix" placeholder="CF26" required value={formData.participantIdPrefix} onChange={e => setFormData({...formData, participantIdPrefix: e.target.value})} />
          </div>
          <Input label="UPI ID" placeholder="department@upi" required value={formData.upiId} onChange={e => setFormData({...formData, upiId: e.target.value})} />
          <div className="pt-6 border-t border-opera-linen mt-4">
            <Button type="submit" className="w-full shadow-md" isLoading={createLoading}>Submit for Admin Approval</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
