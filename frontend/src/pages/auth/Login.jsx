import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import api from '../../api/axios';

export const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', formData);
      
      const { _id, role, token } = res.data;
      login({ _id, email: formData.email }, role, token);
      
      // Redirect based on role
      navigate(`/${role.toLowerCase()}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="min-h-screen bg-opera-plaster flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-opera-indigo rounded-full opacity-10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-opera-burgundy rounded-full opacity-10 blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-opera-indigo font-bold mb-2 tracking-wide">Staff Portal</h1>
          <p className="text-gray-600 font-sans tracking-wide">Sign in to manage events and participants.</p>
        </div>

        <Card className="p-8 shadow-2xl border-t-4 border-t-opera-brass">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-4 bg-red-50 text-red-700 rounded-sm text-sm border border-red-200">{error}</div>}
            
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="staff@university.edu"
              required
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <div className="pt-2 border-t border-opera-linen">
              <Button type="submit" className="w-full mt-4" isLoading={loading}>
                Secure Login
              </Button>
            </div>
            
            <div className="text-center mt-6">
              <button 
                type="button" 
                onClick={() => navigate('/')} 
                className="text-sm font-sans text-opera-indigo border-b border-transparent hover:border-opera-indigo transition-colors pb-0.5"
              >
                ← Return to Public Site
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
