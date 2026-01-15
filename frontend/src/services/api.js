import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url,
      });
    } else if (error.request) {
      // Request made but no response
      console.error('API No Response:', error.request);
    } else {
      // Error in request setup
      console.error('API Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Overlay API methods
export const overlayAPI = {
  // Get all overlays
  getAll: () => api.get('/overlays'),

  // Get single overlay by ID
  getById: (id) => api.get(`/overlays/${id}`),

  // Create new overlay
  create: (overlayData) => api.post('/overlays', overlayData),

  // Update overlay
  update: (id, updateData) => api.put(`/overlays/${id}`, updateData),

  // Delete overlay
  delete: (id) => api.delete(`/overlays/${id}`),
};

// Stream API methods
export const streamAPI = {
  // Get all streams
  getAll: () => api.get('/streams'),

  // Get single stream by ID
  getById: (id) => api.get(`/streams/${id}`),

  // Start new stream
  start: (streamData) => api.post('/streams', streamData),

  // Stop stream
  stop: (id) => api.delete(`/streams/${id}`),

  // Stop all streams
  stopAll: () => api.post('/streams/stop-all'),
};

// Health check
export const healthCheck = () => api.get('/health', { baseURL: 'http://localhost:5000' });

export default api;
