import './Card.css';

const Card = ({ children, className = '', hover = false, glow = false }) => {
  return (
    <div className={`card ${hover ? 'card-hover' : ''} ${glow ? 'card-glow' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
