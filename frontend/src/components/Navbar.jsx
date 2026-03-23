import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/admin') || 
                      location.pathname.startsWith('/hod') || 
                      location.pathname.startsWith('/leader') ||
                      location.pathname.startsWith('/staff');

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const getDashboardLink = () => {
    const r = role?.toUpperCase();
    if (r === 'ADMIN') return '/admin';
    if (r === 'HOD') return '/hod';
    if (r === 'LEADER') return '/leader';
    if (r === 'STAFF') return '/staff';
    return '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo">
          <div className="logo-text">
            SACRED HEART COLLEGE
            <span>AUTONOMOUS</span>
          </div>
        </Link>

        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          {!isDashboard && (
            <>
              <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
              <button 
                className="nav-link btn-link" 
                onClick={() => {
                  setIsOpen(false);
                  navigate('/');
                  setTimeout(() => {
                    const el = document.getElementById('events-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              >
                Events
              </button>
              
              <button 
                className="nav-link btn-link" 
                onClick={() => {
                  setIsOpen(false);
                  const contactSection = document.getElementById('contact-section');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/');
                    setTimeout(() => {
                      const el = document.getElementById('contact-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
              >
                Contact
              </button>
            </>
          )}
          
          {user ? (
            <>
              <Link 
                to={getDashboardLink()} 
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <div className="nav-user-info">
                <span className="badge badge-brass">{role?.toUpperCase()}</span>
                <NotificationBell />
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            </>
          ) : (
            <Link to="/login" className="login-btn btn-primary" onClick={() => setIsOpen(false)}>Login</Link>
          )}
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
