require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const quizRoutes = require('./routes/quizRoutes');
const compilerRoutes = require('./routes/compilerRoutes');
const progressRoutes = require('./routes/progress');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/compiler', compilerRoutes);
app.use('/api/progress', progressRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to BitBattles API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      chapters: '/api/chapters',
      quiz: '/api/quiz',
      compiler: '/api/compiler',
      progress: '/api/progress',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API available at http://localhost:${PORT}`);
  });
}

module.exports = app;
