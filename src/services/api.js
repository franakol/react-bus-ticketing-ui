import axios from 'axios';
import { mockRoutes, mockSchedules, mockBookings, mockUser } from './mockData';

const API_URL = 'http://localhost:8000';
const USE_MOCK_DATA = true; // Set to false when backend is available

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

// Helper function to simulate API delay
const mockDelay = (data, delay = 500) => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ data }), delay);
  });
};

// Auth services
export const authService = {
  login: (credentials) => {
    if (USE_MOCK_DATA) {
      if (credentials.email === 'user@example.com' && credentials.password === 'password') {
        return mockDelay({
          access_token: 'mock-token-12345',
          user: mockUser
        });
      }
      return Promise.reject({ response: { data: { detail: 'Invalid credentials' } } });
    }
    return api.post('/auth/login', credentials);
  },
  register: (userData) => {
    if (USE_MOCK_DATA) {
      return mockDelay({ message: 'User registered successfully' });
    }
    return api.post('/auth/register', userData);
  },
  getCurrentUser: () => {
    if (USE_MOCK_DATA) {
      return mockDelay(mockUser);
    }
    return api.get('/auth/me');
  },
};

// Bus services
export const busService = {
  getAllBuses: () => {
    if (USE_MOCK_DATA) {
      return mockDelay([
        { id: 1, name: 'Volcano Express', capacity: 45, type: 'Luxury' },
        { id: 2, name: 'Virunga Deluxe', capacity: 36, type: 'Premium' },
        { id: 3, name: 'Southern Comfort', capacity: 50, type: 'Standard' }
      ]);
    }
    return api.get('/buses');
  },
  getBusById: (id) => {
    if (USE_MOCK_DATA) {
      return mockDelay({ id, name: 'Volcano Express', capacity: 45, type: 'Luxury' });
    }
    return api.get(`/buses/${id}`);
  },
  createBus: (busData) => {
    if (USE_MOCK_DATA) {
      return mockDelay({ id: 4, ...busData });
    }
    return api.post('/buses', busData);
  },
  updateBus: (id, busData) => {
    if (USE_MOCK_DATA) {
      return mockDelay({ id, ...busData });
    }
    return api.put(`/buses/${id}`, busData);
  },
  deleteBus: (id) => {
    if (USE_MOCK_DATA) {
      return mockDelay({ message: 'Bus deleted successfully' });
    }
    return api.delete(`/buses/${id}`);
  },
};

// Route services
export const routeService = {
  getAllRoutes: () => {
    if (USE_MOCK_DATA) {
      return mockDelay(mockRoutes);
    }
    return api.get('/routes');
  },
  getRouteById: (id) => {
    if (USE_MOCK_DATA) {
      const route = mockRoutes.find(r => r.id === Number(id));
      if (route) {
        return mockDelay(route);
      }
      return Promise.reject({ response: { status: 404, data: { detail: 'Route not found' } } });
    }
    return api.get(`/routes/${id}`);
  },
  createRoute: (routeData) => {
    if (USE_MOCK_DATA) {
      return mockDelay({ id: mockRoutes.length + 1, ...routeData });
    }
    return api.post('/routes', routeData);
  },
  updateRoute: (id, routeData) => {
    if (USE_MOCK_DATA) {
      return mockDelay({ id: Number(id), ...routeData });
    }
    return api.put(`/routes/${id}`, routeData);
  },
  deleteRoute: (id) => {
    if (USE_MOCK_DATA) {
      return mockDelay({ message: 'Route deleted successfully' });
    }
    return api.delete(`/routes/${id}`);
  },
};

// Schedule services
export const scheduleService = {
  getAllSchedules: () => {
    if (USE_MOCK_DATA) {
      return mockDelay(mockSchedules);
    }
    return api.get('/schedules');
  },
  getScheduleById: (id) => {
    if (USE_MOCK_DATA) {
      const schedule = mockSchedules.find(s => s.id === Number(id));
      if (schedule) {
        return mockDelay(schedule);
      }
      return Promise.reject({ response: { status: 404, data: { detail: 'Schedule not found' } } });
    }
    return api.get(`/schedules/${id}`);
  },
  getSchedulesByRoute: (routeId) => {
    if (USE_MOCK_DATA) {
      const schedules = mockSchedules.filter(s => s.route_id === Number(routeId));
      return mockDelay(schedules);
    }
    return api.get(`/schedules/route/${routeId}`);
  },
  createSchedule: (scheduleData) => {
    if (USE_MOCK_DATA) {
      return mockDelay({ id: mockSchedules.length + 1, ...scheduleData });
    }
    return api.post('/schedules', scheduleData);
  },
  updateSchedule: (id, scheduleData) => {
    if (USE_MOCK_DATA) {
      return mockDelay({ id: Number(id), ...scheduleData });
    }
    return api.put(`/schedules/${id}`, scheduleData);
  },
  deleteSchedule: (id) => {
    if (USE_MOCK_DATA) {
      return mockDelay({ message: 'Schedule deleted successfully' });
    }
    return api.delete(`/schedules/${id}`);
  },
};

