const mongoose = require('mongoose');

/**
 * Quiz Schema
 * Stores quiz questions with multiple choice answers
 */
const quizSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function(arr) {
        return arr.length >= 2 && arr.length <= 6;
      },
      message: 'Quiz must have between 2 and 6 options',
    },
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: 0,
    validate: {
      validator: function(val) {
        return val < this.options.length;
      },
      message: 'Correct answer index must be valid',
    },
  },
  xpReward: {
    type: Number,
    required: [true, 'XP reward is required'],
    min: 1,
    default: 10,
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: [true, 'Chapter ID is required'],
  },
  difficulty: {
    type: String,
    default: 'Easy',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Quiz', quizSchema);
