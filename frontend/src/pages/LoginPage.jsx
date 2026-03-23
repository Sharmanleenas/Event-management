import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api/authApi';
import { toast } from 'react-toastify';
import '../styles/auth.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginApi({ email: email.trim(), password });
      // The backend now returns { user, token }
      login(data.user, data.token);
      toast.success('Login Successful!');
      
      // Redirect based on role
      const normalizedRole = data.user.role.toUpperCase();
      if (normalizedRole === 'ADMIN') navigate('/admin');
      else if (normalizedRole === 'HOD') navigate('/hod');
      else if (normalizedRole === 'LEADER') navigate('/leader');
      else if (normalizedRole === 'STAFF') navigate('/staff');
      else navigate('/');
      
    } catch (err) {
      console.error('Login Error:', err);
      const message = err.response?.data?.message || 'Invalid credentials';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <div className="auth-header">
          <h1>SACRED HEART COLLEGE</h1>
          <p>Autonomous — Tiruchengode</p>
          <h3>Login to Dashboard</h3>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="Enter your college email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary auth-submit-btn" 
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Technical Problem? Contact Admin</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
