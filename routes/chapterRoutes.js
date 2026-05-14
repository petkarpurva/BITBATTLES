const express = require('express');
const { body } = require('express-validator');
const {
  getAllChapters,
  getChapterById,
  getChapterByUnitAndNumber,
  createChapter,
  updateChapter,
  deleteChapter,
} = require('../controllers/chapterController');

const router = express.Router();

/**
 * @route   GET /api/chapters
 * @desc    Get all chapters
 * @access  Public
 */
router.get('/', getAllChapters);

/**
 * @route   GET /api/chapters/:id
 * @desc    Get chapter by ID
 * @access  Public
 */
router.get('/:id', getChapterById);

/**
 * @route   GET /api/chapters/unit/:unit/chapter/:chapterNumber
 * @desc    Get chapter by unit and chapter number
 * @access  Public
 */
router.get('/unit/:unit/chapter/:chapterNumber', getChapterByUnitAndNumber);

/**
 * @route   POST /api/chapters
 * @desc    Create a new chapter
 * @access  Public (should be admin-only in production)
 */
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('text').trim().notEmpty().withMessage('Text is required'),
    body('unit').isInt({ min: 1 }).withMessage('Unit must be a positive integer'),
    body('chapterNumber')
      .isInt({ min: 1 })
      .withMessage('Chapter number must be a positive integer'),
  ],
  createChapter
);

/**
 * @route   PUT /api/chapters/:id
 * @desc    Update a chapter
 * @access  Public (should be admin-only in production)
 */
router.put('/:id', updateChapter);

/**
 * @route   DELETE /api/chapters/:id
 * @desc    Delete a chapter
 * @access  Public (should be admin-only in production)
 */
router.delete('/:id', deleteChapter);

module.exports = router;
