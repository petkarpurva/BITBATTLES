# BitBattles Frontend

Modern, visually stunning frontend for the BitBattles Python learning platform.

## 🎨 Features

- **Dark Mode Design** with glassmorphism effects
- **Smooth Animations** and micro-interactions
- **Responsive Layout** for all devices
- **Real-time Python Compiler** with syntax highlighting
- **Gamification** with XP tracking and level progression
- **JWT Authentication** with protected routes

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will run on `http://localhost:3000`

## 📋 Prerequisites

- Node.js 16+ installed
- Backend API running on `http://localhost:5000`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/          # Login & Register forms
│   └── common/        # Reusable components (Button, Card, Input)
├── context/
│   └── AuthContext.jsx  # Authentication state management
├── pages/
│   ├── Login.jsx      # Login page
│   ├── Register.jsx   # Registration page
│   ├── Dashboard.jsx  # Main dashboard
│   └── Compiler.jsx   # Python code editor
├── services/
│   └── api.js         # API service layer
├── styles/
│   └── index.css      # Global styles & design system
├── App.jsx            # Main app with routing
└── main.jsx           # React entry point
```

## 🎨 Design System

### Colors
- **Primary**: Purple gradient (#8B5CF6 → #3B82F6)
- **Secondary**: Cyan (#06B6D4)
- **Accent**: Green (#10B981)
- **Background**: Dark (#0F172A, #1E293B)

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: Responsive scale from 0.75rem to 2.25rem

### Components
- **Button**: Primary, secondary, and ghost variants with loading states
- **Card**: Glassmorphism effect with hover animations
- **Input**: Dark theme with focus states and error handling

## 🔌 API Integration

The frontend connects to the backend API via proxy configuration in `vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
}
```

All API calls are handled through the `services/api.js` module with automatic token management.

## 🛣️ Routes

- `/login` - User login (public)
- `/register` - User registration (public)
- `/dashboard` - Main dashboard (protected)
- `/compiler` - Python code editor (protected)

## 🔒 Authentication

- JWT tokens stored in localStorage
- Automatic token attachment to API requests
- Protected routes redirect to login if unauthenticated
- Auto-redirect to dashboard if already logged in

## 🎮 User Flow

1. **Register/Login** → Create account or sign in
2. **Dashboard** → View stats (XP, Level, Unit, Chapter)
3. **Compiler** → Write and execute Python code
4. **Quizzes** → Answer questions and earn XP (placeholder)
5. **Chapters** → Read story content (placeholder)

## 🎯 Key Features

### Dashboard
- User stats cards with icons
- XP and level display
- Quick navigation to features
- Logout functionality

### Python Compiler
- Code editor with syntax highlighting
- Real-time code execution
- Output/error display
- Terminal-style interface

### Authentication
- Form validation
- Error handling
- Loading states
- Smooth transitions

## 🎨 Styling

All styles use CSS custom properties (variables) for easy theming:

```css
--primary-500: #8B5CF6;
--bg-primary: #0F172A;
--text-primary: #F1F5F9;
--gradient-primary: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%);
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints at 768px and 1024px
- Flexible grid layouts
- Touch-friendly interactions

## 🚀 Performance

- Vite for fast development and builds
- Code splitting with React Router
- Optimized bundle size
- Lazy loading for routes

## 🔧 Development

```bash
# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📦 Dependencies

- **react** & **react-dom** - UI library
- **react-router-dom** - Routing
- **axios** - HTTP client
- **lucide-react** - Icons
- **vite** - Build tool
- **@vitejs/plugin-react** - Vite React plugin

## 🎨 Design Highlights

1. **Glassmorphism**: Frosted glass effect on cards
2. **Gradients**: Vibrant color gradients throughout
3. **Animations**: Smooth transitions and hover effects
4. **Dark Theme**: Easy on the eyes for long coding sessions
5. **Modern UI**: Clean, professional interface

## 🔮 Future Enhancements

- Chapter viewer with video player
- Quiz interface with XP animations
- Level-up celebration modal
- Progress tracking visualization
- Leaderboard
- User profile page
- Settings panel

## 📝 Notes

- Make sure the backend is running before starting the frontend
- The proxy configuration requires both servers to be running
- JWT tokens expire after 7 days
- All protected routes require authentication

---

Built with ❤️ using React + Vite
