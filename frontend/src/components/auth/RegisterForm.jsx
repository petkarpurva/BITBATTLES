import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import './AuthForms.css';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="auth-card">
      <div className="auth-header">
        <h1 className="auth-title text-gradient">Join BitBattles</h1>
        <p className="auth-subtitle">Start your Python mastery journey</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-error">{error}</div>}
        
        <Input
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <Button type="submit" loading={loading} size="lg" className="auth-submit">
          Create Account
        </Button>
      </form>

      <div className="auth-footer">
        <p>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
      </div>
    </Card>
  );
};

export default RegisterForm;
