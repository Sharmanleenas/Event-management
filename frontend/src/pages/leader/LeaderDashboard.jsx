import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Loader2, CheckCircle, XCircle, Search, Calendar, Plus, List } from 'lucide-react';
import api from '../../api/axios';

export const LeaderDashboard = () => {
  const [participants, setParticipants] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [parentEventId, setParentEventId] = useState(null);
  const [subEventData, setSubEventData] = useState({
    title: '', description: '', amount: '', participantIdPrefix: '', upiId: ''
  });

  useEffect(() => {
    Promise.all([fetchParticipants(), fetchEvents()]).finally(() => setLoading(false));
  }, []);

  const fetchParticipants = async () => {
    try {
      const res = await api.get('/participants/verify').catch(() => ({ data: [] }));
      setParticipants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events').catch(() => ({ data: [] }));
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSubEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events/create', { ...subEventData, parentEvent: parentEventId });
      setIsSubModalOpen(false);
      fetchEvents();
    } catch (err) {
      alert('Failed to create sub-event');
    }
  };

  const handleVerify = async (id, status) => {
    try {
      await api.put(`/events/verify/${id}`, { status }).catch(() => new Promise(res => setTimeout(res, 500)));
      setParticipants(prev => prev.filter(p => p._id !== id));
      setSelectedParticipant(null);
    } catch (err) {
      console.error('Failed verification', err);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-opera-indigo" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-opera-linen pb-4">
        <div>
          <h1 className="text-3xl font-serif text-opera-indigo font-bold tracking-wide">Leader Dashboard</h1>
          <p className="text-gray-500 font-sans mt-1">Manage department events and verify participant payments.</p>
        </div>
      </div>

      {/* Stats Row To Match Admin/HOD style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-t-4 border-t-opera-burgundy shadow-md bg-white">
          <h3 className="text-gray-500 font-sans text-[10px] font-bold tracking-widest uppercase mb-2">Pending Verification</h3>
          <p className="text-4xl font-serif text-opera-indigo font-bold">{participants.length}</p>
        </Card>
        <Card className="p-6 border-t-4 border-t-opera-brass shadow-md bg-white">
          <h3 className="text-gray-500 font-sans text-[10px] font-bold tracking-widest uppercase mb-2">Active Events</h3>
          <p className="text-4xl font-serif text-opera-indigo font-bold">{events.filter(e => !e.parentEvent).length}</p>
        </Card>
        <Card className="p-6 border-t-4 border-t-opera-indigo shadow-md bg-white">
          <h3 className="text-gray-500 font-sans text-[10px] font-bold tracking-widest uppercase mb-2">Department Status</h3>
          <Badge variant="success" className="mt-2">Operating Normally</Badge>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Verification Card */}
        <Card className="overflow-hidden shadow-lg border-t-4 border-t-opera-brass">
          <div className="p-6 border-b border-opera-linen bg-white flex justify-between items-center">
            <h3 className="text-xl font-serif text-opera-indigo font-bold tracking-wide flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-opera-burgundy" /> Pending Verifications
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm">
              <thead className="bg-opera-plaster text-opera-indigo uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="p-4 border-b border-opera-linen">Participant</th>
                  <th className="p-4 border-b border-opera-linen text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-opera-linen">
                {participants.length === 0 ? (
                  <tr><td colSpan="2" className="p-8 text-center text-gray-500 font-serif italic">No pending verifications.</td></tr>
                ) : (
                  participants.map(p => (
                    <tr key={p._id} className="hover:bg-opera-plaster/50 transition-colors bg-white">
                      <td className="p-4">
                        <p className="font-bold text-opera-indigo">{p.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono italic">{p.eventId?.title || 'Unknown Event'}</p>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" className="px-3 py-1.5 text-sm underline text-opera-brass hover:text-opera-indigo font-bold tracking-wide" onClick={() => setSelectedParticipant(p)}>Review</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Events Card */}
        <Card className="overflow-hidden shadow-lg border-t-4 border-t-opera-indigo">
          <div className="p-6 border-b border-opera-linen bg-white flex justify-between items-center">
            <h3 className="text-xl font-serif text-opera-indigo font-bold tracking-wide flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-opera-brass" /> Department Events
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm">
              <thead className="bg-opera-plaster text-opera-indigo uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="p-4 border-b border-opera-linen">Event</th>
                  <th className="p-4 border-b border-opera-linen text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-opera-linen">
                {events.filter(e => !e.parentEvent).length === 0 ? (
                  <tr><td colSpan="2" className="p-8 text-center text-gray-500 font-serif italic">No events found.</td></tr>
                ) : (
                  events.filter(e => !e.parentEvent).map(e => (
                    <tr key={e._id} className="hover:bg-opera-plaster/50 transition-colors bg-white">
                      <td className="p-4">
                        <p className="font-bold text-opera-indigo">{e.title}</p>
                        <Badge variant={e.status === 'APPROVED' ? 'success' : 'warning'} className="text-[10px] mt-1">{e.status}</Badge>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Button variant="ghost" className="p-2 text-opera-brass hover:bg-opera-brass/10" title="Add Sub-event" onClick={() => { setParentEventId(e._id); setSubEventData({...subEventData, upiId: e.upiId}); setIsSubModalOpen(true); }}>
                          <Plus className="w-5 h-5" />
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

      {/* Sub Event Modal */}
      <Modal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} title="Create Sub Event">
        <form className="space-y-5" onSubmit={handleCreateSubEvent}>
          <Input label="Sub Event Title" required value={subEventData.title} onChange={e => setSubEventData({...subEventData, title: e.target.value})} />
          <textarea className="w-full px-4 py-3 border border-opera-linen outline-none rounded-sm min-h-[100px] font-sans" placeholder="Description" required value={subEventData.description} onChange={e => setSubEventData({...subEventData, description: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount (₹)" type="number" required value={subEventData.amount} onChange={e => setSubEventData({...subEventData, amount: e.target.value})} />
            <Input label="ID Prefix" required value={subEventData.participantIdPrefix} onChange={e => setSubEventData({...subEventData, participantIdPrefix: e.target.value})} />
          </div>
          <div className="pt-6 border-t border-opera-linen">
            <Button type="submit" className="w-full shadow-md">Create Sub Event</Button>
          </div>
        </form>
      </Modal>

      {/* Verification Modal */}
      <Modal isOpen={!!selectedParticipant} onClose={() => setSelectedParticipant(null)} title="Payment Verification" className="max-w-3xl">
        {selectedParticipant && (
          <div className="space-y-6">
            <div className="bg-opera-plaster p-5 rounded-sm border border-opera-linen flex justify-between items-center text-sm shadow-inner font-sans">
              <div><span className="text-gray-400 block uppercase text-[10px] font-bold">Participant</span> <strong className="text-opera-indigo">{selectedParticipant.name}</strong></div>
              <div className="text-right"><span className="text-gray-400 block uppercase text-[10px] font-bold">Event</span> <strong className="text-opera-indigo">{selectedParticipant.eventId?.title || 'Unknown'}</strong></div>
            </div>
            <div className="border border-opera-linen bg-gray-50 rounded-sm overflow-hidden flex items-center justify-center min-h-[300px]">
              {selectedParticipant.paymentScreenshot ? (
                <img src={selectedParticipant.paymentScreenshot} alt="Proof" className="max-h-[50vh] object-contain shadow-2xl" />
              ) : (
                <p className="text-gray-400 italic font-serif">No screenshot provided</p>
              )}
            </div>
            <div className="flex space-x-4 pt-4 border-t border-opera-linen">
              <Button onClick={() => handleVerify(selectedParticipant._id, 'REJECTED')} variant="outline" className="flex-1 border-opera-burgundy text-opera-burgundy hover:bg-opera-burgundy hover:text-white font-bold tracking-wide">Reject Payment</Button>
              <Button onClick={() => handleVerify(selectedParticipant._id, 'APPROVED')} variant="primary" className="flex-1 shadow-lg font-bold tracking-wide">Approve & Send ID</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
