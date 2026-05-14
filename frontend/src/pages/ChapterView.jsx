import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Copy, Check } from 'lucide-react';
import Button from '../components/common/Button';
import './ChapterView.css';

const ChapterView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [copied, setCopied] = useState(false);

  const chapterDatabase = {
    "1": {
      id: 1,
      title: "Chapter 1: Introduction to Python",
      summary: [
        "Python is a language used to communicate with machines",
        "You can give instructions and see output",
        "Example below shows your first command"
      ],
      videoUrl: "/chap1.mp4",
      codeConcept: 'print("Hello World")',
      codeExplanation: "This prints text on the screen"
    },
    "2": {
      id: 2,
      title: "Chapter 2: Variables & Data Types",
      summary: [
        "Variables act as labeled boxes where you can store data",
        "You can store text, numbers, or true/false values",
        "Example below shows how to save a player's name"
      ],
      videoUrl: "/chap2.mp4",
      codeConcept: 'player_name = "Hero"\nlevel = 1',
      codeExplanation: "This saves the text 'Hero' into a variable called player_name"
    },
    "3": {
      id: 3,
      title: "Chapter 3: Control Flow",
      summary: [
        "Control flow lets your code make choices based on conditions",
        "You can run different code depending on if something is true or false",
        "Example below checks if a player's level is high enough"
      ],
      videoUrl: "/chap3.mp4",
      codeConcept: 'if level >= 2:\n    print("Access Granted")',
      codeExplanation: "This checks a condition and only prints if it is true"
    }
  };

  const chapterData = chapterDatabase[id];

  if (!chapterData) {
    return (
      <div className="chapter-view-container not-found">
        <h2>Chapter Data Not Found</h2>
        <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(chapterData.codeConcept);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartMission = () => {
    navigate(`/quiz/${chapterData.id}`);
  };

  return (
    <div className="chapter-view-container">
      {/* 1. Small Title (top) */}
      <div className="chapter-header">
        <h1 className="chapter-page-title">{chapterData.title}</h1>
      </div>

      {/* 2. Video (Main Focus) */}
      <div className="video-section">
        <video 
          className="main-video"
          src={chapterData.videoUrl}
          playsInline
          controls
          poster="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        >
          Your browser does not support HTML5 video.
        </video>
      </div>

      <div className="content-section">
        {/* 3. Summary Section (VERY SIMPLE) */}
        <div className="summary-section">
          <h2 className="summary-title">Quick Summary</h2>
          <ul className="summary-list">
            {chapterData.summary.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>

        {/* 4. Code Block */}
        <div className="code-section">
          <div className="code-container">
            <div className="code-header">
              <span className="lang-name">Python</span>
              <button className="copy-btn" onClick={handleCopyCode} title="Copy code">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <pre className="code-block">
              <code>{chapterData.codeConcept}</code>
            </pre>
          </div>
          <p className="code-explanation">{chapterData.codeExplanation}</p>
        </div>

        {/* 5. CTA Button */}
        <div className="action-section">
          <Button 
            size="lg"
            className="start-btn" 
            onClick={handleStartMission}
          >
            Start
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChapterView;
