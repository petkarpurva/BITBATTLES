const mongoose = require('mongoose');

/**
 * User Schema
 * Stores user authentication data and progress tracking
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  xp: {
    type: Number,
    default: 0,
    min: 0,
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
  },
  currentUnit: {
    type: Number,
    default: 1,
    min: 1,
  },
  currentChapter: {
    type: Number,
    default: 1,
    min: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedChapters: {
    type: [Number],
    default: [],
  },
  battlesWon: {
    type: Number,
    default: 0,
    min: 0,
  },
  quizzesTotal: {
    type: Number,
    default: 0,
    min: 0,
  },
  quizzesCorrect: {
    type: Number,
    default: 0,
    min: 0,
  },
});

/**
 * Calculate user level based on XP
 * Level progression: 
 * Level 1: 0-100 XP
 * Level 2: 101-250 XP
 * Level 3: 251-500 XP
 * Level 4: 501-1000 XP
 * Level 5+: +500 XP per level
 */
userSchema.methods.calculateLevel = function() {
  if (this.xp <= 100) return 1;
  if (this.xp <= 250) return 2;
  if (this.xp <= 500) return 3;
  if (this.xp <= 1000) return 4;
  return 5 + Math.floor((this.xp - 1000) / 500);
};

/**
 * Update user level based on current XP
 */
userSchema.methods.updateLevel = function() {
  this.level = this.calculateLevel();
};

module.exports = mongoose.model('User', userSchema);
