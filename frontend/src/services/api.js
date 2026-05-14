import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Chapters API
export const chaptersAPI = {
  getAll: () => api.get('/chapters'),
  getById: (id) => api.get(`/chapters/${id}`),
  getByUnitAndChapter: (unit, chapterNumber) => 
    api.get(`/chapters/unit/${unit}/chapter/${chapterNumber}`),
};

// Quiz API
export const quizAPI = {
  getByChapter: (chapterId) => api.get(`/quiz/chapter/${chapterId}`),
  getByChapterNumber: (chapterNumber) => api.get(`/quiz/number/${chapterNumber}`),
  getById: (id) => api.get(`/quiz/${id}`),
  submit: (data) => api.post('/quiz/submit', data),
};

// Compiler API
export const compilerAPI = {
  execute: (code) => api.post('/compiler/execute', { code }),
};

export default api;
