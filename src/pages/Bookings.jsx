import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!currentUser) {
      navigate('/login', { state: { message: 'Please login to view your bookings' } });
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await bookingService.getUserBookings();
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings. Please try again later.');
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser, navigate]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      // Remove the cancelled booking from state
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-900/30 text-green-400 border border-green-800';
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-400 border border-yellow-800';
      case 'cancelled':
        return 'bg-red-900/30 text-red-400 border border-red-800';
      case 'completed':
        return 'bg-blue-900/30 text-blue-400 border border-blue-800';
      default:
        return 'bg-gray-900/30 text-gray-400 border border-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-light">My Bookings</h1>
        <Link to="/schedules">
          <Button variant="primary">Book New Trip</Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <Card className="bg-red-900/20 border border-red-800">
          <p className="text-red-400">{error}</p>
        </Card>
      ) : bookings.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <h3 className="text-xl font-semibold text-light mb-2">No bookings found</h3>
            <p className="text-gray-400 mb-6">You haven't made any bookings yet.</p>
            <Link to="/schedules">
              <Button variant="primary">Book Your First Trip</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const departureDate = new Date(booking.schedule.departure_time);
            const arrivalDate = new Date(booking.schedule.arrival_time);
            
            return (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-primary">
                        {booking.schedule.route.origin} to {booking.schedule.route.destination}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Departure</p>
                        <p className="text-light font-medium">
                          {departureDate.toLocaleDateString()}, {departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-400">Arrival</p>
                        <p className="text-light font-medium">
                          {arrivalDate.toLocaleDateString()}, {arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-400">Booking ID</p>
                        <p className="text-light font-medium">{booking.booking_reference}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-400">Seats</p>
                        <p className="text-light font-medium">{booking.seat_count} seats</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-between border-t pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-6 md:ml-6">
                    <div className="text-right mb-4">
                      <p className="text-gray-400 text-sm">Total Amount</p>
                      <p className="text-secondary text-2xl font-bold">{booking.total_amount.toLocaleString()} RWF</p>
                      <p className="text-gray-400 text-xs">
                        {booking.payment_status === 'paid' ? 'Paid' : 'Payment Pending'}
                      </p>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Link to={`/bookings/${booking.id}`}>
                        <Button variant="primary" fullWidth className="text-sm">
                          View Details
                        </Button>
                      </Link>
                      
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <Button 
                          variant="accent" 
                          fullWidth 
                          className="text-sm"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookings;
