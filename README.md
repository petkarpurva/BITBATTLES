# BitBattles Backend API

A complete backend for BitBattles - a story-driven gamified Python learning platform.

## 🚀 Features

- **User Authentication** - JWT-based registration and login
- **Progress Tracking** - XP, levels, and unit progression
- **Story Content** - CRUD operations for learning chapters
- **Quiz System** - Interactive quizzes with XP rewards
- **Python Compiler** - Execute Python code safely in the browser

## 📦 Installation

```bash
# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your MongoDB URI and JWT secret

# Start development server
npm run dev

# Start production server
npm start
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bitbattles
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000
```

---

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "xp": 0,
      "level": 1,
      "currentUnit": 1,
      "currentChapter": 1
    }
  }
}
```

### Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "xp": 150,
      "level": 2,
      "currentUnit": 1,
      "currentChapter": 3
    }
  }
}
```

### Get Current User
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "xp": 150,
      "level": 2,
      "currentUnit": 1,
      "currentChapter": 3
    }
  }
}
```

---

## Chapter Endpoints

### Get All Chapters
**GET** `/api/chapters`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": {
    "chapters": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Introduction to Python",
        "text": "Welcome to Python programming...",
        "videoURL": "https://youtube.com/watch?v=example",
        "unit": 1,
        "chapterNumber": 1,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

### Get Chapter by ID
**GET** `/api/chapters/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "chapter": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Introduction to Python",
      "text": "Welcome to Python programming...",
      "videoURL": "https://youtube.com/watch?v=example",
      "unit": 1,
      "chapterNumber": 1,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Get Chapter by Unit and Number
**GET** `/api/chapters/unit/:unit/chapter/:chapterNumber`

**Example:** `/api/chapters/unit/1/chapter/2`

**Response:**
```json
{
  "success": true,
  "data": {
    "chapter": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Variables and Data Types",
      "text": "In this chapter, we'll learn about...",
      "videoURL": "",
      "unit": 1,
      "chapterNumber": 2,
      "createdAt": "2024-01-15T11:00:00.000Z"
    }
  }
}
```

### Create Chapter
**POST** `/api/chapters`

**Request Body:**
```json
{
  "title": "Introduction to Python",
  "text": "Welcome to Python programming. In this chapter...",
  "videoURL": "https://youtube.com/watch?v=example",
  "unit": 1,
  "chapterNumber": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Chapter created successfully",
  "data": {
    "chapter": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Introduction to Python",
      "text": "Welcome to Python programming. In this chapter...",
      "videoURL": "https://youtube.com/watch?v=example",
      "unit": 1,
      "chapterNumber": 1,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Update Chapter
**PUT** `/api/chapters/:id`

**Request Body:**
```json
{
  "title": "Updated Title",
  "text": "Updated content..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Chapter updated successfully",
  "data": {
    "chapter": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Updated Title",
      "text": "Updated content...",
      "videoURL": "https://youtube.com/watch?v=example",
      "unit": 1,
      "chapterNumber": 1,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Delete Chapter
**DELETE** `/api/chapters/:id`

**Response:**
```json
{
  "success": true,
  "message": "Chapter deleted successfully"
}
```

---

## Quiz Endpoints

### Get Quizzes by Chapter
**GET** `/api/quiz/chapter/:chapterId`

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": {
    "quizzes": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "question": "What is the output of print(2 + 2)?",
        "options": ["2", "4", "22", "Error"],
        "xpReward": 10,
        "chapterId": {
          "_id": "507f1f77bcf86cd799439011",
          "title": "Introduction to Python",
          "unit": 1,
          "chapterNumber": 1
        },
        "createdAt": "2024-01-15T12:00:00.000Z"
      }
    ]
  }
}
```

### Get Quiz by ID
**GET** `/api/quiz/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "quiz": {
      "_id": "507f1f77bcf86cd799439013",
      "question": "What is the output of print(2 + 2)?",
      "options": ["2", "4", "22", "Error"],
      "xpReward": 10,
      "chapterId": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Introduction to Python",
        "unit": 1,
        "chapterNumber": 1
      },
      "createdAt": "2024-01-15T12:00:00.000Z"
    }
  }
}
```

### Submit Quiz Answer
**POST** `/api/quiz/submit`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quizId": "507f1f77bcf86cd799439013",
  "answer": 1
}
```

