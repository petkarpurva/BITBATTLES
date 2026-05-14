import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chaptersAPI } from '../services/api';
import { Code, CheckCircle, Lock } from 'lucide-react';
import ProgressBar from '../components/common/ProgressBar';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const completedIds = user?.completedChapters || [];

  const [chaptersData, setChaptersData] = useState([]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await chaptersAPI.getAll();
        if (response.success) {
          setChaptersData(response.data.chapters);
        }
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
      }
    };
    fetchChapters();
  }, []);

  const chapters = chaptersData.map((chap) => ({
    id: chap.chapterNumber, // Using chapterNumber as the ID for routing (/chapters/1)
    title: chap.title,
    chapter: `Chapter ${chap.chapterNumber}`,
    description: chap.description || chap.text,
    difficulty: chap.difficulty || 'Medium',
    difficultyColor: chap.difficultyColor || '#F59E0B',
    unlocked: chap.chapterNumber === 1 || completedIds.includes(chap.chapterNumber - 1),
    completed: completedIds.includes(chap.chapterNumber),
  }));

  // Calculate XP for next level
  const currentLevel = user?.level || 1;
  const currentXP = user?.xp || 0;
  const xpForNextLevel = currentLevel * 200;

  // Sample stats
  const stats = [
    { label: 'Total XP', value: currentXP.toLocaleString(), icon: '⚡', color: '#00E5FF' },
    { label: 'Battles Won', value: '42', icon: '🏆', color: '#B026FF' },
    { label: 'Accuracy', value: '87%', icon: '🎯', color: '#FF00E5' },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            <span className="title-gradient">Dashboard</span>
          </h1>
          <p className="dashboard-subtitle">Track your progress and unlock new challenges</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="progress-section">
        <div className="progress-header-section">
          <span className="progress-level">Level {currentLevel}</span>
          <span className="progress-xp">{currentXP} / {xpForNextLevel} XP</span>
        </div>
        <ProgressBar current={currentXP} max={xpForNextLevel} showLabel={false} />
      </div>

      {/* Chapters Section */}
      <div className="chapters-section">
        <h2 className="section-title">Unlocked Chapters</h2>
        <div className="chapters-grid">
          {chapters.map((chapter) => (
            <div 
              key={chapter.id} 
              className={`chapter-card ${!chapter.unlocked ? 'locked' : ''} ${chapter.completed ? 'completed' : ''}`}
              onClick={() => chapter.unlocked && navigate(`/chapters/${chapter.id}`)}
              style={chapter.unlocked ? { cursor: 'pointer' } : {}}
            >
              {chapter.unlocked ? (
                <>
                  <div className="chapter-icon">
                    <Code size={24} />
                  </div>
                  <div className="chapter-content">
                    <div className="chapter-header">
                      <h3 className="chapter-title">{chapter.title}</h3>
                      {chapter.completed && (
                        <CheckCircle size={20} className="chapter-check" />
                      )}
                    </div>
                    <p className="chapter-number">{chapter.chapter}</p>
                    <p className="chapter-description">{chapter.description}</p>
                    <div className="chapter-footer">
                      <span 
                        className="chapter-difficulty" 
                        style={{ color: chapter.difficultyColor }}
                      >
                        {chapter.difficulty}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="chapter-locked">
                  <Lock size={48} />
                  <p className="locked-text">Locked</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
