import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { scheduleService, routeService } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const Schedules = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const routeIdFromUrl = queryParams.get('routeId');
  
  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    date: '',
    origin: '',
    destination: '',
    routeId: routeIdFromUrl || ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch routes first to get route details
        const routesResponse = await routeService.getAllRoutes();
        const routesMap = {};
        routesResponse.data.forEach(route => {
          routesMap[route.id] = route;
        });
        setRoutes(routesMap);
        
        // Then fetch schedules
        const schedulesResponse = await scheduleService.getAllSchedules();
        setSchedules(schedulesResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load schedules. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      date: '',
      origin: '',
      destination: ''
    });
  };

  const filteredSchedules = schedules.filter(schedule => {
    const route = routes[schedule.route_id];
    if (!route) return false;
    
    const matchesDate = !filters.date || new Date(schedule.departure_time).toLocaleDateString() === new Date(filters.date).toLocaleDateString();
    const matchesOrigin = !filters.origin || route.origin.toLowerCase().includes(filters.origin.toLowerCase());
    const matchesDestination = !filters.destination || route.destination.toLowerCase().includes(filters.destination.toLowerCase());
    const matchesRouteId = !filters.routeId || schedule.route_id === Number(filters.routeId);
    
    return matchesDate && matchesOrigin && matchesDestination && matchesRouteId;
  });

  // Get unique origins and destinations for filter dropdowns
  const uniqueOrigins = [...new Set(Object.values(routes).map(route => route.origin))];
  const uniqueDestinations = [...new Set(Object.values(routes).map(route => route.destination))];

  return (
    <div>
      <h1 className="text-3xl font-bold text-light mb-6">Bus Schedules</h1>
      
      {/* Filters */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold text-light mb-4">Filter Schedules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Departure Date</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="input w-full"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Origin</label>
            <select
              name="origin"
              value={filters.origin}
              onChange={handleFilterChange}
              className="input w-full"
            >
              <option value="">All Origins</option>
              {uniqueOrigins.map((origin, index) => (
                <option key={index} value={origin}>{origin}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Destination</label>
            <select
              name="destination"
              value={filters.destination}
              onChange={handleFilterChange}
              className="input w-full"
            >
              <option value="">All Destinations</option>
              {uniqueDestinations.map((destination, index) => (
                <option key={index} value={destination}>{destination}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button
            variant="secondary"
            onClick={resetFilters}
            className="text-sm"
          >
            Reset Filters
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="py-12 text-center">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <Card className="bg-red-900/20 border border-red-800">
          <p className="text-red-400">{error}</p>
        </Card>
      ) : filteredSchedules.length === 0 ? (
        <Card>
          <p className="text-gray-400 text-center py-4">
            No schedules found matching your criteria.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSchedules.map((schedule) => {
            const route = routes[schedule.route_id];
            if (!route) return null;
            
            const departureDate = new Date(schedule.departure_time);
            const arrivalDate = new Date(schedule.arrival_time);
            
            return (
              <Card key={schedule.id} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-3">
                      <div className="bg-primary/20 text-primary rounded-full p-1 mr-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-primary">
                        {route.origin} to {route.destination}
                      </h3>
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
                        <p className="text-gray-400">Bus</p>
                        <p className="text-light font-medium">{schedule.bus_name || 'Standard Bus'}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-400">Available Seats</p>
                        <p className="text-light font-medium">{schedule.available_seats} seats</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-between border-t pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-6 md:ml-6">
                    <div className="text-right mb-4">
                      <p className="text-gray-400 text-sm">Price per seat</p>
                      <p className="text-secondary text-2xl font-bold">{schedule.price.toLocaleString()} RWF</p>
                    </div>
                    
                    <Link to={`/bookings/new?scheduleId=${schedule.id}`}>
                      <Button variant="primary" fullWidth>
                        Book Now
                      </Button>
                    </Link>
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

export default Schedules;
