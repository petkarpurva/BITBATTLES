const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST /api/progress/xp
// @desc    Add XP to user and update level
// @access  Private
router.post('/xp', auth, async (req, res) => {
  try {
    const { xpGained, source } = req.body;

    if (!xpGained || xpGained <= 0) {
      return res.status(400).json({ message: 'Invalid XP amount' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add XP
    user.xp += xpGained;

    if (source === 'battle') {
      user.battlesWon = (user.battlesWon || 0) + 1;
    }

    // Calculate new level (every 200 XP = 1 level)
    const newLevel = Math.floor(user.xp / 200) + 1;
    const leveledUp = newLevel > user.level;
    
    user.level = newLevel;

    await user.save();

    res.json({
      success: true,
      xpGained,
      totalXP: user.xp,
      level: user.level,
      leveledUp,
      nextLevelXP: newLevel * 200,
      message: leveledUp ? `Congratulations! You reached level ${newLevel}!` : 'XP added successfully'
    });
  } catch (error) {
    console.error('Error adding XP:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/progress/chapter/complete
// @desc    Mark chapter as complete and award XP
// @access  Private
router.post('/chapter/complete', auth, async (req, res) => {
  try {
    const { chapterId, chapterNumber, xpReward } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if chapter already completed
    const alreadyCompleted = user.completedChapters.includes(chapterId);
    
    if (!alreadyCompleted) {
      user.completedChapters.push(chapterId);
      user.xp += xpReward || 100;
      
      // Update current chapter if this is the next one
      if (chapterNumber === user.currentChapter + 1) {
        user.currentChapter = chapterNumber;
      }

      // Calculate new level
      user.level = Math.floor(user.xp / 200) + 1;

      await user.save();
    }

    res.json({
      success: true,
      xpGained: alreadyCompleted ? 0 : (xpReward || 100),
      totalXP: user.xp,
      level: user.level,
      completedChapters: user.completedChapters,
      alreadyCompleted
    });
  } catch (error) {
    console.error('Error completing chapter:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/progress/stats
// @desc    Get user progress statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentLevelXP = (user.level - 1) * 200;
    const nextLevelXP = user.level * 200;
    const xpInCurrentLevel = user.xp - currentLevelXP;
    const xpNeededForNextLevel = nextLevelXP - user.xp;

    res.json({
      xp: user.xp,
      level: user.level,
      currentChapter: user.currentChapter,
      completedChapters: user.completedChapters,
      currentLevelXP,
      nextLevelXP,
      xpInCurrentLevel,
      xpNeededForNextLevel,
      progress: (xpInCurrentLevel / 200) * 100
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
