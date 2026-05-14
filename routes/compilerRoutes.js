const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { executeCode } = require('../controllers/compilerController');

const router = express.Router();

// Rate limiter: maximum 15 requests per 1 minute window
const compilerLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 15, 
  message: {
    success: false,
    message: 'Too many compilation requests. Please wait a minute and try again.',
  },
});

/**
 * @route   POST /api/compiler/execute
 * @desc    Execute Python code
 * @access  Public
 */
router.post(
  '/execute',
  compilerLimiter,
  [
    body('code').trim().notEmpty().withMessage('Code is required'),
    body('code').isLength({ max: 50000 }).withMessage('Code exceeds maximum allowed length of 50,000 characters'),
  ],
  executeCode
);

module.exports = router;
