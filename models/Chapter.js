const mongoose = require('mongoose');

/**
 * Chapter Schema
 * Stores story chapters with associated content
 */
const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Chapter title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  difficulty: {
    type: String,
    default: 'Easy',
  },
  difficultyColor: {
    type: String,
    default: '#10B981',
  },
  text: {
    type: String,
    required: [true, 'Chapter text is required'],
  },
  videoURL: {
    type: String,
    trim: true,
    default: '',
  },
  unit: {
    type: Number,
    required: [true, 'Unit number is required'],
    min: 1,
  },
  chapterNumber: {
    type: Number,
    required: [true, 'Chapter number is required'],
    min: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index for efficient queries by unit and chapter
chapterSchema.index({ unit: 1, chapterNumber: 1 }, { unique: true });

module.exports = mongoose.model('Chapter', chapterSchema);
