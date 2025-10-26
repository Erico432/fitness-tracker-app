import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);
export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (userData) => api.put('/auth/profile', userData);

// Workout API
export const getWorkouts = () => api.get('/workouts');
export const getWorkoutById = (id) => api.get(`/workouts/${id}`);
export const createWorkout = (workoutData) => api.post('/workouts', workoutData);
export const updateWorkout = (id, workoutData) => api.put(`/workouts/${id}`, workoutData);
export const deleteWorkout = (id) => api.delete(`/workouts/${id}`);
export const getWorkoutStats = () => api.get('/workouts/stats');

// Health Metrics API
export const getHealthMetrics = () => api.get('/health-metrics');
export const getHealthMetricById = (id) => api.get(`/health-metrics/${id}`);
export const createHealthMetric = (metricData) => api.post('/health-metrics', metricData);
export const updateHealthMetric = (id, metricData) => api.put(`/health-metrics/${id}`, metricData);
export const deleteHealthMetric = (id) => api.delete(`/health-metrics/${id}`);

// Achievements API
export const getAchievements = () => api.get('/achievements');
export const getUserAchievements = () => api.get('/achievements/user');
export const checkAchievements = () => api.post('/achievements/check');

// Goals API
export const getGoals = () => api.get('/goals');
export const createGoal = (goalData) => api.post('/goals', goalData);
export const updateGoal = (id, goalData) => api.put(`/goals/${id}`, goalData);
export const updateGoalProgress = (id) => api.put(`/goals/${id}/progress`);
export const deleteGoal = (id) => api.delete(`/goals/${id}`);

// Templates API
export const getTemplates = (params) => api.get('/templates', { params });
export const getTemplateById = (id) => api.get(`/templates/${id}`);
export const markTemplateAsUsed = (id) => api.post(`/templates/${id}/use`);
export const createTemplate = (templateData) => api.post('/templates', templateData);

// Streak API
export const getStreak = () => api.get('/streak');
export const updateStreak = () => api.post('/streak/update');
export const getLeaderboard = () => api.get('/streak/leaderboard');

export default api;
