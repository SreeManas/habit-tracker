import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useStats } from '../hooks/useStats';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { getLevelInfo } = useStats();
  const location = useLocation();
  const levelInfo = getLevelInfo();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <span className="brand-icon">⚔️</span>
          <span className="brand-text">Discipline</span>
        </div>
        
        {user && (
          <>
            <div className="navbar-level">
              <span className="level-badge">Lv.{levelInfo.level}</span>
            </div>
            
            <div className="navbar-links">
              <Link 
                to="/dashboard" 
                className={isActive('/dashboard') ? 'active' : ''}
              >
                Today
              </Link>
              <Link 
                to="/habits" 
                className={isActive('/habits') ? 'active' : ''}
              >
                Habits
              </Link>
              <Link 
                to="/stats" 
                className={isActive('/stats') ? 'active' : ''}
              >
                Stats
              </Link>
            </div>

            <button className="btn-logout" onClick={signOut}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
