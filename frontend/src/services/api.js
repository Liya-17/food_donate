import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
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
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/updatepassword', data),
  logout: () => api.post('/auth/logout'),
};

// Donation API
export const donationAPI = {
  getDonations: (params) => api.get('/donations', { params }),
  getDonation: (id) => api.get(`/donations/${id}`),
  getMyDonations: (params) => api.get('/users/donations', { params }),
  createDonation: (data) => api.post('/donations', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateDonation: (id, data) => api.put(`/donations/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteDonation: (id) => api.delete(`/donations/${id}`),
  claimDonation: (id) => api.post(`/donations/${id}/claim`),
  completeDonation: (id) => api.post(`/donations/${id}/complete`),
  cancelDonation: (id) => api.post(`/donations/${id}/cancel`),
};

// Request API
export const requestAPI = {
  getRequests: (params) => api.get('/requests', { params }),
  getRequest: (id) => api.get(`/requests/${id}`),
  createRequest: (data) => api.post('/requests', data),
  acceptRequest: (id, data) => api.put(`/requests/${id}/accept`, data),
  rejectRequest: (id, data) => api.put(`/requests/${id}/reject`, data),
  cancelRequest: (id, data) => api.put(`/requests/${id}/cancel`, data),
};

// User API
export const userAPI = {
  getUserProfile: (id) => api.get(`/users/profile/${id}`),
  updateProfile: (data) => api.put('/users/profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getUserDonations: (params) => api.get('/users/donations', { params }),
  getClaimedDonations: (params) => api.get('/users/claimed-donations', { params }),
  getDashboardStats: () => api.get('/users/stats'),
  deactivateAccount: () => api.put('/users/deactivate'),
};

// Notification API
export const notificationAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  clearReadNotifications: () => api.delete('/notifications/clear-read'),
};

// Geocoding API
export const geocodingAPI = {
  geocode: (address) => api.post('/geocoding/geocode', { address }),
  reverseGeocode: (latitude, longitude) => api.post('/geocoding/reverse', { latitude, longitude }),
  searchLocations: (query, limit = 5) => api.get('/geocoding/search', { params: { q: query, limit } }),
};

// Smart Matching API
export const matchingAPI = {
  getSmartMatches: (limit = 10) => api.get('/matching/smart-matches', { params: { limit } }),
  getMatchScore: (donationId) => api.get(`/matching/score/${donationId}`),
  getPreferences: () => api.get('/matching/preferences'),
  updatePreferences: (data) => api.put('/matching/preferences', data),
  notifyMatchingReceivers: (donationId, limit = 20) => api.post(`/matching/notify/${donationId}`, null, { params: { limit } }),
  getMatchingStats: () => api.get('/matching/stats'),
};

export default api;
