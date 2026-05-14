const { validationResult } = require('express-validator');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Chapter = require('../models/Chapter');

/**
 * @route   GET /api/quiz/chapter/:chapterId
 * @desc    Get all quizzes for a specific chapter by its ObjectId
 * @access  Public
 */
const getQuizzesByChapter = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ chapterId: req.params.chapterId })
      .select('-correctAnswer') // Don't send correct answer to client
      .populate('chapterId', 'title unit chapterNumber');

    res.json({
      success: true,
      count: quizzes.length,
      data: { quizzes },
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * @route   GET /api/quiz/number/:chapterNumber
 * @desc    Get all quizzes for a specific chapter by chapter number
 * @access  Public
 */
const getQuizzesByChapterNumber = async (req, res) => {
  try {
    const chapter = await Chapter.findOne({ chapterNumber: req.params.chapterNumber });
    
    if (!chapter) {
      return res.status(404).json({ 
        success: false,
        message: 'Chapter not found' 
      });
    }

    const quizzes = await Quiz.find({ chapterId: chapter._id })
      .select('-correctAnswer')
      .populate('chapterId', 'title unit chapterNumber');

    res.json({
      success: true,
      count: quizzes.length,
      data: { quizzes },
    });
  } catch (error) {
    console.error('Get quizzes by chapter number error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * @route   POST /api/quiz/submit
 * @desc    Submit quiz answer and update user XP
 * @access  Private
 */
const submitQuiz = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { quizId, answer } = req.body;

    // Find quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ 
        success: false,
        message: 'Quiz not found' 
      });
    }

    // Validate answer
    if (answer < 0 || answer >= quiz.options.length) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid answer index' 
      });
    }

    // Check if answer is correct
    const isCorrect = answer === quiz.correctAnswer;

    // Update user XP if correct
    let updatedUser = null;
    let leveledUp = false;
    let oldLevel = req.user.level;

    if (isCorrect) {
      const user = await User.findById(req.user._id);
      user.xp += quiz.xpReward;
      
      // Update level based on new XP
      const newLevel = user.calculateLevel();
      leveledUp = newLevel > oldLevel;
      user.level = newLevel;

      await user.save();
      updatedUser = user;
    }

    res.json({
      success: true,
      data: {
        correct: isCorrect,
        correctAnswer: quiz.correctAnswer,
        explanation: isCorrect 
          ? `Correct! You earned ${quiz.xpReward} XP.` 
          : `Incorrect. The correct answer was: ${quiz.options[quiz.correctAnswer]}`,
        xpEarned: isCorrect ? quiz.xpReward : 0,
        totalXP: updatedUser ? updatedUser.xp : req.user.xp,
        level: updatedUser ? updatedUser.level : req.user.level,
        leveledUp,
        ...(leveledUp && { 
          levelUpMessage: `Congratulations! You've reached Level ${updatedUser.level}!` 
        }),
      },
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * @route   POST /api/quiz
 * @desc    Create a new quiz
 * @access  Public (should be admin-only in production)
 */
const createQuiz = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { question, options, correctAnswer, xpReward, chapterId } = req.body;

    const quiz = new Quiz({
      question,
      options,
      correctAnswer,
      xpReward,
      chapterId,
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: { quiz },
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * @route   GET /api/quiz/:id
 * @desc    Get quiz by ID (without correct answer)
 * @access  Public
 */
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .select('-correctAnswer')
      .populate('chapterId', 'title unit chapterNumber');

    if (!quiz) {
      return res.status(404).json({ 
        success: false,
        message: 'Quiz not found' 
      });
    }

    res.json({
      success: true,
      data: { quiz },
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Quiz not found' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

module.exports = {
  getQuizzesByChapter,
  getQuizzesByChapterNumber,
  submitQuiz,
  createQuiz,
  getQuizById,
};
