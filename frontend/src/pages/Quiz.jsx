import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, CheckCircle, XCircle, Zap, Trophy } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import progressAPI from '../services/progressAPI';
import { quizAPI } from '../services/api';
import './Quiz.css';

const Quiz = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [saving, setSaving] = useState(false);

  const [currentQuizData, setCurrentQuizData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await quizAPI.getByChapterNumber(chapterId);
        if (response.success) {
          setCurrentQuizData(response.data.quizzes);
        }
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (chapterId) {
      fetchQuizzes();
    }
  }, [chapterId]);
  
  const isQuizComplete = currentQuizData.length > 0 && currentQuestionIndex === currentQuizData.length - 1 && showResult;

  useEffect(() => {
    const saveXPToBackend = async () => {
      // Only unlock and grant XP if you actually finished the quiz
      if (isQuizComplete && !saving) {
        setSaving(true);
        try {
          const numChapterId = parseInt(chapterId);
          // Unlock the NEXT chapter via the API
          const nextChapterId = numChapterId + 1;
          // Pass 0 as XP reward because we already awarded XP question-by-question via submitQuiz
          const response = await progressAPI.completeChapter(numChapterId, nextChapterId, 0);
          
          if (response && response.success) {
            updateUser({
              // Use the response's updated totalXP and level
              xp: response.totalXP,
              level: response.level,
              completedChapters: response.completedChapters
            });
          }
        } catch (error) {
          console.error('Error saving Quiz progress:', error);
        } finally {
          setSaving(false);
        }
      }
    };

    if (isQuizComplete) {
      saveXPToBackend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuizComplete]);

  if (loading) {
    return (
      <div className="quiz-page" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h2>Loading Mission Data...</h2>
      </div>
    );
  }

  if (currentQuizData.length === 0) {
    return (
      <div className="quiz-page" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h2>Mission Data Not Found for Chapter {chapterId}</h2>
        <Button onClick={() => navigate('/dashboard')} style={{ marginTop: '20px' }}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const currentQuestion = currentQuizData[currentQuestionIndex];

  const handleAnswerSelect = (index) => {
    if (!showResult) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null) return;

    try {
      const response = await quizAPI.submit({
        quizId: currentQuestion._id,
        answer: selectedAnswer
      });

      if (response && response.success) {
        const result = response.data;
        setIsCorrect(result.correct);

        if (result.correct) {
          setScore(score + 1);
          setTotalXP(totalXP + result.xpEarned);
        }

        // Update global user context instantly
        updateUser({
          xp: result.totalXP,
          level: result.level
        });

        // Temporarily inject the correct answer so the UI can display it
        currentQuestion.correctAnswer = result.correctAnswer;
        
        setShowResult(true);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setScore(0);
    setTotalXP(0);
  };

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <h1 className="quiz-title">
          <BrainCircuit size={32} />
          <span className="title-gradient">Chapter {chapterId} Mission</span>
        </h1>
        <p className="quiz-subtitle">Test your knowledge from this chapter to unlock the next mission!</p>
      </div>

      <div className="quiz-stats">
        <div className="quiz-stat">
          <span className="stat-label">Question</span>
          <span className="stat-value">{currentQuestionIndex + 1} / {currentQuizData.length}</span>
        </div>
        <div className="quiz-stat">
          <span className="stat-label">Score</span>
          <span className="stat-value">{score} / {currentQuizData.length}</span>
        </div>
        <div className="quiz-stat">
          <span className="stat-label">Session XP</span>
          <span className="stat-value cyan">{totalXP} XP</span>
        </div>
      </div>

      {!isQuizComplete ? (
        <Card className="quiz-card">
          <div className="question-header">
            <span className={`difficulty-badge ${currentQuestion.difficulty.toLowerCase()}`}>
              {currentQuestion.difficulty}
            </span>
            <span className="xp-badge">
              <Zap size={16} />
              +{currentQuestion.xpReward} XP
            </span>
          </div>

          <h2 className="question-text" style={{ whiteSpace: 'pre-wrap' }}>{currentQuestion.question}</h2>

          <div className="options-grid">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${
                  selectedAnswer === index ? 'selected' : ''
                } ${
                  showResult && index === currentQuestion.correctAnswer ? 'correct' : ''
                } ${
                  showResult && selectedAnswer === index && !isCorrect ? 'incorrect' : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {showResult && index === currentQuestion.correctAnswer && (
                  <CheckCircle size={20} className="option-icon correct-icon" />
                )}
                {showResult && selectedAnswer === index && !isCorrect && (
                  <XCircle size={20} className="option-icon incorrect-icon" />
                )}
              </button>
            ))}
          </div>

          {showResult && (
            <div className={`result-message ${isCorrect ? 'correct' : 'incorrect'}`}>
              {isCorrect ? (
                <>
                  <CheckCircle size={24} />
                  <div>
                    <strong>Correct!</strong>
                    <p>You earned {currentQuestion.xpReward} XP</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle size={24} />
                  <div>
                    <strong>Incorrect!</strong>
                    <p>The correct answer is: {currentQuestion.options[currentQuestion.correctAnswer]}</p>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="quiz-actions">
            {!showResult ? (
              <Button 
                size="lg" 
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </Button>
            ) : (
              <Button size="lg" onClick={handleNext}>
                {currentQuestionIndex < currentQuizData.length - 1 ? 'Next Question' : 'View Results'}
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <Card className="results-card">
          <div className="results-content">
            <Trophy size={64} className="results-icon" style={{ color: '#10B981', margin: '0 auto 1rem' }} />
            <h2 className="results-title">Mission Complete!</h2>
            <div className="results-stats">
              <div className="result-stat">
                <span className="result-label">Final Score</span>
                <span className="result-value">{score} / {currentQuizData.length}</span>
              </div>
              <div className="result-stat">
                <span className="result-label">Accuracy</span>
                <span className="result-value">{Math.round((score / currentQuizData.length) * 100)}%</span>
              </div>
              <div className="result-stat">
                <span className="result-label">Total XP Earned</span>
                <span className="result-value cyan">{totalXP} XP</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
               <Button size="lg" onClick={() => navigate('/dashboard')} style={{ background: '#10B981', borderColor: '#10B981' }}>
                 Return to Dashboard
               </Button>
               <Button size="lg" onClick={handleRestart} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
                 Restart Mission
               </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Quiz;
