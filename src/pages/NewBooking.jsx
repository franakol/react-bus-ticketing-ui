import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { scheduleService, bookingService, paymentService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';

const NewBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const queryParams = new URLSearchParams(location.search);
  const scheduleId = queryParams.get('scheduleId');
  
  const [schedule, setSchedule] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    seat_count: 1,
    passenger_name: currentUser?.full_name || '',
    passenger_phone: currentUser?.phone_number || '',
    passenger_email: currentUser?.email || '',
    special_requests: ''
  });
  const [paymentData, setPaymentData] = useState({
    payment_method: 'momo',
    momo_number: '',
    momo_name: ''
  });
  const [step, setStep] = useState(1); // 1: Booking details, 2: Payment details, 3: Confirmation
  const [submitting, setSubmitting] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!currentUser) {
      navigate('/login', { state: { message: 'Please login to make a booking', returnUrl: location.pathname + location.search } });
      return;
    }

    // Redirect to schedules if no schedule ID is provided
    if (!scheduleId) {
      navigate('/schedules');
      return;
    }

    const fetchScheduleDetails = async () => {
      try {
        setLoading(true);
        const response = await scheduleService.getScheduleById(scheduleId);
        setSchedule(response.data);
        
        // Fetch route details
        const routeResponse = await scheduleService.getSchedulesByRoute(response.data.route_id);
        if (routeResponse.data.length > 0) {
          const routeDetails = routeResponse.data[0].route || {};
          setRoute(routeDetails);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching schedule details:', err);
        setError('Failed to load schedule details. Please try again.');
        setLoading(false);
      }
    };

    fetchScheduleDetails();
  }, [scheduleId, currentUser, navigate, location]);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: name === 'seat_count' ? Math.max(1, parseInt(value) || 1) : value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    if (!schedule) return 0;
    return schedule.price * bookingData.seat_count;
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Validate booking data
      if (!bookingData.passenger_name || !bookingData.passenger_phone || !bookingData.passenger_email) {
        alert('Please fill in all required fields');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Validate payment data
      if (paymentData.payment_method === 'momo' && (!paymentData.momo_number || !paymentData.momo_name)) {
        alert('Please fill in all required payment fields');
        return;
      }
      handleSubmitBooking();
    }
  };

  const handlePreviousStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmitBooking = async () => {
    try {
      setSubmitting(true);
      
      // Create booking
      const bookingPayload = {
        schedule_id: schedule.id,
        seat_count: bookingData.seat_count,
        passenger_details: {
          name: bookingData.passenger_name,
          phone: bookingData.passenger_phone,
          email: bookingData.passenger_email
        },
        special_requests: bookingData.special_requests,
        total_amount: calculateTotal()
      };
      
      const bookingResponse = await bookingService.createBooking(bookingPayload);
      
      // Process payment
      const paymentPayload = {
        booking_id: bookingResponse.data.id,
        amount: calculateTotal(),
        payment_method: paymentData.payment_method,
        payment_details: {
          momo_number: paymentData.momo_number,
          momo_name: paymentData.momo_name
        }
      };
      
      const paymentResponse = await paymentService.processPayment(paymentPayload);
      
      // Set confirmation data
      setBookingConfirmation({
        booking: bookingResponse.data,
        payment: paymentResponse.data
      });
      
      setStep(3);
      setSubmitting(false);
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to process your booking. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-light">Loading schedule details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-900/20 border border-red-800">
        <p className="text-red-400">{error}</p>
        <Button 
          variant="primary" 
          className="mt-4" 
          onClick={() => navigate('/schedules')}
        >
          Back to Schedules
        </Button>
      </Card>
    );
  }

  if (!schedule) {
    return (
      <Card>
        <p className="text-gray-400 text-center py-4">
          Schedule not found. Please select another schedule.
        </p>
        <Button 
          variant="primary" 
          className="mt-4" 
          onClick={() => navigate('/schedules')}
        >
          Back to Schedules
        </Button>
      </Card>
    );
  }

  const departureDate = new Date(schedule.departure_time);
  const arrivalDate = new Date(schedule.arrival_time);

  return (
    <div>
      <h1 className="text-3xl font-bold text-light mb-6">Book Your Trip</h1>
      
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary' : 'bg-gray-700'} text-white font-bold`}>1</div>
        <div className={`w-20 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-700'}`}></div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary' : 'bg-gray-700'} text-white font-bold`}>2</div>
        <div className={`w-20 h-1 ${step >= 3 ? 'bg-primary' : 'bg-gray-700'}`}></div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary' : 'bg-gray-700'} text-white font-bold`}>3</div>
      </div>
      
      {/* Trip Summary */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Trip Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 mb-1">Route</p>
            <p className="text-light font-medium">{route?.origin} to {route?.destination}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Bus</p>
            <p className="text-light font-medium">{schedule.bus_name || 'Standard Bus'}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Departure</p>
            <p className="text-light font-medium">
              {departureDate.toLocaleDateString()}, {departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Arrival</p>
            <p className="text-light font-medium">
              {arrivalDate.toLocaleDateString()}, {arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Price per seat</p>
            <p className="text-secondary font-medium">{schedule.price.toLocaleString()} RWF</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Available seats</p>
            <p className="text-light font-medium">{schedule.available_seats} seats</p>
          </div>
        </div>
      </Card>
      
      {step === 1 && (
        <Card>
          <h2 className="text-xl font-semibold text-primary mb-4">Booking Details</h2>
          <div className="space-y-4">
            <Input
              label="Number of Seats"
              type="number"
              id="seat_count"
              name="seat_count"
              value={bookingData.seat_count}
              onChange={handleBookingChange}
              min="1"
              max={schedule.available_seats}
              required
            />
            
            <Input
              label="Passenger Name"
              type="text"
              id="passenger_name"
              name="passenger_name"
              value={bookingData.passenger_name}
              onChange={handleBookingChange}
              placeholder="Enter passenger name"
              required
            />
            
            <Input
              label="Phone Number"
              type="tel"
              id="passenger_phone"
              name="passenger_phone"
              value={bookingData.passenger_phone}
              onChange={handleBookingChange}
              placeholder="Enter phone number"
              required
            />
            
            <Input
              label="Email"
              type="email"
              id="passenger_email"
              name="passenger_email"
              value={bookingData.passenger_email}
              onChange={handleBookingChange}
              placeholder="Enter email address"
              required
            />
            
            <div className="mb-4">
              <label htmlFor="special_requests" className="block text-light font-medium mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                id="special_requests"
                name="special_requests"
                value={bookingData.special_requests}
                onChange={handleBookingChange}
                placeholder="Any special requests or requirements"
                className="input w-full h-24"
              />
            </div>
            
            <div className="bg-dark/50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-light">Price per seat:</span>
                <span className="text-secondary">{schedule.price.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-light">Number of seats:</span>
                <span className="text-secondary">{bookingData.seat_count}</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-700">
                <span className="text-light font-bold">Total amount:</span>
                <span className="text-secondary font-bold">{calculateTotal().toLocaleString()} RWF</span>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button
                variant="primary"
                onClick={handleNextStep}
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {step === 2 && (
        <Card>
          <h2 className="text-xl font-semibold text-primary mb-4">Payment Details</h2>
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-light font-medium mb-2">Payment Method</label>
              <div className="flex flex-col space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    value="momo"
                    checked={paymentData.payment_method === 'momo'}
                    onChange={handlePaymentChange}
                    className="text-primary"
                  />
                  <span className="text-light">MTN Mobile Money</span>
                </label>
              </div>
            </div>
            
            {paymentData.payment_method === 'momo' && (
              <div className="space-y-4 p-4 border border-gray-700 rounded-md">
                <Input
                  label="Mobile Money Number"
                  type="tel"
                  id="momo_number"
                  name="momo_number"
                  value={paymentData.momo_number}
                  onChange={handlePaymentChange}
                  placeholder="Enter your MTN MoMo number (e.g., 078XXXXXXX)"
                  required
                />
                
                <Input
                  label="Name on Mobile Money Account"
                  type="text"
                  id="momo_name"
                  name="momo_name"
                  value={paymentData.momo_name}
                  onChange={handlePaymentChange}
                  placeholder="Enter the name registered with your MoMo account"
                  required
                />
                
                <div className="bg-yellow-900/20 border border-yellow-800 rounded-md p-3 text-sm text-yellow-400">
                  <p>You will receive a prompt on your phone to confirm the payment of {calculateTotal().toLocaleString()} RWF.</p>
                </div>
              </div>
            )}
            
            <div className="bg-dark/50 p-4 rounded-md mt-6">
              <div className="flex justify-between items-center">
                <span className="text-light font-bold">Total amount to pay:</span>
                <span className="text-secondary font-bold">{calculateTotal().toLocaleString()} RWF</span>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button
                variant="secondary"
                onClick={handlePreviousStep}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleNextStep}
                disabled={submitting}
              >
                {submitting ? <LoadingSpinner size="small" /> : 'Complete Payment'}
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {step === 3 && bookingConfirmation && (
        <Card>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-primary">Booking Confirmed!</h2>
            <p className="text-gray-400 mt-2">Your booking has been successfully processed.</p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-dark/50 p-4 rounded-md">
              <h3 className="text-lg font-semibold text-light mb-3">Booking Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-400 text-sm">Booking Reference</p>
                  <p className="text-light font-medium">{bookingConfirmation.booking.booking_reference}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="text-green-400 font-medium">{bookingConfirmation.booking.status}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Passenger</p>
                  <p className="text-light font-medium">{bookingData.passenger_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Seats</p>
                  <p className="text-light font-medium">{bookingData.seat_count}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Amount</p>
                  <p className="text-secondary font-medium">{calculateTotal().toLocaleString()} RWF</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Payment Status</p>
                  <p className="text-green-400 font-medium">{bookingConfirmation.payment.status}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-dark/50 p-4 rounded-md">
              <h3 className="text-lg font-semibold text-light mb-3">Trip Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-400 text-sm">Route</p>
                  <p className="text-light font-medium">{route?.origin} to {route?.destination}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Bus</p>
                  <p className="text-light font-medium">{schedule.bus_name || 'Standard Bus'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Departure</p>
                  <p className="text-light font-medium">
                    {departureDate.toLocaleDateString()}, {departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Arrival</p>
                  <p className="text-light font-medium">
                    {arrivalDate.toLocaleDateString()}, {arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-800 rounded-md p-4 text-sm text-blue-400">
              <p>A confirmation email has been sent to {bookingData.passenger_email} with all the details of your booking.</p>
              <p className="mt-2">Please arrive at the bus station at least 30 minutes before departure time.</p>
            </div>
            
            <div className="flex justify-center mt-6 space-x-4">
              <Button
                variant="secondary"
                onClick={() => navigate('/bookings')}
              >
                View My Bookings
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default NewBooking;
