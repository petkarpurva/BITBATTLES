import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { Swords, Rocket, Trophy } from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-badge">
          <span className="badge-icon">⚡</span>
          Next-Gen Coding Arena
        </div>
        
        <h1 className="home-title">BIT BATTLES</h1>
        
        <p className="home-subtitle">
          Enter the next-gen hacker arena where code<br />
          meets combat. Battle AI villains, master programming<br />
          challenges, and unlock your potential.
        </p>

        <div className="home-actions">
          <Button 
            size="lg" 
            onClick={() => navigate('/register')}
            className="btn-start"
          >
            SIGN UP
          </Button>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/login')}
            className="btn-dashboard"
          >
            LOGIN
          </Button>
        </div>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <div className="feature-icon">
            <Swords size={32} />
          </div>
          <h3 className="feature-title">Code Duels</h3>
          <p className="feature-description">
            Battle AI opponents in real-time coding challenges
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Rocket size={32} />
          </div>
          <h3 className="feature-title">Level Up</h3>
          <p className="feature-description">
            Earn XP and unlock new chapters and abilities
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Trophy size={32} />
          </div>
          <h3 className="feature-title">Master Skills</h3>
          <p className="feature-description">
            Progress through difficulty levels and become elite
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