**Response (Correct Answer):**
```json
{
  "success": true,
  "data": {
    "correct": true,
    "correctAnswer": 1,
    "explanation": "Correct! You earned 10 XP.",
    "xpEarned": 10,
    "totalXP": 160,
    "level": 2,
    "leveledUp": false
  }
}
```

**Response (Level Up):**
```json
{
  "success": true,
  "data": {
    "correct": true,
    "correctAnswer": 1,
    "explanation": "Correct! You earned 10 XP.",
    "xpEarned": 10,
    "totalXP": 110,
    "level": 2,
    "leveledUp": true,
    "levelUpMessage": "Congratulations! You've reached Level 2!"
  }
}
```

**Response (Incorrect Answer):**
```json
{
  "success": true,
  "data": {
    "correct": false,
    "correctAnswer": 1,
    "explanation": "Incorrect. The correct answer was: 4",
    "xpEarned": 0,
    "totalXP": 150,
    "level": 2,
    "leveledUp": false
  }
}
```

### Create Quiz
**POST** `/api/quiz`

**Request Body:**
```json
{
  "question": "What is the output of print(2 + 2)?",
  "options": ["2", "4", "22", "Error"],
  "correctAnswer": 1,
  "xpReward": 10,
  "chapterId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Quiz created successfully",
  "data": {
    "quiz": {
      "_id": "507f1f77bcf86cd799439013",
      "question": "What is the output of print(2 + 2)?",
      "options": ["2", "4", "22", "Error"],
      "correctAnswer": 1,
      "xpReward": 10,
      "chapterId": "507f1f77bcf86cd799439011",
      "createdAt": "2024-01-15T12:00:00.000Z"
    }
  }
}
```

---

## Python Compiler Endpoint

### Execute Python Code
**POST** `/api/compiler/execute`

**Request Body:**
```json
{
  "code": "print('Hello, World!')\nprint(2 + 2)"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Code executed successfully",
  "data": {
    "output": "Hello, World!\n4\n",
    "executionTime": "< 5s"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Code execution failed",
  "error": "SyntaxError: invalid syntax"
}
```

**Response (Timeout):**
```json
{
  "success": false,
  "message": "Code execution timed out (5 second limit)",
  "error": "Timeout"
}
```

---

## 📊 Level Progression System

| Level | XP Range |
|-------|----------|
| 1     | 0 - 100  |
| 2     | 101 - 250 |
| 3     | 251 - 500 |
| 4     | 501 - 1000 |
| 5+    | +500 XP per level |

## 🔒 Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are valid for 7 days.

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## 📝 Notes

- The Python compiler requires Python to be installed on the server
- Admin routes (create/update/delete chapters and quizzes) should be protected in production
- Make sure MongoDB is running before starting the server
- Change the JWT_SECRET in production to a secure random string

## 🚦 Running the Server

```bash
# Make sure MongoDB is running
# On Windows with MongoDB installed:
# mongod

# Start the development server
npm run dev

# Or start the production server
npm start
```

The server will be available at `http://localhost:5000`

## ✅ Testing the API

You can test the API using:
- **Postman** - Import the endpoints and test
- **cURL** - Command line testing
- **Thunder Client** (VS Code extension)
- **Any HTTP client**

### Example cURL Commands

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get chapters
curl http://localhost:5000/api/chapters

# Execute Python code
curl -X POST http://localhost:5000/api/compiler/execute \
  -H "Content-Type: application/json" \
  -d '{"code":"print(\"Hello, World!\")"}'
```