// Booking services
export const bookingService = {
  getAllBookings: () => {
    if (USE_MOCK_DATA) {
      return mockDelay(mockBookings);
    }
    return api.get('/bookings');
  },
  getUserBookings: () => {
    if (USE_MOCK_DATA) {
      return mockDelay(mockBookings);
    }
    return api.get('/bookings/user');
  },
  getBookingById: (id) => {
    if (USE_MOCK_DATA) {
      const booking = mockBookings.find(b => b.id === Number(id));
      if (booking) {
        return mockDelay(booking);
      }
      return Promise.reject({ response: { status: 404, data: { detail: 'Booking not found' } } });
    }
    return api.get(`/bookings/${id}`);
  },
  createBooking: (bookingData) => {
    if (USE_MOCK_DATA) {
      const newBooking = {
        id: mockBookings.length + 1,
        booking_reference: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'pending',
        payment_status: 'pending',
        created_at: new Date().toISOString(),
        ...bookingData
      };
      return mockDelay(newBooking);
    }
    return api.post('/bookings', bookingData);
  },
  updateBooking: (id, bookingData) => {
    if (USE_MOCK_DATA) {
      return mockDelay({ id: Number(id), ...bookingData });
    }
    return api.put(`/bookings/${id}`, bookingData);
  },
  cancelBooking: (id) => {
    if (USE_MOCK_DATA) {
      return mockDelay({ message: 'Booking cancelled successfully' });
    }
    return api.delete(`/bookings/${id}`);
  },
};

// Payment services
export const paymentService = {
  processPayment: (paymentData) => {
    if (USE_MOCK_DATA) {
      return mockDelay({
        id: Math.floor(1000 + Math.random() * 9000),
        status: 'completed',
        amount: paymentData.amount,
        payment_method: paymentData.payment_method,
        transaction_id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
        created_at: new Date().toISOString()
      });
    }
    return api.post('/payments', paymentData);
  },
  getPaymentById: (id) => {
    if (USE_MOCK_DATA) {
      return mockDelay({
        id: Number(id),
        status: 'completed',
        amount: 30000,
        payment_method: 'credit_card',
        transaction_id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
        created_at: new Date().toISOString()
      });
    }
    return api.get(`/payments/${id}`);
  },
  getUserPayments: () => {
    if (USE_MOCK_DATA) {
      return mockDelay([
        {
          id: 1,
          booking_id: 1,
          status: 'completed',
          amount: 30000,
          payment_method: 'credit_card',
          transaction_id: 'TX-123456',
          created_at: new Date(2025, 4, 5).toISOString()
        }
      ]);
    }
    return api.get('/payments/user');
  },
};

// Admin services
export const adminService = {
  getDashboardStats: () => {
    if (USE_MOCK_DATA) {
      return mockDelay({
        total_users: 120,
        total_bookings: 450,
        total_revenue: 8750500,
        recent_bookings: 25,
        popular_routes: [
          { route_id: 1, count: 120 },
          { route_id: 3, count: 85 },
          { route_id: 2, count: 65 }
        ]
      });
    }
    return api.get('/admin/stats');
  },
  getAllUsers: () => {
    if (USE_MOCK_DATA) {
      return mockDelay([
        mockUser,
        {
          id: 2,
          full_name: 'Jane Smith',
          email: 'jane@example.com',
          phone_number: '+250788654321',
          role: 'customer'
        },
        {
          id: 3,
          full_name: 'Admin User',
          email: 'admin@example.com',
          phone_number: '+250788123123',
          role: 'admin'
        }
      ]);
    }
    return api.get('/admin/users');
  },
  getUserById: (id) => {
    if (USE_MOCK_DATA) {
      if (id === '1') {
        return mockDelay(mockUser);
      }
      return mockDelay({
        id: Number(id),
        full_name: 'Jane Smith',
        email: 'jane@example.com',
        phone_number: '+250788654321',
        role: 'customer'
      });
    }
    return api.get(`/admin/users/${id}`);
  },
  updateUserRole: (id, roleData) => {
    if (USE_MOCK_DATA) {
      return mockDelay({
        id: Number(id),
        role: roleData.role
      });
    }
    return api.put(`/admin/users/${id}/role`, roleData);
  },
};

export default api;
