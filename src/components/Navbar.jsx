import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-dark border-b border-gray-700">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">BusTicket</Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/routes" className="text-light hover:text-primary transition-colors">Routes</Link>
            <Link to="/schedules" className="text-light hover:text-primary transition-colors">Schedules</Link>
            
            {currentUser ? (
              <>
                <Link to="/bookings" className="text-light hover:text-primary transition-colors">My Bookings</Link>
                {isAdmin && (
                  <Link to="/admin" className="text-light hover:text-primary transition-colors">Admin</Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-secondary">{currentUser.email}</span>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-accent text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn btn-primary text-sm">Login</Link>
                <Link to="/register" className="btn btn-secondary text-sm">Register</Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-light focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link 
              to="/routes" 
              className="block text-light hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Routes
            </Link>
            <Link 
              to="/schedules" 
              className="block text-light hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Schedules
            </Link>
            
            {currentUser ? (
              <>
                <Link 
                  to="/bookings" 
                  className="block text-light hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="block text-light hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <div className="pt-2 border-t border-gray-700">
                  <span className="block text-secondary mb-2">{currentUser.email}</span>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-accent text-sm w-full"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-2 border-t border-gray-700 space-y-2">
                <Link 
                  to="/login" 
                  className="btn btn-primary text-sm block text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-secondary text-sm block text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
