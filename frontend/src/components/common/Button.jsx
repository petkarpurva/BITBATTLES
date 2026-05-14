import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${loading ? 'btn-loading' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner"></span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
