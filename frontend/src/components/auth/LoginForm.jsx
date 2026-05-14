import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import './AuthForms.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="auth-card">
      <div className="auth-header">
        <h1 className="auth-title text-gradient">Welcome Back</h1>
        <p className="auth-subtitle">Continue your Python learning journey</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-error">{error}</div>}
        
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
          Sign In
        </Button>
      </form>

      <div className="auth-footer">
        <p>Don't have an account? <Link to="/register" className="auth-link">Sign up</Link></p>
      </div>
    </Card>
  );
};

export default LoginForm;
