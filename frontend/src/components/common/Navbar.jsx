import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, BrainCircuit, Swords, Code, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', icon: <Home size={18} />, label: 'Home' },
    { path: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { path: '/quiz/1', icon: <BrainCircuit size={18} />, label: 'Practice' },
    { path: '/battles', icon: <Swords size={18} />, label: 'Battles' },
    { path: '/compiler', icon: <Code size={18} />, label: 'Compiler' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          BIT BATTLES
        </Link>

        <div className="navbar-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`navbar-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {user && (
          <div className="navbar-user-section">
            <div className="navbar-level">
              <User size={16} />
              <span>Level {user.level}</span>
            </div>
            <button className="logout-btn" onClick={logout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
