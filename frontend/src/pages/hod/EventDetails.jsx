import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Loader2, Plus, Trash2, Edit, ChevronLeft, Save, List, Layers } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const isHOD = role === 'HOD';
  const isLeader = role === 'LEADER';
  const dashboardPath = role === 'HOD' ? '/hod/dashboard' : '/leader/dashboard';
  const [isSubEventModalOpen, setIsSubEventModalOpen] = useState(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [newRule, setNewRule] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [subEventData, setSubEventData] = useState({
    title: '',
    description: '',
    amount: '',
    participantIdPrefix: '',
    upiId: ''
  });

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
      setSubEventData(prev => ({ ...prev, upiId: res.data.upiId }));
    } catch (err) {
      console.error(err);
      navigate(dashboardPath);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events/create', { ...subEventData, parentEvent: id });
      setIsSubEventModalOpen(false);
      setSubEventData({ title: '', description: '', amount: '', participantIdPrefix: '', upiId: event.upiId });
      fetchEventDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRule = async () => {
    if (!newRule) return;
    try {
      await api.post(`/events/rule/${id}`, { rule: newRule });
      setNewRule('');
      setIsRuleModalOpen(false);
      fetchEventDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment) return;
    setCommentLoading(true);
    try {
      await api.post(`/events/comment/${id}`, { text: newComment });
      setNewComment('');
      fetchEventDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteRule = async (index) => {
    try {
      const updatedRules = event.rules.filter((_, i) => i !== index);
      await api.put(`/events/${id}`, { rules: updatedRules });
      fetchEventDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure? This will also delete all sub-events.')) return;
    try {
      await api.delete(`/events/${eventId}`);
      if (eventId === id) navigate(dashboardPath);
      else fetchEventDetails();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-opera-indigo" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="p-2" onClick={() => navigate(dashboardPath)}>
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-3xl font-serif text-opera-indigo font-bold">{event.title}</h1>
        <Badge variant={event.status === 'APPROVED' ? 'success' : 'warning'}>{event.status}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-serif font-bold text-opera-indigo">Description</h3>
              {(isHOD || isLeader) && (
                <Button variant="ghost" size="sm" className="text-opera-brass">
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
              )}
            </div>
            <p className="text-gray-600 leading-relaxed font-sans">{event.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm bg-opera-plaster p-4 rounded-sm">
              <div><span className="text-gray-500 block uppercase text-xs font-bold">Registration Fee</span> ₹{event.amount}</div>
              <div><span className="text-gray-500 block uppercase text-xs font-bold">UPI ID</span> {event.upiId}</div>
            </div>
          </Card>

          {/* Comments Section */}
          <Card className="overflow-hidden bg-white shadow-md">
            <div className="p-6 border-b border-opera-linen flex justify-between items-center">
               <h3 className="text-xl font-serif font-bold text-opera-indigo flex items-center">
                 <Sparkles className="w-5 h-5 mr-2 text-opera-burgundy" /> Feedback & Updates
               </h3>
            </div>
            <div className="p-6 space-y-6">
              <form onSubmit={handleAddComment} className="flex gap-2">
                <Input 
                  className="flex-1" 
                  placeholder="Share a comment or update..." 
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  disabled={commentLoading}
                />
                <Button type="submit" isLoading={commentLoading} disabled={!newComment}>Post</Button>
              </form>
              
              <div className="space-y-4">
                {(event.comments || []).length === 0 ? (
                  <p className="text-gray-400 text-center py-4 italic font-sans text-sm">No feedback yet.</p>
                ) : (
                  event.comments.slice().reverse().map(comment => (
                    <div key={comment._id} className="p-4 bg-opera-plaster/30 rounded-sm border-l-4 border-l-opera-indigo/20">
                      <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">
                        <span>{comment.userName}</span>
                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 font-sans leading-relaxed">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>

          {/* Sub Events */}
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-opera-linen flex justify-between items-center bg-white">
              <h3 className="text-xl font-serif font-bold text-opera-indigo flex items-center"><Layers className="w-5 h-5 mr-2" /> Sub Events</h3>
              {(isHOD || isLeader) && <Button size="sm" onClick={() => setIsSubEventModalOpen(true)}><Plus className="w-4 h-4 mr-2" /> Add Sub Event</Button>}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                <thead className="bg-opera-plaster text-opera-indigo text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 border-b border-opera-linen">Title</th>
                    <th className="p-4 border-b border-opera-linen">Fee</th>
                    <th className="p-4 border-b border-opera-linen text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-opera-linen">
                  {(event.subEvents || []).length === 0 ? (
                    <tr><td colSpan="3" className="p-8 text-center text-gray-500">No sub-events created yet.</td></tr>
                  ) : (
                    event.subEvents.map(se => (
                      <tr key={se._id} className="hover:bg-opera-plaster/50 transition-colors">
                        <td className="p-4 font-medium text-opera-indigo">{se.title}</td>
                        <td className="p-4 text-gray-600">₹{se.amount}</td>
                        <td className="p-4 text-right">
                           {isHOD && <Button variant="ghost" className="text-opera-burgundy p-2" onClick={() => handleDeleteEvent(se._id)}><Trash2 className="w-4 h-4" /></Button>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Rules Section */}
        <div className="space-y-8">
          <Card className="bg-white overflow-hidden flex flex-col">
            <div className="p-6 border-b border-opera-linen flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold text-opera-indigo flex items-center">
                <List className="w-5 h-5 mr-2 text-opera-brass" /> Event Rules
              </h3>
              {(isHOD || isLeader) && <Button size="sm" variant="outline" className="border-opera-brass text-opera-brass" onClick={() => setIsRuleModalOpen(true)}>
                <Plus className="w-4 h-4" />
              </Button>}
            </div>
            <div className="p-6 space-y-4">
              {(event.rules || []).length === 0 ? (
                <p className="text-center text-gray-400 py-4 text-sm italic">No rules specified yet.</p>
              ) : (
                <ul className="space-y-3">
                  {event.rules.map((rule, idx) => (
                    <li key={idx} className="flex justify-between items-start group bg-opera-plaster/50 p-3 rounded-sm border border-transparent hover:border-opera-linen transition-all">
                      <span className="text-sm text-gray-700">{rule}</span>
                      {isHOD && <button onClick={() => handleDeleteRule(idx)} className="opacity-0 group-hover:opacity-100 text-opera-burgundy transition-opacity p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          {isHOD && (
            <Button variant="outline" className="w-full border-opera-burgundy text-opera-burgundy hover:bg-opera-burgundy hover:text-white" onClick={() => handleDeleteEvent(id)}>
              <Trash2 className="w-5 h-5 mr-2" /> Delete Main Event
            </Button>
          )}
        </div>
      </div>

      {/* Sub Event Modal */}
      <Modal isOpen={isSubEventModalOpen} onClose={() => setIsSubEventModalOpen(false)} title="Create Sub Event">
        <form className="space-y-5" onSubmit={handleCreateSubEvent}>
          <Input label="Sub Event Title" required value={subEventData.title} onChange={e => setSubEventData({...subEventData, title: e.target.value})} />
          <textarea className="w-full px-4 py-3 border border-opera-linen outline-none rounded-sm min-h-[100px]" placeholder="Description" required value={subEventData.description} onChange={e => setSubEventData({...subEventData, description: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount (₹)" type="number" required value={subEventData.amount} onChange={e => setSubEventData({...subEventData, amount: e.target.value})} />
            <Input label="ID Prefix" required value={subEventData.participantIdPrefix} onChange={e => setSubEventData({...subEventData, participantIdPrefix: e.target.value})} />
          </div>
          <Button type="submit" className="w-full">Create Sub Event</Button>
        </form>
      </Modal>

      {/* Rule Modal */}
      <Modal isOpen={isRuleModalOpen} onClose={() => setIsRuleModalOpen(false)} title="Add Event Rule">
        <div className="space-y-5">
          <textarea className="w-full px-4 py-3 border border-opera-linen outline-none rounded-sm min-h-[100px]" placeholder="Enter rule content..." value={newRule} onChange={e => setNewRule(e.target.value)} />
          <Button className="w-full" onClick={handleAddRule}>Add Rule</Button>
        </div>
      </Modal>
    </div>
  );
};
