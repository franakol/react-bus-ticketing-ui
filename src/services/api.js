import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

// Bus services
export const busService = {
  getAllBuses: () => api.get('/buses'),
  getBusById: (id) => api.get(`/buses/${id}`),
  createBus: (busData) => api.post('/buses', busData),
  updateBus: (id, busData) => api.put(`/buses/${id}`, busData),
  deleteBus: (id) => api.delete(`/buses/${id}`),
};

// Route services
export const routeService = {
  getAllRoutes: () => api.get('/routes'),
  getRouteById: (id) => api.get(`/routes/${id}`),
  createRoute: (routeData) => api.post('/routes', routeData),
  updateRoute: (id, routeData) => api.put(`/routes/${id}`, routeData),
  deleteRoute: (id) => api.delete(`/routes/${id}`),
};

// Schedule services
export const scheduleService = {
  getAllSchedules: () => api.get('/schedules'),
  getScheduleById: (id) => api.get(`/schedules/${id}`),
  getSchedulesByRoute: (routeId) => api.get(`/schedules/route/${routeId}`),
  createSchedule: (scheduleData) => api.post('/schedules', scheduleData),
  updateSchedule: (id, scheduleData) => api.put(`/schedules/${id}`, scheduleData),
  deleteSchedule: (id) => api.delete(`/schedules/${id}`),
};

// Booking services
export const bookingService = {
  getAllBookings: () => api.get('/bookings'),
  getUserBookings: () => api.get('/bookings/user'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  updateBooking: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
};

// Payment services
export const paymentService = {
  processPayment: (paymentData) => api.post('/payments', paymentData),
  getPaymentById: (id) => api.get(`/payments/${id}`),
  getUserPayments: () => api.get('/payments/user'),
};

// Admin services
export const adminService = {
  getDashboardStats: () => api.get('/admin/stats'),
  getAllUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserRole: (id, roleData) => api.put(`/admin/users/${id}/role`, roleData),
};

export default api;
