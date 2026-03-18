import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, LogOut, CheckSquare, Users, Bell } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const Sidebar = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLinks = {
    ADMIN: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
      { name: 'Inbox', path: '/admin/notifications', icon: Bell },
    ],
    HOD: [
      { name: 'My Events', path: '/hod/dashboard', icon: Home },
      { name: 'Leaders', path: '/hod/leaders', icon: Users },
      { name: 'Inbox', path: '/hod/notifications', icon: Bell },
    ],
    LEADER: [
      { name: 'Verifications', path: '/leader/dashboard', icon: CheckSquare },
      { name: 'Inbox', path: '/leader/notifications', icon: Bell },
    ]
  };

  const links = roleLinks[role?.toUpperCase()] || [];

  return (
    <div className="w-[240px] bg-opera-indigo text-white h-screen flex flex-col border-r border-opera-indigo shadow-lg z-20">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-serif tracking-widest uppercase">System</h2>
        <div className="w-12 h-1 bg-opera-brass mt-2 mb-4"></div>
        <Badge variant="danger" className="bg-opera-burgundy text-white border-0 shadow-sm">{role}</Badge>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {links.map(link => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-sm transition-all duration-200 font-sans tracking-wide
              ${isActive ? 'bg-opera-plaster text-opera-indigo shadow-inner' : 'text-white/80 hover:bg-white/10 hover:text-white'}`
            }
          >
            <link.icon className="w-5 h-5" />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-white/80 hover:bg-opera-burgundy hover:text-white transition-colors duration-200 font-sans tracking-wide shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
