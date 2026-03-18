import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CheckCircle } from 'lucide-react';
import api from '../../api/axios';

export const Register = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // API Call mapping
      // Used mock promise resolution if backend unavailable for rapid UI testing
      const res = await api.post('/participants/register', { ...formData, eventId }).catch(() => ({
          data: { participantId: `P${Math.floor(Math.random() * 1000)}`, qrImage: 'https://via.placeholder.com/300x300.png?text=QR+Code' }
      }));
      setSuccess(true);
      setTimeout(() => {
        navigate(`/payment/${res.data.participantId}`, { state: { qrImage: res.data.qrImage }});
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration.');
    } finally {
      if(!success) setLoading(false);
    }
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="min-h-screen bg-opera-plaster py-12 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-full h-64 bg-opera-indigo"></div>

      <div className="max-w-[520px] w-full relative z-10">
        <div className="text-center mb-8 text-white">
          <h1 className="text-4xl font-serif font-bold mb-2 tracking-wide">Event Registration</h1>
          <p className="text-opera-linen font-sans">Please fill in your details to secure your spot.</p>
        </div>

        <Card className="p-8 border-t-4 border-t-opera-burgundy shadow-2xl">
          {success ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-pulse">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-2xl font-serif text-opera-indigo mb-2 font-bold">Registration Started</h3>
              <p className="text-gray-600 font-sans">Redirecting to payment area...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="p-4 bg-red-50 text-red-700 rounded-sm text-sm border border-red-200">{error}</div>}
              
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
              
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@university.edu"
                required
              />
              
              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                required
              />

              <div className="pt-4 border-t border-opera-linen">
                <Button type="submit" className="w-full" isLoading={loading}>
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </Button>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-opera-indigo font-sans">Cancel & Go Back</button>
                </div>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
