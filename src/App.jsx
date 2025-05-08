import { BrowserRouter as Router, Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout and Components
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RoutesPage from './pages/Routes';
import Schedules from './pages/Schedules';
import Bookings from './pages/Bookings';
import NewBooking from './pages/NewBooking';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { currentUser, loading, isAdmin } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!currentUser || !isAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <RouterRoutes>
          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="schedules" element={<Schedules />} />
            
            {/* Protected Routes */}
            <Route path="bookings" element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            } />
            <Route path="bookings/new" element={
              <ProtectedRoute>
                <NewBooking />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="admin/*" element={
              <AdminRoute>
                <div>Admin Dashboard - To be implemented</div>
              </AdminRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={
              <div className="text-center py-20">
                <h2 className="text-3xl font-bold text-light mb-4">Page Not Found</h2>
                <p className="text-gray-400">The page you are looking for does not exist.</p>
              </div>
            } />
          </Route>
        </RouterRoutes>
      </AuthProvider>
    </Router>
  );
}

export default App;
