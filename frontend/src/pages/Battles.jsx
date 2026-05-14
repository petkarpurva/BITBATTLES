import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Swords, Shield, Zap, Lock, Trophy, Play, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import progressAPI from '../services/progressAPI';
import './Battles.css';

const Battles = () => {
  const { user, updateUser } = useAuth();
  const completedIds = user?.completedChapters || [];

  const [view, setView] = useState('list'); // 'list', 'intro', 'battle', 'result'
  const [activeBattle, setActiveBattle] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [saving, setSaving] = useState(false);

  // Define Battles
  const battles = [
    {
      id: 1,
      chapterId: 1,
      enemyName: "Glitch Cybot",
      enemyImage: "🤖",
      difficulty: "Easy",
      difficultyColor: "#10B981",
      xpReward: 100,
      topic: "Python Basics",
      description: "Defeat the Glitch Cybot by mastering basic Python commands and syntax.",
      unlocked: true,
      questions: [
        { q: "What is the correct way to output 'Hello' in Python?", options: ["print('Hello')", "echo 'Hello'", "console.log('Hello')", "output('Hello')"], correct: 0 },
        { q: "Which character is used to indicate a comment in Python?", options: ["//", "/*", "<!--", "#"], correct: 3 },
        { q: "What will print(5 + 2) output?", options: ["52", "7", "5 + 2", "Error"], correct: 1 }
      ]
    },
    {
      id: 2,
      chapterId: 2,
      enemyName: "Syntax Serpent",
      enemyImage: "🐍",
      difficulty: "Medium",
      difficultyColor: "#F59E0B",
      xpReward: 150,
      topic: "Variables & Data Types",
      description: "The Syntax Serpent is injecting typos. Use your variable knowledge to strike it down.",
      unlocked: completedIds.includes(1),
      questions: [
        { q: "Which of the following describes a valid string variable?", options: ["x = 5", "x = '5'", "x = True", "x = 5.0"], correct: 1 },
        { q: "What is the data type of x if x = 10.5?", options: ["int", "float", "string", "bool"], correct: 1 },
        { q: "How do you get user input in Python?", options: ["get_input()", "read()", "input()", "scan()"], correct: 2 }
      ]
    },
    {
      id: 3,
      chapterId: 3,
      enemyName: "Logic Lord",
      enemyImage: "🧠",
      difficulty: "Hard",
      difficultyColor: "#EF4444",
      xpReward: 200,
      topic: "Control Flow",
      description: "The Logic Lord twists paths. Use conditional statements to break its mind control.",
      unlocked: completedIds.includes(2),
      questions: [
        { q: "Which keyword is used for alternative conditions in Python?", options: ["else if", "elseif", "elif", "else"], correct: 2 },
        { q: "What does '10 == 10' evaluate to?", options: ["True", "False", "1", "0"], correct: 0 },
        { q: "Which of these is a logical operator in Python?", options: ["&&", "and", "||", "!"], correct: 1 }
      ]
    }
  ];

  const handleStartBattle = (battle) => {
    if (!battle.unlocked) return;
    setActiveBattle(battle);
    setPlayerHealth(100);
    setEnemyHealth(100);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setView('intro');

    setTimeout(() => {
      setView('battle');
    }, 2500);
  };

  const handleAnswerSubmit = (index) => {
    if (showFeedback) return;
    setSelectedAnswer(index);

    const correct = index === activeBattle.questions[currentQuestionIndex].correct;
    setIsCorrect(correct);
    setShowFeedback(true);

    let newEnemyHealth = enemyHealth;
    let newPlayerHealth = playerHealth;

    if (correct) {
      newEnemyHealth = enemyHealth - Math.ceil(100 / activeBattle.questions.length);
      setEnemyHealth(Math.max(0, newEnemyHealth));
    } else {
      newPlayerHealth = playerHealth - 40;
      setPlayerHealth(Math.max(0, newPlayerHealth));
    }

    setTimeout(() => {
      const isGameOver = newPlayerHealth <= 0 || newEnemyHealth <= 0 || currentQuestionIndex === activeBattle.questions.length - 1;

      if (isGameOver) {
        setView('result');
        if (newEnemyHealth <= 0 || newPlayerHealth > 0 && newEnemyHealth < enemyHealth) {
           // Wait, win condition: enemy health is 0 OR you survived and dealt more damage?
           // Let's say win = enemy health <= 0
        }
      } else {
        setCurrentQuestionIndex((i) => i + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      }
    }, 2000);
  };

  const isPlayerWin = enemyHealth <= 0 || (playerHealth > 0 && currentQuestionIndex === activeBattle?.questions.length - 1 && enemyHealth < 100);
  // Actually, standard win condition: player health > 0 and enemy health is 0, or player health > 0 at end
  const playerWon = view === 'result' && playerHealth > 0;

  useEffect(() => {
    const saveXP = async () => {
      if (view === 'result' && playerWon && !saving) {
        setSaving(true);
        try {
          const res = await progressAPI.addXP(activeBattle.xpReward, 'battle');
          if (res.success) {
            updateUser({ xp: res.totalXP, level: res.level });
          }
        } catch (error) {
          console.error("Error saving battle XP", error);
        } finally {
          setSaving(false);
        }
      }
    };
    saveXP();
  }, [view, playerWon]);

  return (
    <div className="battles-page">
      {view === 'list' && (
        <div className="battles-list-view">
          <header className="battles-header">
            <div>
              <h1 className="battles-title">
                <Swords size={36} className="title-icon" />
                <span className="title-gradient">Combat Zone</span>
              </h1>
              <p className="battles-subtitle">Apply your Python knowledge in live combat. Win battles to earn XP.</p>
            </div>
          </header>

          <div className="battles-modes">
            <div className="mode-card active">
              <Zap size={24} className="mode-icon" />
              <h3>Solo Battle</h3>
              <p>Fight AI cybots to prove your skills</p>
            </div>
            <div className="mode-card disabled">
              <Shield size={24} className="mode-icon" />
              <h3>Duo Battle <span className="coming-soon">Soon</span></h3>
              <p>Player vs Player matchmaking</p>
            </div>
          </div>

          <div className="battles-grid">
            {battles.map((battle) => (
              <div key={battle.id} className={`battle-card ${battle.unlocked ? 'unlocked' : 'locked'}`}>
                <div className="battle-card-inner">
                  <div className="battle-enemy-avatar">{battle.enemyImage}</div>
                  <div className="battle-info">
                    <h3 className="enemy-name">{battle.enemyName}</h3>
                    <p className="battle-topic">{battle.topic}</p>
                    <p className="battle-desc">{battle.description}</p>
                  </div>
                  <div className="battle-meta">
                    <span className="difficulty-badge" style={{ color: battle.difficultyColor, borderColor: battle.difficultyColor }}>
                      {battle.difficulty}
                    </span>
                    <span className="xp-badge">
                      <Zap size={16} /> +{battle.xpReward} XP
                    </span>
                  </div>
                  {!battle.unlocked && (
                    <div className="locked-overlay">
                      <Lock size={32} />
                      <span>Complete Chapter {battle.chapterId} to unlock</span>
                    </div>
                  )}
                  {battle.unlocked && (
                    <button className="start-battle-btn" onClick={() => handleStartBattle(battle)}>
                      <Play size={18} /> Start Battle
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'intro' && activeBattle && (
        <div className="battle-intro-view">
          <div className="intro-content">
            <h2 className="vs-text">VS</h2>
            <div className="combatants">
              <div className="combatant player">
                <div className="avatar">🧑‍💻</div>
                <div className="name">{user?.username || 'Player'}</div>
              </div>
              <div className="combatant enemy slide-in">
                <div className="avatar">{activeBattle.enemyImage}</div>
                <div className="name">{activeBattle.enemyName}</div>
              </div>
            </div>
            <h1 className="get-ready fade-in-up">GET READY!</h1>
          </div>
        </div>
      )}

      {view === 'battle' && activeBattle && (
        <div className="battle-arena-view">
          <header className="arena-header">
            <div className="health-container player-health">
              <div className="health-label">You <span className="hp-value">{playerHealth} HP</span></div>
              <div className="health-bar-bg">
                <div className="health-bar-fill green" style={{ width: `${playerHealth}%` }}></div>
              </div>
            </div>
            <div className="vs-badge">VS</div>
            <div className="health-container enemy-health">
              <div className="health-label">{activeBattle.enemyName} <span className="hp-value">{enemyHealth} HP</span></div>
              <div className="health-bar-bg">
                <div className="health-bar-fill red" style={{ width: `${enemyHealth}%` }}></div>
              </div>
            </div>
          </header>

          <main className="arena-main">
            <div className="combat-visuals">
                <div className={`avatar-large ${showFeedback && !isCorrect ? 'shake damage' : ''}`}>🧑‍💻</div>
                <div className="clash-zone">
                   {showFeedback && (
                      <div className={`attack-fx ${isCorrect ? 'player-attack' : 'enemy-attack'}`}>
                        <Zap size={48} />
                      </div>
                   )}
                </div>
                <div className={`avatar-large ${showFeedback && isCorrect ? 'shake damage' : ''}`}>{activeBattle.enemyImage}</div>
            </div>

            <div className="question-panel">
              <h3 className="question-text">{activeBattle.questions[currentQuestionIndex].q}</h3>
              <div className="options-grid">
                {activeBattle.questions[currentQuestionIndex].options.map((opt, idx) => (
                  <button 
                    key={idx} 
                    disabled={showFeedback}
                    className={`arena-option ${
                      selectedAnswer === idx ? 'selected' : ''
                    } ${
                      showFeedback && idx === activeBattle.questions[currentQuestionIndex].correct ? 'correct' : ''
                    } ${
                      showFeedback && selectedAnswer === idx && !isCorrect ? 'wrong' : ''
                    }`}
                    onClick={() => handleAnswerSubmit(idx)}
                  >
                    {opt}
                    {showFeedback && idx === activeBattle.questions[currentQuestionIndex].correct && <CheckCircle size={20} className="result-icon correct" />}
                    {showFeedback && selectedAnswer === idx && !isCorrect && <XCircle size={20} className="result-icon wrong" />}
                  </button>
                ))}
              </div>
            </div>
          </main>
        </div>
      )}

      {view === 'result' && activeBattle && (
        <div className="battle-result-view">
           <div className={`result-card ${playerWon ? 'victory' : 'defeat'}`}>
              <div className="result-icon-large">
                {playerWon ? <Trophy size={64} /> : <XCircle size={64} />}
              </div>
              <h1 className="result-title">{playerWon ? 'VICTORY!' : 'DEFEAT!'}</h1>
              <p className="result-message">
                {playerWon ? `You destroyed the ${activeBattle.enemyName}.` : `The ${activeBattle.enemyName} overpowered you.`}
              </p>
              
              {playerWon && (
                <div className="reward-box">
                  <span className="reward-label">XP Earned</span>
                  <span className="reward-value">+{activeBattle.xpReward} XP</span>
                </div>
              )}

              <div className="result-actions">
                 <button className="btn-primary" onClick={() => setView('list')}>
                   Return to Battles
                 </button>
                 {!playerWon && (
                   <button className="btn-secondary" onClick={() => handleStartBattle(activeBattle)}>
                     Retry Battle
                   </button>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Battles;
