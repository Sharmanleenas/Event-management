import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Loader2, UserPlus, Trash2, Edit } from 'lucide-react';
import api from '../../api/axios';

import { useAuth } from '../../context/AuthContext';

export const Leaders = () => {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: user?.department || '',
    role: 'LEADER'
  });

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const res = await api.get('/users/leaders');
      setLeaders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLeader = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      // Use auth register for creating new users
      await api.post('/auth/register', formData);
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', password: '', department: '', role: 'LEADER' });
      fetchLeaders();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add leader');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteLeader = async (id) => {
    if (!window.confirm('Are you sure you want to remove this leader?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchLeaders();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-opera-indigo" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-opera-linen pb-4">
        <div>
          <h1 className="text-3xl font-serif text-opera-indigo font-bold tracking-wide">Department Leaders</h1>
          <p className="text-gray-500 font-sans mt-1">Manage event leaders and their credentials.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center shadow-md">
          <UserPlus className="w-5 h-5 mr-2" /> Add Leader
        </Button>
      </div>

      <Card className="overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead className="bg-opera-plaster text-opera-indigo text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-bold border-b border-opera-linen">Name</th>
                <th className="p-4 font-bold border-b border-opera-linen">Email</th>
                <th className="p-4 font-bold border-b border-opera-linen">Department</th>
                <th className="p-4 font-bold border-b border-opera-linen">Assigned Events</th>
                <th className="p-4 font-bold border-b border-opera-linen text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-opera-linen">
              {leaders.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No leaders found for your department.</td></tr>
              ) : (
                leaders.map(leader => (
                  <tr key={leader._id} className="hover:bg-opera-plaster/50 transition-colors bg-white">
                    <td className="p-4 font-medium text-opera-indigo">{leader.name}</td>
                    <td className="p-4 text-gray-600">{leader.email}</td>
                    <td className="p-4 text-gray-600 font-sans">{leader.department}</td>
                    <td className="p-4 text-center">
                       <Badge variant="ghost" className="px-3 bg-gray-100 text-opera-indigo font-bold">{leader.eventCount || 0}</Badge>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button variant="ghost" className="p-2 text-opera-burgundy hover:bg-opera-burgundy/10" onClick={() => handleDeleteLeader(leader._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Leader">
        <form className="space-y-5" onSubmit={handleAddLeader}>
          <Input label="Full Name" placeholder="John Doe" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <Input label="Email Address" type="email" placeholder="john@example.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <Input label="Temporary Password" type="password" placeholder="••••••••" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          <div className="pt-6 border-t border-opera-linen mt-4">
            <Button type="submit" className="w-full shadow-md" isLoading={submitLoading}>Create Leader Account</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
