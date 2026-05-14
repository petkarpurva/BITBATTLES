const { validationResult } = require('express-validator');
const Chapter = require('../models/Chapter');

/**
 * @route   GET /api/chapters
 * @desc    Get all chapters
 * @access  Public
 */
const getAllChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find().sort({ unit: 1, chapterNumber: 1 });
    
    res.json({
      success: true,
      count: chapters.length,
      data: { chapters },
    });
  } catch (error) {
    console.error('Get chapters error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * @route   GET /api/chapters/:id
 * @desc    Get chapter by ID
 * @access  Public
 */
const getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      return res.status(404).json({ 
        success: false,
        message: 'Chapter not found' 
      });
    }

    res.json({
      success: true,
      data: { chapter },
    });
  } catch (error) {
    console.error('Get chapter error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Chapter not found' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * @route   GET /api/chapters/unit/:unit/chapter/:chapterNumber
 * @desc    Get chapter by unit and chapter number
 * @access  Public
 */
const getChapterByUnitAndNumber = async (req, res) => {
  try {
    const { unit, chapterNumber } = req.params;

    const chapter = await Chapter.findOne({ 
      unit: parseInt(unit), 
      chapterNumber: parseInt(chapterNumber) 
    });

    if (!chapter) {
      return res.status(404).json({ 
        success: false,
        message: `Chapter ${chapterNumber} in Unit ${unit} not found` 
      });
    }

    res.json({
      success: true,
      data: { chapter },
    });
  } catch (error) {
    console.error('Get chapter error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * @route   POST /api/chapters
 * @desc    Create a new chapter
 * @access  Public (should be admin-only in production)
 */
const createChapter = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { title, text, videoURL, unit, chapterNumber } = req.body;

    // Check if chapter already exists
    const existingChapter = await Chapter.findOne({ unit, chapterNumber });
    if (existingChapter) {
      return res.status(400).json({ 
        success: false,
        message: `Chapter ${chapterNumber} in Unit ${unit} already exists` 
      });
    }

    const chapter = new Chapter({
      title,
      text,
      videoURL,
      unit,
      chapterNumber,
    });

    await chapter.save();

    res.status(201).json({
      success: true,
      message: 'Chapter created successfully',
      data: { chapter },
    });
  } catch (error) {
    console.error('Create chapter error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * @route   PUT /api/chapters/:id
 * @desc    Update a chapter
 * @access  Public (should be admin-only in production)
 */
const updateChapter = async (req, res) => {
  try {
    const { title, text, videoURL, unit, chapterNumber } = req.body;

    let chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      return res.status(404).json({ 
        success: false,
        message: 'Chapter not found' 
      });
    }

    // Update fields
    if (title !== undefined) chapter.title = title;
    if (text !== undefined) chapter.text = text;
    if (videoURL !== undefined) chapter.videoURL = videoURL;
    if (unit !== undefined) chapter.unit = unit;
    if (chapterNumber !== undefined) chapter.chapterNumber = chapterNumber;

    await chapter.save();

    res.json({
      success: true,
      message: 'Chapter updated successfully',
      data: { chapter },
    });
  } catch (error) {
    console.error('Update chapter error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Chapter not found' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * @route   DELETE /api/chapters/:id
 * @desc    Delete a chapter
 * @access  Public (should be admin-only in production)
 */
const deleteChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      return res.status(404).json({ 
        success: false,
        message: 'Chapter not found' 
      });
    }

    await chapter.deleteOne();

    res.json({
      success: true,
      message: 'Chapter deleted successfully',
    });
  } catch (error) {
    console.error('Delete chapter error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Chapter not found' 
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
  getAllChapters,
  getChapterById,
  getChapterByUnitAndNumber,
  createChapter,
  updateChapter,
  deleteChapter,
};
