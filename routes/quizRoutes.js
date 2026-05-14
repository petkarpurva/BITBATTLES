const express = require('express');
const { body } = require('express-validator');
const {
  getQuizzesByChapter,
  getQuizzesByChapterNumber,
  submitQuiz,
  createQuiz,
  getQuizById,
} = require('../controllers/quizController');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/quiz/chapter/:chapterId
 * @desc    Get all quizzes for a chapter by ObjectId
 * @access  Public
 */
router.get('/chapter/:chapterId', getQuizzesByChapter);

/**
 * @route   GET /api/quiz/number/:chapterNumber
 * @desc    Get all quizzes for a chapter by its number
 * @access  Public
 */
router.get('/number/:chapterNumber', getQuizzesByChapterNumber);

/**
 * @route   GET /api/quiz/:id
 * @desc    Get quiz by ID
 * @access  Public
 */
router.get('/:id', getQuizById);

/**
 * @route   POST /api/quiz/submit
 * @desc    Submit quiz answer
 * @access  Private
 */
router.post(
  '/submit',
  auth,
  [
    body('quizId').notEmpty().withMessage('Quiz ID is required'),
    body('answer').isInt({ min: 0 }).withMessage('Answer must be a valid index'),
  ],
  submitQuiz
);

/**
 * @route   POST /api/quiz
 * @desc    Create a new quiz
 * @access  Public (should be admin-only in production)
 */
router.post(
  '/',
  [
    body('question').trim().notEmpty().withMessage('Question is required'),
    body('options')
      .isArray({ min: 2, max: 6 })
      .withMessage('Options must be an array with 2-6 items'),
    body('correctAnswer')
      .isInt({ min: 0 })
      .withMessage('Correct answer must be a valid index'),
    body('xpReward')
      .isInt({ min: 1 })
      .withMessage('XP reward must be at least 1'),
    body('chapterId').notEmpty().withMessage('Chapter ID is required'),
  ],
  createQuiz
);

module.exports = router;
