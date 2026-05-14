import api from './api';

// Progress API
export const progressAPI = {
  addXP: (xpGained, source) => api.post('/progress/xp', { xpGained, source }),
  completeChapter: (chapterId, chapterNumber, xpReward) => 
    api.post('/progress/chapter/complete', { chapterId, chapterNumber, xpReward }),
  getStats: () => api.get('/progress/stats'),
};

export default progressAPI;
