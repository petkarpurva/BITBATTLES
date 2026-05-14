import './ProgressBar.css';

const ProgressBar = ({ current, max, label, showLabel = true }) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="progress-container">
      {showLabel && (
        <div className="progress-header">
          <span className="progress-label">{label}</span>
          <span className="progress-value">{current} / {max} XP</span>
        </div>
      )}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        >
          <div className="progress-glow"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
