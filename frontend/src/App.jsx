import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Battles from './pages/Battles';
import ChapterView from './pages/ChapterView';
import Quiz from './pages/Quiz';
import Compiler from './pages/Compiler';
import './styles/index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        fontSize: '1.5rem',
        color: 'var(--text-secondary)'
      }}>
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/battles" element={<ProtectedRoute><Battles /></ProtectedRoute>} />
        <Route path="/chapters/:id" element={<ProtectedRoute><ChapterView /></ProtectedRoute>} />
        <Route path="/quiz/:chapterId" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        <Route path="/compiler" element={<ProtectedRoute><Compiler /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
